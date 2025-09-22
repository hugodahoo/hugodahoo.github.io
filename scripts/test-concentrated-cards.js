#!/usr/bin/env node

/**
 * TEST CONCENTRATED CARDS & SOLID COLORS
 * Verify cards are more concentrated and use solid colors
 */

const puppeteer = require('puppeteer');
const path = require('path');

async function testConcentratedCards() {
    console.log('🎯 TESTING CONCENTRATED CARDS & SOLID COLORS');
    console.log('============================================\n');

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

        console.log('📊 TEST 1: CARD CONCENTRATION');
        console.log('=============================');

        // Test card concentration
        const concentrationTest = await page.evaluate(() => {
            const blocks = document.querySelectorAll('.project-block');
            const positions = Array.from(blocks).map(block => {
                const rect = block.getBoundingClientRect();
                return {
                    x: rect.left,
                    y: rect.top,
                    width: rect.width,
                    height: rect.height
                };
            });
            
            if (positions.length === 0) {
                return { error: 'No cards found' };
            }
            
            // Calculate bounding box of all cards
            const minX = Math.min(...positions.map(p => p.x));
            const maxX = Math.max(...positions.map(p => p.x + p.width));
            const minY = Math.min(...positions.map(p => p.y));
            const maxY = Math.max(...positions.map(p => p.y + p.height));
            
            const totalWidth = maxX - minX;
            const totalHeight = maxY - minY;
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            return {
                totalCards: blocks.length,
                boundingBox: {
                    width: totalWidth,
                    height: totalHeight,
                    left: minX,
                    top: minY
                },
                coverage: {
                    widthPercent: (totalWidth / viewportWidth) * 100,
                    heightPercent: (totalHeight / viewportHeight) * 100
                },
                centerX: (minX + maxX) / 2,
                centerY: (minY + maxY) / 2,
                viewportCenterX: viewportWidth / 2,
                viewportCenterY: viewportHeight / 2
            };
        });

        if (concentrationTest.error) {
            console.log(`❌ ${concentrationTest.error}`);
        } else {
            console.log(`✅ Total cards: ${concentrationTest.totalCards}`);
            console.log(`✅ Bounding box: ${concentrationTest.boundingBox.width.toFixed(1)}x${concentrationTest.boundingBox.height.toFixed(1)}`);
            console.log(`✅ Coverage: ${concentrationTest.coverage.widthPercent.toFixed(1)}% width, ${concentrationTest.coverage.heightPercent.toFixed(1)}% height`);
            console.log(`✅ Cards center: (${concentrationTest.centerX.toFixed(1)}, ${concentrationTest.centerY.toFixed(1)})`);
            console.log(`✅ Viewport center: (${concentrationTest.viewportCenterX.toFixed(1)}, ${concentrationTest.viewportCenterY.toFixed(1)})`);
            
            const isConcentrated = concentrationTest.coverage.widthPercent < 80 && concentrationTest.coverage.heightPercent < 80;
            const isCentered = Math.abs(concentrationTest.centerX - concentrationTest.viewportCenterX) < 200 && 
                              Math.abs(concentrationTest.centerY - concentrationTest.viewportCenterY) < 200;
            
            if (isConcentrated && isCentered) {
                console.log('✅ SUCCESS: Cards are concentrated and centered!');
            } else {
                console.log('❌ ISSUE: Cards are not concentrated or centered');
            }
        }

        console.log('\n📊 TEST 2: SOLID COLORS');
        console.log('=======================');

        // Test solid colors
        const colorTest = await page.evaluate(() => {
            const blocks = document.querySelectorAll('.project-block');
            const colorInfo = Array.from(blocks).slice(0, 5).map((block, index) => {
                const computedStyle = window.getComputedStyle(block);
                const background = computedStyle.background;
                const backgroundColor = computedStyle.backgroundColor;
                
                return {
                    index: index + 1,
                    category: block.className.match(/category-(\w+)/)?.[1] || 'unknown',
                    background: background,
                    backgroundColor: backgroundColor,
                    isSolid: !background.includes('gradient') && !background.includes('linear-gradient')
                };
            });
            
            return {
                totalBlocks: blocks.length,
                samples: colorInfo,
                allSolid: colorInfo.every(c => c.isSolid)
            };
        });

        console.log(`✅ Total blocks: ${colorTest.totalBlocks}`);
        
        colorTest.samples.forEach(sample => {
            console.log(`   Card ${sample.index} (${sample.category}): ${sample.backgroundColor}`);
            console.log(`     Solid color: ${sample.isSolid ? '✅' : '❌'}`);
        });
        
        if (colorTest.allSolid) {
            console.log('✅ SUCCESS: All cards use solid colors!');
        } else {
            console.log('❌ ISSUE: Some cards still use gradients');
        }

        console.log('\n📊 TEST 3: VISUAL IMPACT');
        console.log('========================');

        // Test visual impact
        const visualTest = await page.evaluate(() => {
            const blocks = document.querySelectorAll('.project-block');
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            // Count cards visible in viewport
            const visibleCards = Array.from(blocks).filter(block => {
                const rect = block.getBoundingClientRect();
                return rect.top >= 0 && rect.left >= 0 && 
                       rect.bottom <= viewportHeight && rect.right <= viewportWidth;
            });
            
            return {
                totalCards: blocks.length,
                visibleCards: visibleCards.length,
                visibilityPercent: (visibleCards.length / blocks.length) * 100
            };
        });

        console.log(`✅ Total cards: ${visualTest.totalCards}`);
        console.log(`✅ Visible cards: ${visualTest.visibleCards}`);
        console.log(`✅ Visibility: ${visualTest.visibilityPercent.toFixed(1)}%`);
        
        const isWellVisible = visualTest.visibilityPercent > 70;
        
        if (isWellVisible) {
            console.log('✅ SUCCESS: Most cards are visible at first glance!');
        } else {
            console.log('❌ ISSUE: Too many cards are outside the viewport');
        }

        // Capture screenshot
        console.log('\n📸 Capturing concentrated cards screenshot...');
        const screenshotsDir = path.join(__dirname, '../screenshots');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const testPath = path.join(screenshotsDir, `concentrated-cards-${timestamp}.png`);
        
        await page.screenshot({
            path: testPath,
            fullPage: true
        });
        console.log(`✅ Concentrated cards screenshot saved: ${testPath}`);

        // Final assessment
        console.log('\n📋 CONCENTRATED CARDS TEST SUMMARY:');
        console.log('===================================');
        console.log(`Card Concentration: ${concentrationTest?.coverage?.widthPercent < 80 ? '✅ WORKING' : '❌ BROKEN'}`);
        console.log(`Solid Colors: ${colorTest.allSolid ? '✅ WORKING' : '❌ BROKEN'}`);
        console.log(`Visual Impact: ${visualTest.visibilityPercent > 70 ? '✅ WORKING' : '❌ BROKEN'}`);
        
        const allTestsPassed = concentrationTest?.coverage?.widthPercent < 80 && 
                             colorTest.allSolid && 
                             visualTest.visibilityPercent > 70;
        
        if (allTestsPassed) {
            console.log('\n🎉 CONCENTRATED CARDS SUCCESS: All tests passed!');
            console.log('✅ Cards are concentrated in center');
            console.log('✅ Cards use solid colors');
            console.log('✅ Most cards visible at first glance');
        } else {
            console.log('\n⚠️  CONCENTRATED CARDS ISSUES: Some tests failed');
            console.log('❌ Need to fix before proceeding');
        }

    } catch (error) {
        console.error('❌ Error testing concentrated cards:', error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Run the test
testConcentratedCards().catch(console.error);


