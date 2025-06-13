import { json, error } from '@sveltejs/kit'
import { createSupabaseAdminClient } from '$lib/supabase'
import type { RequestHandler } from './$types'
import { z } from 'zod'

const updateEnumSchema = z.object({
  category: z.string().min(1).max(50).regex(/^[a-z_]+$/).optional(),
  display_name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  values: z.array(z.object({
    key: z.string().min(1).max(30).regex(/^[a-z0-9_]+$/),
    label: z.string().min(1).max(100),
    color: z.string().regex(/^#[0-9A-F]{6}$/i),
    active: z.boolean(),
    sort_order: z.number().min(0).max(999),
    description: z.string().optional()
  })).min(1).max(50).optional()
})

// GET /api/enums/[id] - Get specific enum
export const GET: RequestHandler = async ({ locals, params }) => {
  const { consoleUser, authManager } = locals

  if (!consoleUser) {
    throw error(401, 'Unauthorized')
  }

  const hasPermission = await authManager.validatePermission(
    consoleUser.id,
    'enums',
    'read'
  )

  if (!hasPermission) {
    throw error(403, 'Insufficient permissions')
  }

  const supabase = createSupabaseAdminClient()

  try {
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
      .eq('id', params.id)

    // Apply company filter for non-super-admins
    if (consoleUser.role !== 'super_admin') {
      query = query.in('company_id', consoleUser.company_ids)
    }

    const { data: enumData, error: enumError } = await query.single()

    if (enumError) {
      if (enumError.code === 'PGRST116') {
        throw error(404, 'Enum not found')
      }
      console.error('Error fetching enum:', enumError)
      throw error(500, 'Failed to fetch enum')
    }

    return json({
      success: true,
      data: enumData
    })

  } catch (err) {
    console.error('API Error:', err)
    throw error(500, 'Internal server error')
  }
}

// PUT /api/enums/[id] - Update enum
export const PUT: RequestHandler = async ({ locals, params, request, getClientAddress }) => {
  const { consoleUser, authManager } = locals

  if (!consoleUser) {
    throw error(401, 'Unauthorized')
  }

  const hasPermission = await authManager.validatePermission(
    consoleUser.id,
    'enums',
    'update'
  )

  if (!hasPermission) {
    throw error(403, 'Insufficient permissions')
  }

  const supabase = createSupabaseAdminClient()

  try {
    const body = await request.json()
    const validatedData = updateEnumSchema.parse(body)

    // First, get the existing enum to check permissions and get old data
    let query = supabase
      .from('configurable_enums')
      .select('*')
      .eq('id', params.id)

    if (consoleUser.role !== 'super_admin') {
      query = query.in('company_id', consoleUser.company_ids)
    }

    const { data: existingEnum, error: fetchError } = await query.single()

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        throw error(404, 'Enum not found')
      }
      throw error(500, 'Failed to fetch enum')
    }

    // Prepare update data
    const updateData: any = {
      updated_by: consoleUser.id,
      updated_at: new Date().toISOString(),
      version: existingEnum.version + 1
    }

    if (validatedData.values) {
      updateData.values = validatedData.values
    }

    if (validatedData.category) {
      updateData.category = validatedData.category
    }

    // Update metadata if provided
    if (validatedData.display_name || validatedData.description) {
      updateData.metadata = {
        ...existingEnum.metadata,
        ...(validatedData.display_name && { display_name: validatedData.display_name }),
        ...(validatedData.description && { description: validatedData.description })
      }
    }

    // Perform the update
    const { data: updatedEnum, error: updateError } = await supabase
      .from('configurable_enums')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating enum:', updateError)
      throw error(500, 'Failed to update enum')
    }

    // Log the operation
    await authManager.logSecurityEvent({
      event_type: 'enum_updated',
      user_id: consoleUser.id,
      user_email: consoleUser.email,
      user_role: consoleUser.role,
      resource: 'configurable_enums',
      resource_id: params.id,
      success: true,
      ip_address: getClientAddress(),
      metadata: {
        category: updatedEnum.category,
        display_name: updatedEnum.metadata?.display_name,
        changes: validatedData,
        old_version: existingEnum.version,
        new_version: updatedEnum.version
      },
      timestamp: new Date().toISOString(),
      company_id: updatedEnum.company_id
    })

    return json({
      success: true,
      data: updatedEnum,
      message: 'Enum updated successfully'
    })

  } catch (err) {
    if (err instanceof z.ZodError) {
      throw error(400, `Validation error: ${err.errors.map(e => e.message).join(', ')}`)
    }
    
    console.error('API Error:', err)
    throw error(500, 'Internal server error')
  }
}

// DELETE /api/enums/[id] - Delete enum
export const DELETE: RequestHandler = async ({ locals, params, getClientAddress }) => {
  const { consoleUser, authManager } = locals

  if (!consoleUser) {
    throw error(401, 'Unauthorized')
  }

  const hasPermission = await authManager.validatePermission(
    consoleUser.id,
    'enums',
    'delete'
  )

  if (!hasPermission) {
    throw error(403, 'Insufficient permissions')
  }

  const supabase = createSupabaseAdminClient()

  try {
    // First, get the existing enum to check permissions
    let query = supabase
      .from('configurable_enums')
      .select('*')
      .eq('id', params.id)

    if (consoleUser.role !== 'super_admin') {
      query = query.in('company_id', consoleUser.company_ids)
    }

    const { data: existingEnum, error: fetchError } = await query.single()

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        throw error(404, 'Enum not found')
      }
      throw error(500, 'Failed to fetch enum')
    }

    // Check if enum is system enum (cannot be deleted)
    if (existingEnum.metadata?.is_system) {
      throw error(400, 'System enums cannot be deleted')
    }

    // TODO: Check if enum is in use (uncomment when ready)
    // const { count: usageCount } = await supabase
    //   .from('jobs') // or other tables using enums
    //   .select('*', { count: 'exact', head: true })
    //   .contains('some_enum_field', [existingEnum.category])
    
    // if (usageCount && usageCount > 0) {
    //   throw error(400, `Cannot delete enum that is in use by ${usageCount} records`)
    // }

    // Delete the enum
    const { error: deleteError } = await supabase
      .from('configurable_enums')
      .delete()
      .eq('id', params.id)

    if (deleteError) {
      console.error('Error deleting enum:', deleteError)
      throw error(500, 'Failed to delete enum')
    }

    // Log the operation
    await authManager.logSecurityEvent({
      event_type: 'enum_deleted',
      user_id: consoleUser.id,
      user_email: consoleUser.email,
      user_role: consoleUser.role,
      resource: 'configurable_enums',
      resource_id: params.id,
      success: true,
      ip_address: getClientAddress(),
      metadata: {
        category: existingEnum.category,
        display_name: existingEnum.metadata?.display_name,
        deleted_enum: existingEnum
      },
      timestamp: new Date().toISOString(),
      company_id: existingEnum.company_id
    })

    return json({
      success: true,
      message: 'Enum deleted successfully'
    })

  } catch (err) {
    console.error('API Error:', err)
    throw error(500, 'Internal server error')
  }
}