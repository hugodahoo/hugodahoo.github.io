#!/usr/bin/env node

/**
 * DEBUG CONNECTIONS SCRIPT
 * Step-by-step verification that connections are visible and connected to cards
 */

const puppeteer = require('puppeteer');
const path = require('path');

async function debugConnections() {
    console.log('🔍 DEBUGGING CONNECTION VISIBILITY');
    console.log('===================================\n');

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

        console.log('📊 STEP 1: CHECKING BASIC ELEMENTS');
        console.log('==================================');

        // Check if neural network style is active
        const isNeuralActive = await page.evaluate(() => {
            return document.body.classList.contains('neural-network-style');
        });
        console.log(`✅ Neural network style active: ${isNeuralActive}`);

        // Count project blocks
        const blockCount = await page.evaluate(() => {
            return document.querySelectorAll('.project-block').length;
        });
        console.log(`📦 Project blocks found: ${blockCount}`);

        // Count connection paths
        const connectionCount = await page.evaluate(() => {
            return document.querySelectorAll('.connection-path').length;
        });
        console.log(`🔗 Connection paths found: ${connectionCount}`);

        console.log('\n📊 STEP 2: CHECKING CONNECTION VISIBILITY');
        console.log('==========================================');

        // Check if any connections are actually visible
        const visibilityCheck = await page.evaluate(() => {
            const paths = document.querySelectorAll('.connection-path');
            let visibleCount = 0;
            let invisibleCount = 0;
            
            paths.forEach((path, index) => {
                const rect = path.getBoundingClientRect();
                const style = window.getComputedStyle(path);
                
                const isVisible = rect.width > 0 && 
                                rect.height > 0 && 
                                parseFloat(style.opacity) > 0.1 &&
                                style.display !== 'none' &&
                                style.visibility !== 'hidden';
                
                if (isVisible) {
                    visibleCount++;
                } else {
                    invisibleCount++;
                }
                
                // Log first few connections for debugging
                if (index < 3) {
                    console.log(`Connection ${index + 1}:`, {
                        width: rect.width,
                        height: rect.height,
                        opacity: style.opacity,
                        display: style.display,
                        visibility: style.visibility,
                        background: style.background,
                        position: style.position,
                        left: style.left,
                        top: style.top,
                        transform: style.transform
                    });
                }
            });
            
            return { visibleCount, invisibleCount, total: paths.length };
        });

        console.log(`👁️  Visible connections: ${visibilityCheck.visibleCount}`);
        console.log(`❌ Invisible connections: ${visibilityCheck.invisibleCount}`);
        console.log(`📊 Total connections: ${visibilityCheck.total}`);

        console.log('\n📊 STEP 3: CHECKING CONNECTION POSITIONING');
        console.log('===========================================');

        // Check if connections are positioned correctly relative to cards
        const positioningCheck = await page.evaluate(() => {
            const blocks = document.querySelectorAll('.project-block');
            const paths = document.querySelectorAll('.connection-path');
            
            if (blocks.length === 0 || paths.length === 0) {
                return { error: 'No blocks or paths found' };
            }
            
            // Get positions of first few blocks
            const blockPositions = Array.from(blocks).slice(0, 3).map(block => {
                const rect = block.getBoundingClientRect();
                return {
                    left: rect.left,
                    top: rect.top,
                    width: rect.width,
                    height: rect.height,
                    centerX: rect.left + rect.width / 2,
                    centerY: rect.top + rect.height / 2
                };
            });
            
            // Get positions of first few paths
            const pathPositions = Array.from(paths).slice(0, 3).map(path => {
                const rect = path.getBoundingClientRect();
                const style = window.getComputedStyle(path);
                return {
                    left: rect.left,
                    top: rect.top,
                    width: rect.width,
                    height: rect.height,
                    transform: style.transform,
                    opacity: style.opacity
                };
            });
            
            return { blockPositions, pathPositions };
        });

        if (positioningCheck.error) {
            console.log(`❌ ${positioningCheck.error}`);
        } else {
            console.log('📍 Block positions (first 3):');
            positioningCheck.blockPositions.forEach((pos, i) => {
                console.log(`   Block ${i + 1}: (${pos.left.toFixed(1)}, ${pos.top.toFixed(1)}) center: (${pos.centerX.toFixed(1)}, ${pos.centerY.toFixed(1)})`);
            });
            
            console.log('🔗 Path positions (first 3):');
            positioningCheck.pathPositions.forEach((pos, i) => {
                console.log(`   Path ${i + 1}: (${pos.left.toFixed(1)}, ${pos.top.toFixed(1)}) size: ${pos.width.toFixed(1)}x${pos.height.toFixed(1)} opacity: ${pos.opacity}`);
            });
        }

        console.log('\n📊 STEP 4: FORCE CONNECTION VISIBILITY TEST');
        console.log('===========================================');

        // Force make connections more visible for testing
        const forceVisibility = await page.evaluate(() => {
            const paths = document.querySelectorAll('.connection-path');
            let modifiedCount = 0;
            
            paths.forEach(path => {
                // Make connections super visible for testing
                path.style.height = '4px';
                path.style.opacity = '1';
                path.style.background = 'rgba(255, 255, 255, 1)';
                path.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.8)';
                path.style.zIndex = '100';
                modifiedCount++;
            });
            
            return modifiedCount;
        });

        console.log(`🔧 Modified ${forceVisibility} connections for maximum visibility`);

        // Wait a moment for changes to apply
        await page.waitForTimeout(1000);

        // Capture screenshot with forced visibility
        console.log('\n📸 Capturing debug screenshot...');
        const screenshotsDir = path.join(__dirname, '../screenshots');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const debugPath = path.join(screenshotsDir, `neural-network-debug-${timestamp}.png`);
        
        await page.screenshot({
            path: debugPath,
            fullPage: true
        });
        console.log(`✅ Debug screenshot saved: ${debugPath}`);

        // Final assessment
        console.log('\n📋 DEBUG SUMMARY:');
        console.log('==================');
        console.log(`Neural Network Active: ${isNeuralActive ? '✅' : '❌'}`);
        console.log(`Project Blocks: ${blockCount}`);
        console.log(`Connection Paths Created: ${connectionCount}`);
        console.log(`Initially Visible: ${visibilityCheck.visibleCount}`);
        console.log(`Force Modified: ${forceVisibility}`);
        
        if (connectionCount > 0 && visibilityCheck.visibleCount > 0) {
            console.log('\n✅ CONNECTIONS ARE WORKING!');
            console.log('💡 They may just need better styling for visibility.');
        } else if (connectionCount > 0 && visibilityCheck.visibleCount === 0) {
            console.log('\n⚠️  CONNECTIONS EXIST BUT ARE INVISIBLE');
            console.log('💡 Need to fix CSS styling for visibility.');
        } else {
            console.log('\n❌ CONNECTIONS ARE NOT BEING CREATED');
            console.log('💡 Need to fix JavaScript connection logic.');
        }

    } catch (error) {
        console.error('❌ Error debugging connections:', error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Run the debug
debugConnections().catch(console.error);


