import { createSupabaseBrowserClient } from '$lib/supabase'

export const load = async ({ data }) => {
  const supabase = createSupabaseBrowserClient()

  return {
    supabase,
    session: data.session,
    user: data.user
  }
}
