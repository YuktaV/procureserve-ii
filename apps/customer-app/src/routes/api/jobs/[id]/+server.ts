import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { z } from 'zod'

// Validation schema for job updates
const updateJobSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(10).max(10000).optional(),
  employment_type: z.string().min(1).max(50).optional(),
  experience_level: z.string().min(1).max(50).optional(),
  department: z.string().optional(),
  reports_to: z.string().optional(),
  start_date: z.string().optional(),
  application_deadline: z.string().optional(),
  status: z.string().optional(),
  requirements: z.object({
    skills_required: z.array(z.string()).optional(),
    skills_preferred: z.array(z.string()).optional(),
    education: z.string().optional(),
    experience_years: z.number().min(0).max(50).optional(),
    certifications: z.array(z.string()).optional(),
    languages: z.array(z.string()).optional()
  }).optional()
})

// GET /api/jobs/[id] - Get single job with all related data
export const GET: RequestHandler = async ({ params, locals }) => {
  try {
    const { data: { session } } = await locals.supabase.auth.getSession()
    
    if (!session) {
      return json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: user } = await locals.supabase
      .from('users')
      .select('company_id, role')
      .eq('id', session.user.id)
      .single()

    if (!user?.company_id) {
      return json({ error: 'User not associated with company' }, { status: 403 })
    }

    // Fetch job with all related data (RLS enforced)
    const { data: job, error } = await locals.supabase
      .from('jobs')
      .select(`
        *,
        job_locations(*),
        job_compensation(*),
        job_custom_fields(*),
        created_by_user:users!jobs_created_by_fkey(id, profile)
      `)
      .eq('id', params.id)
      .eq('company_id', user.company_id)
      .single()

    if (error || !job) {
      return json({ error: 'Job not found' }, { status: 404 })
    }

    return json({ data: job })

  } catch (error) {
    console.error('GET /api/jobs/[id] error:', error)
    return json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/jobs/[id] - Update job
export const PUT: RequestHandler = async ({ params, request, locals }) => {
  try {
    const { data: { session } } = await locals.supabase.auth.getSession()
    
    if (!session) {
      return json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: user } = await locals.supabase
      .from('users')
      .select('company_id, role')
      .eq('id', session.user.id)
      .single()

    if (!user?.company_id) {
      return json({ error: 'User not associated with company' }, { status: 403 })
    }

    // Check user permissions
    if (!['admin', 'recruiter', 'manager'].includes(user.role)) {
      return json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = updateJobSchema.parse(body)

    // Update job (RLS enforced)
    const { data: job, error } = await locals.supabase
      .from('jobs')
      .update({
        ...validatedData,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .eq('company_id', user.company_id)
      .select()
      .single()

    if (error || !job) {
      return json({ error: 'Job not found or update failed' }, { status: 404 })
    }

    return json({ data: job, message: 'Job updated successfully' })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return json({ error: 'Validation failed', details: error.errors }, { status: 400 })
    }
    
    console.error('PUT /api/jobs/[id] error:', error)
    return json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/jobs/[id] - Soft delete job
export const DELETE: RequestHandler = async ({ params, locals }) => {
  try {
    const { data: { session } } = await locals.supabase.auth.getSession()
    
    if (!session) {
      return json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: user } = await locals.supabase
      .from('users')
      .select('company_id, role')
      .eq('id', session.user.id)
      .single()

    if (!user?.company_id) {
      return json({ error: 'User not associated with company' }, { status: 403 })
    }

    // Check user permissions (only admin/manager can delete)
    if (!['admin', 'manager'].includes(user.role)) {
      return json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Soft delete by setting status to 'archived'
    const { data: job, error } = await locals.supabase
      .from('jobs')
      .update({ 
        status: 'archived',
        closed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .eq('company_id', user.company_id)
      .select()
      .single()

    if (error || !job) {
      return json({ error: 'Job not found or deletion failed' }, { status: 404 })
    }

    return json({ message: 'Job archived successfully' })

  } catch (error) {
    console.error('DELETE /api/jobs/[id] error:', error)
    return json({ error: 'Internal server error' }, { status: 500 })
  }
}
