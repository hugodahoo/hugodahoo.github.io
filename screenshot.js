const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const dir = __dirname;

    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 20000 });
    await new Promise(r => setTimeout(r, 5000));

    const cards = await page.$$('.project-block:not(.featured-project)');
    console.log('Cards:', cards.length);

    if (cards.length > 8) {
        await cards[8].hover();
        await new Promise(r => setTimeout(r, 2000));

        // Check if pseudo-element approach is working
        const info = await page.evaluate(() => {
            const section = document.querySelector('.project-section');
            const hasDots = section ? section.classList.contains('dots-active') : false;
            const sectionCs = section ? getComputedStyle(section, '::before') : {};
            const oldOverlay = document.querySelector('.project-background-image');
            const hovered = document.querySelector('.project-block:hover');
            
            return {
                dotsActive: hasDots,
                pseudoOpacity: sectionCs.opacity,
                pseudoZIndex: sectionCs.zIndex,
                pseudoPosition: sectionCs.position,
                pseudoContent: sectionCs.content,
                oldOverlayExists: !!oldOverlay,
                hoveredZIndex: hovered ? getComputedStyle(hovered).zIndex : 'N/A'
            };
        });
        console.log('State:', JSON.stringify(info, null, 2));

        await page.screenshot({ path: path.join(dir, 'pseudo_01_full.png'), fullPage: false });
        console.log('[1] full');

        const box = await cards[8].boundingBox();
        if (box) {
            await page.screenshot({
                path: path.join(dir, 'pseudo_02_zoomed.png'),
                clip: { x: box.x - 80, y: box.y - 80, width: box.width + 400, height: box.height + 200 }
            });
            console.log('[2] zoomed');
        }
    }

    await browser.close();
    console.log('Done.');
})();
