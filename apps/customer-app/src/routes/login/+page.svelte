<script lang="ts">
	import { enhance } from '$app/forms'
	import { goto } from '$app/navigation'
	import { toastSuccess, toastError } from '$lib'
	import Card from '$lib/components/ui/card.svelte'
	import CardHeader from '$lib/components/ui/card-header.svelte'
	import CardTitle from '$lib/components/ui/card-title.svelte'
	import CardDescription from '$lib/components/ui/card-description.svelte'
	import CardContent from '$lib/components/ui/card-content.svelte'
	import Button from '$lib/components/ui/button.svelte'
	import Input from '$lib/components/ui/input.svelte'
	import Label from '$lib/components/ui/label.svelte'
	import { LogIn, AlertCircle, Briefcase, Users } from 'lucide-svelte'
	
	export let form
	export let data
	
	let loading = false
	let email = ''
	let password = ''
	let userType: 'business' | 'candidate' = 'business'
	
	async function handleLogin() {
		loading = true
		// Form will be handled by the +page.server.ts action
	}
</script>

<svelte:head>
	<title>Login - ProcureServe</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
	<div class="max-w-md w-full space-y-8">
		<div class="text-center">
			<h2 class="text-3xl font-bold text-gray-900">Sign in to ProcureServe</h2>
			<p class="mt-2 text-sm text-gray-600">
				Access your staffing and recruitment dashboard
			</p>
		</div>

		<Card>
			<CardHeader class="text-center">
				<CardTitle class="flex items-center justify-center gap-2">
					<LogIn class="w-5 h-5" />
					Login
				</CardTitle>
				<CardDescription>
					Enter your credentials to access your account
				</CardDescription>
			</CardHeader>
			
			<CardContent>
				<!-- User Type Selection -->
				<div class="mb-6">
					<Label class="text-base font-medium">I am a:</Label>
					<div class="mt-2 grid grid-cols-2 gap-3">
						<button
							type="button"
							class="flex items-center justify-center gap-2 p-3 border rounded-lg transition-colors {userType === 'business' ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400'}"
							on:click={() => userType = 'business'}
						>
							<Briefcase class="w-4 h-4" />
							<span class="text-sm font-medium">Business User</span>
						</button>
						<button
							type="button"
							class="flex items-center justify-center gap-2 p-3 border rounded-lg transition-colors {userType === 'candidate' ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400'}"
							on:click={() => userType = 'candidate'}
						>
							<Users class="w-4 h-4" />
							<span class="text-sm font-medium">Job Seeker</span>
						</button>
					</div>
				</div>
				<form method="POST" action="?/login" use:enhance={({ formData }) => {
					formData.set('userType', userType)
					loading = true
					return async ({ result, update }) => {
						loading = false
						if (result.type === 'redirect') {
							toastSuccess('Welcome back!', 'You have been successfully signed in.')
							goto(result.location)
						} else if (result.type === 'failure') {
							toastError('Login failed', result.data?.error || 'Please check your credentials and try again.')
							await update()
						} else {
							await update()
						}
					}
				}}>
					<div class="space-y-4">
						<div>
							<Label for="email">Email Address</Label>
							<Input
								id="email"
								name="email"
								type="email"
								bind:value={email}
								required
								placeholder={userType === 'business' ? 'you@company.com' : 'you@gmail.com'}
							/>
						</div>
						
						<div>
							<Label for="password">Password</Label>
							<Input
								id="password"
								name="password"
								type="password"
								bind:value={password}
								required
								placeholder="Enter your password"
							/>
						</div>
						
						{#if data?.message}
							<div class="p-3 bg-green-50 border border-green-200 rounded-lg">
								<div class="flex items-center gap-2 text-green-800">
									<span class="text-sm">{data.message}</span>
								</div>
							</div>
						{/if}

						{#if form?.error}
							<div class="p-3 bg-red-50 border border-red-200 rounded-lg">
								<div class="flex items-center gap-2 text-red-800">
									<AlertCircle class="w-4 h-4" />
									<span class="text-sm">{form.error}</span>
								</div>
							</div>
						{/if}
						
						<Button type="submit" class="w-full" disabled={loading}>
							{loading ? 'Signing in...' : 'Sign In'}
						</Button>
					</div>
				</form>
				
				<div class="mt-6 text-center space-y-2">
					<a href="/reset-password" class="text-sm text-primary hover:underline">
						Forgot your password?
					</a>
					
					<div class="text-sm text-gray-600">
						Don't have an account?
						{#if userType === 'business'}
							<a href="/register" class="text-primary hover:underline">Register your business</a>
						{:else}
							<a href="/register/candidate" class="text-primary hover:underline">Sign up as a candidate</a>
						{/if}
					</div>
				</div>
			</CardContent>
		</Card>
		
		<div class="text-center">
			<p class="text-xs text-gray-500">
				By signing in, you agree to our Terms of Service and Privacy Policy
			</p>
		</div>
	</div>
</div>
