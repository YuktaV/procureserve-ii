// @ts-nocheck
// Create enum server actions and validation
import { fail, redirect } from '@sveltejs/kit'
import { createSupabaseAdminClient } from '$lib/supabase'
import { createEnumSchema } from '$lib/server/validation/enum.schemas'
import type { Actions, PageServerLoad } from './$types'
import { z } from 'zod'

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
  const { consoleUser, authManager } = locals

  if (!consoleUser) {
    throw redirect(302, '/login')
  }

  // Check permissions
  const hasPermission = await authManager.validatePermission(
    consoleUser.id,
    'enums',
    'create'
  )

  if (!hasPermission) {
    throw redirect(302, '/dashboard?error=insufficient_permissions')
  }

  // Get available companies for user
  let companies = []
  if (consoleUser.role === 'super_admin') {
    const supabase = createSupabaseAdminClient()
    const { data } = await supabase
      .from('companies')
      .select('id, name')
      .order('name')
    companies = data || []
  } else {
    // For company admins, get their specific companies
    const supabase = createSupabaseAdminClient()
    const { data } = await supabase
      .from('companies')
      .select('id, name')
      .in('id', consoleUser.company_ids)
      .order('name')
    companies = data || []
  }

  return {
    consoleUser,
    companies
  }
}

export const actions = {
  create: async ({ request, locals, getClientAddress }: import('./$types').RequestEvent) => {
    const { consoleUser, authManager } = locals

    if (!consoleUser) {
      return fail(401, { error: 'Unauthorized' })
    }

    // Check permissions
    const hasPermission = await authManager.validatePermission(
      consoleUser.id,
      'enums',
      'create'
    )

    if (!hasPermission) {
      return fail(403, { error: 'Insufficient permissions' })
    }

    try {
      const formData = await request.formData()
      const data = Object.fromEntries(formData.entries())
      
      // Parse JSON fields
      const enumData = {
        category: data.category as string,
        display_name: data.display_name as string,
        description: data.description as string || undefined,
        company_id: data.company_id as string,
        values: JSON.parse(data.values as string)
      }

      // Validate input
      const validation = createEnumSchema.safeParse(enumData)
      if (!validation.success) {
        return fail(400, {
          error: 'Validation failed',
          errors: validation.error.errors.map(e => e.message),
          values: enumData
        })
      }

      const supabase = createSupabaseAdminClient()

      // Check if enum category already exists for this company
      const { data: existingEnum } = await supabase
        .from('configurable_enums')
        .select('id')
        .eq('company_id', enumData.company_id)
        .eq('category', enumData.category)
        .single()

      if (existingEnum) {
        return fail(400, {
          error: 'Enum category already exists for this company',
          values: enumData
        })
      }

      // Create enum
      const { data: newEnum, error: createError } = await supabase
        .from('configurable_enums')
        .insert({
          category: enumData.category,
          values: enumData.values,
          metadata: {
            display_name: enumData.display_name,
            description: enumData.description,
            is_system: false,
            is_required: true,
            allow_custom_colors: true
          },
          company_id: enumData.company_id,
          created_by: consoleUser.id,
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
}d_by: consoleUser.id,
          version: 1
        })
        .select()
        .single()

      if (createError) {
        console.error('Error creating enum:', createError)
        return fail(500, {
          error: 'Failed to create enum',
          values: enumData
        })
      }

      // Log the operation
      await authManager.logSecurityEvent({
        event_type: 'enum_created',
        user_id: consoleUser.id,
        user_email: consoleUser.email,
        user_role: consoleUser.role,
        resource: 'configurable_enums',
        resource_id: newEnum.id,
        success: true,
        ip_address: getClientAddress(),
        metadata: {
          category: enumData.category,
          display_name: enumData.display_name,
          value_count: enumData.values.length
        },
        timestamp: new Date().toISOString(),
        company_id: enumData.company_id
      })

      throw redirect(302, `/enums/${newEnum.id}?created=true`)

    } catch (error) {
      if (error instanceof z.ZodError) {
        return fail(400, {
          error: 'Validation failed',
          errors: error.errors.map(e => e.message)
        })
      }

      console.error('Create enum error:', error)
      return fail(500, { error: 'Internal server error' })
    }
  }
}
;null as any as Actions;