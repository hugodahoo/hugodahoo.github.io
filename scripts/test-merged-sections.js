#!/usr/bin/env node

/**
 * TEST MERGED SECTIONS & BLACK CONNECTIONS
 * Verify sections are merged and connections are black
 */

const puppeteer = require('puppeteer');
const path = require('path');

async function testMergedSections() {
    console.log('🔄 TESTING MERGED SECTIONS & BLACK CONNECTIONS');
    console.log('==============================================\n');

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

        console.log('📊 TEST 1: MERGED SECTIONS');
        console.log('==========================');

        // Test merged sections
        const mergedTest = await page.evaluate(() => {
            const sections = document.querySelectorAll('.project-section');
            const sectionTitles = document.querySelectorAll('.section-title');
            const projectBlocks = document.querySelectorAll('.project-block');
            
            const sectionInfo = Array.from(sections).map((section, index) => {
                const rect = section.getBoundingClientRect();
                const blocks = section.querySelectorAll('.project-block');
                const titles = section.querySelectorAll('.section-title');
                
                return {
                    index: index + 1,
                    id: section.id,
                    width: rect.width,
                    height: rect.height,
                    blockCount: blocks.length,
                    titleCount: titles.length,
                    titleText: titles.length > 0 ? titles[0].textContent : 'none'
                };
            });
            
            return {
                totalSections: sections.length,
                totalSectionTitles: sectionTitles.length,
                totalProjectBlocks: projectBlocks.length,
                sections: sectionInfo
            };
        });

        console.log(`✅ Total sections: ${mergedTest.totalSections}`);
        console.log(`✅ Total section titles: ${mergedTest.totalSectionTitles}`);
        console.log(`✅ Total project blocks: ${mergedTest.totalProjectBlocks}`);
        
        mergedTest.sections.forEach(section => {
            console.log(`   Section ${section.index} (${section.id}):`);
            console.log(`     Size: ${section.width.toFixed(1)}x${section.height.toFixed(1)}`);
            console.log(`     Blocks: ${section.blockCount}`);
            console.log(`     Titles: ${section.titleCount} (${section.titleText})`);
        });
        
        const hasMergedSections = mergedTest.sections.some(s => s.blockCount > 0) && 
                                 mergedTest.sections.filter(s => s.blockCount > 0).length === 1;
        const hasPortfolioTitle = mergedTest.sections.some(s => s.titleText === 'PORTFOLIO');
        
        if (hasMergedSections && hasPortfolioTitle) {
            console.log('✅ SUCCESS: Sections are merged with PORTFOLIO title!');
        } else {
            console.log('❌ ISSUE: Sections are not properly merged');
        }

        console.log('\n📊 TEST 2: BLACK CONNECTIONS');
        console.log('============================');

        // Test black connections
        const connectionsTest = await page.evaluate(() => {
            const connectionPaths = document.querySelectorAll('.connection-path');
            
            const connectionInfo = Array.from(connectionPaths).slice(0, 5).map((path, index) => {
                const computedStyle = window.getComputedStyle(path);
                const rect = path.getBoundingClientRect();
                
                return {
                    index: index + 1,
                    width: rect.width,
                    height: rect.height,
                    background: computedStyle.background,
                    backgroundColor: computedStyle.backgroundColor,
                    boxShadow: computedStyle.boxShadow,
                    opacity: computedStyle.opacity
                };
            });
            
            return {
                totalConnections: connectionPaths.length,
                connections: connectionInfo
            };
        });

        console.log(`✅ Total connections: ${connectionsTest.totalConnections}`);
        
        connectionsTest.connections.forEach(conn => {
            console.log(`   Connection ${conn.index}:`);
            console.log(`     Size: ${conn.width.toFixed(1)}x${conn.height.toFixed(1)}`);
            console.log(`     Background: ${conn.background}`);
            console.log(`     Box shadow: ${conn.boxShadow}`);
            console.log(`     Opacity: ${conn.opacity}`);
        });
        
        const hasBlackConnections = connectionsTest.connections.every(conn => 
            conn.background.includes('rgba(0,0,0') || conn.background.includes('rgb(0,0,0')
        );
        
        if (hasBlackConnections) {
            console.log('✅ SUCCESS: Connections are black!');
        } else {
            console.log('❌ ISSUE: Connections are not black');
        }

        console.log('\n📊 TEST 3: ENHANCED TITLE STYLING');
        console.log('=================================');

        // Test enhanced title styling
        const titleTest = await page.evaluate(() => {
            const sectionTitles = document.querySelectorAll('.section-title');
            
            const titleInfo = Array.from(sectionTitles).map((title, index) => {
                const computedStyle = window.getComputedStyle(title);
                const rect = title.getBoundingClientRect();
                
                return {
                    index: index + 1,
                    text: title.textContent,
                    fontSize: computedStyle.fontSize,
                    color: computedStyle.color,
                    fontWeight: computedStyle.fontWeight,
                    letterSpacing: computedStyle.letterSpacing,
                    animation: computedStyle.animation,
                    width: rect.width,
                    height: rect.height
                };
            });
            
            return {
                totalTitles: sectionTitles.length,
                titles: titleInfo
            };
        });

        console.log(`✅ Total titles: ${titleTest.totalTitles}`);
        
        titleTest.titles.forEach(title => {
            console.log(`   Title ${title.index} ("${title.text}"):`);
            console.log(`     Font size: ${title.fontSize}`);
            console.log(`     Color: ${title.color}`);
            console.log(`     Font weight: ${title.fontWeight}`);
            console.log(`     Letter spacing: ${title.letterSpacing}`);
            console.log(`     Animation: ${title.animation}`);
            console.log(`     Size: ${title.width.toFixed(1)}x${title.height.toFixed(1)}`);
        });
        
        const hasLargeFont = titleTest.titles.every(t => parseFloat(t.fontSize) >= 180);
        const hasBetterColor = titleTest.titles.every(t => t.color.includes('rgba(150,150,150'));
        const hasLetterSpacing = titleTest.titles.every(t => parseFloat(t.letterSpacing) >= 15);
        
        if (hasLargeFont && hasBetterColor && hasLetterSpacing) {
            console.log('✅ SUCCESS: Enhanced title styling is working!');
        } else {
            console.log('❌ ISSUE: Enhanced title styling not working');
        }

        console.log('\n📊 TEST 4: PROJECT DISTRIBUTION');
        console.log('===============================');

        // Test project distribution
        const distributionTest = await page.evaluate(() => {
            const projectBlocks = document.querySelectorAll('.project-block');
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            // Count projects by category
            const categories = {};
            projectBlocks.forEach(block => {
                const classList = Array.from(block.classList);
                const categoryClass = classList.find(cls => cls.startsWith('category-'));
                if (categoryClass) {
                    const category = categoryClass.replace('category-', '');
                    categories[category] = (categories[category] || 0) + 1;
                }
            });
            
            // Calculate distribution across viewport
            const positions = Array.from(projectBlocks).map(block => {
                const rect = block.getBoundingClientRect();
                return {
                    x: rect.left,
                    y: rect.top,
                    width: rect.width,
                    height: rect.height
                };
            });
            
            const minX = Math.min(...positions.map(p => p.x));
            const maxX = Math.max(...positions.map(p => p.x + p.width));
            const minY = Math.min(...positions.map(p => p.y));
            const maxY = Math.max(...positions.map(p => p.y + p.height));
            
            return {
                totalProjects: projectBlocks.length,
                categories: categories,
                bounds: { minX, maxX, minY, maxY },
                widthUsage: ((maxX - minX) / viewportWidth) * 100,
                heightUsage: ((maxY - minY) / viewportHeight) * 100
            };
        });

        console.log(`✅ Total projects: ${distributionTest.totalProjects}`);
        console.log(`✅ Categories:`);
        Object.entries(distributionTest.categories).forEach(([category, count]) => {
            console.log(`   ${category}: ${count} projects`);
        });
        console.log(`✅ Bounds: X(${distributionTest.bounds.minX.toFixed(1)}-${distributionTest.bounds.maxX.toFixed(1)}), Y(${distributionTest.bounds.minY.toFixed(1)}-${distributionTest.bounds.maxY.toFixed(1)})`);
        console.log(`✅ Width usage: ${distributionTest.widthUsage.toFixed(1)}%`);
        console.log(`✅ Height usage: ${distributionTest.heightUsage.toFixed(1)}%`);
        
        const hasGoodDistribution = distributionTest.totalProjects > 20 && 
                                  Object.keys(distributionTest.categories).length >= 3;
        
        if (hasGoodDistribution) {
            console.log('✅ SUCCESS: Good project distribution across categories!');
        } else {
            console.log('❌ ISSUE: Poor project distribution');
        }

        // Capture screenshot
        console.log('\n📸 Capturing merged sections screenshot...');
        const screenshotsDir = path.join(__dirname, '../screenshots');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const testPath = path.join(screenshotsDir, `merged-sections-${timestamp}.png`);
        
        await page.screenshot({
            path: testPath,
            fullPage: true
        });
        console.log(`✅ Merged sections screenshot saved: ${testPath}`);

        // Final assessment
        console.log('\n📋 MERGED SECTIONS TEST SUMMARY:');
        console.log('=================================');
        console.log(`Merged Sections: ${hasMergedSections ? '✅ WORKING' : '❌ BROKEN'}`);
        console.log(`Portfolio Title: ${hasPortfolioTitle ? '✅ WORKING' : '❌ BROKEN'}`);
        console.log(`Black Connections: ${hasBlackConnections ? '✅ WORKING' : '❌ BROKEN'}`);
        console.log(`Enhanced Title: ${hasLargeFont && hasBetterColor ? '✅ WORKING' : '❌ BROKEN'}`);
        console.log(`Good Distribution: ${hasGoodDistribution ? '✅ WORKING' : '❌ BROKEN'}`);
        
        const allTestsPassed = hasMergedSections && hasPortfolioTitle && hasBlackConnections && 
                             hasLargeFont && hasBetterColor && hasGoodDistribution;
        
        if (allTestsPassed) {
            console.log('\n🎉 MERGED SECTIONS SUCCESS: All tests passed!');
            console.log('✅ Sections are merged into one');
            console.log('✅ PORTFOLIO title is displayed');
            console.log('✅ Connections are black');
            console.log('✅ Enhanced title styling (larger, better color)');
            console.log('✅ Good project distribution');
        } else {
            console.log('\n⚠️  MERGED SECTIONS ISSUES: Some tests failed');
            console.log('❌ Need to fix before proceeding');
        }

    } catch (error) {
        console.error('❌ Error testing merged sections:', error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Run the test
testMergedSections().catch(console.error);


