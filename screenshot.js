const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const dir = __dirname;
    let idx = 0;

    async function snap(label) {
        idx++;
        const file = path.join(dir, `desk_${String(idx).padStart(2,'0')}_${label}.png`);
        await page.screenshot({ path: file, fullPage: false });
        console.log(`[${idx}] ${label}`);
    }

    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 20000 });
    await new Promise(r => setTimeout(r, 4000));

    // Full view — check grid fade, card vibrancy
    await snap('full_view');

    // Sidebar detail at 2x
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 20000 });
    await new Promise(r => setTimeout(r, 3000));
    await page.screenshot({ path: path.join(dir, `desk_${String(++idx).padStart(2,'0')}_sidebar.png`), clip: { x: 0, y: 0, width: 220, height: 500 } });
    console.log(`[${idx}] sidebar`);

    // Hover — check no green overlay, only tooltip
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 20000 });
    await new Promise(r => setTimeout(r, 3000));

    const featured = await page.$('.project-block.featured-project');
    if (featured) {
        await featured.hover();
        await new Promise(r => setTimeout(r, 1000));
        await snap('hover_featured');
    }

    const cards = await page.$$('.project-block:not(.featured-project)');
    if (cards.length > 2) {
        await cards[2].hover();
        await new Promise(r => setTimeout(r, 1000));
        await snap('hover_regular');
    }

    await browser.close();
    console.log('\nDone.');
})();
