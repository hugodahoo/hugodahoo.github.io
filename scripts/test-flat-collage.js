#!/usr/bin/env node

/**
 * TEST FLAT COLLAGE AESTHETIC
 * Verify the flat design and project labels
 */

const puppeteer = require('puppeteer');
const path = require('path');

async function testFlatCollage() {
    console.log('🎨 TESTING FLAT COLLAGE AESTHETIC');
    console.log('==================================\n');

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

        console.log('📊 TEST 1: FLAT DESIGN VERIFICATION');
        console.log('===================================');

        // Test flat design properties
        const flatDesignTest = await page.evaluate(() => {
            const blocks = document.querySelectorAll('.project-block');
            const firstBlock = blocks[0];
            
            if (!firstBlock) {
                return { error: 'No blocks found' };
            }
            
            const computedStyle = window.getComputedStyle(firstBlock);
            
            return {
                borderRadius: computedStyle.borderRadius,
                boxShadow: computedStyle.boxShadow,
                backdropFilter: computedStyle.backdropFilter,
                transformStyle: computedStyle.transformStyle,
                perspective: computedStyle.perspective,
                border: computedStyle.border,
                background: computedStyle.background
            };
        });

        if (flatDesignTest.error) {
            console.log(`❌ ${flatDesignTest.error}`);
        } else {
            console.log(`✅ Border radius: ${flatDesignTest.borderRadius}`);
            console.log(`✅ Box shadow: ${flatDesignTest.boxShadow}`);
            console.log(`✅ Backdrop filter: ${flatDesignTest.backdropFilter}`);
            console.log(`✅ Transform style: ${flatDesignTest.transformStyle}`);
            console.log(`✅ Perspective: ${flatDesignTest.perspective}`);
            console.log(`✅ Border: ${flatDesignTest.border}`);
            console.log(`✅ Background: ${flatDesignTest.background}`);
            
            const isFlat = flatDesignTest.borderRadius === '0px' && 
                          flatDesignTest.boxShadow === 'none' && 
                          flatDesignTest.backdropFilter === 'none' &&
                          flatDesignTest.transformStyle === 'flat' &&
                          flatDesignTest.perspective === 'none';
            
            if (isFlat) {
                console.log('✅ SUCCESS: Design is flat and collage-like!');
            } else {
                console.log('❌ ISSUE: Design still has glossy effects');
            }
        }

        console.log('\n📊 TEST 2: PROJECT LABELS');
        console.log('==========================');

        // Test project labels
        const labelTest = await page.evaluate(() => {
            const blocks = document.querySelectorAll('.project-block');
            const labels = document.querySelectorAll('.project-label');
            
            return {
                totalBlocks: blocks.length,
                totalLabels: labels.length,
                hasLabels: labels.length > 0,
                labelTexts: Array.from(labels).slice(0, 3).map(label => label.textContent)
            };
        });

        console.log(`✅ Total blocks: ${labelTest.totalBlocks}`);
        console.log(`✅ Total labels: ${labelTest.totalLabels}`);
        console.log(`✅ Has labels: ${labelTest.hasLabels ? 'YES' : 'NO'}`);
        console.log(`✅ Sample labels: ${labelTest.labelTexts.join(', ')}`);
        
        if (labelTest.hasLabels && labelTest.totalLabels === labelTest.totalBlocks) {
            console.log('✅ SUCCESS: All blocks have project labels!');
        } else {
            console.log('❌ ISSUE: Missing project labels');
        }

        console.log('\n📊 TEST 3: COLOR VARIATIONS');
        console.log('============================');

        // Test color variations
        const colorTest = await page.evaluate(() => {
            const blocks = document.querySelectorAll('.project-block');
            const backgrounds = new Set();
            
            blocks.forEach(block => {
                const computedStyle = window.getComputedStyle(block);
                backgrounds.add(computedStyle.background);
            });
            
            return {
                totalBlocks: blocks.length,
                uniqueBackgrounds: backgrounds.size,
                backgrounds: Array.from(backgrounds).slice(0, 3)
            };
        });

        console.log(`✅ Total blocks: ${colorTest.totalBlocks}`);
        console.log(`✅ Unique backgrounds: ${colorTest.uniqueBackgrounds}`);
        console.log(`✅ Sample backgrounds: ${colorTest.backgrounds.join(', ')}`);
        
        if (colorTest.uniqueBackgrounds >= 3) {
            console.log('✅ SUCCESS: Color variations are working!');
        } else {
            console.log('❌ ISSUE: Not enough color variations');
        }

        // Capture screenshot
        console.log('\n📸 Capturing flat collage screenshot...');
        const screenshotsDir = path.join(__dirname, '../screenshots');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const testPath = path.join(screenshotsDir, `flat-collage-${timestamp}.png`);
        
        await page.screenshot({
            path: testPath,
            fullPage: true
        });
        console.log(`✅ Flat collage screenshot saved: ${testPath}`);

        // Final assessment
        console.log('\n📋 FLAT COLLAGE TEST SUMMARY:');
        console.log('==============================');
        console.log(`Flat Design: ${flatDesignTest?.borderRadius === '0px' ? '✅ WORKING' : '❌ BROKEN'}`);
        console.log(`Project Labels: ${labelTest.hasLabels ? '✅ WORKING' : '❌ BROKEN'}`);
        console.log(`Color Variations: ${colorTest.uniqueBackgrounds >= 3 ? '✅ WORKING' : '❌ BROKEN'}`);
        
        const allTestsPassed = flatDesignTest?.borderRadius === '0px' && labelTest.hasLabels && colorTest.uniqueBackgrounds >= 3;
        
        if (allTestsPassed) {
            console.log('\n🎉 FLAT COLLAGE SUCCESS: All tests passed!');
            console.log('✅ Design is flat and collage-like');
            console.log('✅ Project names appear under cards');
            console.log('✅ Color variations are diverse');
        } else {
            console.log('\n⚠️  FLAT COLLAGE ISSUES: Some tests failed');
            console.log('❌ Need to fix before proceeding');
        }

    } catch (error) {
        console.error('❌ Error testing flat collage:', error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Run the test
testFlatCollage().catch(console.error);


