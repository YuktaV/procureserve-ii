import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
  const { data: { session } } = await locals.supabase.auth.getSession()
  
  if (!session) {
    throw redirect(303, '/login')
  }
  
  // Get user's process permissions
  const { data: user, error: userError } = await locals.supabase
    .from('users')
    .select(`
      process_permissions,
      current_process,
      role,
      companies!inner(name, recruitment_enabled, bench_sales_enabled)
    `)
    .eq('id', session.user.id)
    .single()
  
  if (userError || !user) {
    throw redirect(303, '/access-denied')
  }
  
  const permissions = user.process_permissions || []
  
  // No permissions - redirect to access denied
  if (permissions.length === 0) {
    throw redirect(303, '/access-denied')
  }
  
  // Single process - redirect directly to that process
  if (permissions.length === 1) {
    const singleProcess = permissions[0]
    
    // Set current process if not already set
    if (!user.current_process) {
      await locals.supabase
        .from('users')
        .update({ current_process: singleProcess })
        .eq('id', session.user.id)
    }
    
    throw redirect(303, `/${singleProcess}/dashboard`)
  }
  
  // Multiple processes - show selection screen
  return {
    user: {
      email: session.user.email,
      role: user.role,
      current_process: user.current_process
    },
    available_processes: permissions,
    company: user.companies
  }
}
