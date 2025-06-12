#!/usr/bin/env node

/**
 * Create test users in Supabase Auth
 * Must be run after database reset to create auth users
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'http://127.0.0.1:54321'
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'

const TEST_USERS = [
  {
    id: 'a1e1f1a1-1111-1111-1111-111111111111',
    email: 'admin@acme-staffing.com',
    password: 'password123'
  },
  {
    id: 'a2e1f1a1-1111-1111-1111-111111111111',
    email: 'manager@acme-staffing.com',
    password: 'password123'
  },
  {
    id: 'a3e1f1a1-1111-1111-1111-111111111111',
    email: 'recruiter@acme-staffing.com',
    password: 'password123'
  },
  {
    id: 'a4e1f1a1-1111-1111-1111-111111111111',
    email: 'bench@acme-staffing.com',
    password: 'password123'
  },
  {
    id: 'a5e1f1a1-1111-1111-1111-111111111111',
    email: 'noprocess@acme-staffing.com',
    password: 'password123'
  }
]

async function createTestUsers() {
  console.log('🔧 Creating test users in Supabase Auth...')
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  for (const user of TEST_USERS) {
    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        user_id: user.id,
        email_confirm: true
      })

      if (error) {
        console.log(`❌ Failed to create ${user.email}:`, error.message)
      } else {
        console.log(`✅ Created ${user.email} (${user.id})`)
      }
    } catch (err) {
      console.log(`❌ Error creating ${user.email}:`, err.message)
    }
  }

  console.log('\n🎯 Test user creation complete!')
  console.log('Users can now login with password: password123')
}

createTestUsers().catch(console.error)
