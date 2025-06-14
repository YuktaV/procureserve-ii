<script lang="ts">
	import Card from '$lib/components/ui/card.svelte'
	import CardHeader from '$lib/components/ui/card-header.svelte'
	import CardTitle from '$lib/components/ui/card-title.svelte'
	import CardContent from '$lib/components/ui/card-content.svelte'
	import Button from '$lib/components/ui/button.svelte'
	import Input from '$lib/components/ui/input.svelte'
	import Label from '$lib/components/ui/label.svelte'
	import { 
		Shield, ArrowLeft, Key, Eye, EyeOff, 
		Check, X, AlertTriangle, Activity, Lock 
	} from 'lucide-svelte'
	import { goto } from '$app/navigation'
	import { enhance } from '$app/forms'
	
	export let data
	export let form
	
	let loading = false
	let showPasswords = {
		current: false,
		new: false,
		confirm: false
	}
	
	// Password form data
	let passwordData = {
		current_password: '',
		new_password: '',
		confirm_password: ''
	}
	
	// Password strength validation
	$: passwordStrength = {
		length: passwordData.new_password.length >= 8,
		uppercase: /[A-Z]/.test(passwordData.new_password),
		lowercase: /[a-z]/.test(passwordData.new_password),
		number: /\d/.test(passwordData.new_password),
		special: /[!@#$%^&*(),.?":{}|<>]/.test(passwordData.new_password)
	}
	
	$: passwordsMatch = passwordData.new_password === passwordData.confirm_password && passwordData.confirm_password.length > 0
	$: allPasswordRequirementsMet = Object.values(passwordStrength).every(Boolean)
	$: formValid = passwordData.current_password && 
		passwordData.new_password && 
		passwordData.confirm_password &&
		allPasswordRequirementsMet &&
		passwordsMatch
	
	function togglePasswordVisibility(field: keyof typeof showPasswords) {
		showPasswords[field] = !showPasswords[field]
	}
</script>

<div class="min-h-screen bg-gray-50 py-12 px-4">
	<div class="max-w-4xl mx-auto">
		<!-- Header -->
		<div class="mb-8">
			<Button variant="ghost" on:click={() => goto('/settings')} class="mb-4">
				<ArrowLeft class="w-4 h-4 mr-2" />
				Back to Settings
			</Button>
			<div class="flex items-center gap-3 mb-2">
				<Shield class="w-8 h-8 text-primary" />
				<h1 class="text-3xl font-bold text-gray-900">Security & Privacy</h1>
			</div>
			<p class="text-gray-600">
				Manage your account security and privacy settings
			</p>
		</div>

		{#if form?.error}
			<div class="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
				<div class="flex items-center gap-2">
					<AlertTriangle class="w-5 h-5 text-red-600" />
					<p class="text-red-800">{form.error}</p>
				</div>
			</div>
		{/if}

		{#if form?.success}
			<div class="mb-6 p-4 rounded-lg bg-green-50 border border-green-200">
				<div class="flex items-center gap-2">
					<Check class="w-5 h-5 text-green-600" />
					<p class="text-green-800">Password changed successfully!</p>
				</div>
			</div>
		{/if}

		<div class="space-y-6">
			<!-- Change Password -->
			<Card>
				<CardHeader>
					<CardTitle class="flex items-center gap-2">
						<Key class="w-5 h-5" />
						Change Password
					</CardTitle>
				</CardHeader>
				<CardContent>
					<form method="POST" action="?/changePassword" use:enhance={() => {
						loading = true
						return async ({ result, update }) => {
							loading = false
							if (result.type === 'success') {
								passwordData = {
									current_password: '',
									new_password: '',
									confirm_password: ''
								}
							}
							await update()
						}
					}}>
						<div class="space-y-4">
							<!-- Current Password -->
							<div>
								<Label for="current_password">Current Password *</Label>
								<div class="relative">
									<Input
										id="current_password"
										name="current_password"
										type={showPasswords.current ? 'text' : 'password'}
										bind:value={passwordData.current_password}
										placeholder="Enter your current password"
										required
									/>
									<button
										type="button"
										class="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
										on:click={() => togglePasswordVisibility('current')}
									>
										{#if showPasswords.current}
											<EyeOff class="w-4 h-4" />
										{:else}
											<Eye class="w-4 h-4" />
										{/if}
									</button>
								</div>
							</div>

							<!-- New Password -->
							<div>
								<Label for="new_password">New Password *</Label>
								<div class="relative">
									<Input
										id="new_password"
										name="new_password"
										type={showPasswords.new ? 'text' : 'password'}
										bind:value={passwordData.new_password}
										placeholder="Enter your new password"
										required
									/>
									<button
										type="button"
										class="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
										on:click={() => togglePasswordVisibility('new')}
									>
										{#if showPasswords.new}
											<EyeOff class="w-4 h-4" />
										{:else}
											<Eye class="w-4 h-4" />
										{/if}
									</button>
								</div>
								
								<!-- Password Requirements -->
								{#if passwordData.new_password}
									<div class="mt-2 space-y-1">
										<p class="text-sm font-medium text-gray-700">Password Requirements:</p>
										<div class="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs">
											<div class="flex items-center gap-1">
												{#if passwordStrength.length}
													<Check class="w-3 h-3 text-green-600" />
												{:else}
													<X class="w-3 h-3 text-red-600" />
												{/if}
												<span class={passwordStrength.length ? 'text-green-600' : 'text-red-600'}>
													At least 8 characters
												</span>
											</div>
											<div class="flex items-center gap-1">
												{#if passwordStrength.uppercase}
													<Check class="w-3 h-3 text-green-600" />
												{:else}
													<X class="w-3 h-3 text-red-600" />
												{/if}
												<span class={passwordStrength.uppercase ? 'text-green-600' : 'text-red-600'}>
													Uppercase letter
												</span>
											</div>
											<div class="flex items-center gap-1">
												{#if passwordStrength.lowercase}
													<Check class="w-3 h-3 text-green-600" />
												{:else}
													<X class="w-3 h-3 text-red-600" />
												{/if}
												<span class={passwordStrength.lowercase ? 'text-green-600' : 'text-red-600'}>
													Lowercase letter
												</span>
											</div>
											<div class="flex items-center gap-1">
												{#if passwordStrength.number}
													<Check class="w-3 h-3 text-green-600" />
												{:else}
													<X class="w-3 h-3 text-red-600" />
												{/if}
												<span class={passwordStrength.number ? 'text-green-600' : 'text-red-600'}>
													Number
												</span>
											</div>
											<div class="flex items-center gap-1">
												{#if passwordStrength.special}
													<Check class="w-3 h-3 text-green-600" />
												{:else}
													<X class="w-3 h-3 text-red-600" />
												{/if}
												<span class={passwordStrength.special ? 'text-green-600' : 'text-red-600'}>
													Special character
												</span>
											</div>
										</div>
									</div>
								{/if}
							</div>

							<!-- Confirm Password -->
							<div>
								<Label for="confirm_password">Confirm New Password *</Label>
								<div class="relative">
									<Input
										id="confirm_password"
										name="confirm_password"
										type={showPasswords.confirm ? 'text' : 'password'}
										bind:value={passwordData.confirm_password}
										placeholder="Confirm your new password"
										required
									/>
									<button
										type="button"
										class="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
										on:click={() => togglePasswordVisibility('confirm')}
									>
										{#if showPasswords.confirm}
											<EyeOff class="w-4 h-4" />
										{:else}
											<Eye class="w-4 h-4" />
										{/if}
									</button>
								</div>
								
								{#if passwordData.confirm_password && !passwordsMatch}
									<div class="flex items-center gap-1 mt-1">
										<X class="w-3 h-3 text-red-600" />
										<span class="text-xs text-red-600">Passwords do not match</span>
									</div>
								{/if}
								
								{#if passwordData.confirm_password && passwordsMatch}
									<div class="flex items-center gap-1 mt-1">
										<Check class="w-3 h-3 text-green-600" />
										<span class="text-xs text-green-600">Passwords match</span>
									</div>
								{/if}
							</div>

							<div class="flex justify-end">
								<Button 
									type="submit" 
									disabled={loading || !formValid}
								>
									<Key class="w-4 h-4 mr-2" />
									{loading ? 'Changing Password...' : 'Change Password'}
								</Button>
							</div>
						</div>
					</form>
				</CardContent>
			</Card>

			<!-- Account Security Overview -->
			<Card>
				<CardHeader>
					<CardTitle class="flex items-center gap-2">
						<Lock class="w-5 h-5" />
						Account Security
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div class="space-y-4">
						<div class="flex items-center justify-between p-4 border rounded-lg">
							<div>
								<h3 class="font-medium">Email Address</h3>
								<p class="text-sm text-gray-600">{data.user.email}</p>
								<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
									Verified
								</span>
							</div>
							<Button variant="outline" disabled>
								Change Email
							</Button>
						</div>

						<div class="flex items-center justify-between p-4 border rounded-lg">
							<div>
								<h3 class="font-medium">Two-Factor Authentication</h3>
								<p class="text-sm text-gray-600">Add an extra layer of security to your account</p>
								<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mt-1">
									Not Enabled
								</span>
							</div>
							<Button variant="outline" disabled>
								Set Up 2FA
							</Button>
						</div>

						<div class="flex items-center justify-between p-4 border rounded-lg">
							<div>
								<h3 class="font-medium">Login Activity</h3>
								<p class="text-sm text-gray-600">Review recent login attempts and sessions</p>
							</div>
							<Button variant="outline" on:click={() => goto('/settings/security#activity')}>
								<Activity class="w-4 h-4 mr-2" />
								View Activity
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			<!-- Privacy Settings -->
			<Card>
				<CardHeader>
					<CardTitle>Privacy Settings</CardTitle>
				</CardHeader>
				<CardContent>
					<div class="space-y-4">
						<div class="p-4 border rounded-lg">
							<h3 class="font-medium mb-2">Data Privacy</h3>
							<p class="text-sm text-gray-600 mb-3">
								Control how your data is used and shared
							</p>
							<div class="flex gap-3">
								<Button variant="outline" size="sm" on:click={() => goto('/settings/account#export')}>
									Download Data
								</Button>
								<Button variant="outline" size="sm" disabled>
									Privacy Preferences
								</Button>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	</div>
</div>
