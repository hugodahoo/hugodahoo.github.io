#!/usr/bin/env node

/**
 * PHASE 1 TEST SCRIPT
 * Test color variations and hover image functionality
 */

const puppeteer = require('puppeteer');
const path = require('path');

async function testPhase1() {
    console.log('🧪 TESTING PHASE 1: Color Variations & Hover Images');
    console.log('==================================================\n');

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
        await page.waitForTimeout(3000);

        console.log('📊 TEST 1: COLOR VARIATIONS');
        console.log('===========================');

        // Test color variations
        const colorTest = await page.evaluate(() => {
            const blocks = document.querySelectorAll('.project-block');
            const colorVariations = new Set();
            const categories = new Set();
            
            blocks.forEach((block, index) => {
                const classList = Array.from(block.classList);
                const variation = classList.find(cls => cls.startsWith('variation-'));
                const category = classList.find(cls => cls.startsWith('category-'));
                
                if (variation) colorVariations.add(variation);
                if (category) categories.add(category);
                
                // Log first few blocks for debugging
                if (index < 5) {
                    console.log(`Block ${index + 1}:`, {
                        classes: classList,
                        variation: variation,
                        category: category,
                        computedStyle: window.getComputedStyle(block).background
                    });
                }
            });
            
            return {
                totalBlocks: blocks.length,
                colorVariations: Array.from(colorVariations),
                categories: Array.from(categories),
                hasVariations: colorVariations.size > 0
            };
        });

        console.log(`✅ Total blocks: ${colorTest.totalBlocks}`);
        console.log(`✅ Color variations found: ${colorTest.colorVariations.join(', ')}`);
        console.log(`✅ Categories found: ${colorTest.categories.join(', ')}`);
        console.log(`✅ Has variations: ${colorTest.hasVariations ? 'YES' : 'NO'}`);

        if (colorTest.hasVariations && colorTest.colorVariations.length >= 2) {
            console.log('✅ SUCCESS: Color variations are working!');
        } else {
            console.log('❌ ISSUE: Color variations not working properly');
        }

        console.log('\n📊 TEST 2: HOVER IMAGE FUNCTIONALITY');
        console.log('=====================================');

        // Test hover functionality
        const hoverTest = await page.evaluate(() => {
            const blocks = document.querySelectorAll('.project-block');
            const firstBlock = blocks[0];
            
            if (!firstBlock) {
                return { error: 'No blocks found' };
            }
            
            // Check if unwrapped content exists
            const unwrappedContent = firstBlock.querySelector('.unwrapped-content');
            const imageContainer = firstBlock.querySelector('.project-image-container');
            const image = firstBlock.querySelector('.project-image');
            
            return {
                hasUnwrappedContent: !!unwrappedContent,
                hasImageContainer: !!imageContainer,
                hasImage: !!image,
                imageSrc: image ? image.src : null,
                imageContainerClasses: imageContainer ? Array.from(imageContainer.classList) : []
            };
        });

        if (hoverTest.error) {
            console.log(`❌ ${hoverTest.error}`);
        } else {
            console.log(`✅ Has unwrapped content: ${hoverTest.hasUnwrappedContent ? 'YES' : 'NO'}`);
            console.log(`✅ Has image container: ${hoverTest.hasImageContainer ? 'YES' : 'NO'}`);
            console.log(`✅ Has image: ${hoverTest.hasImage ? 'YES' : 'NO'}`);
            console.log(`✅ Image source: ${hoverTest.imageSrc || 'None'}`);
            console.log(`✅ Image container classes: ${hoverTest.imageContainerClasses.join(', ')}`);
            
            if (hoverTest.hasUnwrappedContent && hoverTest.hasImageContainer) {
                console.log('✅ SUCCESS: Hover image structure is in place!');
            } else {
                console.log('❌ ISSUE: Hover image structure missing');
            }
        }

        console.log('\n📊 TEST 3: HOVER INTERACTION');
        console.log('============================');

        // Test actual hover interaction
        const firstBlock = await page.$('.project-block');
        if (firstBlock) {
            console.log('🖱️  Testing hover interaction...');
            
            // Hover over the first block
            await firstBlock.hover();
            await page.waitForTimeout(1000);
            
            // Check if hover state is active
            const hoverState = await page.evaluate(() => {
                const hoveredBlock = document.querySelector('.project-block:hover');
                const unwrappedContent = document.querySelector('.project-block:hover .unwrapped-content');
                
                return {
                    hasHoveredBlock: !!hoveredBlock,
                    hasVisibleUnwrappedContent: !!unwrappedContent,
                    unwrappedOpacity: unwrappedContent ? window.getComputedStyle(unwrappedContent).opacity : '0'
                };
            });
            
            console.log(`✅ Block is hovered: ${hoverState.hasHoveredBlock ? 'YES' : 'NO'}`);
            console.log(`✅ Unwrapped content visible: ${hoverState.hasVisibleUnwrappedContent ? 'YES' : 'NO'}`);
            console.log(`✅ Unwrapped content opacity: ${hoverState.unwrappedOpacity}`);
            
            if (hoverState.hasHoveredBlock && parseFloat(hoverState.unwrappedOpacity) > 0.5) {
                console.log('✅ SUCCESS: Hover interaction is working!');
            } else {
                console.log('❌ ISSUE: Hover interaction not working properly');
            }
        }

        // Capture screenshot
        console.log('\n📸 Capturing Phase 1 test screenshot...');
        const screenshotsDir = path.join(__dirname, '../screenshots');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const testPath = path.join(screenshotsDir, `phase1-test-${timestamp}.png`);
        
        await page.screenshot({
            path: testPath,
            fullPage: true
        });
        console.log(`✅ Test screenshot saved: ${testPath}`);

        // Final assessment
        console.log('\n📋 PHASE 1 TEST SUMMARY:');
        console.log('=========================');
        console.log(`Color Variations: ${colorTest.hasVariations ? '✅ WORKING' : '❌ BROKEN'}`);
        console.log(`Hover Structure: ${hoverTest.hasUnwrappedContent ? '✅ WORKING' : '❌ BROKEN'}`);
        console.log(`Hover Interaction: ${hoverState?.hasHoveredBlock ? '✅ WORKING' : '❌ BROKEN'}`);
        
        const allTestsPassed = colorTest.hasVariations && hoverTest.hasUnwrappedContent && hoverState?.hasHoveredBlock;
        
        if (allTestsPassed) {
            console.log('\n🎉 PHASE 1 SUCCESS: All tests passed!');
            console.log('✅ Ready to move to Phase 2');
        } else {
            console.log('\n⚠️  PHASE 1 ISSUES: Some tests failed');
            console.log('❌ Do NOT move to Phase 2 yet');
        }

    } catch (error) {
        console.error('❌ Error testing Phase 1:', error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Run the test
testPhase1().catch(console.error);


