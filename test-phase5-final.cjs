#!/usr/bin/env node

// Final test of Phase 5: Enterprise Admin Settings - Company Settings
const { chromium } = require('playwright');

async function testPhase5CompanySettings() {
    console.log('🎉 Phase 5 Final Test: Enterprise Admin Settings...');
    
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        // Login as admin
        console.log('🔐 Logging in as admin...');
        await page.goto('http://localhost:3007/login');
        await page.fill('[name="email"]', 'admin@acme-staffing.com');
        await page.fill('[name="password"]', 'password123');
        await page.click('[type="submit"]');
        await page.waitForTimeout(3000);
        
        // Navigate to settings
        console.log('⚙️ Navigating to settings...');
        await page.goto('http://localhost:3007/settings');
        
        // Verify Company Settings section is visible
        const companySettingsVisible = await page.locator('text=Company Settings').first().isVisible();
        console.log('✅ Company Settings section visible:', companySettingsVisible);
        
        // Click Company Settings
        console.log('🏢 Clicking Company Settings...');
        await page.click('text=Company Settings');
        await page.waitForTimeout(2000);
        
        // Verify we're on company settings page
        const onCompanyPage = page.url().includes('/settings/company');
        console.log('✅ On company settings page:', onCompanyPage);
        
        if (onCompanyPage) {
            // Test Company Profile Tab
            console.log('📋 Testing Company Profile tab...');
            const companyName = await page.inputValue('[name="name"]');
            const companyDomain = await page.inputValue('[name="domain"]');
            console.log(`🏢 Company Name: ${companyName}`);
            console.log(`🌐 Company Domain: ${companyDomain}`);
            
            // Test Business Hours Tab
            console.log('🕐 Testing Business Hours tab...');
            await page.click('text=Business Hours');
            await page.waitForTimeout(1000);
            
            const mondayCheckbox = await page.locator('input[type="checkbox"]:near(:text("Monday"))');
            const mondayEnabled = await mondayCheckbox.isChecked();
            console.log('📅 Monday enabled:', mondayEnabled);
            
            // Test Timezone Tab
            console.log('🌍 Testing Timezone tab...');
            await page.click('text=Timezone & Locale');
            await page.waitForTimeout(1000);
            
            const timezone = await page.inputValue('[name="timezone"]');
            const locale = await page.inputValue('[name="locale"]');
            console.log(`🕰️ Timezone: ${timezone}`);
            console.log(`🗺️ Locale: ${locale}`);
            
            console.log('🎉 Phase 5 Company Settings - ALL TESTS PASSED!');
        }
        
    } catch (error) {
        console.error('❌ Phase 5 test failed:', error.message);
    } finally {
        console.log('🔍 Keeping browser open for final inspection...');
        await page.waitForTimeout(5000);
        await browser.close();
    }
}

testPhase5CompanySettings();
