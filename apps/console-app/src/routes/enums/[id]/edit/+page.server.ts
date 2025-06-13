// Enum edit server actions and validation
import { fail, redirect } from '@sveltejs/kit'
import { createSupabaseAdminClient } from '$lib/supabase'
import { updateEnumSchema } from '$lib/server/validation/enum.schemas'
import type { Actions, PageServerLoad } from './$types'

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
    'update'
  )

  if (!hasPermission) {
    throw redirect(302, '/dashboard?error=insufficient_permissions')
  }

  const supabase = createSupabaseAdminClient()

  try {
    // Get enum details
    let query = supabase
      .from('configurable_enums')
      .select('*')
      .eq('id', id)
      .single()

    // Apply company filter based on user role
    if (consoleUser.role !== 'super_admin') {
      query = query.in('company_id', consoleUser.company_ids)
    }

    const { data: enumData, error: enumError } = await query

    if (enumError || !enumData) {
      throw redirect(302, '/enums?error=enum_not_found')
    }

    // Get company info
    const { data: company } = await supabase
      .from('companies')
      .select('id, name')
      .eq('id', enumData.company_id)
      .single()

    return {
      consoleUser,
      enum: enumData,
      company
    }

  } catch (err) {
    console.error('Load error:', err)
    throw redirect(302, '/enums?error=load_failed')
  }
}

export const actions: Actions = {
  update: async ({ request, locals, params, getClientAddress }) => {
    const { consoleUser, authManager } = locals
    const { id } = params

    if (!consoleUser) {
      return fail(401, { error: 'Unauthorized' })
    }

    // Check permissions
    const hasPermission = await authManager.validatePermission(
      consoleUser.id,
      'enums',
      'update'
    )

    if (!hasPermission) {
      return fail(403, { error: 'Insufficient permissions' })
    }

    try {
      const formData = await request.formData()
      const data = Object.fromEntries(formData.entries())

      // Parse JSON fields
      const enumData = {
        id,
        display_name: data.display_name as string,
        description: data.description as string || undefined,
        values: JSON.parse(data.values as string),
        version: parseInt(data.version as string)
      }

      // Validate input
      const validation = updateEnumSchema.safeParse(enumData)
      if (!validation.success) {
        return fail(400, {
          error: 'Validation failed',
          errors: validation.error.errors.map(e => e.message),
          values: enumData
        })
      }

      const supabase = createSupabaseAdminClient()

      // Get current enum for comparison
      const { data: currentEnum, error: fetchError } = await supabase
        .from('configurable_enums')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError) {
        return fail(404, { error: 'Enum not found' })
      }

      // Update enum
      const { data: updatedEnum, error: updateError } = await supabase
        .from('configurable_enums')
        .update({
          values: enumData.values,
          metadata: {
            ...currentEnum.metadata,
            display_name: enumData.display_name,
            description: enumData.description
          },
          updated_by: consoleUser.id,
          version: currentEnum.version + 1
        })
        .eq('id', id)
        .select()
        .single()

      if (updateError) {
        console.error('Error updating enum:', updateError)
        return fail(500, { error: 'Failed to update enum' })
      }

      // Log the operation
      await authManager.logSecurityEvent({
        event_type: 'enum_updated',
        user_id: consoleUser.id,
        user_email: consoleUser.email,
        user_role: consoleUser.role,
        resource: 'configurable_enums',
        resource_id: id,
        success: true,
        ip_address: getClientAddress(),
        metadata: {
          display_name: enumData.display_name,
          value_count: enumData.values.length,
          version_increment: true
        },
        timestamp: new Date().toISOString(),
        company_id: currentEnum.company_id
      })

      throw redirect(302, `/enums/${id}?updated=true`)

    } catch (error) {
      console.error('Update enum error:', error)
      return fail(500, { error: 'Internal server error' })
    }
  }
}
