import { createSupabaseLoadClient } from '$lib/supabase'
import { redirect } from '@sveltejs/kit'
import type { Handle } from '@sveltejs/kit'

const DEBUG_AUTH = true // Set to false in production

function log(message: string, data?: any) {
  if (DEBUG_AUTH) {
    console.log(`[AUTH] ${message}`, data ? JSON.stringify(data, null, 2) : '')
  }
}

export const handle: Handle = async ({ event, resolve }) => {
  const url = new URL(event.request.url)
  log(`Processing request to: ${url.pathname}`)
  
  // Create Supabase client for server-side operations
  event.locals.supabase = createSupabaseLoadClient(event.fetch, event)
  
  // SECURITY FIX: Use getUser() instead of getSession() for server-side validation
  const {
    data: { user },
    error: userError
  } = await event.locals.supabase.auth.getUser()
  
  if (userError) {
    log('Auth error:', userError)
  }
  
  log('User from getUser():', user ? { id: user.id, email: user.email } : null)
  
  // Set locals for downstream usage
  event.locals.user = user
  event.locals.session = user ? { user } : null
  
  // Protected routes logic
  const isAuthPage = url.pathname.startsWith('/login') || 
                     url.pathname.startsWith('/register') || 
                     url.pathname.startsWith('/activate') || 
                     url.pathname.startsWith('/reset-password')
  const isPublicPage = ['/', '/about', '/contact'].includes(url.pathname)
  const isApiRoute = url.pathname.startsWith('/api/')
  const isProcessRoute = url.pathname.startsWith('/recruitment/') || url.pathname.startsWith('/bench-sales/')
  const isSelectProcessPage = url.pathname === '/select-process'
  const isAccessDeniedPage = url.pathname === '/access-denied'
  
  log('Route analysis:', {
    isAuthPage,
    isPublicPage,
    isApiRoute,
    isProcessRoute,
    isSelectProcessPage,
    isAccessDeniedPage,
    hasUser: !!user
  })
  
  // Redirect authenticated users away from auth pages (except API routes)
  if (user && isAuthPage && !isApiRoute) {
    log('Redirecting authenticated user away from auth page to dashboard')
    throw redirect(303, '/dashboard')
  }
  
  // Redirect unauthenticated users to login (except for public pages and API routes)
  if (!user && !isAuthPage && !isPublicPage && !isApiRoute) {
    log('Redirecting unauthenticated user to login')
    throw redirect(303, '/login')
  }
  
  // For authenticated users accessing process routes, verify permissions
  if (user && isProcessRoute) {
    log('Checking process permissions for authenticated user')
    
    // Get user process permissions
    const { data: userData, error: userDataError } = await event.locals.supabase
      .from('users')
      .select('process_permissions')
      .eq('id', user.id)
      .single()
    
    if (userDataError) {
      log('Error fetching user permissions:', userDataError)
      throw redirect(303, '/access-denied')
    }
    
    const processFromUrl = url.pathname.startsWith('/recruitment/') ? 'recruitment' : 'bench_sales'
    const hasPermission = userData?.process_permissions?.includes(processFromUrl)
    
    log('Process permission check:', {
      processFromUrl,
      userPermissions: userData?.process_permissions,
      hasPermission
    })
    
    if (!hasPermission) {
      log('User lacks permission for requested process, redirecting to access-denied')
      throw redirect(303, '/access-denied')
    }
  }
  
  log('Request processing complete, continuing to route handler')
  return resolve(event)
}
