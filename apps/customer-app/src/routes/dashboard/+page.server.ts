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
    // This is a candidate user - keep existing behavior
    log('User is a candidate, returning candidate profile')
    return {
      user,
      userType: 'candidate',
      profile: candidateProfile,
      profileStatus: candidateProfile.profile_completed_at ? 'full_complete' : 'incomplete'
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
    // For business users, redirect to appropriate process dashboard
    const permissions = businessUser.process_permissions || []
    
    log('Processing business user permissions:', { permissions })
    
    // No permissions - redirect to access denied
    if (permissions.length === 0) {
      log('No permissions found, redirecting to access-denied')
      throw redirect(303, '/access-denied')
    }
    
    // Multiple processes - redirect to process selection
    if (permissions.length > 1) {
      log('Multiple permissions found, redirecting to process selection')
      throw redirect(303, '/select-process')
    }
    
    // Single process - redirect to specific dashboard
    const singleProcess = permissions[0]
    log('Single permission found, redirecting to specific dashboard:', singleProcess)
    throw redirect(303, `/${singleProcess}/dashboard`)
  }
  
  // User exists in auth but not in our system
  // This shouldn't happen in normal flow, but handle gracefully
  log('User not found in candidates or business users tables, redirecting to access-denied')
  throw redirect(303, '/access-denied')
}
