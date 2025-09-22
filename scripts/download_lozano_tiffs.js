'use strict';

const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

(async () => {
  const TSV_PATH = path.join(process.cwd(), 'Projets_Hugo_Daoust.xlsx - Projets_Hugo_Daoust__with_instagram.tsv');
  const MEDIA_ROOT = path.join(process.cwd(), 'site', 'media');

  const ensureDir = (p) => { if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }); };
  ensureDir(MEDIA_ROOT);

  if (!fs.existsSync(TSV_PATH)) { throw new Error('TSV introuvable: ' + TSV_PATH); }

  const tsvText = fs.readFileSync(TSV_PATH, 'utf8');
  const lines = tsvText.split(/\r?\n/).filter(Boolean);
  const header = lines.shift();
  const cols = header.split('\t');
  const colIndex = (name) => cols.findIndex(c => (c || '').trim().toLowerCase() === name.trim().toLowerCase());
  const idxTitle = colIndex('Nom du projet');
  const idxMedia = colIndex('Lien / Média');
  if (idxTitle < 0 || idxMedia < 0) throw new Error('Colonnes manquantes: Nom du projet / Lien / Média');

  const slugify = (s) => (s || '').normalize('NFKD').replace(/[^\p{L}0-9]+/gu,'-').replace(/^-+|-+$/g,'').toLowerCase() || ('item-' + Date.now());
  const toAbsolute = (base, rel) => { try { return new URL(rel, base).toString(); } catch { return rel; } };
  const sameDomain = (base, u) => { try { const bu = new URL(base); const uu = new URL(u, bu); return bu.hostname === uu.hostname; } catch { return false; } };

  let MAX_PAGES = 60;
  let MAX_DEPTH = 5;
  const MAX_PER_PROJECT = 3;

  const requestBuffer = (urlStr, headers = {}, redirects = 0) => new Promise((resolve, reject) => {
    if (redirects > 8) return reject(new Error('Trop de redirections'));
    const u = new URL(urlStr);
    const client = u.protocol === 'https:' ? https : http;
    const options = {
      method: 'GET',
      headers: Object.assign({ 'User-Agent': 'Mozilla/5.0' }, headers)
    };
    const req = client.request(u, options, (res) => {
      const status = res.statusCode || 0;
      if ([301,302,303,307,308].includes(status) && res.headers.location) {
        const next = new URL(res.headers.location, u).toString();
        res.resume();
        return resolve(requestBuffer(next, headers, redirects + 1));
      }
      if (status >= 400) {
        res.resume();
        return reject(new Error('HTTP ' + status));
      }
      const chunks = [];
      res.on('data', (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));
      res.on('end', () => {
        resolve({ data: Buffer.concat(chunks), headers: res.headers });
      });
    });
    req.on('error', reject);
    req.end();
  });

  const fetchText = async (url) => {
    try {
      const r = await requestBuffer(url, { Referer: url });
      const ctype = String(r.headers['content-type'] || '').toLowerCase();
      if (/^image\//.test(ctype) || /octet-stream/.test(ctype)) return '';
      return r.data.toString('utf8');
    } catch { return ''; }
  };

  const findAll = (str, regex) => {
    const out = [];
    let m;
    while ((m = regex.exec(str)) !== null) { out.push(m); }
    return out;
  };

  const deriveTifFromJpeg = (absUrl) => {
    try {
      const u = new URL(absUrl);
      if (!/image_sets\//i.test(u.pathname)) return null;
      const base = path.basename(u.pathname).replace(/\.(jpg|jpeg|png|webp)$/i, '');
      if (!base) return null;
      const tifName = base + '.tif';
      const idPath = u.pathname.replace(/^\/+/, '').replace(/\/(?:[^\/]+)$/,'/') + tifName;
      const params = new URLSearchParams({ id: idPath, filename: tifName });
      return u.origin + '/tifdownload.php?' + params.toString();
    } catch { return null; }
  };

  const extractCandidates = (text, baseUrl) => {
    const tiffLinks = new Set();
    const nextPages = new Set();

    const hrefs = findAll(text, /(?:href|src)\s*=\s*"([^"]+)"/gi).map(m => m[1])
      .concat(findAll(text, /(?:href|src)\s*=\s*'([^']+)'/gi).map(m => m[1]));
    const datas = findAll(text, /data-(?:src|image|href|large|orig|original)\s*=\s*"([^"]+)"/gi).map(m => m[1])
      .concat(findAll(text, /data-(?:src|image|href|large|orig|original)\s*=\s*'([^']+)'/gi).map(m => m[1]));
    const srcsets = findAll(text, /srcset\s*=\s*"([^"]+)"/gi).map(m => m[1])
      .concat(findAll(text, /srcset\s*=\s*'([^']+)'/gi).map(m => m[1]));
    const fromSrcset = [];
    for (const s of srcsets) {
      s.split(',').map(x => x.trim().split(/\s+/)[0]).forEach(u => { if (u) fromSrcset.push(u); });
    }
    const rawImageSets = findAll(text, /image_sets\/[A-Za-z0-9_\-/]+\.(?:jpg|jpeg|png|webp|tif|tiff)/gi).map(m => m[0]);

    const all = [...hrefs, ...datas, ...fromSrcset, ...rawImageSets];

    for (const h of all) {
      const abs = toAbsolute(baseUrl, h);
      if (/tifdownload\.php/i.test(abs) || /\.(tif|tiff)(?:[?#]|$)/i.test(abs)) {
        tiffLinks.add(abs);
      }
      if (/image_sets\//i.test(abs) && /\.(jpg|jpeg|png|webp)(?:[?#]|$)/i.test(abs)) {
        const derived = deriveTifFromJpeg(abs);
        if (derived) tiffLinks.add(derived);
      }
      if (sameDomain(baseUrl, abs) && (
        /(image_sets|download|spectral|subject|exhibitions|work|project)/i.test(abs) || /\.(js|css)(?:[?#]|$)/i.test(abs)
      ) && !/\.(pdf|svg|mp4|mov|zip)(?:[?#]|$)/i.test(abs)) {
        nextPages.add(abs);
      }
    }

    return { tiffLinks: Array.from(tiffLinks), nextPages: Array.from(nextPages) };
  };

  const rows = lines.map(l => l.split('\t'));

  for (const row of rows) {
    const title = (row[idxTitle] || '').trim();
    const mediaField = (row[idxMedia] || '').trim();
    if (!title || !mediaField) continue;

    const urls = mediaField.split(/[ ,;|]+/).filter(u => /^https?:\/\//i.test(u));
    const lozanoUrls = urls.filter(u => /(^|\.)lozano-hemmer\.com\b/i.test(u));
    if (!lozanoUrls.length) continue;

    const slug = slugify(title);
    const projectDir = path.join(MEDIA_ROOT, slug);
    ensureDir(projectDir);

    const visited = new Set();
    const queue = lozanoUrls.map(u => ({ url: u, depth: 0 }));
    const found = new Set();

    while (queue.length && visited.size < MAX_PAGES && found.size < MAX_PER_PROJECT) {
      const { url, depth } = queue.shift();
      if (visited.has(url)) continue;
      visited.add(url);

      const text = await fetchText(url);
      if (!text) continue;

      const { tiffLinks, nextPages } = extractCandidates(text, url);
      for (const t of tiffLinks) {
        found.add(JSON.stringify({ url: t, ref: url }));
        if (found.size >= MAX_PER_PROJECT) break;
      }
      if (depth < MAX_DEPTH) {
        for (const n of nextPages) {
          if (!visited.has(n)) queue.push({ url: n, depth: depth + 1 });
        }
      }
    }

    let downloaded = 0;
    for (const s of Array.from(found)) {
      if (downloaded >= MAX_PER_PROJECT) break;
      const { url, ref } = JSON.parse(s);
      let filename = 'file.tif';
      try {
        const u = new URL(url);
        const filenameParam = new URLSearchParams(u.search).get('filename');
        filename = filenameParam || path.basename(u.pathname) || 'file.tif';
      } catch {}
      filename = filename.replace(/[^A-Za-z0-9._-]/g,'_');
      if (!/\.(tif|tiff)$/i.test(filename)) filename += '.tif';

      const dest = path.join(projectDir, filename);
      if (fs.existsSync(dest)) { downloaded++; continue; }

      try {
        const r = await requestBuffer(url, { Referer: ref, 'User-Agent': 'Mozilla/5.0' });
        if (r && r.data && r.data.length > 256) {
          fs.writeFileSync(dest, Buffer.from(r.data));
          downloaded++;
          console.log(`[${slug}] TIFF:`, url, '->', dest);
        }
      } catch (e) {
        console.log(`[${slug}] Échec:`, url, '-', e.message);
      }
    }

    if (downloaded > 0) {
      console.log(`[${slug}] Téléchargements terminés: ${downloaded}`);
    }
  }

  console.log('Terminé. Parcours lozano-hemmer.com effectué.');
})();
