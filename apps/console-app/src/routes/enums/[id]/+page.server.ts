// Enum detail view server load function
import { error, redirect } from '@sveltejs/kit'
import { createSupabaseAdminClient } from '$lib/supabase'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals, params }) => {
  const { consoleUser, authManager } = locals
  const { id } = params

  if (!consoleUser) {
    throw redirect(302, '/login')
  }

  // Check permissions
  const hasPermission = await authManager.validatePermission(
    consoleUser.id,
    'enums',
    'read'
  )

  if (!hasPermission) {
    throw redirect(302, '/dashboard?error=insufficient_permissions')
  }

  const supabase = createSupabaseAdminClient()

  try {
    // Get enum details
    let query = supabase
      .from('configurable_enums')
      .select(`
        id,
        category,
        values,
        metadata,
        created_at,
        updated_at,
        created_by,
        updated_by,
        version,
        company_id
      `)
      .eq('id', id)
      .single()

    // Apply company filter based on user role
    if (consoleUser.role !== 'super_admin') {
      query = query.in('company_id', consoleUser.company_ids)
    }

    const { data: enumData, error: enumError } = await query

    if (enumError || !enumData) {
      console.error('Error fetching enum:', enumError)
      throw error(404, 'Enum not found')
    }

    // Get enum operation history
    const { data: operations } = await supabase
      .from('enum_operations')
      .select(`
        id,
        operation_type,
        user_id,
        changes,
        timestamp,
        console_users!user_id(
          email
        )
      `)
      .eq('enum_id', id)
      .order('timestamp', { ascending: false })
      .limit(10)

    // Get company info
    const { data: company } = await supabase
      .from('companies')
      .select('id, name')
      .eq('id', enumData.company_id)
      .single()

    return {
      consoleUser,
      enum: enumData,
      operations: operations || [],
      company
    }

  } catch (err) {
    console.error('Load error:', err)
    throw error(500, 'Internal server error')
  }
}
