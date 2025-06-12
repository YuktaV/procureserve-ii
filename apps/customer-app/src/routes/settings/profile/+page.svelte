<script lang="ts">
	import Card from '$lib/components/ui/card.svelte'
	import CardHeader from '$lib/components/ui/card-header.svelte'
	import CardTitle from '$lib/components/ui/card-title.svelte'
	import CardContent from '$lib/components/ui/card-content.svelte'
	import Button from '$lib/components/ui/button.svelte'
	import Input from '$lib/components/ui/input.svelte'
	import Label from '$lib/components/ui/label.svelte'
	import { User, ArrowLeft, Save, Edit3, Phone, Mail, Shield, Calendar } from 'lucide-svelte'
	import { goto } from '$app/navigation'
	import { enhance } from '$app/forms'
	
	export let data
	export let form
	
	let loading = false
	let editMode = false
	
	// Form data
	let formData = {
		first_name: data.candidateProfile?.first_name || '',
		last_name: data.candidateProfile?.last_name || '',
		phone: data.candidateProfile?.phone || '',
		work_authorization: data.candidateProfile?.work_authorization || '',
		visa_valid_until: data.candidateProfile?.visa_valid_until || '',
		representing_agency: data.candidateProfile?.representing_agency || '',
		linkedin_url: data.candidateProfile?.linkedin_url || '',
		preferred_location: data.candidateProfile?.preferred_location || '',
		availability_date: data.candidateProfile?.availability_date || ''
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
	
	$: needsVisaDate = ['h1b', 'l1', 'opt', 'cpt', 'tn', 'other'].includes(formData.work_authorization)
	$: hasChanges = JSON.stringify(formData) !== JSON.stringify({
		first_name: data.candidateProfile?.first_name || '',
		last_name: data.candidateProfile?.last_name || '',
		phone: data.candidateProfile?.phone || '',
		work_authorization: data.candidateProfile?.work_authorization || '',
		visa_valid_until: data.candidateProfile?.visa_valid_until || '',
		representing_agency: data.candidateProfile?.representing_agency || '',
		linkedin_url: data.candidateProfile?.linkedin_url || '',
		preferred_location: data.candidateProfile?.preferred_location || '',
		availability_date: data.candidateProfile?.availability_date || ''
	})
	
	function toggleEditMode() {
		editMode = !editMode
		if (!editMode) {
			// Reset form data when canceling
			formData = {
				first_name: data.candidateProfile?.first_name || '',
				last_name: data.candidateProfile?.last_name || '',
				phone: data.candidateProfile?.phone || '',
				work_authorization: data.candidateProfile?.work_authorization || '',
				visa_valid_until: data.candidateProfile?.visa_valid_until || '',
				representing_agency: data.candidateProfile?.representing_agency || '',
				linkedin_url: data.candidateProfile?.linkedin_url || '',
				preferred_location: data.candidateProfile?.preferred_location || '',
				availability_date: data.candidateProfile?.availability_date || ''
			}
		}
	}
</script>

<div class="min-h-screen bg-gray-50 py-12 px-4">
	<div class="max-w-4xl mx-auto">
		<!-- Header -->
		<div class="mb-8">
			<Button variant="ghost" on:click={() => goto('/settings')} class="mb-4">
				<ArrowLeft class="w-4 h-4 mr-2" />
				Back to Settings
			</Button>
			<div class="flex items-center justify-between">
				<div>
					<div class="flex items-center gap-3 mb-2">
						<User class="w-8 h-8 text-primary" />
						<h1 class="text-3xl font-bold text-gray-900">Profile Settings</h1>
					</div>
					<p class="text-gray-600">
						Manage your personal information and work details
					</p>
				</div>
				<Button 
					variant={editMode ? 'outline' : 'default'}
					on:click={toggleEditMode}
				>
					<Edit3 class="w-4 h-4 mr-2" />
					{editMode ? 'Cancel' : 'Edit Profile'}
				</Button>
			</div>
		</div>

		{#if form?.error}
			<div class="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
				<p class="text-red-800">{form.error}</p>
			</div>
		{/if}

		{#if form?.success}
			<div class="mb-6 p-4 rounded-lg bg-green-50 border border-green-200">
				<p class="text-green-800">Profile updated successfully!</p>
			</div>
		{/if}

		<form method="POST" action="?/updateProfile" use:enhance={() => {
			loading = true
			return async ({ result, update }) => {
				loading = false
				if (result.type === 'success') {
					editMode = false
				}
				await update()
			}
		}}>
			<div class="space-y-6">
				<!-- Basic Information -->
				<Card>
					<CardHeader>
						<CardTitle class="flex items-center gap-2">
							<User class="w-5 h-5" />
							Basic Information
						</CardTitle>
					</CardHeader>
					<CardContent class="space-y-4">
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<Label for="first_name">First Name *</Label>
								{#if editMode}
									<Input
										id="first_name"
										name="first_name"
										bind:value={formData.first_name}
										required
									/>
								{:else}
									<div class="text-gray-900 font-medium">
										{data.candidateProfile?.first_name || 'Not provided'}
									</div>
								{/if}
							</div>
							<div>
								<Label for="last_name">Last Name *</Label>
								{#if editMode}
									<Input
										id="last_name"
										name="last_name"
										bind:value={formData.last_name}
										required
									/>
								{:else}
									<div class="text-gray-900 font-medium">
										{data.candidateProfile?.last_name || 'Not provided'}
									</div>
								{/if}
							</div>
						</div>

						<div>
							<Label for="email">Email Address</Label>
							<div class="flex items-center gap-2">
								<Mail class="w-4 h-4 text-gray-400" />
								<div class="text-gray-900 font-medium">
									{data.user.email}
								</div>
								<span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
									Verified
								</span>
							</div>
							<p class="text-xs text-gray-600 mt-1">
								To change your email, contact support
							</p>
						</div>

						<div>
							<Label for="phone">Phone Number *</Label>
							{#if editMode}
								<div class="relative">
									<Phone class="w-4 h-4 absolute left-3 top-3 text-gray-400" />
									<Input
										id="phone"
										name="phone"
										type="tel"
										bind:value={formData.phone}
										placeholder="+1 (555) 123-4567"
										class="pl-10"
										required
									/>
								</div>
							{:else}
								<div class="flex items-center gap-2">
									<Phone class="w-4 h-4 text-gray-400" />
									<div class="text-gray-900 font-medium">
										{data.candidateProfile?.phone || 'Not provided'}
									</div>
								</div>
							{/if}
						</div>
					</CardContent>
				</Card>

				<!-- Work Authorization -->
				<Card>
					<CardHeader>
						<CardTitle class="flex items-center gap-2">
							<Shield class="w-5 h-5" />
							Work Authorization
						</CardTitle>
					</CardHeader>
					<CardContent class="space-y-4">
						<div>
							<Label for="work_authorization">Work Authorization Status *</Label>
							{#if editMode}
								<select
									id="work_authorization"
									name="work_authorization"
									bind:value={formData.work_authorization}
									class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
									required
								>
									<option value="">Select your work authorization</option>
									{#each workAuthOptions as option}
										<option value={option.value}>{option.label}</option>
									{/each}
								</select>
							{:else}
								<div class="text-gray-900 font-medium">
									{workAuthOptions.find(opt => opt.value === data.candidateProfile?.work_authorization)?.label || 'Not provided'}
								</div>
							{/if}
						</div>

						{#if (editMode && needsVisaDate) || (!editMode && data.candidateProfile?.visa_valid_until)}
							<div>
								<Label for="visa_valid_until">Visa Valid Until *</Label>
								{#if editMode}
									<Input
										id="visa_valid_until"
										name="visa_valid_until"
										type="date"
										bind:value={formData.visa_valid_until}
										required={needsVisaDate}
									/>
								{:else}
									<div class="flex items-center gap-2">
										<Calendar class="w-4 h-4 text-gray-400" />
										<div class="text-gray-900 font-medium">
											{data.candidateProfile?.visa_valid_until || 'Not provided'}
										</div>
									</div>
								{/if}
							</div>
						{/if}
					</CardContent>
				</Card>

				<!-- Optional Information -->
				<Card>
					<CardHeader>
						<CardTitle>Additional Information</CardTitle>
					</CardHeader>
					<CardContent class="space-y-4">
						<div>
							<Label for="representing_agency">Representing Agency</Label>
							{#if editMode}
								<Input
									id="representing_agency"
									name="representing_agency"
									bind:value={formData.representing_agency}
									placeholder="Leave blank if self-representing"
								/>
							{:else}
								<div class="text-gray-900 font-medium">
									{data.candidateProfile?.representing_agency || 'Self-representing'}
								</div>
							{/if}
						</div>

						<div>
							<Label for="linkedin_url">LinkedIn Profile URL</Label>
							{#if editMode}
								<Input
									id="linkedin_url"
									name="linkedin_url"
									type="url"
									bind:value={formData.linkedin_url}
									placeholder="https://linkedin.com/in/yourprofile"
								/>
							{:else}
								<div class="text-gray-900 font-medium">
									{#if data.candidateProfile?.linkedin_url}
										<a href={data.candidateProfile.linkedin_url} target="_blank" class="text-blue-600 hover:underline">
											{data.candidateProfile.linkedin_url}
										</a>
									{:else}
										Not provided
									{/if}
								</div>
							{/if}
						</div>

						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<Label for="preferred_location">Preferred Work Location</Label>
								{#if editMode}
									<Input
										id="preferred_location"
										name="preferred_location"
										bind:value={formData.preferred_location}
										placeholder="e.g., New York, NY or Remote"
									/>
								{:else}
									<div class="text-gray-900 font-medium">
										{data.candidateProfile?.preferred_location || 'Not specified'}
									</div>
								{/if}
							</div>

							<div>
								<Label for="availability_date">Available Starting</Label>
								{#if editMode}
									<Input
										id="availability_date"
										name="availability_date"
										type="date"
										bind:value={formData.availability_date}
									/>
								{:else}
									<div class="flex items-center gap-2">
										<Calendar class="w-4 h-4 text-gray-400" />
										<div class="text-gray-900 font-medium">
											{data.candidateProfile?.availability_date || 'Immediately'}
										</div>
									</div>
								{/if}
							</div>
						</div>
					</CardContent>
				</Card>

				{#if editMode}
					<div class="flex items-center justify-end gap-3">
						<Button 
							type="button" 
							variant="outline" 
							on:click={toggleEditMode}
							disabled={loading}
						>
							Cancel
						</Button>
						<Button 
							type="submit" 
							disabled={loading || !hasChanges}
						>
							<Save class="w-4 h-4 mr-2" />
							{loading ? 'Saving...' : 'Save Changes'}
						</Button>
					</div>
				{/if}
			</div>
		</form>
	</div>
</div>
