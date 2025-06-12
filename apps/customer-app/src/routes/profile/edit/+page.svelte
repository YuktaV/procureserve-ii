<script lang="ts">
	import Card from '$lib/components/ui/card.svelte'
	import CardHeader from '$lib/components/ui/card-header.svelte'
	import CardTitle from '$lib/components/ui/card-title.svelte'
	import CardContent from '$lib/components/ui/card-content.svelte'
	import Button from '$lib/components/ui/button.svelte'
	import Input from '$lib/components/ui/input.svelte'
	import Label from '$lib/components/ui/label.svelte'
	import { User, Phone, Building2, Shield, Save, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-svelte'
	import { goto } from '$app/navigation'
	
	export let data
	
	let loading = false
	let message = ''
	let messageType: 'success' | 'error' = 'success'
	
	// Initialize form with current profile data
	let profileData = {
		firstName: data.candidate.first_name || '',
		lastName: data.candidate.last_name || '',
		phone: data.candidate.phone || '',
		workAuthorization: data.candidate.work_authorization || '',
		visaValidUntil: data.candidate.visa_valid_until || '',
		representingAgency: data.candidate.representing_agency || '',
		linkedInUrl: data.candidate.linkedin_url || '',
		preferredLocation: data.candidate.preferred_location || '',
		availabilityDate: data.candidate.availability_date || ''
	}
	
	// Work authorization options
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
	$: formValid = profileData.firstName && profileData.lastName && profileData.phone && 
		profileData.workAuthorization && (!needsVisaDate || profileData.visaValidUntil)
	
	async function saveProfile() {
		if (!formValid) return
		
		loading = true
		message = ''
		
		try {
			const response = await fetch('/api/profile/update', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(profileData)
			})
			
			const result = await response.json()
			
			if (response.ok) {
				messageType = 'success'
				message = 'Profile updated successfully!'
				setTimeout(() => {
					goto('/dashboard')
				}, 2000)
			} else {
				messageType = 'error'
				message = result.error || 'Failed to update profile'
			}
		} catch (error) {
			messageType = 'error'
			message = 'Network error. Please try again.'
		} finally {
			loading = false
		}
	}
	
	function goBack() {
		goto('/dashboard')
	}
</script>

<div class="min-h-screen bg-gray-50 py-12 px-4">
	<div class="max-w-2xl mx-auto">
		<!-- Header -->
		<div class="mb-8">
			<Button variant="ghost" on:click={goBack} class="mb-4">
				<ArrowLeft class="w-4 h-4 mr-2" />
				Back to Dashboard
			</Button>
			<h1 class="text-3xl font-bold text-gray-900">Edit Profile</h1>
			<p class="mt-2 text-gray-600">Update your information and preferences</p>
		</div>

		<Card>
			<CardHeader>
				<CardTitle class="flex items-center gap-2">
					<User class="w-5 h-5" />
					Profile Information
				</CardTitle>
			</CardHeader>
			<CardContent>
				<form on:submit|preventDefault={saveProfile} class="space-y-6">
					<!-- Basic Information -->
					<div class="space-y-4">
						<h3 class="text-lg font-medium text-gray-900">Basic Information</h3>
						
						<div class="grid grid-cols-2 gap-4">
							<div>
								<Label for="firstName">First Name *</Label>
								<Input
									id="firstName"
									bind:value={profileData.firstName}
									placeholder="John"
									required
								/>
							</div>
							<div>
								<Label for="lastName">Last Name *</Label>
								<Input
									id="lastName"
									bind:value={profileData.lastName}
									placeholder="Smith"
									required
								/>
							</div>
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
					</div>

					<!-- Work Authorization -->
					<div class="space-y-4">
						<h3 class="text-lg font-medium text-gray-900 flex items-center gap-2">
							<Shield class="w-5 h-5" />
							Work Authorization
						</h3>

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
					</div>

					<!-- Optional Information -->
					<div class="space-y-4">
						<h3 class="text-lg font-medium text-gray-900">Additional Information</h3>

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
					</div>

					{#if message}
						<div class="p-4 rounded-lg {messageType === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}">
							<div class="flex items-center gap-2">
								{#if messageType === 'success'}
									<CheckCircle class="w-4 h-4" />
								{:else}
									<AlertCircle class="w-4 h-4" />
								{/if}
								{message}
							</div>
						</div>
					{/if}

					<div class="flex justify-between pt-6">
						<Button variant="outline" type="button" on:click={goBack}>
							Cancel
						</Button>
						<Button type="submit" disabled={!formValid || loading}>
							{#if loading}
								Saving...
							{:else}
								<Save class="w-4 h-4 mr-2" />
								Save Changes
							{/if}
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	</div>
</div>
