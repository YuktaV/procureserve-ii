#!/usr/bin/env node

// Script to create bench sales test data
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'http://127.0.0.1:54321'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createBenchSalesTestData() {
  console.log('🔧 Creating bench sales test data...')
  
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
    
  // Create test consultants (people on bench)
  const consultants = [
    {
      company_id: companyId,
      email: 'sarah.developer@consultant.com',
      first_name: 'Sarah',
      last_name: 'Developer',
      phone: '+1-555-2001',
      skills: '["React", "Node.js", "TypeScript", "AWS", "PostgreSQL"]',
      experience_level: 'senior',
      work_authorization: 'us_citizen',
      hourly_rate: 85.00,
      preferred_rate: 95.00,
      availability_status: 'available',
      bench_start_date: '2024-12-01'
    },
    {
      company_id: companyId,
      email: 'david.architect@consultant.com',
      first_name: 'David',
      last_name: 'Architect',
      phone: '+1-555-2002',
      skills: '["Java", "Spring", "Microservices", "Kubernetes", "Azure"]',
      experience_level: 'lead',
      work_authorization: 'green_card',
      hourly_rate: 110.00,
      preferred_rate: 125.00,
      availability_status: 'available',
      bench_start_date: '2024-11-15'
    },
    {
      company_id: companyId,
      email: 'maria.analyst@consultant.com',
      first_name: 'Maria',
      last_name: 'Analyst',
      phone: '+1-555-2003',
      skills: '["Python", "Data Analysis", "Machine Learning", "SQL", "Tableau"]',
      experience_level: 'mid',
      work_authorization: 'h1b',
      hourly_rate: 75.00,
      preferred_rate: 85.00,
      availability_status: 'placed',
      bench_start_date: '2024-10-01'
    },
    {
      company_id: companyId,
      email: 'alex.devops@consultant.com',
      first_name: 'Alex',
      last_name: 'DevOps',
      phone: '+1-555-2004',
      skills: '["DevOps", "Terraform", "Jenkins", "Docker", "GCP"]',
      experience_level: 'senior',
      work_authorization: 'us_citizen',
      hourly_rate: 90.00,
      preferred_rate: 100.00,
      availability_status: 'available',
      bench_start_date: '2024-12-10'
    }
  ]
  
  console.log('👨‍💻 Creating consultants...')
  const { data: createdConsultants, error: consultantsError } = await supabase
    .from('consultants')
    .insert(consultants)
    .select('id, first_name, last_name')
    
  if (consultantsError) {
    console.error('❌ Error creating consultants:', consultantsError.message)
    return
  } else {
    console.log('✅ Created consultants:', createdConsultants.map(c => `${c.first_name} ${c.last_name}`))
  }
  
  // Create test clients
  const clients = [
    {
      company_id: companyId,
      name: 'TechCorp Inc',
      industry: 'Software',
      contact_person: 'Jennifer Smith',
      contact_email: 'jennifer@techcorp.com',
      contact_phone: '+1-555-3001',
      preferred_rates: '{"senior": 90, "mid": 70, "junior": 50}',
      payment_terms: 'Net 30',
      relationship_status: 'active'
    },
    {
      company_id: companyId,
      name: 'FinanceStream LLC',
      industry: 'Financial Services',
      contact_person: 'Robert Chen',
      contact_email: 'rchen@financestream.com',
      contact_phone: '+1-555-3002',
      preferred_rates: '{"senior": 95, "mid": 75, "junior": 55}',
      payment_terms: 'Net 15',
      relationship_status: 'active'
    },
    {
      company_id: companyId,
      name: 'Healthcare Analytics',
      industry: 'Healthcare',
      contact_person: 'Dr. Emily Johnson',
      contact_email: 'ejohnson@healthanalytics.com',
      contact_phone: '+1-555-3003',
      preferred_rates: '{"senior": 85, "mid": 65, "junior": 45}',
      payment_terms: 'Net 30',
      relationship_status: 'prospect'
    }
  ]
  
  console.log('🏢 Creating clients...')
  const { data: createdClients, error: clientsError } = await supabase
    .from('clients')
    .insert(clients)
    .select('id, name')
    
  if (clientsError) {
    console.error('❌ Error creating clients:', clientsError.message)
    return
  } else {
    console.log('✅ Created clients:', createdClients.map(c => c.name))
  }
  
  // Create test projects
  const projects = [
    {
      company_id: companyId,
      client_id: createdClients[0].id,
      title: 'E-commerce Platform Development',
      description: 'Build a modern e-commerce platform using React and Node.js',
      required_skills: '["React", "Node.js", "PostgreSQL", "AWS"]',
      start_date: '2025-01-15',
      end_date: '2025-07-15',
      estimated_duration: '6 months',
      hourly_rate: 90.00,
      project_value: 72000.00,
      status: 'active',
      location_type: 'remote',
      created_by: adminUser?.id
    },
    {
      company_id: companyId,
      client_id: createdClients[1].id,
      title: 'Data Analytics Platform',
      description: 'Develop analytics dashboard for financial data processing',
      required_skills: '["Python", "Data Analysis", "SQL", "Machine Learning"]',
      start_date: '2025-02-01',
      end_date: '2025-08-01',
      estimated_duration: '6 months',
      hourly_rate: 85.00,
      project_value: 68000.00,
      status: 'active',
      location_type: 'hybrid',
      location_details: 'New York, NY',
      created_by: adminUser?.id
    },
    {
      company_id: companyId,
      client_id: createdClients[0].id,
      title: 'Cloud Migration Project',
      description: 'Migrate legacy systems to AWS cloud infrastructure',
      required_skills: '["AWS", "DevOps", "Terraform", "Docker"]',
      start_date: '2025-03-01',
      end_date: '2025-09-01',
      estimated_duration: '6 months',
      hourly_rate: 95.00,
      project_value: 76000.00,
      status: 'draft',
      location_type: 'remote',
      created_by: adminUser?.id
    }
  ]
  
  console.log('📊 Creating projects...')
  const { data: createdProjects, error: projectsError } = await supabase
    .from('projects')
    .insert(projects)
    .select('id, title')
    
  if (projectsError) {
    console.error('❌ Error creating projects:', projectsError.message)
    return
  } else {
    console.log('✅ Created projects:', createdProjects.map(p => p.title))
  }
  
  // Create test placements (consultant assignments)
  const placements = [
    {
      company_id: companyId,
      consultant_id: createdConsultants[0].id, // Sarah Developer
      project_id: createdProjects[0].id, // E-commerce Platform
      start_date: '2025-01-15',
      hourly_rate: 90.00,
      weekly_hours: 40,
      status: 'active',
      created_by: adminUser?.id
    },
    {
      company_id: companyId,
      consultant_id: createdConsultants[2].id, // Maria Analyst (already placed)
      project_id: createdProjects[1].id, // Data Analytics Platform
      start_date: '2025-02-01',
      hourly_rate: 85.00,
      weekly_hours: 40,
      status: 'active',
      created_by: adminUser?.id
    }
  ]
  
  console.log('📋 Creating placements...')
  const { error: placementsError } = await supabase
    .from('placements')
    .insert(placements)
    
  if (placementsError) {
    console.error('❌ Error creating placements:', placementsError.message)
  } else {
    console.log('✅ Created placements')
  }
  
  console.log('🎉 Bench sales test data creation complete!')
}

createBenchSalesTestData().catch(console.error)
