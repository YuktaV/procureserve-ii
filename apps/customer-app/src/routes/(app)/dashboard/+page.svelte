<script lang="ts">
	import Card from '$lib/components/ui/card.svelte'
	import CardHeader from '$lib/components/ui/card-header.svelte'
	import CardTitle from '$lib/components/ui/card-title.svelte'
	import CardContent from '$lib/components/ui/card-content.svelte'
	import Button from '$lib/components/ui/button.svelte'
	import { 
		Building2, 
		Users, 
		Briefcase, 
		FileText, 
		TrendingUp,
		User,
		Plus,
		Clock,
		ArrowRight
	} from 'lucide-svelte'
	import { goto } from '$app/navigation'
	
	export let data
	
	// Mock dashboard data - will be replaced with real data
	const stats = [
		{ label: 'Active Jobs', value: '12', icon: Briefcase, color: 'text-blue-600', change: '+2', trend: 'up' },
		{ label: 'Total Candidates', value: '148', icon: Users, color: 'text-green-600', change: '+12', trend: 'up' },
		{ label: 'Active Submissions', value: '23', icon: FileText, color: 'text-purple-600', change: '+5', trend: 'up' },
		{ label: 'Monthly Growth', value: '+15%', icon: TrendingUp, color: 'text-orange-600', change: '+3%', trend: 'up' }
	]
	
	$: isCandidate = data.userType === 'candidate'
	$: isBusiness = data.userType === 'business'
	$: candidateName = isCandidate ? `${data.profile?.first_name} ${data.profile?.last_name}`.trim() : ''
	$: userFirstName = data.user?.profile?.first_name || data.user?.email?.split('@')[0] || 'there'
</script>

<svelte:head>
	<title>Dashboard - ProcureServe</title>
</svelte:head>

