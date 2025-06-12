export const load = async ({ locals, depends }) => {
  depends('supabase:auth')

  return {
    session: locals.session,
    user: locals.user
  }
}
