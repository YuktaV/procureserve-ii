import { redirect } from '@sveltejs/kit'
import { createSupabaseServerClient } from '$lib/supabase'
import { ConsoleAuthManager } from '$lib/server/auth/console-auth'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ cookies, getClientAddress }) => {
  const supabase = createSupabaseServerClient({
    get: (name: string) => cookies.get(name),
    set: (name: string, value: string, options: any) => cookies.set(name, value, options),
    remove: (name: string, options: any) => cookies.delete(name, options)
  })

  const authManager = new ConsoleAuthManager()

  try {
    // Get current user before signing out for logging
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      const consoleUser = await authManager.getConsoleUser(user.id)
      
      if (consoleUser) {
        // Log logout event
        const clientIP = getClientAddress()
        await authManager.logSecurityEvent({
          event_type: 'logout',
          user_id: consoleUser.id,
          user_email: consoleUser.email,
          user_role: consoleUser.role,
          success: true,
          ip_address: clientIP,
          timestamp: new Date().toISOString()
        })
      }
    }

    // Sign out from Supabase
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('Logout error:', error)
    }

  } catch (error) {
    console.error('Logout error:', error)
  }

  // Always redirect to login, even if there was an error
  throw redirect(303, '/login?message=You have been signed out')
}
