#!/usr/bin/env node

/**
 * Fix user ID mismatch between Auth and Database
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'http://127.0.0.1:54321'
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'

async function fixUserIds() {
  console.log('🔧 Fixing user ID mismatch between Auth and Database...\n')
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  // Get all auth users
  const { data: authData, error: authError } = await supabase.auth.admin.listUsers()
  
  if (authError) {
    console.log('❌ Auth error:', authError)
    return
  }

  const acmeUsers = authData.users.filter(user => user.email?.includes('acme-staffing.com'))
  
  console.log('📧 Found auth users to update:')
  for (const authUser of acmeUsers) {
    console.log(`  ${authUser.email}: ${authUser.id}`)
    
    // Update the database record
    const { data, error } = await supabase
      .from('users')
      .update({ id: authUser.id })
      .eq('email', authUser.email)
    
    if (error) {
      console.log(`❌ Failed to update ${authUser.email}:`, error.message)
    } else {
      console.log(`✅ Updated ${authUser.email}`)
    }
  }

  console.log('\n🎯 User ID sync complete!')
  
  // Verify the fix
  console.log('\n🧪 Testing authentication after fix:')
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: 'admin@acme-staffing.com',
    password: 'password123'
  })

  if (signInError) {
    console.log('❌ Sign in error:', signInError)
  } else {
    console.log(`✅ Sign in successful: ${signInData.user.email}`)
    
    // Try to fetch user profile
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('email, process_permissions, role')
      .eq('id', signInData.user.id)
      .single()
    
    if (profileError) {
      console.log('❌ Profile fetch error:', profileError)
    } else {
      console.log('✅ Profile found:', userProfile)
    }
  }
}

fixUserIds().catch(console.error)
