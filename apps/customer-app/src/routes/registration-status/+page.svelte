<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import type { PageData } from './$types'
	import { 
		CheckCircle, 
		Clock, 
		FileText, 
		AlertTriangle, 
		RefreshCw, 
		Mail, 
		Phone,
		Building
	} from 'lucide-svelte'

	export let data: PageData

	// Get status from the company data
	$: status = data.company?.registration_status || 'draft'

	// Status configuration for UI display
	const statusConfig = {
		draft: {
			icon: Building,
			color: 'gray',
			title: 'Registration Started',
			description: 'Complete your business registration to access ProcureServe'
		},
		submitted: {
			icon: Clock,
			color: 'blue',
			title: 'Under Review',
			description: 'Your registration is being reviewed by our team'
		},
		under_review: {
			icon: Clock,
			color: 'blue',
			title: 'Under Review',
			description: 'Your registration is being reviewed by our team'
		},
		approved: {
			icon: CheckCircle,
			color: 'green',
			title: 'Approved',
			description: 'Welcome to ProcureServe! Your account is fully activated'
		},
		rejected: {
			icon: AlertTriangle,
			color: 'red',
			title: 'Action Required',
			description: 'Please review and update your registration documents'
		},
		suspended: {
			icon: AlertTriangle,
			color: 'yellow',
			title: 'Suspended',
			description: 'Account access has been suspended'
		}
	}
	
	$: currentStatus = statusConfig[status] || statusConfig.draft
	
	function refreshPage() {
		window.location.reload()
	}

	function goToDashboard() {
		goto('/dashboard')
	}

	function goToDocuments() {
		if (data.company?.id) {
			goto(`/register/business/documents?company_id=${data.company.id}`)
		}
	}
</script>

<svelte:head>
	<title>Registration Status - ProcureServe</title>
	<meta name="description" content="Track your business registration progress" />
</svelte:head>

