import type { PageLoad } from './$types'
import type { ProcessSelectionData, EnhancedUser, ProcessType } from '../../../packages/shared-types'
import { redirect } from '@sveltejs/kit'

export const load: PageLoad = async ({ parent }) => {
  const { supabase, session } = await parent()
  
  if (!session) {
    throw redirect(303, '/auth/login')
  }

  try {
    // Get user with process permissions
    const { data: user, error: userError } = await supabase
      .from('users')
      .select(`
        id,
        email,
        company_id,
        role,
        profile,
        process_permissions,
        current_process,
        created_at,
        updated_at
      `)
      .eq('id', session.user.id)
      .single()

    if (userError || !user) {
      console.error('Error fetching user:', userError)
      throw redirect(303, '/auth/login')
    }

    // FIXED: Access permissions from profile.process_permissions, not direct process_permissions
    const permissions = user.profile?.process_permissions || user.process_permissions || []

    const enhancedUser: EnhancedUser = {
      ...user,
      process_permissions: permissions,
      current_process: user.current_process || undefined
    }

    // Add computed properties
    enhancedUser.has_single_process = enhancedUser.process_permissions.length === 1
    enhancedUser.has_dual_process = enhancedUser.process_permissions.length > 1
    enhancedUser.needs_process_selection = enhancedUser.has_dual_process && !enhancedUser.current_process

    // Decision logic for process access
    if (enhancedUser.process_permissions.length === 0) {
      // No process access - redirect to access denied
      throw redirect(303, '/access-denied')
    }

    if (enhancedUser.has_single_process) {
      // Single process user - redirect directly to their process
      const process = enhancedUser.process_permissions[0]
      throw redirect(303, `/dashboard/${process}`)
    }
    
    if (enhancedUser.has_dual_process && enhancedUser.current_process) {
      // Dual process user with existing selection - redirect to their current process
      throw redirect(303, `/dashboard/${enhancedUser.current_process}`)
    }

    // If we reach here, user has multiple processes but no current selection
    // Show the process selection page
    const selectionData: ProcessSelectionData = {
      user: enhancedUser,
      available_processes: enhancedUser.process_permissions,
      requires_selection: true
    }

    return selectionData

  } catch (error) {
    // If it's a redirect, let it through
    if (error && typeof error === 'object' && 'status' in error && error.status === 303) {
      throw error
    }
    
    console.error('Error in process selection load:', error)
    throw redirect(303, '/auth/login')
  }
}
