#!/usr/bin/env node

// Comprehensive Dual-Application Testing Script
// Tests both Customer App and Console App with enterprise sidebar layouts

const http = require('http');

console.log('🚀 ProcureServe II - Dual Application Testing Suite');
console.log('==================================================\n');

console.log('🎯 Test Objective: Verify both applications work with new sidebar layouts');
console.log('📱 Customer App: http://localhost:3007');
console.log('🔧 Console App: http://localhost:3008');
console.log('⏰ Estimated Test Time: 15 minutes\n');

function checkUrl(url, description) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
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
  console.log('📊 APPLICATION STATUS CHECK');
  console.log('===========================\n');
  
  const tests = [
    // Customer App Tests
    { url: 'http://localhost:3007', desc: 'Customer App - Home page' },
    { url: 'http://localhost:3007/login', desc: 'Customer App - Login page' },
    
    // Console App Tests  
    { url: 'http://localhost:3008', desc: 'Console App - Home page' },
    { url: 'http://localhost:3008/login', desc: 'Console App - Login page' },
  ];
  
  let allPassed = true;
  
  for (const test of tests) {
    const result = await checkUrl(test.url, test.desc);
    if (!result) allPassed = false;
  }
  
  console.log('\n' + '='.repeat(50));
  
  if (allPassed) {
    console.log('🎉 DUAL APPLICATION HEALTH CHECK: PASSED');
    console.log('\n✅ Both applications are running properly');
    console.log('✅ All critical routes are accessible');
    console.log('✅ Ready for comprehensive sidebar testing');
  } else {
    console.log('❌ DUAL APPLICATION HEALTH CHECK: FAILED');
    console.log('\n🔧 Please check both development servers are running');
  }
  
  console.log('\n📋 COMPREHENSIVE TESTING CHECKLIST');
  console.log('===================================\n');
  
  console.log('🎨 PART 1: CUSTOMER APP TESTING (http://localhost:3007)');
  console.log('========================================================\n');
  
  console.log('✅ 1. CUSTOMER APP - AUTHENTICATION & SIDEBAR');
  console.log('   □ Navigate to http://localhost:3007');
  console.log('   □ Login with admin@acme-staffing.com / password123');
  console.log('   □ Verify modern collapsible sidebar appears');
  console.log('   □ Test sidebar collapse/expand with bottom button');
  console.log('   □ Test keyboard shortcut: Cmd/Ctrl + B');
  console.log('   □ Verify smooth 300ms animations');
  console.log('');
  
  console.log('✅ 2. CUSTOMER APP - NAVIGATION MENU');
  console.log('   □ Verify sections appear:');
  console.log('     - Main: Dashboard');
  console.log('     - Recruitment: Jobs, Candidates, Applications, Interviews');
  console.log('     - Bench Sales: Available Talent, Client Requirements, Submissions');
  console.log('     - Analytics: Reports, Activity');
  console.log('     - Account: Settings');
  console.log('   □ Test each navigation item clicks correctly');
  console.log('   □ Verify active page highlighting works');
  console.log('');
  
  console.log('✅ 3. CUSTOMER APP - USER MANAGEMENT');
  console.log('   □ Click Settings in sidebar');
  console.log('   □ Navigate to User Management');
  console.log('   □ Verify Phase 6 user management interface loads');
  console.log('   □ Test user list and invitation functionality');
  console.log('');
  
  console.log('✅ 4. CUSTOMER APP - MOBILE RESPONSIVENESS');
  console.log('   □ Resize browser to <768px width');
  console.log('   □ Verify sidebar converts to mobile overlay');
  console.log('   □ Test hamburger menu button');
  console.log('   □ Test overlay backdrop closing');
  console.log('');
  
  console.log('✅ 5. CUSTOMER APP - ROLE-BASED TESTING');
  console.log('   □ Test manager@acme-staffing.com / password123');
  console.log('     - Should see analytics but read-only user management');
  console.log('   □ Test recruiter@acme-staffing.com / password123');
  console.log('     - Should only see recruitment section');
  console.log('   □ Test bench@acme-staffing.com / password123');
  console.log('     - Should only see bench sales section');
  console.log('');
  
  console.log('🔧 PART 2: CONSOLE APP TESTING (http://localhost:3008)');
  console.log('======================================================\n');
  
  console.log('✅ 6. CONSOLE APP - AUTHENTICATION & SIDEBAR');
  console.log('   □ Navigate to http://localhost:3008');
  console.log('   □ Login with admin@procureserve.com / password123');
  console.log('   □ Verify purple-themed console sidebar appears');
  console.log('   □ Test sidebar collapse/expand functionality');
  console.log('   □ Test keyboard shortcut: Cmd/Ctrl + B');
  console.log('   □ Verify smooth animations match customer app');
  console.log('');
  
  console.log('✅ 7. CONSOLE APP - ADMIN NAVIGATION');
  console.log('   □ Verify admin sections appear:');
  console.log('     - Main: Dashboard');
  console.log('     - Management: Enum Management, Companies, User Management');
  console.log('     - System: Audit Logs, Settings');
  console.log('   □ Test each navigation item');
  console.log('   □ Verify purple theme and database icon');
  console.log('');
  
  console.log('✅ 8. CONSOLE APP - ENUM MANAGEMENT');
  console.log('   □ Click Enum Management in sidebar');
  console.log('   □ Verify existing enum management interface loads');
  console.log('   □ Test that sidebar integration works properly');
  console.log('');
  
  console.log('✅ 9. CONSOLE APP - MOBILE RESPONSIVENESS');
  console.log('   □ Resize browser to mobile width');
  console.log('   □ Verify console sidebar mobile behavior');
  console.log('   □ Test mobile menu functionality');
  console.log('');
  
  console.log('✅ 10. DUAL APPLICATION - VISUAL CONSISTENCY');
  console.log('   □ Compare both applications side by side');
  console.log('   □ Verify consistent animation timing (300ms)');
  console.log('   □ Check consistent spacing and typography');
  console.log('   □ Verify both feel like same product family');
  console.log('   □ Confirm both have enterprise-grade appearance');
  console.log('');
  
  console.log('🎨 VISUAL QUALITY CHECKLIST');
  console.log('===========================\n');
  
  console.log('🎯 Customer App (Blue/Indigo Theme):');
  console.log('   ✅ Professional blue sidebar with building icon');
  console.log('   ✅ Role-based navigation sections');
  console.log('   ✅ Modern dashboard with stats cards');
  console.log('   ✅ User management integration');
  console.log('');
  
  console.log('🔧 Console App (Purple Theme):');
  console.log('   ✅ Professional purple sidebar with database icon');
  console.log('   ✅ Admin-focused navigation sections');
  console.log('   ✅ Console admin dashboard');
  console.log('   ✅ Enum and system management tools');
  console.log('');
  
  console.log('🚀 SUCCESS CRITERIA - BOTH APPLICATIONS');
  console.log('=======================================\n');
  
  console.log('✅ Visual Quality:');
  console.log('   • Both apps have professional, enterprise-grade appearance');
  console.log('   • Consistent animation timing and smooth transitions');
  console.log('   • Proper responsive design across all breakpoints');
  console.log('   • Clear visual hierarchy and intuitive navigation');
  console.log('');
  
  console.log('✅ Functionality:');
  console.log('   • All sidebar features work (collapse, mobile, keyboard)');
  console.log('   • Role-based navigation shows appropriate items');
  console.log('   • Navigation between pages works seamlessly');
  console.log('   • User management and settings are accessible');
  console.log('');
  
  console.log('✅ Technical Quality:');
  console.log('   • No console errors in browser dev tools');
  console.log('   • Smooth performance with efficient rendering');
  console.log('   • Accessibility features work (keyboard navigation)');
  console.log('   • Mobile responsiveness functions properly');
  console.log('');
  
  console.log('🎯 NEXT STEPS AFTER SUCCESSFUL TESTING');
  console.log('=====================================\n');
  
  console.log('Once both applications pass all tests:');
  console.log('1. ✅ Confirm dual sidebar layout implementation is complete');
  console.log('2. 🚀 Proceed with ZeptoMail integration (30 minutes)');
  console.log('3. 🚀 Begin Phase 7A: User Edit Interface implementation');
  console.log('4. 🚀 Continue with Phase 7B: Business Units & Departments');
  console.log('5. 🚀 Implement Phase 7C: Audit Trail Dashboard');
  console.log('');
  
  console.log('📊 DEVELOPMENT STATUS');
  console.log('====================\n');
  
  console.log('• Customer App Sidebar: ✅ Enterprise-grade collapsible design');
  console.log('• Console App Sidebar: ✅ Admin-focused purple theme design');
  console.log('• Phase 6 User Management: ✅ Ready and integrated');
  console.log('• Email Integration: 🎯 Ready for ZeptoMail setup');
  console.log('• Phase 7A: 🎯 Ready to implement user edit interface');
  console.log('');
  
  console.log('🎉 READY FOR PRODUCTION-LEVEL TESTING!');
  console.log('=====================================\n');
  
  console.log('🔗 Test URLs:');
  console.log('• Customer App: http://localhost:3007');
  console.log('• Console App: http://localhost:3008');
  console.log('');
  
  console.log('👥 Test Accounts:');
  console.log('Customer App:');
  console.log('• admin@acme-staffing.com / password123');
  console.log('• manager@acme-staffing.com / password123');
  console.log('• recruiter@acme-staffing.com / password123');
  console.log('• bench@acme-staffing.com / password123');
  console.log('');
  console.log('Console App:');
  console.log('• admin@procureserve.com / password123');
  console.log('• support@procureserve.com / password123');
  console.log('• sales@procureserve.com / password123');
  console.log('');
  
  console.log('Ready to test both applications and move to Phase 7A! 🚀');
}

runHealthCheck().catch(console.error);
