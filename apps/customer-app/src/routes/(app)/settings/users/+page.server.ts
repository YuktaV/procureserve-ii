import { error, redirect } from '@sveltejs/kit'
import { supabase } from '$lib/supabase'
import type { PageServerLoad } from './$types'
import type { UserManagementUser, UserInvitation, BusinessUnit } from 'shared-types'

export const load: PageServerLoad = async ({ url, locals }) => {
  if (!locals.user) {
    throw redirect(302, '/login')
  }

  // Only admins and managers can access user management
  if (!['admin', 'manager'].includes(locals.user.role)) {
    throw error(403, 'Access denied')
  }

  const search = url.searchParams.get('search') || ''
  const role = url.searchParams.get('role')
  const is_active = url.searchParams.get('is_active')

  try {
    // Fetch users with relations
    let query = supabase
      .from('users')
      .select(`
        *,
        business_unit:business_units(*),
        invited_by_user:users!invited_by(id, email, profile)
      `)
      .eq('company_id', locals.user.company_id)

    if (search) {
      query = query.or(`email.ilike.%${search}%,profile->>first_name.ilike.%${search}%,profile->>last_name.ilike.%${search}%`)
    }
    if (role) query = query.eq('role', role)
    if (is_active !== null) query = query.eq('is_active', is_active === 'true')

    const { data: users, error: usersError } = await query.order('created_at', { ascending: false })

    if (usersError) throw usersError

    // Fetch pending invitations
    const { data: invitations, error: invitationsError } = await supabase
      .from('user_invitations')
      .select(`
        *,
        invited_by_user:users!invited_by(id, email, profile),
        business_unit:business_units(*)
      `)
      .eq('company_id', locals.user.company_id)
      .is('accepted_at', null)
      .gt('expires_at', new Date().toISOString())

    if (invitationsError) throw invitationsError

    // Fetch business units for filters
    const { data: businessUnits, error: unitsError } = await supabase
      .from('business_units')
      .select('*')
      .eq('company_id', locals.user.company_id)
      .order('name')

    if (unitsError) throw unitsError

    return {
      users: users as UserManagementUser[],
      invitations: invitations as UserInvitation[],
      businessUnits: businessUnits as BusinessUnit[],
      canEdit: locals.user.role === 'admin'
    }

  } catch (err) {
    console.error('Error loading users:', err)
    throw error(500, 'Failed to load users')
  }
}