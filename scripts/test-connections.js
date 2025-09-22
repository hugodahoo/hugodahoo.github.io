#!/usr/bin/env node

/**
 * CONNECTION SYSTEM TEST SCRIPT
 * Tests the neural network connection system
 */

const puppeteer = require('puppeteer');
const path = require('path');

async function testConnections() {
    console.log('🔗 TESTING NEURAL NETWORK CONNECTIONS');
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
        await page.waitForTimeout(2000);

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

        // Check positioned cards array
        const positionedCardsCount = await page.evaluate(() => {
            return window.positionedCards ? window.positionedCards.length : 0;
        });
        console.log(`📍 Positioned cards: ${positionedCardsCount}`);

        // Get connection details
        const connectionDetails = await page.evaluate(() => {
            const paths = document.querySelectorAll('.connection-path');
            return Array.from(paths).map(path => ({
                left: path.style.left,
                top: path.style.top,
                width: path.style.width,
                transform: path.style.transform,
                opacity: path.style.opacity,
                className: path.className
            }));
        });

        console.log('\n📊 CONNECTION ANALYSIS:');
        console.log('======================');
        
        if (connectionCount > 0) {
            console.log('✅ Connections are being drawn!');
            console.log(`📏 Connection details:`);
            connectionDetails.forEach((conn, index) => {
                console.log(`   ${index + 1}. Position: ${conn.left}, ${conn.top}`);
                console.log(`      Size: ${conn.width}`);
                console.log(`      Transform: ${conn.transform}`);
                console.log(`      Opacity: ${conn.opacity}`);
                console.log(`      Classes: ${conn.className}`);
            });
        } else {
            console.log('❌ No connections found!');
            console.log('🔍 Debugging information:');
            console.log(`   - Neural network style: ${isNeuralActive}`);
            console.log(`   - Project blocks: ${blockCount}`);
            console.log(`   - Positioned cards: ${positionedCardsCount}`);
        }

        // Test connection drawing manually
        console.log('\n🧪 TESTING MANUAL CONNECTION DRAWING:');
        const manualTest = await page.evaluate(() => {
            // Force redraw connections
            if (window.drawConnectingPaths) {
                window.drawConnectingPaths();
                return document.querySelectorAll('.connection-path').length;
            }
            return 0;
        });
        console.log(`🔧 Manual connection test result: ${manualTest} connections`);

        // Capture screenshot with connections
        console.log('\n📸 Capturing screenshot with connections...');
        const screenshotsDir = path.join(__dirname, '../screenshots');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const connectionPath = path.join(screenshotsDir, `neural-network-connections-${timestamp}.png`);
        
        await page.screenshot({
            path: connectionPath,
            fullPage: true
        });
        console.log(`✅ Connection screenshot saved: ${connectionPath}`);

        // Summary
        console.log('\n📋 CONNECTION TEST SUMMARY:');
        console.log('============================');
        console.log(`Neural Network Style: ${isNeuralActive ? '✅ Active' : '❌ Inactive'}`);
        console.log(`Project Blocks: ${blockCount}`);
        console.log(`Positioned Cards: ${positionedCardsCount}`);
        console.log(`Connection Paths: ${connectionCount}`);
        console.log(`Manual Test: ${manualTest} connections`);
        
        if (connectionCount > 0 || manualTest > 0) {
            console.log('\n🎉 CONNECTIONS ARE WORKING!');
        } else {
            console.log('\n⚠️  CONNECTIONS NEED FIXING!');
            console.log('💡 Possible issues:');
            console.log('   - positionedCards array not populated');
            console.log('   - drawConnectingPaths not called');
            console.log('   - Distance calculations incorrect');
            console.log('   - CSS connection-path styles missing');
        }

    } catch (error) {
        console.error('❌ Error testing connections:', error.message);
        
        if (error.message.includes('ERR_CONNECTION_REFUSED')) {
            console.log('\n💡 Make sure the server is running:');
            console.log('   npm start');
            console.log('   or');
            console.log('   node server.js');
        }
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Run the connection test
testConnections().catch(console.error);


