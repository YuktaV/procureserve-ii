import { fail, redirect } from '@sveltejs/kit'
import { ConsoleAuthManager } from '$lib/server/auth/console-auth'
import { createSupabaseServerClient } from '$lib/supabase'
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

    // Create Supabase client for authentication
    const supabase = createSupabaseServerClient({
      get: (name: string) => cookies.get(name),
      set: (name: string, value: string, options: any) => cookies.set(name, value, options),
      remove: (name: string, options: any) => cookies.delete(name, options)
    })

    const authManager = new ConsoleAuthManager()

    try {
      // First, authenticate with Supabase Auth directly
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (authError || !authData.user) {
        // Log failed login attempt with IP
        const clientIP = getClientAddress()
        await authManager.logSecurityEvent({
          event_type: 'login_failed',
          user_id: '',
          user_email: email,
          user_role: 'unknown',
          success: false,
          error_message: authError?.message || 'Authentication failed',
          ip_address: clientIP,
          timestamp: new Date().toISOString()
        })

        // Provide more helpful error message in development
        const isDev = process.env.NODE_ENV === 'development'
        const errorMessage = isDev
          ? `Invalid email or password. For development, try: admin@procureserve.com with password 'admin123'`
          : 'Invalid email or password'

        return fail(401, {
          email,
          error: errorMessage
        })
      }

      // Check if user exists in console_users table
      const consoleUser = await authManager.getConsoleUser(authData.user.id)

      if (!consoleUser) {
        // Sign out the user since they don't have console access
        await supabase.auth.signOut()

        const clientIP = getClientAddress()
        await authManager.logSecurityEvent({
          event_type: 'login_failed',
          user_id: authData.user.id,
          user_email: email,
          user_role: 'unknown',
          success: false,
          error_message: 'User not found in console_users table',
          ip_address: clientIP,
          timestamp: new Date().toISOString()
        })

        const isDev = process.env.NODE_ENV === 'development'
        const errorMessage = isDev
          ? 'Access denied - this email is not registered as a console user. Use admin@procureserve.com, support@procureserve.com, or sales@procureserve.com'
          : 'Access denied - not a console user'

        return fail(401, {
          email,
          error: errorMessage
        })
      }

      if (!consoleUser.is_active) {
        // Sign out inactive user
        await supabase.auth.signOut()

        return fail(401, {
          email,
          error: 'Account is inactive'
        })
      }

      // Update last login
      await authManager.updateLastLogin(consoleUser.id)

      // Log successful login
      const clientIP = getClientAddress()
      await authManager.logSecurityEvent({
        event_type: 'login',
        user_id: consoleUser.id,
        user_email: consoleUser.email,
        user_role: consoleUser.role,
        success: true,
        ip_address: clientIP,
        metadata: { remember_me: remember },
        timestamp: new Date().toISOString()
      })

      // Redirect to dashboard - Supabase session is automatically handled
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