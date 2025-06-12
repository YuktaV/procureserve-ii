import type { PageLoad } from './$types'
import { redirect } from '@sveltejs/kit'

export const load: PageLoad = async ({ parent }) => {
  const { supabase, session } = await parent()
  
  if (!session) {
    throw redirect(303, '/auth/login')
  }

  try {
    // Verify user has bench sales process permission
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('process_permissions, current_process, role, profile, company_id')
      .eq('id', session.user.id)
      .single()

    if (userError || !user) {
      throw redirect(303, '/auth/login')
    }

    // Check if user has bench sales access
    if (!user.process_permissions.includes('bench_sales')) {
      throw redirect(303, '/access-denied')
    }

    // Update current process if user has access
    if (user.current_process !== 'bench_sales') {
      await supabase
        .from('users')
        .update({ current_process: 'bench_sales' })
        .eq('id', session.user.id)
    }

    // Get bench sales dashboard data
    const [benchCandidatesResult, projectsResult, placementsResult] = await Promise.all([
      // Available bench candidates
      supabase
        .from('candidates')
        .select('id, name, email, status, skills, created_at')
        .eq('company_id', user.company_id)
        .eq('status', 'bench') // Assuming 'bench' status for available candidates
        .order('created_at', { ascending: false })
        .limit(5),
      
      // Recent project opportunities (using jobs table for now)
      supabase
        .from('jobs')
        .select('id, title, status, employment_type, created_at')
        .eq('company_id', user.company_id)
        .order('created_at', { ascending: false })
        .limit(5),
      
      // Recent placements (successful applications)
      supabase
        .from('applications')
        .select(`
          id, 
          status, 
          created_at,
          jobs(title, employment_type),
          candidates(name)
        `)
        .eq('company_id', user.company_id)
        .eq('status', 'placed') // Assuming 'placed' status for successful placements
        .order('created_at', { ascending: false })
        .limit(5)
    ])

    return {
      user,
      process: 'bench_sales' as const,
      dashboard_data: {
        bench_candidates: benchCandidatesResult.data || [],
        project_opportunities: projectsResult.data || [],
        recent_placements: placementsResult.data || []
      }
    }

  } catch (error) {
    console.error('Error loading bench sales dashboard:', error)
    throw redirect(303, '/auth/login')
  }
}
