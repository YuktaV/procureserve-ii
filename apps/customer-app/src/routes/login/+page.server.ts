import { fail, redirect } from '@sveltejs/kit'
import type { Actions } from './$types'

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
    
    // Check if user has dual roles (Recruitment + Bench Sales)
    if (data.user) {
      const { data: userProfile } = await locals.supabase
        .from('users')
        .select('role, company_id, companies!inner(recruitment_enabled, bench_sales_enabled)')
        .eq('id', data.user.id)
        .single()
      
      // If user has both recruitment and bench sales access, redirect to process selection
      if (userProfile?.companies?.recruitment_enabled && userProfile?.companies?.bench_sales_enabled) {
        throw redirect(303, '/select-process')
      }
    }
    
    // Redirect based on user type and configuration
    const redirectTo = url.searchParams.get('redirectTo') ?? '/dashboard'
    throw redirect(303, redirectTo)
  }
}
