#!/usr/bin/env node

/**
 * PSII Authentication System Test Script
 * 
 * Tests the authentication flow after security fixes:
 * - getUser() instead of getSession() 
 * - Route protection logic
 * - User permissions validation
 * 
 * Usage: node auth-test.js
 */

import { createClient } from '@supabase/supabase-js'
import fetch from 'node-fetch'

// Supabase configuration (local development)
const SUPABASE_URL = 'http://127.0.0.1:54321'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'

// Test users
const TEST_USERS = [
  {
    email: 'admin@acme-staffing.com',
    password: 'password123',
    expectedPermissions: ['recruitment', 'bench_sales'],
    description: 'Admin with both processes'
  },
  {
    email: 'manager@acme-staffing.com', 
    password: 'password123',
    expectedPermissions: ['recruitment', 'bench_sales'],
    description: 'Manager with both processes'
  },
  {
    email: 'recruiter@acme-staffing.com',
    password: 'password123', 
    expectedPermissions: ['recruitment'],
    description: 'Recruiter with recruitment only'
  },
  {
    email: 'bench@acme-staffing.com',
    password: 'password123',
    expectedPermissions: ['bench_sales'],
    description: 'Bench sales with bench_sales only'
  },
  {
    email: 'noprocess@acme-staffing.com',
    password: 'password123',
    expectedPermissions: [],
    description: 'User with no process permissions'
  }
]

// Customer app URL for route testing
const APP_URL = 'http://localhost:3003'

class AuthTester {
  constructor() {
    this.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    this.results = []
  }

  log(message, data = null) {
    const timestamp = new Date().toISOString()
    const logEntry = `[${timestamp}] ${message}`
    console.log(logEntry)
    if (data) {
      console.log(JSON.stringify(data, null, 2))
    }
  }

  async testDirectAuth(user) {
    this.log(`\n=== Testing Direct Auth for: ${user.description} ===`)
    
    try {
      // Test sign in
      const { data: authData, error: authError } = await this.supabase.auth.signInWithPassword({
        email: user.email,
        password: user.password
      })

      if (authError) {
        this.log('❌ Auth Error:', authError)
        return { success: false, error: authError.message }
      }

      this.log('✅ Authentication successful')

      // Test getUser() (the new secure method)
      const { data: userData, error: userError } = await this.supabase.auth.getUser()
      
      if (userError) {
        this.log('❌ getUser() Error:', userError)
        return { success: false, error: userError.message }
      }

      this.log('✅ getUser() validation successful')

      // Fetch user permissions from database
      const { data: userProfile, error: profileError } = await this.supabase
        .from('users')
        .select('process_permissions, role, company_id')
        .eq('id', userData.user.id)
        .single()

      if (profileError) {
        this.log('❌ Profile fetch error:', profileError)
        return { success: false, error: profileError.message }
      }

      const actualPermissions = userProfile.process_permissions || []
      const permissionsMatch = JSON.stringify(actualPermissions.sort()) === JSON.stringify(user.expectedPermissions.sort())

      this.log('📋 User Profile:', {
        email: user.email,
        role: userProfile.role,
        company_id: userProfile.company_id,
        expected_permissions: user.expectedPermissions,
        actual_permissions: actualPermissions,
        permissions_match: permissionsMatch
      })

      // Sign out for next test
      await this.supabase.auth.signOut()

      return { 
        success: true, 
        permissionsMatch,
        actualPermissions,
        userProfile 
      }

    } catch (error) {
      this.log('❌ Unexpected error:', error)
      return { success: false, error: error.message }
    }
  }

  async testRouteProtection(user) {
    this.log(`\n=== Testing Route Protection for: ${user.description} ===`)
    
    try {
      // Sign in first
      const { data: authData, error: authError } = await this.supabase.auth.signInWithPassword({
        email: user.email,
        password: user.password
      })

      if (authError) {
        this.log('❌ Could not sign in for route test:', authError)
        return { success: false, error: authError.message }
      }

      // Get session to test route access
      const { data: { session } } = await this.supabase.auth.getSession()
      
      if (!session) {
        this.log('❌ No session available for route testing')
        return { success: false, error: 'No session' }
      }

      // Test route access patterns
      const routes = [
        '/dashboard',
        '/login',
        '/recruitment/dashboard',
        '/bench-sales/dashboard',
        '/select-process',
        '/access-denied'
      ]

      const routeResults = {}

      for (const route of routes) {
        try {
          const response = await fetch(`${APP_URL}${route}`, {
            headers: {
              'Cookie': `sb-access-token=${session.access_token}; sb-refresh-token=${session.refresh_token}`
            },
            redirect: 'manual' // Don't follow redirects
          })
          
          routeResults[route] = {
            status: response.status,
            location: response.headers.get('location'),
            accessible: response.status === 200
          }
        } catch (error) {
          routeResults[route] = {
            error: error.message,
            accessible: false
          }
        }
      }

      this.log('🔗 Route Access Results:', routeResults)

      // Sign out
      await this.supabase.auth.signOut()

      return { success: true, routeResults }

    } catch (error) {
      this.log('❌ Route protection test error:', error)
      return { success: false, error: error.message }
    }
  }

  async runAllTests() {
    this.log('🚀 Starting PSII Authentication System Tests')
    this.log('===============================================\n')

    for (const user of TEST_USERS) {
      // Test direct authentication
      const authResult = await this.testDirectAuth(user)
      
      // Test route protection (only if auth succeeded)
      let routeResult = null
      if (authResult.success) {
        routeResult = await this.testRouteProtection(user)
      }

      this.results.push({
        user: user.email,
        description: user.description,
        authResult,
        routeResult
      })

      // Wait between tests
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    this.generateReport()
  }

  generateReport() {
    this.log('\n\n📊 FINAL TEST REPORT')
    this.log('===================')

    let allPassed = true

    this.results.forEach(result => {
      const authPassed = result.authResult.success
      const routePassed = result.routeResult?.success ?? false
      const permissionsPassed = result.authResult.permissionsMatch ?? false
      
      const status = (authPassed && routePassed && permissionsPassed) ? '✅' : '❌'
      
      this.log(`${status} ${result.description}`)
      this.log(`   Auth: ${authPassed ? '✅' : '❌'} | Routes: ${routePassed ? '✅' : '❌'} | Permissions: ${permissionsPassed ? '✅' : '❌'}`)
      
      if (!authPassed || !routePassed || !permissionsPassed) {
        allPassed = false
      }
    })

    this.log(`\n🎯 Overall Result: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`)
    
    if (!allPassed) {
      this.log('\n🔧 Issues detected - check logs above for details')
    } else {
      this.log('\n🎉 Authentication system is working correctly!')
    }
  }
}

// Run the tests
const tester = new AuthTester()
tester.runAllTests().catch(console.error)
