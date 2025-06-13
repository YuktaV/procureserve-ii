#!/usr/bin/env node

/**
 * Setup Auth Users for Testing
 * Creates Supabase Auth users for the test accounts
 */

import { createClient } from '@supabase/supabase-js'

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
    id: 'a1e1f1a1-1111-1111-1111-111111111111',
    email: 'admin@acme-staffing.com',
    password: 'password123',
    role: 'Admin'
  },
  {
    id: 'a2e1f1a1-1111-1111-1111-111111111111',
    email: 'manager@acme-staffing.com',
    password: 'password123',
    role: 'Manager'
  },
  {
    id: 'a3e1f1a1-1111-1111-1111-111111111111',
    email: 'recruiter@acme-staffing.com',
    password: 'password123',
    role: 'Recruiter'
  },
  {
    id: 'a4e1f1a1-1111-1111-1111-111111111111',
    email: 'bench@acme-staffing.com',
    password: 'password123',
    role: 'Bench Sales'
  },
  {
    id: 'a5e1f1a1-1111-1111-1111-111111111111',
    email: 'noprocess@acme-staffing.com',
    password: 'password123',
    role: 'No Process'
  }
]

async function setupAuthUsers() {
  console.log('🔧 Setting up auth users for testing...\n')

  for (const user of testUsers) {
    try {
      // First, try to find and delete any existing user with this email
      try {
        const { data: existingUsers } = await supabase.auth.admin.listUsers()
        const existingUser = existingUsers.users.find(u => u.email === user.email)
        if (existingUser) {
          await supabase.auth.admin.deleteUser(existingUser.id)
          console.log(`   🗑️  Deleted existing user: ${user.email} (${existingUser.id})`)
        }
      } catch (deleteError) {
        // User doesn't exist, which is fine
      }

      // Create the user with the correct UUID
      const { data, error } = await supabase.auth.admin.createUser({
        user_id: user.id,
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          role: user.role
        }
      })

      if (error) {
        console.log(`   ❌ ${user.role} (${user.email}) - ${error.message}`)
      } else {
        console.log(`   ✅ ${user.role} (${user.email}) - created successfully`)
      }
    } catch (error) {
      console.log(`   ❌ ${user.role} (${user.email}) - ${error.message}`)
    }
  }
  
  console.log('\n🎯 Auth users setup complete!')
  console.log('\n📋 Test Credentials:')
  console.log('   Email: [user]@acme-staffing.com')
  console.log('   Password: password123')
  console.log('\n🚀 Ready to run tests!')
}

setupAuthUsers().catch(console.error)
