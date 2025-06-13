// Simple Company Settings Test
const { chromium } = require('playwright');

async function testCompanySettingsSimple() {
    console.log('🧪 Testing Company Settings - Simple Version...');
    
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        // Go directly to login page
        console.log('🔐 Going to login page...');
        await page.goto('http://localhost:3007/login', { waitUntil: 'networkidle' });
        
        // Fill login form
        console.log('📝 Filling login form...');
        await page.fill('[name="email"]', 'admin@acme-staffing.com');
        await page.fill('[name="password"]', 'password123');
        
        // Submit form
        console.log('🚀 Submitting login...');
        await page.click('[type="submit"]');
        
        // Wait for navigation
        await page.waitForTimeout(3000);
        console.log('📍 Current URL after login:', page.url());
        
        // Navigate to settings
        console.log('⚙️ Navigating to settings...');
        await page.goto('http://localhost:3007/settings', { waitUntil: 'networkidle' });
        
        // Check if Company Settings button exists
        console.log('🔍 Looking for Company Settings button...');
        const companyButton = await page.locator('text=Company Settings').first();
        
        if (await companyButton.isVisible()) {
            console.log('✅ Company Settings button found!');
            
            // Click on Company Settings
            await companyButton.click();
            await page.waitForTimeout(2000);
            
            console.log('📍 Current URL after clicking:', page.url());
            
            // Check if we're on company settings page
            if (page.url().includes('/settings/company')) {
                console.log('🎉 Successfully navigated to Company Settings page!');
                
                // Check for form elements
                const companyName = await page.locator('[name="name"]').inputValue();
                console.log('🏢 Company Name found:', companyName);
                
                // Check for tabs
                const profileTab = await page.locator('text=Company Profile').isVisible();
                const hoursTab = await page.locator('text=Business Hours').isVisible();
                const timezoneTab = await page.locator('text=Timezone').isVisible();
                
                console.log('📋 Tabs visible:');
                console.log('  - Profile:', profileTab);
                console.log('  - Business Hours:', hoursTab);
                console.log('  - Timezone:', timezoneTab);
                
            } else {
                console.log('❌ Not on company settings page, URL:', page.url());
            }
        } else {
            console.log('❌ Company Settings button not found');
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        await page.screenshot({ path: 'company-settings-test-error.png' });
    } finally {
        // Keep browser open for 10 seconds to inspect
        console.log('🔍 Keeping browser open for inspection...');
        await page.waitForTimeout(10000);
        await browser.close();
    }
}

testCompanySettingsSimple();
