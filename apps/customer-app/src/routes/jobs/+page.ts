import type { PageLoad } from './$types'
import type { EnhancedJob, JobSearchFilters } from '../../../packages/shared-types'

export const load: PageLoad = async ({ url, fetch }) => {
  // Extract search parameters
  const page = parseInt(url.searchParams.get('page') || '1')
  const limit = parseInt(url.searchParams.get('limit') || '20')
  const status = url.searchParams.get('status')
  const location_type = url.searchParams.get('location_type')
  
  // Build query string
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  })
  
  if (status) params.set('status', status)
  if (location_type) params.set('location_type', location_type)

  try {
    const response = await fetch(`/api/jobs?${params}`)
    const result = await response.json()
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch jobs')
    }

    return {
      jobs: result.data as EnhancedJob[],
      pagination: result.pagination,
      filters: {
        page,
        limit,
        status,
        location_type
      } as JobSearchFilters
    }
  } catch (error) {
    console.error('Error loading jobs:', error)
    return {
      jobs: [],
      pagination: { page: 1, limit: 20, total: 0, has_more: false },
      filters: { page, limit, status, location_type },
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
