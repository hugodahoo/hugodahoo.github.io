#!/usr/bin/env node

/**
 * TEST COLUMN LAYOUT & 2.5:1 RATIO
 * Verify sections are columns and cards have correct ratio
 */

const puppeteer = require('puppeteer');
const path = require('path');

async function testColumnLayout() {
    console.log('📐 TESTING COLUMN LAYOUT & 2.5:1 RATIO');
    console.log('======================================\n');

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

        console.log('📊 TEST 1: COLUMN LAYOUT VERIFICATION');
        console.log('=====================================');

        // Test column layout
        const layoutTest = await page.evaluate(() => {
            const projectGrid = document.querySelector('.project-grid');
            const projectSections = document.querySelectorAll('.project-section');
            
            if (!projectGrid || projectSections.length === 0) {
                return { error: 'No project grid or sections found' };
            }
            
            const gridStyle = window.getComputedStyle(projectGrid);
            const sectionStyle = window.getComputedStyle(projectSections[0]);
            
            return {
                gridDisplay: gridStyle.display,
                gridFlexDirection: gridStyle.flexDirection,
                sectionDisplay: sectionStyle.display,
                sectionFlexDirection: sectionStyle.flexDirection,
                sectionPosition: sectionStyle.position,
                totalSections: projectSections.length
            };
        });

        if (layoutTest.error) {
            console.log(`❌ ${layoutTest.error}`);
        } else {
            console.log(`✅ Grid display: ${layoutTest.gridDisplay}`);
            console.log(`✅ Grid flex-direction: ${layoutTest.gridFlexDirection}`);
            console.log(`✅ Section display: ${layoutTest.sectionDisplay}`);
            console.log(`✅ Section flex-direction: ${layoutTest.sectionFlexDirection}`);
            console.log(`✅ Section position: ${layoutTest.sectionPosition}`);
            console.log(`✅ Total sections: ${layoutTest.totalSections}`);
            
            const isColumnLayout = layoutTest.gridFlexDirection === 'column' && 
                                 layoutTest.sectionFlexDirection === 'column';
            
            if (isColumnLayout) {
                console.log('✅ SUCCESS: Layout is using columns!');
            } else {
                console.log('❌ ISSUE: Layout is not using columns');
            }
        }

        console.log('\n📊 TEST 2: 2.5:1 RATIO VERIFICATION');
        console.log('===================================');

        // Test card dimensions
        const ratioTest = await page.evaluate(() => {
            const blocks = document.querySelectorAll('.project-block');
            const ratios = [];
            
            blocks.forEach((block, index) => {
                const rect = block.getBoundingClientRect();
                const ratio = rect.width / rect.height;
                ratios.push({
                    index: index + 1,
                    width: rect.width,
                    height: rect.height,
                    ratio: ratio,
                    expectedRatio: 2.5
                });
            });
            
            return {
                totalBlocks: blocks.length,
                ratios: ratios.slice(0, 5), // First 5 blocks
                averageRatio: ratios.reduce((sum, r) => sum + r.ratio, 0) / ratios.length
            };
        });

        console.log(`✅ Total blocks: ${ratioTest.totalBlocks}`);
        console.log(`✅ Average ratio: ${ratioTest.averageRatio.toFixed(2)}`);
        
        ratioTest.ratios.forEach(ratio => {
            console.log(`   Block ${ratio.index}: ${ratio.width.toFixed(1)}x${ratio.height.toFixed(1)} (ratio: ${ratio.ratio.toFixed(2)})`);
        });
        
        const isCorrectRatio = Math.abs(ratioTest.averageRatio - 2.5) < 0.1;
        
        if (isCorrectRatio) {
            console.log('✅ SUCCESS: Cards have 2.5:1 ratio!');
        } else {
            console.log('❌ ISSUE: Cards do not have 2.5:1 ratio');
        }

        console.log('\n📊 TEST 3: SECTION STRUCTURE');
        console.log('=============================');

        // Test section structure
        const sectionTest = await page.evaluate(() => {
            const sections = document.querySelectorAll('.project-section');
            const sectionInfo = [];
            
            sections.forEach((section, index) => {
                const rect = section.getBoundingClientRect();
                const blocks = section.querySelectorAll('.project-block');
                
                sectionInfo.push({
                    index: index + 1,
                    id: section.id,
                    width: rect.width,
                    height: rect.height,
                    blockCount: blocks.length,
                    top: rect.top,
                    left: rect.left
                });
            });
            
            return {
                totalSections: sections.length,
                sections: sectionInfo
            };
        });

        console.log(`✅ Total sections: ${sectionTest.totalSections}`);
        
        sectionTest.sections.forEach(section => {
            console.log(`   Section ${section.index} (${section.id}): ${section.width.toFixed(1)}x${section.height.toFixed(1)}, ${section.blockCount} blocks`);
        });

        // Capture screenshot
        console.log('\n📸 Capturing column layout screenshot...');
        const screenshotsDir = path.join(__dirname, '../screenshots');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const testPath = path.join(screenshotsDir, `column-layout-${timestamp}.png`);
        
        await page.screenshot({
            path: testPath,
            fullPage: true
        });
        console.log(`✅ Column layout screenshot saved: ${testPath}`);

        // Final assessment
        console.log('\n📋 COLUMN LAYOUT TEST SUMMARY:');
        console.log('==============================');
        console.log(`Column Layout: ${layoutTest?.gridFlexDirection === 'column' ? '✅ WORKING' : '❌ BROKEN'}`);
        console.log(`2.5:1 Ratio: ${isCorrectRatio ? '✅ WORKING' : '❌ BROKEN'}`);
        console.log(`Section Structure: ${sectionTest.totalSections > 0 ? '✅ WORKING' : '❌ BROKEN'}`);
        
        const allTestsPassed = layoutTest?.gridFlexDirection === 'column' && isCorrectRatio && sectionTest.totalSections > 0;
        
        if (allTestsPassed) {
            console.log('\n🎉 COLUMN LAYOUT SUCCESS: All tests passed!');
            console.log('✅ Sections are arranged in columns');
            console.log('✅ Cards have 2.5:1 width ratio');
            console.log('✅ Layout structure is correct');
        } else {
            console.log('\n⚠️  COLUMN LAYOUT ISSUES: Some tests failed');
            console.log('❌ Need to fix before proceeding');
        }

    } catch (error) {
        console.error('❌ Error testing column layout:', error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Run the test
testColumnLayout().catch(console.error);


