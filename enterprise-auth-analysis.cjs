#!/usr/bin/env node

/**
 * ENTERPRISE CRITICAL: Customer App Authentication Analysis
 * This script performs a comprehensive analysis of the customer app authentication
 * to identify potential enterprise-level issues that could cause lawsuits/customer loss
 */

const fs = require('fs');
const path = require('path');

// Define critical files to analyze
const CRITICAL_FILES = [
  'apps/customer-app/src/hooks.server.ts',
  'apps/customer-app/src/routes/+layout.server.ts',
  'apps/customer-app/src/routes/login/+page.svelte',
  'apps/customer-app/src/routes/login/+page.server.ts',
  'apps/customer-app/src/routes/access-denied/+page.svelte',
  'apps/customer-app/src/lib/supabase.ts'
];

async function analyzeAuthenticationFlow() {
  console.log('🚨 ENTERPRISE CRITICAL: Authentication Flow Analysis');
  console.log('=' * 60);
  
  const issues = [];
  const warnings = [];
  const analysis = {};
  
  // Analyze each critical file
  for (const filePath of CRITICAL_FILES) {
    const fullPath = path.join('/Users/vasanthan/Desktop/PSII', filePath);
    
    console.log(`\n📁 Analyzing: ${filePath}`);
    
    if (!fs.existsSync(fullPath)) {
      issues.push(`CRITICAL: Missing file ${filePath}`);
      console.log('❌ FILE MISSING');
      continue;
    }
    
    const content = fs.readFileSync(fullPath, 'utf8');
    analysis[filePath] = content;
    
    // Check for critical authentication patterns
    const authChecks = analyzeAuthenticationPatterns(filePath, content);
    issues.push(...authChecks.issues);
    warnings.push(...authChecks.warnings);
    
    console.log(`✅ File exists (${content.length} chars)`);
  }
  
  // Perform cross-file analysis
  console.log('\n🔍 Cross-File Authentication Analysis');
  const crossFileIssues = performCrossFileAnalysis(analysis);
  issues.push(...crossFileIssues);
  
  // Report findings
  console.log('\n📊 ENTERPRISE AUTHENTICATION ANALYSIS REPORT');
  console.log('=' * 60);
  
  if (issues.length > 0) {
    console.log('\n🚨 CRITICAL ISSUES (POTENTIAL LAWSUIT/CUSTOMER LOSS):');
    issues.forEach((issue, index) => {
      console.log(`${index + 1}. ${issue}`);
    });
  }
  
  if (warnings.length > 0) {
    console.log('\n⚠️ WARNINGS (POTENTIAL PROBLEMS):');
    warnings.forEach((warning, index) => {
      console.log(`${index + 1}. ${warning}`);
    });
  }
  
  if (issues.length === 0) {
    console.log('\n✅ No critical authentication issues detected');
  }
  
  // Generate recommendations
  console.log('\n🎯 ENTERPRISE RECOMMENDATIONS:');
  generateRecommendations(issues, warnings);
  
  return { issues, warnings, analysis };
}

function analyzeAuthenticationPatterns(filePath, content) {
  const issues = [];
  const warnings = [];
  
  // Check for common authentication anti-patterns
  if (content.includes('console_users') && filePath.includes('customer-app')) {
    if (content.includes('redirect(303, \'/access-denied\')')) {
      issues.push(`${filePath}: Blocking console users from customer app - potential access denial bug`);
    }
  }
  
  // Check for hardcoded redirects to access-denied
  if (content.includes('access-denied') && !filePath.includes('access-denied')) {
    warnings.push(`${filePath}: Contains access-denied redirects - verify logic`);
  }
  
  // Check for proper error handling
  if (content.includes('throw redirect') && !content.includes('try {')) {
    warnings.push(`${filePath}: Redirect without proper error handling`);
  }
  
  // Check for authentication bypass conditions
  if (content.includes('isPublicPage') || content.includes('isAuthPage')) {
    if (!content.includes('auth.getUser()')) {
      warnings.push(`${filePath}: Route protection without user verification`);
    }
  }
  
  // Check for proper user data handling
  if (content.includes('users') && content.includes('FROM') && content.includes('WHERE')) {
    if (!content.includes('company_id')) {
      warnings.push(`${filePath}: User query without company isolation`);
    }
  }
  
  return { issues, warnings };
}

function performCrossFileAnalysis(analysis) {
  const issues = [];
  
  // Check if customer app blocks console users
  const hooksContent = analysis['apps/customer-app/src/hooks.server.ts'];
  if (hooksContent) {
    if (hooksContent.includes('console_users') && hooksContent.includes('access-denied')) {
      issues.push('CRITICAL: Customer app still blocking console users - will cause access denied errors');
    }
  }
  
  // Check for missing login page server logic
  const hasLoginPage = analysis['apps/customer-app/src/routes/login/+page.svelte'];
  const hasLoginServer = analysis['apps/customer-app/src/routes/login/+page.server.ts'];
  
  if (hasLoginPage && !hasLoginServer) {
    issues.push('CRITICAL: Login page exists but no server-side authentication logic');
  }
  
  return issues;
}

function generateRecommendations(issues, warnings) {
  if (issues.some(i => i.includes('console_users'))) {
    console.log('1. IMMEDIATE: Remove console_users blocking logic from customer app');
    console.log('2. IMMEDIATE: Implement proper customer user validation');
    console.log('3. IMMEDIATE: Test login flow with customer test accounts');
  }
  
  if (issues.some(i => i.includes('access-denied'))) {
    console.log('4. URGENT: Review all access-denied redirect conditions');
    console.log('5. URGENT: Implement proper user onboarding flow');
  }
  
  console.log('6. ENTERPRISE: Implement comprehensive error logging');
  console.log('7. ENTERPRISE: Add user session monitoring');
  console.log('8. ENTERPRISE: Implement authentication audit trail');
}

// Run the analysis
analyzeAuthenticationFlow().then(result => {
  if (result.issues.length > 0) {
    console.log('\n🚨 ENTERPRISE ALERT: Critical authentication issues detected!');
    process.exit(1);
  } else {
    console.log('\n✅ Authentication analysis complete - no critical issues');
    process.exit(0);
  }
}).catch(error => {
  console.error('❌ Analysis failed:', error);
  process.exit(1);
});
