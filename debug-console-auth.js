// Debug script to test console authentication
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'http://127.0.0.1:54321'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
})

async function debugAuth() {
  console.log('🔍 Debugging Console Authentication...\n')

  // 1. Check if console_users table exists and has data
  console.log('1. Checking console_users table...')
  try {
    const { data: users, error: usersError } = await supabase
      .from('console_users')
      .select('*')
      .limit(5)
    
    if (usersError) {
      console.error('❌ Error querying console_users:', usersError)
    } else {
      console.log('✅ Console users found:', users.length)
      users.forEach(user => {
        console.log(`   - ${user.email} (${user.role}) - Active: ${user.is_active}`)
      })
    }
  } catch (error) {
    console.error('❌ Exception querying console_users:', error)
  }

  console.log('\n2. Checking auth.users table...')
  try {
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
    
    if (authError) {
      console.error('❌ Error querying auth.users:', authError)
    } else {
      console.log('✅ Auth users found:', authUsers.users.length)
      authUsers.users.forEach(user => {
        console.log(`   - ${user.email} (ID: ${user.id})`)
      })
    }
  } catch (error) {
    console.error('❌ Exception querying auth.users:', error)
  }

  // 3. Test authentication with admin@procureserve.com
  console.log('\n3. Testing authentication...')
  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'admin@procureserve.com',
      password: 'admin123'
    })

    if (authError) {
      console.error('❌ Authentication failed:', authError)
    } else {
      console.log('✅ Authentication successful!')
      console.log('   User ID:', authData.user?.id)
      console.log('   Email:', authData.user?.email)
      
      // Now try to get console user
      if (authData.user) {
        console.log('\n4. Looking up console user...')
        const { data: consoleUser, error: consoleError } = await supabase
          .from('console_users')
          .select('*')
          .eq('id', authData.user.id)
          .single()
        
        if (consoleError) {
          console.error('❌ Console user lookup failed:', consoleError)
        } else {
          console.log('✅ Console user found:', consoleUser)
        }
      }
    }
  } catch (error) {
    console.error('❌ Exception during authentication:', error)
  }

  // 4. Check RLS policies
  console.log('\n5. Checking RLS policies...')
  try {
    const { data: policies, error: policiesError } = await supabase
      .rpc('get_policies', { table_name: 'console_users' })
    
    if (policiesError) {
      console.error('❌ Error checking policies:', policiesError)
    } else {
      console.log('✅ RLS policies:', policies)
    }
  } catch (error) {
    console.error('❌ Exception checking policies:', error)
  }
}

debugAuth().catch(console.error)
