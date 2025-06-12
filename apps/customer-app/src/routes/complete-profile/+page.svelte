<script lang="ts">
	import Card from '$lib/components/ui/card.svelte'
	import CardHeader from '$lib/components/ui/card-header.svelte'
	import CardTitle from '$lib/components/ui/card-title.svelte'
	import CardDescription from '$lib/components/ui/card-description.svelte'
	import CardContent from '$lib/components/ui/card-content.svelte'
	import Button from '$lib/components/ui/button.svelte'
	import Input from '$lib/components/ui/input.svelte'
	import Label from '$lib/components/ui/label.svelte'
	import { User, Phone, Building2, Shield, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-svelte'
	import { goto } from '$app/navigation'
	
	let currentStep = 1
	let loading = false
	let message = ''
	
	// Profile completion data
	let profileData = {
		phone: '',
		workAuthorization: '',
		visaValidUntil: '',
		representingAgency: '',
		linkedInUrl: '',
		preferredLocation: '',
		availabilityDate: ''
	}
	
	// Work authorization options (will eventually come from configurable enums)
	const workAuthOptions = [
		{ value: 'us_citizen', label: 'US Citizen' },
		{ value: 'green_card', label: 'Green Card Holder' },
		{ value: 'h1b', label: 'H1B Visa' },
		{ value: 'l1', label: 'L1 Visa' },
		{ value: 'opt', label: 'OPT' },
		{ value: 'cpt', label: 'CPT' },
		{ value: 'tn', label: 'TN Visa' },
		{ value: 'other', label: 'Other' }
	]
	
	$: needsVisaDate = ['h1b', 'l1', 'opt', 'cpt', 'tn', 'other'].includes(profileData.workAuthorization)
	$: step1Valid = profileData.phone && profileData.workAuthorization && 
		(!needsVisaDate || profileData.visaValidUntil)
	$: step2Valid = true // Optional fields, so always valid
	
	function nextStep() {
		if (currentStep < 3) {
			currentStep++
		}
	}
	
	function prevStep() {
		if (currentStep > 1) {
			currentStep--
		}
	}
	
	async function completeProfile() {
		loading = true
		
		try {
			const response = await fetch('/api/profile/complete', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(profileData)
			})
			
			if (response.ok) {
				message = 'Profile completed successfully! Redirecting to dashboard...'
				setTimeout(() => {
					goto('/dashboard')
				}, 2000)
			} else {
				message = 'Failed to update profile. Please try again.'
			}
		} catch (error) {
			message = 'Network error. Please try again.'
		} finally {
			loading = false
		}
	}
	
	function skipForNow() {
		goto('/dashboard')
	}
</script>

