export const load = async ({ locals, depends }) => {
  depends('supabase:auth')

  let userProfile = null
  
  // If user is authenticated, get their profile and process permissions
  if (locals.session?.user) {
    const { data } = await locals.supabase
      .from('users')
      .select('process_permissions, current_process, role')
      .eq('id', locals.session.user.id)
      .single()
    
    userProfile = data
  }

  return {
    session: locals.session,
    user: locals.user,
    userProfile
  }
}
