import { redirect } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ locals }) => {
  const { error } = await locals.supabase.auth.signOut()
  
  if (error) {
    console.log('[SIGNOUT] Error signing out:', error)
  } else {
    console.log('[SIGNOUT] User signed out successfully')
  }
  
  // Always redirect to login, even if there was an error
  throw redirect(303, '/login?message=You have been signed out')
}
