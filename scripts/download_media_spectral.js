/*
  Download high‑resolution media for Spectral Subjects, without PowerShell.
  - Reads TSV column 'Nom du projet' and 'Lien / Média'
  - Filters only the row 'Spectral Subjects'
  - Crawls same-domain pages (limited) to find hi‑res assets (prefer .tif/.tiff)
  - Downloads best candidate into site/media/spectral-subjects
  - Updates site/media/index.js mapping
*/

'use strict';

const fs = require('fs');
const path = require('path');
const axios = require('axios').default;
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const { CookieJar } = require('tough-cookie');
const { wrapper } = require('axios-cookiejar-support');

(async () => {
  const TSV_PATH = path.join(process.cwd(), 'Projets_Hugo_Daoust.xlsx - Projets_Hugo_Daoust__with_instagram.tsv');
  const MEDIA_ROOT = path.join(process.cwd(), 'site', 'media');
  const SLUG = 'spectral-subjects';
  const PROJECT_NAME = 'Spectral Subjects';
  const TARGET_DIR = path.join(MEDIA_ROOT, SLUG);

  const MAX_PAGES_TO_VISIT = 8;
  const MAX_DEPTH = 2;
  const MAX_IMAGE_HEAD_CHECK = 12;

  const ensureDir = (p) => { if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }); };
  ensureDir(MEDIA_ROOT);
  ensureDir(TARGET_DIR);

  if (!fs.existsSync(TSV_PATH)) {
    throw new Error(`TSV introuvable: ${TSV_PATH}`);
  }

  const tsvBuf = fs.readFileSync(TSV_PATH);
  let tsvText = tsvBuf.toString('utf8');
  if (/Ã|Â|ð|ÿ/.test(tsvText)) tsvText = iconv.decode(tsvBuf, 'latin1');
  const lines = tsvText.split(/\r?\n/).filter(Boolean);
  const header = lines.shift();
  const columns = header.split('\t');
  const findColumnIndex = (name) => columns.findIndex(c => (c || '').trim().toLowerCase() === name.trim().toLowerCase());
  const idxProject = findColumnIndex('Nom du projet');
  const idxMedia = findColumnIndex('Lien / Média');
  if (idxProject < 0 || idxMedia < 0) {
    throw new Error('Colonnes manquantes: "Nom du projet" et/ou "Lien / Média"');
  }

  const row = lines
    .map(l => l.split('\t'))
    .find(arr => (arr[idxProject] || '').trim().toLowerCase() === PROJECT_NAME.toLowerCase());

  if (!row) {
    console.log('Ligne non trouvée pour Spectral Subjects. Rien à faire.');
    return;
  }

  const mediaField = (row[idxMedia] || '').trim();
  const seedUrls = mediaField
    .split(/[ ,;|]+/)
    .map(s => s.trim())
    .filter(u => /^https?:\/\//i.test(u));

  if (!seedUrls.length) {
    console.log('Aucun lien dans la colonne "Lien / Média" pour Spectral Subjects.');
    return;
  }

  const jar = new CookieJar();
  const http = wrapper(axios.create({
    jar,
    timeout: 30000,
    maxRedirects: 5,
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36' }
  }));

  const sameDomain = (base, u) => {
    try { const bu = new URL(base); const uu = new URL(u, bu); return bu.hostname === uu.hostname; } catch { return false; }
  };

  const toAbsolute = (base, rel) => {
    try { return new URL(rel, base).toString(); } catch { return rel; }
  };

  const scoreFileExt = (urlStr) => {
    let score = 0;
    let ext = '';
    try {
      const u = new URL(urlStr);
      const filenameParam = new URLSearchParams(u.search).get('filename');
      const name = filenameParam || path.basename(u.pathname);
      ext = path.extname(name).toLowerCase();
    } catch {}

    if (ext === '.tif' || ext === '.tiff') score += 100;
    else if (ext === '.png') score += 60;
    else if (ext === '.jpg' || ext === '.jpeg') score += 50;
    else if (ext === '.webp') score += 40;
    else if (ext === '.gif') score += 10;

    return score;
  };

  const scoreHeuristics = (urlStr) => {
    let score = 0;
    const s = urlStr.toLowerCase();
    if (s.includes('tifdownload') || s.includes('download')) score += 40;
    if (s.includes('image_sets')) score += 35;
    if (s.includes('spectral') || s.includes('subjects')) score += 25;
    if (s.includes('montreal_2025') || s.includes('jacksonville')) score += 10;
    if (/(high|hi|full|large|orig|master)\b/.test(s)) score += 15;
    return score;
  };

  const extractFromHtml = (html, baseUrl) => {
    const $ = cheerio.load(html);
    const imageCandidates = new Set();
    const pageCandidates = new Set();

    $('meta[property="og:image"], meta[name="og:image"], meta[name="twitter:image"]').each((_, el) => {
      const c = $(el).attr('content');
      if (c) imageCandidates.add(toAbsolute(baseUrl, c));
    });

    $('img[src]').each((_, el) => {
      imageCandidates.add(toAbsolute(baseUrl, $(el).attr('src')));
    });

    $('img[srcset]').each((_, el) => {
      const srcset = $(el).attr('srcset') || '';
      srcset.split(',').map(s => s.trim().split(' ')[0]).forEach(s => { if (s) imageCandidates.add(toAbsolute(baseUrl, s)); });
    });

    $('a[href]').each((_, el) => {
      const href = $(el).attr('href');
      if (!href) return;
      const abs = toAbsolute(baseUrl, href);
      if (!sameDomain(baseUrl, abs)) return;
      if (/\.(pdf|svg|mp4|mov)(?:[?#]|$)/i.test(abs)) return;
      // Only keep relevant looking subpages to limit crawl
      if (/(spectral|subject|image_sets|download|tif|gallery)/i.test(abs)) {
        pageCandidates.add(abs);
      }
      // Direct file links in anchors
      if (/(tif|tiff|jpg|jpeg|png|webp)(?:[?#]|$)/i.test(abs)) {
        imageCandidates.add(abs);
      }
    });

    const images = Array.from(imageCandidates);
    const pages = Array.from(pageCandidates);
    return { images, pages };
  };

  const visited = new Set();
  const pageQueue = [];
  for (const u of seedUrls) pageQueue.push({ url: u, depth: 0 });

  const imageCandidates = [];

  while (pageQueue.length && visited.size < MAX_PAGES_TO_VISIT) {
    const { url, depth } = pageQueue.shift();
    if (visited.has(url)) continue;
    visited.add(url);

    try {
      const res = await http.get(url, { responseType: 'arraybuffer' });
      let html = iconv.decode(Buffer.from(res.data), 'utf8');
      if (!/<!DOCTYPE|<html[\s>]/i.test(html)) {
        // Not HTML, skip
        continue;
      }
      const { images, pages } = extractFromHtml(html, url);

      for (const imgUrl of images) {
        const baseScore = scoreFileExt(imgUrl) + scoreHeuristics(imgUrl);
        imageCandidates.push({ url: imgUrl, fromUrl: url, baseScore });
      }

      if (depth < MAX_DEPTH) {
        for (const next of pages) {
          if (!visited.has(next)) pageQueue.push({ url: next, depth: depth + 1 });
        }
      }

      // Early stop if we already have a strong TIF candidate
      const hasTif = imageCandidates.some(c => /(\.tif{1,2})(?:[?#]|$)/i.test(c.url) || /tifdownload/i.test(c.url));
      if (hasTif) break;
    } catch (e) {
      // continue
    }
  }

  if (!imageCandidates.length) {
    console.log('Aucune image candidate trouvée.');
    return;
  }

  // HEAD/GET small checks to estimate size for top candidates
  const byHeuristic = [...imageCandidates]
    .sort((a, b) => b.baseScore - a.baseScore)
    .slice(0, MAX_IMAGE_HEAD_CHECK);

  const sizeChecked = [];
  for (const c of byHeuristic) {
    try {
      // Prefer HEAD, fallback to GET if not allowed
      let size = 0, contentType = '';
      try {
        const head = await http.head(c.url, { headers: { Referer: c.fromUrl } });
        contentType = (head.headers['content-type'] || '').toLowerCase();
        size = parseInt(head.headers['content-length'] || '0', 10) || 0;
      } catch {
        const get = await http.get(c.url, { responseType: 'stream', headers: { Referer: c.fromUrl } });
        contentType = (get.headers['content-type'] || '').toLowerCase();
        size = parseInt(get.headers['content-length'] || '0', 10) || 0;
        if (get.data && typeof get.data.destroy === 'function') get.data.destroy();
      }
      const typeBonus = /tif/.test(contentType) ? 40 : 0;
      sizeChecked.push({ ...c, size, contentType, score: c.baseScore + typeBonus + Math.min(50, Math.floor(size / (200 * 1024))) });
    } catch {
      sizeChecked.push({ ...c, size: 0, contentType: '', score: c.baseScore });
    }
  }

  sizeChecked.sort((a, b) => b.score - a.score);
  const best = sizeChecked[0];
  if (!best) {
    console.log('Impossible d’identifier un meilleur fichier.');
    return;
  }

  const referrer = best.fromUrl || seedUrls[0];
  let finalName = 'downloaded';
  try {
    const u = new URL(best.url);
    const filenameParam = new URLSearchParams(u.search).get('filename');
    finalName = filenameParam || path.basename(u.pathname) || 'downloaded';
  } catch {}
  finalName = finalName.replace(/[^A-Za-z0-9._-]/g, '_');
  if (!path.extname(finalName)) finalName += '.bin';

  const destPath = path.join(TARGET_DIR, finalName);

  if (!fs.existsSync(destPath)) {
    const resp = await http.get(best.url, { responseType: 'arraybuffer', headers: { Referer: referrer } });
    fs.writeFileSync(destPath, Buffer.from(resp.data));
  }

  // Update site/media/index.js
  const indexJsPath = path.join(MEDIA_ROOT, 'index.js');
  const rel = ['media', SLUG, finalName].join('/');

  let mapping = {};
  if (fs.existsSync(indexJsPath)) {
    const raw = fs.readFileSync(indexJsPath, 'utf8');
    const m = raw.match(/window\.projectMedia\s*=\s*(\{[\s\S]*\})\s*;?/);
    if (m) {
      try { mapping = JSON.parse(m[1]); } catch { mapping = {}; }
    }
  }
  if (!mapping[SLUG]) mapping[SLUG] = [];
  if (!mapping[SLUG].includes(rel)) mapping[SLUG].push(rel);

  const jsOut = 'window.projectMedia = ' + JSON.stringify(mapping) + ';';
  fs.writeFileSync(indexJsPath, jsOut, 'utf8');

  console.log('Téléchargement terminé:', rel);
})();
