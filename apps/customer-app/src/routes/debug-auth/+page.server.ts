import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
  console.log('=== DEBUG AUTH PAGE ===')
  
  // Test authentication state
  const {
    data: { user },
    error: userError
  } = await locals.supabase.auth.getUser()
  
  console.log('Auth user:', user ? { id: user.id, email: user.email } : null)
  console.log('Auth error:', userError)
  
  // Test customer user lookup
  let customerUser = null
  if (user) {
    const { data: userData, error: userDataError } = await locals.supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()
    
    console.log('Customer user query:', { found: !!userData, error: userDataError })
    
    if (!userDataError && userData) {
      customerUser = userData
      console.log('Customer user permissions:', {
        direct: userData.process_permissions,
        profile: userData.profile?.process_permissions
      })
    }
  }
  
  return {
    authUser: user ? { id: user.id, email: user.email } : null,
    authError: userError?.message || null,
    customerUser: customerUser ? {
      id: customerUser.id,
      email: customerUser.email,
      role: customerUser.role,
      processPermissions: customerUser.process_permissions,
      profilePermissions: customerUser.profile?.process_permissions
    } : null
  }
}
