const puppeteer = require('puppeteer');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class AutonomousTester {
    constructor() {
        this.server = null;
        this.browser = null;
        this.page = null;
        this.screenshots = [];
        this.testResults = [];
    }

    async startServer() {
        console.log('🚀 Starting server...');
        return new Promise((resolve, reject) => {
            this.server = spawn('node', ['server.js'], { 
                stdio: 'pipe',
                cwd: path.join(__dirname, '..')
            });
            
            this.server.stdout.on('data', (data) => {
                if (data.toString().includes('Server running at')) {
                    console.log('✅ Server started successfully');
                    resolve();
                }
            });
            
            this.server.stderr.on('data', (data) => {
                console.error('Server error:', data.toString());
            });
            
            // Timeout after 10 seconds
            setTimeout(() => {
                reject(new Error('Server failed to start within 10 seconds'));
            }, 10000);
        });
    }

    async startBrowser() {
        console.log('🌐 Starting browser...');
        this.browser = await puppeteer.launch({ 
            headless: false, // Set to true for headless mode
            defaultViewport: { width: 1920, height: 1080 }
        });
        this.page = await this.browser.newPage();
        console.log('✅ Browser started');
    }

    async takeScreenshot(name, description = '') {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `screenshot-${timestamp}-${name}.png`;
        const filepath = path.join(__dirname, '..', 'test-screenshots', filename);
        
        // Ensure directory exists
        const dir = path.dirname(filepath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        await this.page.screenshot({ 
            path: filepath, 
            fullPage: true 
        });
        
        this.screenshots.push({ name, filepath, description });
        console.log(`📸 Screenshot saved: ${filename} - ${description}`);
        return filepath;
    }

    async testFeature(featureName, testFunction) {
        console.log(`\n🧪 Testing: ${featureName}`);
        try {
            const result = await testFunction();
            this.testResults.push({ 
                feature: featureName, 
                status: 'PASS', 
                result: result,
                timestamp: new Date().toISOString()
            });
            console.log(`✅ ${featureName}: PASSED`);
            return result;
        } catch (error) {
            this.testResults.push({ 
                feature: featureName, 
                status: 'FAIL', 
                error: error.message,
                timestamp: new Date().toISOString()
            });
            console.log(`❌ ${featureName}: FAILED - ${error.message}`);
            throw error;
        }
    }

    async navigateToPage(url) {
        console.log(`🔗 Navigating to: ${url}`);
        await this.page.goto(url, { waitUntil: 'networkidle2' });
        await this.takeScreenshot('page-loaded', `Loaded ${url}`);
    }

    async waitForElement(selector, timeout = 5000) {
        try {
            await this.page.waitForSelector(selector, { timeout });
            return true;
        } catch (error) {
            console.log(`⏰ Element not found: ${selector}`);
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
        console.log(`⌨️ Typed in ${selector}: ${text}`);
    }

    async getElementText(selector) {
        await this.page.waitForSelector(selector);
        return await this.page.$eval(selector, el => el.textContent);
    }

    async getElementCount(selector) {
        return await this.page.$$eval(selector, elements => elements.length);
    }

    async waitForNetworkIdle() {
        await this.page.waitForLoadState('networkidle');
    }

    async testBasicFunctionality() {
        return await this.testFeature('Basic Page Load', async () => {
            await this.navigateToPage('http://localhost:3000');
            
            // Check if main elements are present
            const hasHeader = await this.waitForElement('header');
            const hasProjectGrid = await this.waitForElement('.project-grid');
            const hasSearch = await this.waitForElement('#search');
            
            if (!hasHeader || !hasProjectGrid || !hasSearch) {
                throw new Error('Essential page elements missing');
            }
            
            await this.takeScreenshot('basic-functionality', 'Main page loaded with all elements');
            
            return {
                header: hasHeader,
                projectGrid: hasProjectGrid,
                search: hasSearch
            };
        });
    }

    async testSearchFunctionality() {
        return await this.testFeature('Search Functionality', async () => {
            await this.navigateToPage('http://localhost:3000');
            
            // Test search
            await this.typeText('#search', 'spectral');
            await this.page.waitForTimeout(1000); // Wait for search to process
            
            const projectCount = await this.getElementCount('.card');
            await this.takeScreenshot('search-results', `Search for 'spectral' returned ${projectCount} results`);
            
            // Clear search
            await this.page.click('#search');
            await this.page.keyboard.down('Control');
            await this.page.keyboard.press('KeyA');
            await this.page.keyboard.up('Control');
            await this.page.keyboard.press('Backspace');
            await this.page.waitForTimeout(1000);
            
            const clearedCount = await this.getElementCount('.card');
            await this.takeScreenshot('search-cleared', `Search cleared, showing ${clearedCount} projects`);
            
            return {
                searchResults: projectCount,
                clearedResults: clearedCount
            };
        });
    }

    async testStyleToggles() {
        return await this.testFeature('Style Toggles', async () => {
            await this.navigateToPage('http://localhost:3000');
            
            // Test Cargo style
            await this.clickElement('#style-toggle');
            await this.page.waitForTimeout(1000);
            await this.takeScreenshot('cargo-style', 'Cargo style activated');
            
            // Test FullGrid style
            await this.clickElement('#fullgrid-toggle');
            await this.page.waitForTimeout(1000);
            await this.takeScreenshot('fullgrid-style', 'FullGrid style activated');
            
            // Check if styles are applied
            const bodyClasses = await this.page.$eval('body', el => el.className);
            
            return {
                bodyClasses: bodyClasses,
                cargoActive: bodyClasses.includes('cargo-style'),
                fullgridActive: bodyClasses.includes('fullgrid-style')
            };
        });
    }

    async testProjectNavigation() {
        return await this.testFeature('Project Navigation', async () => {
            await this.navigateToPage('http://localhost:3000');
            
            // Click on first project
            const firstProject = await this.page.$('.card a');
            if (firstProject) {
                await firstProject.click();
                await this.page.waitForTimeout(1000);
                await this.takeScreenshot('project-detail', 'Project detail page loaded');
                
                // Check if we're on project page
                const currentUrl = this.page.url();
                const isProjectPage = currentUrl.includes('project.html');
                
                return {
                    navigated: true,
                    isProjectPage: isProjectPage,
                    currentUrl: currentUrl
                };
            } else {
                throw new Error('No projects found to navigate to');
            }
        });
    }

    async testAPIEndpoints() {
        return await this.testFeature('API Endpoints', async () => {
            // Test projects API
            const projectsResponse = await this.page.evaluate(async () => {
                const response = await fetch('/api/projects');
                return response.ok;
            });
            
            // Test media API (using first project)
            const mediaResponse = await this.page.evaluate(async () => {
                const response = await fetch('/api/media/spectral-subjects');
                return response.ok;
            });
            
            await this.takeScreenshot('api-test', 'API endpoints tested');
            
            return {
                projectsAPI: projectsResponse,
                mediaAPI: mediaResponse
            };
        });
    }

    async runAllTests() {
        console.log('🎯 Starting Autonomous Testing Suite');
        console.log('=====================================');
        
        try {
            await this.startServer();
            await this.startBrowser();
            
            // Run all tests
            await this.testBasicFunctionality();
            await this.testSearchFunctionality();
            await this.testStyleToggles();
            await this.testProjectNavigation();
            await this.testAPIEndpoints();
            
            console.log('\n📊 Test Results Summary');
            console.log('======================');
            this.testResults.forEach(result => {
                const status = result.status === 'PASS' ? '✅' : '❌';
                console.log(`${status} ${result.feature}: ${result.status}`);
            });
            
            console.log('\n📸 Screenshots Captured');
            console.log('=======================');
            this.screenshots.forEach(screenshot => {
                console.log(`📷 ${screenshot.name}: ${screenshot.description}`);
            });
            
        } catch (error) {
            console.error('❌ Test suite failed:', error.message);
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

// Run tests if called directly
if (require.main === module) {
    const tester = new AutonomousTester();
    tester.runAllTests().catch(console.error);
}

module.exports = AutonomousTester;


