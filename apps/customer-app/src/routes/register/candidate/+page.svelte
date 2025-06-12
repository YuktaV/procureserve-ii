<script lang="ts">
	import Card from '$lib/components/ui/card.svelte'
	import CardHeader from '$lib/components/ui/card-header.svelte'
	import CardTitle from '$lib/components/ui/card-title.svelte'
	import CardDescription from '$lib/components/ui/card-description.svelte'
	import CardContent from '$lib/components/ui/card-content.svelte'
	import Button from '$lib/components/ui/button.svelte'
	import Input from '$lib/components/ui/input.svelte'
	import Label from '$lib/components/ui/label.svelte'
	import { validateEmail } from '$lib/email-validation'
	import { validatePassword } from '$lib/password-validation'
	import { User, Mail, Lock, CheckCircle, AlertCircle } from 'lucide-svelte'
	import { goto } from '$app/navigation'
	
	let loading = false
	let message = ''
	let messageType: 'success' | 'error' = 'success'
	
	// Simplified form data - only essential fields
	let formData = {
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		confirmPassword: ''
	}
	
	// Validation
	$: emailValid = validateEmail(formData.email)
	$: passwordValidation = validatePassword(formData.password)
	$: passwordsMatch = formData.password === formData.confirmPassword
	$: formValid = formData.firstName && formData.lastName && emailValid && 
		passwordValidation.isValid && passwordsMatch
	
	async function submitRegistration() {
		if (!formValid) return
		
		loading = true
		message = ''
		
		try {
			const response = await fetch('/api/register/candidate', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			})
			
			const result = await response.json()
			
			if (response.ok) {
				messageType = 'success'
				message = 'Account created successfully! Redirecting to complete your profile...'
				// Redirect to profile completion after short delay
				setTimeout(() => {
					goto('/complete-profile')
				}, 2000)
			} else {
				messageType = 'error'
				message = result.error || 'Registration failed. Please try again.'
			}
		} catch (error) {
			messageType = 'error'
			message = 'Network error. Please check your connection and try again.'
		} finally {
			loading = false
		}
	}

	function navigateToLogin() {
		goto('/login')
	}
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
	<div class="max-w-md w-full">
		<div class="text-center mb-8">
			<h2 class="text-3xl font-bold text-gray-900">Create Your Account</h2>
			<p class="mt-2 text-sm text-gray-600">
				Join ProcureServe and start exploring opportunities
			</p>
		</div>

		<Card>
			<CardHeader>
				<CardTitle class="flex items-center gap-2">
					<User class="w-5 h-5" />
					Candidate Registration
				</CardTitle>
				<CardDescription>
					Quick signup - complete your profile after registration
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form on:submit|preventDefault={submitRegistration} class="space-y-4">
					<!-- Name Fields -->
					<div class="grid grid-cols-2 gap-4">
						<div>
							<Label for="firstName">First Name *</Label>
							<Input
								id="firstName"
								bind:value={formData.firstName}
								placeholder="John"
								required
							/>
						</div>
						<div>
							<Label for="lastName">Last Name *</Label>
							<Input
								id="lastName"
								bind:value={formData.lastName}
								placeholder="Smith"
								required
							/>
						</div>
					</div>
					
					<!-- Email -->
					<div>
						<Label for="email">Email Address *</Label>
						<div class="relative">
							<Mail class="w-4 h-4 absolute left-3 top-3 text-gray-400" />
							<Input
								id="email"
								type="email"
								bind:value={formData.email}
								placeholder="john@example.com"
								class="pl-10"
								required
							/>
						</div>
						{#if formData.email && !emailValid}
							<p class="text-sm text-red-600 mt-1 flex items-center gap-1">
								<AlertCircle class="w-4 h-4" />
								Please enter a valid email address
							</p>
						{/if}
					</div>
					
					<!-- Password -->
					<div>
						<Label for="password">Password *</Label>
						<div class="relative">
							<Lock class="w-4 h-4 absolute left-3 top-3 text-gray-400" />
							<Input
								id="password"
								type="password"
								bind:value={formData.password}
								placeholder="Create a strong password"
								class="pl-10"
								required
							/>
						</div>
						{#if formData.password}
							<div class="mt-2 space-y-1">
								<div class="flex items-center gap-2">
									<div class="flex gap-1">
										<div class="h-1 w-8 rounded {passwordValidation.strength === 'weak' ? 'bg-red-500' : passwordValidation.strength === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}"></div>
										<div class="h-1 w-8 rounded {passwordValidation.strength === 'medium' || passwordValidation.strength === 'strong' ? 'bg-yellow-500' : 'bg-gray-200'}"></div>
										<div class="h-1 w-8 rounded {passwordValidation.strength === 'strong' ? 'bg-green-500' : 'bg-gray-200'}"></div>
									</div>
									<span class="text-xs text-gray-600 capitalize">{passwordValidation.strength}</span>
								</div>
								{#each passwordValidation.errors as error}
									<p class="text-xs text-red-600">{error}</p>
								{/each}
							</div>
						{/if}
					</div>

					<!-- Confirm Password -->
					<div>
						<Label for="confirmPassword">Confirm Password *</Label>
						<Input
							id="confirmPassword"
							type="password"
							bind:value={formData.confirmPassword}
							placeholder="Confirm your password"
							required
						/>
						{#if formData.confirmPassword && !passwordsMatch}
							<p class="text-sm text-red-600 mt-1 flex items-center gap-1">
								<AlertCircle class="w-4 h-4" />
								Passwords do not match
							</p>
						{/if}
					</div>
					
					{#if message}
						<div class="p-4 rounded-lg {messageType === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}">
							<div class="flex items-center gap-2">
								{#if messageType === 'success'}
									<CheckCircle class="w-4 h-4" />
								{:else}
									<AlertCircle class="w-4 h-4" />
								{/if}
								{message}
							</div>
						</div>
					{/if}
					
					<Button type="submit" class="w-full" disabled={!formValid || loading}>
						{loading ? 'Creating Account...' : 'Create Account'}
					</Button>
				</form>
				
				<div class="mt-6 text-center">
					<p class="text-sm text-gray-600">
						Already have an account?
						<button type="button" on:click={navigateToLogin} class="text-primary hover:underline">
							Sign in
						</button>
					</p>
				</div>
			</CardContent>
		</Card>
	</div>
</div>
