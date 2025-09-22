#!/usr/bin/env node

/**
 * TEST FIXED POSITIONING
 * Verify cards are positioned correctly in a grid
 */

const puppeteer = require('puppeteer');
const path = require('path');

async function testFixedPositioning() {
    console.log('🔧 TESTING FIXED POSITIONING');
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
        
        // Wait for positioning to complete
        await page.waitForTimeout(2000);

        console.log('📊 TEST 1: CARD POSITIONING');
        console.log('==========================');

        // Test card positioning
        const positioningTest = await page.evaluate(() => {
            const blocks = document.querySelectorAll('.project-block');
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            const positions = Array.from(blocks).slice(0, 10).map((block, index) => {
                const rect = block.getBoundingClientRect();
                return {
                    index: index + 1,
                    x: rect.left,
                    y: rect.top,
                    width: rect.width,
                    height: rect.height,
                    right: rect.right,
                    bottom: rect.bottom
                };
            });
            
            // Check for overlaps
            const overlaps = [];
            for (let i = 0; i < positions.length; i++) {
                for (let j = i + 1; j < positions.length; j++) {
                    const pos1 = positions[i];
                    const pos2 = positions[j];
                    
                    const overlap = !(pos1.right <= pos2.x || pos2.right <= pos1.x || 
                                   pos1.bottom <= pos2.y || pos2.bottom <= pos1.y);
                    
                    if (overlap) {
                        overlaps.push({ card1: i + 1, card2: j + 1 });
                    }
                }
            }
            
            // Check if cards are within viewport
            const outOfBounds = positions.filter(pos => 
                pos.x < 0 || pos.y < 0 || pos.right > viewportWidth || pos.bottom > viewportHeight
            );
            
            return {
                totalCards: blocks.length,
                samplePositions: positions,
                overlaps: overlaps,
                outOfBounds: outOfBounds,
                viewportSize: { width: viewportWidth, height: viewportHeight }
            };
        });

        console.log(`✅ Total cards: ${positioningTest.totalCards}`);
        console.log(`✅ Viewport: ${positioningTest.viewportSize.width}x${positioningTest.viewportSize.height}`);
        console.log(`✅ Overlaps: ${positioningTest.overlaps.length}`);
        console.log(`✅ Out of bounds: ${positioningTest.outOfBounds.length}`);
        
        console.log(`✅ First 10 card positions:`);
        positioningTest.samplePositions.forEach(pos => {
            console.log(`   Card ${pos.index}: ${pos.width.toFixed(1)}x${pos.height.toFixed(1)} at (${pos.x.toFixed(1)}, ${pos.y.toFixed(1)})`);
        });
        
        if (positioningTest.overlaps.length > 0) {
            console.log(`   Overlaps:`);
            positioningTest.overlaps.forEach(overlap => {
                console.log(`     Card ${overlap.card1} overlaps with Card ${overlap.card2}`);
            });
        }
        
        if (positioningTest.outOfBounds.length > 0) {
            console.log(`   Out of bounds:`);
            positioningTest.outOfBounds.forEach(pos => {
                console.log(`     Card at (${pos.x.toFixed(1)}, ${pos.y.toFixed(1)}) is out of bounds`);
            });
        }
        
        const hasNoOverlaps = positioningTest.overlaps.length === 0;
        const hasNoOutOfBounds = positioningTest.outOfBounds.length === 0;
        
        if (hasNoOverlaps && hasNoOutOfBounds) {
            console.log('✅ SUCCESS: Cards are positioned correctly!');
        } else {
            console.log('❌ ISSUE: Cards have positioning problems');
        }

        console.log('\n📊 TEST 2: GRID PATTERN');
        console.log('=======================');

        // Test grid pattern
        const gridTest = await page.evaluate(() => {
            const blocks = document.querySelectorAll('.project-block');
            const positions = Array.from(blocks).slice(0, 20).map((block, index) => {
                const rect = block.getBoundingClientRect();
                return {
                    index: index + 1,
                    x: rect.left,
                    y: rect.top,
                    width: rect.width,
                    height: rect.height
                };
            });
            
            // Check if positions follow a grid pattern
            const xPositions = [...new Set(positions.map(p => Math.round(p.x)))].sort((a, b) => a - b);
            const yPositions = [...new Set(positions.map(p => Math.round(p.y)))].sort((a, b) => a - b);
            
            // Calculate expected grid spacing
            const firstCard = positions[0];
            const expectedXSpacing = firstCard.width + 20; // width + margin
            const expectedYSpacing = firstCard.height + 60; // height + label space
            
            return {
                totalCards: blocks.length,
                uniqueXPositions: xPositions.length,
                uniqueYPositions: yPositions.length,
                xPositions: xPositions.slice(0, 10),
                yPositions: yPositions.slice(0, 10),
                expectedXSpacing: expectedXSpacing,
                expectedYSpacing: expectedYSpacing,
                samplePositions: positions.slice(0, 10)
            };
        });

        console.log(`✅ Total cards: ${gridTest.totalCards}`);
        console.log(`✅ Unique X positions: ${gridTest.uniqueXPositions}`);
        console.log(`✅ Unique Y positions: ${gridTest.uniqueYPositions}`);
        console.log(`✅ Expected X spacing: ${gridTest.expectedXSpacing.toFixed(1)}px`);
        console.log(`✅ Expected Y spacing: ${gridTest.expectedYSpacing.toFixed(1)}px`);
        console.log(`✅ X positions: [${gridTest.xPositions.join(', ')}]`);
        console.log(`✅ Y positions: [${gridTest.yPositions.join(', ')}]`);
        
        const hasGridPattern = gridTest.uniqueXPositions > 1 && gridTest.uniqueYPositions > 1;
        
        if (hasGridPattern) {
            console.log('✅ SUCCESS: Cards follow a grid pattern!');
        } else {
            console.log('❌ ISSUE: Cards do not follow a grid pattern');
        }

        // Capture screenshot
        console.log('\n📸 Capturing fixed positioning screenshot...');
        const screenshotsDir = path.join(__dirname, '../screenshots');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const testPath = path.join(screenshotsDir, `fixed-positioning-${timestamp}.png`);
        
        await page.screenshot({
            path: testPath,
            fullPage: true
        });
        console.log(`✅ Fixed positioning screenshot saved: ${testPath}`);

        // Final assessment
        console.log('\n📋 FIXED POSITIONING TEST SUMMARY:');
        console.log('===================================');
        console.log(`No Overlaps: ${hasNoOverlaps ? '✅ WORKING' : '❌ BROKEN'}`);
        console.log(`No Out of Bounds: ${hasNoOutOfBounds ? '✅ WORKING' : '❌ BROKEN'}`);
        console.log(`Grid Pattern: ${hasGridPattern ? '✅ WORKING' : '❌ BROKEN'}`);
        
        const allTestsPassed = hasNoOverlaps && hasNoOutOfBounds && hasGridPattern;
        
        if (allTestsPassed) {
            console.log('\n🎉 FIXED POSITIONING SUCCESS: All tests passed!');
            console.log('✅ Cards are positioned correctly');
            console.log('✅ No overlaps between cards');
            console.log('✅ All cards within viewport');
            console.log('✅ Cards follow a grid pattern');
        } else {
            console.log('\n⚠️  FIXED POSITIONING ISSUES: Some tests failed');
            console.log('❌ Need to fix positioning issues');
        }

    } catch (error) {
        console.error('❌ Error testing fixed positioning:', error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Run the test
testFixedPositioning().catch(console.error);


