// Script to create auth users for console users
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'http://127.0.0.1:54321'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
})

async function createConsoleAuthUsers() {
  console.log('🔧 Creating Auth Users for Console Users...\n')

  // Get all console users
  const { data: consoleUsers, error: consoleError } = await supabase
    .from('console_users')
    .select('*')

  if (consoleError) {
    console.error('❌ Error getting console users:', consoleError)
    return
  }

  console.log(`Found ${consoleUsers.length} console users to create auth for:`)
  consoleUsers.forEach(user => {
    console.log(`   - ${user.email} (${user.role})`)
  })

  console.log('\n🔧 Creating auth users...\n')

  for (const consoleUser of consoleUsers) {
    try {
      console.log(`Creating auth user for: ${consoleUser.email}`)
      
      // Create auth user with a default password
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: consoleUser.email,
        password: 'admin123', // Default password for all console users
        email_confirm: true, // Skip email confirmation
        user_metadata: {
          role: consoleUser.role,
          console_user: true
        }
      })

      if (authError) {
        console.error(`❌ Failed to create auth user for ${consoleUser.email}:`, authError)
        continue
      }

      console.log(`✅ Auth user created for ${consoleUser.email}`)
      console.log(`   Auth ID: ${authData.user.id}`)

      // Update console_users table with the correct auth ID
      const { error: updateError } = await supabase
        .from('console_users')
        .update({ id: authData.user.id })
        .eq('email', consoleUser.email)

      if (updateError) {
        console.error(`❌ Failed to update console user ID for ${consoleUser.email}:`, updateError)
      } else {
        console.log(`✅ Console user ID updated for ${consoleUser.email}`)
      }

    } catch (error) {
      console.error(`❌ Exception creating auth user for ${consoleUser.email}:`, error)
    }
  }

  console.log('\n🎯 Testing authentication...')
  
  // Test authentication with admin user
  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'admin@procureserve.com',
      password: 'admin123'
    })

    if (authError) {
      console.error('❌ Authentication test failed:', authError)
    } else {
      console.log('✅ Authentication test successful!')
      console.log(`   User ID: ${authData.user.id}`)
      console.log(`   Email: ${authData.user.email}`)

      // Test console user lookup
      const { data: consoleUser, error: consoleError } = await supabase
        .from('console_users')
        .select('*')
        .eq('id', authData.user.id)
        .single()

      if (consoleError) {
        console.error('❌ Console user lookup failed:', consoleError)
      } else {
        console.log('✅ Console user lookup successful!')
        console.log(`   Role: ${consoleUser.role}`)
        console.log(`   Active: ${consoleUser.is_active}`)
      }
    }
  } catch (error) {
    console.error('❌ Exception during authentication test:', error)
  }
}

createConsoleAuthUsers().catch(console.error)
