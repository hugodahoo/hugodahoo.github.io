const puppeteer = require('puppeteer');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class FeatureVerifier {
    constructor() {
        this.server = null;
        this.browser = null;
        this.page = null;
        this.verificationResults = [];
    }

    async startServer() {
        console.log('🚀 Starting server for verification...');
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

    async startBrowser() {
        console.log('🌐 Starting browser for verification...');
        this.browser = await puppeteer.launch({ 
            headless: false, // Set to true for headless mode
            defaultViewport: { width: 1920, height: 1080 }
        });
        this.page = await this.browser.newPage();
        console.log('✅ Browser ready for verification');
    }

    async takeScreenshot(name, description = '') {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `verification-${timestamp}-${name}.png`;
        const filepath = path.join(__dirname, '..', 'verification-screenshots', filename);
        
        const dir = path.dirname(filepath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        await this.page.screenshot({ 
            path: filepath, 
            fullPage: true 
        });
        
        console.log(`📸 Verification screenshot: ${filename} - ${description}`);
        return filepath;
    }

    async verifyFeature(description, verificationFunction) {
        console.log(`\n🔍 Verifying: ${description}`);
        try {
            const result = await verificationFunction();
            this.verificationResults.push({ 
                description, 
                status: 'VERIFIED', 
                result: result,
                timestamp: new Date().toISOString()
            });
            console.log(`✅ VERIFIED: ${description}`);
            return result;
        } catch (error) {
            this.verificationResults.push({ 
                description, 
                status: 'FAILED', 
                error: error.message,
                timestamp: new Date().toISOString()
            });
            console.log(`❌ FAILED: ${description} - ${error.message}`);
            throw error;
        }
    }

    async navigateToPage(url) {
        console.log(`🔗 Navigating to: ${url}`);
        await this.page.goto(url, { waitUntil: 'networkidle2' });
    }

    async waitForElement(selector, timeout = 5000) {
        try {
            await this.page.waitForSelector(selector, { timeout });
            return true;
        } catch (error) {
            return false;
        }
    }

    async clickElement(selector) {
        await this.page.waitForSelector(selector);
        await this.page.click(selector);
        console.log(`🖱️ Clicked: ${selector}`);
    }

    async typeText(selector, text) {
        await this.page.waitForSelector(selector);
        await this.page.type(selector, text);
        console.log(`⌨️ Typed: ${text}`);
    }

    async getElementText(selector) {
        await this.page.waitForSelector(selector);
        return await this.page.$eval(selector, el => el.textContent);
    }

    async getElementCount(selector) {
        return await this.page.$$eval(selector, elements => elements.length);
    }

    async getElementAttribute(selector, attribute) {
        await this.page.waitForSelector(selector);
        return await this.page.$eval(selector, el => el.getAttribute(attribute));
    }

    async verifyPageLoads() {
        return await this.verifyFeature('Page loads correctly', async () => {
            await this.navigateToPage('http://localhost:3000');
            await this.takeScreenshot('page-load', 'Main page loaded');
            
            const hasHeader = await this.waitForElement('header');
            const hasProjects = await this.waitForElement('.card');
            
            if (!hasHeader || !hasProjects) {
                throw new Error('Page elements missing');
            }
            
            return { loaded: true, hasHeader, hasProjects };
        });
    }

    async verifySearchWorks() {
        return await this.verifyFeature('Search functionality works', async () => {
            await this.navigateToPage('http://localhost:3000');
            
            // Test search
            await this.typeText('#search', 'spectral');
            await this.page.waitForTimeout(1000);
            await this.takeScreenshot('search-test', 'Search for spectral projects');
            
            const projectCount = await this.getElementCount('.card');
            
            // Clear search
            await this.page.click('#search');
            await this.page.keyboard.down('Control');
            await this.page.keyboard.press('KeyA');
            await this.page.keyboard.up('Control');
            await this.page.keyboard.press('Backspace');
            await this.page.waitForTimeout(1000);
            
            const clearedCount = await this.getElementCount('.card');
            await this.takeScreenshot('search-cleared', 'Search cleared');
            
            return { searchResults: projectCount, clearedResults: clearedCount };
        });
    }

    async verifyStyleToggles() {
        return await this.verifyFeature('Style toggles work correctly', async () => {
            await this.navigateToPage('http://localhost:3000');
            
            // Test Cargo style
            await this.clickElement('#style-toggle');
            await this.page.waitForTimeout(1000);
            await this.takeScreenshot('cargo-style', 'Cargo style activated');
            
            const cargoActive = await this.page.$eval('body', el => el.classList.contains('cargo-style'));
            
            // Test FullGrid style
            await this.clickElement('#fullgrid-toggle');
            await this.page.waitForTimeout(1000);
            await this.takeScreenshot('fullgrid-style', 'FullGrid style activated');
            
            const fullgridActive = await this.page.$eval('body', el => el.classList.contains('fullgrid-style'));
            
            return { cargoActive, fullgridActive };
        });
    }

    async verifyProjectDetails() {
        return await this.verifyFeature('Project details page works', async () => {
            await this.navigateToPage('http://localhost:3000');
            
            // Click on first project
            const firstProject = await this.page.$('.card a');
            if (firstProject) {
                await firstProject.click();
                await this.page.waitForTimeout(1000);
                await this.takeScreenshot('project-detail', 'Project detail page');
                
                const currentUrl = this.page.url();
                const isProjectPage = currentUrl.includes('project.html');
                
                return { navigated: true, isProjectPage, currentUrl };
            } else {
                throw new Error('No projects found');
            }
        });
    }

    async verifyAPIEndpoints() {
        return await this.verifyFeature('API endpoints respond correctly', async () => {
            await this.navigateToPage('http://localhost:3000');
            
            // Test projects API
            const projectsResponse = await this.page.evaluate(async () => {
                try {
                    const response = await fetch('/api/projects');
                    const data = await response.json();
                    return { ok: response.ok, count: data.length };
                } catch (error) {
                    return { ok: false, error: error.message };
                }
            });
            
            // Test media API
            const mediaResponse = await this.page.evaluate(async () => {
                try {
                    const response = await fetch('/api/media/spectral-subjects');
                    const data = await response.json();
                    return { ok: response.ok, count: data.length };
                } catch (error) {
                    return { ok: false, error: error.message };
                }
            });
            
            await this.takeScreenshot('api-test', 'API endpoints tested');
            
            return { projectsResponse, mediaResponse };
        });
    }

    async verifyCustomFeature(description, verificationFunction) {
        return await this.verifyFeature(description, verificationFunction);
    }

    async runVerification() {
        console.log('🎯 Starting Feature Verification');
        console.log('================================');
        
        try {
            await this.startServer();
            await this.startBrowser();
            
            // Run standard verifications
            await this.verifyPageLoads();
            await this.verifySearchWorks();
            await this.verifyStyleToggles();
            await this.verifyProjectDetails();
            await this.verifyAPIEndpoints();
            
            console.log('\n📊 Verification Results');
            console.log('======================');
            this.verificationResults.forEach(result => {
                const status = result.status === 'VERIFIED' ? '✅' : '❌';
                console.log(`${status} ${result.description}: ${result.status}`);
            });
            
        } catch (error) {
            console.error('❌ Verification failed:', error.message);
        } finally {
            await this.cleanup();
        }
    }

    async cleanup() {
        if (this.browser) {
            await this.browser.close();
            console.log('🔒 Browser closed');
        }
        
        if (this.server) {
            this.server.kill();
            console.log('🔒 Server stopped');
        }
    }
}

// Run verification if called directly
if (require.main === module) {
    const verifier = new FeatureVerifier();
    verifier.runVerification().catch(console.error);
}

module.exports = FeatureVerifier;


