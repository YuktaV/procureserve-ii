<script lang="ts">
	import Button from '$lib/components/ui/button.svelte'
	import Input from '$lib/components/ui/input.svelte'
	import Label from '$lib/components/ui/label.svelte'
	import { User } from 'lucide-svelte'
	
	export let formData: any
	export let canProceed: boolean
	export let onNext: () => void
	export let onPrev: () => void
	
	$: passwordsMatch = formData.password && formData.confirm_password && 
		formData.password === formData.confirm_password
</script>

<div class="space-y-6">
	<div class="text-center mb-6">
		<User class="w-12 h-12 text-primary mx-auto mb-2" />
		<h2 class="text-xl font-semibold">Primary Contact</h2>
		<p class="text-gray-600">Who should we contact about this account?</p>
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
		<div>
			<Label for="first_name">First Name *</Label>
			<Input id="first_name" name="first_name" bind:value={formData.first_name} 
				placeholder="John" required />
		</div>
		<div>
			<Label for="last_name">Last Name *</Label>
			<Input id="last_name" name="last_name" bind:value={formData.last_name} 
				placeholder="Smith" required />
		</div>
		<div>
			<Label for="email">Email Address *</Label>
			<Input id="email" name="email" type="email" bind:value={formData.email} 
				placeholder="john@company.com" required />
			<p class="text-xs text-gray-600 mt-1">This will be your login email</p>
		</div>
		<div>
			<Label for="phone">Phone Number *</Label>
			<Input id="phone" name="phone" type="tel" bind:value={formData.phone} 
				placeholder="+1 (555) 123-4567" required />
		</div>
		<div class="md:col-span-2">
			<Label for="title">Title/Position *</Label>
			<Input id="title" name="title" bind:value={formData.title} 
				placeholder="CEO, VP of Operations, etc." required />
		</div>
		<div>
			<Label for="password">Password *</Label>
			<Input id="password" name="password" type="password" bind:value={formData.password} 
				placeholder="Create a secure password" required />
		</div>
		<div>
			<Label for="confirm_password">Confirm Password *</Label>
			<Input id="confirm_password" name="confirm_password" type="password" 
				bind:value={formData.confirm_password} placeholder="Confirm your password" required />
			{#if formData.password && formData.confirm_password && !passwordsMatch}
				<p class="text-xs text-red-600 mt-1">Passwords do not match</p>
			{/if}
		</div>
	</div>
	<div class="flex justify-between">
		<Button type="button" variant="outline" on:click={onPrev}>Back</Button>
		<Button type="button" on:click={onNext} disabled={!canProceed}>Continue</Button>
	</div>
</div>
