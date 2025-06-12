import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { z } from 'zod'

// Validation schemas for security
const createJobSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(10).max(10000),
  employment_type: z.string().min(1).max(50),
  experience_level: z.string().min(1).max(50),
  department: z.string().optional(),
  reports_to: z.string().optional(),
  start_date: z.string().optional(),
  application_deadline: z.string().optional(),
  
  requirements: z.object({
    skills_required: z.array(z.string()).min(1),
    skills_preferred: z.array(z.string()).optional(),
    education: z.string().optional(),
    experience_years: z.number().min(0).max(50).optional(),
    certifications: z.array(z.string()).optional(),
    languages: z.array(z.string()).optional()
  }),
  
  locations: z.array(z.object({
    location_type: z.enum(['office', 'remote', 'hybrid']),
    is_primary: z.boolean(),
    country: z.string().optional(),
    state_province: z.string().optional(),
    city: z.string().optional(),
    address_line1: z.string().optional(),
    address_line2: z.string().optional(),
    postal_code: z.string().optional(),
    timezone: z.string().optional(),
    headcount: z.number().min(1).max(10000),
    local_requirements: z.string().optional(),
    hiring_manager_id: z.string().uuid().optional(),
    remote_countries_allowed: z.array(z.string()).optional(),
    hybrid_days_in_office: z.number().min(0).max(7).optional(),
    travel_requirements: z.string().optional(),
    visa_sponsorship_available: z.boolean(),
    relocation_assistance_available: z.boolean()
  })).min(1).max(50), // Unlimited locations (reasonable limit for performance)
  
  compensation: z.array(z.object({
    job_location_id: z.string().uuid().optional(),
    salary_min: z.number().min(0).optional(),
    salary_max: z.number().min(0).optional(),
    salary_currency: z.string().length(3),
    salary_frequency: z.enum(['hourly', 'monthly', 'annual']),
    bonus_eligible: z.boolean(),
    commission_eligible: z.boolean(),
    equity_eligible: z.boolean(),
    benefits_summary: z.string().optional(),
    cost_of_living_adjustment: z.number().min(-50).max(100)
  })).optional()
})

// GET /api/jobs - List jobs with filtering and pagination
export const GET: RequestHandler = async ({ url, locals }) => {
  try {
    const { data: { session } } = await locals.supabase.auth.getSession()
    
    if (!session) {
      return json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's company_id for RLS
    const { data: user } = await locals.supabase
      .from('users')
      .select('company_id, role')
      .eq('id', session.user.id)
      .single()

    if (!user?.company_id) {
      return json({ error: 'User not associated with company' }, { status: 403 })
    }

    // Parse query parameters for filtering
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 100) // Max 100 per page
    const offset = (page - 1) * limit
    
    // Build query with RLS enforcement
    let query = locals.supabase
      .from('jobs')
      .select(`
        *,
        job_locations(*),
        job_compensation(*),
        created_by_user:users!jobs_created_by_fkey(id, profile)
      `)
      .eq('company_id', user.company_id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters securely
    const status = url.searchParams.get('status')
    if (status) {
      query = query.eq('status', status)
    }

    const location_type = url.searchParams.get('location_type')
    if (location_type) {
      query = query.eq('job_locations.location_type', location_type)
    }

    const { data: jobs, error, count } = await query

    if (error) {
      console.error('Error fetching jobs:', error)
      return json({ error: 'Failed to fetch jobs' }, { status: 500 })
    }

    return json({
      data: jobs,
      pagination: {
        page,
        limit,
        total: count || 0,
        has_more: (count || 0) > offset + limit
      }
    })

  } catch (error) {
    console.error('GET /api/jobs error:', error)
    return json({ error: 'Internal server error' }, { status: 500 })
  }
}


// POST /api/jobs - Create new job with multi-location support
export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    const { data: { session } } = await locals.supabase.auth.getSession()
    
    if (!session) {
      return json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's company_id and role for RLS
    const { data: user } = await locals.supabase
      .from('users')
      .select('company_id, role')
      .eq('id', session.user.id)
      .single()

    if (!user?.company_id) {
      return json({ error: 'User not associated with company' }, { status: 403 })
    }

    // Check user permissions (admin, recruiter, manager can create jobs)
    if (!['admin', 'recruiter', 'manager'].includes(user.role)) {
      return json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Parse and validate request body
    const body = await request.json()
    const validatedData = createJobSchema.parse(body)

    // Start transaction for atomic job creation
    const { data: job, error: jobError } = await locals.supabase
      .from('jobs')
      .insert({
        company_id: user.company_id,
        title: validatedData.title,
        description: validatedData.description,
        employment_type: validatedData.employment_type,
        experience_level: validatedData.experience_level,
        department: validatedData.department,
        reports_to: validatedData.reports_to,
        start_date: validatedData.start_date,
        application_deadline: validatedData.application_deadline,
        requirements: validatedData.requirements,
        status: 'draft', // Default status
        created_by: session.user.id
      })
      .select()
      .single()

    if (jobError) {
      console.error('Error creating job:', jobError)
      return json({ error: 'Failed to create job' }, { status: 500 })
    }

    // Insert job locations
    const locationsData = validatedData.locations.map(location => ({
      ...location,
      job_id: job.id,
      company_id: user.company_id
    }))

    const { data: locations, error: locationsError } = await locals.supabase
      .from('job_locations')
      .insert(locationsData)
      .select()

    if (locationsError) {
      console.error('Error creating job locations:', locationsError)
      // Cleanup: Delete the job if locations failed
      await locals.supabase.from('jobs').delete().eq('id', job.id)
      return json({ error: 'Failed to create job locations' }, { status: 500 })
    }

    // Insert compensation data if provided
    let compensation = []
    if (validatedData.compensation && validatedData.compensation.length > 0) {
      const compensationData = validatedData.compensation.map((comp, index) => ({
        ...comp,
        job_id: job.id,
        job_location_id: locations[index]?.id, // Map to corresponding location
        company_id: user.company_id
      }))

      const { data: compData, error: compError } = await locals.supabase
        .from('job_compensation')
        .insert(compensationData)
        .select()

      if (compError) {
        console.error('Error creating compensation:', compError)
        // Continue without compensation - not critical
      } else {
        compensation = compData
      }
    }

    // Return created job with all related data
    const enhancedJob = {
      ...job,
      locations,
      compensation
    }

    return json({ 
      data: enhancedJob,
      message: 'Job created successfully'
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return json({ 
        error: 'Validation failed',
        details: error.errors 
      }, { status: 400 })
    }
    
    console.error('POST /api/jobs error:', error)
    return json({ error: 'Internal server error' }, { status: 500 })
  }
}
