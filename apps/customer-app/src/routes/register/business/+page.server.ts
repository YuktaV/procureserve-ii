import { redirect, fail } from '@sveltejs/kit'
import type { PageServerLoad, Actions } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
  // Check if user is already logged in - if so, redirect appropriately
  const { data: { session } } = await locals.supabase.auth.getSession()
  
  if (session) {
    // Check if they're already a business user
    const { data: existingUser } = await locals.supabase
      .from('users')
      .select('company_id, companies(registration_status)')
      .eq('id', session.user.id)
      .single()
    
    if (existingUser?.company_id) {
      // Already has a company, redirect to appropriate page based on status
      const status = existingUser.companies?.registration_status
      if (status === 'approved') {
        throw redirect(303, '/dashboard')
      } else {
        throw redirect(303, '/registration-status')
      }
    }
  }
  
  return {}
}

export const actions: Actions = {
  register: async ({ request, locals }) => {
    try {
      const formData = await request.formData()
      
      // Extract form data
      const companyData = {
        name: formData.get('company_name') as string,
        legal_entity_type: formData.get('legal_entity_type') as string,
        tax_id: formData.get('tax_id') as string,
        business_type: formData.get('business_type') as string,
        estimated_annual_volume: formData.get('estimated_annual_volume') as string,
        recruitment_enabled: formData.get('recruitment_enabled') === 'true',
        bench_sales_enabled: formData.get('bench_sales_enabled') === 'true',
        time_zone: formData.get('time_zone') as string,
        business_address: {
          street: formData.get('street_address') as string,
          city: formData.get('city') as string,
          state: formData.get('state') as string,
          zip_code: formData.get('zip_code') as string,
          country: 'US' // US-only for now
        },
        primary_contact: {
          first_name: formData.get('first_name') as string,
          last_name: formData.get('last_name') as string,
          email: formData.get('email') as string,
          phone: formData.get('phone') as string,
          title: formData.get('title') as string
        },
        working_hours: {
          start: formData.get('work_start') as string,
          end: formData.get('work_end') as string
        }
      }

      // Validation
      const requiredFields = [
        'company_name', 'legal_entity_type', 'tax_id', 'business_type',
        'street_address', 'city', 'state', 'zip_code',
        'first_name', 'last_name', 'email', 'phone', 'title'
      ]

      for (const field of requiredFields) {
        if (!formData.get(field)) {
          return fail(400, { 
            error: `${field.replace('_', ' ')} is required`,
            formData: Object.fromEntries(formData)
          })
        }
      }

      // Email validation
      const email = companyData.primary_contact.email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return fail(400, { 
          error: 'Please enter a valid email address',
          formData: Object.fromEntries(formData)
        })
      }

      // Tax ID validation (basic EIN format: XX-XXXXXXX)
      const taxId = companyData.tax_id
      const einRegex = /^\d{2}-\d{7}$/
      if (!einRegex.test(taxId)) {
        return fail(400, { 
          error: 'Tax ID must be in EIN format (XX-XXXXXXX)',
          formData: Object.fromEntries(formData)
        })
      }

      // Check if company or email already exists
      const { data: existingCompany } = await locals.supabase
        .from('companies')
        .select('id')
        .eq('name', companyData.name)
        .single()

      if (existingCompany) {
        return fail(400, { 
          error: 'A company with this name already exists',
          formData: Object.fromEntries(formData)
        })
      }

      // Check if user with this email already exists
      const { data: existingAuth } = await locals.supabase.auth.admin.getUserByEmail(email)
      if (existingAuth.user) {
        return fail(400, { 
          error: 'An account with this email already exists',
          formData: Object.fromEntries(formData)
        })
      }

      // Create the company record with draft status
      const { data: company, error: companyError } = await locals.supabase
        .from('companies')
        .insert({
          ...companyData,
          registration_status: 'draft',
          domain: `${companyData.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.procureserve.com`
        })
        .select()
        .single()

      if (companyError) {
        console.error('Company creation error:', companyError)
        return fail(500, { 
          error: 'Failed to create company record',
          formData: Object.fromEntries(formData)
        })
      }

      // Create the user account
      const password = formData.get('password') as string
      const { data: authUser, error: authError } = await locals.supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto-confirm for business users
        user_metadata: {
          first_name: companyData.primary_contact.first_name,
          last_name: companyData.primary_contact.last_name,
          company_id: company.id
        }
      })

      if (authError) {
        console.error('User creation error:', authError)
        // Clean up company record
        await locals.supabase.from('companies').delete().eq('id', company.id)
        return fail(500, { 
          error: 'Failed to create user account',
          formData: Object.fromEntries(formData)
        })
      }

      // Create user record in users table
      const { error: userError } = await locals.supabase
        .from('users')
        .insert({
          id: authUser.user!.id,
          email,
          company_id: company.id,
          role: 'admin', // Business account creator is admin
          profile: {
            first_name: companyData.primary_contact.first_name,
            last_name: companyData.primary_contact.last_name,
            phone: companyData.primary_contact.phone,
            title: companyData.primary_contact.title
          }
        })

      if (userError) {
        console.error('User record creation error:', userError)
        // Clean up auth user and company
        await locals.supabase.auth.admin.deleteUser(authUser.user!.id)
        await locals.supabase.from('companies').delete().eq('id', company.id)
        return fail(500, { 
          error: 'Failed to create user profile',
          formData: Object.fromEntries(formData)
        })
      }

      // Redirect to document upload page
      throw redirect(303, `/register/business/documents?company_id=${company.id}`)

    } catch (error) {
      if (error instanceof Response) {
        throw error // Re-throw redirects
      }
      console.error('Registration error:', error)
      return fail(500, { 
        error: 'Registration failed. Please try again.',
        formData: Object.fromEntries(await request.formData())
      })
    }
  }
}
