import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ locals }) => {
  try {
    const { error } = await locals.supabase.auth.signOut()
    
    if (error) {
      return json({ error: 'Failed to sign out' }, { status: 500 })
    }
    
    return json({ success: true })
  } catch (error) {
    console.error('Sign out error:', error)
    return json({ error: 'Internal server error' }, { status: 500 })
  }
}
