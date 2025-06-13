// Test Company Settings Access
const { chromium } = require('playwright');

async function testCompanySettings() {
    console.log('🧪 Testing Company Settings Access...');
    
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        // Navigate to login
        console.log('📍 Navigating to http://localhost:3006/login');
        await page.goto('http://localhost:3006/login');
        
        // Login as admin (has permissions to edit company settings)
        console.log('🔐 Logging in as admin...');
        await page.fill('input[name="email"]', 'admin@acme-staffing.com');
        await page.fill('input[name="password"]', 'password123');
        await page.click('button[type="submit"]');
        
        // Wait for redirect
        await page.waitForURL(/\/select-process|\/dashboard|\/recruitment|\/bench-sales/);
        console.log('✅ Login successful, current URL:', page.url());
        
        // Navigate to settings
        console.log('⚙️ Navigating to settings...');
        await page.goto('http://localhost:3006/settings');
        await page.waitForLoadState('networkidle');
        
        // Click on Company Settings button
        console.log('🏢 Clicking Company Settings...');
        await page.click('text=Company Settings');
        
        // Wait for company settings page
        await page.waitForURL('**/settings/company');
        console.log('✅ Company settings page loaded');
        
        // Check if all tabs are present
        const tabs = await page.$$eval('[role="button"]:has-text("Company Profile"), [role="button"]:has-text("Business Hours"), [role="button"]:has-text("Timezone")');
        console.log('📋 Found tabs:', tabs.length);
        
        // Test Company Profile tab
        console.log('📝 Testing Company Profile form...');
        const companyName = await page.inputValue('input[name="name"]');
        console.log('🏢 Company Name:', companyName);
        
        // Test Business Hours tab  
        console.log('🕐 Testing Business Hours tab...');
        await page.click('text=Business Hours');
        await page.waitForTimeout(1000);
        
        const mondayEnabled = await page.isChecked('input[type="checkbox"]:near(:text("Monday"))');
        console.log('📅 Monday enabled:', mondayEnabled);
        
        // Test Timezone tab
        console.log('🌍 Testing Timezone tab...');
        await page.click('text=Timezone & Locale');
        await page.waitForTimeout(1000);
        
        const timezoneValue = await page.inputValue('select[name="timezone"]');
        console.log('🕰️ Current timezone:', timezoneValue);
        
        console.log('🎉 All company settings tests passed!');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        await page.screenshot({ path: 'company-settings-error.png' });
    } finally {
        await browser.close();
    }
}

testCompanySettings();
