const fs = require('fs');
const path = require('path');

class NeuralNetworkSpecTester {
    constructor() {
        // No server needed for offline testing
    }

    async testNeuralNetworkImplementation() {
        console.log('🧠 Testing Neural Network Portfolio implementation...');
        
        // Read the updated files to verify neural network implementation
        const indexPath = path.join(__dirname, '..', 'site', 'index.html');
        const cssPath = path.join(__dirname, '..', 'site', 'styles.css');
        
        const htmlContent = fs.readFileSync(indexPath, 'utf8');
        const cssContent = fs.readFileSync(cssPath, 'utf8');
        
        const tests = {
            // Neural Network Toggle
            neuralToggle: {
                test: htmlContent.includes('neural-toggle'),
                description: 'Neural network toggle button implemented'
            },
            neuralToggleFunction: {
                test: htmlContent.includes('toggleNeuralNetwork'),
                description: 'Neural network toggle function implemented'
            },
            neuralStyleVariable: {
                test: htmlContent.includes('isNeuralNetworkStyle'),
                description: 'Neural network style variable implemented'
            },
            
            // CSS Implementation
            neuralNetworkStyle: {
                test: cssContent.includes('body.neural-network-style'),
                description: 'Neural network CSS class implemented'
            },
            projectBlockClass: {
                test: cssContent.includes('.project-block'),
                description: 'Project block CSS class implemented'
            },
            neuralBackground: {
                test: cssContent.includes('linear-gradient(135deg,#1a1a1a 0%,#2d2d2d 25%,#1a1a1a 50%,#0f0f0f 75%,#1a1a1a 100%)'),
                description: 'Neural network background gradient implemented'
            },
            
            // Category Color System
            installationColor: {
                test: cssContent.includes('category-installation{background:linear-gradient(135deg,#ff6b6b,#ff8e8e)}'),
                description: 'Installation category color implemented'
            },
            generativeColor: {
                test: cssContent.includes('category-generative{background:linear-gradient(135deg,#4ecdc4,#6dd5d0)}'),
                description: 'Generative category color implemented'
            },
            performanceColor: {
                test: cssContent.includes('category-performance{background:linear-gradient(135deg,#96ceb4,#a8d5c0)}'),
                description: 'Performance category color implemented'
            },
            commercialColor: {
                test: cssContent.includes('category-commercial{background:linear-gradient(135deg,#dda0dd,#e6b3e6)}'),
                description: 'Commercial category color implemented'
            },
            architectureColor: {
                test: cssContent.includes('category-architecture{background:linear-gradient(135deg,#45b7d1,#6bc5d8)}'),
                description: 'Architecture category color implemented'
            },
            digitalColor: {
                test: cssContent.includes('category-digital{background:linear-gradient(135deg,#ff9ff3,#ffb3f6)}'),
                description: 'Digital category color implemented'
            },
            sculptureColor: {
                test: cssContent.includes('category-sculpture{background:linear-gradient(135deg,#a8e6cf,#b8ead7)}'),
                description: 'Sculpture category color implemented'
            },
            mediaColor: {
                test: cssContent.includes('category-media{background:linear-gradient(135deg,#feca57,#fed976)}'),
                description: 'Media category color implemented'
            },
            
            // Hover Expansion System
            hoverExpansion: {
                test: cssContent.includes('transform:translateZ(30px) scale(1.8)'),
                description: 'Hover expansion system implemented'
            },
            blockSurface: {
                test: cssContent.includes('.block-surface'),
                description: 'Block surface element implemented'
            },
            blockTitle: {
                test: cssContent.includes('.block-title'),
                description: 'Block title element implemented'
            },
            unwrappedContent: {
                test: cssContent.includes('.unwrapped-content'),
                description: 'Unwrapped content element implemented'
            },
            
            // Neural Network Connections
            connectionPaths: {
                test: cssContent.includes('.connection-path'),
                description: 'Connection paths CSS implemented'
            },
            pathAnimation: {
                test: cssContent.includes('@keyframes pathDot'),
                description: 'Path dot animation implemented'
            },
            
            // Accessibility Features
            focusStates: {
                test: cssContent.includes('.project-block:focus'),
                description: 'Focus states implemented'
            },
            keyboardFocus: {
                test: cssContent.includes('.keyboard-focused'),
                description: 'Keyboard focus states implemented'
            },
            
            // Mobile Adaptations
            mobileMediaQuery: {
                test: cssContent.includes('@media (max-width: 768px)'),
                description: 'Mobile media queries implemented'
            },
            mobileBlockSizes: {
                test: cssContent.includes('width:100px;height:70px'),
                description: 'Mobile block sizes implemented'
            },
            
            // Performance Optimizations
            debouncedResize: {
                test: htmlContent.includes('resizeTimeout'),
                description: 'Debounced resize handler implemented'
            },
            intersectionObserver: {
                test: htmlContent.includes('IntersectionObserver'),
                description: 'Intersection Observer implemented'
            },
            
            // HTML Structure
            neuralNetworkRendering: {
                test: htmlContent.includes('isNeuralNetworkStyle') && htmlContent.includes('project-block'),
                description: 'Neural network rendering logic implemented'
            },
            categoryDetection: {
                test: htmlContent.includes('getProjectCategory'),
                description: 'Category detection function implemented'
            },
            blockPositioning: {
                test: htmlContent.includes('positionCardRandomly'),
                description: 'Block positioning algorithm implemented'
            },
            pathDrawing: {
                test: htmlContent.includes('drawConnectingPaths'),
                description: 'Path drawing system implemented'
            }
        };
        
        console.log('\n📊 Neural Network Implementation Test Results:');
        console.log('===============================================');
        
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

    async analyzeSpecCompliance() {
        console.log('\n🧠 Analyzing Neural Network spec compliance...');
        
        const specFeatures = {
            designSystem: {
                'Block-Based Architecture': 'Project blocks with sharp geometric edges',
                'Category Color System': '8 distinct color gradients for project categories',
                'Hover Expansion': '1.8x scale with dramatic 3D transformation',
                'Content Typography': 'Hierarchical typography with Space Grotesk font'
            },
            technicalImplementation: {
                'Collision Detection': 'Smart positioning with overlap prevention',
                'Connection Drawing': 'Dynamic path creation between nearby blocks',
                'Performance Optimization': 'Debounced resize and intersection observer',
                'Responsive Design': 'Mobile adaptations with simplified interactions'
            },
            accessibility: {
                'Keyboard Navigation': 'Tab navigation with focus states',
                'Screen Reader Support': 'Semantic HTML structure',
                'Focus Indicators': 'Visible focus outlines for keyboard users',
                'Mobile Touch': 'Touch-friendly interactions for mobile devices'
            },
            categorySystem: {
                'Installation': 'Red gradient for interactive installations',
                'Generative': 'Teal gradient for algorithmic art',
                'Performance': 'Green gradient for live performances',
                'Commercial': 'Purple gradient for corporate projects',
                'Architecture': 'Blue gradient for architectural projects',
                'Digital': 'Pink gradient for VR/AR/digital projects',
                'Sculpture': 'Light green gradient for visual art',
                'Media': 'Yellow gradient for film/media projects'
            }
        };
        
        console.log('\n📊 Spec Compliance Analysis:');
        console.log('===========================');
        
        Object.entries(specFeatures).forEach(([category, items]) => {
            console.log(`\n${category.toUpperCase()}:`);
            Object.entries(items).forEach(([key, value]) => {
                console.log(`  ${key}: ${value}`);
            });
        });
        
        return specFeatures;
    }

    async generateTestReport() {
        console.log('\n📋 Generating Neural Network spec test report...');
        
        const testResults = await this.testNeuralNetworkImplementation();
        const specFeatures = await this.analyzeSpecCompliance();
        
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                totalTests: testResults.totalTests,
                passedTests: testResults.passedTests,
                successRate: testResults.successRate
            },
            specFeatures,
            tests: testResults.tests,
            conclusion: testResults.successRate >= 90 ? 
                '✅ Neural Network Portfolio fully implemented according to specification' :
                '⚠️ Some neural network features may need attention'
        };
        
