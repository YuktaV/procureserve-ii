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
    return {
      user,
      userType: 'candidate',
      profile: candidateProfile
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
        domain,
        settings,
        recruitment_enabled,
        bench_sales_enabled
      )
    `)
    .eq('id', user.id)
    .single()
  
  if (businessUser) {
    return {
      user,
      userType: 'business',
      profile: businessUser,
      company: businessUser.companies
    }
  }
  
  return {
    user,
    userType: 'unknown',
    profile: null
  }
}
