// Script to check existing auth users and their relationship to console users
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'http://127.0.0.1:54321'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
})

async function checkAuthUsers() {
  console.log('🔍 Checking Auth Users and Console Users...\n')

  // 1. Get all auth users
  console.log('1. Auth Users:')
  try {
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers()
    
    if (authError) {
      console.error('❌ Error getting auth users:', authError)
    } else {
      console.log(`✅ Found ${authData.users.length} auth users:`)
      authData.users.forEach(user => {
        console.log(`   - ${user.email} (ID: ${user.id})`)
        console.log(`     Created: ${user.created_at}`)
        console.log(`     Confirmed: ${user.email_confirmed_at ? 'Yes' : 'No'}`)
        console.log(`     Metadata: ${JSON.stringify(user.user_metadata)}`)
        console.log('')
      })
    }
  } catch (error) {
    console.error('❌ Exception getting auth users:', error)
  }

  // 2. Get all console users
  console.log('\n2. Console Users:')
  try {
    const { data: consoleUsers, error: consoleError } = await supabase
      .from('console_users')
      .select('*')
    
    if (consoleError) {
      console.error('❌ Error getting console users:', consoleError)
    } else {
      console.log(`✅ Found ${consoleUsers.length} console users:`)
      consoleUsers.forEach(user => {
        console.log(`   - ${user.email} (ID: ${user.id}) - Role: ${user.role}`)
      })
    }
  } catch (error) {
    console.error('❌ Exception getting console users:', error)
  }

  // 3. Try to match them up
  console.log('\n3. Matching Auth Users to Console Users:')
  try {
    const { data: authData } = await supabase.auth.admin.listUsers()
    const { data: consoleUsers } = await supabase.from('console_users').select('*')
    
    if (authData && consoleUsers) {
      authData.users.forEach(authUser => {
        const matchingConsoleUser = consoleUsers.find(cu => cu.email === authUser.email)
        if (matchingConsoleUser) {
          console.log(`✅ MATCH: ${authUser.email}`)
          console.log(`   Auth ID: ${authUser.id}`)
          console.log(`   Console ID: ${matchingConsoleUser.id}`)
          console.log(`   IDs Match: ${authUser.id === matchingConsoleUser.id ? 'YES' : 'NO'}`)
        } else {
          console.log(`❌ NO MATCH: ${authUser.email} (auth user has no console user)`)
        }
      })
      
      consoleUsers.forEach(consoleUser => {
        const matchingAuthUser = authData.users.find(au => au.email === consoleUser.email)
        if (!matchingAuthUser) {
          console.log(`❌ NO MATCH: ${consoleUser.email} (console user has no auth user)`)
        }
      })
    }
  } catch (error) {
    console.error('❌ Exception matching users:', error)
  }

  // 4. Test different passwords
  console.log('\n4. Testing different passwords for admin@procureserve.com:')
  const passwords = ['admin123', 'password123', 'password', 'admin', '123456']
  
  for (const password of passwords) {
    try {
      console.log(`   Testing password: ${password}`)
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'admin@procureserve.com',
        password: password
      })

      if (authError) {
        console.log(`   ❌ Failed: ${authError.message}`)
      } else {
        console.log(`   ✅ SUCCESS with password: ${password}`)
        console.log(`   User ID: ${authData.user.id}`)
        break
      }
    } catch (error) {
      console.log(`   ❌ Exception: ${error.message}`)
    }
  }
}

checkAuthUsers().catch(console.error)
