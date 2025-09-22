const puppeteer = require('puppeteer');
const { spawn } = require('child_process');
const path = require('path');

class QuickVerifier {
    constructor() {
        this.server = null;
        this.browser = null;
        this.page = null;
    }

    async startServer() {
        return new Promise((resolve, reject) => {
            this.server = spawn('node', ['server.js'], { 
                stdio: 'pipe',
                cwd: path.join(__dirname, '..')
            });
            
            this.server.stdout.on('data', (data) => {
                if (data.toString().includes('Server running at')) {
                    resolve();
                }
            });
            
            setTimeout(() => {
                reject(new Error('Server failed to start'));
            }, 10000);
        });
    }

    async startBrowser() {
        this.browser = await puppeteer.launch({ 
            headless: true, // Headless for quick verification
            defaultViewport: { width: 1920, height: 1080 }
        });
        this.page = await this.browser.newPage();
    }

    async takeScreenshot(name) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `quick-verify-${timestamp}-${name}.png`;
        const filepath = path.join(__dirname, '..', 'verification-screenshots', filename);
        
        await this.page.screenshot({ 
            path: filepath, 
            fullPage: true 
        });
        
        console.log(`📸 Screenshot: ${filename}`);
        return filepath;
    }

    async verifyFeature(description, verificationFunction) {
        console.log(`🔍 Verifying: ${description}`);
        try {
            const result = await verificationFunction();
            console.log(`✅ VERIFIED: ${description}`);
            return result;
        } catch (error) {
            console.log(`❌ FAILED: ${description} - ${error.message}`);
            throw error;
        }
    }

    async navigateToPage(url) {
        await this.page.goto(url, { waitUntil: 'networkidle2' });
    }

    async waitForElement(selector, timeout = 3000) {
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
    }

    async typeText(selector, text) {
        await this.page.waitForSelector(selector);
        await this.page.type(selector, text);
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

    async cleanup() {
        if (this.browser) {
            await this.browser.close();
        }
        if (this.server) {
            this.server.kill();
        }
    }
}

// Export for use in other scripts
module.exports = QuickVerifier;

// Quick verification function that can be called directly
async function quickVerify(description, verificationFunction) {
    const verifier = new QuickVerifier();
    
    try {
        await verifier.startServer();
        await verifier.startBrowser();
        
        const result = await verifier.verifyFeature(description, verificationFunction);
        return result;
    } catch (error) {
        console.error('Quick verification failed:', error.message);
        throw error;
    } finally {
        await verifier.cleanup();
    }
}

module.exports.quickVerify = quickVerify;


