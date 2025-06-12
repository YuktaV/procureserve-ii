<script lang="ts">
	import { CheckCircle, AlertCircle, Clock } from 'lucide-svelte'
	
	export let status: 'incomplete' | 'basic_complete' | 'full_complete'
	export let compact: boolean = false
	
	const statusConfig = {
		incomplete: {
			label: 'Profile Incomplete',
			icon: AlertCircle,
			class: 'text-red-600 bg-red-50 border-red-200'
		},
		basic_complete: {
			label: 'Basic Profile Complete',
			icon: Clock,
			class: 'text-yellow-600 bg-yellow-50 border-yellow-200'
		},
		full_complete: {
			label: 'Profile Complete',
			icon: CheckCircle,
			class: 'text-green-600 bg-green-50 border-green-200'
		}
	}
	
	$: config = statusConfig[status]
	$: IconComponent = config.icon
</script>

{#if compact}
	<div class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium {config.class}">
		<svelte:component this={IconComponent} class="w-3 h-3" />
		{config.label}
	</div>
{:else}
	<div class="flex items-center gap-2 p-3 rounded-lg border {config.class}">
		<svelte:component this={IconComponent} class="w-4 h-4" />
		<div class="font-medium">{config.label}</div>
	</div>
{/if}
