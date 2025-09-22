'use strict';

const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

(async () => {
  const TSV_PATH = path.join(process.cwd(), 'Projets_Hugo_Daoust.xlsx - Projets_Hugo_Daoust__with_instagram.tsv');
  const MEDIA_ROOT = path.join(process.cwd(), 'site', 'media');
  const MIN_WIDTH = 500;

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

  const requestPartial = (urlStr, headers = {}, byteLimit = 262144, redirects = 0) => new Promise((resolve, reject) => {
    if (redirects > 6) return reject(new Error('Trop de redirections'));
    const u = new URL(urlStr);
    const client = u.protocol === 'https:' ? https : http;
    const options = {
      method: 'GET',
      headers: Object.assign({ 'User-Agent': 'Mozilla/5.0', Range: `bytes=0-${byteLimit-1}` }, headers)
    };
    const req = client.request(u, options, (res) => {
      const status = res.statusCode || 0;
      if ([301,302,303,307,308].includes(status) && res.headers.location) {
        const next = new URL(res.headers.location, u).toString();
        res.resume();
        return resolve(requestPartial(next, headers, byteLimit, redirects + 1));
      }
      if (status >= 400) {
        res.resume();
        return reject(new Error('HTTP ' + status));
      }
      const chunks = [];
      let total = 0;
      res.on('data', (c) => {
        const b = Buffer.isBuffer(c) ? c : Buffer.from(c);
        chunks.push(b);
        total += b.length;
        if (total >= byteLimit) {
          try { req.destroy(); } catch {}
        }
      });
      res.on('end', () => {
        resolve({ data: Buffer.concat(chunks), headers: res.headers });
      });
    });
    req.on('error', reject);
    req.end();
  });

  const requestBuffer = (urlStr, headers = {}, redirects = 0) => new Promise((resolve, reject) => {
    if (redirects > 6) return reject(new Error('Trop de redirections'));
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

  function probePngDimensions(buf) {
    if (buf.length < 24) return null;
    const sig = '89504e470d0a1a0a';
    if (buf.slice(0, 8).toString('hex') !== sig) return null;
    const chunkType = buf.slice(12, 16).toString('ascii');
    if (chunkType !== 'IHDR') return null;
    const width = buf.readUInt32BE(16);
    const height = buf.readUInt32BE(20);
    return { width, height };
  }

  function probeJpegDimensions(buf) {
    let i = 0;
    if (buf.length < 4 || buf[0] !== 0xFF || buf[1] !== 0xD8) return null;
    i = 2;
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xFF) { i++; continue; }
      const marker = buf[i + 1];
      if ((marker >= 0xC0 && marker <= 0xC3) || (marker >= 0xC5 && marker <= 0xC7) || (marker >= 0xC9 && marker <= 0xCB) || (marker >= 0xCD && marker <= 0xCF)) {
        const blockLength = buf.readUInt16BE(i + 2);
        if (i + 2 + blockLength > buf.length) return null;
        const height = buf.readUInt16BE(i + 5);
        const width = buf.readUInt16BE(i + 7);
        return { width, height };
      } else {
        const blockLength = buf.readUInt16BE(i + 2);
        i += 2 + blockLength;
      }
    }
    return null;
  }

  async function probeImageWidth(url) {
    try {
      const r = await requestPartial(url, { Referer: url }, 262144);
      const ct = String(r.headers['content-type'] || '').toLowerCase();
      if (ct.includes('gif') || /\.gif(?:[?#]|$)/i.test(url)) return 0;
      const b = r.data;
      if (!b || !b.length) return 0;
      const png = probePngDimensions(b);
      if (png) return png.width;
      const jpg = probeJpegDimensions(b);
      if (jpg) return jpg.width;
      if (ct.includes('tif') || /\.(tif|tiff)(?:[?#]|$)/i.test(url)) return 10000;
      if (ct.includes('webp') || /\.webp(?:[?#]|$)/i.test(url)) return 10000;
      return 0;
    } catch {
      return 0;
    }
  }

  const largeHint = /(\b(l|large|xl|xxl|hd|1080|1920|2048|2560|3840|4k|full|master|original)\b|_l\b)/i;
  const smallHint = /(\b(t|tiny|small|thumb|thumbnail)\b|_t\b)/i;
  const badName = /(sprite|favicon|apple-touch-icon|mask-icon|site-icon|icon|logo|thumbnail|thumb|small|tiny|emoji|wp-emoji|\.svg)(?:[?#]|$)/i;

  const extractImageCandidates = (text, baseUrl) => {
    const map = new Map(); // url -> { widthHint, score }

    const add = (u, widthHint = 0, extraScore = 0) => {
      const prev = map.get(u) || { widthHint: 0, score: 0 };
      map.set(u, { widthHint: Math.max(prev.widthHint, widthHint), score: prev.score + extraScore });
    };

    // metas
    findAll(text, /<meta[^>]+(?:property|name)\s*=\s*"(?:og:image:secure_url|og:image|twitter:image)"[^>]*>/gi)
      .forEach(tag => {
        const m = /content\s*=\s*"([^"]+)"/i.exec(tag) || /content\s*=\s*'([^']+)'/i.exec(tag);
        if (m) add(toAbsolute(baseUrl, m[1]), 0, 10);
      });

    // href/src, data-*
    const hrefs = findAll(text, /(?:href|src)\s*=\s*"([^"]+)"/gi).map(m => m[1])
      .concat(findAll(text, /(?:href|src)\s*=\s*'([^']+)'/gi).map(m => m[1]));
    const datas = findAll(text, /data-(?:src|image|href|large|orig|original)\s*=\s*"([^"]+)"/gi).map(m => m[1])
      .concat(findAll(text, /data-(?:src|image|href|large|orig|original)\s*=\s*'([^']+)'/gi).map(m => m[1]));
    for (const rel of [...hrefs, ...datas]) add(toAbsolute(baseUrl, rel), 0, 0);

    // srcset with widths
    const srcsets = findAll(text, /srcset\s*=\s*"([^"]+)"/gi).map(m => m[1])
      .concat(findAll(text, /srcset\s*=\s*'([^']+)'/gi).map(m => m[1]));
    for (const s of srcsets) {
      s.split(',').forEach(token => {
        const [u, desc] = token.trim().split(/\s+/);
        const abs = toAbsolute(baseUrl, u);
        let hint = 0;
        if (desc && /\d+w/i.test(desc)) { const m = /(\d+)w/i.exec(desc); if (m) hint = parseInt(m[1], 10); }
        add(abs, hint, hint / 50);
      });
    }

    // inline URLs
    findAll(text, /https?:\/\/[A-Za-z0-9_\-\.\/\%\?\=\&]+\.(?:jpg|jpeg|png|webp|tif|tiff)(?:[?#][^"'\s>]*)?/gi)
      .forEach(m => add(m[0], 0, 0));

    // Filter + score
    const extOk = /\.(jpg|jpeg|png|webp|tif|tiff)(?:[?#]|$)/i;
    const results = [];
    for (const [u, meta] of map.entries()) {
      if (!extOk.test(u)) continue;
      if (badName.test(u) || smallHint.test(u)) continue;
      if (/\.gif(?:[?#]|$)/i.test(u)) continue;
      let score = meta.score;
      if (sameDomain(baseUrl, u)) score += 20;
      if (/image_sets\//i.test(u)) score += 40;
      if (/tifdownload\.php/i.test(u) || /\.(tif|tiff)(?:[?#]|$)/i.test(u)) score += 60;
      if (largeHint.test(u)) score += 20;
      results.push({ url: u, widthHint: meta.widthHint || 0, score });
    }

    return results.sort((a, b) => (b.score - a.score) || ((b.widthHint || 0) - (a.widthHint || 0)));
  };

  // Load existing mapping
  const indexJsPath = path.join(MEDIA_ROOT, 'index.js');
  let mapping = {};
  if (fs.existsSync(indexJsPath)) {
    const raw = fs.readFileSync(indexJsPath, 'utf8');
    const m = raw.match(/window\.projectMedia\s*=\s*(\{[\s\S]*\})\s*;?/);
    if (m) { try { mapping = JSON.parse(m[1]); } catch { mapping = {}; } }
  }

  const rows = lines.map(l => l.split('\t'));
  for (const row of rows) {
    const title = (row[idxTitle] || '').trim();
    const mediaField = (row[idxMedia] || '').trim();
    if (!title || !mediaField) continue;

    const slug = slugify(title);
    const projectDir = path.join(MEDIA_ROOT, slug);
    ensureDir(projectDir);

    // Only proceed if no qualifying image exists yet
    const existing = fs.existsSync(projectDir) ? fs.readdirSync(projectDir) : [];
    let hasQualifying = false;
    for (const f of existing) {
      if (/\.gif$/i.test(f)) continue;
      if (!/\.(jpg|jpeg|png|webp|tif|tiff)$/i.test(f)) continue;
      if (smallHint.test(f) || badName.test(f)) continue;
      try {
        const b = fs.readFileSync(path.join(projectDir, f));
        const png = probePngDimensions(b);
        const jpg = !png ? probeJpegDimensions(b) : null;
        let w = 0;
        if (png) w = png.width; else if (jpg) w = jpg.width; else if (/\.(tif|tiff)$/i.test(f)) w = 10000;
        if (w >= MIN_WIDTH) { hasQualifying = true; break; }
      } catch {}
    }
    if (hasQualifying) continue;

    const urls = mediaField.split(/[ ,;|]+/).filter(u => /^https?:\/\//i.test(u));
    if (!urls.length) continue;

    let candidates = [];
    for (const u of urls) {
      const text = await fetchText(u);
      if (!text) continue;
      candidates.push(...extractImageCandidates(text, u));
      if (candidates.length >= 300) break;
    }

    // Strictly enforce width >= MIN_WIDTH
    let chosen = null;
    for (const c of candidates) {
      if (/\.gif(?:[?#]|$)/i.test(c.url)) continue;
      if (badName.test(c.url) || smallHint.test(c.url)) continue;
      let width = c.widthHint || 0;
      if (width < MIN_WIDTH) width = await probeImageWidth(c.url);
      if (width >= MIN_WIDTH) { chosen = c.url; break; }
    }

    if (!chosen) continue;

    try {
      const r = await requestBuffer(chosen, { Referer: urls[0], 'User-Agent': 'Mozilla/5.0' });
      if (!r || !r.data || r.data.length < 128) continue;
      const urlObj = new URL(chosen);
      let name = path.basename(urlObj.pathname) || 'image.bin';
      name = name.replace(/[^A-Za-z0-9._-]/g, '_');
      if (!/\.(jpg|jpeg|png|webp|tif|tiff)$/i.test(name)) {
        const ct = String(r.headers['content-type'] || '').toLowerCase();
        if (ct.includes('png')) name += '.png';
        else if (ct.includes('webp')) name += '.webp';
        else if (ct.includes('tif')) name += '.tif';
        else name += '.jpg';
      }
      if (smallHint.test(name) || badName.test(name)) name = 'image_' + Date.now() + path.extname(name).toLowerCase();
      const dest = path.join(projectDir, name);
      fs.writeFileSync(dest, r.data);

      const rel = ['media', slug, name].join('/');
      if (!mapping[slug]) mapping[slug] = [];
      if (!mapping[slug].includes(rel)) mapping[slug].push(rel);
      console.log(`[${slug}] Saved (>=${MIN_WIDTH}px): ${rel}`);
    } catch {}
  }

  const out = 'window.projectMedia = ' + JSON.stringify(mapping) + ';';
  fs.writeFileSync(indexJsPath, out, 'utf8');
  console.log('Done: random images download with strict min width and icon/thumb exclusion.');
})();
