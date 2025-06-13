<script lang="ts">
	import { enhance } from '$app/forms'
	import Card from '$lib/components/ui/card.svelte'
	import CardContent from '$lib/components/ui/card-content.svelte'
	import Button from '$lib/components/ui/button.svelte'
	import { Save } from 'lucide-svelte'

	export let businessHours: any
	export let canEdit: boolean

	const daysOfWeek = [
		{ key: 'monday', label: 'Monday' },
		{ key: 'tuesday', label: 'Tuesday' },
		{ key: 'wednesday', label: 'Wednesday' },
		{ key: 'thursday', label: 'Thursday' },
		{ key: 'friday', label: 'Friday' },
		{ key: 'saturday', label: 'Saturday' },
		{ key: 'sunday', label: 'Sunday' }
	]

	// Initialize business hours with defaults if not set
	let hours = businessHours || {
		monday: { start: '09:00', end: '17:00', enabled: true },
		tuesday: { start: '09:00', end: '17:00', enabled: true },
		wednesday: { start: '09:00', end: '17:00', enabled: true },
		thursday: { start: '09:00', end: '17:00', enabled: true },
		friday: { start: '09:00', end: '17:00', enabled: true },
		saturday: { start: '09:00', end: '17:00', enabled: false },
		sunday: { start: '09:00', end: '17:00', enabled: false }
	}

	let loading = false

	function toggleDay(day: string) {
		if (!canEdit) return
		hours[day].enabled = !hours[day].enabled
	}
</script>

<Card>
	<CardContent class="p-6">
		<h2 class="text-xl font-semibold mb-6">Business Hours</h2>
		<p class="text-gray-600 mb-6">
			Configure your company's operating hours for better client communication and scheduling.
		</p>
		
		<form 
			method="POST" 
			action="?/updateBusinessHours"
			use:enhance={() => {
				loading = true
				return async ({ update }) => {
					loading = false
					await update()
				}
			}}
		>
			<input type="hidden" name="businessHours" value={JSON.stringify(hours)} />
			
			<div class="space-y-4">
				{#each daysOfWeek as day}
					<div class="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
						<!-- Day Toggle -->
						<div class="w-24">
							<label class="flex items-center">
								<input
									type="checkbox"
									bind:checked={hours[day.key].enabled}
									disabled={!canEdit}
									on:change={() => toggleDay(day.key)}
									class="rounded border-gray-300 text-primary focus:ring-primary disabled:bg-gray-50"
								/>
								<span class="ml-2 text-sm font-medium text-gray-700">
									{day.label}
								</span>
							</label>
						</div>

						<!-- Time Inputs -->
						<div class="flex items-center gap-2 flex-1">
							<input
								type="time"
								bind:value={hours[day.key].start}
								disabled={!canEdit || !hours[day.key].enabled}
								class="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary disabled:bg-gray-50 disabled:text-gray-500"
							/>
							<span class="text-gray-500">to</span>
							<input
								type="time"
								bind:value={hours[day.key].end}
								disabled={!canEdit || !hours[day.key].enabled}
								class="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary disabled:bg-gray-50 disabled:text-gray-500"
							/>
						</div>

						<!-- Status -->
						<div class="w-20 text-right">
							<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium {
								hours[day.key].enabled 
									? 'bg-green-100 text-green-800' 
									: 'bg-gray-100 text-gray-800'
							}">
								{hours[day.key].enabled ? 'Open' : 'Closed'}
							</span>
						</div>
					</div>
				{/each}
			</div>

			{#if canEdit}
				<div class="mt-6 flex justify-end">
					<Button type="submit" disabled={loading}>
						<Save class="w-4 h-4 mr-2" />
						{loading ? 'Saving...' : 'Save Business Hours'}
					</Button>
				</div>
			{/if}
		</form>
	</CardContent>
</Card>
