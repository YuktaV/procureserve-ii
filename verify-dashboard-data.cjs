#!/usr/bin/env node

// Script to verify data integration
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'http://127.0.0.1:54321'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function verifyDashboardData() {
  console.log('🔍 Verifying dashboard data integration...')
  
  // Get company
  const { data: company } = await supabase
    .from('companies')
    .select('id, name')
    .eq('name', 'Acme Staffing')
    .single()
    
  if (!company) {
    console.error('❌ Company not found')
    return
  }
  
  console.log(`✅ Company: ${company.name} (${company.id})`)
  
  // Test jobs query (like dashboard does)
  const { data: jobs } = await supabase
    .from('jobs')
    .select('status')
    .eq('company_id', company.id)
    
  console.log(`📋 Jobs found: ${jobs?.length || 0}`)
  if (jobs) {
    const jobsStats = {}
    jobs.forEach(job => {
      jobsStats[job.status] = (jobsStats[job.status] || 0) + 1
    })
    console.log('   Job stats:', jobsStats)
  }
  
  // Test candidates through applications
  const { data: candidateApps } = await supabase
    .from('applications')
    .select(`
      candidates(id, status)
    `)
    .eq('company_id', company.id)
    
  console.log(`👥 Candidate applications found: ${candidateApps?.length || 0}`)
  if (candidateApps) {
    const uniqueCandidates = new Set()
    const candidatesStats = {}
    candidateApps.forEach(app => {
      if (app.candidates && !uniqueCandidates.has(app.candidates.id)) {
        uniqueCandidates.add(app.candidates.id)
        const status = app.candidates.status
        candidatesStats[status] = (candidatesStats[status] || 0) + 1
      }
    })
    console.log('   Unique candidates:', uniqueCandidates.size)
    console.log('   Candidate stats:', candidatesStats)
  }
  
  // Test applications
  const { data: applications } = await supabase
    .from('applications')
    .select('status')
    .eq('company_id', company.id)
    
  console.log(`📄 Applications found: ${applications?.length || 0}`)
  if (applications) {
    const applicationsStats = {}
    applications.forEach(app => {
      applicationsStats[app.status] = (applicationsStats[app.status] || 0) + 1
    })
    console.log('   Application stats:', applicationsStats)
  }
  
  // Test recent jobs query
  const { data: recentJobs } = await supabase
    .from('jobs')
    .select('id, title, status, created_at')
    .eq('company_id', company.id)
    .order('created_at', { ascending: false })
    .limit(5)
    
  console.log(`📅 Recent jobs found: ${recentJobs?.length || 0}`)
  recentJobs?.forEach(job => {
    console.log(`   - ${job.title} (${job.status})`)
  })
  
  // Test recent submissions query
  const { data: recentSubmissions } = await supabase
    .from('applications')
    .select(`
      id, status, created_at,
      jobs(title),
      candidates(name)
    `)
    .eq('company_id', company.id)
    .order('created_at', { ascending: false })
    .limit(5)
    
  console.log(`📋 Recent submissions found: ${recentSubmissions?.length || 0}`)
  recentSubmissions?.forEach(app => {
    console.log(`   - ${app.candidates?.name} → ${app.jobs?.title} (${app.status})`)
  })
  
  console.log('🎉 Data verification complete!')
}

verifyDashboardData().catch(console.error)
