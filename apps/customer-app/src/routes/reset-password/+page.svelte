<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import Button from '$lib/components/ui/button.svelte'
	import Card from '$lib/components/ui/card.svelte'
	import CardContent from '$lib/components/ui/card-content.svelte'
	import CardDescription from '$lib/components/ui/card-description.svelte'
	import CardHeader from '$lib/components/ui/card-header.svelte'
	import CardTitle from '$lib/components/ui/card-title.svelte'
	import Input from '$lib/components/ui/input.svelte'
	import Label from '$lib/components/ui/label.svelte'
	import { supabase } from '$lib/supabase'

	let email = ''
	let loading = false
	let message = ''
	let error = ''

	async function handleResetPassword() {
		if (!email) {
			error = 'Please enter your email address'
			return
		}

		loading = true
		error = ''
		message = ''

		try {
			const { error: supabaseError } = await supabase.auth.resetPasswordForEmail(email, {
				redirectTo: `${window.location.origin}/reset-password/update`
			})

			if (supabaseError) {
				error = supabaseError.message
			} else {
				message = 'Check your email for the password reset link'
				email = ''
			}
		} catch (err) {
			error = 'An unexpected error occurred'
		} finally {
			loading = false
		}
	}

	function goBack() {
		goto('/login')
	}
</script>

<svelte:head>
	<title>Reset Password - ProcureServe</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-background p-4">
	<Card class="w-full max-w-md">
		<CardHeader class="text-center">
			<CardTitle class="text-2xl font-semibold">Reset Password</CardTitle>
			<CardDescription>
				Enter your email address and we'll send you a password reset link
			</CardDescription>
		</CardHeader>
		<CardContent>
			<form on:submit|preventDefault={handleResetPassword} class="space-y-4">
				<div class="space-y-2">
					<Label for="email">Email Address</Label>
					<Input
						id="email"
						type="email"
						bind:value={email}
						placeholder="Enter your email"
						required
						disabled={loading}
					/>
				</div>

				{#if error}
					<div class="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
						{error}
					</div>
				{/if}

				{#if message}
					<div class="text-sm text-green-600 bg-green-50 p-3 rounded-md">
						{message}
					</div>
				{/if}

				<div class="space-y-3">
					<Button type="submit" class="w-full" disabled={loading}>
						{loading ? 'Sending...' : 'Send Reset Link'}
					</Button>
					<Button type="button" variant="outline" class="w-full" on:click={goBack}>
						Back to Login
					</Button>
				</div>
			</form>
		</CardContent>
	</Card>
</div>
