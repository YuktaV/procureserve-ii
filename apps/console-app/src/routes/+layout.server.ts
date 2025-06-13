import { createSupabaseServerClient } from '$lib/supabase'
import { ConsoleAuthManager } from '$lib/server/auth/console-auth'

export const load = async ({ cookies }) => {
  const supabase = createSupabaseServerClient({
    get: (name: string) => cookies.get(name),
    set: (name: string, value: string, options: any) => cookies.set(name, value, options),
    remove: (name: string, options: any) => cookies.delete(name, options)
  })

  const authManager = new ConsoleAuthManager()

  const { data: { user } } = await supabase.auth.getUser()
  
  let consoleUser = null
  if (user) {
    consoleUser = await authManager.getConsoleUser(user.id)
  }

  return {
    user,
    consoleUser
  }
}