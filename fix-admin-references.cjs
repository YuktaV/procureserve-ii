#!/usr/bin/env node

// Script to fix foreign key references and update admin user ID
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'http://127.0.0.1:54321'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function fixAdminUserReferences() {
  console.log('🔧 Fixing admin user ID references...')
  
  const oldAdminId = 'a1e1f1a1-1111-1111-1111-111111111111'
  const newAdminId = 'c9e7701b-d5fe-46d6-acc0-fdd22403e326'
  
  console.log(`📝 Updating references from ${oldAdminId} to ${newAdminId}`)
  
  // Update jobs created_by references
  const { error: jobsError } = await supabase
    .from('jobs')
    .update({ created_by: newAdminId })
    .eq('created_by', oldAdminId)
  
  if (jobsError) {
    console.error('❌ Failed to update jobs references:', jobsError.message)
  } else {
    console.log('✅ Updated jobs created_by references')
  }
  
  // Update applications created_by references if any
  const { error: applicationsError } = await supabase
    .from('applications')
    .update({ created_by: newAdminId })
    .eq('created_by', oldAdminId)
  
  if (applicationsError && !applicationsError.message.includes('column "created_by" does not exist')) {
    console.error('❌ Failed to update applications references:', applicationsError.message)
  } else {
    console.log('✅ Updated applications references (if any)')
  }
  
  // Update consultants created_by references if any
  const { error: consultantsError } = await supabase
    .from('consultants')
    .update({ created_by: newAdminId })
    .eq('created_by', oldAdminId)
  
  if (consultantsError && !consultantsError.message.includes('column "created_by" does not exist')) {
    console.error('❌ Failed to update consultants references:', consultantsError.message)
  } else {
    console.log('✅ Updated consultants references (if any)')
  }
  
  // Now update the user ID
  const { error: userUpdateError } = await supabase
    .from('users')
    .update({ id: newAdminId })
    .eq('email', 'admin@acme-staffing.com')
  
  if (userUpdateError) {
    console.error('❌ Failed to update user ID:', userUpdateError.message)
  } else {
    console.log('✅ Successfully updated admin user ID')
  }
  
  console.log('🎉 Admin user fix complete!')
}

fixAdminUserReferences().catch(console.error)
