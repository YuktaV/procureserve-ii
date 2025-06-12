#!/usr/bin/env node

/**
 * Check database users and auth users to debug mismatch
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'http://127.0.0.1:54321'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'

async function checkDatabase() {
  console.log('🔍 Checking database users and auth users...\n')
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  // Check users in the database
  console.log('📊 Users in database table:')
  const { data: dbUsers, error: dbError } = await supabase
    .from('users')
    .select('id, email, process_permissions, role')
    .ilike('email', '%acme-staffing.com%')
  
  if (dbError) {
    console.log('❌ Database error:', dbError)
  } else {
    dbUsers.forEach(user => {
      console.log(`  ${user.email}: ${user.id} (${user.role}) [${user.process_permissions?.join(', ') || 'no permissions'}]`)
    })
  }
  
  console.log('\n🔐 Users in Supabase Auth:')
  const { data: authData, error: authError } = await supabase.auth.admin.listUsers()
  
  if (authError) {
    console.log('❌ Auth error:', authError)
  } else {
    const acmeUsers = authData.users.filter(user => user.email?.includes('acme-staffing.com'))
    acmeUsers.forEach(user => {
      console.log(`  ${user.email}: ${user.id} (created: ${user.created_at})`)
    })
  }

  // Test authentication for one user
  console.log('\n🧪 Testing authentication for admin user:')
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: 'admin@acme-staffing.com',
    password: 'password123'
  })

  if (signInError) {
    console.log('❌ Sign in error:', signInError)
  } else {
    console.log(`✅ Sign in successful: ${signInData.user.email} (${signInData.user.id})`)
    
    // Try to fetch user profile
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', signInData.user.id)
      .single()
    
    if (profileError) {
      console.log('❌ Profile fetch error:', profileError)
    } else {
      console.log('✅ Profile found:', userProfile)
    }
  }
}

checkDatabase().catch(console.error)
