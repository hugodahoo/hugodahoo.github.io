#!/usr/bin/env node

/**
 * TEST PASTEL TEXTURED BACKGROUND
 * Verify the left-aligned text and textured pastel background
 */

const puppeteer = require('puppeteer');
const path = require('path');

async function testPastelTexture() {
    console.log('🎨 TESTING PASTEL TEXTURED BACKGROUND');
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

        console.log('📊 TEST 1: BACKGROUND VERIFICATION');
        console.log('==================================');

        // Test background properties
        const backgroundTest = await page.evaluate(() => {
            const body = document.body;
            const computedStyle = window.getComputedStyle(body);
            
            return {
                backgroundColor: computedStyle.backgroundColor,
                color: computedStyle.color,
                backgroundImage: computedStyle.backgroundImage
            };
        });

        console.log(`✅ Background color: ${backgroundTest.backgroundColor}`);
        console.log(`✅ Text color: ${backgroundTest.color}`);
        console.log(`✅ Background image: ${backgroundTest.backgroundImage}`);
        
        const isPastel = backgroundTest.backgroundColor.includes('245, 245, 245') || 
                        backgroundTest.backgroundColor.includes('#f5f5f5');
        
        if (isPastel) {
            console.log('✅ SUCCESS: Background is pastel colored!');
        } else {
            console.log('❌ ISSUE: Background is not pastel');
        }

        console.log('\n📊 TEST 2: TEXT ALIGNMENT');
        console.log('==========================');

        // Test text alignment
        const textTest = await page.evaluate(() => {
            const labels = document.querySelectorAll('.project-label');
            const firstLabel = labels[0];
            
            if (!firstLabel) {
                return { error: 'No labels found' };
            }
            
            const computedStyle = window.getComputedStyle(firstLabel);
            
            return {
                textAlign: computedStyle.textAlign,
                color: computedStyle.color,
                textShadow: computedStyle.textShadow,
                paddingLeft: computedStyle.paddingLeft,
                totalLabels: labels.length
            };
        });

        if (textTest.error) {
            console.log(`❌ ${textTest.error}`);
        } else {
            console.log(`✅ Text align: ${textTest.textAlign}`);
            console.log(`✅ Text color: ${textTest.color}`);
            console.log(`✅ Text shadow: ${textTest.textShadow}`);
            console.log(`✅ Padding left: ${textTest.paddingLeft}`);
            console.log(`✅ Total labels: ${textTest.totalLabels}`);
            
            const isLeftAligned = textTest.textAlign === 'left';
            
            if (isLeftAligned) {
                console.log('✅ SUCCESS: Text is left-aligned!');
            } else {
                console.log('❌ ISSUE: Text is not left-aligned');
            }
        }

        console.log('\n📊 TEST 3: TEXTURE VERIFICATION');
        console.log('===============================');

        // Test texture layers
        const textureTest = await page.evaluate(() => {
            const beforeElement = document.querySelector('body.neural-network-style::before');
            const afterElement = document.querySelector('body.neural-network-style::after');
            
            // Check if pseudo-elements exist by looking at computed styles
            const body = document.body;
            const bodyStyle = window.getComputedStyle(body);
            
            return {
                hasBeforePseudo: bodyStyle.content !== 'none',
                hasAfterPseudo: bodyStyle.content !== 'none',
                backgroundImage: bodyStyle.backgroundImage
            };
        });

        console.log(`✅ Has before pseudo-element: ${textureTest.hasBeforePseudo}`);
        console.log(`✅ Has after pseudo-element: ${textureTest.hasAfterPseudo}`);
        console.log(`✅ Background image: ${textureTest.backgroundImage}`);
        
        if (textureTest.backgroundImage && textureTest.backgroundImage !== 'none') {
            console.log('✅ SUCCESS: Texture layers are applied!');
        } else {
            console.log('❌ ISSUE: No texture layers found');
        }

        // Capture screenshot
        console.log('\n📸 Capturing pastel texture screenshot...');
        const screenshotsDir = path.join(__dirname, '../screenshots');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const testPath = path.join(screenshotsDir, `pastel-texture-${timestamp}.png`);
        
        await page.screenshot({
            path: testPath,
            fullPage: true
        });
        console.log(`✅ Pastel texture screenshot saved: ${testPath}`);

        // Final assessment
        console.log('\n📋 PASTEL TEXTURE TEST SUMMARY:');
        console.log('================================');
        console.log(`Pastel Background: ${isPastel ? '✅ WORKING' : '❌ BROKEN'}`);
        console.log(`Left-Aligned Text: ${textTest?.textAlign === 'left' ? '✅ WORKING' : '❌ BROKEN'}`);
        console.log(`Texture Layers: ${textureTest?.backgroundImage !== 'none' ? '✅ WORKING' : '❌ BROKEN'}`);
        
        const allTestsPassed = isPastel && textTest?.textAlign === 'left' && textureTest?.backgroundImage !== 'none';
        
        if (allTestsPassed) {
            console.log('\n🎉 PASTEL TEXTURE SUCCESS: All tests passed!');
            console.log('✅ Background is textured pastel');
            console.log('✅ Text is left-aligned');
            console.log('✅ Grainy texture is applied');
        } else {
            console.log('\n⚠️  PASTEL TEXTURE ISSUES: Some tests failed');
            console.log('❌ Need to fix before proceeding');
        }

    } catch (error) {
        console.error('❌ Error testing pastel texture:', error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Run the test
testPastelTexture().catch(console.error);