<div class="min-h-screen bg-gray-50 py-12 px-4">
	<div class="max-w-2xl mx-auto">
		<!-- Progress Indicator -->
		<div class="mb-8">
			<div class="flex items-center justify-center mb-4">
				<div class="flex items-center space-x-4">
					<div class="flex items-center">
						<div class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
							1
						</div>
						<span class="ml-2 text-sm font-medium text-gray-900">Work Info</span>
					</div>
					<div class="w-12 h-px bg-gray-300"></div>
					<div class="flex items-center">
						<div class="w-8 h-8 rounded-full {currentStep >= 2 ? 'bg-primary text-white' : 'bg-gray-300 text-gray-600'} flex items-center justify-center text-sm font-medium">
							2
						</div>
						<span class="ml-2 text-sm font-medium {currentStep >= 2 ? 'text-gray-900' : 'text-gray-500'}">Optional Info</span>
					</div>
					<div class="w-12 h-px bg-gray-300"></div>
					<div class="flex items-center">
						<div class="w-8 h-8 rounded-full {currentStep >= 3 ? 'bg-primary text-white' : 'bg-gray-300 text-gray-600'} flex items-center justify-center text-sm font-medium">
							3
						</div>
						<span class="ml-2 text-sm font-medium {currentStep >= 3 ? 'text-gray-900' : 'text-gray-500'}">Complete</span>
					</div>
				</div>
			</div>
			<div class="text-center">
				<h1 class="text-3xl font-bold text-gray-900">Complete Your Profile</h1>
				<p class="mt-2 text-gray-600">Help us match you with the right opportunities</p>
			</div>
		</div>

		<Card>
			<CardContent class="p-8">
				{#if currentStep === 1}
					<!-- Step 1: Work Authorization & Contact -->
					<div class="space-y-6">
						<div class="text-center mb-6">
							<Shield class="w-12 h-12 text-primary mx-auto mb-2" />
							<h2 class="text-xl font-semibold">Work Authorization & Contact</h2>
							<p class="text-gray-600">Required information for job matching</p>
						</div>

						<div>
							<Label for="phone">Phone Number *</Label>
							<div class="relative">
								<Phone class="w-4 h-4 absolute left-3 top-3 text-gray-400" />
								<Input
									id="phone"
									type="tel"
									bind:value={profileData.phone}
									placeholder="+1 (555) 123-4567"
									class="pl-10"
									required
								/>
							</div>
						</div>

						<div>
							<Label for="workAuth">Work Authorization Status *</Label>
							<select
								id="workAuth"
								bind:value={profileData.workAuthorization}
								class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
								required
							>
								<option value="">Select your work authorization</option>
								{#each workAuthOptions as option}
									<option value={option.value}>{option.label}</option>
								{/each}
							</select>
						</div>

						{#if needsVisaDate}
							<div>
								<Label for="visaValid">Visa Valid Until *</Label>
								<Input
									id="visaValid"
									type="date"
									bind:value={profileData.visaValidUntil}
									required
								/>
								<p class="text-xs text-gray-600 mt-1">
									This helps us ensure compliance and remind you of renewal dates
								</p>
							</div>
						{/if}

						<div class="flex justify-end">
							<Button on:click={nextStep} disabled={!step1Valid}>
								Continue
								<ArrowRight class="w-4 h-4 ml-2" />
							</Button>
						</div>
					</div>

				{:else if currentStep === 2}
					<!-- Step 2: Optional Information -->
					<div class="space-y-6">
						<div class="text-center mb-6">
							<User class="w-12 h-12 text-primary mx-auto mb-2" />
							<h2 class="text-xl font-semibold">Additional Information</h2>
							<p class="text-gray-600">Optional details to enhance your profile</p>
						</div>

						<div>
							<Label for="agency">Representing Agency (Optional)</Label>
							<div class="relative">
								<Building2 class="w-4 h-4 absolute left-3 top-3 text-gray-400" />
								<Input
									id="agency"
									bind:value={profileData.representingAgency}
									placeholder="Leave blank if self-representing"
									class="pl-10"
								/>
							</div>
							<p class="text-xs text-gray-600 mt-1">
								If you're working with a staffing agency, enter their name
							</p>
						</div>

						<div>
							<Label for="linkedin">LinkedIn Profile URL</Label>
							<Input
								id="linkedin"
								type="url"
								bind:value={profileData.linkedInUrl}
								placeholder="https://linkedin.com/in/yourprofile"
							/>
						</div>

						<div>
							<Label for="location">Preferred Work Location</Label>
							<Input
								id="location"
								bind:value={profileData.preferredLocation}
								placeholder="e.g., New York, NY or Remote"
							/>
						</div>

						<div>
							<Label for="availability">Available Starting</Label>
							<Input
								id="availability"
								type="date"
								bind:value={profileData.availabilityDate}
							/>
						</div>

						<div class="flex justify-between">
							<Button variant="outline" on:click={prevStep}>
								<ArrowLeft class="w-4 h-4 mr-2" />
								Back
							</Button>
							<Button on:click={nextStep}>
								Review
								<ArrowRight class="w-4 h-4 ml-2" />
							</Button>
						</div>
					</div>
				{:else}
					<!-- Step 3: Review & Complete -->
					<div class="space-y-6">
						<div class="text-center mb-6">
							<CheckCircle class="w-12 h-12 text-primary mx-auto mb-2" />
							<h2 class="text-xl font-semibold">Review Your Information</h2>
							<p class="text-gray-600">Confirm your details before completing</p>
						</div>

						<div class="bg-gray-50 rounded-lg p-6 space-y-4">
							<div>
								<h3 class="font-medium text-gray-900">Contact Information</h3>
								<p class="text-sm text-gray-600">Phone: {profileData.phone || 'Not provided'}</p>
							</div>
							
							<div>
								<h3 class="font-medium text-gray-900">Work Authorization</h3>
								<p class="text-sm text-gray-600">
									Status: {workAuthOptions.find(opt => opt.value === profileData.workAuthorization)?.label || 'Not selected'}
								</p>
								{#if profileData.visaValidUntil}
									<p class="text-sm text-gray-600">Valid until: {profileData.visaValidUntil}</p>
								{/if}
							</div>
							
							{#if profileData.representingAgency || profileData.linkedInUrl || profileData.preferredLocation || profileData.availabilityDate}
								<div>
									<h3 class="font-medium text-gray-900">Additional Information</h3>
									{#if profileData.representingAgency}
										<p class="text-sm text-gray-600">Agency: {profileData.representingAgency}</p>
									{/if}
									{#if profileData.linkedInUrl}
										<p class="text-sm text-gray-600">LinkedIn: {profileData.linkedInUrl}</p>
									{/if}
									{#if profileData.preferredLocation}
										<p class="text-sm text-gray-600">Location: {profileData.preferredLocation}</p>
									{/if}
									{#if profileData.availabilityDate}
										<p class="text-sm text-gray-600">Available: {profileData.availabilityDate}</p>
									{/if}
								</div>
							{/if}
						</div>

						{#if message}
							<div class="p-4 rounded-lg bg-green-50 text-green-800">
								<div class="flex items-center gap-2">
									<CheckCircle class="w-4 h-4" />
									{message}
								</div>
							</div>
						{/if}

						<div class="flex justify-between">
							<Button variant="outline" on:click={prevStep}>
								<ArrowLeft class="w-4 h-4 mr-2" />
								Back
							</Button>
							<div class="space-x-2">
								<Button variant="ghost" on:click={skipForNow}>
									Skip for now
								</Button>
								<Button on:click={completeProfile} disabled={loading}>
									{loading ? 'Saving...' : 'Complete Profile'}
								</Button>
							</div>
						</div>
					</div>
				{/if}
			</CardContent>
		</Card>
	</div>
</div>
