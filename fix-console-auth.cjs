#!/usr/bin/env node

/**
 * Fix Console Authentication Issues
 * - Verifies Supabase connection with correct URL
 * - Creates/updates console users with proper passwords
 * - Tests authentication flow
 */

const { createClient } = require('@supabase/supabase-js')

// CORRECTED: Use actual running Supabase URL
const supabaseUrl = 'http://127.0.0.1:54321'  // API port from running instance
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

const consoleUsers = [
  {
    email: 'admin@procureserve.com',
    password: 'admin123',
    role: 'super_admin',
    company_ids: null
  },
  {
    email: 'support@procureserve.com', 
    password: 'admin123',
    role: 'company_admin',
    company_ids: ['550e8400-e29b-41d4-a716-446655440000']
  },
  {
    email: 'sales@procureserve.com',
    password: 'admin123', 
    role: 'company_manager',
    company_ids: ['550e8400-e29b-41d4-a716-446655440000']
  }
]

async function fixConsoleAuthentication() {
  console.log('🔧 Fixing Console Authentication Issues...')
  console.log('📡 Using Supabase URL:', supabaseUrl)
  
  try {
    // 1. Test Supabase connection
    console.log('\n1️⃣ Testing Supabase connection...')
    const { data: healthCheck, error: healthError } = await supabase
      .from('console_users')
      .select('id')
      .limit(1)
    
    if (healthError) {
      console.error('❌ Supabase connection failed:', healthError.message)
      console.log('🔍 Make sure Supabase is running on port 54331')
      console.log('💡 Run: cd /Users/vasanthan/Desktop/PSII && npx supabase start')
      return
    }
    
    console.log('✅ Supabase connection successful')
    
    // 2. Create/update console users
    console.log('\n2️⃣ Creating/updating console users...')
    
    for (const user of consoleUsers) {
      console.log(`\n👤 Processing ${user.email}...`)
      
      try {
        // First, try to create auth user
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: user.email,
          password: user.password,
          email_confirm: true
        })
        
        let userId
        if (authError && authError.message.includes('already registered')) {
          // User exists, get their ID
          const { data: existingUser } = await supabase.auth.admin.listUsers()
          const found = existingUser.users.find(u => u.email === user.email)
          if (found) {
            userId = found.id
            console.log(`📧 Auth user exists: ${user.email}`)
            
            // Update password
            await supabase.auth.admin.updateUserById(userId, {
              password: user.password
            })
            console.log(`🔑 Password updated for: ${user.email}`)
          }
        } else if (authData?.user) {
          userId = authData.user.id
          console.log(`✅ Auth user created: ${user.email}`)
        }
        
        if (!userId) {
          console.error(`❌ Could not get/create auth user for ${user.email}`)
          continue
        }
        
        // Create/update console user record
        const { error: consoleError } = await supabase
          .from('console_users')
          .upsert({
            id: userId,
            email: user.email,
            role: user.role,
            company_ids: user.company_ids,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
        
        if (consoleError) {
          console.error(`❌ Console user error for ${user.email}:`, consoleError.message)
        } else {
          console.log(`✅ Console user ready: ${user.email}`)
        }
        
      } catch (error) {
        console.error(`❌ Error processing ${user.email}:`, error.message)
      }
    }
    
    // 3. Test authentication
    console.log('\n3️⃣ Testing authentication...')
    
    for (const user of consoleUsers) {
      try {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: user.email,
          password: user.password
        })
        
        if (authError) {
          console.log(`❌ Auth test failed for ${user.email}: ${authError.message}`)
        } else {
          console.log(`✅ Auth test passed for ${user.email}`)
          
          // Check console user data
          const { data: consoleData, error: consoleError } = await supabase
            .from('console_users')
            .select('*')
            .eq('id', authData.user.id)
            .single()
          
          if (consoleError) {
            console.log(`❌ Console data missing for ${user.email}`)
          } else {
            console.log(`✅ Console data ready for ${user.email} (${consoleData.role})`)
          }
          
          // Sign out after test
          await supabase.auth.signOut()
        }
      } catch (error) {
        console.log(`❌ Auth test error for ${user.email}:`, error.message)
      }
    }
    
    console.log('\n🎉 Console authentication fix complete!')
    console.log('\n📋 Ready to test accounts:')
    consoleUsers.forEach(user => {
      console.log(`📧 ${user.email} | 🔑 ${user.password} | 👤 ${user.role}`)
    })
    console.log('\n🌐 Console URL: http://localhost:3008/login')
    console.log('🌐 Supabase Studio: http://127.0.0.1:54333')
    
  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

fixConsoleAuthentication().catch(console.error)
