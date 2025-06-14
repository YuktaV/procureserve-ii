import { json, error } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ request, locals }) => {
  // Check authentication
  const { data: { user }, error: userError } = await locals.supabase.auth.getUser()
  
  if (userError || !user) {
    return error(401, 'Unauthorized')
  }
  
  // Get the new process from request body
  const { process } = await request.json()
  
  if (!process || !['recruitment', 'bench_sales'].includes(process)) {
    return error(400, 'Invalid process specified')
  }
  
  // Get user's current permissions
  const { data: userProfile, error: profileError } = await locals.supabase
    .from('users')
    .select('process_permissions')
    .eq('id', user.id)
    .single()
  
  if (profileError || !userProfile) {
    return error(400, 'User profile not found')
  }
  
  // Verify user has permission for the requested process
  const permissions = userProfile.process_permissions || []
  if (!permissions.includes(process)) {
    return error(403, 'You do not have permission for this process')
  }
  
  // Update user's current process
  const { error: updateError } = await locals.supabase
    .from('users')
    .update({ current_process: process })
    .eq('id', user.id)
  
  if (updateError) {
    return error(500, 'Failed to update process')
  }
  
  return json({ success: true, current_process: process })
} 