<script lang="ts">
	import Button from '$lib/components/ui/button.svelte'
	import Input from '$lib/components/ui/input.svelte'
	import Label from '$lib/components/ui/label.svelte'
	import { Clock, Shield } from 'lucide-svelte'
	
	export let formData: any
	export let canProceed: boolean
	export let onPrev: () => void
	export let loading: boolean = false
	
	const timeZones = [
		'America/New_York',
		'America/Chicago', 
		'America/Denver',
		'America/Los_Angeles',
		'America/Anchorage',
		'Pacific/Honolulu'
	]
</script>

<div class="space-y-6">
	<div class="text-center mb-6">
		<Clock class="w-12 h-12 text-primary mx-auto mb-2" />
		<h2 class="text-xl font-semibold">Business Settings</h2>
		<p class="text-gray-600">Configure your operational preferences</p>
	</div>
	<div class="space-y-6">
		<div>
			<Label class="text-base font-medium">Business Processes *</Label>
			<p class="text-sm text-gray-600 mb-3">Select the services you provide</p>
			<div class="space-y-3">
				<label class="flex items-center space-x-3">
					<input type="checkbox" name="recruitment_enabled" bind:checked={formData.recruitment_enabled} 
						value="true" class="rounded border-gray-300" />
					<div>
						<div class="font-medium">Recruitment</div>
						<div class="text-sm text-gray-600">Find and place candidates for client companies</div>
					</div>
				</label>
				<label class="flex items-center space-x-3">
					<input type="checkbox" name="bench_sales_enabled" bind:checked={formData.bench_sales_enabled} 
						value="true" class="rounded border-gray-300" />
					<div>
						<div class="font-medium">Bench Sales</div>
						<div class="text-sm text-gray-600">Market available consultants to clients</div>
					</div>
				</label>
			</div>
			{#if !formData.recruitment_enabled && !formData.bench_sales_enabled}
				<p class="text-xs text-red-600 mt-1">Please select at least one business process</p>
			{/if}
		</div>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div>
				<Label for="time_zone">Time Zone</Label>
				<select id="time_zone" name="time_zone" bind:value={formData.time_zone} 
					class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
					{#each timeZones as tz}
						<option value={tz}>{tz.replace('America/', '').replace('Pacific/', '').replace('_', ' ')}</option>
					{/each}
				</select>
			</div>
		</div>
		<div>
			<Label class="text-base font-medium">Working Hours</Label>
			<p class="text-sm text-gray-600 mb-3">Default business hours for your organization</p>
			<div class="grid grid-cols-2 gap-4 max-w-md">
				<div>
					<Label for="work_start">Start Time</Label>
					<Input id="work_start" name="work_start" type="time" bind:value={formData.work_start} />
				</div>
				<div>
					<Label for="work_end">End Time</Label>
					<Input id="work_end" name="work_end" type="time" bind:value={formData.work_end} />
				</div>
			</div>
		</div>
		<div class="border-t pt-6">
			<div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
				<div class="flex items-start space-x-3">
					<Shield class="w-5 h-5 text-blue-600 mt-0.5" />
					<div class="text-sm">
						<h3 class="font-medium text-blue-900">Next Steps</h3>
						<p class="text-blue-800 mt-1">After submission, you'll upload required documents and your registration will be reviewed by our team. You'll receive email updates on your approval status.</p>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="flex justify-between">
		<Button type="button" variant="outline" on:click={onPrev}>Back</Button>
		<Button type="submit" disabled={loading || !canProceed} class="bg-primary hover:bg-primary/90">
			{loading ? 'Creating Account...' : 'Create Business Account'}
		</Button>
	</div>
</div>
