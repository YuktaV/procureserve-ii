import type { Handle } from '@sveltejs/kit'
import { createSupabaseServerClient } from './lib/supabase'
import { ConsoleAuthManager } from './lib/server/auth/console-auth'
import { redirect } from '@sveltejs/kit'

const DEBUG_SECURITY = process.env.NODE_ENV === 'development'

function log(message: string, data?: any) {
  if (DEBUG_SECURITY) {
    console.log(`[CONSOLE-SECURITY] ${message}`, data ? JSON.stringify(data, null, 2) : '')
  }
}

export const handle: Handle = async ({ event, resolve }) => {
  const url = new URL(event.request.url)
  log(`Processing console request to: ${url.pathname}`)

  // Create Supabase client
  event.locals.supabase = createSupabaseServerClient({
    get: (name: string) => event.cookies.get(name),
    set: (name: string, value: string, options: any) => event.cookies.set(name, value, options),
    remove: (name: string, options: any) => event.cookies.delete(name, options)
  })

  // Initialize auth manager
  const authManager = new ConsoleAuthManager()

  // Get user from session
  const { data: { user }, error: userError } = await event.locals.supabase.auth.getUser()
  
  if (userError) {
    log('Auth error:', userError)
  }

  // Get console user data if authenticated
  let consoleUser = null
  if (user) {
    consoleUser = await authManager.getConsoleUser(user.id)
    log('Console user found:', consoleUser ? { id: consoleUser.id, role: consoleUser.role } : null)
  }

  // Set locals
  event.locals.user = user
  event.locals.consoleUser = consoleUser
  event.locals.authManager = authManager

  // Route classification
  const isAuthPage = url.pathname.startsWith('/login') || 
                     url.pathname.startsWith('/register') || 
                     url.pathname.startsWith('/forgot-password') ||
                     url.pathname.startsWith('/verify-email')
  const isPublicPage = url.pathname === '/'
  const isApiRoute = url.pathname.startsWith('/api/')
  const isDashboardRoute = url.pathname.startsWith('/dashboard') || 
                          url.pathname.startsWith('/companies') ||
                          url.pathname.startsWith('/enums') ||
                          url.pathname.startsWith('/users') ||
                          url.pathname.startsWith('/settings') ||
                          url.pathname.startsWith('/analytics') ||
                          url.pathname.startsWith('/audit-logs')

  log('Route analysis:', {
    isAuthPage,
    isPublicPage,
    isApiRoute,
    isDashboardRoute,
    hasUser: !!user,
    hasConsoleUser: !!consoleUser
  })

  // Security middleware
  
  // 1. Redirect authenticated users away from auth pages
  if (consoleUser && isAuthPage && !isApiRoute) {
    log('Redirecting authenticated console user away from auth page')
    throw redirect(303, '/dashboard')
  }

  // 2. Redirect unauthenticated users to login
  if (!consoleUser && !isAuthPage && !isPublicPage && !isApiRoute) {
    log('Redirecting unauthenticated user to login')
    throw redirect(303, '/login')
  }

  // 3. Check if authenticated user has console access
  if (user && !consoleUser && !isAuthPage && !isPublicPage) {
    log('User authenticated but not a console user, denying access')
    throw redirect(303, '/login?error=access_denied')
  }

  // 4. Check if console user is active
  if (consoleUser && !consoleUser.is_active && !isAuthPage) {
    log('Console user is inactive, redirecting to login')
    await authManager.logSecurityEvent({
      event_type: 'login_failed',
      user_id: consoleUser.id,
      user_email: consoleUser.email,
      user_role: consoleUser.role,
      success: false,
      error_message: 'Inactive account access attempt',
      timestamp: new Date().toISOString()
    })
    throw redirect(303, '/login?error=account_inactive')
  }

  // 5. Role-based access control for specific routes
  if (consoleUser && isDashboardRoute) {
    const requiredPermissions = getRequiredPermissions(url.pathname)
    
    if (requiredPermissions.length > 0) {
      const hasPermission = await Promise.all(
        requiredPermissions.map(({ resource, action, companyId }) =>
          authManager.validatePermission(consoleUser.id, resource, action, companyId)
        )
      )

      if (!hasPermission.every(Boolean)) {
        log('User lacks required permissions for route', { 
          path: url.pathname, 
          requiredPermissions 
        })
        
        await authManager.logSecurityEvent({
          event_type: 'suspicious_activity',
          user_id: consoleUser.id,
          user_email: consoleUser.email,
          user_role: consoleUser.role,
          resource: url.pathname,
          success: false,
          error_message: 'Insufficient permissions',
          timestamp: new Date().toISOString()
        })
        
        throw redirect(303, '/dashboard?error=insufficient_permissions')
      }
    }
  }

  // 6. Rate limiting for sensitive operations
  if (isApiRoute && ['POST', 'PUT', 'DELETE'].includes(event.request.method)) {
    const clientIP = event.getClientAddress()
    const isRateLimited = await checkRateLimit(clientIP, consoleUser?.id)
    
    if (isRateLimited) {
      log('Rate limit exceeded', { ip: clientIP, userId: consoleUser?.id })
      
      if (consoleUser) {
        await authManager.logSecurityEvent({
          event_type: 'suspicious_activity',
          user_id: consoleUser.id,
          user_email: consoleUser.email,
          user_role: consoleUser.role,
          success: false,
          ip_address: clientIP,
          error_message: 'Rate limit exceeded',
          timestamp: new Date().toISOString()
        })
      }
      
      return new Response('Rate limit exceeded', { status: 429 })
    }
  }

  // 7. Add security headers
  const response = await resolve(event)
  
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  // CSP for console app
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
    "font-src 'self' https://fonts.gstatic.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ')
  
  response.headers.set('Content-Security-Policy', csp)

  log('Request processing complete')
  return response
}

