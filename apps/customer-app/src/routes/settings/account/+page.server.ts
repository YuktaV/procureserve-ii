import { redirect, fail } from '@sveltejs/kit'
import type { PageServerLoad, Actions } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
  const { data: { session } } = await locals.supabase.auth.getSession()
  
  if (!session) {
    throw redirect(303, '/login')
  }
  
  // Get user profile information for display
  const { data: candidateProfile } = await locals.supabase
    .from('candidates')
    .select('*')
    .eq('auth_user_id', session.user.id)
    .single()
  
  return {
    user: session.user,
    candidateProfile,
    userType: candidateProfile ? 'candidate' : 'business'
  }
}

export const actions: Actions = {
  exportData: async ({ locals }) => {
    const { data: { session } } = await locals.supabase.auth.getSession()
    
    if (!session) {
      throw redirect(303, '/login')
    }

    try {
      // Collect all user data for export (GDPR compliance)
      const userData = {
        exportedAt: new Date().toISOString(),
        user: {
          id: session.user.id,
          email: session.user.email,
          created_at: session.user.created_at
        }
      }

      // Get candidate profile data
      const { data: candidateData } = await locals.supabase
        .from('candidates')
        .select('*')
        .eq('auth_user_id', session.user.id)
        .single()

      if (candidateData) {
        userData.candidateProfile = candidateData
      }

      // Get applications data
      const { data: applicationsData } = await locals.supabase
        .from('applications')
        .select('*')
        .eq('candidate_id', candidateData?.id)

      if (applicationsData) {
        userData.applications = applicationsData
      }

      // Log the data export for audit purposes
      await locals.supabase
        .from('activity_logs')
        .insert({
          user_id: session.user.id,
          action: 'data_exported',
          details: { type: 'full_export' },
          created_at: new Date().toISOString()
        })

      return { 
        success: true, 
        exportData: JSON.stringify(userData, null, 2)
      }
      
    } catch (error) {
      console.error('Data export error:', error)
      return fail(500, { error: 'Failed to export data' })
    }
  },

  requestDeletion: async ({ request, locals }) => {
    const { data: { session } } = await locals.supabase.auth.getSession()
    
    if (!session) {
      throw redirect(303, '/login')
    }

    const formData = await request.formData()
    const confirmation = formData.get('confirmation') as string
    const reason = formData.get('reason') as string

    if (confirmation !== 'DELETE') {
      return fail(400, { 
        error: 'Please type DELETE to confirm account deletion' 
      })
    }

    try {
      // Log the deletion request for audit purposes
      await locals.supabase
        .from('activity_logs')
        .insert({
          user_id: session.user.id,
          action: 'account_deletion_requested',
          details: { reason: reason || 'No reason provided' },
          created_at: new Date().toISOString()
        })

      // In a real implementation, you might:
      // 1. Queue the deletion for a grace period (30 days)
      // 2. Send confirmation email
      // 3. Actually delete user data after grace period
      
      // For demo purposes, we'll just log the request
      return { 
        deletionRequested: true,
        message: 'Account deletion requested. You will receive a confirmation email with next steps.'
      }
      
    } catch (error) {
      console.error('Account deletion request error:', error)
      return fail(500, { error: 'Failed to process deletion request' })
    }
  }
}
