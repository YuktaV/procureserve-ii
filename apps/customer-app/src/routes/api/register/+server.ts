import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { validateBusinessEmail, validateEmail } from '$lib/email-validation'

export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    const data = await request.json()
    const { contactPerson, company, decisionMaker, additional } = data
    
    // Validation
    if (!contactPerson?.name || !contactPerson?.email || !company?.name || !company?.domain) {
      return json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    if (!validateEmail(contactPerson.email) || !validateBusinessEmail(contactPerson.email)) {
      return json({ error: 'Invalid business email address' }, { status: 400 })
    }
    
    // Insert into business_registrations table
    const { data: registration, error } = await locals.supabase
      .from('business_registrations')
      .insert({
        contact_person_name: contactPerson.name,
        contact_person_title: contactPerson.title,
        contact_person_email: contactPerson.email,
        contact_person_phone: contactPerson.phone,
        company_name: company.name,
        company_domain: company.domain,
        company_phone: company.phone,
        company_address: company.address,
        decision_maker_name: decisionMaker?.name,
        decision_maker_title: decisionMaker?.title,
        decision_maker_email: decisionMaker?.email,
        hear_about: additional?.hearAbout,
        comments: additional?.comments,
        status: 'pending'
      })
      .select()
      .single()
    
    if (error) {
      console.error('Registration error:', error)
      return json({ error: 'Registration failed' }, { status: 500 })
    }
    
    return json({ 
      success: true, 
      message: 'Registration submitted successfully',
      registrationId: registration.id 
    })
    
  } catch (error) {
    console.error('Registration error:', error)
    return json({ error: 'Internal server error' }, { status: 500 })
  }
}
