#!/usr/bin/env node

// Script to update all foreign key references and complete admin user fix
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'http://127.0.0.1:54321'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function updateAllReferences() {
  console.log('🔧 Updating all foreign key references...')
  
  const oldAdminId = 'a1e1f1a1-1111-1111-1111-111111111111'
  const newAdminId = 'c9e7701b-d5fe-46d6-acc0-fdd22403e326'
  
  // List of tables that might reference the user
  const tableUpdates = [
    { table: 'projects', column: 'created_by' },
    { table: 'candidates', column: 'created_by' },
    { table: 'consultants', column: 'created_by' },
    { table: 'clients', column: 'created_by' },
    { table: 'placements', column: 'created_by' },
    // Add other potential references
  ]
  
  for (const update of tableUpdates) {
    try {
      const { error } = await supabase
        .from(update.table)
        .update({ [update.column]: newAdminId })
        .eq(update.column, oldAdminId)
      
      if (error && !error.message.includes('does not exist')) {
        console.error(`❌ Failed to update ${update.table}.${update.column}:`, error.message)
      } else {
        console.log(`✅ Updated ${update.table}.${update.column} references`)
      }
    } catch (err) {
      console.log(`⚠️  Skipped ${update.table}.${update.column} (table/column might not exist)`)
    }
  }
  
  // Try to delete old admin user
  console.log('🗑️  Attempting to delete old admin user...')
  const { error: deleteError } = await supabase
    .from('users')
    .delete()
    .eq('id', oldAdminId)
  
  if (deleteError) {
    console.error('❌ Failed to delete old admin user:', deleteError.message)
    console.log('ℹ️  You may need to manually check for remaining foreign key references')
  } else {
    console.log('✅ Successfully deleted old admin user')
  }
  
  // Update the new user to have correct email
  const { error: updateError } = await supabase
    .from('users')
    .update({ email: 'admin@acme-staffing.com' })
    .eq('id', newAdminId)
  
  if (updateError) {
    console.error('❌ Failed to update email:', updateError.message)
  } else {
    console.log('✅ Updated admin user email to correct value')
  }
  
  console.log('🎉 Reference update complete!')
}

updateAllReferences().catch(console.error)
