import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals, cookies }) => {
  console.log('[LOGOUT] Starting logout process')

  // Sign out the user from Supabase
  const { error } = await locals.supabase.auth.signOut()

  if (error) {
    console.log('[LOGOUT] Supabase signOut error:', error)
  } else {
    console.log('[LOGOUT] Supabase signOut successful')
  }

  // Clear all auth-related cookies manually
  const cookieOptions = {
    path: '/',
    expires: new Date(0),
    maxAge: 0,
    httpOnly: false,
    secure: false,
    sameSite: 'lax' as const
  }

  // Clear Supabase auth cookies
  cookies.delete('sb-127-auth-token', cookieOptions)
  cookies.delete('sb-127-auth-token.0', cookieOptions)
  cookies.delete('sb-127-auth-token.1', cookieOptions)
  cookies.delete('sb-127-refresh-token', cookieOptions)

  console.log('[LOGOUT] Cookies cleared, redirecting to login')

  // Redirect to login page
  throw redirect(303, '/login')
}
