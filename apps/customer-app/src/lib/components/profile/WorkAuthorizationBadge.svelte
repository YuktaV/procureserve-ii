<script lang="ts">
	import { Shield, AlertTriangle, CheckCircle } from 'lucide-svelte'
	
	export let workAuthorization: string
	export let visaValidUntil: string | null = null
	export let compact: boolean = false
	
	// Work authorization options mapping
	const workAuthLabels: Record<string, string> = {
		'us_citizen': 'US Citizen',
		'green_card': 'Green Card',
		'h1b': 'H1B Visa',
		'l1': 'L1 Visa',
		'opt': 'OPT',
		'cpt': 'CPT',
		'tn': 'TN Visa',
		'other': 'Other'
	}
	
	const workAuthColors: Record<string, string> = {
		'us_citizen': 'text-green-600 bg-green-50',
		'green_card': 'text-green-600 bg-green-50',
		'h1b': 'text-blue-600 bg-blue-50',
		'l1': 'text-blue-600 bg-blue-50',
		'opt': 'text-yellow-600 bg-yellow-50',
		'cpt': 'text-yellow-600 bg-yellow-50',
		'tn': 'text-purple-600 bg-purple-50',
		'other': 'text-gray-600 bg-gray-50'
	}
	
	$: label = workAuthLabels[workAuthorization] || workAuthorization
	$: colorClass = workAuthColors[workAuthorization] || 'text-gray-600 bg-gray-50'
	
	// Check if visa is expiring soon (within 60 days)
	$: isExpiring = visaValidUntil && 
		new Date(visaValidUntil) <= new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
	
	$: isExpired = visaValidUntil && new Date(visaValidUntil) <= new Date()
</script>

{#if compact}
	<div class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium {colorClass}">
		<Shield class="w-3 h-3" />
		{label}
		{#if isExpired}
			<AlertTriangle class="w-3 h-3 text-red-500" />
		{:else if isExpiring}
			<AlertTriangle class="w-3 h-3 text-yellow-500" />
		{/if}
	</div>
{:else}
	<div class="flex items-center gap-2 p-3 rounded-lg border {colorClass}">
		<Shield class="w-4 h-4" />
		<div class="flex-1">
			<div class="font-medium">{label}</div>
			{#if visaValidUntil}
				<div class="text-xs text-gray-600">
					Valid until: {new Date(visaValidUntil).toLocaleDateString()}
					{#if isExpired}
						<span class="text-red-600 font-medium">• Expired</span>
					{:else if isExpiring}
						<span class="text-yellow-600 font-medium">• Expiring Soon</span>
					{/if}
				</div>
			{/if}
		</div>
		{#if isExpired}
			<AlertTriangle class="w-4 h-4 text-red-500" />
		{:else if isExpiring}
			<AlertTriangle class="w-4 h-4 text-yellow-500" />
		{:else}
			<CheckCircle class="w-4 h-4 text-green-500" />
		{/if}
	</div>
{/if}
