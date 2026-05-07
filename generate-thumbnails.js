const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const MEDIA = path.join(__dirname, 'site', 'media');
const HIGH_RES = path.join(MEDIA, 'high-res');
const THUMBS = path.join(MEDIA, 'thumbnails');
const MAX_WIDTH = 400;
const SKIP_DIRS = new Set(['high-res', 'thumbnails']);

async function run() {
    // Collect all project dirs from both media/ and high-res/
    const mediaDirs = fs.readdirSync(MEDIA).filter(d =>
        !SKIP_DIRS.has(d) && fs.statSync(path.join(MEDIA, d)).isDirectory()
    );
    const hrDirs = fs.existsSync(HIGH_RES)
        ? fs.readdirSync(HIGH_RES).filter(d => fs.statSync(path.join(HIGH_RES, d)).isDirectory())
        : [];

    const allDirs = new Set([...mediaDirs, ...hrDirs]);
    let created = 0, skipped = 0, failed = 0;

    for (const dir of allDirs) {
        const origDir = path.join(MEDIA, dir);
        const hrDir = path.join(HIGH_RES, dir);
        const destDir = path.join(THUMBS, dir);

        // Prefer originals in media/[project]/, fall back to high-res/[project]/
        const hasOrig = fs.existsSync(origDir) && !SKIP_DIRS.has(dir);
        const origFiles = hasOrig
            ? fs.readdirSync(origDir).filter(f => /\.(jpe?g|png|webp|gif|tiff?)$/i.test(f))
            : [];
        const srcDir = origFiles.length > 0 ? origDir : (fs.existsSync(hrDir) ? hrDir : null);
        if (!srcDir) continue;

        const files = fs.readdirSync(srcDir).filter(f =>
            /\.(jpe?g|png|webp|gif|tiff?)$/i.test(f)
        );
        if (files.length === 0) continue;

        if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

        const seen = new Set();
        for (const file of files) {
            const ext = path.extname(file);
            const baseName = file.slice(0, -ext.length);
            const destFile = baseName + '.jpg';

            if (seen.has(destFile)) { skipped++; continue; }
            seen.add(destFile);

            const src = path.join(srcDir, file);
            const dest = path.join(destDir, destFile);
            const tmp = dest + '.tmp';

            try {
                await sharp(src)
                    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
                    .jpeg({ quality: 75 })
                    .toFile(tmp);

                fs.renameSync(tmp, dest);
                created++;
                process.stdout.write('.');
            } catch (e) {
                failed++;
                console.error('\nFailed: ' + dir + '/' + file + ': ' + e.message);
            }
        }

        if (srcDir === hrDir) {
            process.stdout.write('[' + dir + ':high-res]');
        }
    }

    console.log('\nDone. Created: ' + created + ', Skipped dupes: ' + skipped + ', Failed: ' + failed);

    let totalFiles = 0;
    for (const dir of allDirs) {
        const destDir = path.join(THUMBS, dir);
        if (fs.existsSync(destDir)) {
            totalFiles += fs.readdirSync(destDir).length;
        }
    }
    console.log('Total thumbnails on disk: ' + totalFiles);
}

run();
