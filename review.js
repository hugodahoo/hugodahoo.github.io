const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const dir = __dirname;
    let shotIdx = 0;

    async function snap(label) {
        shotIdx++;
        const file = path.join(dir, `review_${String(shotIdx).padStart(2,'0')}_${label}.png`);
        await page.screenshot({ path: file, fullPage: false });
        console.log(`[${shotIdx}] ${label}`);
        return file;
    }

    // --- MOBILE REVIEW ---
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)');

    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 20000 });
    await new Promise(r => setTimeout(r, 4000));

    await snap('hero_top');

    // Scroll through the page in increments
    for (let i = 1; i <= 6; i++) {
        await page.evaluate(() => window.scrollBy(0, 800));
        await new Promise(r => setTimeout(r, 1200));
        await snap(`scroll_${i}`);
    }

    // Scroll back up to test sticky bar
    await page.evaluate(() => window.scrollTo(0, 2000));
    await new Promise(r => setTimeout(r, 500));
    await page.evaluate(() => window.scrollBy(0, -300));
    await new Promise(r => setTimeout(r, 600));
    await snap('sticky_bar_test');

    // Tap on a project card to open bottom sheet
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise(r => setTimeout(r, 500));
    const firstCard = await page.$('.project-block');
    if (firstCard) {
        await firstCard.click();
        await new Promise(r => setTimeout(r, 1500));
        await snap('overlay_open');

        // Scroll within the overlay
        await page.evaluate(() => {
            const oc = document.querySelector('.project-overlay-content');
            if (oc) oc.scrollBy(0, 400);
        });
        await new Promise(r => setTimeout(r, 800));
        await snap('overlay_scrolled');
    }

    // --- DESKTOP REVIEW ---
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1, isMobile: false, hasTouch: false });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');

    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 20000 });
    await new Promise(r => setTimeout(r, 3000));
    await snap('desktop_full');

    // Hover a card on desktop
    const desktopCard = await page.$('.project-block');
    if (desktopCard) {
        await desktopCard.hover();
        await new Promise(r => setTimeout(r, 800));
        await snap('desktop_hover');

        await desktopCard.click();
        await new Promise(r => setTimeout(r, 1500));
        await snap('desktop_overlay');
    }

    await browser.close();
    console.log('\nDone — all screenshots saved.');
})();
