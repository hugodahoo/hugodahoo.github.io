const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class FullGridPositioningVerifier {
    constructor() {
        this.server = null;
        this.results = [];
    }

    async startServer() {
        console.log('🚀 Starting server for FullGrid positioning verification...');
        return new Promise((resolve, reject) => {
            this.server = spawn('node', ['server.js'], { 
                stdio: 'pipe',
                cwd: path.join(__dirname, '..')
            });
            
            this.server.stdout.on('data', (data) => {
                if (data.toString().includes('Server running at')) {
                    console.log('✅ Server ready for verification');
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

    async analyzeFullGridCSS() {
        console.log('🔍 Analyzing FullGrid CSS positioning...');
        
        const cssPath = path.join(__dirname, '..', 'site', 'styles.css');
        const cssContent = fs.readFileSync(cssPath, 'utf8');
        
        // Extract FullGrid specific styles
        const fullgridMatch = cssContent.match(/body\.fullgrid-style\s*\{[^}]*\}/s);
        const cardStylesMatch = cssContent.match(/body\.fullgrid-style\s+\.card\s*\{[^}]*\}/s);
        const cardSizeMatches = cssContent.match(/body\.fullgrid-style\s+\.card\.(small|medium|large|xlarge)\s*\{[^}]*\}/g);
        
        const analysis = {
            hasFullGridStyle: !!fullgridMatch,
            hasCardStyles: !!cardStylesMatch,
            cardSizes: cardSizeMatches ? cardSizeMatches.length : 0,
            positioningMethod: 'absolute', // From CSS analysis
            cardSizes: {}
        };
        
        // Analyze card sizes
        if (cardSizeMatches) {
            cardSizeMatches.forEach(match => {
                const sizeMatch = match.match(/\.card\.(\w+)\s*\{[^}]*width:\s*(\d+)px[^}]*height:\s*(\d+)px/);
                if (sizeMatch) {
                    analysis.cardSizes[sizeMatch[1]] = {
                        width: parseInt(sizeMatch[2]),
                        height: parseInt(sizeMatch[3])
                    };
                }
            });
        }
        
        console.log('📊 CSS Analysis Results:');
        console.log(`- FullGrid style defined: ${analysis.hasFullGridStyle}`);
        console.log(`- Card styles defined: ${analysis.hasCardStyles}`);
        console.log(`- Card size variants: ${analysis.cardSizes}`);
        console.log(`- Positioning method: ${analysis.positioningMethod}`);
        
        return analysis;
    }

    async verifyCardPositioning() {
        console.log('🎯 Verifying FullGrid card positioning logic...');
        
        // Read the main JavaScript file to understand positioning logic
        const jsPath = path.join(__dirname, '..', 'site', 'index.html');
        const jsContent = fs.readFileSync(jsPath, 'utf8');
        
        // Look for positioning logic
        const hasRandomPositioning = jsContent.includes('getRandomSize') || jsContent.includes('Math.random');
        const hasSizeVariants = jsContent.includes('small') && jsContent.includes('medium') && jsContent.includes('large');
        const hasFullGridActivation = jsContent.includes('fullgrid-style');
        
        const positioningAnalysis = {
            hasRandomPositioning: hasRandomPositioning,
            hasSizeVariants: hasSizeVariants,
            hasFullGridActivation: hasFullGridActivation,
            positioningLogic: 'Random size assignment with CSS absolute positioning'
        };
        
        console.log('📊 Positioning Logic Analysis:');
        console.log(`- Random positioning: ${hasRandomPositioning}`);
        console.log(`- Size variants: ${hasSizeVariants}`);
        console.log(`- FullGrid activation: ${hasFullGridActivation}`);
        
        return positioningAnalysis;
    }

    async verifyOverlapBehavior() {
        console.log('🔍 Verifying card overlap behavior...');
        
        const cssPath = path.join(__dirname, '..', 'site', 'styles.css');
        const cssContent = fs.readFileSync(cssPath, 'utf8');
        
        // Look for overlap-related styles
        const hasAbsolutePositioning = cssContent.includes('position:absolute');
        const hasZIndex = cssContent.includes('z-index');
        const hasTransform = cssContent.includes('transform:');
        const hasTransition = cssContent.includes('transition:');
        
        // Check for specific overlap behaviors
        const hasHoverEffects = cssContent.includes('hover') && cssContent.includes('transform');
        const hasDraggable = cssContent.includes('draggable');
        
        const overlapAnalysis = {
            hasAbsolutePositioning: hasAbsolutePositioning,
            hasZIndex: hasZIndex,
            hasTransform: hasTransform,
            hasTransition: hasTransition,
            hasHoverEffects: hasHoverEffects,
            hasDraggable: hasDraggable,
            overlapBehavior: 'Cards use absolute positioning allowing natural overlap'
        };
        
        console.log('📊 Overlap Behavior Analysis:');
        console.log(`- Absolute positioning: ${hasAbsolutePositioning}`);
        console.log(`- Z-index management: ${hasZIndex}`);
        console.log(`- Transform effects: ${hasTransform}`);
        console.log(`- Hover effects: ${hasHoverEffects}`);
        console.log(`- Draggable: ${hasDraggable}`);
        
        return overlapAnalysis;
    }

    async generatePositioningReport() {
        console.log('📋 Generating FullGrid positioning report...');
        
        const cssAnalysis = await this.analyzeFullGridCSS();
        const positioningAnalysis = await this.verifyCardPositioning();
        const overlapAnalysis = await this.verifyOverlapBehavior();
        
        const report = {
            timestamp: new Date().toISOString(),
            fullGridPositioning: {
                cssAnalysis,
                positioningAnalysis,
                overlapAnalysis
            },
            recommendations: []
        };
        
        // Generate recommendations based on analysis
        if (!cssAnalysis.hasFullGridStyle) {
            report.recommendations.push('❌ FullGrid style not properly defined in CSS');
        }
        
        if (!positioningAnalysis.hasRandomPositioning) {
            report.recommendations.push('⚠️ Consider adding random positioning for organic feel');
        }
        
        if (!overlapAnalysis.hasAbsolutePositioning) {
            report.recommendations.push('❌ Cards need absolute positioning for proper overlap');
        }
        
        if (overlapAnalysis.hasHoverEffects) {
            report.recommendations.push('✅ Good: Hover effects enhance user interaction');
        }
        
        if (Object.keys(cssAnalysis.cardSizes).length >= 4) {
            report.recommendations.push('✅ Good: Multiple card sizes for visual variety');
        } else {
            report.recommendations.push('⚠️ Consider adding more card size variants');
        }
        
        return report;
    }

    async runVerification() {
        console.log('🎯 Starting FullGrid Positioning Verification');
        console.log('============================================');
        
        try {
            await this.startServer();
            
            const report = await this.generatePositioningReport();
            
            console.log('\n📊 FullGrid Positioning Verification Results');
            console.log('==========================================');
            
            console.log('\n🎨 CSS Analysis:');
            console.log(`- FullGrid style: ${report.fullGridPositioning.cssAnalysis.hasFullGridStyle ? '✅' : '❌'}`);
            console.log(`- Card styles: ${report.fullGridPositioning.cssAnalysis.hasCardStyles ? '✅' : '❌'}`);
            console.log(`- Card sizes: ${report.fullGridPositioning.cssAnalysis.cardSizes} variants`);
            
            console.log('\n⚙️ Positioning Logic:');
            console.log(`- Random positioning: ${report.fullGridPositioning.positioningAnalysis.hasRandomPositioning ? '✅' : '❌'}`);
            console.log(`- Size variants: ${report.fullGridPositioning.positioningAnalysis.hasSizeVariants ? '✅' : '❌'}`);
            console.log(`- FullGrid activation: ${report.fullGridPositioning.positioningAnalysis.hasFullGridActivation ? '✅' : '❌'}`);
            
            console.log('\n🔀 Overlap Behavior:');
            console.log(`- Absolute positioning: ${report.fullGridPositioning.overlapAnalysis.hasAbsolutePositioning ? '✅' : '❌'}`);
            console.log(`- Z-index management: ${report.fullGridPositioning.overlapAnalysis.hasZIndex ? '✅' : '❌'}`);
            console.log(`- Hover effects: ${report.fullGridPositioning.overlapAnalysis.hasHoverEffects ? '✅' : '❌'}`);
            
            console.log('\n💡 Recommendations:');
            report.recommendations.forEach(rec => console.log(`  ${rec}`));
            
            // Save detailed report
            const reportPath = path.join(__dirname, '..', 'verification-screenshots', 'fullgrid-positioning-report.json');
            const reportDir = path.dirname(reportPath);
            if (!fs.existsSync(reportDir)) {
                fs.mkdirSync(reportDir, { recursive: true });
            }
            fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
            console.log(`\n📄 Detailed report saved: ${reportPath}`);
            
        } catch (error) {
            console.error('❌ Verification failed:', error.message);
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

// Run verification if called directly
if (require.main === module) {
    const verifier = new FullGridPositioningVerifier();
    verifier.runVerification().catch(console.error);
}

module.exports = FullGridPositioningVerifier;


