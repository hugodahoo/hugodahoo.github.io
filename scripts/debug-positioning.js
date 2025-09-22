#!/usr/bin/env node

/**
 * DEBUG POSITIONING SCRIPT
 * Check if connections are properly positioned relative to cards
 */

const puppeteer = require('puppeteer');
const path = require('path');

async function debugPositioning() {
    console.log('🔍 DEBUGGING CONNECTION POSITIONING');
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

        console.log('📊 CHECKING POSITIONING COORDINATES');
        console.log('===================================');

        // Get detailed positioning information
        const positioningInfo = await page.evaluate(() => {
            const blocks = document.querySelectorAll('.project-block');
            const paths = document.querySelectorAll('.connection-path');
            const projectGrid = document.querySelector('.project-grid');
            
            const blockInfo = Array.from(blocks).slice(0, 3).map((block, index) => {
                const rect = block.getBoundingClientRect();
                const gridRect = projectGrid.getBoundingClientRect();
                return {
                    index: index + 1,
                    blockRect: {
                        left: rect.left,
                        top: rect.top,
                        width: rect.width,
                        height: rect.height,
                        centerX: rect.left + rect.width / 2,
                        centerY: rect.top + rect.height / 2
                    },
                    gridRect: {
                        left: gridRect.left,
                        top: gridRect.top,
                        width: gridRect.width,
                        height: gridRect.height
                    },
                    relativeToGrid: {
                        left: rect.left - gridRect.left,
                        top: rect.top - gridRect.top,
                        centerX: (rect.left + rect.width / 2) - gridRect.left,
                        centerY: (rect.top + rect.height / 2) - gridRect.top
                    },
                    computedStyle: {
                        position: window.getComputedStyle(block).position,
                        left: window.getComputedStyle(block).left,
                        top: window.getComputedStyle(block).top,
                        zIndex: window.getComputedStyle(block).zIndex
                    }
                };
            });
            
            const pathInfo = Array.from(paths).slice(0, 3).map((path, index) => {
                const rect = path.getBoundingClientRect();
                const gridRect = projectGrid.getBoundingClientRect();
                return {
                    index: index + 1,
                    pathRect: {
                        left: rect.left,
                        top: rect.top,
                        width: rect.width,
                        height: rect.height
                    },
                    gridRect: {
                        left: gridRect.left,
                        top: gridRect.top,
                        width: gridRect.width,
                        height: gridRect.height
                    },
                    relativeToGrid: {
                        left: rect.left - gridRect.left,
                        top: rect.top - gridRect.top
                    },
                    computedStyle: {
                        position: window.getComputedStyle(path).position,
                        left: window.getComputedStyle(path).left,
                        top: window.getComputedStyle(path).top,
                        zIndex: window.getComputedStyle(path).zIndex,
                        transform: window.getComputedStyle(path).transform
                    }
                };
            });
            
            return {
                projectGridStyle: {
                    position: window.getComputedStyle(projectGrid).position,
                    left: window.getComputedStyle(projectGrid).left,
                    top: window.getComputedStyle(projectGrid).top
                },
                blockInfo,
                pathInfo,
                totalBlocks: blocks.length,
                totalPaths: paths.length
            };
        });

        console.log('📦 PROJECT GRID STYLE:');
        console.log(`   Position: ${positioningInfo.projectGridStyle.position}`);
        console.log(`   Left: ${positioningInfo.projectGridStyle.left}`);
        console.log(`   Top: ${positioningInfo.projectGridStyle.top}`);

        console.log('\n📦 BLOCK POSITIONS (first 3):');
        positioningInfo.blockInfo.forEach(info => {
            console.log(`   Block ${info.index}:`);
            console.log(`     Absolute: (${info.blockRect.left.toFixed(1)}, ${info.blockRect.top.toFixed(1)})`);
            console.log(`     Relative to Grid: (${info.relativeToGrid.left.toFixed(1)}, ${info.relativeToGrid.top.toFixed(1)})`);
            console.log(`     Center: (${info.relativeToGrid.centerX.toFixed(1)}, ${info.relativeToGrid.centerY.toFixed(1)})`);
            console.log(`     Computed: position=${info.computedStyle.position}, left=${info.computedStyle.left}, top=${info.computedStyle.top}`);
        });

        console.log('\n🔗 PATH POSITIONS (first 3):');
        positioningInfo.pathInfo.forEach(info => {
            console.log(`   Path ${info.index}:`);
            console.log(`     Absolute: (${info.pathRect.left.toFixed(1)}, ${info.pathRect.top.toFixed(1)})`);
            console.log(`     Relative to Grid: (${info.relativeToGrid.left.toFixed(1)}, ${info.relativeToGrid.top.toFixed(1)})`);
            console.log(`     Computed: position=${info.computedStyle.position}, left=${info.computedStyle.left}, top=${info.computedStyle.top}`);
            console.log(`     Transform: ${info.computedStyle.transform}`);
        });

        // Check if paths are actually connecting blocks
        console.log('\n🔍 CONNECTION ANALYSIS:');
        const connectionAnalysis = await page.evaluate(() => {
            const blocks = document.querySelectorAll('.project-block');
            const paths = document.querySelectorAll('.connection-path');
            const projectGrid = document.querySelector('.project-grid');
            const gridRect = projectGrid.getBoundingClientRect();
            
            let connectedPaths = 0;
            let floatingPaths = 0;
            
            paths.forEach((path, pathIndex) => {
                const pathRect = path.getBoundingClientRect();
                const pathCenterX = pathRect.left + pathRect.width / 2;
                const pathCenterY = pathRect.top + pathRect.height / 2;
                
                let connectsToBlock = false;
                
                blocks.forEach((block, blockIndex) => {
                    const blockRect = block.getBoundingClientRect();
                    const blockCenterX = blockRect.left + blockRect.width / 2;
                    const blockCenterY = blockRect.top + blockRect.height / 2;
                    
                    // Check if path is near block center (within 50px)
                    const distance = Math.sqrt(
                        Math.pow(pathCenterX - blockCenterX, 2) + 
                        Math.pow(pathCenterY - blockCenterY, 2)
                    );
                    
                    if (distance < 50) {
                        connectsToBlock = true;
                    }
                });
                
                if (connectsToBlock) {
                    connectedPaths++;
                } else {
                    floatingPaths++;
                }
            });
            
            return { connectedPaths, floatingPaths, totalPaths: paths.length };
        });

        console.log(`   Connected paths: ${connectionAnalysis.connectedPaths}`);
        console.log(`   Floating paths: ${connectionAnalysis.floatingPaths}`);
        console.log(`   Total paths: ${connectionAnalysis.totalPaths}`);

        // Capture screenshot
        console.log('\n📸 Capturing positioning debug screenshot...');
        const screenshotsDir = path.join(__dirname, '../screenshots');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const debugPath = path.join(screenshotsDir, `positioning-debug-${timestamp}.png`);
        
        await page.screenshot({
            path: debugPath,
            fullPage: true
        });
        console.log(`✅ Debug screenshot saved: ${debugPath}`);

        // Summary
        console.log('\n📋 POSITIONING DEBUG SUMMARY:');
        console.log('=============================');
        console.log(`Project Grid Position: ${positioningInfo.projectGridStyle.position}`);
        console.log(`Total Blocks: ${positioningInfo.totalBlocks}`);
        console.log(`Total Paths: ${positioningInfo.totalPaths}`);
        console.log(`Connected Paths: ${connectionAnalysis.connectedPaths}`);
        console.log(`Floating Paths: ${connectionAnalysis.floatingPaths}`);
        
        if (connectionAnalysis.floatingPaths > connectionAnalysis.connectedPaths) {
            console.log('\n❌ ISSUE: Most paths are floating, not connected to blocks');
            console.log('💡 The positioning coordinates are not being calculated correctly');
        } else {
            console.log('\n✅ Paths appear to be properly positioned relative to blocks');
        }

    } catch (error) {
        console.error('❌ Error debugging positioning:', error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Run the debug
debugPositioning().catch(console.error);


