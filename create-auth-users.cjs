#!/usr/bin/env node

// Script to create test users in Supabase Auth
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'http://127.0.0.1:54321'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

const testUsers = [
  { 
    id: '550e8400-e29b-41d4-a716-446655440001', 
    email: 'admin@acme-staffing.com', 
    password: 'password123',
    role: 'admin',
    permissions: ['recruitment', 'bench_sales']
  },
  { 
    id: '550e8400-e29b-41d4-a716-446655440002', 
    email: 'manager@acme-staffing.com', 
    password: 'password123',
    role: 'manager',
    permissions: ['recruitment', 'bench_sales']
  },
  { 
    id: '550e8400-e29b-41d4-a716-446655440003', 
    email: 'recruiter@acme-staffing.com', 
    password: 'password123',
    role: 'recruiter',
    permissions: ['recruitment']
  },
  { 
    id: '550e8400-e29b-41d4-a716-446655440004', 
    email: 'bench@acme-staffing.com', 
    password: 'password123',
    role: 'viewer',
    permissions: ['bench_sales']
  },
  { 
    id: '550e8400-e29b-41d4-a716-446655440005', 
    email: 'noprocess@acme-staffing.com', 
    password: 'password123',
    role: 'viewer',
    permissions: []
  }
]

async function createTestUsers() {
  console.log('🔧 Creating test users in Supabase Auth...')
  
  for (const user of testUsers) {
    try {
      // Create user in auth
      const { data, error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true // Skip email confirmation
      })
      
      if (error) {
        console.error(`❌ Failed to create ${user.email}:`, error.message)
        continue
      }
      
      console.log(`✅ Created auth user: ${user.email}`)
      
      // Update our users table with the auth user ID
      const { error: updateError } = await supabase
        .from('users')
        .update({ id: data.user.id })
        .eq('email', user.email)
      
      if (updateError) {
        console.error(`❌ Failed to update users table for ${user.email}:`, updateError.message)
      } else {
        console.log(`✅ Updated users table for: ${user.email}`)
      }
      
    } catch (err) {
      console.error(`❌ Error creating ${user.email}:`, err.message)
    }
  }
  
  console.log('🎉 Test user creation complete!')
  console.log('\n📋 Test Accounts:')
  testUsers.forEach(user => {
    console.log(`📧 ${user.email} | 🔑 ${user.password} | 👤 ${user.role}`)
  })
}

createTestUsers().catch(console.error)