<!-- Welcome Section -->
<div class="mb-8">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
				Welcome back, {userFirstName}! 👋
			</h1>
			<p class="text-gray-600 dark:text-gray-400">
				{#if isCandidate}
					Track your applications and discover new opportunities.
				{:else if isBusiness}
					Here's what's happening with your recruitment today.
				{:else}
					Your recruitment dashboard overview.
				{/if}
			</p>
		</div>
		
		{#if isBusiness}
			<Button on:click={() => goto('/jobs/create')} class="flex items-center gap-2">
				<Plus class="w-4 h-4" />
				Create Job
			</Button>
		{/if}
	</div>
</div>

<!-- Stats Grid (Business Users) -->
{#if isBusiness}
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
		{#each stats as stat}
			<Card class="hover:shadow-md transition-shadow">
				<CardContent class="p-6">
					<div class="flex items-center justify-between">
						<div class="space-y-2">
							<p class="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
							<div class="flex items-center gap-2">
								<p class="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
								<span class="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
									{stat.change}
								</span>
							</div>
						</div>
						<div class="p-3 rounded-full bg-gray-50 dark:bg-gray-800">
							<svelte:component this={stat.icon} class="w-6 h-6 {stat.color}" />
						</div>
					</div>
				</CardContent>
			</Card>
		{/each}
	</div>
{/if}

<!-- Quick Actions and Recent Activity Grid -->
<div class="grid lg:grid-cols-2 gap-6">
	{#if isBusiness}
		<!-- Recent Activity -->
		<Card>
			<CardHeader class="flex flex-row items-center justify-between">
				<CardTitle class="flex items-center gap-2">
					<Clock class="w-5 h-5" />
					Recent Activity
				</CardTitle>
				<Button variant="ghost" size="sm" on:click={() => goto('/activity')}>
					View All
					<ArrowRight class="w-4 h-4 ml-2" />
				</Button>
			</CardHeader>
			<CardContent>
				<div class="space-y-4">
					<div class="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
						<div class="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
							<Users class="w-4 h-4 text-blue-600 dark:text-blue-400" />
						</div>
						<div class="flex-1">
							<p class="font-medium text-gray-900 dark:text-white">New candidate application</p>
							<p class="text-sm text-gray-600 dark:text-gray-400">Software Engineer position</p>
						</div>
						<span class="text-xs text-gray-500 dark:text-gray-400">2m ago</span>
					</div>
					
					<div class="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
						<div class="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
							<Briefcase class="w-4 h-4 text-green-600 dark:text-green-400" />
						</div>
						<div class="flex-1">
							<p class="font-medium text-gray-900 dark:text-white">Job posting approved</p>
							<p class="text-sm text-gray-600 dark:text-gray-400">Senior React Developer</p>
						</div>
						<span class="text-xs text-gray-500 dark:text-gray-400">1h ago</span>
					</div>
					
					<div class="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
						<div class="w-8 h-8 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center">
							<FileText class="w-4 h-4 text-purple-600 dark:text-purple-400" />
						</div>
						<div class="flex-1">
							<p class="font-medium text-gray-900 dark:text-white">Interview scheduled</p>
							<p class="text-sm text-gray-600 dark:text-gray-400">John Smith - Tomorrow 2PM</p>
						</div>
						<span class="text-xs text-gray-500 dark:text-gray-400">3h ago</span>
					</div>
				</div>
			</CardContent>
		</Card>
		
		<!-- Quick Actions -->
		<Card>
			<CardHeader>
				<CardTitle>Quick Actions</CardTitle>
			</CardHeader>
			<CardContent>
				<div class="space-y-3">
					<Button class="w-full justify-start h-12" on:click={() => goto('/jobs/create')}>
						<Briefcase class="w-5 h-5 mr-3" />
						<div class="text-left">
							<div class="font-medium">Create New Job</div>
							<div class="text-xs text-gray-500">Post a new position</div>
						</div>
					</Button>
					
					<Button variant="outline" class="w-full justify-start h-12" on:click={() => goto('/candidates')}>
						<Users class="w-5 h-5 mr-3" />
						<div class="text-left">
							<div class="font-medium">Browse Candidates</div>
							<div class="text-xs text-gray-500">Find qualified talent</div>
						</div>
					</Button>
					
					<Button variant="outline" class="w-full justify-start h-12" on:click={() => goto('/applications')}>
						<FileText class="w-5 h-5 mr-3" />
						<div class="text-left">
							<div class="font-medium">Review Applications</div>
							<div class="text-xs text-gray-500">Manage submissions</div>
						</div>
					</Button>
					
					<Button variant="outline" class="w-full justify-start h-12" on:click={() => goto('/settings/users')}>
						<Building2 class="w-5 h-5 mr-3" />
						<div class="text-left">
							<div class="font-medium">Manage Team</div>
							<div class="text-xs text-gray-500">User management</div>
						</div>
					</Button>
				</div>
			</CardContent>
		</Card>
		
	{:else if isCandidate}
		<!-- Job Search -->
		<Card>
			<CardHeader>
				<CardTitle>Job Opportunities</CardTitle>
			</CardHeader>
			<CardContent>
				<div class="space-y-3">
					<Button class="w-full justify-start h-12" on:click={() => goto('/jobs')}>
						<Briefcase class="w-5 h-5 mr-3" />
						<div class="text-left">
							<div class="font-medium">Browse Jobs</div>
							<div class="text-xs text-gray-500">Find your next opportunity</div>
						</div>
					</Button>
					
					<Button variant="outline" class="w-full justify-start h-12" on:click={() => goto('/applications')}>
						<FileText class="w-5 h-5 mr-3" />
						<div class="text-left">
							<div class="font-medium">My Applications</div>
							<div class="text-xs text-gray-500">Track your submissions</div>
						</div>
					</Button>
					
					<Button variant="outline" class="w-full justify-start h-12" on:click={() => goto('/settings/profile')}>
						<User class="w-5 h-5 mr-3" />
						<div class="text-left">
							<div class="font-medium">Update Profile</div>
							<div class="text-xs text-gray-500">Keep your info current</div>
						</div>
					</Button>
				</div>
			</CardContent>
		</Card>
		
		<!-- Application Status -->
		<Card>
			<CardHeader>
				<CardTitle>Application Status</CardTitle>
			</CardHeader>
			<CardContent>
				<div class="text-center py-8 text-gray-500 dark:text-gray-400">
					<FileText class="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
					<p class="font-medium">No applications yet</p>
					<p class="text-sm">Start by browsing available positions</p>
					<Button class="mt-4" on:click={() => goto('/jobs')}>
						Browse Jobs
					</Button>
				</div>
			</CardContent>
		</Card>
	{/if}
</div>
