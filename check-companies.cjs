#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'http://127.0.0.1:54321'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkCompanies() {
  console.log('🔍 Checking existing companies...')
  
  const { data: companies, error } = await supabase
    .from('companies')
    .select('*')
  
  if (error) {
    console.error('❌ Error:', error)
    return
  }
  
  console.log('\n📋 Existing companies:')
  companies.forEach(company => {
    console.log(`ID: ${company.id}`)
    console.log(`Name: ${company.name}`)
    console.log(`Domain: ${company.domain}`)
    console.log('---')
  })
  
  if (companies.length === 0) {
    console.log('🏢 Creating a company...')
    const { data: newCompany, error: createError } = await supabase
      .from('companies')
      .insert({
        name: 'ACME Staffing Solutions',
        domain: 'acme-staffing.com',
        settings: {}
      })
      .select()
      .single()
    
    if (createError) {
      console.error('❌ Create error:', createError)
    } else {
      console.log('✅ Company created:', newCompany)
    }
  }
}

checkCompanies().catch(console.error)
