#!/usr/bin/env node

/**
 * TEST CONNECTION FIX SCRIPT
 * Verify that connections are now properly positioned relative to cards
 */

const puppeteer = require('puppeteer');
const path = require('path');

async function testConnectionFix() {
    console.log('🔧 TESTING CONNECTION POSITIONING FIX');
    console.log('=====================================\n');

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

        console.log('📊 CHECKING CONNECTION POSITIONING');
        console.log('==================================');

        // Get detailed positioning information
        const positioningInfo = await page.evaluate(() => {
            const blocks = document.querySelectorAll('.project-block');
            const paths = document.querySelectorAll('.connection-path');
            const projectGrid = document.querySelector('.project-grid');
            
            if (blocks.length === 0 || paths.length === 0) {
                return { error: 'No blocks or paths found' };
            }
            
            const gridRect = projectGrid.getBoundingClientRect();
            
            // Get first few blocks and their positions
            const blockPositions = Array.from(blocks).slice(0, 3).map((block, index) => {
                const rect = block.getBoundingClientRect();
                return {
                    index: index + 1,
                    title: block.querySelector('.block-title')?.textContent || 'Unknown',
                    absolutePos: {
                        left: rect.left,
                        top: rect.top,
                        width: rect.width,
                        height: rect.height,
                        centerX: rect.left + rect.width / 2,
                        centerY: rect.top + rect.height / 2
                    },
                    relativeToGrid: {
                        left: rect.left - gridRect.left,
                        top: rect.top - gridRect.top,
                        centerX: (rect.left + rect.width / 2) - gridRect.left,
                        centerY: (rect.top + rect.height / 2) - gridRect.top
                    }
                };
            });
            
            // Get first few paths and their positions
            const pathPositions = Array.from(paths).slice(0, 3).map((path, index) => {
                const rect = path.getBoundingClientRect();
                const style = window.getComputedStyle(path);
                return {
                    index: index + 1,
                    absolutePos: {
                        left: rect.left,
                        top: rect.top,
                        width: rect.width,
                        height: rect.height
                    },
                    relativeToGrid: {
                        left: rect.left - gridRect.left,
                        top: rect.top - gridRect.top
                    },
                    computedStyle: {
                        left: style.left,
                        top: style.top,
                        transform: style.transform,
                        transformOrigin: style.transformOrigin
                    }
                };
            });
            
            return {
                projectGridRect: {
                    left: gridRect.left,
                    top: gridRect.top,
                    width: gridRect.width,
                    height: gridRect.height
                },
                blockPositions,
                pathPositions,
                totalBlocks: blocks.length,
                totalPaths: paths.length
            };
        });

        if (positioningInfo.error) {
            console.log(`❌ ${positioningInfo.error}`);
            return;
        }

        console.log('📦 PROJECT GRID POSITION:');
        console.log(`   Left: ${positioningInfo.projectGridRect.left.toFixed(1)}px`);
        console.log(`   Top: ${positioningInfo.projectGridRect.top.toFixed(1)}px`);
        console.log(`   Size: ${positioningInfo.projectGridRect.width.toFixed(1)} x ${positioningInfo.projectGridRect.height.toFixed(1)}px`);

        console.log('\n📦 BLOCK POSITIONS (first 3):');
        positioningInfo.blockPositions.forEach(info => {
            console.log(`   Block ${info.index} (${info.title}):`);
            console.log(`     Absolute Center: (${info.absolutePos.centerX.toFixed(1)}, ${info.absolutePos.centerY.toFixed(1)})`);
            console.log(`     Relative Center: (${info.relativeToGrid.centerX.toFixed(1)}, ${info.relativeToGrid.centerY.toFixed(1)})`);
        });

        console.log('\n🔗 PATH POSITIONS (first 3):');
        positioningInfo.pathPositions.forEach(info => {
            console.log(`   Path ${info.index}:`);
            console.log(`     Absolute Start: (${info.absolutePos.left.toFixed(1)}, ${info.absolutePos.top.toFixed(1)})`);
            console.log(`     Relative Start: (${info.relativeToGrid.left.toFixed(1)}, ${info.relativeToGrid.top.toFixed(1)})`);
            console.log(`     Computed: left=${info.computedStyle.left}, top=${info.computedStyle.top}`);
            console.log(`     Transform: ${info.computedStyle.transform}`);
            console.log(`     Transform Origin: ${info.computedStyle.transformOrigin}`);
        });

        // Check if paths are actually connecting to block centers
        console.log('\n🔍 CONNECTION VERIFICATION:');
        const connectionCheck = await page.evaluate(() => {
            const blocks = document.querySelectorAll('.project-block');
            const paths = document.querySelectorAll('.connection-path');
            const projectGrid = document.querySelector('.project-grid');
            const gridRect = projectGrid.getBoundingClientRect();
            
            let properlyConnected = 0;
            let floatingPaths = 0;
            
            paths.forEach((path, pathIndex) => {
                const pathRect = path.getBoundingClientRect();
                const pathStartX = pathRect.left - gridRect.left;
                const pathStartY = pathRect.top - gridRect.top;
                
                let connectsToBlock = false;
                let closestBlock = null;
                let minDistance = Infinity;
                
                blocks.forEach((block, blockIndex) => {
                    const blockRect = block.getBoundingClientRect();
                    const blockCenterX = (blockRect.left + blockRect.width / 2) - gridRect.left;
                    const blockCenterY = (blockRect.top + blockRect.height / 2) - gridRect.top;
                    
                    const distance = Math.sqrt(
                        Math.pow(pathStartX - blockCenterX, 2) + 
                        Math.pow(pathStartY - blockCenterY, 2)
                    );
                    
                    if (distance < minDistance) {
                        minDistance = distance;
                        closestBlock = blockIndex;
                    }
                    
                    // Check if path starts within 20px of block center
                    if (distance < 20) {
                        connectsToBlock = true;
                    }
                });
                
                if (connectsToBlock) {
                    properlyConnected++;
                } else {
                    floatingPaths++;
                    console.log(`Path ${pathIndex + 1} is floating - closest to block ${closestBlock + 1} at distance ${minDistance.toFixed(1)}px`);
                }
            });
            
            return { properlyConnected, floatingPaths, totalPaths: paths.length };
        });

        console.log(`   Properly Connected: ${connectionCheck.properlyConnected}`);
        console.log(`   Floating Paths: ${connectionCheck.floatingPaths}`);
        console.log(`   Total Paths: ${connectionCheck.totalPaths}`);

        // Capture screenshot
        console.log('\n📸 Capturing test screenshot...');
        const screenshotsDir = path.join(__dirname, '../screenshots');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const testPath = path.join(screenshotsDir, `connection-fix-test-${timestamp}.png`);
        
        await page.screenshot({
            path: testPath,
            fullPage: true
        });
        console.log(`✅ Test screenshot saved: ${testPath}`);

        // Summary
        console.log('\n📋 CONNECTION FIX TEST SUMMARY:');
        console.log('===============================');
        console.log(`Total Blocks: ${positioningInfo.totalBlocks}`);
        console.log(`Total Paths: ${positioningInfo.totalPaths}`);
        console.log(`Properly Connected: ${connectionCheck.properlyConnected}`);
        console.log(`Floating Paths: ${connectionCheck.floatingPaths}`);
        
        if (connectionCheck.floatingPaths === 0) {
            console.log('\n✅ SUCCESS: All connections are properly positioned!');
        } else if (connectionCheck.properlyConnected > connectionCheck.floatingPaths) {
            console.log('\n⚠️  PARTIAL SUCCESS: Most connections are positioned correctly');
        } else {
            console.log('\n❌ ISSUE: Most connections are still floating');
            console.log('💡 Need to debug the coordinate calculation further');
        }

    } catch (error) {
        console.error('❌ Error testing connection fix:', error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Run the test
testConnectionFix().catch(console.error);


