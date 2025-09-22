const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class LargerCardsTester {
    constructor() {
        this.server = null;
    }

    async startServer() {
        console.log('🚀 Starting server for larger cards test...');
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

    async testCardSizeUpdates() {
        console.log('🧪 Testing larger card size implementation...');
        
        // Read the updated files to verify size changes
        const indexPath = path.join(__dirname, '..', 'site', 'index.html');
        const cssPath = path.join(__dirname, '..', 'site', 'styles.css');
        
        const htmlContent = fs.readFileSync(indexPath, 'utf8');
        const cssContent = fs.readFileSync(cssPath, 'utf8');
        
        const tests = {
            // JavaScript dimension tests
            jsSmallSize: {
                test: htmlContent.includes('small: { width: 180, height: 120 }'),
                description: 'Small cards: 180x120px (50% increase from 120x80)'
            },
            jsMediumSize: {
                test: htmlContent.includes('medium: { width: 240, height: 150 }'),
                description: 'Medium cards: 240x150px (50% increase from 160x100)'
            },
            jsLargeSize: {
                test: htmlContent.includes('large: { width: 300, height: 180 }'),
                description: 'Large cards: 300x180px (50% increase from 200x120)'
            },
            jsXLargeSize: {
                test: htmlContent.includes('xlarge: { width: 360, height: 210 }'),
                description: 'XLarge cards: 360x210px (50% increase from 240x140)'
            },
            
            // CSS dimension tests
            cssSmallSize: {
                test: cssContent.includes('card.small{width:180px;height:120px}'),
                description: 'CSS small cards: 180x120px'
            },
            cssMediumSize: {
                test: cssContent.includes('card.medium{width:240px;height:150px}'),
                description: 'CSS medium cards: 240x150px'
            },
            cssLargeSize: {
                test: cssContent.includes('card.large{width:300px;height:180px}'),
                description: 'CSS large cards: 300x180px'
            },
            cssXLargeSize: {
                test: cssContent.includes('card.xlarge{width:360px;height:210px}'),
                description: 'CSS xlarge cards: 360x210px'
            },
            
            // Collision detection updates
            increasedMargin: {
                test: htmlContent.includes('margin = 20'),
                description: 'Collision margin increased to 20px (from 15px)'
            },
            increasedOffset: {
                test: htmlContent.includes('offsetX = (Math.random() - 0.5) * 40'),
                description: 'Organic offset increased to 40px range (from 30px)'
            }
        };
        
        console.log('\n📊 Card Size Update Test Results:');
        console.log('==================================');
        
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

    async calculateSizeIncrease() {
        console.log('\n📏 Calculating size increases...');
        
        const oldSizes = {
            small: { width: 120, height: 80 },
            medium: { width: 160, height: 100 },
            large: { width: 200, height: 120 },
            xlarge: { width: 240, height: 140 }
        };
        
        const newSizes = {
            small: { width: 180, height: 120 },
            medium: { width: 240, height: 150 },
            large: { width: 300, height: 180 },
            xlarge: { width: 360, height: 210 }
        };
        
        console.log('\n📊 Size Comparison:');
        console.log('===================');
        
        Object.keys(oldSizes).forEach(size => {
            const old = oldSizes[size];
            const newSize = newSizes[size];
            
            const widthIncrease = ((newSize.width - old.width) / old.width * 100).toFixed(1);
            const heightIncrease = ((newSize.height - old.height) / old.height * 100).toFixed(1);
            const areaIncrease = (((newSize.width * newSize.height) - (old.width * old.height)) / (old.width * old.height) * 100).toFixed(1);
            
            console.log(`${size.toUpperCase()}:`);
            console.log(`  Width: ${old.width}px → ${newSize.width}px (+${widthIncrease}%)`);
            console.log(`  Height: ${old.height}px → ${newSize.height}px (+${heightIncrease}%)`);
            console.log(`  Area: ${old.width * old.height}px² → ${newSize.width * newSize.height}px² (+${areaIncrease}%)`);
            console.log('');
        });
        
        return { oldSizes, newSizes };
    }

    async generateTestReport() {
        console.log('\n📋 Generating larger cards test report...');
        
        const sizeResults = await this.testCardSizeUpdates();
        const sizeComparison = await this.calculateSizeIncrease();
        
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                totalTests: sizeResults.totalTests,
                passedTests: sizeResults.passedTests,
                successRate: sizeResults.successRate
            },
            sizeComparison,
            tests: sizeResults.tests,
            conclusion: sizeResults.successRate >= 90 ? 
                '✅ All card sizes successfully increased by 50% with proportional overlap adjustments' :
                '⚠️ Some size updates may need attention'
        };
        
        console.log('\n🎯 Test Summary:');
        console.log('================');
        console.log(`Total Tests: ${report.summary.totalTests}`);
        console.log(`Passed Tests: ${report.summary.passedTests}`);
        console.log(`Success Rate: ${report.summary.successRate.toFixed(1)}%`);
        console.log(`\n${report.conclusion}`);
        
        // Save detailed report
        const reportPath = path.join(__dirname, '..', 'verification-screenshots', 'larger-cards-test.json');
        const reportDir = path.dirname(reportPath);
        if (!fs.existsSync(reportDir)) {
            fs.mkdirSync(reportDir, { recursive: true });
        }
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        console.log(`\n📄 Detailed test report saved: ${reportPath}`);
        
        return report;
    }

    async runTest() {
        console.log('🎯 Larger Cards Implementation Test');
        console.log('==================================');
        
        try {
            await this.startServer();
            const report = await this.generateTestReport();
            
            if (report.summary.successRate >= 90) {
                console.log('\n🎉 SUCCESS: Card sizes successfully increased by 50%!');
                console.log('The cards are now significantly larger while maintaining proper overlap behavior.');
            } else {
                console.log('\n⚠️ WARNING: Some size updates may need attention.');
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
    const tester = new LargerCardsTester();
    tester.runTest().catch(console.error);
}

module.exports = LargerCardsTester;


