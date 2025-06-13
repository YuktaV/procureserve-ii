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
      cookies,
      cookieOptions: {
        name: 'console-auth-token',
        lifetime: 60 * 60 * 8, // 8 hours
        domain: undefined,
        path: '/',
        sameSite: 'lax',
        httpOnly: true,
        secure: !isBrowser() || location.protocol === 'https:'
      }
    }
  )
}

// Admin client for elevated operations (server-side only)
export function createSupabaseAdminClient() {
  if (isBrowser()) {
    throw new Error('Admin client should only be used server-side')
  }
  
  const { SUPABASE_SERVICE_ROLE_KEY } = process.env
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
  }

  return createServerClient<Database>(
    PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    }
  )
}