#!/usr/bin/env node

/**
 * TEST FULL WIDTH CONCENTRATION
 * Verify cards use full width and height of viewport
 */

const puppeteer = require('puppeteer');
const path = require('path');

async function testFullWidthConcentration() {
    console.log('📐 TESTING FULL WIDTH CONCENTRATION');
    console.log('===================================\n');

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

        console.log('📊 TEST 1: FULL WIDTH DISTRIBUTION');
        console.log('=================================');

        // Test full width distribution
        const widthTest = await page.evaluate(() => {
            const blocks = document.querySelectorAll('.project-block');
            const positions = Array.from(blocks).map(block => {
                const rect = block.getBoundingClientRect();
                return {
                    x: rect.left,
                    y: rect.top,
                    width: rect.width,
                    height: rect.height,
                    right: rect.right,
                    bottom: rect.bottom
                };
            });
            
            if (positions.length === 0) {
                return { error: 'No cards found' };
            }
            
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            // Calculate distribution across width
            const minX = Math.min(...positions.map(p => p.x));
            const maxX = Math.max(...positions.map(p => p.right));
            const minY = Math.min(...positions.map(p => p.y));
            const maxY = Math.max(...positions.map(p => p.bottom));
            
            const widthUsage = ((maxX - minX) / viewportWidth) * 100;
            const heightUsage = ((maxY - minY) / viewportHeight) * 100;
            
            // Check if cards reach edges
            const reachesLeftEdge = minX <= 50; // Within 50px of left edge
            const reachesRightEdge = maxX >= (viewportWidth - 50); // Within 50px of right edge
            const reachesTopEdge = minY <= 50; // Within 50px of top edge
            const reachesBottomEdge = maxY >= (viewportHeight - 50); // Within 50px of bottom edge
            
            return {
                totalCards: blocks.length,
                viewportSize: { width: viewportWidth, height: viewportHeight },
                cardBounds: { minX, maxX, minY, maxY },
                usage: { width: widthUsage, height: heightUsage },
                edgeReach: { left: reachesLeftEdge, right: reachesRightEdge, top: reachesTopEdge, bottom: reachesBottomEdge }
            };
        });

        if (widthTest.error) {
            console.log(`❌ ${widthTest.error}`);
        } else {
            console.log(`✅ Total cards: ${widthTest.totalCards}`);
            console.log(`✅ Viewport: ${widthTest.viewportSize.width}x${widthTest.viewportSize.height}`);
            console.log(`✅ Card bounds: X(${widthTest.cardBounds.minX.toFixed(1)}-${widthTest.cardBounds.maxX.toFixed(1)}), Y(${widthTest.cardBounds.minY.toFixed(1)}-${widthTest.cardBounds.maxY.toFixed(1)})`);
            console.log(`✅ Width usage: ${widthTest.usage.width.toFixed(1)}%`);
            console.log(`✅ Height usage: ${widthTest.usage.height.toFixed(1)}%`);
            console.log(`✅ Reaches left edge: ${widthTest.edgeReach.left ? '✅' : '❌'}`);
            console.log(`✅ Reaches right edge: ${widthTest.edgeReach.right ? '✅' : '❌'}`);
            console.log(`✅ Reaches top edge: ${widthTest.edgeReach.top ? '✅' : '❌'}`);
            console.log(`✅ Reaches bottom edge: ${widthTest.edgeReach.bottom ? '✅' : '❌'}`);
            
            const usesFullWidth = widthTest.usage.width > 80 && widthTest.edgeReach.left && widthTest.edgeReach.right;
            const usesFullHeight = widthTest.usage.height > 80 && widthTest.edgeReach.top && widthTest.edgeReach.bottom;
            
            if (usesFullWidth && usesFullHeight) {
                console.log('✅ SUCCESS: Cards use full width and height!');
            } else {
                console.log('❌ ISSUE: Cards do not use full width and height');
            }
        }

        console.log('\n📊 TEST 2: CARD DISTRIBUTION ANALYSIS');
        console.log('====================================');

        // Test card distribution
        const distributionTest = await page.evaluate(() => {
            const blocks = document.querySelectorAll('.project-block');
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            // Divide viewport into zones
            const leftZone = blocks.filter(block => {
                const rect = block.getBoundingClientRect();
                return rect.left < viewportWidth * 0.25;
            });
            
            const centerLeftZone = blocks.filter(block => {
                const rect = block.getBoundingClientRect();
                return rect.left >= viewportWidth * 0.25 && rect.left < viewportWidth * 0.5;
            });
            
            const centerRightZone = blocks.filter(block => {
                const rect = block.getBoundingClientRect();
                return rect.left >= viewportWidth * 0.5 && rect.left < viewportWidth * 0.75;
            });
            
            const rightZone = blocks.filter(block => {
                const rect = block.getBoundingClientRect();
                return rect.left >= viewportWidth * 0.75;
            });
            
            return {
                totalCards: blocks.length,
                zones: {
                    left: leftZone.length,
                    centerLeft: centerLeftZone.length,
                    centerRight: centerRightZone.length,
                    right: rightZone.length
                },
                distribution: {
                    left: (leftZone.length / blocks.length) * 100,
                    centerLeft: (centerLeftZone.length / blocks.length) * 100,
                    centerRight: (centerRightZone.length / blocks.length) * 100,
                    right: (rightZone.length / blocks.length) * 100
                }
            };
        });

        console.log(`✅ Total cards: ${distributionTest.totalCards}`);
        console.log(`✅ Left zone (0-25%): ${distributionTest.zones.left} cards (${distributionTest.distribution.left.toFixed(1)}%)`);
        console.log(`✅ Center-left zone (25-50%): ${distributionTest.zones.centerLeft} cards (${distributionTest.distribution.centerLeft.toFixed(1)}%)`);
        console.log(`✅ Center-right zone (50-75%): ${distributionTest.zones.centerRight} cards (${distributionTest.distribution.centerRight.toFixed(1)}%)`);
        console.log(`✅ Right zone (75-100%): ${distributionTest.zones.right} cards (${distributionTest.distribution.right.toFixed(1)}%)`);
        
        const hasGoodDistribution = distributionTest.zones.left > 0 && distributionTest.zones.right > 0;
        
        if (hasGoodDistribution) {
            console.log('✅ SUCCESS: Cards are well distributed across full width!');
        } else {
            console.log('❌ ISSUE: Cards are not well distributed across width');
        }

        console.log('\n📊 TEST 3: HEIGHT UTILIZATION');
        console.log('=============================');

        // Test height utilization
        const heightTest = await page.evaluate(() => {
            const blocks = document.querySelectorAll('.project-block');
            const viewportHeight = window.innerHeight;
            
            // Count cards in different height zones
            const topZone = blocks.filter(block => {
                const rect = block.getBoundingClientRect();
                return rect.top < viewportHeight * 0.33;
            });
            
            const middleZone = blocks.filter(block => {
                const rect = block.getBoundingClientRect();
                return rect.top >= viewportHeight * 0.33 && rect.top < viewportHeight * 0.66;
            });
            
            const bottomZone = blocks.filter(block => {
                const rect = block.getBoundingClientRect();
                return rect.top >= viewportHeight * 0.66;
            });
            
            return {
                totalCards: blocks.length,
                viewportHeight: viewportHeight,
                zones: {
                    top: topZone.length,
                    middle: middleZone.length,
                    bottom: bottomZone.length
                },
                distribution: {
                    top: (topZone.length / blocks.length) * 100,
                    middle: (middleZone.length / blocks.length) * 100,
                    bottom: (bottomZone.length / blocks.length) * 100
                }
            };
        });

        console.log(`✅ Total cards: ${heightTest.totalCards}`);
        console.log(`✅ Viewport height: ${heightTest.viewportHeight}px`);
        console.log(`✅ Top zone (0-33%): ${heightTest.zones.top} cards (${heightTest.distribution.top.toFixed(1)}%)`);
        console.log(`✅ Middle zone (33-66%): ${heightTest.zones.middle} cards (${heightTest.distribution.middle.toFixed(1)}%)`);
        console.log(`✅ Bottom zone (66-100%): ${heightTest.zones.bottom} cards (${heightTest.distribution.bottom.toFixed(1)}%)`);
        
        const usesFullHeight = heightTest.zones.top > 0 && heightTest.zones.bottom > 0;
        
        if (usesFullHeight) {
            console.log('✅ SUCCESS: Cards use full height of viewport!');
        } else {
            console.log('❌ ISSUE: Cards do not use full height');
        }

        // Capture screenshot
        console.log('\n📸 Capturing full width concentration screenshot...');
        const screenshotsDir = path.join(__dirname, '../screenshots');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const testPath = path.join(screenshotsDir, `full-width-concentration-${timestamp}.png`);
        
        await page.screenshot({
            path: testPath,
            fullPage: true
        });
        console.log(`✅ Full width concentration screenshot saved: ${testPath}`);

        // Final assessment
        console.log('\n📋 FULL WIDTH CONCENTRATION TEST SUMMARY:');
        console.log('=========================================');
        console.log(`Full Width Usage: ${widthTest?.usage?.width > 80 ? '✅ WORKING' : '❌ BROKEN'}`);
        console.log(`Full Height Usage: ${widthTest?.usage?.height > 80 ? '✅ WORKING' : '❌ BROKEN'}`);
        console.log(`Edge Reach: ${widthTest?.edgeReach?.left && widthTest?.edgeReach?.right ? '✅ WORKING' : '❌ BROKEN'}`);
        console.log(`Good Distribution: ${hasGoodDistribution ? '✅ WORKING' : '❌ BROKEN'}`);
        
        const allTestsPassed = widthTest?.usage?.width > 80 && 
                             widthTest?.usage?.height > 80 &&
                             widthTest?.edgeReach?.left && 
                             widthTest?.edgeReach?.right &&
                             hasGoodDistribution;
        
        if (allTestsPassed) {
            console.log('\n🎉 FULL WIDTH CONCENTRATION SUCCESS: All tests passed!');
            console.log('✅ Cards use full width from edge to edge');
            console.log('✅ Cards use full height of viewport');
            console.log('✅ Cards reach both left and right edges');
            console.log('✅ Good distribution across all zones');
        } else {
            console.log('\n⚠️  FULL WIDTH CONCENTRATION ISSUES: Some tests failed');
            console.log('❌ Need to fix before proceeding');
        }

    } catch (error) {
        console.error('❌ Error testing full width concentration:', error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Run the test
testFullWidthConcentration().catch(console.error);


