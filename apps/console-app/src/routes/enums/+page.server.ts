import type { PageServerLoad } from './$types'

export const load = (async ({ locals }) => {
  const { consoleUser, authManager } = locals

  if (!consoleUser) {
    throw new Error('Unauthorized')
  }

  // Check enum management permissions
  const hasEnumPermission = await authManager.validatePermission(
    consoleUser.id,
    'enums',
    'read'
  )

  if (!hasEnumPermission) {
    throw new Error('Insufficient permissions')
  }

  // In a real implementation, fetch enums from database
  // const { data: enums, error } = await supabase
  //   .from('configurable_enums')
  //   .select('*')
  //   .eq('company_id', consoleUser.company_ids[0])

  return {
    consoleUser,
    enums: [] // Placeholder for now
  }
}) satisfies PageServerLoad