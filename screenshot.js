const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1');

    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 15000 });
    await new Promise(r => setTimeout(r, 3000));

    // Scroll well past featured cards to see 2-col grid
    await page.evaluate(() => window.scrollBy(0, 3000));
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: 'mobile_2col.png', fullPage: false });
    console.log('2-col screenshot saved');

    await browser.close();
})();
