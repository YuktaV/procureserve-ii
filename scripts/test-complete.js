#!/usr/bin/env node

/**
 * Complete E2E Test Setup for PSII
 * 
 * Sets up environment and runs Playwright tests
 * Usage: npm run test-complete
 */

import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

async function setupAndTest() {
  console.log('🚀 PSII Complete Testing Setup')
  
  try {
    // 1. Setup environment
    console.log('\n1️⃣ Setting up environment...')
    await execAsync('npm run smart-setup')
    
    // 2. Create test users
    console.log('\n2️⃣ Creating test users...')
    await execAsync('npm run create-test-users')
    
    // 3. Run unit/integration tests
    console.log('\n3️⃣ Running authentication tests...')
    await execAsync('npm run test-auth')
    
    // 4. Install Playwright browsers if needed
    console.log('\n4️⃣ Installing Playwright browsers...')
    await execAsync('npx playwright install chromium')
    
    // 5. Run E2E tests
    console.log('\n5️⃣ Running E2E tests...')
    await execAsync('npm run test-e2e')
    
    console.log('\n✅ All tests completed successfully!')
    console.log('\n📊 View E2E results: npx playwright show-report')
    
  } catch (error) {
    console.error('\n❌ Test setup failed:', error.message)
    process.exit(1)
  }
}

setupAndTest()
