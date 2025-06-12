import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { z } from 'zod'

// Validation schema for process selection
const setProcessSchema = z.object({
  process: z.enum(['recruitment', 'bench_sales']),
  remember: z.boolean().optional().default(false)
})

// POST /api/set-process - Set user's current process
export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    const { data: { session } } = await locals.supabase.auth.getSession()
    
    if (!session) {
      return json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = setProcessSchema.parse(body)

    // Get user's current permissions
    const { data: user, error: userError } = await locals.supabase
      .from('users')
      .select('id, process_permissions, company_id')
      .eq('id', session.user.id)
      .single()

    if (userError || !user) {
      return json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user has permission for the requested process
    if (!user.process_permissions.includes(validatedData.process)) {
      return json({ 
        error: 'Access denied', 
        message: `You don't have access to ${validatedData.process}` 
      }, { status: 403 })
    }

    // Update user's current process
    const { error: updateError } = await locals.supabase
      .from('users')
      .update({ 
        current_process: validatedData.process,
        updated_at: new Date().toISOString()
      })
      .eq('id', session.user.id)

    if (updateError) {
      console.error('Error updating user process:', updateError)
      return json({ error: 'Failed to set process' }, { status: 500 })
    }

    // Log the process selection
    await locals.supabase
      .from('activity_logs')
      .insert({
        entity_type: 'user',
        entity_id: session.user.id,
        action: 'process_selected',
        changes: {
          process: validatedData.process,
          remember: validatedData.remember
        },
        user_id: session.user.id,
        company_id: user.company_id
      })

    return json({ 
      success: true,
      process: validatedData.process,
      redirect_to: `/dashboard/${validatedData.process}`
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return json({ 
        error: 'Invalid request', 
        details: error.errors 
      }, { status: 400 })
    }
    
    console.error('POST /api/set-process error:', error)
    return json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET /api/set-process - Get user's current process context
export const GET: RequestHandler = async ({ locals }) => {
  try {
    const { data: { session } } = await locals.supabase.auth.getSession()
    
    if (!session) {
      return json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's process information
    const { data: user, error: userError } = await locals.supabase
      .from('users')
      .select('process_permissions, current_process')
      .eq('id', session.user.id)
      .single()

    if (userError || !user) {
      return json({ error: 'User not found' }, { status: 404 })
    }

    const processContext = {
      current_process: user.current_process,
      available_processes: user.process_permissions || [],
      can_switch_process: (user.process_permissions || []).length > 1,
      switch_url: '/select-process'
    }

    return json({ data: processContext })

  } catch (error) {
    console.error('GET /api/set-process error:', error)
    return json({ error: 'Internal server error' }, { status: 500 })
  }
}