<div class="min-h-screen bg-gray-50 py-12 px-4">
	<div class="max-w-4xl mx-auto">
		<!-- Header -->
		<div class="mb-8 text-center">
			<h1 class="text-3xl font-bold text-gray-900">Registration Status</h1>
			<p class="mt-2 text-gray-600">Track your business registration progress</p>
		</div>

		<!-- Status Card -->
		<div class="bg-white rounded-lg shadow-sm border p-6 mb-8">
			<div class="flex items-center gap-4 mb-4">
				<div class="w-12 h-12 rounded-full bg-{currentStatus.color}-100 flex items-center justify-center">
					<svelte:component this={currentStatus.icon} class="w-6 h-6 text-{currentStatus.color}-600" />
				</div>
				<div>
					<h2 class="text-xl font-semibold">{data.company?.name || 'Your Company'}</h2>
					<p class="text-{currentStatus.color}-600 font-medium">{currentStatus.title}</p>
				</div>
			</div>
			
			<div class="space-y-4">
				<p class="text-gray-600">{currentStatus.description}</p>
				
				{#if status === 'submitted' || status === 'under_review'}
					<div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
						<h3 class="font-medium text-blue-900 mb-2">Review in Progress</h3>
						<p class="text-sm text-blue-800">
							Our team is reviewing your registration and documents. 
							You'll receive an email notification when the review is complete.
						</p>
						{#if data.company?.submitted_at}
							<p class="text-sm text-blue-700 mt-2">
								Submitted on: {new Date(data.company.submitted_at).toLocaleDateString()}
							</p>
						{/if}
					</div>
				{/if}
				
				{#if status === 'rejected' && data.company?.rejection_reason}
					<div class="bg-red-50 border border-red-200 rounded-lg p-4">
						<h3 class="font-medium text-red-900 mb-2">Action Required</h3>
						<p class="text-sm text-red-800 mb-3">{data.company.rejection_reason}</p>
						<button 
							on:click={goToDocuments}
							class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm">
							Update Documents
						</button>
					</div>
				{/if}
				
				{#if status === 'approved'}
					<div class="bg-green-50 border border-green-200 rounded-lg p-4">
						<h3 class="font-medium text-green-900 mb-2">Account Active</h3>
						<p class="text-sm text-green-800 mb-3">
							Your account is fully activated. You can now access all ProcureServe features.
						</p>
						<button 
							on:click={goToDashboard}
							class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm">
							Go to Dashboard
						</button>
					</div>
				{/if}
				
				{#if data.latestReview}
					<div class="border-t pt-4">
						<h3 class="font-medium text-gray-900 mb-2">Latest Review</h3>
						<div class="text-sm text-gray-600 space-y-1">
							<p>Reviewed on: {new Date(data.latestReview.reviewed_at).toLocaleDateString()}</p>
							<p>Status: <span class="capitalize">{data.latestReview.review_status}</span></p>
							{#if data.latestReview.review_notes}
								<p>Notes: {data.latestReview.review_notes}</p>
							{/if}
						</div>
					</div>
				{/if}
			</div>
		</div>

		<!-- Timeline -->
		<div class="bg-white rounded-lg shadow-sm border p-6 mb-8">
			<h3 class="text-lg font-semibold mb-4">Registration Timeline</h3>
			<div class="space-y-4">
				<!-- Registration Started -->
				<div class="flex items-center gap-4">
					<div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
						<CheckCircle class="w-4 h-4 text-green-600" />
					</div>
					<div>
						<p class="font-medium">Registration Started</p>
						<p class="text-sm text-gray-600">Company information and account created</p>
						{#if data.company?.created_at}
							<p class="text-xs text-gray-500">
								{new Date(data.company.created_at).toLocaleDateString()}
							</p>
						{/if}
					</div>
				</div>
				
				<!-- Documents Submitted -->
				<div class="flex items-center gap-4">
					<div class="w-8 h-8 rounded-full {status === 'draft' ? 'bg-gray-100' : 'bg-green-100'} flex items-center justify-center">
						<CheckCircle class="w-4 h-4 {status === 'draft' ? 'text-gray-400' : 'text-green-600'}" />
					</div>
					<div>
						<p class="font-medium">Documents Submitted</p>
						<p class="text-sm text-gray-600">Required business documents uploaded</p>
						{#if data.company?.submitted_at}
							<p class="text-xs text-gray-500">
								{new Date(data.company.submitted_at).toLocaleDateString()}
							</p>
						{/if}
					</div>
				</div>
				
				<!-- Under Review -->
				<div class="flex items-center gap-4">
					<div class="w-8 h-8 rounded-full {['submitted', 'under_review', 'approved', 'rejected'].includes(status) ? 'bg-blue-100' : 'bg-gray-100'} flex items-center justify-center">
						{#if ['submitted', 'under_review'].includes(status)}
							<Clock class="w-4 h-4 text-blue-600" />
						{:else if ['approved', 'rejected'].includes(status)}
							<CheckCircle class="w-4 h-4 text-green-600" />
						{:else}
							<Clock class="w-4 h-4 text-gray-400" />
						{/if}
					</div>
					<div>
						<p class="font-medium">Under Review</p>
						<p class="text-sm text-gray-600">ProcureServe staff reviewing your application</p>
						{#if ['submitted', 'under_review'].includes(status)}
							<p class="text-xs text-blue-600">In progress...</p>
						{/if}
					</div>
				</div>
				
				<!-- Approval -->
				<div class="flex items-center gap-4">
					<div class="w-8 h-8 rounded-full {status === 'approved' ? 'bg-green-100' : 'bg-gray-100'} flex items-center justify-center">
						<CheckCircle class="w-4 h-4 {status === 'approved' ? 'text-green-600' : 'text-gray-400'}" />
					</div>
					<div>
						<p class="font-medium">Account Activated</p>
						<p class="text-sm text-gray-600">Full access to ProcureServe platform</p>
						{#if data.company?.reviewed_at && status === 'approved'}
							<p class="text-xs text-gray-500">
								{new Date(data.company.reviewed_at).toLocaleDateString()}
							</p>
						{/if}
					</div>
				</div>
			</div>
		</div>

		<!-- Actions -->
		<div class="flex flex-col sm:flex-row gap-4 justify-center mb-8">
			<button 
				on:click={refreshPage}
				class="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
				<RefreshCw class="w-4 h-4" />
				Refresh Status
			</button>
			
			{#if status === 'rejected'}
				<button 
					on:click={goToDocuments}
					class="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
					<FileText class="w-4 h-4" />
					Update Registration
				</button>
			{/if}

			{#if status === 'approved'}
				<button 
					on:click={goToDashboard}
					class="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
					<Building class="w-4 h-4" />
					Go to Dashboard
				</button>
			{/if}
		</div>

		<!-- Contact Support -->
		<div class="bg-white rounded-lg shadow-sm border p-6">
			<h3 class="text-lg font-semibold mb-4">Need Help?</h3>
			<div class="space-y-4">
				<p class="text-gray-600">
					If you have questions about your registration or need assistance, 
					our support team is here to help.
				</p>
				<div class="flex flex-col sm:flex-row gap-4">
					<a 
						href="mailto:support@procureserve.com"
						class="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
						<Mail class="w-4 h-4" />
						Email Support
					</a>
					<a 
						href="tel:+1-555-SUPPORT"
						class="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
						<Phone class="w-4 h-4" />
						Call Support
					</a>
				</div>
			</div>
		</div>
	</div>
</div>
