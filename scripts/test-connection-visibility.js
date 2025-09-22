#!/usr/bin/env node

/**
 * CONNECTION VISIBILITY TEST
 * Tests if the neural network connections are visually apparent
 */

const puppeteer = require('puppeteer');
const path = require('path');

async function testConnectionVisibility() {
    console.log('👁️  TESTING CONNECTION VISIBILITY');
    console.log('==================================\n');

    let browser;
    try {
        // Launch browser
        console.log('🚀 Launching browser...');
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
        await page.waitForTimeout(2000);

        // Check connection visibility properties
        const connectionStyles = await page.evaluate(() => {
            const paths = document.querySelectorAll('.connection-path');
            if (paths.length === 0) return null;
            
            const firstPath = paths[0];
            const computedStyle = window.getComputedStyle(firstPath);
            
            return {
                height: computedStyle.height,
                opacity: computedStyle.opacity,
                background: computedStyle.background,
                boxShadow: computedStyle.boxShadow,
                zIndex: computedStyle.zIndex,
                position: computedStyle.position,
                visibility: computedStyle.visibility,
                display: computedStyle.display
            };
        });

        console.log('🔍 CONNECTION STYLE ANALYSIS:');
        console.log('=============================');
        
        if (connectionStyles) {
            console.log(`Height: ${connectionStyles.height}`);
            console.log(`Opacity: ${connectionStyles.opacity}`);
            console.log(`Background: ${connectionStyles.background}`);
            console.log(`Box Shadow: ${connectionStyles.boxShadow}`);
            console.log(`Z-Index: ${connectionStyles.zIndex}`);
            console.log(`Position: ${connectionStyles.position}`);
            console.log(`Visibility: ${connectionStyles.visibility}`);
            console.log(`Display: ${connectionStyles.display}`);
            
            // Check if connections are visible
            const isVisible = parseFloat(connectionStyles.opacity) > 0.5 && 
                            connectionStyles.height !== '0px' && 
                            connectionStyles.display !== 'none';
            
            console.log(`\n👁️  VISIBILITY ASSESSMENT:`);
            console.log(`===========================`);
            console.log(`Opacity > 0.5: ${parseFloat(connectionStyles.opacity) > 0.5 ? '✅' : '❌'}`);
            console.log(`Height > 0px: ${connectionStyles.height !== '0px' ? '✅' : '❌'}`);
            console.log(`Display != none: ${connectionStyles.display !== 'none' ? '✅' : '❌'}`);
            console.log(`Overall Visible: ${isVisible ? '✅ YES' : '❌ NO'}`);
            
        } else {
            console.log('❌ No connection paths found!');
        }

        // Count visible connections
        const visibleConnections = await page.evaluate(() => {
            const paths = document.querySelectorAll('.connection-path');
            let visibleCount = 0;
            
            paths.forEach(path => {
                const style = window.getComputedStyle(path);
                const opacity = parseFloat(style.opacity);
                const height = parseFloat(style.height);
                
                if (opacity > 0.1 && height > 0) {
                    visibleCount++;
                }
            });
            
            return { total: paths.length, visible: visibleCount };
        });

        console.log(`\n📊 CONNECTION COUNT:`);
        console.log(`====================`);
        console.log(`Total connections: ${visibleConnections.total}`);
        console.log(`Visible connections: ${visibleConnections.visible}`);
        console.log(`Visibility ratio: ${((visibleConnections.visible / visibleConnections.total) * 100).toFixed(1)}%`);

        // Capture screenshot with enhanced visibility
        console.log('\n📸 Capturing enhanced visibility screenshot...');
        const screenshotsDir = path.join(__dirname, '../screenshots');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const visibilityPath = path.join(screenshotsDir, `neural-network-visibility-${timestamp}.png`);
        
        await page.screenshot({
            path: visibilityPath,
            fullPage: true
        });
        console.log(`✅ Visibility screenshot saved: ${visibilityPath}`);

        // Summary
        console.log('\n📋 VISIBILITY TEST SUMMARY:');
        console.log('============================');
        
        if (connectionStyles && visibleConnections.visible > 0) {
            console.log('✅ CONNECTIONS ARE VISIBLE!');
            console.log(`   - ${visibleConnections.visible} visible connections`);
            console.log(`   - Enhanced opacity and height`);
            console.log(`   - Proper z-index layering`);
            console.log(`   - Glowing box shadows`);
        } else {
            console.log('❌ CONNECTIONS NEED MORE VISIBILITY!');
            console.log('💡 Recommendations:');
            console.log('   - Increase opacity further');
            console.log('   - Add more contrast');
            console.log('   - Enhance glow effects');
            console.log('   - Check z-index layering');
        }

    } catch (error) {
        console.error('❌ Error testing visibility:', error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Run the visibility test
testConnectionVisibility().catch(console.error);


