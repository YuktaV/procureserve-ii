#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'http://127.0.0.1:54321'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const companyId = '99e1f1a1-1111-1111-1111-111111111111'

const customerUsers = [
  {
    email: 'john.recruiter@acme-staffing.com',
    role: 'recruiter',
    process_permissions: ['recruitment']
  },
  {
    email: 'sarah.manager@acme-staffing.com', 
    role: 'manager',
    process_permissions: ['recruitment', 'bench_sales']
  },
  {
    email: 'mike.sales@acme-staffing.com',
    role: 'viewer',
    process_permissions: ['bench_sales']
  }
]

async function fixCustomerProfiles() {
  console.log('🔧 Fixing customer user profiles...')
  
  // Get all auth users
  const { data: allUsers } = await supabase.auth.admin.listUsers()
  
  for (const userData of customerUsers) {
    console.log(`\n👤 Processing ${userData.email}...`)
    
    // Find the auth user
    const authUser = allUsers.users.find(u => u.email === userData.email)
    if (!authUser) {
      console.log(`❌ Auth user not found for ${userData.email}`)
      continue
    }
    
    console.log(`✅ Found auth user: ${authUser.id}`)
    
    // Create customer profile
    const { error: customerError } = await supabase
      .from('users')
      .upsert({
        id: authUser.id,
        email: userData.email,
        company_id: companyId,
        role: userData.role,
        profile: {
          process_permissions: userData.process_permissions,
          name: userData.email.split('@')[0].replace('.', ' '),
          created_via: 'manual_fix'
        }
      })
    
    if (customerError) {
      console.error(`❌ Customer profile error for ${userData.email}:`, customerError.message)
    } else {
      console.log(`✅ Customer profile created: ${userData.email} (${userData.role})`)
    }
  }
  
  console.log('\n🎉 Customer profiles fixed!')
  console.log('\n📋 Ready to test Customer App:')
  customerUsers.forEach(user => {
    console.log(`📧 ${user.email} | 🔑 customer123 | 👤 ${user.role}`)
  })
  console.log('\n🌐 Customer App: http://localhost:3006/login')
}

fixCustomerProfiles().catch(console.error)