/**
 * Get required permissions for a route
 */
function getRequiredPermissions(pathname: string): Array<{
  resource: string
  action: string
  companyId?: string
}> {
  const permissions: Array<{ resource: string; action: string; companyId?: string }> = []

  if (pathname.startsWith('/enums')) {
    permissions.push({ resource: 'enums', action: 'read' })
    if (pathname.includes('/create') || pathname.includes('/edit')) {
      permissions.push({ resource: 'enums', action: 'create' })
    }
  }

  if (pathname.startsWith('/companies')) {
    permissions.push({ resource: 'companies', action: 'read' })
    if (pathname.includes('/create') || pathname.includes('/edit')) {
      permissions.push({ resource: 'companies', action: 'manage' })
    }
  }

  if (pathname.startsWith('/users')) {
    permissions.push({ resource: 'users', action: 'read' })
    if (pathname.includes('/invite') || pathname.includes('/manage')) {
      permissions.push({ resource: 'users', action: 'manage' })
    }
  }

  if (pathname.startsWith('/settings')) {
    permissions.push({ resource: 'settings', action: 'read' })
    if (pathname.includes('/edit')) {
      permissions.push({ resource: 'settings', action: 'update' })
    }
  }

  if (pathname.startsWith('/audit-logs')) {
    permissions.push({ resource: 'audit_logs', action: 'read' })
  }

  if (pathname.startsWith('/analytics')) {
    permissions.push({ resource: 'analytics', action: 'read' })
  }

  return permissions
}

/**
 * Simple rate limiting implementation
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

async function checkRateLimit(clientIP: string, userId?: string): Promise<boolean> {
  const key = userId || clientIP
  const now = Date.now()
  const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000') // 15 minutes
  const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100')

  const existing = rateLimitStore.get(key)
  
  if (!existing || now > existing.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs })
    return false
  }

  existing.count++
  return existing.count > maxRequests
}