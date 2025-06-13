#!/usr/bin/env node

// Test bench sales login flow
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'http://127.0.0.1:54321'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testBenchSalesLogin() {
  console.log('🔐 Testing bench sales login flow...')
  
  try {
    // Test login with bench sales account
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'bench@acme-staffing.com',
      password: 'password123'
    })
    
    if (error) {
      console.error('❌ Login failed:', error.message)
      return
    }
    
    console.log('✅ Login successful!')
    console.log(`👤 User: ${data.user.email}`)
    
    // Test getting user data
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select(`
        *,
        companies (
          id,
          name,
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
    console.log(`📊 Bench Sales Enabled: ${userData.companies?.bench_sales_enabled}`)
    
    // Test bench sales dashboard queries
    const { data: consultantsData, error: consultantsError } = await supabase
      .from('consultants')
      .select('availability_status')
      .eq('company_id', userData.company_id)
    
    if (consultantsError) {
      console.error('❌ Consultants query failed:', consultantsError.message)
    } else {
      console.log(`👨‍💻 Consultants accessible: ${consultantsData.length}`)
      const stats = {}
      consultantsData.forEach(consultant => {
        stats[consultant.availability_status] = (stats[consultant.availability_status] || 0) + 1
      })
      console.log('🔢 Consultant stats:', stats)
    }
    
    // Test projects access
    const { data: projectsData, error: projectsError } = await supabase
      .from('projects')
      .select('status')
      .eq('company_id', userData.company_id)
    
    if (projectsError) {
      console.error('❌ Projects query failed:', projectsError.message)
    } else {
      console.log(`📊 Projects accessible: ${projectsData.length}`)
    }
    
    // Sign out
    await supabase.auth.signOut()
    console.log('✅ Signed out successfully')
    
  } catch (err) {
    console.error('❌ Test failed:', err.message)
  }
}

testBenchSalesLogin()
