import { fail, redirect } from '@sveltejs/kit'
import { ConsoleAuthManager } from '$lib/server/auth/console-auth'
import type { Actions } from './$types'

export const actions = {
  login: async ({ request, cookies, getClientAddress }) => {
    const data = await request.formData()
    const email = data.get('email') as string
    const password = data.get('password') as string
    const remember = data.get('remember') === 'on'

    if (!email || !password) {
      return fail(400, {
        email,
        error: 'Email and password are required'
      })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return fail(400, {
        email,
        error: 'Invalid email format'
      })
    }

    const authManager = new ConsoleAuthManager()
    
    try {
      const result = await authManager.authenticateUser({
        email,
        password
      })

      if (!result.success) {
        // Log failed login attempt with IP
        const clientIP = getClientAddress()
        await authManager.logSecurityEvent({
          event_type: 'login_failed',
          user_id: '',
          user_email: email,
          user_role: 'company_manager',
          success: false,
          error_message: result.error || 'Authentication failed',
          ip_address: clientIP,
          timestamp: new Date().toISOString()
        })

        return fail(401, {
          email,
          error: result.error || 'Authentication failed'
        })
      }

      if (!result.session) {
        return fail(500, {
          email,
          error: 'Failed to create session'
        })
      }

      // Set secure session cookie
      const maxAge = remember ? 60 * 60 * 24 * 30 : 60 * 60 * 8 // 30 days or 8 hours
      
      cookies.set('console-auth-token', result.session.access_token, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge
      })

      // Log successful login
      const clientIP = getClientAddress()
      await authManager.logSecurityEvent({
        event_type: 'login',
        user_id: result.user!.id,
        user_email: result.user!.email,
        user_role: result.user!.role,
        success: true,
        ip_address: clientIP,
        metadata: { remember_me: remember },
        timestamp: new Date().toISOString()
      })

      // Redirect to dashboard
      throw redirect(303, '/dashboard')

    } catch (error) {
      if (error instanceof Response) {
        throw error // Re-throw redirects
      }

      console.error('Login error:', error)
      return fail(500, {
        email,
        error: 'An unexpected error occurred'
      })
    }
  }
} satisfies Actions