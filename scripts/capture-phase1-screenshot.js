#!/usr/bin/env node

/**
 * CAPTURE PHASE 1 SCREENSHOT
 * Quick screenshot to verify Phase 1 changes
 */

const puppeteer = require('puppeteer');
const path = require('path');

async function capturePhase1Screenshot() {
    console.log('📸 CAPTURING PHASE 1 SCREENSHOT');
    console.log('===============================\n');

    let browser;
    try {
        // Launch browser
        browser = await puppeteer.launch({
            headless: false,
            defaultViewport: { width: 1920, height: 1080 },
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        
        // Set viewport
        await page.setViewport({ width: 1920, height: 1080 });

        // Navigate to the site
        console.log('🌐 Navigating to localhost:3000...');
        await page.goto('http://localhost:3000', { 
            waitUntil: 'networkidle0',
            timeout: 10000 
        });

        // Wait for neural network style to load
        await page.waitForSelector('.project-block', { timeout: 5000 });
        
        // Wait for connections to be drawn
        await page.waitForTimeout(3000);

        // Capture screenshot
        console.log('📸 Capturing Phase 1 screenshot...');
        const screenshotsDir = path.join(__dirname, '../screenshots');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const screenshotPath = path.join(screenshotsDir, `phase1-verification-${timestamp}.png`);
        
        await page.screenshot({
            path: screenshotPath,
            fullPage: true
        });
        console.log(`✅ Phase 1 screenshot saved: ${screenshotPath}`);

        // Quick verification
        const verification = await page.evaluate(() => {
            const blocks = document.querySelectorAll('.project-block');
            const variations = new Set();
            
            blocks.forEach(block => {
                const classList = Array.from(block.classList);
                const variation = classList.find(cls => cls.startsWith('variation-'));
                if (variation) variations.add(variation);
            });
            
            return {
                totalBlocks: blocks.length,
                variationsFound: variations.size,
                variations: Array.from(variations)
            };
        });

        console.log('\n📊 QUICK VERIFICATION:');
        console.log(`✅ Total blocks: ${verification.totalBlocks}`);
        console.log(`✅ Color variations: ${verification.variationsFound}`);
        console.log(`✅ Variation types: ${verification.variations.join(', ')}`);

        if (verification.variationsFound >= 2) {
            console.log('\n🎉 PHASE 1 SUCCESS: Color variations are working!');
            console.log('✅ Ready to move to Phase 2');
        } else {
            console.log('\n⚠️  PHASE 1 ISSUE: Color variations not working');
            console.log('❌ Need to fix before moving to Phase 2');
        }

    } catch (error) {
        console.error('❌ Error capturing Phase 1 screenshot:', error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Run the capture
capturePhase1Screenshot().catch(console.error);


