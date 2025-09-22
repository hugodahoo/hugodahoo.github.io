#!/usr/bin/env node

/**
 * TEST SCROLLING SECTION TITLES
 * Verify scrolling background titles are working
 */

const puppeteer = require('puppeteer');
const path = require('path');

async function testScrollingTitles() {
    console.log('📜 TESTING SCROLLING SECTION TITLES');
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

        console.log('📊 TEST 1: SECTION TITLES PRESENCE');
        console.log('=================================');

        // Test section titles presence
        const titlesTest = await page.evaluate(() => {
            const sectionTitles = document.querySelectorAll('.section-title');
            const titles = Array.from(sectionTitles).map((title, index) => {
                const computedStyle = window.getComputedStyle(title);
                const rect = title.getBoundingClientRect();
                
                return {
                    index: index + 1,
                    text: title.textContent,
                    fontSize: computedStyle.fontSize,
                    color: computedStyle.color,
                    fontFamily: computedStyle.fontFamily,
                    fontWeight: computedStyle.fontWeight,
                    position: computedStyle.position,
                    zIndex: computedStyle.zIndex,
                    width: rect.width,
                    height: rect.height,
                    top: rect.top,
                    left: rect.left
                };
            });
            
            return {
                totalTitles: sectionTitles.length,
                titles: titles
            };
        });

        console.log(`✅ Total section titles: ${titlesTest.totalTitles}`);
        
        titlesTest.titles.forEach(title => {
            console.log(`   Title ${title.index}: "${title.text}"`);
            console.log(`     Font size: ${title.fontSize}`);
            console.log(`     Color: ${title.color}`);
            console.log(`     Font family: ${title.fontFamily}`);
            console.log(`     Font weight: ${title.fontWeight}`);
            console.log(`     Position: ${title.position}`);
            console.log(`     Z-index: ${title.zIndex}`);
            console.log(`     Size: ${title.width.toFixed(1)}x${title.height.toFixed(1)}`);
            console.log(`     Position: (${title.left.toFixed(1)}, ${title.top.toFixed(1)})`);
        });
        
        const hasTitles = titlesTest.totalTitles > 0;
        const hasCorrectTexts = titlesTest.titles.some(t => t.text === 'INSTALLATIONS') && 
                              titlesTest.titles.some(t => t.text === 'GENERATIVE') &&
                              titlesTest.titles.some(t => t.text === 'PERFORMANCES') &&
                              titlesTest.titles.some(t => t.text === 'COMMERCIAL');
        
        if (hasTitles && hasCorrectTexts) {
            console.log('✅ SUCCESS: Section titles are present with correct text!');
        } else {
            console.log('❌ ISSUE: Section titles missing or incorrect text');
        }

        console.log('\n📊 TEST 2: TITLE STYLING');
        console.log('========================');

        // Test title styling
        const stylingTest = await page.evaluate(() => {
            const sectionTitles = document.querySelectorAll('.section-title');
            const styling = Array.from(sectionTitles).map((title, index) => {
                const computedStyle = window.getComputedStyle(title);
                
                return {
                    index: index + 1,
                    fontSize: computedStyle.fontSize,
                    color: computedStyle.color,
                    fontFamily: computedStyle.fontFamily,
                    fontWeight: computedStyle.fontWeight,
                    opacity: computedStyle.opacity,
                    pointerEvents: computedStyle.pointerEvents,
                    whiteSpace: computedStyle.whiteSpace,
                    animation: computedStyle.animation
                };
            });
            
            return {
                totalTitles: sectionTitles.length,
                styling: styling
            };
        });

        console.log(`✅ Total titles: ${stylingTest.totalTitles}`);
        
        stylingTest.styling.forEach(style => {
            console.log(`   Title ${style.index} styling:`);
            console.log(`     Font size: ${style.fontSize}`);
            console.log(`     Color: ${style.color}`);
            console.log(`     Font family: ${style.fontFamily}`);
            console.log(`     Font weight: ${style.fontWeight}`);
            console.log(`     Opacity: ${style.opacity}`);
            console.log(`     Pointer events: ${style.pointerEvents}`);
            console.log(`     White space: ${style.whiteSpace}`);
            console.log(`     Animation: ${style.animation}`);
        });
        
        const hasLargeFont = stylingTest.styling.every(s => parseFloat(s.fontSize) >= 100);
        const hasPaleColor = stylingTest.styling.every(s => s.color.includes('rgba(200, 200, 200') || s.color.includes('rgba(200,200,200'));
        const hasAnimation = stylingTest.styling.every(s => s.animation && s.animation !== 'none');
        
        if (hasLargeFont && hasPaleColor && hasAnimation) {
            console.log('✅ SUCCESS: Titles have correct styling!');
        } else {
            console.log('❌ ISSUE: Titles do not have correct styling');
        }

        console.log('\n📊 TEST 3: ANIMATION VERIFICATION');
        console.log('=================================');

        // Test animation
        const animationTest = await page.evaluate(() => {
            const sectionTitles = document.querySelectorAll('.section-title');
            
            // Check if animation is running by comparing positions over time
            const positions = Array.from(sectionTitles).map((title, index) => {
                const rect = title.getBoundingClientRect();
                return {
                    index: index + 1,
                    text: title.textContent,
                    x: rect.left,
                    y: rect.top,
                    width: rect.width,
                    height: rect.height
                };
            });
            
            return {
                totalTitles: sectionTitles.length,
                positions: positions
            };
        });

        console.log(`✅ Total titles: ${animationTest.totalTitles}`);
        
        animationTest.positions.forEach(pos => {
            console.log(`   Title ${pos.index} ("${pos.text}"):`);
            console.log(`     Position: (${pos.x.toFixed(1)}, ${pos.y.toFixed(1)})`);
            console.log(`     Size: ${pos.width.toFixed(1)}x${pos.height.toFixed(1)}`);
        });
        
        // Wait a bit and check positions again to see if they changed
        await page.waitForTimeout(2000);
        
        const animationTest2 = await page.evaluate(() => {
            const sectionTitles = document.querySelectorAll('.section-title');
            const positions = Array.from(sectionTitles).map((title, index) => {
                const rect = title.getBoundingClientRect();
                return {
                    index: index + 1,
                    x: rect.left,
                    y: rect.top
                };
            });
            
            return {
                totalTitles: sectionTitles.length,
                positions: positions
            };
        });

        console.log(`✅ After 2 seconds:`);
        animationTest2.positions.forEach(pos => {
            console.log(`   Title ${pos.index}: Position (${pos.x.toFixed(1)}, ${pos.y.toFixed(1)})`);
        });
        
        // Check if positions changed (indicating animation)
        const positionsChanged = animationTest.positions.some((pos1, index) => {
            const pos2 = animationTest2.positions[index];
            return Math.abs(pos1.x - pos2.x) > 1 || Math.abs(pos1.y - pos2.y) > 1;
        });
        
        if (positionsChanged) {
            console.log('✅ SUCCESS: Titles are animating (positions changed)!');
        } else {
            console.log('❌ ISSUE: Titles are not animating (positions static)');
        }

        // Capture screenshot
        console.log('\n📸 Capturing scrolling titles screenshot...');
        const screenshotsDir = path.join(__dirname, '../screenshots');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const testPath = path.join(screenshotsDir, `scrolling-titles-${timestamp}.png`);
        
        await page.screenshot({
            path: testPath,
            fullPage: true
        });
        console.log(`✅ Scrolling titles screenshot saved: ${testPath}`);

        // Final assessment
        console.log('\n📋 SCROLLING TITLES TEST SUMMARY:');
        console.log('==================================');
        console.log(`Titles Present: ${hasTitles ? '✅ WORKING' : '❌ BROKEN'}`);
        console.log(`Correct Text: ${hasCorrectTexts ? '✅ WORKING' : '❌ BROKEN'}`);
        console.log(`Large Font: ${hasLargeFont ? '✅ WORKING' : '❌ BROKEN'}`);
        console.log(`Pale Color: ${hasPaleColor ? '✅ WORKING' : '❌ BROKEN'}`);
        console.log(`Animation: ${hasAnimation ? '✅ WORKING' : '❌ BROKEN'}`);
        console.log(`Positions Moving: ${positionsChanged ? '✅ WORKING' : '❌ BROKEN'}`);
        
        const allTestsPassed = hasTitles && hasCorrectTexts && hasLargeFont && hasPaleColor && hasAnimation && positionsChanged;
        
        if (allTestsPassed) {
            console.log('\n🎉 SCROLLING TITLES SUCCESS: All tests passed!');
            console.log('✅ Section titles are present');
            console.log('✅ Titles have correct text (INSTALLATIONS, GENERATIVE, etc.)');
            console.log('✅ Large font size (120px)');
            console.log('✅ Pale gray color');
            console.log('✅ Scrolling animation');
            console.log('✅ Titles are moving across the screen');
        } else {
            console.log('\n⚠️  SCROLLING TITLES ISSUES: Some tests failed');
            console.log('❌ Need to fix before proceeding');
        }

    } catch (error) {
        console.error('❌ Error testing scrolling titles:', error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Run the test
testScrollingTitles().catch(console.error);


