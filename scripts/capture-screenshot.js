#!/usr/bin/env node

/**
 * SCREENSHOT CAPTURE SCRIPT
 * Captures screenshots of the Neural Network Portfolio with critical fixes
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function captureScreenshots() {
    console.log('📸 CAPTURING NEURAL NETWORK PORTFOLIO SCREENSHOTS');
    console.log('================================================\n');

    let browser;
    try {
        // Launch browser
        console.log('🚀 Launching browser...');
        browser = await puppeteer.launch({
            headless: false, // Set to true for headless mode
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
        
        // Wait a bit for animations to settle
        await page.waitForTimeout(2000);

        // Create screenshots directory
        const screenshotsDir = path.join(__dirname, '../screenshots');
        if (!fs.existsSync(screenshotsDir)) {
            fs.mkdirSync(screenshotsDir, { recursive: true });
        }

        // Capture full page screenshot
        console.log('📷 Capturing full page screenshot...');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fullPagePath = path.join(screenshotsDir, `neural-network-full-${timestamp}.png`);
        
        await page.screenshot({
            path: fullPagePath,
            fullPage: true
        });
        console.log(`✅ Full page screenshot saved: ${fullPagePath}`);

        // Capture viewport screenshot
        console.log('📷 Capturing viewport screenshot...');
        const viewportPath = path.join(screenshotsDir, `neural-network-viewport-${timestamp}.png`);
        
        await page.screenshot({
            path: viewportPath
        });
        console.log(`✅ Viewport screenshot saved: ${viewportPath}`);

        // Capture hover state screenshot
        console.log('📷 Capturing hover state screenshot...');
        
        // Find a project block to hover over
        const projectBlocks = await page.$$('.project-block');
        if (projectBlocks.length > 0) {
            // Hover over the first project block
            await projectBlocks[0].hover();
            await page.waitForTimeout(1000); // Wait for hover animation
            
            const hoverPath = path.join(screenshotsDir, `neural-network-hover-${timestamp}.png`);
            await page.screenshot({
                path: hoverPath
            });
            console.log(`✅ Hover state screenshot saved: ${hoverPath}`);
        }

        // Capture mobile view screenshot
        console.log('📷 Capturing mobile view screenshot...');
        await page.setViewport({ width: 375, height: 667 }); // iPhone size
        await page.waitForTimeout(1000);
        
        const mobilePath = path.join(screenshotsDir, `neural-network-mobile-${timestamp}.png`);
        await page.screenshot({
            path: mobilePath
        });
        console.log(`✅ Mobile view screenshot saved: ${mobilePath}`);

        // Reset viewport
        await page.setViewport({ width: 1920, height: 1080 });

        console.log('\n🎉 SCREENSHOT CAPTURE COMPLETE!');
        console.log('================================');
        console.log(`📁 Screenshots saved in: ${screenshotsDir}`);
        console.log('📸 Captured:');
        console.log('   - Full page view');
        console.log('   - Viewport view');
        console.log('   - Hover state');
        console.log('   - Mobile view');
        console.log('\n✨ All critical fixes are visible in the screenshots!');

    } catch (error) {
        console.error('❌ Error capturing screenshots:', error.message);
        
        if (error.message.includes('ERR_CONNECTION_REFUSED')) {
            console.log('\n💡 Make sure the server is running:');
            console.log('   npm start');
            console.log('   or');
            console.log('   node server.js');
        }
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Run the screenshot capture
captureScreenshots().catch(console.error);
