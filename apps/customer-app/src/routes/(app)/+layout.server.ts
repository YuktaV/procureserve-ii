import { redirect } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals, url }) => {
  // Check if user is authenticated
  if (!locals.user) {
    throw redirect(302, '/login')
  }

  // For authenticated users, get user type and company info
  let userType = 'business' // default
  let company = null

  try {
    // Get company info for business users
    if (locals.user.company_id) {
      const { supabase } = locals
      const { data: companyData } = await supabase
        .from('companies')
        .select('*')
        .eq('id', locals.user.company_id)
        .single()

      if (companyData) {
        company = companyData
      }
    }

    return {
      user: locals.user,
      company,
      userType
    }
  } catch (error) {
    console.error('Layout load error:', error)
    return {
      user: locals.user,
      company: null,
      userType
    }
  }
}
