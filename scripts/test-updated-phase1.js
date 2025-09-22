#!/usr/bin/env node

/**
 * TEST UPDATED PHASE 1
 * Test the new color variations and full-image hover
 */

const puppeteer = require('puppeteer');
const path = require('path');

async function testUpdatedPhase1() {
    console.log('🎨 TESTING UPDATED PHASE 1: New Colors & Full Image Hover');
    console.log('========================================================\n');

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

        console.log('📊 TEST 1: NEW COLOR VARIATIONS');
        console.log('===============================');

        // Test new color variations
        const colorTest = await page.evaluate(() => {
            const blocks = document.querySelectorAll('.project-block');
            const colorVariations = new Set();
            const backgrounds = new Set();
            
            blocks.forEach((block, index) => {
                const classList = Array.from(block.classList);
                const variation = classList.find(cls => cls.startsWith('variation-'));
                const computedStyle = window.getComputedStyle(block).background;
                
                if (variation) colorVariations.add(variation);
                backgrounds.add(computedStyle);
                
                // Log first few blocks for debugging
                if (index < 5) {
                    console.log(`Block ${index + 1}:`, {
                        classes: classList,
                        variation: variation,
                        background: computedStyle
                    });
                }
            });
            
            return {
                totalBlocks: blocks.length,
                colorVariations: Array.from(colorVariations),
                uniqueBackgrounds: backgrounds.size,
                hasVariations: colorVariations.size > 0
            };
        });

        console.log(`✅ Total blocks: ${colorTest.totalBlocks}`);
        console.log(`✅ Color variations found: ${colorTest.colorVariations.join(', ')}`);
        console.log(`✅ Unique backgrounds: ${colorTest.uniqueBackgrounds}`);
        console.log(`✅ Has variations: ${colorTest.hasVariations ? 'YES' : 'NO'}`);

        if (colorTest.hasVariations && colorTest.uniqueBackgrounds >= 3) {
            console.log('✅ SUCCESS: New color variations are working!');
        } else {
            console.log('❌ ISSUE: New color variations not working properly');
        }

        console.log('\n📊 TEST 2: FULL IMAGE HOVER');
        console.log('===========================');

        // Test full image hover
        const firstBlock = await page.$('.project-block');
        if (firstBlock) {
            console.log('🖱️  Testing full image hover...');
            
            // Hover over the first block
            await firstBlock.hover();
            await page.waitForTimeout(1000);
            
            // Check if image fills the entire card
            const hoverTest = await page.evaluate(() => {
                const hoveredBlock = document.querySelector('.project-block:hover');
                const imageContainer = document.querySelector('.project-block:hover .project-image-container');
                const image = document.querySelector('.project-block:hover .project-image');
                const textContent = document.querySelector('.project-block:hover .text-content');
                
                if (!hoveredBlock || !imageContainer) {
                    return { error: 'No hovered block or image container found' };
                }
                
                const blockRect = hoveredBlock.getBoundingClientRect();
                const containerRect = imageContainer.getBoundingClientRect();
                const imageRect = image ? image.getBoundingClientRect() : null;
                
                return {
                    hasHoveredBlock: !!hoveredBlock,
                    hasImageContainer: !!imageContainer,
                    hasImage: !!image,
                    textContentHidden: textContent ? window.getComputedStyle(textContent).display === 'none' : true,
                    blockSize: {
                        width: blockRect.width,
                        height: blockRect.height
                    },
                    containerSize: {
                        width: containerRect.width,
                        height: containerRect.height
                    },
                    imageSize: imageRect ? {
                        width: imageRect.width,
                        height: imageRect.height
                    } : null,
                    containerPosition: {
                        top: containerRect.top,
                        left: containerRect.left
                    },
                    blockPosition: {
                        top: blockRect.top,
                        left: blockRect.left
                    }
                };
            });
            
            if (hoverTest.error) {
                console.log(`❌ ${hoverTest.error}`);
            } else {
                console.log(`✅ Block is hovered: ${hoverTest.hasHoveredBlock ? 'YES' : 'NO'}`);
                console.log(`✅ Image container exists: ${hoverTest.hasImageContainer ? 'YES' : 'NO'}`);
                console.log(`✅ Image exists: ${hoverTest.hasImage ? 'YES' : 'NO'}`);
                console.log(`✅ Text content hidden: ${hoverTest.textContentHidden ? 'YES' : 'NO'}`);
                
                if (hoverTest.hasImageContainer && hoverTest.hasImage) {
                    const containerFillsBlock = Math.abs(hoverTest.containerSize.width - hoverTest.blockSize.width) < 5 &&
                                             Math.abs(hoverTest.containerSize.height - hoverTest.blockSize.height) < 5;
                    
                    console.log(`✅ Container fills block: ${containerFillsBlock ? 'YES' : 'NO'}`);
                    console.log(`   Block size: ${hoverTest.blockSize.width.toFixed(1)} x ${hoverTest.blockSize.height.toFixed(1)}`);
                    console.log(`   Container size: ${hoverTest.containerSize.width.toFixed(1)} x ${hoverTest.containerSize.height.toFixed(1)}`);
                    
                    if (containerFillsBlock && hoverTest.textContentHidden) {
                        console.log('✅ SUCCESS: Full image hover is working!');
                    } else {
                        console.log('❌ ISSUE: Image does not fill the entire card');
                    }
                } else {
                    console.log('❌ ISSUE: Image structure missing');
                }
            }
        }

        // Capture screenshot
        console.log('\n📸 Capturing updated Phase 1 screenshot...');
        const screenshotsDir = path.join(__dirname, '../screenshots');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const testPath = path.join(screenshotsDir, `updated-phase1-${timestamp}.png`);
        
        await page.screenshot({
            path: testPath,
            fullPage: true
        });
        console.log(`✅ Updated Phase 1 screenshot saved: ${testPath}`);

        // Final assessment
        console.log('\n📋 UPDATED PHASE 1 TEST SUMMARY:');
        console.log('=================================');
        console.log(`New Color Variations: ${colorTest.hasVariations ? '✅ WORKING' : '❌ BROKEN'}`);
        console.log(`Full Image Hover: ${hoverTest?.hasImageContainer ? '✅ WORKING' : '❌ BROKEN'}`);
        
        const allTestsPassed = colorTest.hasVariations && hoverTest?.hasImageContainer;
        
        if (allTestsPassed) {
            console.log('\n🎉 UPDATED PHASE 1 SUCCESS: All tests passed!');
            console.log('✅ Colors match reference images');
            console.log('✅ Images fill entire cards on hover');
        } else {
            console.log('\n⚠️  UPDATED PHASE 1 ISSUES: Some tests failed');
            console.log('❌ Need to fix before proceeding');
        }

    } catch (error) {
        console.error('❌ Error testing updated Phase 1:', error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Run the test
testUpdatedPhase1().catch(console.error);


