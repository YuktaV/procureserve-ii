import { redirect, fail } from '@sveltejs/kit'
import type { PageServerLoad, Actions } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
  const { data: { session } } = await locals.supabase.auth.getSession()
  
  if (!session) {
    throw redirect(303, '/login')
  }
  
  const user = session.user
  
  // Get candidate profile if exists
  const { data: candidateProfile } = await locals.supabase
    .from('candidates')
    .select('*')
    .eq('auth_user_id', user.id)
    .single()
  
  // Get user profile for business users
  const { data: userProfile } = await locals.supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()
  
  return {
    user,
    candidateProfile,
    userProfile,
    userType: candidateProfile ? 'candidate' : 'business'
  }
}

export const actions: Actions = {
  updateProfile: async ({ request, locals }) => {
    const { data: { session } } = await locals.supabase.auth.getSession()
    
    if (!session) {
      throw redirect(303, '/login')
    }

    const formData = await request.formData()
    const data = {
      first_name: formData.get('first_name') as string,
      last_name: formData.get('last_name') as string,
      phone: formData.get('phone') as string,
      work_authorization: formData.get('work_authorization') as string,
      visa_valid_until: formData.get('visa_valid_until') as string || null,
      representing_agency: formData.get('representing_agency') as string || null,
      linkedin_url: formData.get('linkedin_url') as string || null,
      preferred_location: formData.get('preferred_location') as string || null,
      availability_date: formData.get('availability_date') as string || null
    }

    // Validation
    if (!data.first_name || !data.last_name || !data.phone || !data.work_authorization) {
      return fail(400, { 
        error: 'First name, last name, phone, and work authorization are required' 
      })
    }

    // Validate visa date for non-citizens
    const visaTypes = ['h1b', 'l1', 'opt', 'cpt', 'tn', 'other']
    if (visaTypes.includes(data.work_authorization) && !data.visa_valid_until) {
      return fail(400, { 
        error: 'Visa expiration date is required for your work authorization type' 
      })
    }

    try {
      // Update candidate profile
      const { error: updateError } = await locals.supabase
        .from('candidates')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('auth_user_id', session.user.id)

      if (updateError) {
        console.error('Profile update error:', updateError)
        return fail(500, { error: 'Failed to update profile' })
      }

      return { success: true }
      
    } catch (error) {
      console.error('Profile update error:', error)
      return fail(500, { error: 'Internal server error' })
    }
  }
}
