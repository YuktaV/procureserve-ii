import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
  const { data: { session } } = await locals.supabase.auth.getSession()
  
  if (!session) {
    throw redirect(303, '/login')
  }
  
  // Get candidate profile
  const { data: candidate, error } = await locals.supabase
    .from('candidates')
    .select('*')
    .eq('auth_user_id', session.user.id)
    .single()
  
  if (error || !candidate) {
    throw redirect(303, '/dashboard')
  }
  
  return {
    candidate
  }
}
