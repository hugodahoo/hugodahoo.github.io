#!/usr/bin/env node

/**
 * TEST TOP CONCENTRATION
 * Verify cards are concentrated in the top portion of the page
 */

const puppeteer = require('puppeteer');
const path = require('path');

async function testTopConcentration() {
    console.log('⬆️  TESTING TOP CONCENTRATION');
    console.log('============================\n');

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

        console.log('📊 TEST 1: TOP CONCENTRATION ANALYSIS');
        console.log('====================================');

        // Test top concentration
        const topTest = await page.evaluate(() => {
            const blocks = document.querySelectorAll('.project-block');
            const viewportHeight = window.innerHeight;
            
            // Divide viewport into height zones
            const topZone = blocks.filter(block => {
                const rect = block.getBoundingClientRect();
                return rect.top < viewportHeight * 0.3; // Top 30%
            });
            
            const upperMiddleZone = blocks.filter(block => {
                const rect = block.getBoundingClientRect();
                return rect.top >= viewportHeight * 0.3 && rect.top < viewportHeight * 0.6; // 30-60%
            });
            
            const lowerMiddleZone = blocks.filter(block => {
                const rect = block.getBoundingClientRect();
                return rect.top >= viewportHeight * 0.6 && rect.top < viewportHeight * 0.8; // 60-80%
            });
            
            const bottomZone = blocks.filter(block => {
                const rect = block.getBoundingClientRect();
                return rect.top >= viewportHeight * 0.8; // Bottom 20%
            });
            
            // Calculate average Y position
            const positions = Array.from(blocks).map(block => {
                const rect = block.getBoundingClientRect();
                return rect.top;
            });
            
            const averageY = positions.reduce((sum, y) => sum + y, 0) / positions.length;
            const minY = Math.min(...positions);
            const maxY = Math.max(...positions);
            
            return {
                totalCards: blocks.length,
                viewportHeight: viewportHeight,
                zones: {
                    top: topZone.length,
                    upperMiddle: upperMiddleZone.length,
                    lowerMiddle: lowerMiddleZone.length,
                    bottom: bottomZone.length
                },
                distribution: {
                    top: (topZone.length / blocks.length) * 100,
                    upperMiddle: (upperMiddleZone.length / blocks.length) * 100,
                    lowerMiddle: (lowerMiddleZone.length / blocks.length) * 100,
                    bottom: (bottomZone.length / blocks.length) * 100
                },
                positioning: {
                    averageY: averageY,
                    minY: minY,
                    maxY: maxY,
                    heightUsage: ((maxY - minY) / viewportHeight) * 100
                }
            };
        });

        console.log(`✅ Total cards: ${topTest.totalCards}`);
        console.log(`✅ Viewport height: ${topTest.viewportHeight}px`);
        console.log(`✅ Height zone distribution:`);
        console.log(`   Top zone (0-30%): ${topTest.zones.top} cards (${topTest.distribution.top.toFixed(1)}%)`);
        console.log(`   Upper middle (30-60%): ${topTest.zones.upperMiddle} cards (${topTest.distribution.upperMiddle.toFixed(1)}%)`);
        console.log(`   Lower middle (60-80%): ${topTest.zones.lowerMiddle} cards (${topTest.distribution.lowerMiddle.toFixed(1)}%)`);
        console.log(`   Bottom zone (80-100%): ${topTest.zones.bottom} cards (${topTest.distribution.bottom.toFixed(1)}%)`);
        console.log(`✅ Positioning stats:`);
        console.log(`   Average Y: ${topTest.positioning.averageY.toFixed(1)}px`);
        console.log(`   Min Y: ${topTest.positioning.minY.toFixed(1)}px`);
        console.log(`   Max Y: ${topTest.positioning.maxY.toFixed(1)}px`);
        console.log(`   Height usage: ${topTest.positioning.heightUsage.toFixed(1)}%`);
        
        const isTopConcentrated = topTest.distribution.top > 40 && topTest.distribution.bottom < 20;
        const hasLowHeightUsage = topTest.positioning.heightUsage < 70;
        
        if (isTopConcentrated && hasLowHeightUsage) {
            console.log('✅ SUCCESS: Cards are concentrated in the top!');
        } else {
            console.log('❌ ISSUE: Cards are not well concentrated in the top');
        }

        console.log('\n📊 TEST 2: SCROLL REQUIREMENT');
        console.log('=============================');

        // Test scroll requirement
        const scrollTest = await page.evaluate(() => {
            const blocks = document.querySelectorAll('.project-block');
            const viewportHeight = window.innerHeight;
            
            // Count cards visible without scrolling
            const visibleCards = blocks.filter(block => {
                const rect = block.getBoundingClientRect();
                return rect.top >= 0 && rect.bottom <= viewportHeight;
            });
            
            // Count cards that require scrolling
            const scrollRequiredCards = blocks.filter(block => {
                const rect = block.getBoundingClientRect();
                return rect.bottom > viewportHeight;
            });
            
            // Calculate how much scrolling is needed
            const maxBottom = Math.max(...Array.from(blocks).map(block => {
                const rect = block.getBoundingClientRect();
                return rect.bottom;
            }));
            
            const scrollDistance = Math.max(0, maxBottom - viewportHeight);
            
            return {
                totalCards: blocks.length,
                visibleCards: visibleCards.length,
                scrollRequiredCards: scrollRequiredCards.length,
                visibilityPercent: (visibleCards.length / blocks.length) * 100,
                scrollDistance: scrollDistance,
                maxBottom: maxBottom
            };
        });

        console.log(`✅ Total cards: ${scrollTest.totalCards}`);
        console.log(`✅ Visible cards: ${scrollTest.visibleCards}`);
        console.log(`✅ Scroll required cards: ${scrollTest.scrollRequiredCards}`);
        console.log(`✅ Visibility: ${scrollTest.visibilityPercent.toFixed(1)}%`);
        console.log(`✅ Scroll distance: ${scrollTest.scrollDistance.toFixed(1)}px`);
        console.log(`✅ Max bottom: ${scrollTest.maxBottom.toFixed(1)}px`);
        
        const hasGoodVisibility = scrollTest.visibilityPercent > 80;
        const hasMinimalScroll = scrollTest.scrollDistance < 200;
        
        if (hasGoodVisibility && hasMinimalScroll) {
            console.log('✅ SUCCESS: Minimal scrolling required!');
        } else {
            console.log('❌ ISSUE: Too much scrolling required');
        }

        console.log('\n📊 TEST 3: UPPER AREA UTILIZATION');
        console.log('=================================');

        // Test upper area utilization
        const upperTest = await page.evaluate(() => {
            const blocks = document.querySelectorAll('.project-block');
            const viewportHeight = window.innerHeight;
            const upperAreaHeight = viewportHeight * 0.6; // Top 60%
            
            // Count cards in upper area
            const upperCards = blocks.filter(block => {
                const rect = block.getBoundingClientRect();
                return rect.top < upperAreaHeight;
            });
            
            // Calculate density in upper area
            const upperPositions = upperCards.map(block => {
                const rect = block.getBoundingClientRect();
                return { x: rect.left, y: rect.top, width: rect.width, height: rect.height };
            });
            
            const minX = Math.min(...upperPositions.map(p => p.x));
            const maxX = Math.max(...upperPositions.map(p => p.x + p.width));
            const minY = Math.min(...upperPositions.map(p => p.y));
            const maxY = Math.max(...upperPositions.map(p => p.y + p.height));
            
            const upperAreaUsage = ((maxY - minY) / upperAreaHeight) * 100;
            const upperWidthUsage = ((maxX - minX) / window.innerWidth) * 100;
            
            return {
                totalCards: blocks.length,
                upperAreaCards: upperCards.length,
                upperAreaPercent: (upperCards.length / blocks.length) * 100,
                upperAreaHeight: upperAreaHeight,
                upperAreaUsage: upperAreaUsage,
                upperWidthUsage: upperWidthUsage
            };
        });

        console.log(`✅ Total cards: ${upperTest.totalCards}`);
        console.log(`✅ Upper area cards: ${upperTest.upperAreaCards}`);
        console.log(`✅ Upper area percentage: ${upperTest.upperAreaPercent.toFixed(1)}%`);
        console.log(`✅ Upper area height: ${upperTest.upperAreaHeight.toFixed(1)}px`);
        console.log(`✅ Upper area usage: ${upperTest.upperAreaUsage.toFixed(1)}%`);
        console.log(`✅ Upper width usage: ${upperTest.upperWidthUsage.toFixed(1)}%`);
        
        const usesUpperAreaWell = upperTest.upperAreaPercent > 80 && upperTest.upperAreaUsage > 60;
        
        if (usesUpperAreaWell) {
            console.log('✅ SUCCESS: Upper area is well utilized!');
        } else {
            console.log('❌ ISSUE: Upper area is not well utilized');
        }

        // Capture screenshot
        console.log('\n📸 Capturing top concentration screenshot...');
        const screenshotsDir = path.join(__dirname, '../screenshots');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const testPath = path.join(screenshotsDir, `top-concentration-${timestamp}.png`);
        
        await page.screenshot({
            path: testPath,
            fullPage: true
        });
        console.log(`✅ Top concentration screenshot saved: ${testPath}`);

        // Final assessment
        console.log('\n📋 TOP CONCENTRATION TEST SUMMARY:');
        console.log('===================================');
        console.log(`Top Concentration: ${isTopConcentrated ? '✅ WORKING' : '❌ BROKEN'}`);
        console.log(`Low Height Usage: ${hasLowHeightUsage ? '✅ WORKING' : '❌ BROKEN'}`);
        console.log(`Good Visibility: ${hasGoodVisibility ? '✅ WORKING' : '❌ BROKEN'}`);
        console.log(`Minimal Scroll: ${hasMinimalScroll ? '✅ WORKING' : '❌ BROKEN'}`);
        console.log(`Upper Area Usage: ${usesUpperAreaWell ? '✅ WORKING' : '❌ BROKEN'}`);
        
        const allTestsPassed = isTopConcentrated && hasLowHeightUsage && hasGoodVisibility && hasMinimalScroll && usesUpperAreaWell;
        
        if (allTestsPassed) {
            console.log('\n🎉 TOP CONCENTRATION SUCCESS: All tests passed!');
            console.log('✅ Cards are concentrated in the top portion');
            console.log('✅ Low height usage (concentrated)');
            console.log('✅ Good visibility without scrolling');
            console.log('✅ Minimal scrolling required');
            console.log('✅ Upper area is well utilized');
        } else {
            console.log('\n⚠️  TOP CONCENTRATION ISSUES: Some tests failed');
            console.log('❌ Need to fix before proceeding');
        }

    } catch (error) {
        console.error('❌ Error testing top concentration:', error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Run the test
testTopConcentration().catch(console.error);


