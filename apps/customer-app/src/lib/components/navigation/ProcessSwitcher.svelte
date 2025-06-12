<script lang="ts">
	import { Search, Users, ChevronDown, RotateCcw } from 'lucide-svelte'
	import { onMount } from 'svelte'
	import { goto } from '$app/navigation'
	
	export let currentProcess: string = ''
	export let availableProcesses: string[] = []
	
	let isOpen = false
	let canSwitchProcess = availableProcesses.length > 1
	
	const processConfig = {
		recruitment: {
			name: 'Recruitment',
			icon: Search,
			color: 'text-blue-600 bg-blue-50',
			path: '/recruitment/dashboard'
		},
		bench_sales: {
			name: 'Bench Sales', 
			icon: Users,
			color: 'text-green-600 bg-green-50',
			path: '/bench-sales/dashboard'
		}
	}
	
	async function switchProcess(newProcess: string) {
		if (newProcess === currentProcess) return
		
		try {
			const response = await fetch('/api/set-process', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ process: newProcess })
			})
			
			if (response.ok) {
				goto(processConfig[newProcess].path)
			}
		} catch (error) {
			console.error('Failed to switch process:', error)
		}
		
		isOpen = false
	}
	
	function toggleDropdown() {
		isOpen = !isOpen
	}
	
	onMount(() => {
		function handleClickOutside(event) {
			if (!event.target.closest('.process-switcher')) {
				isOpen = false
			}
		}
		document.addEventListener('click', handleClickOutside)
		return () => document.removeEventListener('click', handleClickOutside)
	})
	
	$: currentConfig = processConfig[currentProcess]
</script>

{#if canSwitchProcess && currentConfig}
	<div class="relative process-switcher">
		<button
			on:click={toggleDropdown}
			class="flex items-center gap-2 px-3 py-2 rounded-lg {currentConfig.color} hover:opacity-80 transition-opacity"
		>
			<svelte:component this={currentConfig.icon} class="w-4 h-4" />
			<span class="text-sm font-medium">{currentConfig.name}</span>
			<ChevronDown class="w-4 h-4" />
		</button>
		
		{#if isOpen}
			<div class="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border z-50">
				<div class="p-2">
					{#each availableProcesses as process}
						{@const config = processConfig[process]}
						<button
							on:click={() => switchProcess(process)}
							class="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors
								{process === currentProcess ? 'bg-gray-100' : ''}"
						>
							<svelte:component this={config.icon} class="w-4 h-4 {config.color.split(' ')[0]}" />
							<span class="text-sm font-medium text-gray-700">{config.name}</span>
							{#if process === currentProcess}
								<div class="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
							{/if}
						</button>
					{/each}
				</div>
			</div>
		{/if}
	</div>
{/if}
