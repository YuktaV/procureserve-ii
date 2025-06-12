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
    const formData = await request.formData()
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const userType = formData.get('userType') as string
    
    if (!email || !password) {
      return fail(400, {
        error: 'Email and password are required'
      })
    }
    
    // Attempt to sign in with Supabase
    const { data, error } = await locals.supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) {
      return fail(400, {
        error: 'Invalid email or password'
      })
    }
    
    // Get user profile and process permissions
    if (data.user) {
      const { data: userProfile } = await locals.supabase
        .from('users')
        .select(`
          role, 
          company_id, 
          process_permissions, 
          current_process,
          companies!inner(recruitment_enabled, bench_sales_enabled)
        `)
        .eq('id', data.user.id)
        .single()
      
      if (!userProfile) {
        return fail(400, { error: 'User profile not found' })
      }
      
      const permissions = userProfile.process_permissions || []
      const hasMultipleProcesses = permissions.length > 1
      
      // No process permissions - redirect to access denied
      if (permissions.length === 0) {
        throw redirect(303, '/access-denied')
      }
      
      // Multiple processes - redirect to process selection
      if (hasMultipleProcesses) {
        throw redirect(303, '/select-process')
      }
      
      // Single process - set current process and redirect to specific dashboard
      const singleProcess = permissions[0]
      
      // Update user's current process if not set
      if (!userProfile.current_process) {
        await locals.supabase
          .from('users')
          .update({ current_process: singleProcess })
          .eq('id', data.user.id)
      }
      
      // Redirect to process-specific dashboard
      throw redirect(303, `/${singleProcess}/dashboard`)
    }
    
    // Fallback redirect
    const redirectTo = url.searchParams.get('redirectTo') ?? '/dashboard'
    throw redirect(303, redirectTo)
  }
}
