<script lang="ts">
	import { goto } from '$app/navigation'
	import { onMount } from 'svelte'
	import Button from '$lib/components/ui/button.svelte'
	import Card from '$lib/components/ui/card.svelte'
	import CardContent from '$lib/components/ui/card-content.svelte'
	import CardDescription from '$lib/components/ui/card-description.svelte'
	import CardHeader from '$lib/components/ui/card-header.svelte'
	import CardTitle from '$lib/components/ui/card-title.svelte'
	import Input from '$lib/components/ui/input.svelte'
	import Label from '$lib/components/ui/label.svelte'
	import { supabase } from '$lib/supabase'
	import { validatePassword } from '$lib/password-validation'

	let password = ''
	let confirmPassword = ''
	let loading = false
	let error = ''
	let validationErrors: string[] = []

	onMount(() => {
		// Supabase handles the session automatically from the URL params
		// No additional setup needed for password reset
	})

	function validateForm(): boolean {
		validationErrors = []
		
		// Validate password strength
		const passwordValidation = validatePassword(password)
		if (!passwordValidation.valid) {
			validationErrors = passwordValidation.errors
			return false
		}

		// Check password confirmation
		if (password !== confirmPassword) {
			validationErrors = ['Passwords do not match']
			return false
		}

		return true
	}

	async function handleUpdatePassword() {
		if (!validateForm()) {
			error = validationErrors.join(', ')
			return
		}

		loading = true
		error = ''

		try {
			const { error: supabaseError } = await supabase.auth.updateUser({
				password: password
			})

			if (supabaseError) {
				error = supabaseError.message
			} else {
				// Password updated successfully
				await goto('/login?message=Password updated successfully')
			}
		} catch (err) {
			error = 'An unexpected error occurred'
		} finally {
			loading = false
		}
	}
</script>

<svelte:head>
	<title>Update Password - ProcureServe</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-background p-4">
	<Card class="w-full max-w-md">
		<CardHeader class="text-center">
			<CardTitle class="text-2xl font-semibold">Update Password</CardTitle>
			<CardDescription>
				Enter your new password below
			</CardDescription>
		</CardHeader>
		<CardContent>
			<form on:submit|preventDefault={handleUpdatePassword} class="space-y-4">
				<div class="space-y-2">
					<Label for="password">New Password</Label>
					<Input
						id="password"
						type="password"
						bind:value={password}
						placeholder="Enter new password"
						required
						disabled={loading}
					/>
				</div>

				<div class="space-y-2">
					<Label for="confirm-password">Confirm Password</Label>
					<Input
						id="confirm-password"
						type="password"
						bind:value={confirmPassword}
						placeholder="Confirm new password"
						required
						disabled={loading}
					/>
				</div>

				{#if error}
					<div class="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
						{error}
					</div>
				{/if}

				<Button type="submit" class="w-full" disabled={loading}>
					{loading ? 'Updating...' : 'Update Password'}
				</Button>
			</form>
		</CardContent>
	</Card>
</div>
