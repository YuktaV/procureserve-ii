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
  
  // Define route types first
  const isAuthPage = url.pathname.startsWith('/login') || 
                     url.pathname.startsWith('/register') || 
                     url.pathname.startsWith('/activate') || 
                     url.pathname.startsWith('/reset-password')
  const isPublicPage = ['/', '/about', '/contact', '/test-users', '/select-process', '/debug-auth', '/logout'].includes(url.pathname)
  const isApiRoute = url.pathname.startsWith('/api/')
  const isProcessRoute = url.pathname.startsWith('/recruitment/') || url.pathname.startsWith('/bench-sales/')
  const isSelectProcessPage = url.pathname === '/select-process' || url.pathname.startsWith('/select-process/')
  const isAccessDeniedPage = url.pathname === '/access-denied'
  
  // SECURITY FIX: Use getUser() instead of getSession() for server-side validation
  const {
    data: { user },
    error: userError
  } = await event.locals.supabase.auth.getUser()
  
  if (userError) {
    log('Auth error:', userError)
  }
  
  log('User from getUser():', user ? { id: user.id, email: user.email } : null)
  
  // FIXED: Check for valid customer app user instead of blocking console users
  let customerUser = null;
  if (user) {
    const { data: userData, error: userDataError } = await event.locals.supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()
    
    if (!userDataError && userData) {
      customerUser = userData;
      log('Customer user found:', { id: userData.id, email: userData.email, role: userData.role })
    } else {
      log('No customer user record found for authenticated user')
    }
  }
  
  // Set locals for downstream usage
  event.locals.user = user
  event.locals.customerUser = customerUser
  event.locals.session = user ? {
    user,
    access_token: '',
    refresh_token: '',
    expires_in: 0,
    token_type: 'bearer'
  } : null
  
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
    log('Redirecting authenticated user away from auth page to select-process')
    throw redirect(303, '/select-process')
  }
  
  // Redirect unauthenticated users to login (except for public pages and API routes)
  if (!user && !isAuthPage && !isPublicPage && !isApiRoute) {
    log('Redirecting unauthenticated user to login')
    throw redirect(303, '/login')
  }
  
  // For authenticated users without customer profile, redirect to access denied or onboarding
  if (user && !customerUser && !isAuthPage && !isPublicPage && !isApiRoute && !isAccessDeniedPage) {
    log('Authenticated user without customer profile, redirecting to access denied')
    throw redirect(303, '/access-denied')
  }
  
  // For authenticated users accessing process routes, verify permissions
  if (user && customerUser && isProcessRoute) {
    log('Checking process permissions for authenticated user')
    
    // Get user process permissions from customer user data
    const processFromUrl = url.pathname.startsWith('/recruitment/') ? 'recruitment' : 'bench_sales'
    // FIXED: Access permissions from profile.process_permissions, not direct process_permissions
    const userPermissions = customerUser?.profile?.process_permissions || customerUser?.process_permissions || []
    const hasPermission = userPermissions.includes(processFromUrl)
    
    log('Process permission check:', {
      processFromUrl,
      userPermissions: userPermissions,
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
