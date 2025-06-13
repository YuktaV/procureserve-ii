import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
  const { data: { session } } = await locals.supabase.auth.getSession()
  
  if (!session) {
    throw redirect(303, '/login')
  }
  
  // Get user and verify process access
  const { data: user, error: userError } = await locals.supabase
    .from('users')
    .select(`
      *,
      companies (
        id,
        name,
        recruitment_enabled,
        bench_sales_enabled,
        settings
      )
    `)
    .eq('id', session.user.id)
    .single()
  
  if (userError || !user) {
    throw redirect(303, '/access-denied')
  }
  
  // Check if user has bench sales access
  const hasBenchSalesAccess = user.process_permissions?.includes('bench_sales')
  if (!hasBenchSalesAccess) {
    throw redirect(303, '/access-denied')
  }
  
  // Set current process if needed
  if (user.current_process !== 'bench_sales') {
    await locals.supabase
      .from('users')
      .update({ current_process: 'bench_sales' })
      .eq('id', session.user.id)
  }
  
  // Fetch bench sales dashboard statistics
  const [consultantsResult, clientsResult, projectsResult, placementsResult, recentProjectsResult, recentPlacementsResult] = await Promise.all([
    // Consultants statistics
    locals.supabase
      .from('consultants')
      .select('availability_status')
      .eq('company_id', user.company_id),
    
    // Clients statistics  
    locals.supabase
      .from('clients')
      .select('relationship_status')
      .eq('company_id', user.company_id),
    
    // Projects statistics
    locals.supabase
      .from('projects')
      .select('status')
      .eq('company_id', user.company_id),
    
    // Placements statistics
    locals.supabase
      .from('placements')
      .select('status')
      .eq('company_id', user.company_id),
    
    // Recent projects (last 5)
    locals.supabase
      .from('projects')
      .select('id, title, status, created_at, clients(name)')
      .eq('company_id', user.company_id)
      .order('created_at', { ascending: false })
      .limit(5),
    
    // Recent placements (last 5)
    locals.supabase
      .from('placements')
      .select(`
        id, status, start_date, created_at,
        consultants(first_name, last_name),
        projects(title)
      `)
      .eq('company_id', user.company_id)
      .order('created_at', { ascending: false })
      .limit(5)
  ])
  
  // Process consultants stats
  const consultantsStats: Record<string, number> = {}
  consultantsResult.data?.forEach(consultant => {
    const status = consultant.availability_status
    consultantsStats[status] = (consultantsStats[status] || 0) + 1
  })
  
  // Process clients stats
  const clientsStats: Record<string, number> = {}
  clientsResult.data?.forEach(client => {
    clientsStats[client.relationship_status] = (clientsStats[client.relationship_status] || 0) + 1
  })
  
  // Process projects stats
  const projectsStats: Record<string, number> = {}
  projectsResult.data?.forEach(project => {
    projectsStats[project.status] = (projectsStats[project.status] || 0) + 1
  })
  
  // Process placements stats
  const placementsStats = {}
  placementsResult.data?.forEach(placement => {
    placementsStats[placement.status] = (placementsStats[placement.status] || 0) + 1
  })
  
  return {
    user: {
      ...user,
      current_process: 'bench_sales'
    },
    company: user.companies,
    stats: {
      consultants: Object.entries(consultantsStats).map(([status, count]) => ({ status, count })),
      clients: Object.entries(clientsStats).map(([status, count]) => ({ status, count })),
      projects: Object.entries(projectsStats).map(([status, count]) => ({ status, count })),
      placements: Object.entries(placementsStats).map(([status, count]) => ({ status, count }))
    },
    recentProjects: recentProjectsResult.data || [],
    recentPlacements: recentPlacementsResult.data || []
  }
}
