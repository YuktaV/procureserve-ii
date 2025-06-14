import { redirect, fail } from '@sveltejs/kit'
import type { PageServerLoad, Actions } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
  const { data: { session } } = await locals.supabase.auth.getSession()
  
  if (!session) {
    throw redirect(303, '/login')
  }
  
  return {
    user: session.user
  }
}

export const actions: Actions = {
  changePassword: async ({ request, locals }) => {
    const { data: { session } } = await locals.supabase.auth.getSession()
    
    if (!session) {
      throw redirect(303, '/login')
    }

    const formData = await request.formData()
    const currentPassword = formData.get('current_password') as string
    const newPassword = formData.get('new_password') as string
    const confirmPassword = formData.get('confirm_password') as string

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      return fail(400, { 
        error: 'All password fields are required' 
      })
    }

    if (newPassword !== confirmPassword) {
      return fail(400, { 
        error: 'New password and confirmation do not match' 
      })
    }

    if (newPassword.length < 8) {
      return fail(400, { 
        error: 'New password must be at least 8 characters long' 
      })
    }

    // Check password strength
    const hasUpperCase = /[A-Z]/.test(newPassword)
    const hasLowerCase = /[a-z]/.test(newPassword)
    const hasNumbers = /\d/.test(newPassword)
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword)

    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecial) {
      return fail(400, { 
        error: 'Password must contain uppercase, lowercase, number, and special character' 
      })
    }

    try {
      // Update password in Supabase Auth
      const { error } = await locals.supabase.auth.updateUser({
        password: newPassword
      })

      if (error) {
        console.error('Password update error:', error)
        return fail(400, { 
          error: error.message 
        })
      }

      // Log the password change for audit purposes
      await locals.supabase
        .from('activity_logs')
        .insert({
          user_id: session.user.id,
          action: 'password_changed',
          details: { ip_address: '127.0.0.1' }, // Would get real IP in production
          created_at: new Date().toISOString()
        })

      return { success: true }
      
    } catch (error) {
      console.error('Password change error:', error)
      return fail(500, { error: 'Internal server error' })
    }
  }
}
