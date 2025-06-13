<script lang="ts">
	import { enhance } from '$app/forms'
	import Card from '$lib/components/ui/card.svelte'
	import CardContent from '$lib/components/ui/card-content.svelte'
	import Button from '$lib/components/ui/button.svelte'
	import { Save } from 'lucide-svelte'

	export let company: any
	export let canEdit: boolean

	const industryOptions = [
		'Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Retail',
		'Education', 'Government', 'Non-profit', 'Real Estate', 'Other'
	]

	const companySizeOptions = [
		'1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'
	]

	let loading = false
</script>

<Card>
	<CardContent class="p-6">
		<h2 class="text-xl font-semibold mb-6">Company Profile</h2>
		
		<form 
			method="POST" 
			action="?/updateCompany"
			use:enhance={() => {
				loading = true
				return async ({ update }) => {
					loading = false
					await update()
				}
			}}
		>
			<div class="grid gap-6 md:grid-cols-2">
				<!-- Company Name -->
				<div>
					<label for="name" class="block text-sm font-medium text-gray-700 mb-2">
						Company Name *
					</label>
					<input
						type="text"
						id="name"
						name="name"
						value={company.name}
						disabled={!canEdit}
						required
						class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary disabled:bg-gray-50 disabled:text-gray-500"
					/>
				</div>

				<!-- Domain -->
				<div>
					<label for="domain" class="block text-sm font-medium text-gray-700 mb-2">
						Company Domain *
					</label>
					<input
						type="text"
						id="domain"
						name="domain"
						value={company.domain}
						disabled={!canEdit}
						required
						placeholder="example.com"
						class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary disabled:bg-gray-50 disabled:text-gray-500"
					/>
				</div>

				<!-- Industry -->
				<div>
					<label for="industry" class="block text-sm font-medium text-gray-700 mb-2">
						Industry
					</label>
					<select
						id="industry"
						name="industry"
						disabled={!canEdit}
						class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary disabled:bg-gray-50 disabled:text-gray-500"
					>
						<option value="">Select industry...</option>
						{#each industryOptions as industry}
							<option value={industry} selected={company.industry === industry}>
								{industry}
							</option>
						{/each}
					</select>
				</div>

				<!-- Company Size -->
				<div>
					<label for="company_size" class="block text-sm font-medium text-gray-700 mb-2">
						Company Size
					</label>
					<select
						id="company_size"
						name="company_size"
						disabled={!canEdit}
						class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary disabled:bg-gray-50 disabled:text-gray-500"
					>
						<option value="">Select size...</option>
						{#each companySizeOptions as size}
							<option value={size} selected={company.company_size === size}>
								{size} employees
							</option>
						{/each}
					</select>
				</div>
			</div>

			<!-- Description -->
			<div class="mt-6">
				<label for="description" class="block text-sm font-medium text-gray-700 mb-2">
					Company Description
				</label>
				<textarea
					id="description"
					name="description"
					rows="4"
					disabled={!canEdit}
					value={company.description || ''}
					placeholder="Brief description of your company..."
					class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary disabled:bg-gray-50 disabled:text-gray-500"
				></textarea>
			</div>

			{#if canEdit}
				<div class="mt-6 flex justify-end">
					<Button type="submit" disabled={loading}>
						<Save class="w-4 h-4 mr-2" />
						{loading ? 'Saving...' : 'Save Changes'}
					</Button>
				</div>
			{/if}
		</form>
	</CardContent>
</Card>
