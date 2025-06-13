import type { PageServerLoad } from './$types'

export const load = (async ({ locals }) => {
  return {
    consoleUser: locals.consoleUser
  }
}) satisfies PageServerLoad