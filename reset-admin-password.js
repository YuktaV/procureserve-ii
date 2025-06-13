// Script to reset admin password
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'http://127.0.0.1:54321'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
})

async function resetAdminPassword() {
  console.log('🔧 Resetting Admin Password...\n')

  // Get the admin user
  const { data: authData, error: authError } = await supabase.auth.admin.listUsers()
  
  if (authError) {
    console.error('❌ Error getting auth users:', authError)
    return
  }

  const adminUser = authData.users.find(user => user.email === 'admin@procureserve.com')
  
  if (!adminUser) {
    console.error('❌ Admin user not found')
    return
  }

  console.log(`Found admin user: ${adminUser.email} (ID: ${adminUser.id})`)

  // Reset password
  try {
    const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
      adminUser.id,
      { 
        password: 'admin123',
        email_confirm: true
      }
    )

    if (updateError) {
      console.error('❌ Failed to reset password:', updateError)
      return
    }

    console.log('✅ Password reset successful!')

    // Test the new password
    console.log('\n🎯 Testing new password...')
    
    const { data: testAuthData, error: testAuthError } = await supabase.auth.signInWithPassword({
      email: 'admin@procureserve.com',
      password: 'admin123'
    })

    if (testAuthError) {
      console.error('❌ Authentication test failed:', testAuthError)
    } else {
      console.log('✅ Authentication test successful!')
      console.log(`   User ID: ${testAuthData.user.id}`)
      console.log(`   Email: ${testAuthData.user.email}`)

      // Test console user lookup
      const { data: consoleUser, error: consoleError } = await supabase
        .from('console_users')
        .select('*')
        .eq('id', testAuthData.user.id)
        .single()

      if (consoleError) {
        console.error('❌ Console user lookup failed:', consoleError)
      } else {
        console.log('✅ Console user lookup successful!')
        console.log(`   Role: ${consoleUser.role}`)
        console.log(`   Active: ${consoleUser.is_active}`)
        console.log(`   Company IDs: ${consoleUser.company_ids}`)
      }

      // Sign out
      await supabase.auth.signOut()
      console.log('✅ Signed out successfully')
    }

  } catch (error) {
    console.error('❌ Exception resetting password:', error)
  }

  console.log('\n🎉 Admin password reset complete!')
  console.log('📧 Email: admin@procureserve.com')
  console.log('🔑 Password: admin123')
}

resetAdminPassword().catch(console.error)
