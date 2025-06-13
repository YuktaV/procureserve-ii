#!/usr/bin/env node

// Script to check current user situation and fix admin user
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'http://127.0.0.1:54321'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function checkAndFixUsers() {
  console.log('🔍 Checking current user situation...')
  
  // Get all business users
  const { data: businessUsers } = await supabase
    .from('users')
    .select('id, email, role, process_permissions')
  
  console.log('📋 Business users in database:')
  businessUsers?.forEach(user => {
    console.log(`  ${user.email} | ID: ${user.id} | Role: ${user.role}`)
  })
  
  // Get all auth users
  const { data: authUsers } = await supabase.auth.admin.listUsers()
  console.log('\n🔐 Auth users:')
  authUsers?.users.forEach(user => {
    console.log(`  ${user.email} | ID: ${user.id}`)
  })
  
  // Find the auth admin user
  const authAdmin = authUsers?.users.find(u => u.email === 'admin@acme-staffing.com')
  if (!authAdmin) {
    console.error('❌ Auth admin user not found')
    return
  }
  
  console.log(`\n🎯 Auth admin ID: ${authAdmin.id}`)
  
  // Update the business user with correct auth ID
  const { error: updateError } = await supabase
    .from('users')
    .update({ id: authAdmin.id })
    .eq('email', 'admin@acme-staffing.com')
  
  if (updateError) {
    console.error('❌ Failed to update admin user ID:', updateError.message)
    
    // Try deleting and recreating
    console.log('🔄 Trying to delete and recreate admin user...')
    
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('email', 'admin@acme-staffing.com')
    
    if (deleteError) {
      console.error('❌ Failed to delete existing admin user:', deleteError.message)
      return
    }
    
    // Get company ID
    const { data: company } = await supabase
      .from('companies')
      .select('id')
      .eq('name', 'Acme Staffing')
      .single()
    
    // Insert new admin user
    const { error: insertError } = await supabase
      .from('users')
      .insert({
        id: authAdmin.id,
        email: 'admin@acme-staffing.com',
        role: 'admin',
        process_permissions: ['recruitment', 'bench_sales'],
        company_id: company.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    
    if (insertError) {
      console.error('❌ Failed to insert new admin user:', insertError.message)
    } else {
      console.log('✅ Successfully recreated admin user with correct ID')
    }
  } else {
    console.log('✅ Successfully updated admin user ID')
  }
}

checkAndFixUsers().catch(console.error)
