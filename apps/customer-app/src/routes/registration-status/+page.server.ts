import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
  const { data: { session } } = await locals.supabase.auth.getSession()
  
  if (!session) {
    throw redirect(303, '/login')
  }
  
  // Get user's company and registration status
  const { data: user } = await locals.supabase
    .from('users')
    .select(`
      company_id,
      companies (
        id,
        name,
        registration_status,
        submitted_at,
        reviewed_at,
        rejection_reason
      )
    `)
    .eq('id', session.user.id)
    .single()
  
  if (!user?.company_id) {
    throw redirect(303, '/register/business')
  }
  
  const company = user.companies
  
  // If approved, redirect to dashboard
  if (company?.registration_status === 'approved') {
    throw redirect(303, '/dashboard')
  }
  
  // Get latest review if exists
  const { data: latestReview } = await locals.supabase
    .from('registration_reviews')
    .select('*')
    .eq('company_id', company?.id)
    .order('reviewed_at', { ascending: false })
    .limit(1)
    .single()
  
  return {
    company,
    latestReview,
    user: session.user
  }
}
