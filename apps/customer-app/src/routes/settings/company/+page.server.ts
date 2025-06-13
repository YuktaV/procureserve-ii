import { error, redirect } from '@sveltejs/kit'
import type { PageServerLoad, Actions } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
	const { data: { session } } = await locals.supabase.auth.getSession()
	if (!session) {
		throw redirect(303, '/login')
	}

	// Get user and company data
	const { data: user } = await locals.supabase
		.from('users')
		.select(`
			*,
			companies (*)
		`)
		.eq('id', session.user.id)
		.single()
	
	if (!user || !user.companies) {
		throw error(404, 'Company not found')
	}

	// Check if user has admin/manager permissions for company settings
	if (!['admin', 'manager'].includes(user.role)) {
		throw error(403, 'Insufficient permissions to access company settings')
	}

	return {
		company: user.companies,
		user,
		canEdit: user.role === 'admin' // Only admins can edit company settings
	}
}

export const actions: Actions = {
	updateCompany: async ({ request, locals }) => {
		const { data: { session } } = await locals.supabase.auth.getSession()
		if (!session) {
			throw error(401, 'Unauthorized')
		}

		const formData = await request.formData()
		const updates = {
			name: formData.get('name') as string,
			domain: formData.get('domain') as string,
			industry: formData.get('industry') as string,
			company_size: formData.get('company_size') as string,
			description: formData.get('description') as string,
			timezone: formData.get('timezone') as string,
			locale: formData.get('locale') as string,
		}

		// Validate required fields
		if (!updates.name || !updates.domain) {
			return { success: false, message: 'Company name and domain are required' }
		}

		// Get user's company ID
		const { data: user } = await locals.supabase
			.from('users')
			.select('company_id')
			.eq('id', session.user.id)
			.single()

		if (!user) {
			return { success: false, message: 'User not found' }
		}

		const { error: updateError } = await locals.supabase
			.from('companies')
			.update(updates)
			.eq('id', user.company_id)

		if (updateError) {
			console.error('Company update error:', updateError)
			return { success: false, message: 'Failed to update company settings' }
		}

		return { success: true, message: 'Company settings updated successfully' }
	},

	updateBusinessHours: async ({ request, locals }) => {
		const { data: { session } } = await locals.supabase.auth.getSession()
		if (!session) {
			throw error(401, 'Unauthorized')
		}

		const formData = await request.formData()
		const businessHours = JSON.parse(formData.get('businessHours') as string)

		// Get user's company ID
		const { data: user } = await locals.supabase
			.from('users')
			.select('company_id')
			.eq('id', session.user.id)
			.single()

		if (!user) {
			return { success: false, message: 'User not found' }
		}

		const { error: updateError } = await locals.supabase
			.from('companies')
			.update({ business_hours: businessHours })
			.eq('id', user.company_id)

		if (updateError) {
			console.error('Business hours update error:', updateError)
			return { success: false, message: 'Failed to update business hours' }
		}

		return { success: true, message: 'Business hours updated successfully' }
	}
}
