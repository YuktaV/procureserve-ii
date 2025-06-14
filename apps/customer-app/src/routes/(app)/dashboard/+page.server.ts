import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

const DEBUG_AUTH = true

function log(message: string, data?: any) {
  if (DEBUG_AUTH) {
    console.log(`[DASHBOARD] ${message}`, data ? JSON.stringify(data, null, 2) : '')
  }
}

export const load: PageServerLoad = async ({ locals }) => {
  log('Dashboard load started')
  
  // SECURITY FIX: Use getUser() instead of getSession() for server-side validation
  const { data: { user }, error: userError } = await locals.supabase.auth.getUser()
  
  if (userError || !user) {
    log('No authenticated user found, redirecting to login', userError)
    throw redirect(303, '/login')
  }
  
  log('Authenticated user found:', { id: user.id, email: user.email })
  
  // Check if user is a candidate
  const { data: candidateProfile, error: candidateError } = await locals.supabase
    .from('candidates')
    .select('*')
    .eq('auth_user_id', user.id)
    .single()
  
  log('Candidate profile check:', { found: !!candidateProfile, error: candidateError })
  
  if (candidateProfile) {
    // This is a candidate user
    log('User is a candidate, returning candidate dashboard data')
    
    // Get candidate-specific dashboard data
    const [jobsResult, applicationsResult] = await Promise.all([
      // Available jobs
      locals.supabase
        .from('jobs')
        .select('id, title, status, employment_type, created_at, company_id, companies(name)')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(5),
      
      // Candidate's applications
      locals.supabase
        .from('applications')
        .select(`
          id, status, created_at,
          jobs(id, title, employment_type, companies(name))
        `)
        .eq('candidate_id', candidateProfile.id)
        .order('created_at', { ascending: false })
        .limit(5)
    ])
    
    return {
      user,
      userType: 'candidate',
      profile: candidateProfile,
      profileStatus: candidateProfile.profile_completed_at ? 'full_complete' : 'incomplete',
      dashboardData: {
        available_jobs: jobsResult.data || [],
        my_applications: applicationsResult.data || []
      }
    }
  }
  
  // Check if user is a business user
  const { data: businessUser, error: businessUserError } = await locals.supabase
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
    .eq('id', user.id)
    .single()
  
  log('Business user check:', { 
    found: !!businessUser, 
    error: businessUserError,
    permissions: businessUser?.process_permissions 
  })
  
  if (businessUser) {
    const permissions = businessUser.process_permissions || []
    const currentProcess = businessUser.current_process
    
    log('Processing business user:', { permissions, currentProcess })
    
    // No permissions - redirect to access denied
    if (permissions.length === 0) {
      log('No permissions found, redirecting to access-denied')
      throw redirect(303, '/access-denied')
    }
    
    // Multiple processes but no current process - redirect to process selection
    if (permissions.length > 1 && !currentProcess) {
      log('Multiple permissions but no current process, redirecting to process selection')
      throw redirect(303, '/select-process')
    }
    
    // Determine which process dashboard to show
    const activeProcess = currentProcess || permissions[0]
    
    // Get process-specific dashboard data
    let dashboardData = {}
    
    if (activeProcess === 'recruitment') {
      const [jobsResult, candidatesResult, applicationsResult] = await Promise.all([
        // Recent jobs
        locals.supabase
          .from('jobs')
          .select('id, title, status, created_at')
          .eq('company_id', businessUser.company_id || '')
          .order('created_at', { ascending: false })
          .limit(5),
        
        // Recent candidates
        locals.supabase
          .from('candidates')
          .select('id, name, email, status, created_at')
          .eq('company_id', businessUser.company_id || '')
          .order('created_at', { ascending: false })
          .limit(5),
        
        // Recent applications
        locals.supabase
          .from('applications')
          .select(`
            id, status, created_at,
            jobs(title), candidates(name)
          `)
          .eq('company_id', businessUser.company_id || '')
          .order('created_at', { ascending: false })
          .limit(5)
      ])
      
      dashboardData = {
        recent_jobs: jobsResult.data || [],
        recent_candidates: candidatesResult.data || [],
        recent_applications: applicationsResult.data || []
      }
    } else if (activeProcess === 'bench_sales') {
      const [benchCandidatesResult, projectsResult, placementsResult] = await Promise.all([
        // Available bench candidates
        locals.supabase
          .from('candidates')
          .select('id, name, email, status, skills, created_at')
          .eq('company_id', businessUser.company_id || '')
          .eq('status', 'bench')
          .order('created_at', { ascending: false })
          .limit(5),
        
        // Recent project opportunities
        locals.supabase
          .from('jobs')
          .select('id, title, status, employment_type, created_at')
          .eq('company_id', businessUser.company_id || '')
          .order('created_at', { ascending: false })
          .limit(5),
        
        // Recent placements
        locals.supabase
          .from('applications')
          .select(`
            id, status, created_at,
            jobs(title, employment_type), candidates(name)
          `)
          .eq('company_id', businessUser.company_id || '')
          .eq('status', 'placed')
          .order('created_at', { ascending: false })
          .limit(5)
      ])
      
      dashboardData = {
        bench_candidates: benchCandidatesResult.data || [],
        project_opportunities: projectsResult.data || [],
        recent_placements: placementsResult.data || []
      }
    }
    
    return {
      user,
      userType: 'business',
      profile: businessUser,
      company: businessUser.companies,
      currentProcess: activeProcess,
      availableProcesses: permissions,
      dashboardData
    }
  }
  
  // User exists in auth but not in our system
  log('User not found in candidates or business users tables, redirecting to access-denied')
  throw redirect(303, '/access-denied')
}
