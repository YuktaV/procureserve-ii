import type { PageLoad } from './$types'
import { redirect } from '@sveltejs/kit'

export const load: PageLoad = async ({ url, parent }) => {
  const { supabase, session } = await parent()
  
  if (!session) {
    throw redirect(303, '/auth/login')
  }

  try {
    // Get user's company information
    const { data: user, error: userError } = await supabase
      .from('users')
      .select(`
        id,
        company_id,
        companies!inner (
          id,
          name,
          registration_status,
          created_at,
          submitted_at,
          reviewed_at,
          rejection_reason
        )
      `)
      .eq('id', session.user.id)
      .single()

    if (userError || !user) {
      console.error('Error fetching user company:', userError)
      throw redirect(303, '/auth/login')
    }

    // Get latest review if any
    const { data: latestReview } = await supabase
      .from('company_reviews')
      .select('*')
      .eq('company_id', user.company_id)
      .order('reviewed_at', { ascending: false })
      .limit(1)
      .single()

    return {
      company: user.companies,
      latestReview: latestReview || null
    }
  } catch (error) {
    console.error('Error loading registration status:', error)
    return {
      company: null,
      latestReview: null,
      error: 'Failed to load registration status'
    }
  }
}
