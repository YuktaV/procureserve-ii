<script lang="ts">
	import Card from '$lib/components/ui/card.svelte'
	import CardHeader from '$lib/components/ui/card-header.svelte'
	import CardTitle from '$lib/components/ui/card-title.svelte'
	import CardContent from '$lib/components/ui/card-content.svelte'
	import Button from '$lib/components/ui/button.svelte'
	import Input from '$lib/components/ui/input.svelte'
	import Label from '$lib/components/ui/label.svelte'
	import { 
		ArrowLeft, Download, Trash2, AlertTriangle, 
		Check, FileText, Shield, Info 
	} from 'lucide-svelte'
	import { goto } from '$app/navigation'
	import { enhance } from '$app/forms'
	
	export let data
	export let form
	
	let loading = false
	let showDeleteForm = false
	let confirmationText = ''
	let deletionReason = ''
	
	$: canDelete = confirmationText === 'DELETE'
	
	function toggleDeleteForm() {
		showDeleteForm = !showDeleteForm
		if (!showDeleteForm) {
			confirmationText = ''
			deletionReason = ''
		}
	}
	
	function downloadExportData() {
		if (form?.exportData) {
			const blob = new Blob([form.exportData], { type: 'application/json' })
			const url = URL.createObjectURL(blob)
			const a = document.createElement('a')
			a.href = url
			a.download = `procureserve-data-export-${new Date().toISOString().split('T')[0]}.json`
			document.body.appendChild(a)
			a.click()
			document.body.removeChild(a)
			URL.revokeObjectURL(url)
		}
	}
	
	// Auto-download data if export was successful
	$: if (form?.success && form?.exportData) {
		downloadExportData()
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
			<div class="flex items-center gap-3 mb-2">
				<Shield class="w-8 h-8 text-primary" />
				<h1 class="text-3xl font-bold text-gray-900">Account Management</h1>
			</div>
			<p class="text-gray-600">
				Export your data and manage account deletion (GDPR compliance)
			</p>
		</div>

		{#if form?.error}
			<div class="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
				<div class="flex items-center gap-2">
					<AlertTriangle class="w-5 h-5 text-red-600" />
					<p class="text-red-800">{form.error}</p>
				</div>
			</div>
		{/if}

		{#if form?.success}
			<div class="mb-6 p-4 rounded-lg bg-green-50 border border-green-200">
				<div class="flex items-center gap-2">
					<Check class="w-5 h-5 text-green-600" />
					<p class="text-green-800">Data exported successfully! Download should start automatically.</p>
				</div>
			</div>
		{/if}

		{#if form?.deletionRequested}
			<div class="mb-6 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
				<div class="flex items-center gap-2">
					<Info class="w-5 h-5 text-yellow-600" />
					<p class="text-yellow-800">{form.message}</p>
				</div>
			</div>
		{/if}

		<div class="space-y-6">
			<!-- Data Export -->
			<Card>
				<CardHeader>
					<CardTitle class="flex items-center gap-2">
						<Download class="w-5 h-5" />
						Data Export (GDPR Compliance)
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div class="space-y-4">
						<div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
							<div class="flex items-start gap-3">
								<FileText class="w-5 h-5 text-blue-600 mt-0.5" />
								<div>
									<h3 class="font-medium text-blue-900">Your Data Rights</h3>
									<p class="text-sm text-blue-800 mt-1">
										Under GDPR and other privacy laws, you have the right to obtain a copy of your personal data. 
										This export includes all information we have about you.
									</p>
								</div>
							</div>
						</div>

						<div class="border rounded-lg p-4">
							<h4 class="font-medium mb-3">What's included in your export:</h4>
							<ul class="text-sm text-gray-600 space-y-1">
								<li>• Account information (email, registration date)</li>
								<li>• Profile data (name, contact details, work authorization)</li>
								<li>• Application history and submissions</li>
								<li>• Activity logs and preferences</li>
								<li>• All metadata associated with your account</li>
							</ul>
						</div>

						<form method="POST" action="?/exportData" use:enhance={() => {
							loading = true
							return async ({ result, update }) => {
								loading = false
								await update()
							}
						}}>
							<Button 
								type="submit" 
								disabled={loading}
								class="w-full sm:w-auto"
							>
								<Download class="w-4 h-4 mr-2" />
								{loading ? 'Preparing Export...' : 'Download My Data'}
							</Button>
						</form>

						<p class="text-xs text-gray-500">
							The export will be generated as a JSON file containing all your personal data. 
							This process may take a few moments for accounts with extensive history.
						</p>
					</div>
				</CardContent>
			</Card>

			<!-- Account Deletion -->
			<Card>
				<CardHeader>
					<CardTitle class="flex items-center gap-2 text-red-700">
						<Trash2 class="w-5 h-5" />
						Delete Account
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div class="space-y-4">
						<div class="bg-red-50 border border-red-200 rounded-lg p-4">
							<div class="flex items-start gap-3">
								<AlertTriangle class="w-5 h-5 text-red-600 mt-0.5" />
								<div>
									<h3 class="font-medium text-red-900">Permanent Account Deletion</h3>
									<p class="text-sm text-red-800 mt-1">
										This action cannot be undone. All your data will be permanently deleted, including:
									</p>
									<ul class="text-sm text-red-800 mt-2 ml-4 list-disc">
										<li>Profile information and contact details</li>
										<li>Application history and submissions</li>
										<li>Account preferences and settings</li>
										<li>All associated metadata</li>
									</ul>
								</div>
							</div>
						</div>

						{#if !showDeleteForm}
							<div class="flex flex-col sm:flex-row gap-3">
								<Button 
									variant="outline" 
									on:click={() => goto('/settings/account#export')}
									class="border-blue-200 text-blue-600 hover:bg-blue-50"
								>
									<Download class="w-4 h-4 mr-2" />
									Export Data First
								</Button>
								<Button 
									variant="destructive" 
									on:click={toggleDeleteForm}
								>
									<Trash2 class="w-4 h-4 mr-2" />
									Delete My Account
								</Button>
							</div>
						{:else}
							<form method="POST" action="?/requestDeletion" use:enhance={() => {
								loading = true
								return async ({ result, update }) => {
									loading = false
									if (result.type === 'success') {
										showDeleteForm = false
										confirmationText = ''
										deletionReason = ''
									}
									await update()
								}
							}}>
								<div class="space-y-4 border-t pt-4">
									<div>
										<Label for="reason">Reason for deletion (optional)</Label>
										<Input
											id="reason"
											name="reason"
											bind:value={deletionReason}
											placeholder="Help us improve by sharing why you're leaving"
										/>
									</div>

									<div>
										<Label for="confirmation">Type "DELETE" to confirm *</Label>
										<Input
											id="confirmation"
											name="confirmation"
											bind:value={confirmationText}
											placeholder="Type DELETE in capital letters"
											required
										/>
										<p class="text-xs text-gray-600 mt-1">
											This confirms you understand that deletion is permanent and irreversible.
										</p>
									</div>

									<div class="flex flex-col sm:flex-row gap-3">
										<Button 
											type="button" 
											variant="outline" 
											on:click={toggleDeleteForm}
											disabled={loading}
										>
											Cancel
										</Button>
										<Button 
											type="submit" 
											variant="destructive"
											disabled={loading || !canDelete}
										>
											<Trash2 class="w-4 h-4 mr-2" />
											{loading ? 'Processing...' : 'Confirm Deletion'}
										</Button>
									</div>
								</div>
							</form>
						{/if}

						<div class="text-xs text-gray-500 border-t pt-4">
							<p class="font-medium mb-2">Important Information:</p>
							<ul class="space-y-1">
								<li>• Account deletion requests are processed within 30 days</li>
								<li>• You will receive email confirmation of your deletion request</li>
								<li>• Some data may be retained for legal compliance purposes</li>
								<li>• Deletion cannot be reversed once the grace period expires</li>
							</ul>
						</div>
					</div>
				</CardContent>
			</Card>

			<!-- Account Information -->
			<Card>
				<CardHeader>
					<CardTitle>Account Information</CardTitle>
				</CardHeader>
				<CardContent>
					<div class="grid gap-4 text-sm">
						<div class="flex justify-between">
							<span class="font-medium">Email:</span>
							<span class="text-gray-600">{data.user.email}</span>
						</div>
						<div class="flex justify-between">
							<span class="font-medium">Account Type:</span>
							<span class="text-gray-600 capitalize">{data.userType}</span>
						</div>
						<div class="flex justify-between">
							<span class="font-medium">Member Since:</span>
							<span class="text-gray-600">
								{new Date(data.user.created_at).toLocaleDateString()}
							</span>
						</div>
						{#if data.candidateProfile?.profile_completed_at}
							<div class="flex justify-between">
								<span class="font-medium">Profile Completed:</span>
								<span class="text-gray-600">
									{new Date(data.candidateProfile.profile_completed_at).toLocaleDateString()}
								</span>
							</div>
						{/if}
					</div>
				</CardContent>
			</Card>
		</div>
	</div>
</div>
