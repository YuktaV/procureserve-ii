<script lang="ts">
	import Button from '$lib/components/ui/button.svelte'
	import Input from '$lib/components/ui/input.svelte'
	import Label from '$lib/components/ui/label.svelte'
	import { Building2 } from 'lucide-svelte'
	
	export let formData: any
	export let canProceed: boolean
	export let onNext: () => void
	
	function formatTaxId(value: string) {
		const numbers = value.replace(/\D/g, '')
		return numbers.length >= 2 ? numbers.slice(0, 2) + '-' + numbers.slice(2, 9) : numbers
	}
	
	function handleTaxIdInput(event: Event) {
		const target = event.target as HTMLInputElement
		formData.tax_id = formatTaxId(target.value)
	}
</script>

<div class="space-y-6">
	<div class="text-center mb-6">
		<Building2 class="w-12 h-12 text-primary mx-auto mb-2" />
		<h2 class="text-xl font-semibold">Company Information</h2>
		<p class="text-gray-600">Tell us about your business</p>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
		<div class="md:col-span-2">
			<Label for="company_name">Company Name *</Label>
			<Input id="company_name" name="company_name" bind:value={formData.company_name} 
				placeholder="Acme Staffing Solutions" required />
		</div>
		<div>
			<Label for="legal_entity_type">Legal Entity Type *</Label>
			<select id="legal_entity_type" name="legal_entity_type" bind:value={formData.legal_entity_type} 
				class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required>
				<option value="">Select entity type</option>
				<option value="LLC">LLC</option>
				<option value="Corporation">Corporation</option>
				<option value="S-Corp">S-Corporation</option>
				<option value="Partnership">Partnership</option>
				<option value="Sole Proprietorship">Sole Proprietorship</option>
			</select>
		</div>
		<div>
			<Label for="tax_id">Tax ID (EIN) *</Label>
			<Input id="tax_id" name="tax_id" bind:value={formData.tax_id} 
				on:input={handleTaxIdInput} placeholder="XX-XXXXXXX" maxlength="10" required />
		</div>
		<div>
			<Label for="business_type">Business Type *</Label>
			<select id="business_type" name="business_type" bind:value={formData.business_type} 
				class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required>
				<option value="staffing_agency">Staffing Agency</option>
				<option value="direct_employer">Direct Employer</option>
			</select>
		</div>
		<div>
			<Label for="estimated_annual_volume">Estimated Annual Volume</Label>
			<select id="estimated_annual_volume" name="estimated_annual_volume" bind:value={formData.estimated_annual_volume} 
				class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
				<option value="">Select volume range</option>
				<option value="under_1m">Under $1M</option>
				<option value="1m_5m">$1M - $5M</option>
				<option value="5m_25m">$5M - $25M</option>
				<option value="25m_100m">$25M - $100M</option>
				<option value="over_100m">Over $100M</option>
			</select>
		</div>
	</div>
	<div class="flex justify-end">
		<Button type="button" on:click={onNext} disabled={!canProceed}>Continue</Button>
	</div>
</div>
