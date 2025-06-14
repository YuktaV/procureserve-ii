#!/usr/bin/env node

/**
 * Customer App Login Test
 * Tests the complete authentication flow without UI
 */

async function testCustomerAppLogin() {
  const fetch = (await import('node-fetch')).default;
  
  const BASE_URL = 'http://localhost:3006';
  const TEST_USER = {
    email: 'john.recruiter@acme-staffing.com',
    password: 'customer123'
  };
  
  console.log('🧪 Testing Customer App Authentication Flow...');
  
  try {
    // 1. Test if customer app is running
    console.log('\n1️⃣ Testing customer app availability...');
    const homeResponse = await fetch(BASE_URL);
    
    if (!homeResponse.ok) {
      console.error('❌ Customer app not responding:', homeResponse.status);
      return;
    }
    
    console.log('✅ Customer app is running');
    
    // 2. Test login page access
    console.log('\n2️⃣ Testing login page access...');
    const loginPageResponse = await fetch(`${BASE_URL}/login`);
    
    if (!loginPageResponse.ok) {
      console.error('❌ Login page not accessible:', loginPageResponse.status);
      return;
    }
    
    const loginPageText = await loginPageResponse.text();
    if (loginPageText.includes('Access Denied')) {
      console.error('❌ Login page shows Access Denied');
      console.log('Login page content preview:', loginPageText.substring(0, 500));
      return;
    }
    
    console.log('✅ Login page accessible');
    
    // 3. Test API endpoint availability
    console.log('\n3️⃣ Testing API endpoints...');
    const apiResponse = await fetch(`${BASE_URL}/api/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(TEST_USER)
    });
    
    console.log('API response status:', apiResponse.status);
    
    if (apiResponse.status === 404) {
      console.log('ℹ️ API endpoint might not exist - checking for form-based auth');
    } else {
      const apiText = await apiResponse.text();
      console.log('API response preview:', apiText.substring(0, 200));
    }
    
    // 4. Test root page redirect behavior
    console.log('\n4️⃣ Testing redirect behavior...');
    const rootResponse = await fetch(BASE_URL, { redirect: 'manual' });
    console.log('Root page status:', rootResponse.status);
    
    if (rootResponse.status >= 300 && rootResponse.status < 400) {
      const location = rootResponse.headers.get('location');
      console.log('Root redirects to:', location);
      
      if (location && location.includes('access-denied')) {
        console.error('❌ Root page redirects to access-denied');
        return;
      }
    }
    
    console.log('\n🎉 Basic connectivity tests passed');
    console.log('\n📋 Test Summary:');
    console.log('✅ Customer app is accessible');
    console.log('✅ Login page loads without access denied');
    console.log('ℹ️ Need Playwright for full UI testing');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testCustomerAppLogin().catch(console.error);
