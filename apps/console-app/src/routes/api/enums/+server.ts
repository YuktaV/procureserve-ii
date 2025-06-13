import { json, error } from '@sveltejs/kit'
import { createSupabaseAdminClient } from '$lib/supabase'
import type { RequestHandler } from './$types'
import { z } from 'zod'

const enumSchema = z.object({
  category: z.string().min(1).max(50).regex(/^[a-z_]+$/),
  display_name: z.string().min(1).max(100),
  description: z.string().optional(),
  values: z.array(z.object({
    key: z.string().min(1).max(30).regex(/^[a-z0-9_]+$/),
    label: z.string().min(1).max(100),
    color: z.string().regex(/^#[0-9A-F]{6}$/i),
    active: z.boolean(),
    sort_order: z.number().min(0).max(999),
    description: z.string().optional()
  })).min(1).max(50),
  company_id: z.string().uuid()
})

const updateEnumSchema = enumSchema.partial().extend({
  id: z.string().uuid()
})

// GET /api/enums - List all enums for user's companies
export const GET: RequestHandler = async ({ locals, url }) => {
  const { consoleUser, authManager } = locals

  if (!consoleUser) {
    throw error(401, 'Unauthorized')
  }

  // Check permissions
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
    // Get query parameters
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 100)
    const search = url.searchParams.get('search') || ''
    const category = url.searchParams.get('category') || ''
    const offset = (page - 1) * limit

    // Build query
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

    // Apply company filter based on user role
    if (consoleUser.role === 'super_admin') {
      // Super admins can see all enums
    } else {
      // Other roles can only see enums for their companies
      query = query.in('company_id', consoleUser.company_ids)
    }

    // Apply search filter
    if (search) {
      query = query.or(`
        metadata->>display_name.ilike.%${search}%,
        category.ilike.%${search}%
      `)
    }

    // Apply category filter
    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    // Apply pagination
    query = query
      .order('updated_at', { ascending: false })
      .range(offset, offset + limit - 1)

    const { data: enums, error: enumError, count } = await query

    if (enumError) {
      console.error('Error fetching enums:', enumError)
      throw error(500, 'Failed to fetch enums')
    }

    // Get total count for pagination
    const { count: totalCount } = await supabase
      .from('configurable_enums')
      .select('*', { count: 'exact', head: true })
      .in('company_id', consoleUser.role === 'super_admin' ? [] : consoleUser.company_ids)

    return json({
      success: true,
      data: enums,
      metadata: {
        page,
        limit,
        total: totalCount || 0,
        has_more: (offset + limit) < (totalCount || 0)
      }
    })

  } catch (err) {
    console.error('API Error:', err)
    throw error(500, 'Internal server error')
  }
}

// POST /api/enums - Create new enum
export const POST: RequestHandler = async ({ locals, request, getClientAddress }) => {
  const { consoleUser, authManager } = locals

  if (!consoleUser) {
    throw error(401, 'Unauthorized')
  }

  // Check permissions
  const hasPermission = await authManager.validatePermission(
    consoleUser.id,
    'enums',
    'create'
  )

  if (!hasPermission) {
    throw error(403, 'Insufficient permissions')
  }

  const supabase = createSupabaseAdminClient()

  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = enumSchema.parse(body)

    // Check if enum category already exists for this company
    const { data: existingEnum } = await supabase
      .from('configurable_enums')
      .select('id')
      .eq('company_id', validatedData.company_id)
      .eq('category', validatedData.category)
      .single()

    if (existingEnum) {
      throw error(400, 'Enum category already exists for this company')
    }

    // Create enum
    const { data: newEnum, error: createError } = await supabase
      .from('configurable_enums')
      .insert({
        category: validatedData.category,
        values: validatedData.values,
        metadata: {
          display_name: validatedData.display_name,
          description: validatedData.description,
          is_system: false,
          is_required: true,
          allow_custom_colors: true
        },
        company_id: validatedData.company_id,
        created_by: consoleUser.id,
        updated_by: consoleUser.id,
        version: 1
      })
      .select()
      .single()

    if (createError) {
      console.error('Error creating enum:', createError)
      throw error(500, 'Failed to create enum')
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
        category: validatedData.category,
        display_name: validatedData.display_name,
        value_count: validatedData.values.length
      },
      timestamp: new Date().toISOString(),
      company_id: validatedData.company_id
    })

    return json({
      success: true,
      data: newEnum,
      message: 'Enum created successfully'
    })

  } catch (err) {
    if (err instanceof z.ZodError) {
      throw error(400, `Validation error: ${err.errors.map(e => e.message).join(', ')}`)
    }
    
    console.error('API Error:', err)
    throw error(500, 'Internal server error')
  }
}