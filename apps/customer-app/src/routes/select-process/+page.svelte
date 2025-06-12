<script lang="ts">
	import Card from '$lib/components/ui/card.svelte'
	import CardHeader from '$lib/components/ui/card-header.svelte'
	import CardTitle from '$lib/components/ui/card-title.svelte'
	import CardDescription from '$lib/components/ui/card-description.svelte'
	import CardContent from '$lib/components/ui/card-content.svelte'
	import Button from '$lib/components/ui/button.svelte'
	import { Search, Users, ArrowRight } from 'lucide-svelte'
	import { goto } from '$app/navigation'
	
	export let data
	
	async function selectProcess(process: 'recruitment' | 'bench_sales') {
		try {
			// Set process in backend session
			const response = await fetch('/api/set-process', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ process })
			})
			
			const result = await response.json()
			
			if (response.ok && result.success) {
				// Store process selection in session storage for quick access
				sessionStorage.setItem('selected_process', process)
				
				// Navigate to process-specific dashboard
				goto(`/${process}/dashboard`)
			} else {
				console.error('Failed to set process:', result.error)
				alert('Failed to set process. Please try again.')
			}
		} catch (error) {
			console.error('Error setting process:', error)
			alert('An error occurred. Please try again.')
		}
	}
</script>

<svelte:head>
	<title>Select Process - ProcureServe</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
	<div class="max-w-4xl w-full px-4">
		<div class="text-center mb-8">
			<h1 class="text-3xl font-bold text-gray-900 mb-4">Choose Your Process</h1>
			<p class="text-gray-600 max-w-2xl mx-auto">
				Your company supports both recruitment and bench sales operations. 
				Please select which process you'd like to work with today.
			</p>
		</div>
		
		<div class="grid md:grid-cols-2 gap-6">
			<!-- Recruitment Process -->
			<Card class="cursor-pointer hover:shadow-lg transition-shadow">
				<CardHeader class="text-center">
					<div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<Search class="w-8 h-8 text-blue-600" />
					</div>
					<CardTitle class="text-xl">Recruitment</CardTitle>
					<CardDescription>
						Find and place candidates for open positions
					</CardDescription>
				</CardHeader>
				<CardContent class="text-center">
					<div class="space-y-3 mb-6">
						<div class="flex items-center gap-3 text-sm text-gray-600">
							<div class="w-2 h-2 bg-blue-600 rounded-full"></div>
							<span>Manage job postings and requirements</span>
						</div>
						<div class="flex items-center gap-3 text-sm text-gray-600">
							<div class="w-2 h-2 bg-blue-600 rounded-full"></div>
							<span>Source and screen candidates</span>
						</div>
						<div class="flex items-center gap-3 text-sm text-gray-600">
							<div class="w-2 h-2 bg-blue-600 rounded-full"></div>
							<span>Submit candidates to clients</span>
						</div>
						<div class="flex items-center gap-3 text-sm text-gray-600">
							<div class="w-2 h-2 bg-blue-600 rounded-full"></div>
							<span>Track application progress</span>
						</div>
					</div>
					<Button 
						class="w-full" 
						on:click={() => selectProcess('recruitment')}
					>
						Continue with Recruitment
						<ArrowRight class="w-4 h-4 ml-2" />
					</Button>
				</CardContent>
			</Card>
			
			<!-- Bench Sales Process -->
			<Card class="cursor-pointer hover:shadow-lg transition-shadow">
				<CardHeader class="text-center">
					<div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<Users class="w-8 h-8 text-green-600" />
					</div>
					<CardTitle class="text-xl">Bench Sales</CardTitle>
					<CardDescription>
						Find next projects for available candidates
					</CardDescription>
				</CardHeader>
				<CardContent class="text-center">
					<div class="space-y-3 mb-6">
						<div class="flex items-center gap-3 text-sm text-gray-600">
							<div class="w-2 h-2 bg-green-600 rounded-full"></div>
							<span>Manage bench candidates</span>
						</div>
						<div class="flex items-center gap-3 text-sm text-gray-600">
							<div class="w-2 h-2 bg-green-600 rounded-full"></div>
							<span>Search for suitable opportunities</span>
						</div>
						<div class="flex items-center gap-3 text-sm text-gray-600">
							<div class="w-2 h-2 bg-green-600 rounded-full"></div>
							<span>Present candidates to potential clients</span>
						</div>
						<div class="flex items-center gap-3 text-sm text-gray-600">
							<div class="w-2 h-2 bg-green-600 rounded-full"></div>
							<span>Negotiate project terms</span>
						</div>
					</div>
					<Button 
						variant="outline" 
						class="w-full border-green-600 text-green-600 hover:bg-green-50" 
						on:click={() => selectProcess('bench_sales')}
					>
						Continue with Bench Sales
						<ArrowRight class="w-4 h-4 ml-2" />
					</Button>
				</CardContent>
			</Card>
		</div>
		
		<div class="text-center mt-8">
			<p class="text-sm text-gray-500">
				You can switch between processes anytime using the navigation menu.
			</p>
		</div>
	</div>
</div>

<style>
	/* Dynamic color classes for Tailwind */
	:global(.bg-blue-100) { background-color: rgb(219 234 254); }
	:global(.bg-green-100) { background-color: rgb(220 252 231); }
	:global(.text-blue-600) { color: rgb(37 99 235); }
	:global(.text-green-600) { color: rgb(22 163 74); }
	:global(.border-blue-300) { border-color: rgb(147 197 253); }
	:global(.border-green-300) { border-color: rgb(134 239 172); }
	:global(.border-blue-500) { border-color: rgb(59 130 246); }
	:global(.border-green-500) { border-color: rgb(34 197 94); }
	:global(.bg-blue-50) { background-color: rgb(239 246 255); }
	:global(.bg-green-50) { background-color: rgb(240 253 244); }
	:global(.bg-blue-600) { background-color: rgb(37 99 235); }
	:global(.hover\:bg-blue-700:hover) { background-color: rgb(29 78 216); }
	:global(.border-green-600) { border-color: rgb(22 163 74); }
	:global(.hover\:bg-green-50:hover) { background-color: rgb(240 253 244); }
</style>
