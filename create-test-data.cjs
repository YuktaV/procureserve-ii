#!/usr/bin/env node

// Script to create test data for dashboard
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'http://127.0.0.1:54321'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createTestData() {
  console.log('🔧 Creating test data...')
  
  // Get the company ID for Acme Staffing
  const { data: company } = await supabase
    .from('companies')
    .select('id')
    .eq('name', 'Acme Staffing')
    .single()
    
  if (!company) {
    console.error('❌ Acme Staffing company not found')
    return
  }
  
  const companyId = company.id
  console.log(`✅ Found company: ${companyId}`)
  
  // Get admin user ID
  const { data: adminUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', 'admin@acme-staffing.com')
    .single()
    
  if (!adminUser) {
    console.error('❌ Admin user not found')
    return
  }
  
  // Create test jobs
  const jobs = [
    {
      company_id: companyId,
      title: 'Senior Full Stack Developer',
      description: 'Looking for an experienced full stack developer to join our team. Must have React, Node.js, and PostgreSQL experience.',
      status: 'active',
      created_by: adminUser.id
    },
    {
      company_id: companyId,
      title: 'DevOps Engineer',
      description: 'Seeking a DevOps engineer with AWS, Docker, and Kubernetes experience. Remote work available.',
      status: 'active',
      created_by: adminUser.id
    },
    {
      company_id: companyId,
      title: 'Product Manager',
      description: 'Product Manager needed for B2B SaaS platform. Experience with analytics and user research required.',
      status: 'draft',
      created_by: adminUser.id
    }
  ]
  
  console.log('📋 Creating jobs...')
  const { data: createdJobs, error: jobsError } = await supabase
    .from('jobs')
    .insert(jobs)
    .select('id, title')
    
  if (jobsError) {
    console.error('❌ Error creating jobs:', jobsError.message)
    return
  } else {
    console.log('✅ Created test jobs:', createdJobs.map(j => j.title))
  }
  
  // Create test candidates
  const candidates = [
    {
      email: 'john.doe@email.com',
      name: 'John Doe',
      phone: '+1-555-1001',
      skills: '["JavaScript", "React", "Node.js", "PostgreSQL", "AWS"]',
      experience_level: 'senior',
      work_authorization: 'us_citizen',
      status: 'active'
    },
    {
      email: 'jane.smith@email.com', 
      name: 'Jane Smith',
      phone: '+1-555-1002',
      skills: '["DevOps", "AWS", "Docker", "Kubernetes", "Python"]',
      experience_level: 'mid',
      work_authorization: 'green_card',
      status: 'active'
    },
    {
      email: 'mike.wilson@email.com',
      name: 'Mike Wilson', 
      phone: '+1-555-1003',
      skills: '["Product Management", "Analytics", "Leadership", "B2B"]',
      experience_level: 'senior',
      work_authorization: 'us_citizen',
      status: 'active'
    }
  ]
  
  console.log('👥 Creating candidates...')
  const { data: createdCandidates, error: candidatesError } = await supabase
    .from('candidates')
    .insert(candidates)
    .select('id, name')
    
  if (candidatesError) {
    console.error('❌ Error creating candidates:', candidatesError.message)
    return
  } else {
    console.log('✅ Created test candidates:', createdCandidates.map(c => c.name))
  }
  
  // Create test applications using the created IDs
  const applications = [
    {
      job_id: createdJobs[0].id,
      candidate_id: createdCandidates[0].id, 
      company_id: companyId,
      status: 'applied'
    },
    {
      job_id: createdJobs[1].id,
      candidate_id: createdCandidates[1].id,
      company_id: companyId, 
      status: 'screening'
    },
    {
      job_id: createdJobs[0].id,
      candidate_id: createdCandidates[2].id,
      company_id: companyId,
      status: 'interview'
    },
    {
      job_id: createdJobs[2].id,
      candidate_id: createdCandidates[0].id,
      company_id: companyId,
      status: 'hired'
    }
  ]
  
  console.log('📄 Creating applications...')
  const { error: applicationsError } = await supabase
    .from('applications')
    .insert(applications)
    
  if (applicationsError) {
    console.error('❌ Error creating applications:', applicationsError.message)
  } else {
    console.log('✅ Created test applications')
  }
  
  console.log('🎉 Test data creation complete!')
}

createTestData().catch(console.error)
