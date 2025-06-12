import type { PageLoad } from './$types'
import type { EnhancedJob } from '../../../../../packages/shared-types'

export const load: PageLoad = async ({ params, fetch }) => {
  try {
    const response = await fetch(`/api/jobs/${params.id}`)
    const result = await response.json()
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch job')
    }

    return {
      job: result.data as EnhancedJob
    }
  } catch (error) {
    console.error('Error loading job for edit:', error)
    return {
      job: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
