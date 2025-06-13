#!/usr/bin/env node

// Quick test: Direct navigation to company settings
const { chromium } = require('playwright');

async function testDirectNavigation() {
    console.log('🔍 Testing direct navigation to company settings...');
    
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        // Login first
        await page.goto('http://localhost:3007/login');
        await page.fill('[name="email"]', 'admin@acme-staffing.com');
        await page.fill('[name="password"]', 'password123');
        await page.click('[type="submit"]');
        await page.waitForTimeout(3000);
        
        // Navigate directly to company settings
        console.log('📍 Navigating directly to /settings/company...');
        await page.goto('http://localhost:3007/settings/company');
        await page.waitForTimeout(3000);
        
        const currentUrl = page.url();
        console.log('🌐 Current URL:', currentUrl);
        
        if (currentUrl.includes('/settings/company')) {
            console.log('✅ Successfully loaded company settings page!');
            
            // Check for page elements
            const pageTitle = await page.textContent('h1');
            console.log('📋 Page title:', pageTitle);
            
            const hasCompanyForm = await page.locator('[name="name"]').isVisible();
            console.log('📝 Company form visible:', hasCompanyForm);
            
        } else {
            console.log('❌ Failed to load company settings page');
            console.log('📄 Page content:', await page.textContent('body'));
        }
        
    } catch (error) {
        console.error('❌ Direct navigation test failed:', error.message);
    } finally {
        await page.waitForTimeout(5000);
        await browser.close();
    }
}

testDirectNavigation();
