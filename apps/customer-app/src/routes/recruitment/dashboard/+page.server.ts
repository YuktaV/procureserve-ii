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
  
  // Check if user has recruitment access
  const hasRecruitmentAccess = user.process_permissions?.includes('recruitment')
  if (!hasRecruitmentAccess) {
    throw redirect(303, '/access-denied')
  }
  
  // Set current process if needed
  if (user.current_process !== 'recruitment') {
    await locals.supabase
      .from('users')
      .update({ current_process: 'recruitment' })
      .eq('id', session.user.id)
  }
  
  return {
    user: {
      ...user,
      current_process: 'recruitment'
    },
    company: user.companies
  }
}
