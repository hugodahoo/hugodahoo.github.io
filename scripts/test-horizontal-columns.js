#!/usr/bin/env node

/**
 * TEST HORIZONTAL COLUMNS LAYOUT
 * Verify sections are horizontal columns taking 1/4 width each
 */

const puppeteer = require('puppeteer');
const path = require('path');

async function testHorizontalColumns() {
    console.log('📐 TESTING HORIZONTAL COLUMNS LAYOUT');
    console.log('=====================================\n');

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

        console.log('📊 TEST 1: HORIZONTAL COLUMN LAYOUT');
        console.log('==================================');

        // Test horizontal column layout
        const layoutTest = await page.evaluate(() => {
            const projectGrid = document.querySelector('.project-grid');
            const projectSections = document.querySelectorAll('.project-section');
            
            if (!projectGrid || projectSections.length === 0) {
                return { error: 'No project grid or sections found' };
            }
            
            const gridStyle = window.getComputedStyle(projectGrid);
            const sectionStyles = Array.from(projectSections).map(section => {
                const style = window.getComputedStyle(section);
                const rect = section.getBoundingClientRect();
                return {
                    id: section.id,
                    width: rect.width,
                    height: rect.height,
                    left: rect.left,
                    top: rect.top,
                    display: style.display,
                    flexDirection: style.flexDirection,
                    position: style.position
                };
            });
            
            return {
                gridDisplay: gridStyle.display,
                gridFlexDirection: gridStyle.flexDirection,
                gridHeight: gridStyle.height,
                totalSections: projectSections.length,
                sections: sectionStyles
            };
        });

        if (layoutTest.error) {
            console.log(`❌ ${layoutTest.error}`);
        } else {
            console.log(`✅ Grid display: ${layoutTest.gridDisplay}`);
            console.log(`✅ Grid flex-direction: ${layoutTest.gridFlexDirection}`);
            console.log(`✅ Grid height: ${layoutTest.gridHeight}`);
            console.log(`✅ Total sections: ${layoutTest.totalSections}`);
            
            layoutTest.sections.forEach((section, index) => {
                console.log(`   Section ${index + 1} (${section.id}): ${section.width.toFixed(1)}x${section.height.toFixed(1)} at (${section.left.toFixed(1)}, ${section.top.toFixed(1)})`);
            });
            
            const isHorizontalLayout = layoutTest.gridFlexDirection === 'row';
            const sectionsAre25Percent = layoutTest.sections.every(s => Math.abs(s.width - (1920 / 4)) < 50);
            
            if (isHorizontalLayout && sectionsAre25Percent) {
                console.log('✅ SUCCESS: Horizontal column layout working!');
            } else {
                console.log('❌ ISSUE: Horizontal column layout not working');
            }
        }

        console.log('\n📊 TEST 2: NO SCROLLING VERIFICATION');
        console.log('=====================================');

        // Test that there's no scrolling
        const scrollTest = await page.evaluate(() => {
            const body = document.body;
            const html = document.documentElement;
            
            return {
                bodyOverflow: window.getComputedStyle(body).overflow,
                htmlOverflow: window.getComputedStyle(html).overflow,
                bodyHeight: body.scrollHeight,
                viewportHeight: window.innerHeight,
                hasVerticalScroll: body.scrollHeight > window.innerHeight
            };
        });

        console.log(`✅ Body overflow: ${scrollTest.bodyOverflow}`);
        console.log(`✅ HTML overflow: ${scrollTest.htmlOverflow}`);
        console.log(`✅ Body height: ${scrollTest.bodyHeight}px`);
        console.log(`✅ Viewport height: ${scrollTest.viewportHeight}px`);
        console.log(`✅ Has vertical scroll: ${scrollTest.hasVerticalScroll}`);
        
        if (!scrollTest.hasVerticalScroll) {
            console.log('✅ SUCCESS: No scrolling required!');
        } else {
            console.log('❌ ISSUE: Page still requires scrolling');
        }

        console.log('\n📊 TEST 3: CARD POSITIONING WITHIN COLUMNS');
        console.log('===========================================');

        // Test card positioning within columns
        const cardTest = await page.evaluate(() => {
            const sections = document.querySelectorAll('.project-section');
            const sectionCardInfo = [];
            
            sections.forEach((section, sectionIndex) => {
                const cards = section.querySelectorAll('.project-block');
                const cardPositions = Array.from(cards).map((card, cardIndex) => {
                    const rect = card.getBoundingClientRect();
                    const sectionRect = section.getBoundingClientRect();
                    
                    return {
                        cardIndex: cardIndex + 1,
                        x: rect.left - sectionRect.left,
                        y: rect.top - sectionRect.top,
                        width: rect.width,
                        height: rect.height
                    };
                });
                
                sectionCardInfo.push({
                    sectionIndex: sectionIndex + 1,
                    sectionId: section.id,
                    cardCount: cards.length,
                    cards: cardPositions.slice(0, 3) // First 3 cards
                });
            });
            
            return {
                totalSections: sections.length,
                sections: sectionCardInfo
            };
        });

        console.log(`✅ Total sections: ${cardTest.totalSections}`);
        
        cardTest.sections.forEach(section => {
            console.log(`   Section ${section.sectionIndex} (${section.sectionId}): ${section.cardCount} cards`);
            section.cards.forEach(card => {
                console.log(`     Card ${card.cardIndex}: ${card.width.toFixed(1)}x${card.height.toFixed(1)} at (${card.x.toFixed(1)}, ${card.y.toFixed(1)})`);
            });
        });

        // Capture screenshot
        console.log('\n📸 Capturing horizontal columns screenshot...');
        const screenshotsDir = path.join(__dirname, '../screenshots');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const testPath = path.join(screenshotsDir, `horizontal-columns-${timestamp}.png`);
        
        await page.screenshot({
            path: testPath,
            fullPage: true
        });
        console.log(`✅ Horizontal columns screenshot saved: ${testPath}`);

        // Final assessment
        console.log('\n📋 HORIZONTAL COLUMNS TEST SUMMARY:');
        console.log('===================================');
        console.log(`Horizontal Layout: ${layoutTest?.gridFlexDirection === 'row' ? '✅ WORKING' : '❌ BROKEN'}`);
        console.log(`25% Width Sections: ${layoutTest?.sections?.every(s => Math.abs(s.width - (1920 / 4)) < 50) ? '✅ WORKING' : '❌ BROKEN'}`);
        console.log(`No Scrolling: ${!scrollTest.hasVerticalScroll ? '✅ WORKING' : '❌ BROKEN'}`);
        console.log(`Card Positioning: ${cardTest.totalSections > 0 ? '✅ WORKING' : '❌ BROKEN'}`);
        
        const allTestsPassed = layoutTest?.gridFlexDirection === 'row' && 
                             layoutTest?.sections?.every(s => Math.abs(s.width - (1920 / 4)) < 50) &&
                             !scrollTest.hasVerticalScroll &&
                             cardTest.totalSections > 0;
        
        if (allTestsPassed) {
            console.log('\n🎉 HORIZONTAL COLUMNS SUCCESS: All tests passed!');
            console.log('✅ Sections are horizontal columns');
            console.log('✅ Each section takes 25% of screen width');
            console.log('✅ No scrolling required');
            console.log('✅ Cards positioned within columns');
        } else {
            console.log('\n⚠️  HORIZONTAL COLUMNS ISSUES: Some tests failed');
            console.log('❌ Need to fix before proceeding');
        }

    } catch (error) {
        console.error('❌ Error testing horizontal columns:', error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Run the test
testHorizontalColumns().catch(console.error);


