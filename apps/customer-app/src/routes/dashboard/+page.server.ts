import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
  const { data: { session } } = await locals.supabase.auth.getSession()
  
  if (!session) {
    throw redirect(303, '/login')
  }
  
  const user = session.user
  
  // Check if user is a candidate
  const { data: candidateProfile } = await locals.supabase
    .from('candidates')
    .select('*')
    .eq('auth_user_id', user.id)
    .single()
  
  if (candidateProfile) {
    // This is a candidate user
    return {
      user,
      userType: 'candidate',
      profile: candidateProfile,
      profileStatus: candidateProfile.profile_completed_at ? 'full_complete' : 'incomplete'
    }
  }
  
  // Check if user is a business user
  const { data: businessUser } = await locals.supabase
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
  
  if (businessUser) {
    // This is a business user
    return {
      user,
      userType: 'business',
      profile: businessUser,
      company: businessUser.companies
    }
  }
  
  // User exists in auth but not in our system
  // This shouldn't happen in normal flow, but handle gracefully
  return {
    user,
    userType: 'unknown',
    profile: null
  }
}
