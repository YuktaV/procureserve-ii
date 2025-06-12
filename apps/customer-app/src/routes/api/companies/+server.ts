import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { z } from 'zod'

// Validation schema for company status updates
const updateStatusSchema = z.object({
  company_id: z.string().uuid(),
  review_status: z.enum(['submitted', 'under_review', 'approved', 'rejected', 'suspended']),
  review_notes: z.string().optional()
})

// POST /api/companies/review - Update company registration status (Admin only)
export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    const { data: { session } } = await locals.supabase.auth.getSession()
    
    if (!session) {
      return json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's role - only admins can update company status
    const { data: user } = await locals.supabase
      .from('users')
      .select('role, company_id')
      .eq('id', session.user.id)
      .single()

    if (!user || user.role !== 'admin') {
      return json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const body = await request.json()
    const validatedData = updateStatusSchema.parse(body)

    // Create company review record
    const { data: review, error: reviewError } = await locals.supabase
      .from('company_reviews')
      .insert({
        company_id: validatedData.company_id,
        reviewed_by: session.user.id,
        review_status: validatedData.review_status,
        review_notes: validatedData.review_notes
      })
      .select()
      .single()

    if (reviewError) {
      console.error('Error creating company review:', reviewError)
      return json({ error: 'Failed to update company status' }, { status: 500 })
    }

    return json({ 
      data: review, 
      message: 'Company status updated successfully' 
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return json({ 
        error: 'Validation failed', 
        details: error.errors 
      }, { status: 400 })
    }
    
    console.error('POST /api/companies/review error:', error)
    return json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET /api/companies/status - Get current user's company status
export const GET: RequestHandler = async ({ locals }) => {
  try {
    const { data: { session } } = await locals.supabase.auth.getSession()
    
    if (!session) {
      return json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's company with latest review
    const { data: user, error: userError } = await locals.supabase
      .from('users')
      .select(`
        company_id,
        companies!inner (
          id,
          name,
          registration_status,
          created_at,
          submitted_at,
          reviewed_at,
          rejection_reason
        )
      `)
      .eq('id', session.user.id)
      .single()

    if (userError || !user) {
      return json({ error: 'Company not found' }, { status: 404 })
    }

    // Get latest review
    const { data: latestReview } = await locals.supabase
      .from('company_reviews')
      .select('*')
      .eq('company_id', user.company_id)
      .order('reviewed_at', { ascending: false })
      .limit(1)
      .single()

    return json({
      data: {
        company: user.companies,
        latest_review: latestReview
      }
    })

  } catch (error) {
    console.error('GET /api/companies/status error:', error)
    return json({ error: 'Internal server error' }, { status: 500 })
  }
}
