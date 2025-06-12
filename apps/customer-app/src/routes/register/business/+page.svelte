<script lang="ts">
	import Card from '$lib/components/ui/card.svelte'
	import CardContent from '$lib/components/ui/card-content.svelte'
	import Button from '$lib/components/ui/button.svelte'
	import { ArrowLeft } from 'lucide-svelte'
	import { goto } from '$app/navigation'
	import { enhance } from '$app/forms'
	
	// Step Components
	import CompanyInfoStep from '$lib/components/registration/CompanyInfoStep.svelte'
	import AddressStep from '$lib/components/registration/AddressStep.svelte'
	import ContactStep from '$lib/components/registration/ContactStep.svelte'
	import SettingsStep from '$lib/components/registration/SettingsStep.svelte'
	
	export let data
	export let form
	
	let loading = false
	let currentStep = 1
	const totalSteps = 4
	
	// Form data
	let formData = {
		company_name: form?.formData?.company_name || '',
		legal_entity_type: form?.formData?.legal_entity_type || '',
		tax_id: form?.formData?.tax_id || '',
		business_type: form?.formData?.business_type || 'staffing_agency',
		estimated_annual_volume: form?.formData?.estimated_annual_volume || '',
		street_address: form?.formData?.street_address || '',
		city: form?.formData?.city || '',
		state: form?.formData?.state || '',
		zip_code: form?.formData?.zip_code || '',
		first_name: form?.formData?.first_name || '',
		last_name: form?.formData?.last_name || '',
		email: form?.formData?.email || '',
		phone: form?.formData?.phone || '',
		title: form?.formData?.title || '',
		password: '',
		confirm_password: '',
		recruitment_enabled: form?.formData?.recruitment_enabled !== 'false',
		bench_sales_enabled: form?.formData?.bench_sales_enabled !== 'false',
		time_zone: form?.formData?.time_zone || 'America/New_York',
		work_start: form?.formData?.work_start || '09:00',
		work_end: form?.formData?.work_end || '17:00'
	}
	
	// Validation
	$: step1Valid = formData.company_name && formData.legal_entity_type && 
		formData.tax_id && formData.business_type
	$: step2Valid = formData.street_address && formData.city && 
		formData.state && formData.zip_code
	$: step3Valid = formData.first_name && formData.last_name && 
		formData.email && formData.phone && formData.title && 
		formData.password && formData.confirm_password &&
		formData.password === formData.confirm_password
	$: step4Valid = (formData.recruitment_enabled || formData.bench_sales_enabled)
	
	$: canProceed = { 1: step1Valid, 2: step2Valid, 3: step3Valid, 4: step4Valid }
	
	function nextStep() {
		if (currentStep < totalSteps && canProceed[currentStep]) currentStep++
	}
	
	function prevStep() {
		if (currentStep > 1) currentStep--
	}
</script>

<div class="min-h-screen bg-gray-50 py-12 px-4">
	<div class="max-w-4xl mx-auto">
		<!-- Header -->
		<div class="mb-8">
			<Button variant="ghost" on:click={() => goto('/')} class="mb-4">
				<ArrowLeft class="w-4 h-4 mr-2" />
				Back to Home
			</Button>
			
			<!-- Progress -->
			<div class="mb-6">
				<div class="flex items-center justify-center mb-4">
					<div class="flex items-center space-x-4">
						{#each Array(totalSteps) as _, i}
							<div class="flex items-center">
								<div class="w-8 h-8 rounded-full {currentStep > i ? 'bg-primary text-white' : currentStep === i + 1 ? 'bg-primary text-white' : 'bg-gray-300 text-gray-600'} flex items-center justify-center text-sm font-medium">
									{i + 1}
								</div>
								{#if i < totalSteps - 1}
									<div class="w-12 h-px bg-gray-300 ml-4"></div>
								{/if}
							</div>
						{/each}
					</div>
				</div>
				<div class="text-center">
					<h1 class="text-3xl font-bold text-gray-900">Business Registration</h1>
					<p class="mt-2 text-gray-600">Join ProcureServe as a business partner</p>
				</div>
			</div>
		</div>

		{#if form?.error}
			<div class="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
				<p class="text-red-800">{form.error}</p>
			</div>
		{/if}

		<form method="POST" action="?/register" use:enhance={() => {
			loading = true
			return async ({ result, update }) => {
				loading = false
				await update()
			}
		}}>
			<Card>
				<CardContent class="p-8">
					{#if currentStep === 1}
						<CompanyInfoStep 
							bind:formData 
							canProceed={canProceed[1]} 
							onNext={nextStep} 
						/>
					{:else if currentStep === 2}
						<AddressStep 
							bind:formData 
							canProceed={canProceed[2]} 
							onNext={nextStep} 
							onPrev={prevStep} 
						/>
					{:else if currentStep === 3}
						<ContactStep 
							bind:formData 
							canProceed={canProceed[3]} 
							onNext={nextStep} 
							onPrev={prevStep} 
						/>
					{:else if currentStep === 4}
						<SettingsStep 
							bind:formData 
							canProceed={canProceed[4]} 
							onPrev={prevStep}
							{loading}
						/>
					{/if}
				</CardContent>
			</Card>
		</form>

		<div class="mt-8 text-center">
			<p class="text-sm text-gray-600">
				Need help with registration? 
				<a href="mailto:support@procureserve.com" class="text-primary hover:underline">Contact our support team</a>
			</p>
		</div>
	</div>
</div>
