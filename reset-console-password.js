#!/usr/bin/env node
// Script to reset password for console users
import { createClient } from '@supabase/supabase-js'
import { createInterface } from 'readline'

const supabaseUrl = 'http://127.0.0.1:54321'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
})

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
}

function questionHidden(prompt) {
  return new Promise((resolve) => {
    process.stdout.write(prompt)
    process.stdin.setRawMode(true)
    process.stdin.resume()
    process.stdin.setEncoding('utf8')
    
    let password = ''
    
    process.stdin.on('data', function(char) {
      char = char + ''
      
      switch (char) {
        case '\n':
        case '\r':
        case '\u0004':
          process.stdin.setRawMode(false)
          process.stdin.pause()
          process.stdout.write('\n')
          resolve(password)
          break
        case '\u0003':
          process.exit()
          break
        case '\u007f': // backspace
          if (password.length > 0) {
            password = password.slice(0, -1)
            process.stdout.write('\b \b')
          }
          break
        default:
          password += char
          process.stdout.write('*')
          break
      }
    })
  })
}

async function resetPassword() {
  console.log('🔐 Console User Password Reset Tool\n')
  
  try {
    // Get all console users
    const { data: consoleUsers, error: consoleError } = await supabase
      .from('console_users')
      .select('id, email, role')
      .eq('is_active', true)
    
    if (consoleError) {
      console.error('❌ Error getting console users:', consoleError)
      return
    }
    
    if (consoleUsers.length === 0) {
      console.log('❌ No active console users found')
      return
    }
    
    console.log('Available console users:')
    consoleUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} (${user.role})`)
    })
    
    const userChoice = await question('\nSelect user number (or enter email): ')
    
    let selectedUser
    if (/^\d+$/.test(userChoice)) {
      const index = parseInt(userChoice) - 1
      if (index >= 0 && index < consoleUsers.length) {
        selectedUser = consoleUsers[index]
      }
    } else {
      selectedUser = consoleUsers.find(u => u.email.toLowerCase() === userChoice.toLowerCase())
    }
    
    if (!selectedUser) {
      console.log('❌ Invalid selection')
      return
    }
    
    console.log(`\nSelected user: ${selectedUser.email}`)
    
    const newPassword = await questionHidden('Enter new password: ')
    
    if (newPassword.length < 6) {
      console.log('❌ Password must be at least 6 characters long')
      return
    }
    
    const confirmPassword = await questionHidden('Confirm new password: ')
    
    if (newPassword !== confirmPassword) {
      console.log('❌ Passwords do not match')
      return
    }
    
    // Update password in Supabase Auth
    const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
      selectedUser.id,
      { password: newPassword }
    )
    
    if (updateError) {
      console.error('❌ Failed to update password:', updateError)
      return
    }
    
    console.log(`\n✅ Password updated successfully for ${selectedUser.email}`)
    console.log('You can now log in to the console with the new password.')
    
    // Test the new password
    const testLogin = await question('\nTest login with new password? (y/n): ')
    if (testLogin.toLowerCase() === 'y') {
      console.log('\n🧪 Testing login...')
      
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: selectedUser.email,
        password: newPassword
      })
      
      if (authError) {
        console.error('❌ Login test failed:', authError.message)
      } else {
        console.log('✅ Login test successful!')
        
        // Sign out after test
        await supabase.auth.signOut()
      }
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error)
  } finally {
    rl.close()
  }
}

resetPassword().catch(console.error)
