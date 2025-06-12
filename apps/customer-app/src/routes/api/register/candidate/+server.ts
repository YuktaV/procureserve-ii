import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { validateEmail } from '$lib/email-validation'
import { validatePassword } from '$lib/password-validation'

export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    const data = await request.json()
    const { 
      firstName, 
      lastName, 
      email, 
      password, 
      confirmPassword
    } = data
    
    // Validation - only essential fields required
    if (!firstName || !lastName || !email || !password) {
      return json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    if (!validateEmail(email)) {
      return json({ error: 'Invalid email address' }, { status: 400 })
    }
    
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      return json({ error: passwordValidation.errors[0] }, { status: 400 })
    }
    
    if (password !== confirmPassword) {
      return json({ error: 'Passwords do not match' }, { status: 400 })
    }
    
    // Create user account with Supabase Auth
    const { data: authData, error: authError } = await locals.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          user_type: 'candidate'
        }
      }
    })
    
    if (authError) {
      return json({ error: authError.message }, { status: 400 })
    }
    
    // If user created successfully, create minimal candidate profile
    if (authData.user) {
      const fullName = `${firstName} ${lastName}`.trim()
      
      const { data: candidateData, error: profileError } = await locals.supabase
        .from('candidates')
        .insert({
          auth_user_id: authData.user.id,
          first_name: firstName,
          last_name: lastName,
          name: fullName, // Required field from original schema
          email,
          status: 'active'
          // All other fields will be filled during profile completion
        })
        .select()
        .single()
      
      if (profileError) {
        console.error('Profile creation error:', profileError)
        return json({ error: 'Failed to create candidate profile' }, { status: 500 })
      }
      
      // Record the creation method using the actual candidate ID
      if (candidateData) {
        const { error: methodError } = await locals.supabase
          .from('candidate_creation_methods')
          .insert({
            candidate_id: candidateData.id, // Use the actual candidate record ID
            method: 'self_registration'
          })
        
        if (methodError) {
          console.error('Method tracking error:', methodError)
          // Don't fail the registration for this
        }
      }
    }
    
    return json({ 
      success: true, 
      message: 'Account created successfully. Please complete your profile to get started.',
      userId: authData.user?.id
    })
    
  } catch (error) {
    console.error('Candidate registration error:', error)
    return json({ error: 'Internal server error' }, { status: 500 })
  }
}
