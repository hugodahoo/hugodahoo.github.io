'use strict';

const fs = require('fs');
const path = require('path');

const TSV = path.join(process.cwd(), 'Projets_Hugo_Daoust.xlsx - Projets_Hugo_Daoust__with_instagram.tsv');
const MEDIA_ROOT = path.join(process.cwd(), 'site', 'media');

function slugify(s) {
  return (s || '')
    .normalize('NFKD')
    .replace(/[^\p{L}0-9]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase() || ('item-' + Date.now());
}

if (!fs.existsSync(TSV)) {
  console.log('0%');
  process.exit(0);
}

const text = fs.readFileSync(TSV, 'utf8');
const lines = text.split(/\r?\n/).filter(Boolean);
if (!lines.length) { console.log('0%'); process.exit(0); }
const header = lines.shift();
const cols = header.split('\t');
const idxTitle = cols.findIndex(c => (c || '').trim().toLowerCase() === 'nom du projet');
const idxMedia = cols.findIndex(c => (c || '').trim().toLowerCase() === 'lien / média');
if (idxTitle < 0 || idxMedia < 0) { console.log('0%'); process.exit(0); }

const rows = lines.map(l => l.split('\t'));
const lhRows = rows.filter(r => /(^|\.)lozano-hemmer\.com\b/i.test(r[idxMedia] || ''));
const total = lhRows.length;

let done = 0;
for (const r of lhRows) {
  const title = (r[idxTitle] || '').trim();
  const slug = slugify(title);
  const dir = path.join(MEDIA_ROOT, slug);
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter(f => /\.(tif|tiff)$/i.test(f));
  if (files.length > 0) done++;
}

const pct = total === 0 ? 0 : Math.round((done / total) * 100);
console.log(String(pct) + '%');

