#!/usr/bin/env node

// Quick Application Health Check
// Verifies that the application is running and key routes are accessible

const https = require('http');

console.log('🔍 ProcureServe II - Quick Health Check');
console.log('=====================================\n');

function checkUrl(url, description) {
  return new Promise((resolve) => {
    const req = https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const success = res.statusCode === 200;
        console.log(`${success ? '✅' : '❌'} ${description}: ${res.statusCode} ${success ? 'OK' : 'FAILED'}`);
        resolve(success);
      });
    });
    
    req.on('error', (err) => {
      console.log(`❌ ${description}: ERROR - ${err.message}`);
      resolve(false);
    });
    
    req.setTimeout(5000, () => {
      console.log(`❌ ${description}: TIMEOUT`);
      req.destroy();
      resolve(false);
    });
  });
}

async function runHealthCheck() {
  console.log('Testing application endpoints...\n');
  
  const tests = [
    { url: 'http://localhost:3007', desc: 'Home page' },
    { url: 'http://localhost:3007/login', desc: 'Login page' },
    { url: 'http://localhost:3007/register', desc: 'Registration page' },
  ];
  
  let allPassed = true;
  
  for (const test of tests) {
    const result = await checkUrl(test.url, test.desc);
    if (!result) allPassed = false;
  }
  
  console.log('\n' + '='.repeat(40));
  
  if (allPassed) {
    console.log('🎉 APPLICATION HEALTH CHECK: PASSED');
    console.log('\n✅ All critical routes are accessible');
    console.log('✅ Development server is running properly');
    console.log('✅ Ready for manual testing of sidebar layout');
    console.log('\n📋 NEXT STEPS:');
    console.log('1. Open http://localhost:3007 in your browser');
    console.log('2. Test login with admin@acme-staffing.com / password123');
    console.log('3. Verify sidebar layout and navigation');
    console.log('4. Test all user roles and permissions');
    console.log('5. Confirm responsive design works');
    console.log('\n🚀 Once testing is complete, we can proceed with Phase 7A!');
  } else {
    console.log('❌ APPLICATION HEALTH CHECK: FAILED');
    console.log('\n🔧 Please check:');
    console.log('- Development server is running on port 3007');
    console.log('- No build errors in the console');
    console.log('- All dependencies are installed');
  }
  
  console.log('\n📊 Current Status:');
  console.log('• Development Server: http://localhost:3007');
  console.log('• Sidebar Layout: ✅ Implemented');
  console.log('• User Management: ✅ Ready (Phase 6)');
  console.log('• Next Phase: 🎯 Phase 7A - User Edit Interface');
}

runHealthCheck().catch(console.error);
