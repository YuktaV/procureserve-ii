<script lang="ts">
	import { page } from '$app/stores'
	import { goto } from '$app/navigation'
	import { Search, Users, ChevronDown, ArrowLeftRight } from 'lucide-svelte'
	import type { ProcessType, ProcessContext } from '../../../../packages/shared-types'
	
	export let processContext: ProcessContext
	
	let isOpen = false
	let isLoading = false
	
	const processConfig = {
		recruitment: {
			name: 'Recruitment',
			icon: Search,
			color: 'blue',
			description: 'Job postings & candidate sourcing'
		},
		bench_sales: {
			name: 'Bench Sales', 
			icon: Users,
			color: 'green',
			description: 'Available candidate placement'
		}
	}
	
	function toggleDropdown() {
		isOpen = !isOpen
	}
	
	function closeDropdown() {
		isOpen = false
	}
	
	async function switchProcess(newProcess: ProcessType) {
		if (newProcess === processContext.current_process || isLoading) return
		
		isLoading = true
		closeDropdown()
		
		try {
			const response = await fetch('/api/set-process', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ process: newProcess })
			})
			
			const result = await response.json()
			
			if (response.ok) {
				// Redirect to the new process dashboard
				goto(result.redirect_to || `/dashboard/${newProcess}`)
			} else {
				console.error('Process switch failed:', result.error)
				alert(result.message || 'Failed to switch process')
			}
		} catch (error) {
			console.error('Process switch error:', error)
			alert('Network error. Please try again.')
		} finally {
			isLoading = false
		}
	}
	
	// Close dropdown when clicking outside
	function handleClickOutside(event: MouseEvent) {
		const target = event.target as Element
		if (!target.closest('.process-switcher')) {
			closeDropdown()
		}
	}
	
	$: currentConfig = processContext.current_process ? processConfig[processContext.current_process] : null
	$: showSwitcher = processContext.can_switch_process && processContext.available_processes.length > 1
</script>

<svelte:window on:click={handleClickOutside} />

{#if showSwitcher && currentConfig}
	<div class="process-switcher relative">
		<button 
			on:click={toggleDropdown}
			class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
			aria-haspopup="true"
			aria-expanded={isOpen}
			disabled={isLoading}>
			
			{#if isLoading}
				<div class="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
			{:else}
				<svelte:component this={currentConfig.icon} class="w-4 h-4 text-{currentConfig.color}-600" />
			{/if}
			
			<span>{currentConfig.name}</span>
			<ChevronDown class="w-4 h-4 text-gray-400 {isOpen ? 'transform rotate-180' : ''} transition-transform" />
		</button>
		
		{#if isOpen}
			<div class="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
				<div class="p-3 border-b border-gray-100">
					<div class="flex items-center gap-2 text-sm font-medium text-gray-900">
						<ArrowLeftRight class="w-4 h-4" />
						Switch Process
					</div>
					<p class="text-xs text-gray-500 mt-1">Choose which process to work with</p>
				</div>
				
				<div class="p-2">
					{#each processContext.available_processes as process}
						{@const config = processConfig[process]}
						<button
							on:click={() => switchProcess(process)}
							class="w-full flex items-start gap-3 p-3 text-left rounded-lg hover:bg-gray-50 transition-colors {process === processContext.current_process ? 'bg-' + config.color + '-50 ring-1 ring-' + config.color + '-200' : ''}"
							disabled={isLoading || process === processContext.current_process}>
							
							<div class="w-8 h-8 bg-{config.color}-100 rounded-lg flex items-center justify-center flex-shrink-0">
								<svelte:component this={config.icon} class="w-4 h-4 text-{config.color}-600" />
							</div>
							
							<div class="flex-1 min-w-0">
								<div class="flex items-center gap-2">
									<span class="font-medium text-gray-900">{config.name}</span>
									{#if process === processContext.current_process}
										<span class="bg-{config.color}-100 text-{config.color}-800 px-2 py-0.5 rounded-full text-xs font-medium">
											Current
										</span>
									{/if}
								</div>
								<p class="text-xs text-gray-500 mt-0.5">{config.description}</p>
							</div>
						</button>
					{/each}
				</div>
			</div>
		{/if}
	</div>
{/if}

<style>
	/* Ensure proper z-index for dropdown */
	:global(.process-switcher .absolute) {
		z-index: 50;
	}
</style>
