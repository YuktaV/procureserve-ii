import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
  // Get current user if authenticated
  const { data: { user } } = await locals.supabase.auth.getUser()
  
  if (user) {
    // Get user profile data
    const { data: userProfile } = await locals.supabase
      .from('users')
      .select('email, process_permissions, role, company_id')
      .eq('id', user.id)
      .single()
    
    return {
      user: {
        id: user.id,
        email: user.email,
        ...userProfile
      }
    }
  }
  
  return {
    user: null
  }
}
