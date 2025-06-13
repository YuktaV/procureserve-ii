#!/usr/bin/env node

// Script to fix user linkage between auth and business users table
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'http://127.0.0.1:54321'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

const userMappings = [
  { 
    email: 'admin@acme-staffing.com', 
    role: 'admin',
    permissions: ['recruitment', 'bench_sales']
  },
  { 
    email: 'manager@acme-staffing.com', 
    role: 'manager',
    permissions: ['recruitment', 'bench_sales']
  },
  { 
    email: 'recruiter@acme-staffing.com', 
    role: 'recruiter',
    permissions: ['recruitment']
  },
  { 
    email: 'bench@acme-staffing.com', 
    role: 'viewer',
    permissions: ['bench_sales']
  },
  { 
    email: 'noprocess@acme-staffing.com', 
    role: 'viewer',
    permissions: []
  }
]

async function fixUserLinkage() {
  console.log('🔧 Fixing user linkage between auth and business users...')
  
  // Get the company ID
  const { data: company } = await supabase
    .from('companies')
    .select('id')
    .eq('name', 'Acme Staffing')
    .single()
  
  if (!company) {
    console.error('❌ Acme Staffing company not found')
    return
  }
  
  console.log(`🏢 Found company: ${company.id}`)
  
  for (const mapping of userMappings) {
    try {
      // Get the auth user ID
      const { data: authUsers } = await supabase.auth.admin.listUsers()
      const authUser = authUsers.users.find(u => u.email === mapping.email)
      
      if (!authUser) {
        console.log(`⚠️  Auth user not found for ${mapping.email}`)
        continue
      }
      
      console.log(`🔍 Found auth user: ${mapping.email} (${authUser.id})`)
      
      // Check if business user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('id', authUser.id)
        .single()
      
      if (existingUser) {
        console.log(`✅ Business user already exists for ${mapping.email}`)
        continue
      }
      
      // Insert business user record
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: authUser.id,
          email: mapping.email,
          role: mapping.role,
          process_permissions: mapping.permissions,
          company_id: company.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      
      if (insertError) {
        console.error(`❌ Failed to insert business user for ${mapping.email}:`, insertError.message)
      } else {
        console.log(`✅ Created business user for: ${mapping.email}`)
      }
      
    } catch (err) {
      console.error(`❌ Error processing ${mapping.email}:`, err.message)
    }
  }
  
  console.log('🎉 User linkage fix complete!')
}

fixUserLinkage().catch(console.error)
