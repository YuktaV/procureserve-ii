import { redirect } from '@sveltejs/kit'
import type { PageServerLoad, Actions } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
  // SECURITY FIX: Use getUser() instead of getSession() for server-side validation
  const { data: { user }, error: userError } = await locals.supabase.auth.getUser()
  
  if (userError || !user) {
    throw redirect(303, '/login')
  }
  
  // Get user's process permissions
  const { data: userProfile, error: userProfileError } = await locals.supabase
    .from('users')
    .select(`
      process_permissions,
      profile,
      current_process,
      role,
      companies!inner(name, recruitment_enabled, bench_sales_enabled)
    `)
    .eq('id', user.id)
    .single()
  
  if (userProfileError || !userProfile) {
    throw redirect(303, '/access-denied')
  }
  
  // FIXED: Access permissions from profile.process_permissions, not direct process_permissions
  const permissions = userProfile.profile?.process_permissions || userProfile.process_permissions || []
  
  // No permissions - redirect to access denied
  if (permissions.length === 0) {
    throw redirect(303, '/access-denied')
  }
  
  // Single process - redirect directly to dashboard with that process
  if (permissions.length === 1) {
    const singleProcess = permissions[0]
    
    // Set current process if not already set
    if (!userProfile.current_process) {
      await locals.supabase
        .from('users')
        .update({ current_process: singleProcess })
        .eq('id', user.id)
    }
    
    // FIXED: Redirect to unified dashboard
    throw redirect(303, '/dashboard')
  }
  
  // Multiple processes - show selection screen
  return {
    user: {
      email: user.email,
      role: userProfile.role,
      current_process: userProfile.current_process
    },
    available_processes: permissions,
    company: userProfile.companies
  }
}

export const actions: Actions = {
  selectProcess: async ({ request, locals }) => {
    const { data: { user }, error: userError } = await locals.supabase.auth.getUser()
    
    if (userError || !user) {
      throw redirect(303, '/login')
    }
    
    const formData = await request.formData()
    const selectedProcess = formData.get('process') as string
    
    if (!selectedProcess || !['recruitment', 'bench_sales'].includes(selectedProcess)) {
      return { error: 'Invalid process selection' }
    }
    
    // Verify user has permission for selected process
    const { data: userProfile } = await locals.supabase
      .from('users')
      .select('process_permissions, profile')
      .eq('id', user.id)
      .single()
    
    // FIXED: Access permissions from profile.process_permissions, not direct process_permissions
    const permissions = userProfile?.profile?.process_permissions || userProfile?.process_permissions || []
    if (!permissions.includes(selectedProcess)) {
      return { error: 'You do not have permission for this process' }
    }
    
    // Update user's current process
    const { error: updateError } = await locals.supabase
      .from('users')
      .update({ current_process: selectedProcess })
      .eq('id', user.id)
    
    if (updateError) {
      return { error: 'Failed to update process selection' }
    }
    
    // FIXED: Redirect to unified dashboard
    throw redirect(303, '/dashboard')
  }
}
