#!/usr/bin/env node

// Script to verify bench sales dashboard data
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'http://127.0.0.1:54321'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function verifyBenchSalesDashboard() {
  console.log('🔍 Verifying bench sales dashboard data...')
  
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
  
  // Test consultants query
  const { data: consultants } = await supabase
    .from('consultants')
    .select('availability_status, first_name, last_name')
    .eq('company_id', company.id)
    
  console.log(`👨‍💻 Consultants found: ${consultants?.length || 0}`)
  if (consultants) {
    const consultantsStats = {}
    consultants.forEach(consultant => {
      consultantsStats[consultant.availability_status] = (consultantsStats[consultant.availability_status] || 0) + 1
    })
    console.log('   Consultant stats:', consultantsStats)
    consultants.forEach(c => {
      console.log(`   - ${c.first_name} ${c.last_name} (${c.availability_status})`)
    })
  }
  
  // Test clients query
  const { data: clients } = await supabase
    .from('clients')
    .select('relationship_status, name')
    .eq('company_id', company.id)
    
  console.log(`🏢 Clients found: ${clients?.length || 0}`)
  if (clients) {
    const clientsStats = {}
    clients.forEach(client => {
      clientsStats[client.relationship_status] = (clientsStats[client.relationship_status] || 0) + 1
    })
    console.log('   Client stats:', clientsStats)
    clients.forEach(c => {
      console.log(`   - ${c.name} (${c.relationship_status})`)
    })
  }
  
  // Test projects query
  const { data: projects } = await supabase
    .from('projects')
    .select('status, title')
    .eq('company_id', company.id)
    
  console.log(`📊 Projects found: ${projects?.length || 0}`)
  if (projects) {
    const projectsStats = {}
    projects.forEach(project => {
      projectsStats[project.status] = (projectsStats[project.status] || 0) + 1
    })
    console.log('   Project stats:', projectsStats)
    projects.forEach(p => {
      console.log(`   - ${p.title} (${p.status})`)
    })
  }
  
  // Test placements query
  const { data: placements } = await supabase
    .from('placements')
    .select('status')
    .eq('company_id', company.id)
    
  console.log(`📋 Placements found: ${placements?.length || 0}`)
  if (placements) {
    const placementsStats = {}
    placements.forEach(placement => {
      placementsStats[placement.status] = (placementsStats[placement.status] || 0) + 1
    })
    console.log('   Placement stats:', placementsStats)
  }
  
  // Test recent projects query (like dashboard does)
  const { data: recentProjects } = await supabase
    .from('projects')
    .select('id, title, status, created_at, clients(name)')
    .eq('company_id', company.id)
    .order('created_at', { ascending: false })
    .limit(5)
    
  console.log(`📅 Recent projects found: ${recentProjects?.length || 0}`)
  recentProjects?.forEach(project => {
    console.log(`   - ${project.title} (${project.clients?.name}) - ${project.status}`)
  })
  
  // Test recent placements query
  const { data: recentPlacements } = await supabase
    .from('placements')
    .select(`
      id, status, start_date, created_at,
      consultants(first_name, last_name),
      projects(title)
    `)
    .eq('company_id', company.id)
    .order('created_at', { ascending: false })
    .limit(5)
    
  console.log(`💼 Recent placements found: ${recentPlacements?.length || 0}`)
  recentPlacements?.forEach(placement => {
    console.log(`   - ${placement.consultants?.first_name} ${placement.consultants?.last_name} → ${placement.projects?.title} (${placement.status})`)
  })
  
  console.log('🎉 Bench sales data verification complete!')
}

verifyBenchSalesDashboard().catch(console.error)
