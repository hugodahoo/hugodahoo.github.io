'use strict';

const fs = require('fs');
const path = require('path');
const axios = require('axios').default;

(async () => {
  const MEDIA_ROOT = path.join(process.cwd(), 'site', 'media');
  const SLUG = 'spectral-subjects';
  const TARGET_DIR = path.join(MEDIA_ROOT, SLUG);

  const ensureDir = (p) => { if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }); };
  ensureDir(TARGET_DIR);

  const localJpgs = fs.existsSync(TARGET_DIR)
    ? fs.readdirSync(TARGET_DIR).filter(f => /\.(jpg|jpeg)$/i.test(f))
    : [];

  // Fallback: read from site/media/index.js mapping
  const indexJsPath = path.join(MEDIA_ROOT, 'index.js');
  let mapping = {};
  if (fs.existsSync(indexJsPath)) {
    const raw = fs.readFileSync(indexJsPath, 'utf8');
    const m = raw.match(/window\.projectMedia\s*=\s*(\{[\s\S]*\})\s*;?/);
    if (m) {
      try { mapping = JSON.parse(m[1]); } catch { mapping = {}; }
    }
  }

  const mappedJpgs = Array.isArray(mapping[SLUG])
    ? mapping[SLUG].map(s => path.basename(s)).filter(n => /\.(jpg|jpeg)$/i.test(n))
    : [];

  const bases = new Set();
  for (const f of localJpgs) bases.add(f.replace(/\.(jpg|jpeg)$/i, ''));
  for (const f of mappedJpgs) bases.add(f.replace(/\.(jpg|jpeg)$/i, ''));

  if (bases.size === 0) {
    console.log('Aucun JPEG trouvé localement ni dans index.js pour', SLUG);
    return;
  }

  const buildTifUrl = (basename) => {
    const m = basename.match(/^spectral_subjects_(?<subfolder>[a-z]+_\d{4})_/i);
    const subfolder = m && m.groups && m.groups.subfolder ? m.groups.subfolder.toLowerCase() : null;
    if (!subfolder) throw new Error('Sous-dossier introuvable dans le nom: ' + basename);
    const tifName = basename + '.tif';
    const idPath = `image_sets/spectral_subjects/${subfolder}/${tifName}`;
    const params = new URLSearchParams({ id: idPath, filename: tifName });
    return `https://www.lozano-hemmer.com/tifdownload.php?${params.toString()}`;
  };

  const downloaded = [];

  for (const base of bases) {
    const tifUrl = buildTifUrl(base);
    const tifLocal = path.join(TARGET_DIR, base + '.tif');
    if (fs.existsSync(tifLocal)) {
      downloaded.push('media/' + SLUG + '/' + path.basename(tifLocal));
      continue;
    }
    try {
      const resp = await axios.get(tifUrl, {
        responseType: 'arraybuffer',
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Referer': 'https://www.lozano-hemmer.com/spectral_subjects.php'
        }
      });
      if (!resp || !resp.data || !resp.data.byteLength) throw new Error('Réponse vide');
      fs.writeFileSync(tifLocal, Buffer.from(resp.data));
      downloaded.push('media/' + SLUG + '/' + path.basename(tifLocal));
      console.log('Téléchargé:', tifUrl, '->', tifLocal);
    } catch (e) {
      console.log('Échec:', tifUrl, '-', e.message);
    }
  }

  // Update index.js mapping
  if (!mapping[SLUG]) mapping[SLUG] = [];
  for (const rel of downloaded) {
    if (!mapping[SLUG].includes(rel)) mapping[SLUG].push(rel);
  }
  const jsOut = 'window.projectMedia = ' + JSON.stringify(mapping) + ';';
  fs.writeFileSync(indexJsPath, jsOut, 'utf8');

  console.log('Terminé. TIFFs ajoutés:', downloaded.join(', '));
})();
