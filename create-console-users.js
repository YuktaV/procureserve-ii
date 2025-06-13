import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'http://127.0.0.1:54321'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createConsoleUsers() {
  console.log('🔧 Creating ProcureServe internal console users...')
  
  const users = [
    { 
      id: '550e8400-e29b-41d4-a716-446655440001', 
      email: 'admin@procureserve.com', 
      role: 'Super Admin' 
    },
    { 
      id: '550e8400-e29b-41d4-a716-446655440002', 
      email: 'support@procureserve.com', 
      role: 'Support Admin' 
    },
    { 
      id: '550e8400-e29b-41d4-a716-446655440003', 
      email: 'sales@procureserve.com', 
      role: 'Sales Manager' 
    }
  ]
  
  for (const user of users) {
    try {
      const { data, error } = await supabase.auth.admin.createUser({
        id: user.id,
        email: user.email,
        password: 'procureserve123',
        email_confirm: true
      })
      
      if (error) {
        console.log(`⚠️  ${user.email}: ${error.message}`)
      } else {
        console.log(`✅ Created ${user.email} (${user.role})`)
      }
    } catch (err) {
      console.log(`❌ Error creating ${user.email}: ${err.message}`)
    }
  }
  
  console.log('\n🎯 Console user creation complete!')
  console.log('Users can login with password: procureserve123')
}

createConsoleUsers().catch(console.error)
