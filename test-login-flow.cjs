#!/usr/bin/env node

// Simple test to verify login flow works with our test users
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'http://127.0.0.1:54321'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testLogin() {
  console.log('🔐 Testing login flow...')
  
  try {
    // Test login with recruiter account
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'recruiter@acme-staffing.com',
      password: 'password123'
    })
    
    if (error) {
      console.error('❌ Login failed:', error.message)
      return
    }
    
    console.log('✅ Login successful!')
    console.log(`👤 User: ${data.user.email}`)
    console.log(`🔑 Session: ${data.session.access_token.substring(0, 20)}...`)
    
    // Test getting user data (like dashboard would)
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select(`
        *,
        companies (
          id,
          name,
          recruitment_enabled,
          bench_sales_enabled
        )
      `)
      .eq('id', data.user.id)
      .single()
    
    if (userError) {
      console.error('❌ User data fetch failed:', userError.message)
      return
    }
    
    console.log('✅ User data retrieved!')
    console.log(`🏢 Company: ${userData.companies?.name}`)
    console.log(`👔 Role: ${userData.role}`)
    console.log(`🔧 Permissions: ${userData.process_permissions}`)
    
    // Test dashboard data query (like our enhanced dashboard does)
    const { data: jobsData, error: jobsError } = await supabase
      .from('jobs')
      .select('status')
      .eq('company_id', userData.company_id)
    
    if (jobsError) {
      console.error('❌ Jobs query failed:', jobsError.message)
    } else {
      console.log(`📋 Jobs accessible: ${jobsData.length}`)
      const stats = {}
      jobsData.forEach(job => {
        stats[job.status] = (stats[job.status] || 0) + 1
      })
      console.log('📊 Job stats:', stats)
    }
    
    // Sign out
    await supabase.auth.signOut()
    console.log('✅ Signed out successfully')
    
  } catch (err) {
    console.error('❌ Test failed:', err.message)
  }
}

testLogin()
