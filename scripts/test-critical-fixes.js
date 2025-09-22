#!/usr/bin/env node

/**
 * CRITICAL FIXES VERIFICATION SCRIPT
 * Tests all critical fixes from NEURAL_NETWORK_CRITICAL_FIXES.md
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 CRITICAL FIXES VERIFICATION');
console.log('=====================================\n');

// Test results tracking
const testResults = {
    colorSystem: { passed: 0, total: 0, details: [] },
    blockDesign: { passed: 0, total: 0, details: [] },
    connections: { passed: 0, total: 0, details: [] },
    background: { passed: 0, total: 0, details: [] },
    javascript: { passed: 0, total: 0, details: [] }
};

// Read CSS file
const cssPath = path.join(__dirname, '../site/styles.css');
const cssContent = fs.readFileSync(cssPath, 'utf8');

// Read HTML file
const htmlPath = path.join(__dirname, '../site/index.html');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

console.log('📊 TESTING CRITICAL FIXES...\n');

// 1. TEST COLOR SYSTEM OVERHAUL
console.log('🎨 1. COLOR SYSTEM OVERHAUL');
console.log('----------------------------');

// Test vibrant color variations
const colorCategories = ['installation', 'generative', 'performance', 'commercial', 'architecture', 'digital', 'sculpture', 'media'];
const colorVariations = ['variation-1', 'variation-2', 'variation-3', 'variation-4'];

colorCategories.forEach(category => {
    colorVariations.forEach(variation => {
        const testName = `${category}.${variation}`;
        const pattern = new RegExp(`\\.category-${category}\\.${variation}\\s*\\{[^}]*--${category}-gradient:[^}]*\\}`);
        
        if (pattern.test(cssContent)) {
            testResults.colorSystem.passed++;
            testResults.colorSystem.details.push(`✅ ${testName}: Vibrant gradient defined`);
        } else {
            testResults.colorSystem.details.push(`❌ ${testName}: Missing vibrant gradient`);
        }
        testResults.colorSystem.total++;
    });
});

// Test enhanced box shadows
const shadowPattern = /box-shadow:\s*0\s+8px\s+32px\s+rgba\([^)]+,\s*0\.4\)/;
if (shadowPattern.test(cssContent)) {
    testResults.colorSystem.passed++;
    testResults.colorSystem.details.push('✅ Enhanced box shadows implemented');
} else {
    testResults.colorSystem.details.push('❌ Enhanced box shadows missing');
}
testResults.colorSystem.total++;

console.log(`   Results: ${testResults.colorSystem.passed}/${testResults.colorSystem.total} tests passed\n`);

// 2. TEST ENHANCED BLOCK DESIGN
console.log('🏗️  2. ENHANCED BLOCK DESIGN');
console.log('-----------------------------');

// Test 3D effects
const tests3D = [
    { name: 'Border radius 8px', pattern: /border-radius:\s*8px/ },
    { name: 'Enhanced box shadow', pattern: /box-shadow:\s*0\s+8px\s+32px\s+rgba\(0,0,0,0\.4\)/ },
    { name: 'Inset shadows', pattern: /inset\s+0\s+2px\s+0\s+rgba\(255,255,255,0\.2\)/ },
    { name: 'Backdrop filter', pattern: /backdrop-filter:\s*blur\(10px\)/ },
    { name: 'Transform style preserve-3d', pattern: /transform-style:\s*preserve-3d/ },
    { name: 'Perspective', pattern: /perspective:\s*1000px/ }
];

tests3D.forEach(test => {
    if (test.pattern.test(cssContent)) {
        testResults.blockDesign.passed++;
        testResults.blockDesign.details.push(`✅ ${test.name}`);
    } else {
        testResults.blockDesign.details.push(`❌ ${test.name}`);
    }
    testResults.blockDesign.total++;
});

// Test dramatic hover effects
const hoverTests = [
    { name: 'Dramatic hover transform', pattern: /transform:\s*translateZ\(40px\)\s+scale\(2\.0\)\s+rotateY\(5deg\)/ },
    { name: 'Enhanced hover shadow', pattern: /box-shadow:\s*0\s+30px\s+60px\s+rgba\(0,0,0,0\.6\)/ },
    { name: 'Glow animation', pattern: /animation:\s*glowPulse\s+2s\s+ease-in-out\s+infinite\s+alternate/ }
];

hoverTests.forEach(test => {
    if (test.pattern.test(cssContent)) {
        testResults.blockDesign.passed++;
        testResults.blockDesign.details.push(`✅ ${test.name}`);
    } else {
        testResults.blockDesign.details.push(`❌ ${test.name}`);
    }
    testResults.blockDesign.total++;
});

// Test enhanced block surface and title
const surfaceTests = [
    { name: 'Enhanced block surface gradient', pattern: /background:\s*linear-gradient\(135deg,\s*rgba\(255,255,255,0\.1\)/ },
    { name: 'Enhanced block title shadow', pattern: /text-shadow:\s*0\s+2px\s+4px\s+rgba\(0,0,0,0\.7\)/ },
    { name: 'Block title underline effect', pattern: /\.block-title::after/ }
];

surfaceTests.forEach(test => {
    if (test.pattern.test(cssContent)) {
        testResults.blockDesign.passed++;
        testResults.blockDesign.details.push(`✅ ${test.name}`);
    } else {
        testResults.blockDesign.details.push(`❌ ${test.name}`);
    }
    testResults.blockDesign.total++;
});

console.log(`   Results: ${testResults.blockDesign.passed}/${testResults.blockDesign.total} tests passed\n`);

// 3. TEST PROFESSIONAL CONNECTION SYSTEM
console.log('🔗 3. PROFESSIONAL CONNECTION SYSTEM');
console.log('------------------------------------');

const connectionTests = [
    { name: 'Gradient connection path', pattern: /background:\s*linear-gradient\(90deg,\s*rgba\(255,255,255,0\.8\)/ },
    { name: 'Connection path shadow', pattern: /box-shadow:\s*0\s+0\s+8px\s+rgba\(255,255,255,0\.3\)/ },
    { name: 'Three parallel lines', pattern: /\.connection-path::before.*\.connection-path::after/ },
    { name: 'Curved connections', pattern: /\.connection-path\.curved.*border-radius:\s*50px/ },
    { name: 'Hover effects', pattern: /\.connection-path:hover.*opacity:\s*1/ }
];

connectionTests.forEach(test => {
    if (test.pattern.test(cssContent)) {
        testResults.connections.passed++;
        testResults.connections.details.push(`✅ ${test.name}`);
    } else {
        testResults.connections.details.push(`❌ ${test.name}`);
    }
    testResults.connections.total++;
});

console.log(`   Results: ${testResults.connections.passed}/${testResults.connections.total} tests passed\n`);

// 4. TEST RICH BACKGROUND SYSTEM
console.log('🌌 4. RICH BACKGROUND SYSTEM');
console.log('-----------------------------');

const backgroundTests = [
    { name: 'Multi-layered gradients', pattern: /background:\s*linear-gradient\(135deg,\s*#0c0c0c.*radial-gradient/ },
    { name: 'Enhanced radial overlays', pattern: /radial-gradient\(circle\s+at\s+20%\s+80%,\s*rgba\(120,119,198,0\.4\)/ },
    { name: 'Animated background overlay', pattern: /animation:\s*backgroundShift\s+25s\s+ease-in-out\s+infinite/ },
    { name: 'Background shift keyframes', pattern: /@keyframes\s+backgroundShift/ },
    { name: 'Shimmer animation', pattern: /animation:\s+shimmer\s+20s\s+linear\s+infinite/ },
    { name: 'Shimmer keyframes', pattern: /@keyframes\s+shimmer/ }
];

backgroundTests.forEach(test => {
    if (test.pattern.test(cssContent)) {
        testResults.background.passed++;
        testResults.background.details.push(`✅ ${test.name}`);
    } else {
        testResults.background.details.push(`❌ ${test.name}`);
    }
    testResults.background.total++;
});

console.log(`   Results: ${testResults.background.passed}/${testResults.background.total} tests passed\n`);

// 5. TEST ENHANCED JAVASCRIPT
console.log('⚡ 5. ENHANCED JAVASCRIPT');
console.log('-------------------------');

const jsTests = [
    { name: 'Enhanced color variation function', pattern: /function\s+getRandomColorVariation\(\)/ },
    { name: 'Enhanced categorization function', pattern: /function\s+getProjectCategory\(project\)/ },
    { name: 'CRITICAL FIX comments', pattern: /\/\/\s*CRITICAL\s+FIX:/ },
    { name: 'Color variation usage', pattern: /getRandomColorVariation\(\)/ },
    { name: 'Category usage', pattern: /getProjectCategory\(p\)/ }
];

jsTests.forEach(test => {
    if (test.pattern.test(htmlContent)) {
        testResults.javascript.passed++;
        testResults.javascript.details.push(`✅ ${test.name}`);
    } else {
        testResults.javascript.details.push(`❌ ${test.name}`);
    }
    testResults.javascript.total++;
});

console.log(`   Results: ${testResults.javascript.passed}/${testResults.javascript.total} tests passed\n`);

// SUMMARY
console.log('📋 SUMMARY');
console.log('==========');

const totalPassed = Object.values(testResults).reduce((sum, category) => sum + category.passed, 0);
const totalTests = Object.values(testResults).reduce((sum, category) => sum + category.total, 0);

console.log(`Total Tests: ${totalTests}`);
console.log(`Passed: ${totalPassed}`);
console.log(`Failed: ${totalTests - totalPassed}`);
console.log(`Success Rate: ${((totalPassed / totalTests) * 100).toFixed(1)}%\n`);

// Category breakdown
Object.entries(testResults).forEach(([category, results]) => {
    const percentage = ((results.passed / results.total) * 100).toFixed(1);
    const status = results.passed === results.total ? '✅' : '⚠️';
    console.log(`${status} ${category.toUpperCase()}: ${results.passed}/${results.total} (${percentage}%)`);
});

console.log('\n🎯 CRITICAL FIXES STATUS:');
if (totalPassed === totalTests) {
    console.log('✅ ALL CRITICAL FIXES SUCCESSFULLY IMPLEMENTED!');
    console.log('🚀 Neural Network Portfolio is ready for production!');
} else {
    console.log('⚠️  Some critical fixes need attention.');
    console.log('📝 Review failed tests above for implementation details.');
}

// Detailed results
console.log('\n📝 DETAILED RESULTS:');
Object.entries(testResults).forEach(([category, results]) => {
    console.log(`\n${category.toUpperCase()}:`);
    results.details.forEach(detail => console.log(`  ${detail}`));
});

console.log('\n✨ Critical fixes verification complete!');


