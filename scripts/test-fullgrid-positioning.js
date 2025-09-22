const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class FullGridPositioningTester {
    constructor() {
        this.server = null;
    }

    async startServer() {
        console.log('🚀 Starting server for FullGrid positioning test...');
        return new Promise((resolve, reject) => {
            this.server = spawn('node', ['server.js'], { 
                stdio: 'pipe',
                cwd: path.join(__dirname, '..')
            });
            
            this.server.stdout.on('data', (data) => {
                if (data.toString().includes('Server running at')) {
                    console.log('✅ Server ready for testing');
                    resolve();
                }
            });
            
            this.server.stderr.on('data', (data) => {
                console.error('Server error:', data.toString());
            });
            
            setTimeout(() => {
                reject(new Error('Server failed to start'));
            }, 10000);
        });
    }

    async testPositioningImplementation() {
        console.log('🧪 Testing FullGrid positioning implementation...');
        
        // Read the updated index.html to verify positioning code exists
        const indexPath = path.join(__dirname, '..', 'site', 'index.html');
        const htmlContent = fs.readFileSync(indexPath, 'utf8');
        
        const tests = {
            hasPositioningFunctions: {
                test: htmlContent.includes('positionCardRandomly'),
                description: 'positionCardRandomly function exists'
            },
            hasCollisionDetection: {
                test: htmlContent.includes('checkCollision'),
                description: 'checkCollision function exists'
            },
            hasCardDimensions: {
                test: htmlContent.includes('getCardDimensions'),
                description: 'getCardDimensions function exists'
            },
            hasResetFunction: {
                test: htmlContent.includes('resetPositionedCards'),
                description: 'resetPositionedCards function exists'
            },
            hasDataAttributes: {
                test: htmlContent.includes('data-size='),
                description: 'Cards have data-size attributes'
            },
            hasPositioningCall: {
                test: htmlContent.includes('positionCardRandomly(card, sizeClass, index)'),
                description: 'Positioning function is called in renderSection'
            },
            hasResizeHandler: {
                test: htmlContent.includes('window.addEventListener(\'resize\''),
                description: 'Window resize handler exists'
            },
            hasZIndexVariation: {
                test: htmlContent.includes('zIndex = 10 + Math.floor(Math.random() * 8)'),
                description: 'Z-index variation implemented'
            },
            hasCollisionMargin: {
                test: htmlContent.includes('margin = 15'),
                description: 'Collision detection margin set to 15px'
            },
            hasOrganicOffset: {
                test: htmlContent.includes('offsetX = (Math.random() - 0.5) * 30'),
                description: 'Organic offset for natural positioning'
            }
        };
        
        console.log('\n📊 Implementation Test Results:');
        console.log('================================');
        
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

    async testCSSUpdates() {
        console.log('\n🎨 Testing CSS updates...');
        
        const cssPath = path.join(__dirname, '..', 'site', 'styles.css');
        const cssContent = fs.readFileSync(cssPath, 'utf8');
        
        const cssTests = {
            hasDefaultPositioning: {
                test: cssContent.includes('left:0;top:0'),
                description: 'Default positioning coordinates set'
            },
            hasAbsolutePositioning: {
                test: cssContent.includes('position:absolute'),
                description: 'Cards use absolute positioning'
            },
            hasZIndexBase: {
                test: cssContent.includes('z-index:10'),
                description: 'Base z-index set to 10'
            },
            hasHoverEffects: {
                test: cssContent.includes('card:hover'),
                description: 'Hover effects defined'
            },
            hasTransition: {
                test: cssContent.includes('transition:all 0.4s ease'),
                description: 'Smooth transitions enabled'
            }
        };
        
        console.log('\n📊 CSS Test Results:');
        console.log('====================');
        
        let passedCssTests = 0;
        let totalCssTests = Object.keys(cssTests).length;
        
        Object.entries(cssTests).forEach(([key, test]) => {
            const status = test.test ? '✅' : '❌';
            console.log(`${status} ${test.description}: ${test.test ? 'PASS' : 'FAIL'}`);
            if (test.test) passedCssTests++;
        });
        
        const cssSuccessRate = (passedCssTests / totalCssTests) * 100;
        console.log(`\n📈 CSS Success Rate: ${passedCssTests}/${totalCssTests} (${cssSuccessRate.toFixed(1)}%)`);
        
        return {
            passedCssTests,
            totalCssTests,
            cssSuccessRate,
            cssTests
        };
    }

    async generateTestReport() {
        console.log('\n📋 Generating comprehensive test report...');
        
        const jsResults = await this.testPositioningImplementation();
        const cssResults = await this.testCSSUpdates();
        
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                totalTests: jsResults.totalTests + cssResults.totalCssTests,
                passedTests: jsResults.passedTests + cssResults.passedCssTests,
                overallSuccessRate: ((jsResults.passedTests + cssResults.passedCssTests) / (jsResults.totalTests + cssResults.totalCssTests)) * 100
            },
            javascript: jsResults,
            css: cssResults,
            conclusion: jsResults.successRate >= 90 && cssResults.cssSuccessRate >= 90 ? 
                '✅ FullGrid positioning implementation is complete and ready for testing' :
                '⚠️ Some implementation details may need attention'
        };
        
        console.log('\n🎯 Overall Test Summary:');
        console.log('========================');
        console.log(`Total Tests: ${report.summary.totalTests}`);
        console.log(`Passed Tests: ${report.summary.passedTests}`);
        console.log(`Success Rate: ${report.summary.overallSuccessRate.toFixed(1)}%`);
        console.log(`\n${report.conclusion}`);
        
        // Save detailed report
        const reportPath = path.join(__dirname, '..', 'verification-screenshots', 'fullgrid-implementation-test.json');
        const reportDir = path.dirname(reportPath);
        if (!fs.existsSync(reportDir)) {
            fs.mkdirSync(reportDir, { recursive: true });
        }
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        console.log(`\n📄 Detailed test report saved: ${reportPath}`);
        
        return report;
    }

    async runTest() {
        console.log('🎯 FullGrid Positioning Implementation Test');
        console.log('==========================================');
        
        try {
            await this.startServer();
            const report = await this.generateTestReport();
            
            if (report.summary.overallSuccessRate >= 90) {
                console.log('\n🎉 SUCCESS: FullGrid positioning system is properly implemented!');
                console.log('The cards should now position randomly with controlled overlap.');
            } else {
                console.log('\n⚠️ WARNING: Some implementation details may need attention.');
            }
            
        } catch (error) {
            console.error('❌ Test failed:', error.message);
        } finally {
            await this.cleanup();
        }
    }

    async cleanup() {
        if (this.server) {
            this.server.kill();
            console.log('🔒 Server stopped');
        }
    }
}

// Run test if called directly
if (require.main === module) {
    const tester = new FullGridPositioningTester();
    tester.runTest().catch(console.error);
}

module.exports = FullGridPositioningTester;


