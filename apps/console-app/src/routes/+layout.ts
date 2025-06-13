import { supabase } from '$lib/supabase'
import { invalidate } from '$app/navigation'
import { onMount } from 'svelte'

export const load = async ({ data, depends }) => {
  depends('supabase:auth')

  return {
    supabase,
    user: data.user,
    consoleUser: data.consoleUser
  }
}