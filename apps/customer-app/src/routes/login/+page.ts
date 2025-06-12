import type { PageLoad } from './$types'

export const load: PageLoad = async ({ url }) => {
	const message = url.searchParams.get('message')
	return {
		message
	}
}
