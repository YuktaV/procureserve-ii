import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    const { data: { user } } = await locals.supabase.auth.getUser()
    
    if (!user) {
      return json({ error: 'Not authenticated' }, { status: 401 })
    }
    
    const profileData = await request.json()
    const { 
      firstName,
      lastName,
      phone,
      workAuthorization,
      visaValidUntil,
      representingAgency,
      linkedInUrl,
      preferredLocation,
      availabilityDate
    } = profileData
    
    // Validation
    if (!firstName || !lastName || !phone || !workAuthorization) {
      return json({ error: 'First name, last name, phone, and work authorization are required' }, { status: 400 })
    }
    
    // Validate visa date for non-citizens
    const visaTypes = ['h1b', 'l1', 'opt', 'cpt', 'tn', 'other']
    if (visaTypes.includes(workAuthorization) && !visaValidUntil) {
      return json({ error: 'Visa expiration date is required for your work authorization type' }, { status: 400 })
    }
    
    // Update candidate profile
    const { error: updateError } = await locals.supabase
      .from('candidates')
      .update({
        first_name: firstName,
        last_name: lastName,
        phone,
        work_authorization: workAuthorization,
        visa_valid_until: visaValidUntil || null,
        representing_agency: representingAgency || null,
        linkedin_url: linkedInUrl || null,
        preferred_location: preferredLocation || null,
        availability_date: availabilityDate || null,
        updated_at: new Date().toISOString()
      })
      .eq('auth_user_id', user.id)
    
    if (updateError) {
      console.error('Profile update error:', updateError)
      return json({ error: 'Failed to update profile' }, { status: 500 })
    }
    
    // Handle agency change if needed
    if (representingAgency !== undefined) {
      try {
        const { error: agencyError } = await locals.supabase
          .rpc('update_candidate_agency', {
            p_candidate_id: user.id,
            p_new_agency: representingAgency || null,
            p_start_date: new Date().toISOString().split('T')[0],
            p_notes: 'Updated via profile edit'
          })
        
        if (agencyError) {
          console.error('Agency history error:', agencyError)
          // Don't fail the entire request for agency history issues
        }
      } catch (agencyHistoryError) {
        console.error('Agency history update failed:', agencyHistoryError)
      }
    }
    
    return json({ 
      success: true, 
      message: 'Profile updated successfully!' 
    })
    
  } catch (error) {
    console.error('Profile update error:', error)
    return json({ error: 'Internal server error' }, { status: 500 })
  }
}
