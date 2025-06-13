<script lang="ts">
	import Card from '$lib/components/ui/card.svelte'
	import CardContent from '$lib/components/ui/card-content.svelte'
	import Button from '$lib/components/ui/button.svelte'
	import { 
		Settings, User, Shield, Bell, Download, 
		Trash2, ArrowLeft, Edit3, Key, Palette, 
		Globe, Activity, CreditCard 
	} from 'lucide-svelte'
	import { goto } from '$app/navigation'
	
	export let data
	
	function goBack() {
		goto('/dashboard')
	}
	
	// Navigation functions
	const settingsNavigation = [
		{
			icon: User,
			title: 'Profile Settings',
			description: 'Update your personal information and contact details',
			href: '/settings/profile',
			available: true
		},
		{
			icon: Shield,
			title: 'Security & Privacy',
			description: 'Manage password, two-factor auth, and privacy settings',
			href: '/settings/security',
			available: true
		},
		{
			icon: Bell,
			title: 'Notifications',
			description: 'Configure email and push notification preferences',
			href: '/settings/preferences',
			available: true
		},
		{
			icon: Palette,
			title: 'Appearance',
			description: 'Customize theme, language, and display options',
			href: '/settings/preferences#appearance',
			available: true
		},
		{
			icon: Download,
			title: 'Data Export',
			description: 'Download your personal data (GDPR compliance)',
			href: '/settings/account#export',
			available: true
		},
		{
			icon: Activity,
			title: 'Login Activity',
			description: 'View recent login sessions and security events',
			href: '/settings/security#activity',
			available: true
		},
		{
			icon: Trash2,
			title: 'Delete Account',
			description: 'Permanently delete your account and all data',
			href: '/settings/account#delete',
			available: true,
			danger: true
		}
	]
	
	$: availableSettings = settingsNavigation.filter(item => item.available)
</script>

<div class="min-h-screen bg-gray-50 py-12 px-4">
	<div class="max-w-4xl mx-auto">
		<!-- Header -->
		<div class="mb-8">
			<Button variant="ghost" on:click={goBack} class="mb-4">
				<ArrowLeft class="w-4 h-4 mr-2" />
				Back to Dashboard
			</Button>
			<div class="flex items-center gap-3 mb-4">
				<Settings class="w-8 h-8 text-primary" />
				<h1 class="text-3xl font-bold text-gray-900">Settings</h1>
			</div>
			<p class="text-gray-600">
				Manage your account, security, and preferences
			</p>
		</div>

		<!-- Account Overview -->
		<Card class="mb-6">
			<CardContent class="p-6">
				<div class="flex items-center gap-4">
					<div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
						<User class="w-8 h-8 text-primary" />
					</div>
					<div class="flex-1">
						<h2 class="text-xl font-semibold">
							{#if data.userType === 'candidate' && data.profile}
								{data.profile.first_name} {data.profile.last_name}
							{:else}
								{data.user.email}
							{/if}
						</h2>
						<p class="text-gray-600">{data.user.email}</p>
						<div class="flex items-center gap-2 mt-1">
							<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
								{data.userType === 'candidate' ? 'Candidate' : 'Business User'}
							</span>
							{#if data.userType === 'candidate' && data.profile?.profile_completed_at}
								<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
									Profile Complete
								</span>
							{/if}
						</div>
					</div>
				</div>
			</CardContent>
		</Card>

		<!-- Settings Grid -->
		<div class="grid gap-4 md:grid-cols-2">
			{#each availableSettings as setting}
				<Card class="hover:shadow-md transition-shadow">
					<CardContent class="p-6">
						<div class="flex items-start gap-4">
							<div class="w-10 h-10 rounded-lg {setting.danger ? 'bg-red-100' : 'bg-primary/10'} flex items-center justify-center">
								<svelte:component 
									this={setting.icon} 
									class="w-5 h-5 {setting.danger ? 'text-red-600' : 'text-primary'}" 
								/>
							</div>
							<div class="flex-1">
								<h3 class="font-semibold text-gray-900 mb-1">
									{setting.title}
								</h3>
								<p class="text-sm text-gray-600 mb-3">
									{setting.description}
								</p>
								<Button 
									variant={setting.danger ? 'outline' : 'default'}
									size="sm"
									on:click={() => goto(setting.href)}
									class={setting.danger ? 'border-red-200 text-red-600 hover:bg-red-50' : ''}
								>
									{setting.danger ? 'Manage' : 'Configure'}
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			{/each}
		</div>

		<!-- Company Settings for Business Users -->
		{#if data.userType === 'business' && data.company}
			<Card class="mt-6">
				<CardContent class="p-6">
					<div class="flex items-center gap-3 mb-4">
						<CreditCard class="w-6 h-6 text-primary" />
						<h2 class="text-xl font-semibold">Company Settings</h2>
					</div>
					<div class="bg-gray-50 rounded-lg p-4">
						<div class="grid gap-2 text-sm">
							<div class="flex justify-between">
								<span class="font-medium">Company:</span>
								<span class="text-gray-600">{data.company.name}</span>
							</div>
							<div class="flex justify-between">
								<span class="font-medium">Domain:</span>
								<span class="text-gray-600">{data.company.domain}</span>
							</div>
							<div class="flex justify-between">
								<span class="font-medium">Processes:</span>
								<span class="text-gray-600">
									{#if data.company.recruitment_enabled && data.company.bench_sales_enabled}
										Recruitment & Bench Sales
									{:else if data.company.recruitment_enabled}
										Recruitment Only
									{:else if data.company.bench_sales_enabled}
										Bench Sales Only
									{:else}
										Not Configured
									{/if}
								</span>
							</div>
						</div>
					</div>
					<div class="mt-4 space-y-2">
						<Button variant="outline" on:click={() => goto('/settings/company')}>
							<Settings class="w-4 h-4 mr-2" />
							Company Settings
						</Button>
						<Button variant="outline" disabled>
							<User class="w-4 h-4 mr-2" />
							User Management (Coming Soon)
						</Button>
					</div>
				</CardContent>
			</Card>
		{/if}

		<!-- Help & Support -->
		<Card class="mt-6">
			<CardContent class="p-6">
				<h2 class="text-lg font-semibold mb-4">Help & Support</h2>
				<div class="flex gap-3">
					<Button variant="outline" size="sm">
						Contact Support
					</Button>
					<Button variant="outline" size="sm">
						Documentation
					</Button>
					<Button variant="outline" size="sm">
						Privacy Policy
					</Button>
				</div>
			</CardContent>
		</Card>
	</div>
</div>
