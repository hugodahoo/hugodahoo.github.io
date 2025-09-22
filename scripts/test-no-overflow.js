#!/usr/bin/env node

/**
 * TEST NO OVERFLOW & BETTER POSITIONING
 * Verify cards don't overflow and are positioned better
 */

const puppeteer = require('puppeteer');
const path = require('path');

async function testNoOverflow() {
    console.log('🚫 TESTING NO OVERFLOW & BETTER POSITIONING');
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

        console.log('📊 TEST 1: OVERFLOW CHECK');
        console.log('========================');

        // Test for overflow
        const overflowTest = await page.evaluate(() => {
            const blocks = document.querySelectorAll('.project-block');
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            const overflowInfo = Array.from(blocks).map((block, index) => {
                const rect = block.getBoundingClientRect();
                return {
                    index: index + 1,
                    x: rect.left,
                    y: rect.top,
                    width: rect.width,
                    height: rect.height,
                    right: rect.right,
                    bottom: rect.bottom,
                    overflowsRight: rect.right > viewportWidth,
                    overflowsBottom: rect.bottom > viewportHeight,
                    overflowsLeft: rect.left < 0,
                    overflowsTop: rect.top < 0
                };
            });
            
            const totalOverflows = overflowInfo.filter(info => 
                info.overflowsRight || info.overflowsBottom || info.overflowsLeft || info.overflowsTop
            );
            
            return {
                totalCards: blocks.length,
                overflowCards: totalOverflows.length,
                overflowPercent: (totalOverflows.length / blocks.length) * 100,
                rightOverflows: overflowInfo.filter(info => info.overflowsRight).length,
                bottomOverflows: overflowInfo.filter(info => info.overflowsBottom).length,
                leftOverflows: overflowInfo.filter(info => info.overflowsLeft).length,
                topOverflows: overflowInfo.filter(info => info.overflowsTop).length,
                samples: overflowInfo.slice(0, 5)
            };
        });

        console.log(`✅ Total cards: ${overflowTest.totalCards}`);
        console.log(`✅ Overflow cards: ${overflowTest.overflowCards}`);
        console.log(`✅ Overflow percentage: ${overflowTest.overflowPercent.toFixed(1)}%`);
        console.log(`✅ Right overflows: ${overflowTest.rightOverflows}`);
        console.log(`✅ Bottom overflows: ${overflowTest.bottomOverflows}`);
        console.log(`✅ Left overflows: ${overflowTest.leftOverflows}`);
        console.log(`✅ Top overflows: ${overflowTest.topOverflows}`);
        
        overflowTest.samples.forEach(sample => {
            console.log(`   Card ${sample.index}: ${sample.width.toFixed(1)}x${sample.height.toFixed(1)} at (${sample.x.toFixed(1)}, ${sample.y.toFixed(1)})`);
            if (sample.overflowsRight || sample.overflowsBottom || sample.overflowsLeft || sample.overflowsTop) {
                console.log(`     ⚠️  OVERFLOWS: Right:${sample.overflowsRight} Bottom:${sample.overflowsBottom} Left:${sample.overflowsLeft} Top:${sample.overflowsTop}`);
            }
        });
        
        const hasMinimalOverflow = overflowTest.overflowPercent < 10;
        
        if (hasMinimalOverflow) {
            console.log('✅ SUCCESS: Minimal overflow detected!');
        } else {
            console.log('❌ ISSUE: Too many cards are overflowing');
        }

        console.log('\n📊 TEST 2: CARD SIZES');
        console.log('=====================');

        // Test card sizes
        const sizeTest = await page.evaluate(() => {
            const blocks = document.querySelectorAll('.project-block');
            const sizes = Array.from(blocks).map((block, index) => {
                const rect = block.getBoundingClientRect();
                const ratio = rect.width / rect.height;
                return {
                    index: index + 1,
                    width: rect.width,
                    height: rect.height,
                    ratio: ratio,
                    expectedRatio: 2.5
                };
            });
            
            const averageRatio = sizes.reduce((sum, s) => sum + s.ratio, 0) / sizes.length;
            const sizeVariations = {
                small: sizes.filter(s => s.width <= 85).length,
                medium: sizes.filter(s => s.width > 85 && s.width <= 105).length,
                large: sizes.filter(s => s.width > 105 && s.width <= 125).length,
                xlarge: sizes.filter(s => s.width > 125).length
            };
            
            return {
                totalCards: blocks.length,
                averageRatio: averageRatio,
                sizeVariations: sizeVariations,
                samples: sizes.slice(0, 5)
            };
        });

        console.log(`✅ Total cards: ${sizeTest.totalCards}`);
        console.log(`✅ Average ratio: ${sizeTest.averageRatio.toFixed(2)}`);
        console.log(`✅ Size distribution:`);
        console.log(`   Small (≤85px): ${sizeTest.sizeVariations.small} cards`);
        console.log(`   Medium (85-105px): ${sizeTest.sizeVariations.medium} cards`);
        console.log(`   Large (105-125px): ${sizeTest.sizeVariations.large} cards`);
        console.log(`   XLarge (>125px): ${sizeTest.sizeVariations.xlarge} cards`);
        
        sizeTest.samples.forEach(sample => {
            console.log(`   Card ${sample.index}: ${sample.width.toFixed(1)}x${sample.height.toFixed(1)} (ratio: ${sample.ratio.toFixed(2)})`);
        });
        
        const hasCorrectRatio = Math.abs(sizeTest.averageRatio - 2.5) < 0.1;
        
        if (hasCorrectRatio) {
            console.log('✅ SUCCESS: Cards maintain 2.5:1 ratio!');
        } else {
            console.log('❌ ISSUE: Cards do not maintain correct ratio');
        }

        console.log('\n📊 TEST 3: POSITIONING QUALITY');
        console.log('===============================');

        // Test positioning quality
        const positioningTest = await page.evaluate(() => {
            const blocks = document.querySelectorAll('.project-block');
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            // Calculate positioning statistics
            const positions = Array.from(blocks).map(block => {
                const rect = block.getBoundingClientRect();
                return {
                    x: rect.left,
                    y: rect.top,
                    width: rect.width,
                    height: rect.height
                };
            });
            
            const minX = Math.min(...positions.map(p => p.x));
            const maxX = Math.max(...positions.map(p => p.x + p.width));
            const minY = Math.min(...positions.map(p => p.y));
            const maxY = Math.max(...positions.map(p => p.y + p.height));
            
            const widthUsage = ((maxX - minX) / viewportWidth) * 100;
            const heightUsage = ((maxY - minY) / viewportHeight) * 100;
            
            // Check if cards are well distributed
            const leftZone = positions.filter(p => p.x < viewportWidth * 0.25).length;
            const rightZone = positions.filter(p => p.x > viewportWidth * 0.75).length;
            const topZone = positions.filter(p => p.y < viewportHeight * 0.25).length;
            const bottomZone = positions.filter(p => p.y > viewportHeight * 0.75).length;
            
            return {
                totalCards: blocks.length,
                viewportSize: { width: viewportWidth, height: viewportHeight },
                cardBounds: { minX, maxX, minY, maxY },
                usage: { width: widthUsage, height: heightUsage },
                distribution: { left: leftZone, right: rightZone, top: topZone, bottom: bottomZone }
            };
        });

        console.log(`✅ Total cards: ${positioningTest.totalCards}`);
        console.log(`✅ Viewport: ${positioningTest.viewportSize.width}x${positioningTest.viewportSize.height}`);
        console.log(`✅ Card bounds: X(${positioningTest.cardBounds.minX.toFixed(1)}-${positioningTest.cardBounds.maxX.toFixed(1)}), Y(${positioningTest.cardBounds.minY.toFixed(1)}-${positioningTest.cardBounds.maxY.toFixed(1)})`);
        console.log(`✅ Width usage: ${positioningTest.usage.width.toFixed(1)}%`);
        console.log(`✅ Height usage: ${positioningTest.usage.height.toFixed(1)}%`);
        console.log(`✅ Distribution: Left:${positioningTest.distribution.left} Right:${positioningTest.distribution.right} Top:${positioningTest.distribution.top} Bottom:${positioningTest.distribution.bottom}`);
        
        const hasGoodDistribution = positioningTest.distribution.left > 0 && positioningTest.distribution.right > 0;
        const hasReasonableHeight = positioningTest.usage.height < 90;
        
        if (hasGoodDistribution && hasReasonableHeight) {
            console.log('✅ SUCCESS: Good positioning and distribution!');
        } else {
            console.log('❌ ISSUE: Poor positioning or distribution');
        }

        // Capture screenshot
        console.log('\n📸 Capturing no overflow screenshot...');
        const screenshotsDir = path.join(__dirname, '../screenshots');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const testPath = path.join(screenshotsDir, `no-overflow-${timestamp}.png`);
        
        await page.screenshot({
            path: testPath,
            fullPage: true
        });
        console.log(`✅ No overflow screenshot saved: ${testPath}`);

        // Final assessment
        console.log('\n📋 NO OVERFLOW TEST SUMMARY:');
        console.log('============================');
        console.log(`Minimal Overflow: ${hasMinimalOverflow ? '✅ WORKING' : '❌ BROKEN'}`);
        console.log(`Correct Ratio: ${hasCorrectRatio ? '✅ WORKING' : '❌ BROKEN'}`);
        console.log(`Good Positioning: ${hasGoodDistribution && hasReasonableHeight ? '✅ WORKING' : '❌ BROKEN'}`);
        
        const allTestsPassed = hasMinimalOverflow && hasCorrectRatio && hasGoodDistribution && hasReasonableHeight;
        
        if (allTestsPassed) {
            console.log('\n🎉 NO OVERFLOW SUCCESS: All tests passed!');
            console.log('✅ Cards do not overflow viewport');
            console.log('✅ Cards maintain 2.5:1 ratio');
            console.log('✅ Good positioning and distribution');
            console.log('✅ Reduced scrolling required');
        } else {
            console.log('\n⚠️  NO OVERFLOW ISSUES: Some tests failed');
            console.log('❌ Need to fix before proceeding');
        }

    } catch (error) {
        console.error('❌ Error testing no overflow:', error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Run the test
testNoOverflow().catch(console.error);


