// Debug Company Settings Test
const { chromium } = require('playwright');

async function debugCompanySettings() {
    console.log('🔍 Debug Test: Company Settings...');
    
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    // Enable console logs
    page.on('console', msg => {
        console.log('🌐 BROWSER:', msg.text());
    });
    
    try {
        // Go to login
        await page.goto('http://localhost:3007/login', { waitUntil: 'networkidle' });
        
        // Login
        await page.fill('[name="email"]', 'admin@acme-staffing.com');
        await page.fill('[name="password"]', 'password123');
        await page.click('[type="submit"]');
        await page.waitForTimeout(3000);
        
        // Go to settings
        await page.goto('http://localhost:3007/settings', { waitUntil: 'networkidle' });
        await page.waitForTimeout(2000);
        
        // Check page content
        const pageContent = await page.textContent('body');
        console.log('📄 Page contains "Company Settings":', pageContent.includes('Company Settings'));
        console.log('📄 Page contains "Business User":', pageContent.includes('Business User'));
        
        // Check if company settings section exists
        const companySection = await page.locator('text=Company Settings').count();
        console.log('🏢 Company Settings sections found:', companySection);
        
        // If Company Settings button exists, click it
        if (companySection > 0) {
            await page.click('text=Company Settings');
            await page.waitForTimeout(2000);
            console.log('✅ Clicked Company Settings, URL:', page.url());
        }
        
    } catch (error) {
        console.error('❌ Debug test failed:', error.message);
    } finally {
        await page.waitForTimeout(10000);
        await browser.close();
    }
}

debugCompanySettings();
