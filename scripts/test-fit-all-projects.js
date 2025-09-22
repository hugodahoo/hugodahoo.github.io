#!/usr/bin/env node

/**
 * TEST FIT ALL PROJECTS ON PAGE
 * Verify all projects fit within the viewport
 */

const puppeteer = require('puppeteer');
const path = require('path');

async function testFitAllProjects() {
    console.log('📐 TESTING FIT ALL PROJECTS ON PAGE');
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
        
        // Wait for positioning to complete
        await page.waitForTimeout(2000);

        console.log('📊 TEST 1: VIEWPORT FIT CHECK');
        console.log('=============================');

        // Test if all projects fit in viewport
        const fitTest = await page.evaluate(() => {
            const projectBlocks = document.querySelectorAll('.project-block');
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            const positions = Array.from(projectBlocks).map((block, index) => {
                const rect = block.getBoundingClientRect();
                return {
                    index: index + 1,
                    x: rect.left,
                    y: rect.top,
                    width: rect.width,
                    height: rect.height,
                    right: rect.right,
                    bottom: rect.bottom,
                    fitsInViewport: rect.left >= 0 && rect.top >= 0 && 
                                   rect.right <= viewportWidth && rect.bottom <= viewportHeight
                };
            });
            
            const visibleCards = positions.filter(p => p.fitsInViewport);
            const overflowCards = positions.filter(p => !p.fitsInViewport);
            
            // Calculate bounds
            const minX = Math.min(...positions.map(p => p.x));
            const maxX = Math.max(...positions.map(p => p.right));
            const minY = Math.min(...positions.map(p => p.y));
            const maxY = Math.max(...positions.map(p => p.bottom));
            
            return {
                totalCards: projectBlocks.length,
                visibleCards: visibleCards.length,
                overflowCards: overflowCards.length,
                visibilityPercent: (visibleCards.length / projectBlocks.length) * 100,
                bounds: { minX, maxX, minY, maxY },
                viewportSize: { width: viewportWidth, height: viewportHeight },
                widthUsage: ((maxX - minX) / viewportWidth) * 100,
                heightUsage: ((maxY - minY) / viewportHeight) * 100,
                overflowDetails: overflowCards.slice(0, 3) // First 3 overflow cards
            };
        });

        console.log(`✅ Total cards: ${fitTest.totalCards}`);
        console.log(`✅ Visible cards: ${fitTest.visibleCards}`);
        console.log(`✅ Overflow cards: ${fitTest.overflowCards}`);
        console.log(`✅ Visibility: ${fitTest.visibilityPercent.toFixed(1)}%`);
        console.log(`✅ Viewport: ${fitTest.viewportSize.width}x${fitTest.viewportSize.height}`);
        console.log(`✅ Card bounds: X(${fitTest.bounds.minX.toFixed(1)}-${fitTest.bounds.maxX.toFixed(1)}), Y(${fitTest.bounds.minY.toFixed(1)}-${fitTest.bounds.maxY.toFixed(1)})`);
        console.log(`✅ Width usage: ${fitTest.widthUsage.toFixed(1)}%`);
        console.log(`✅ Height usage: ${fitTest.heightUsage.toFixed(1)}%`);
        
        if (fitTest.overflowCards > 0) {
            console.log(`⚠️  Overflow cards:`);
            fitTest.overflowDetails.forEach(card => {
                console.log(`   Card ${card.index}: ${card.width.toFixed(1)}x${card.height.toFixed(1)} at (${card.x.toFixed(1)}, ${card.y.toFixed(1)})`);
            });
        }
        
        const allCardsFit = fitTest.overflowCards === 0;
        const goodUsage = fitTest.widthUsage > 70 && fitTest.heightUsage > 50;
        
        if (allCardsFit && goodUsage) {
            console.log('✅ SUCCESS: All cards fit in viewport with good space usage!');
        } else {
            console.log('❌ ISSUE: Not all cards fit or poor space usage');
        }

        console.log('\n📊 TEST 2: GRID LAYOUT VERIFICATION');
        console.log('===================================');

        // Test grid layout
        const gridTest = await page.evaluate(() => {
            const projectBlocks = document.querySelectorAll('.project-block');
            const positions = Array.from(projectBlocks).map(block => {
                const rect = block.getBoundingClientRect();
                return {
                    x: rect.left,
                    y: rect.top,
                    width: rect.width,
                    height: rect.height
                };
            });
            
            // Group by rows (similar Y positions)
            const rows = [];
            positions.forEach((pos, index) => {
                const existingRow = rows.find(row => Math.abs(row.y - pos.y) < 10);
                if (existingRow) {
                    existingRow.cards.push({ ...pos, index: index + 1 });
                } else {
                    rows.push({ y: pos.y, cards: [{ ...pos, index: index + 1 }] });
                }
            });
            
            // Sort rows by Y position
            rows.sort((a, b) => a.y - b.y);
            
            // Sort cards in each row by X position
            rows.forEach(row => {
                row.cards.sort((a, b) => a.x - b.x);
            });
            
            return {
                totalCards: projectBlocks.length,
                totalRows: rows.length,
                cardsPerRow: rows.map(row => row.cards.length),
                rows: rows.slice(0, 3) // First 3 rows
            };
        });

        console.log(`✅ Total cards: ${gridTest.totalCards}`);
        console.log(`✅ Total rows: ${gridTest.totalRows}`);
        console.log(`✅ Cards per row: ${gridTest.cardsPerRow.join(', ')}`);
        
        gridTest.rows.forEach((row, index) => {
            console.log(`   Row ${index + 1} (Y: ${row.y.toFixed(1)}): ${row.cards.length} cards`);
            row.cards.forEach(card => {
                console.log(`     Card ${card.index}: ${card.width.toFixed(1)}x${card.height.toFixed(1)} at (${card.x.toFixed(1)}, ${card.y.toFixed(1)})`);
            });
        });
        
        const hasGoodGrid = gridTest.totalRows > 0 && gridTest.cardsPerRow.every(count => count > 0);
        
        if (hasGoodGrid) {
            console.log('✅ SUCCESS: Good grid layout!');
        } else {
            console.log('❌ ISSUE: Poor grid layout');
        }

        console.log('\n📊 TEST 3: SCROLL REQUIREMENT');
        console.log('==============================');

        // Test scroll requirement
        const scrollTest = await page.evaluate(() => {
            const body = document.body;
            const html = document.documentElement;
            
            return {
                bodyScrollHeight: body.scrollHeight,
                htmlScrollHeight: html.scrollHeight,
                viewportHeight: window.innerHeight,
                hasVerticalScroll: body.scrollHeight > window.innerHeight,
                scrollDistance: Math.max(0, body.scrollHeight - window.innerHeight)
            };
        });

        console.log(`✅ Body scroll height: ${scrollTest.bodyScrollHeight}px`);
        console.log(`✅ HTML scroll height: ${scrollTest.htmlScrollHeight}px`);
        console.log(`✅ Viewport height: ${scrollTest.viewportHeight}px`);
        console.log(`✅ Has vertical scroll: ${scrollTest.hasVerticalScroll}`);
        console.log(`✅ Scroll distance: ${scrollTest.scrollDistance}px`);
        
        const needsMinimalScroll = scrollTest.scrollDistance < 100;
        
        if (needsMinimalScroll) {
            console.log('✅ SUCCESS: Minimal scrolling required!');
        } else {
            console.log('❌ ISSUE: Too much scrolling required');
        }

        // Capture screenshot
        console.log('\n📸 Capturing fit all projects screenshot...');
        const screenshotsDir = path.join(__dirname, '../screenshots');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const testPath = path.join(screenshotsDir, `fit-all-projects-${timestamp}.png`);
        
        await page.screenshot({
            path: testPath,
            fullPage: true
        });
        console.log(`✅ Fit all projects screenshot saved: ${testPath}`);

        // Final assessment
        console.log('\n📋 FIT ALL PROJECTS TEST SUMMARY:');
        console.log('==================================');
        console.log(`All Cards Fit: ${allCardsFit ? '✅ WORKING' : '❌ BROKEN'}`);
        console.log(`Good Space Usage: ${goodUsage ? '✅ WORKING' : '❌ BROKEN'}`);
        console.log(`Good Grid Layout: ${hasGoodGrid ? '✅ WORKING' : '❌ BROKEN'}`);
        console.log(`Minimal Scroll: ${needsMinimalScroll ? '✅ WORKING' : '❌ BROKEN'}`);
        
        const allTestsPassed = allCardsFit && goodUsage && hasGoodGrid && needsMinimalScroll;
        
        if (allTestsPassed) {
            console.log('\n🎉 FIT ALL PROJECTS SUCCESS: All tests passed!');
            console.log('✅ All projects fit in viewport');
            console.log('✅ Good space usage');
            console.log('✅ Clean grid layout');
            console.log('✅ Minimal scrolling required');
        } else {
            console.log('\n⚠️  FIT ALL PROJECTS ISSUES: Some tests failed');
            console.log('❌ Need to fix before proceeding');
        }

    } catch (error) {
        console.error('❌ Error testing fit all projects:', error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Run the test
testFitAllProjects().catch(console.error);


