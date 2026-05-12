const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 20000 });
    await new Promise(r => setTimeout(r, 5000));

    const data = await page.evaluate(() => {
        const overlays = document.querySelectorAll('.thumbnail-overlay');
        return Array.from(overlays).slice(0, 6).map((el, i) => {
            const cs = getComputedStyle(el);
            const before = getComputedStyle(el, '::before');
            return {
                index: i,
                classes: el.className,
                hasLoaded: el.classList.contains('loaded'),
                hasImg: !!el.querySelector('img'),
                beforeContent: before.content,
                beforeDisplay: before.display,
                beforeAnimation: before.animation,
                beforeOpacity: before.opacity
            };
        });
    });

    console.log(JSON.stringify(data, null, 2));
    await browser.close();
})();
