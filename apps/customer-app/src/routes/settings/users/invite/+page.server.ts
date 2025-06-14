        .from('user_invitations')
        .select('id')
        .eq('email', email)
        .eq('company_id', locals.user.company_id)
        .is('accepted_at', null)
        .gt('expires_at', new Date().toISOString())
        .single()

      if (existingInvitation) {
        return fail(400, { error: 'Pending invitation already exists for this email', email, role })
      }

      // Create invitation
      const { data: invitation, error: inviteError } = await supabase
        .from('user_invitations')
        .insert({
          company_id: locals.user.company_id,
          email,
          role,
          process_permissions: processPermissions,
          business_unit_id: businessUnitId,
          invited_by: locals.user.id
        })
        .select()
        .single()

      if (inviteError) throw inviteError

      // Log the invitation action
      await supabase
        .from('company_audit_logs')
        .insert({
          company_id: locals.user.company_id,
          performed_by: locals.user.id,
          action_type: 'user_invited',
          new_values: {
            email,
            role,
            process_permissions: processPermissions,
            business_unit_id: businessUnitId
          }
        })

      // TODO: Send invitation email via Supabase Edge Function
      // For now, we'll handle this in the UI with a success message

      throw redirect(302, '/settings/users?invited=true')

    } catch (err) {
      console.error('Error creating invitation:', err)
      return fail(500, { error: 'Failed to send invitation', email, role })
    }
  }
}
