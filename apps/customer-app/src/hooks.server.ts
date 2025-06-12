import { createSupabaseLoadClient } from '$lib/supabase'
import { redirect } from '@sveltejs/kit'
import type { Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
  // Create Supabase client for server-side operations
  event.locals.supabase = createSupabaseLoadClient(event.fetch, event)
  
  // Get user session
  const {
    data: { session }
  } = await event.locals.supabase.auth.getSession()
  
  event.locals.session = session
  event.locals.user = session?.user ?? null
  
  // Protected routes logic
  const url = new URL(event.request.url)
  const isAuthPage = url.pathname.startsWith('/login') || 
                     url.pathname.startsWith('/register') || 
                     url.pathname.startsWith('/activate') || 
                     url.pathname.startsWith('/reset-password')
  const isPublicPage = ['/', '/about', '/contact'].includes(url.pathname)
  const isApiRoute = url.pathname.startsWith('/api/')
  
  // Redirect authenticated users away from auth pages (except API routes)
  if (session && isAuthPage && !isApiRoute) {
    throw redirect(303, '/dashboard')
  }
  
  // Redirect unauthenticated users to login (except for public pages and API routes)
  if (!session && !isAuthPage && !isPublicPage && !isApiRoute) {
    throw redirect(303, '/login')
  }
  
  return resolve(event)
}
