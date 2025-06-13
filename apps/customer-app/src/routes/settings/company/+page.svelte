<script lang="ts">
	import { enhance } from '$app/forms'
	import { goto } from '$app/navigation'
	import Card from '$lib/components/ui/card.svelte'
	import CardContent from '$lib/components/ui/card-content.svelte'
	import Button from '$lib/components/ui/button.svelte'
	import { ArrowLeft, Building2, Clock, Globe } from 'lucide-svelte'
	import CompanyProfileForm from './CompanyProfileForm.svelte'
	import BusinessHoursForm from './BusinessHoursForm.svelte'
	import TimezoneSelector from './TimezoneSelector.svelte'

	export let data
	export let form

	let activeTab = 'profile'
	
	const tabs = [
		{ id: 'profile', label: 'Company Profile', icon: Building2 },
		{ id: 'hours', label: 'Business Hours', icon: Clock },
		{ id: 'localization', label: 'Timezone & Locale', icon: Globe }
	]

	function goBack() {
		goto('/settings')
	}
</script>

<div class="min-h-screen bg-gray-50 py-12 px-4">
	<div class="max-w-4xl mx-auto">
		<!-- Header -->
		<div class="mb-8">
			<Button variant="ghost" on:click={goBack} class="mb-4">
				<ArrowLeft class="w-4 h-4 mr-2" />
				Back to Settings
			</Button>
			<div class="flex items-center gap-3 mb-4">
				<Building2 class="w-8 h-8 text-primary" />
				<h1 class="text-3xl font-bold text-gray-900">Company Settings</h1>
			</div>
			<p class="text-gray-600">
				Configure your company profile, business hours, and localization settings
			</p>
		</div>

		<!-- Permission Check -->
		{#if !data.canEdit}
			<Card class="mb-6">
				<CardContent class="p-6">
					<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
						<p class="text-yellow-800">
							<strong>View Only:</strong> You can view company settings but need admin permissions to make changes.
						</p>
					</div>
				</CardContent>
			</Card>
		{/if}

		<!-- Success/Error Messages -->
		{#if form?.success}
			<Card class="mb-6">
				<CardContent class="p-6">
					<div class="bg-green-50 border border-green-200 rounded-lg p-4">
						<p class="text-green-800">{form.message}</p>
					</div>
				</CardContent>
			</Card>
		{:else if form?.success === false}
			<Card class="mb-6">
				<CardContent class="p-6">
					<div class="bg-red-50 border border-red-200 rounded-lg p-4">
						<p class="text-red-800">{form.message}</p>
					</div>
				</CardContent>
			</Card>
		{/if}

		<!-- Tab Navigation -->
		<Card class="mb-6">
			<CardContent class="p-0">
				<div class="border-b border-gray-200">
					<nav class="flex space-x-8 px-6">
						{#each tabs as tab}
							<button
								class="py-4 px-1 border-b-2 font-medium text-sm transition-colors {
									activeTab === tab.id
										? 'border-primary text-primary'
										: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
								}"
								on:click={() => activeTab = tab.id}
							>
								<div class="flex items-center gap-2">
									<svelte:component this={tab.icon} class="w-4 h-4" />
									{tab.label}
								</div>
							</button>
						{/each}
					</nav>
				</div>
			</CardContent>
		</Card>

		<!-- Tab Content -->
		{#if activeTab === 'profile'}
			<CompanyProfileForm 
				company={data.company} 
				canEdit={data.canEdit}
			/>
		{:else if activeTab === 'hours'}
			<BusinessHoursForm 
				businessHours={data.company.business_hours} 
				canEdit={data.canEdit}
			/>
		{:else if activeTab === 'localization'}
			<TimezoneSelector 
				timezone={data.company.timezone}
				locale={data.company.locale}
				canEdit={data.canEdit}
			/>
		{/if}
	</div>
</div>
