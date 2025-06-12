#!/usr/bin/env node

/**
 * Playwright Test Setup for PSII Authentication Flows
 * 
 * Tests all user scenarios with proper E2E validation
 * Usage: npm run test-e2e
 */

import { test, expect } from '@playwright/test'

const BASE_URL = 'http://localhost:3004'
const TEST_USERS = [
  {
    email: 'admin@acme-staffing.com',
    password: 'password123',
    expectedFlow: 'process-selection',
    description: 'Admin with both processes'
  },
  {
    email: 'manager@acme-staffing.com', 
    password: 'password123',
    expectedFlow: 'process-selection',
    description: 'Manager with both processes'
  },
  {
    email: 'recruiter@acme-staffing.com',
    password: 'password123',
    expectedFlow: 'recruitment-dashboard',
    description: 'Recruiter with recruitment only'
  },
  {
    email: 'bench@acme-staffing.com',
    password: 'password123', 
    expectedFlow: 'bench-sales-dashboard',
    description: 'Bench sales with bench_sales only'
  },
  {
    email: 'noprocess@acme-staffing.com',
    password: 'password123',
    expectedFlow: 'access-denied',
    description: 'User with no process permissions'
  }
]

test.describe('PSII Authentication Flows', () => {
  
  test.beforeEach(async ({ page }) => {
    // Ensure clean state
    await page.goto(`${BASE_URL}/api/signout`, { 
      method: 'POST',
      waitUntil: 'networkidle' 
    })
  })

  for (const user of TEST_USERS) {
    test(`${user.description} - ${user.expectedFlow}`, async ({ page }) => {
      
      // Go to test users page
      await page.goto(`${BASE_URL}/test-users`)
      
      // Find and click login button for this user
      const loginButton = page.locator(`text=Login as ${user.description.split(' ')[0]}`)
      await expect(loginButton).toBeVisible()
      await loginButton.click()
      
      // Wait for navigation
      await page.waitForLoadState('networkidle')
      
      // Verify expected flow
      switch (user.expectedFlow) {
        case 'process-selection':
          await expect(page).toHaveURL(/.*select-process.*/)
          await expect(page.locator('text=Choose Process')).toBeVisible()
          break
          
        case 'recruitment-dashboard':
          await expect(page).toHaveURL(/.*recruitment\/dashboard.*/)
          await expect(page.locator('text=Recruitment Dashboard')).toBeVisible()
          break
          
        case 'bench-sales-dashboard': 
          await expect(page).toHaveURL(/.*bench-sales\/dashboard.*/)
          await expect(page.locator('text=Bench Sales Dashboard')).toBeVisible()
          break
          
        case 'access-denied':
          await expect(page).toHaveURL(/.*access-denied.*/)
          await expect(page.locator('text=Access Denied')).toBeVisible()
          break
      }
    })
  }

  test('Process Selection Flow - Admin', async ({ page }) => {
    // Login as admin
    await page.goto(`${BASE_URL}/test-users`)
    await page.locator('text=Login as Admin').click()
    await page.waitForLoadState('networkidle')
    
    // Should be on process selection
    await expect(page).toHaveURL(/.*select-process.*/)
    
    // Test recruitment selection
    await page.locator('text=Recruitment').click()
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/.*recruitment\/dashboard.*/)
    
    // Go back to process selection
    await page.goto(`${BASE_URL}/select-process`)
    
    // Test bench sales selection
    await page.locator('text=Bench Sales').click()
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/.*bench-sales\/dashboard.*/)
  })

  test('Route Protection - Recruiter Access', async ({ page }) => {
    // Login as recruiter
    await page.goto(`${BASE_URL}/test-users`)
    await page.locator('text=Login as Recruiter').click()
    await page.waitForLoadState('networkidle')
    
    // Should access recruitment dashboard
    await expect(page).toHaveURL(/.*recruitment\/dashboard.*/)
    
    // Try to access bench sales (should be blocked)
    await page.goto(`${BASE_URL}/bench-sales/dashboard`)
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/.*access-denied.*/)
  })

  test('Route Protection - Bench Sales Access', async ({ page }) => {
    // Login as bench sales
    await page.goto(`${BASE_URL}/test-users`)
    await page.locator('text=Login as Bench Sales').click()
    await page.waitForLoadState('networkidle')
    
    // Should access bench sales dashboard
    await expect(page).toHaveURL(/.*bench-sales\/dashboard.*/)
    
    // Try to access recruitment (should be blocked)
    await page.goto(`${BASE_URL}/recruitment/dashboard`)
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/.*access-denied.*/)
  })

  test('Sign Out Flow', async ({ page }) => {
    // Login as admin
    await page.goto(`${BASE_URL}/test-users`)
    await page.locator('text=Login as Admin').click()
    await page.waitForLoadState('networkidle')
    
    // Should be logged in and see process selection
    await expect(page).toHaveURL(/.*select-process.*/)
    
    // Sign out
    await page.goto(`${BASE_URL}/api/signout`, { method: 'POST' })
    await page.waitForLoadState('networkidle')
    
    // Should redirect to login
    await expect(page).toHaveURL(/.*login.*/)
    
    // Try to access protected route (should redirect to login)
    await page.goto(`${BASE_URL}/dashboard`)
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/.*login.*/)
  })
})
