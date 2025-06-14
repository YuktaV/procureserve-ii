#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'http://127.0.0.1:54321'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkCustomerUserPermissions() {
  console.log('🔍 Checking customer user permissions...')
  
  const { data: users, error } = await supabase
    .from('users')
    .select('*')
    .in('email', [
      'john.recruiter@acme-staffing.com',
      'sarah.manager@acme-staffing.com', 
      'mike.sales@acme-staffing.com'
    ])
  
  if (error) {
    console.error('❌ Error:', error)
    return
  }
  
  console.log('\n📋 Customer Users:')
  users.forEach(user => {
    console.log(`\n👤 ${user.email}`)
    console.log(`   Role: ${user.role}`)
    console.log(`   Company ID: ${user.company_id}`)
    console.log(`   Profile:`, JSON.stringify(user.profile, null, 2))
    
    // Check if process_permissions is in the profile
    const processPermissions = user.profile?.process_permissions || user.process_permissions
    console.log(`   Process Permissions: ${JSON.stringify(processPermissions)}`)
    
    if (!processPermissions || processPermissions.length === 0) {
      console.log('   ⚠️ NO PROCESS PERMISSIONS - This will cause access denied!')
    }
  })
}

checkCustomerUserPermissions().catch(console.error)
