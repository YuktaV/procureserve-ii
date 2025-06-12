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
  
  // Check if user has bench sales access
  const hasBenchSalesAccess = user.process_permissions?.includes('bench_sales')
  if (!hasBenchSalesAccess) {
    throw redirect(303, '/access-denied')
  }
  
  // Set current process if needed
  if (user.current_process !== 'bench_sales') {
    await locals.supabase
      .from('users')
      .update({ current_process: 'bench_sales' })
      .eq('id', session.user.id)
  }
  
  return {
    user: {
      ...user,
      current_process: 'bench_sales'
    },
    company: user.companies
  }
}
