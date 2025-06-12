<script lang="ts">
	import { Shield, Mail, ArrowLeft } from 'lucide-svelte'
	import { goto } from '$app/navigation'
	
	function goBack() {
		goto('/dashboard')
	}
	
	function contactSupport() {
		window.location.href = 'mailto:support@procureserve.com?subject=Access Request&body=I need access to ProcureServe processes. Please help me get the appropriate permissions.'
	}
</script>

<svelte:head>
	<title>Access Denied - ProcureServe</title>
	<meta name="description" content="You don't have permission to access this area" />
</svelte:head>

<div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
	<div class="max-w-md w-full">
		<!-- Access Denied Card -->
		<div class="bg-white rounded-lg shadow-sm border p-8 text-center">
			<!-- Icon -->
			<div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
				<Shield class="w-8 h-8 text-red-600" />
			</div>
			
			<!-- Title and Message -->
			<h1 class="text-2xl font-semibold text-gray-900 mb-4">Access Denied</h1>
			<p class="text-gray-600 mb-6">
				You don't have permission to access any processes in ProcureServe. 
				Please contact your administrator or support team to request access.
			</p>
			
			<!-- Actions -->
			<div class="space-y-3">
				<button 
					on:click={contactSupport}
					class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2">
					<Mail class="w-4 h-4" />
					Contact Support
				</button>
				
				<button 
					on:click={goBack}
					class="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2">
					<ArrowLeft class="w-4 h-4" />
					Go Back
				</button>
			</div>
		</div>
		
		<!-- Help Information -->
		<div class="mt-6 text-center">
			<p class="text-sm text-gray-500 mb-2">
				Need help? Contact your system administrator or:
			</p>
			<div class="space-y-1 text-sm">
				<p>
					<a href="mailto:support@procureserve.com" class="text-blue-600 hover:text-blue-700">
						support@procureserve.com
					</a>
				</p>
				<p>
					<a href="tel:+1-555-SUPPORT" class="text-blue-600 hover:text-blue-700">
						+1-555-SUPPORT
					</a>
				</p>
			</div>
		</div>
	</div>
</div>