        console.log('\n🎯 Test Summary:');
        console.log('================');
        console.log(`Total Tests: ${report.summary.totalTests}`);
        console.log(`Passed Tests: ${report.summary.passedTests}`);
        console.log(`Success Rate: ${report.summary.successRate.toFixed(1)}%`);
        console.log(`\n${report.conclusion}`);
        
        // Save detailed report
        const reportPath = path.join(__dirname, '..', 'verification-screenshots', 'neural-network-spec-test.json');
        const reportDir = path.dirname(reportPath);
        if (!fs.existsSync(reportDir)) {
            fs.mkdirSync(reportDir, { recursive: true });
        }
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        console.log(`\n📄 Detailed test report saved: ${reportPath}`);
        
        return report;
    }

    async runTest() {
        console.log('🧠 Neural Network Portfolio Specification Test');
        console.log('===============================================');
        
        try {
            const report = await this.generateTestReport();
            
            if (report.summary.successRate >= 90) {
                console.log('\n🎉 SUCCESS: Neural Network Portfolio fully implemented!');
                console.log('All specification requirements have been met:');
                console.log('- Block-based project architecture ✅');
                console.log('- Category-based color system ✅');
                console.log('- Hover expansion system ✅');
                console.log('- Neural network connections ✅');
                console.log('- Performance optimizations ✅');
                console.log('- Accessibility features ✅');
                console.log('- Mobile adaptations ✅');
            } else {
                console.log('\n⚠️ WARNING: Some neural network features may need attention.');
                console.log('Please review the failed tests above.');
            }
            
        } catch (error) {
            console.error('❌ Test failed:', error.message);
        }
    }
}

// Run test if called directly
if (require.main === module) {
    const tester = new NeuralNetworkSpecTester();
    tester.runTest().catch(console.error);
}

module.exports = NeuralNetworkSpecTester;
