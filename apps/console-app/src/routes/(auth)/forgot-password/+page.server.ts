import { fail } from '@sveltejs/kit'
import { ConsoleAuthManager } from '$lib/server/auth/console-auth'
import type { Actions } from './$types'

export const actions = {
  reset: async ({ request, getClientAddress }) => {
    const data = await request.formData()
    const email = data.get('email') as string

    if (!email) {
      return fail(400, {
        error: 'Email address is required'
      })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return fail(400, {
        error: 'Invalid email format'
      })
    }

    const authManager = new ConsoleAuthManager()
    
    try {
      // Check if user exists in console_users table
      const consoleUser = await authManager.getConsoleUserByEmail(email)
      
      if (!consoleUser) {
        // For security, don't reveal if email exists or not
        // Always show success message to prevent email enumeration
        return {
          success: 'If an account with this email exists, you will receive a password reset link shortly.'
        }
      }

      if (!consoleUser.is_active) {
        // Log security event for inactive account reset attempt
        const clientIP = getClientAddress()
        await authManager.logSecurityEvent({
          event_type: 'suspicious_activity',
          user_id: consoleUser.id,
          user_email: email,
          user_role: consoleUser.role,
          success: false,
          error_message: 'Password reset attempted on inactive account',
          ip_address: clientIP,
          timestamp: new Date().toISOString()
        })

        // Still show success message for security
        return {
          success: 'If an account with this email exists, you will receive a password reset link shortly.'
        }
      }

      // TODO: Implement actual password reset email sending
      // For now, we'll just log the event and show success
      
      // Log password reset request
      const clientIP = getClientAddress()
      await authManager.logSecurityEvent({
        event_type: 'password_reset_requested',
        user_id: consoleUser.id,
        user_email: email,
        user_role: consoleUser.role,
        success: true,
        ip_address: clientIP,
        metadata: { 
          reset_method: 'email_link',
          requested_at: new Date().toISOString()
        },
        timestamp: new Date().toISOString()
      })

      // In a real implementation, you would:
      // 1. Generate a secure reset token
      // 2. Store it in the database with expiration
      // 3. Send email with reset link
      // 4. Create reset password page to handle the token

      return {
        success: 'If an account with this email exists, you will receive a password reset link shortly. Please check your email and follow the instructions.'
      }

    } catch (error) {
      console.error('Password reset error:', error)
      
      // Log the error but don't expose it to the user
      const clientIP = getClientAddress()
      await authManager.logSecurityEvent({
        event_type: 'system_error',
        user_id: '',
        user_email: email,
        user_role: 'unknown',
        success: false,
        error_message: 'Password reset system error',
        ip_address: clientIP,
        timestamp: new Date().toISOString()
      })

      return fail(500, {
        error: 'An unexpected error occurred. Please try again later or contact support.'
      })
    }
  }
} satisfies Actions
