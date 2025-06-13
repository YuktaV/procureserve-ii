#!/usr/bin/env node

// Script to create a new admin user with correct auth ID
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'http://127.0.0.1:54321'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createCorrectAdminUser() {
  console.log('🔧 Creating correct admin user with auth ID...')
  
  const authAdminId = 'c9e7701b-d5fe-46d6-acc0-fdd22403e326'
  
  // Get company ID
  const { data: company } = await supabase
    .from('companies')
    .select('id')
    .eq('name', 'Acme Staffing')
    .single()
  
  if (!company) {
    console.error('❌ Company not found')
    return
  }
  
  // Check if user already exists with this ID
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('id', authAdminId)
    .single()
  
  if (existingUser) {
    console.log('✅ User with correct auth ID already exists')
    return
  }
  
  // Insert new user with correct auth ID
  const { error: insertError } = await supabase
    .from('users')
    .insert({
      id: authAdminId,
      email: 'admin-correct@acme-staffing.com', // Use different email temporarily
      role: 'admin',
      process_permissions: ['recruitment', 'bench_sales'],
      company_id: company.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
  
  if (insertError) {
    console.error('❌ Failed to insert new admin user:', insertError.message)
    return
  }
  
  console.log('✅ Created new admin user with correct ID')
  
  // Update jobs to reference new admin user
  const { error: jobsError } = await supabase
    .from('jobs')
    .update({ created_by: authAdminId })
    .eq('created_by', 'a1e1f1a1-1111-1111-1111-111111111111')
  
  if (jobsError) {
    console.error('❌ Failed to update jobs references:', jobsError.message)
    return
  }
  
  console.log('✅ Updated jobs to reference correct admin user')
  
  // Delete old admin user
  const { error: deleteError } = await supabase
    .from('users')
    .delete()
    .eq('id', 'a1e1f1a1-1111-1111-1111-111111111111')
  
  if (deleteError) {
    console.error('❌ Failed to delete old admin user:', deleteError.message)
    return
  }
  
  console.log('✅ Deleted old admin user')
  
  // Update the new user to have correct email
  const { error: updateError } = await supabase
    .from('users')
    .update({ email: 'admin@acme-staffing.com' })
    .eq('id', authAdminId)
  
  if (updateError) {
    console.error('❌ Failed to update email:', updateError.message)
  } else {
    console.log('✅ Updated admin user email to correct value')
  }
  
  console.log('🎉 Admin user correction complete!')
}

createCorrectAdminUser().catch(console.error)
