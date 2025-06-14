#!/usr/bin/env node

/**
 * Create Customer App Test Users
 * - Creates regular customer app users (separate from console users)
 * - Sets up proper permissions for testing
 */

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'http://127.0.0.1:54321'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

const customerUsers = [
  {
    email: 'john.recruiter@acme-staffing.com',
    password: 'customer123',
    role: 'recruiter',
    process_permissions: ['recruitment']
  },
  {
    email: 'sarah.manager@acme-staffing.com', 
    password: 'customer123',
    role: 'manager',
    process_permissions: ['recruitment', 'bench_sales']
  },
  {
    email: 'mike.sales@acme-staffing.com',
    password: 'customer123',
    role: 'viewer',
    process_permissions: ['bench_sales']
  }
]

async function createCustomerUsers() {
  console.log('🏢 Creating Customer App Test Users...')
  console.log('📡 Using Supabase URL:', supabaseUrl)
  
  try {
    // 1. Test Supabase connection
    console.log('\n1️⃣ Testing Supabase connection...')
    const { data: healthCheck, error: healthError } = await supabase
      .from('users')
      .select('id')
      .limit(1)
    
    if (healthError) {
      console.error('❌ Supabase connection failed:', healthError.message)
      return
    }
    
    console.log('✅ Supabase connection successful')
    
    // 2. Ensure we have a company to assign users to
    console.log('\n2️⃣ Setting up company...')
    
    const companyId = '99e1f1a1-1111-1111-1111-111111111111' // From existing data
    const { data: companyCheck, error: companyError } = await supabase
      .from('companies')
      .select('id, name')
      .eq('id', companyId)
      .single()
    
    if (companyError) {
      console.log('Company not found, creating default company...')
      const { error: createCompanyError } = await supabase
        .from('companies')
        .insert({
          id: companyId,
          name: 'ACME Staffing Solutions',
          domain: 'acme-staffing.com',
          settings: {}
        })
      
      if (createCompanyError && !createCompanyError.message.includes('duplicate key')) {
        console.error('❌ Failed to create company:', createCompanyError.message)
        return
      }
      console.log('✅ Company setup complete')
    } else {
      console.log(`✅ Using existing company: ${companyCheck.name}`)
    }
    
    // 3. Create customer users
    console.log('\n3️⃣ Creating customer users...')
    
    for (const user of customerUsers) {
      console.log(`\n👤 Processing ${user.email}...`)
      
      try {
        // Create auth user
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
        
        // Create customer user record
        const { error: customerError } = await supabase
          .from('users')
          .upsert({
            id: userId,
            email: user.email,
            company_id: companyId,
            role: user.role,
            profile: {
              process_permissions: user.process_permissions,
              name: user.email.split('@')[0].replace('.', ' '),
              created_via: 'test_setup'
            }
          })
        
        if (customerError) {
          console.error(`❌ Customer user error for ${user.email}:`, customerError.message)
        } else {
          console.log(`✅ Customer user ready: ${user.email} (${user.role})`)
        }
        
      } catch (error) {
        console.error(`❌ Error processing ${user.email}:`, error.message)
      }
    }
    
    // 4. Test authentication
    console.log('\n4️⃣ Testing customer authentication...')
    
    for (const user of customerUsers) {
      try {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: user.email,
          password: user.password
        })
        
        if (authError) {
          console.log(`❌ Auth test failed for ${user.email}: ${authError.message}`)
        } else {
          console.log(`✅ Auth test passed for ${user.email}`)
          
          // Check customer user data
          const { data: customerData, error: customerError } = await supabase
            .from('users')
            .select('*')
            .eq('id', authData.user.id)
            .single()
          
          if (customerError) {
            console.log(`❌ Customer data missing for ${user.email}`)
          } else {
            console.log(`✅ Customer data ready for ${user.email} (${customerData.role})`)
          }
          
          // Sign out after test
          await supabase.auth.signOut()
        }
      } catch (error) {
        console.log(`❌ Auth test error for ${user.email}:`, error.message)
      }
    }
    
    console.log('\n🎉 Customer users setup complete!')
    console.log('\n📋 Customer App Test Accounts:')
    customerUsers.forEach(user => {
      console.log(`📧 ${user.email} | 🔑 ${user.password} | 👤 ${user.role} | 🔒 ${user.process_permissions.join(', ')}`)
    })
    console.log('\n🌐 Customer App URL: http://localhost:3006/login')
    console.log('🌐 Console App URL: http://localhost:3008/login')
    console.log('\n💡 These are separate user systems:')
    console.log('   • Console users: admin@procureserve.com, support@procureserve.com')
    console.log('   • Customer users: john.recruiter@acme-staffing.com, sarah.manager@acme-staffing.com')
    
  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

createCustomerUsers().catch(console.error)
