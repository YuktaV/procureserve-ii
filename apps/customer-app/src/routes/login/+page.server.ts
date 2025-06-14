import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url }) => {
  const message = url.searchParams.get('message')
  return {
    message
  }
}

export const actions: Actions = {
  login: async ({ request, locals, url }) => {
    console.log('[LOGIN] Login action called')
    const formData = await request.formData()
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const userType = formData.get('userType') as string
    
    console.log('[LOGIN] Form data:', { email, userType, passwordLength: password?.length })
    
    if (!email || !password) {
      console.log('[LOGIN] Missing email or password')
      return fail(400, {
        error: 'Email and password are required'
      })
    }
    
    // Attempt to sign in with Supabase
    console.log('[LOGIN] Attempting authentication with Supabase')
    const { data, error } = await locals.supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) {
      console.log('[LOGIN] Authentication failed:', error)
      return fail(400, {
        error: 'Invalid email or password'
      })
    }
    
    console.log('[LOGIN] Authentication successful for user:', data.user?.id)
    
    // Get user profile and process permissions
    if (data.user) {
      console.log('[LOGIN] Looking up user profile')
      const { data: userProfile, error: profileError } = await locals.supabase
        .from('users')
        .select(`
          role, 
          company_id, 
          profile,
          process_permissions,
          current_process,
          companies!inner(recruitment_enabled, bench_sales_enabled)
        `)
        .eq('id', data.user.id)
        .single()
      
      console.log('[LOGIN] Profile lookup result:', { 
        found: !!userProfile, 
        error: profileError?.message,
        processPermissions: userProfile?.process_permissions,
        profilePermissions: userProfile?.profile?.process_permissions
      })
      
      if (!userProfile) {
        console.log('[LOGIN] User profile not found')
        return fail(400, { error: 'User profile not found' })
      }
      
      // FIXED: Access process_permissions from profile.process_permissions, not direct process_permissions
      const permissions = userProfile.profile?.process_permissions || userProfile.process_permissions || []
      console.log('[LOGIN] Final permissions array:', permissions)
      
      // No process permissions - redirect to access denied
      if (permissions.length === 0) {
        console.log('[LOGIN] No permissions found, redirecting to access denied')
        throw redirect(303, '/access-denied')
      }
      
      // Multiple processes - redirect to process selection
      if (permissions.length > 1) {
        console.log('[LOGIN] Multiple permissions found, redirecting to process selection')
        throw redirect(303, '/select-process')
      }
      
      // Single process - set current process and redirect to dashboard
      const singleProcess = permissions[0]
      console.log('[LOGIN] Single permission found:', singleProcess)
      
      // Update user's current process if not set
      if (!userProfile.current_process) {
        console.log('[LOGIN] Updating current process to:', singleProcess)
        await locals.supabase
          .from('users')
          .update({ current_process: singleProcess })
          .eq('id', data.user.id)
      }
      
      // FIXED: Redirect to process selection instead of non-existent dashboard
      console.log('[LOGIN] Redirecting to select-process')
      throw redirect(303, '/select-process')
    }
    
    // Fallback redirect to select-process instead of non-existent dashboard
    const redirectTo = url.searchParams.get('redirectTo') ?? '/select-process'
    console.log('[LOGIN] Fallback redirect to:', redirectTo)
    throw redirect(303, redirectTo)
  }
}
