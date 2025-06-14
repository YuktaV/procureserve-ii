#!/usr/bin/env node

/**
 * Authentication Verification Script
 * Verifies that both customer and console app authentication is working
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'http://127.0.0.1:54321'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testAuthentication() {
  console.log('🔐 Testing PSII Authentication Systems...\n')

  // Test Customer App Users
  console.log('📱 Customer App Authentication Tests:')
  const customerUsers = [
    { email: 'admin@acme-staffing.com', password: 'password123', role: 'Admin (Both Processes)' },
    { email: 'manager@acme-staffing.com', password: 'password123', role: 'Manager (Both Processes)' },
    { email: 'recruiter@acme-staffing.com', password: 'password123', role: 'Recruiter (Recruitment Only)' },
    { email: 'bench@acme-staffing.com', password: 'password123', role: 'Bench Sales (Bench Sales Only)' },
    { email: 'noprocess@acme-staffing.com', password: 'password123', role: 'No Process Access' }
  ]

  for (const user of customerUsers) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: user.password
      })

      if (error) {
        console.log(`❌ ${user.email}: ${error.message}`)
      } else {
        console.log(`✅ ${user.email}: ${user.role}`)
        await supabase.auth.signOut()
      }
    } catch (err) {
      console.log(`❌ ${user.email}: ${err.message}`)
    }
  }

  console.log('\n🏢 Console App Authentication Tests:')
  const consoleUsers = [
    { email: 'admin@procureserve.com', password: 'admin123', role: 'Super Admin' },
    { email: 'support@procureserve.com', password: 'admin123', role: 'Company Admin' },
    { email: 'sales@procureserve.com', password: 'admin123', role: 'Company Manager' }
  ]

  for (const user of consoleUsers) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: user.password
      })

      if (error) {
        console.log(`❌ ${user.email}: ${error.message}`)
      } else {
        console.log(`✅ ${user.email}: ${user.role}`)
        await supabase.auth.signOut()
      }
    } catch (err) {
      console.log(`❌ ${user.email}: ${err.message}`)
    }
  }

  console.log('\n🎯 Authentication verification complete!')
  console.log('\n📋 Application URLs:')
  console.log('   • Customer App: http://localhost:3004')
  console.log('   • Console App:  http://localhost:3005')
  console.log('   • Supabase Studio: http://localhost:54323')
  console.log('   • Email Testing: http://localhost:54324')
}

testAuthentication().catch(console.error)
