<script lang="ts">
	import Button from '$lib/components/ui/button.svelte'
	import Input from '$lib/components/ui/input.svelte'
	import Label from '$lib/components/ui/label.svelte'
	import { MapPin } from 'lucide-svelte'
	
	export let formData: any
	export let canProceed: boolean
	export let onNext: () => void
	export let onPrev: () => void
	
	const usStates = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY']
</script>

<div class="space-y-6">
	<div class="text-center mb-6">
		<MapPin class="w-12 h-12 text-primary mx-auto mb-2" />
		<h2 class="text-xl font-semibold">Business Address</h2>
		<p class="text-gray-600">Where is your business located?</p>
	</div>
	<div class="space-y-4">
		<div>
			<Label for="street_address">Street Address *</Label>
			<Input id="street_address" name="street_address" bind:value={formData.street_address} 
				placeholder="123 Business Street" required />
		</div>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			<div>
				<Label for="city">City *</Label>
				<Input id="city" name="city" bind:value={formData.city} placeholder="New York" required />
			</div>
			<div>
				<Label for="state">State *</Label>
				<select id="state" name="state" bind:value={formData.state} 
					class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required>
					<option value="">Select state</option>
					{#each usStates as state}
						<option value={state}>{state}</option>
					{/each}
				</select>
			</div>
			<div>
				<Label for="zip_code">ZIP Code *</Label>
				<Input id="zip_code" name="zip_code" bind:value={formData.zip_code} 
					placeholder="10001" maxlength="5" required />
			</div>
		</div>
	</div>
	<div class="flex justify-between">
		<Button type="button" variant="outline" on:click={onPrev}>Back</Button>
		<Button type="button" on:click={onNext} disabled={!canProceed}>Continue</Button>
	</div>
</div>
