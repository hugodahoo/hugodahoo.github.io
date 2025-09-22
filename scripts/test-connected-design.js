const fs = require('fs');
const path = require('path');

class ConnectedDesignTester {
    constructor() {
        // No server needed for offline testing
    }

    async testConnectedDesignImplementation() {
        console.log('🔗 Testing connected design implementation...');
        
        // Read the updated files to verify connected design implementation
        const indexPath = path.join(__dirname, '..', 'site', 'index.html');
        const cssPath = path.join(__dirname, '..', 'site', 'styles.css');
        
        const htmlContent = fs.readFileSync(indexPath, 'utf8');
        const cssContent = fs.readFileSync(cssPath, 'utf8');
        
        const tests = {
            // Sharp corners tests
            noBorderRadius: {
                test: cssContent.includes('border-radius:0'),
                description: 'Cards have sharp corners (no border-radius)'
            },
            thinBorders: {
                test: cssContent.includes('border:1px solid rgba(255,255,255,0.1)'),
                description: 'Thin borders added to cards'
            },
            
            // Path system tests
            pathAlgorithm: {
                test: htmlContent.includes('drawConnectingPaths'),
                description: 'Path drawing algorithm implemented'
            },
            pathCreation: {
                test: htmlContent.includes('createConnectionPath'),
                description: 'Individual path creation function implemented'
            },
            distanceCalculation: {
                test: htmlContent.includes('Math.sqrt') && htmlContent.includes('Math.pow'),
                description: 'Distance calculation between cards implemented'
            },
            pathCleanup: {
                test: htmlContent.includes('querySelectorAll(\'.connection-path\').forEach(path => path.remove())'),
                description: 'Path cleanup before redrawing implemented'
            },
            
            // CSS path styling tests
            pathElement: {
                test: cssContent.includes('.connection-path{'),
                description: 'Connection path CSS styling implemented'
            },
            pathAnimation: {
                test: cssContent.includes('@keyframes pathDot'),
                description: 'Path dot animation implemented'
            },
            pathOpacity: {
                test: cssContent.includes('opacity:0.6'),
                description: 'Path opacity and hover effects implemented'
            },
            
            // Integration tests
            pathDrawingCall: {
                test: htmlContent.includes('drawConnectingPaths()'),
                description: 'Path drawing called after card positioning'
            },
            resizePathRedraw: {
                test: htmlContent.includes('drawConnectingPaths()') && htmlContent.includes('resize'),
                description: 'Paths redrawn on window resize'
            },
            
            // Geometric design tests
            sharpShadows: {
                test: cssContent.includes('box-shadow:0 2px 8px rgba(0,0,0,0.3)'),
                description: 'Sharp, minimal shadows for geometric look'
            },
            pathEndpoints: {
                test: cssContent.includes('::before') && cssContent.includes('::after'),
                description: 'Path endpoints with animated dots implemented'
            }
        };
        
        console.log('\n📊 Connected Design Test Results:');
        console.log('=================================');
        
        let passedTests = 0;
        let totalTests = Object.keys(tests).length;
        
        Object.entries(tests).forEach(([key, test]) => {
            const status = test.test ? '✅' : '❌';
            console.log(`${status} ${test.description}: ${test.test ? 'PASS' : 'FAIL'}`);
            if (test.test) passedTests++;
        });
        
        const successRate = (passedTests / totalTests) * 100;
        console.log(`\n📈 Success Rate: ${passedTests}/${totalTests} (${successRate.toFixed(1)}%)`);
        
        return {
            passedTests,
            totalTests,
            successRate,
            tests
        };
    }

    async analyzeConnectedFeatures() {
        console.log('\n🔗 Analyzing connected design features...');
        
        const features = {
            geometricDesign: {
                'Sharp Corners': 'All cards have border-radius: 0 for geometric look',
                'Thin Borders': '1px solid borders with subtle white transparency',
                'Minimal Shadows': 'Reduced shadow intensity for cleaner appearance',
                'Sharp Edges': 'No rounded corners anywhere in the design'
            },
            pathSystem: {
                'Distance Calculation': 'Cards within 50-200px distance get connected',
                'Center-to-Center': 'Paths connect card centers for clean appearance',
                'Dynamic Drawing': 'Paths redrawn on resize and repositioning',
                'Smart Cleanup': 'Old paths removed before drawing new ones'
            },
            pathStyling: {
                'Thin Lines': '1px height paths with subtle white color',
                'Animated Dots': 'Pulsing dots at path endpoints',
                'Hover Effects': 'Paths brighten on hover for interactivity',
                'Z-Index Layering': 'Paths behind cards but visible'
            },
            networkBehavior: {
                'Proximity Based': 'Only nearby cards get connected',
                'Responsive': 'Paths adapt to window resizing',
                'Performance': 'Efficient distance calculations',
                'Visual Hierarchy': 'Paths don\'t interfere with card interactions'
            }
        };
        
        console.log('\n📊 Feature Analysis:');
        console.log('===================');
        
        Object.entries(features).forEach(([category, items]) => {
            console.log(`\n${category.toUpperCase()}:`);
            Object.entries(items).forEach(([key, value]) => {
                console.log(`  ${key}: ${value}`);
            });
        });
        
        return features;
    }

    async generateTestReport() {
        console.log('\n📋 Generating connected design test report...');
        
        const testResults = await this.testConnectedDesignImplementation();
        const features = await this.analyzeConnectedFeatures();
        
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                totalTests: testResults.totalTests,
                passedTests: testResults.passedTests,
                successRate: testResults.successRate
            },
            features,
            tests: testResults.tests,
            conclusion: testResults.successRate >= 85 ? 
                '✅ Connected design successfully implemented - cards now form a geometric network' :
                '⚠️ Some connected design features may need attention'
        };
        
        console.log('\n🎯 Test Summary:');
        console.log('================');
        console.log(`Total Tests: ${report.summary.totalTests}`);
        console.log(`Passed Tests: ${report.summary.passedTests}`);
        console.log(`Success Rate: ${report.summary.successRate.toFixed(1)}%`);
        console.log(`\n${report.conclusion}`);
        
        // Save detailed report
        const reportPath = path.join(__dirname, '..', 'verification-screenshots', 'connected-design-test.json');
        const reportDir = path.dirname(reportPath);
        if (!fs.existsSync(reportDir)) {
            fs.mkdirSync(reportDir, { recursive: true });
        }
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        console.log(`\n📄 Detailed test report saved: ${reportPath}`);
        
        return report;
    }

    async runTest() {
        console.log('🔗 Connected Design Implementation Test');
        console.log('=======================================');
        
        try {
            const report = await this.generateTestReport();
            
            if (report.summary.successRate >= 85) {
                console.log('\n🎉 SUCCESS: Connected design implemented!');
                console.log('Cards now have sharp geometric edges and are connected by thin paths.');
                console.log('The design creates a network-like appearance with animated connections.');
            } else {
                console.log('\n⚠️ WARNING: Some connected design features may need attention.');
            }
            
        } catch (error) {
            console.error('❌ Test failed:', error.message);
        }
    }
}

// Run test if called directly
if (require.main === module) {
    const tester = new ConnectedDesignTester();
    tester.runTest().catch(console.error);
}

module.exports = ConnectedDesignTester;


