import type { PageLoad } from './$types'
import { redirect } from '@sveltejs/kit'

export const load: PageLoad = async ({ parent }) => {
  const { supabase, session } = await parent()
  
  if (!session) {
    throw redirect(303, '/auth/login')
  }

  try {
    // Verify user has recruitment process permission
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('process_permissions, current_process, role, profile, company_id')
      .eq('id', session.user.id)
      .single()

    if (userError || !user) {
      throw redirect(303, '/auth/login')
    }

    // Check if user has recruitment access
    if (!user.process_permissions.includes('recruitment')) {
      throw redirect(303, '/access-denied')
    }

    // Update current process if user has access
    if (user.current_process !== 'recruitment') {
      await supabase
        .from('users')
        .update({ current_process: 'recruitment' })
        .eq('id', session.user.id)
    }

    // Get recruitment dashboard data
    const [jobsResult, candidatesResult, applicationsResult] = await Promise.all([
      // Recent jobs
      supabase
        .from('jobs')
        .select('id, title, status, created_at')
        .eq('company_id', user.company_id)
        .order('created_at', { ascending: false })
        .limit(5),
      
      // Recent candidates  
      supabase
        .from('candidates')
        .select('id, name, email, status, created_at')
        .eq('company_id', user.company_id)
        .order('created_at', { ascending: false })
        .limit(5),
      
      // Recent applications
      supabase
        .from('applications')
        .select(`
          id, 
          status, 
          created_at,
          jobs(title),
          candidates(name)
        `)
        .eq('company_id', user.company_id)
        .order('created_at', { ascending: false })
        .limit(5)
    ])

    return {
      user,
      process: 'recruitment' as const,
      dashboard_data: {
        recent_jobs: jobsResult.data || [],
        recent_candidates: candidatesResult.data || [],
        recent_applications: applicationsResult.data || []
      }
    }

  } catch (error) {
    console.error('Error loading recruitment dashboard:', error)
    throw redirect(303, '/auth/login')
  }
}
