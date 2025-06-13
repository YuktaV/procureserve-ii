import { createBrowserClient, createServerClient, isBrowser } from '@supabase/ssr'
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'
import type { Database } from '../../../../packages/database-types'

// Browser client for client-side operations
export const supabase = createBrowserClient<Database>(
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY
)

// Server client factory for server-side operations
export function createSupabaseServerClient(cookies: {
  get: (name: string) => string | undefined
  set: (name: string, value: string, options?: any) => void
  remove: (name: string, options?: any) => void
}) {
  return createServerClient<Database>(
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return cookies.get(name)
        },
        set(name: string, value: string, options?: any) {
          cookies.set(name, value, {
            ...options,
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
          })
        },
        remove(name: string, options?: any) {
          cookies.remove(name, {
            ...options,
            path: '/'
          })
        }
      }
    }
  )
}

