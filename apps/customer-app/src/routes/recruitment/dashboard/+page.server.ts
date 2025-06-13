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
  
  // Check if user has recruitment access
  const hasRecruitmentAccess = user.process_permissions?.includes('recruitment')
  if (!hasRecruitmentAccess) {
    throw redirect(303, '/access-denied')
  }
  
  // Set current process if needed
  if (user.current_process !== 'recruitment') {
    await locals.supabase
      .from('users')
      .update({ current_process: 'recruitment' })
      .eq('id', session.user.id)
  }
  
  // Fetch dashboard statistics
  const [jobsResult, candidatesResult, applicationsResult, recentJobsResult, recentSubmissionsResult] = await Promise.all([
    // Jobs statistics
    locals.supabase
      .from('jobs')
      .select('status')
      .eq('company_id', user.company_id),
    
    // Candidates statistics (through applications)
    locals.supabase
      .from('applications')
      .select(`
        candidates(id, status)
      `)
      .eq('company_id', user.company_id),
    
    // Applications statistics
    locals.supabase
      .from('applications')
      .select('status')
      .eq('company_id', user.company_id),
    
    // Recent jobs (last 5)
    locals.supabase
      .from('jobs')
      .select('id, title, status, created_at')
      .eq('company_id', user.company_id)
      .order('created_at', { ascending: false })
      .limit(5),
    
    // Recent submissions (last 5)
    locals.supabase
      .from('applications')
      .select(`
        id, status, created_at,
        jobs(title),
        candidates(name)
      `)
      .eq('company_id', user.company_id)
      .order('created_at', { ascending: false })
      .limit(5)
  ])
  
  // Process jobs stats
  const jobsStats = {}
  jobsResult.data?.forEach(job => {
    jobsStats[job.status] = (jobsStats[job.status] || 0) + 1
  })
  
  // Process candidates stats (unique candidates only)
  const uniqueCandidates = new Set()
  const candidatesStats = {}
  candidatesResult.data?.forEach(app => {
    if (app.candidates && !uniqueCandidates.has(app.candidates.id)) {
      uniqueCandidates.add(app.candidates.id)
      const status = app.candidates.status
      candidatesStats[status] = (candidatesStats[status] || 0) + 1
    }
  })
  
  // Process applications stats
  const applicationsStats = {}
  applicationsResult.data?.forEach(app => {
    applicationsStats[app.status] = (applicationsStats[app.status] || 0) + 1
  })
  
  return {
    user: {
      ...user,
      current_process: 'recruitment'
    },
    company: user.companies,
    stats: {
      jobs: Object.entries(jobsStats).map(([status, count]) => ({ status, count })),
      candidates: Object.entries(candidatesStats).map(([status, count]) => ({ status, count })),
      applications: Object.entries(applicationsStats).map(([status, count]) => ({ status, count }))
    },
    recentJobs: recentJobsResult.data || [],
    recentSubmissions: recentSubmissionsResult.data || []
  }
}
