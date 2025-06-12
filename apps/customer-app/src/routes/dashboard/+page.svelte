<script lang="ts">
	import Card from '$lib/components/ui/card.svelte'
	import CardHeader from '$lib/components/ui/card-header.svelte'
	import CardTitle from '$lib/components/ui/card-title.svelte'
	import CardContent from '$lib/components/ui/card-content.svelte'
	import Button from '$lib/components/ui/button.svelte'
	import ProfileCompletionPrompt from '$lib/components/profile/ProfileCompletionPrompt.svelte'
	import ProfileStatusBadge from '$lib/components/profile/ProfileStatusBadge.svelte'
	import WorkAuthorizationBadge from '$lib/components/profile/WorkAuthorizationBadge.svelte'
	import { 
		Building2, 
		Users, 
		Briefcase, 
		FileText, 
		TrendingUp,
		Settings,
		LogOut,
		User
	} from 'lucide-svelte'
	import { goto } from '$app/navigation'
	
	export let data
	
	// Mock dashboard data - will be replaced with real data
	const stats = [
		{ label: 'Active Jobs', value: '12', icon: Briefcase, color: 'text-blue-600' },
		{ label: 'Total Candidates', value: '148', icon: Users, color: 'text-green-600' },
		{ label: 'Active Submissions', value: '23', icon: FileText, color: 'text-purple-600' },
		{ label: 'Monthly Growth', value: '+15%', icon: TrendingUp, color: 'text-orange-600' }
	]
	
	async function signOut() {
		const response = await fetch('/api/auth/signout', { method: 'POST' })
		if (response.ok) {
			goto('/')
		}
	}
	
	function navigateToSettings() {
		goto('/settings')
	}
	
	$: isCandidate = data.userType === 'candidate'
	$: isBusiness = data.userType === 'business'
	$: candidateName = isCandidate ? `${data.profile?.first_name} ${data.profile?.last_name}`.trim() : ''
</script>

<svelte:head>
	<title>Dashboard - ProcureServe</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	<header class="bg-white shadow-sm border-b">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between items-center h-16">
				<div class="flex items-center gap-4">
					<Building2 class="w-8 h-8 text-primary" />
					<div>
						<h1 class="text-xl font-semibold">ProcureServe Dashboard</h1>
						{#if isBusiness && data.company}
							<p class="text-sm text-gray-600">{data.company.name}</p>
						{/if}
					</div>
				</div>
				
				<div class="flex items-center gap-4">
					{#if isCandidate}
						<ProfileStatusBadge status={data.profileStatus} compact={true} />
					{/if}
					
					<Button variant="ghost" size="sm" on:click={navigateToSettings}>
						<Settings class="w-4 h-4 mr-2" />
						Settings
					</Button>
					<Button variant="ghost" size="sm" on:click={signOut}>
						<LogOut class="w-4 h-4 mr-2" />
						Sign Out
					</Button>
				</div>
			</div>
		</div>
	</header>
	
	<!-- Main Content -->
	<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		<!-- Welcome Section -->
		<div class="mb-8">
			<h2 class="text-2xl font-bold text-gray-900 mb-2">
				{#if isCandidate}
					Welcome back{candidateName ? `, ${candidateName.split(' ')[0]}` : ''}!
				{:else if isBusiness}
					Welcome back!
				{:else}
					Dashboard
				{/if}
			</h2>
			<p class="text-gray-600">
				{#if isCandidate}
					Manage your profile and track your job applications.
				{:else if isBusiness}
					Here's what's happening with your recruitment activities today.
				{:else}
					Loading your dashboard...
				{/if}
			</p>
		</div>
		
		<!-- Profile Completion Prompt for Candidates -->
		{#if isCandidate && data.profileStatus !== 'full_complete'}
			<div class="mb-8">
				<ProfileCompletionPrompt 
					profileStatus={data.profileStatus} 
					candidateName={candidateName}
				/>
			</div>
		{/if}

		<!-- Candidate Profile Summary -->
		{#if isCandidate && data.profile}
			<div class="mb-8">
				<Card>
					<CardHeader>
						<CardTitle class="flex items-center gap-2">
							<User class="w-5 h-5" />
							Your Profile
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div class="space-y-4">
							<div class="flex items-center justify-between">
								<div>
									<h3 class="font-medium">{candidateName || 'No name set'}</h3>
									<p class="text-sm text-gray-600">{data.profile.email}</p>
									{#if data.profile.phone}
										<p class="text-sm text-gray-600">{data.profile.phone}</p>
									{/if}
								</div>
								<div class="text-right">
									<ProfileStatusBadge status={data.profileStatus} />
									{#if data.profile.work_authorization}
										<div class="mt-2">
											<WorkAuthorizationBadge 
												workAuthorization={data.profile.work_authorization}
												visaValidUntil={data.profile.visa_valid_until}
												compact={true}
											/>
										</div>
									{/if}
								</div>
							</div>
							
							{#if data.profile.representing_agency}
								<div class="pt-4 border-t">
									<p class="text-sm text-gray-600">
										<span class="font-medium">Representing Agency:</span> 
										{data.profile.representing_agency}
									</p>
								</div>
							{/if}
						</div>
					</CardContent>
				</Card>
			</div>
		{/if}
		
		<!-- Stats Grid (Business Users) -->
		{#if isBusiness}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
				{#each stats as stat}
					<Card>
						<CardContent class="p-6">
							<div class="flex items-center justify-between">
								<div>
									<p class="text-sm font-medium text-gray-600">{stat.label}</p>
									<p class="text-2xl font-bold text-gray-900">{stat.value}</p>
								</div>
								<svelte:component this={stat.icon} class="w-8 h-8 {stat.color}" />
							</div>
						</CardContent>
					</Card>
				{/each}
			</div>
		{/if}
		
		<!-- Quick Actions Grid -->
		<div class="grid md:grid-cols-2 gap-6">
			{#if isBusiness}
				<!-- Business User Actions -->
				<Card>
					<CardHeader>
						<CardTitle>Recent Activity</CardTitle>
					</CardHeader>
					<CardContent>
						<div class="space-y-4">
							<div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
								<Users class="w-5 h-5 text-blue-600" />
								<div>
									<p class="font-medium">New candidate application</p>
									<p class="text-sm text-gray-600">2 minutes ago</p>
								</div>
							</div>
							<div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
								<Briefcase class="w-5 h-5 text-green-600" />
								<div>
									<p class="font-medium">Job posting updated</p>
									<p class="text-sm text-gray-600">1 hour ago</p>
								</div>
							</div>
							<div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
								<FileText class="w-5 h-5 text-purple-600" />
								<div>
									<p class="font-medium">Interview scheduled</p>
									<p class="text-sm text-gray-600">3 hours ago</p>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
				
				<Card>
					<CardHeader>
						<CardTitle>Quick Actions</CardTitle>
					</CardHeader>
					<CardContent>
						<div class="space-y-3">
							<Button class="w-full justify-start">
								<Briefcase class="w-4 h-4 mr-2" />
								Create New Job
							</Button>
							<Button variant="outline" class="w-full justify-start">
								<Users class="w-4 h-4 mr-2" />
								Add Candidate
							</Button>
							<Button variant="outline" class="w-full justify-start">
								<FileText class="w-4 h-4 mr-2" />
								View Submissions
							</Button>
							<Button variant="outline" class="w-full justify-start">
								<Building2 class="w-4 h-4 mr-2" />
								Manage Clients
							</Button>
						</div>
					</CardContent>
				</Card>
			{:else if isCandidate}
				<!-- Candidate User Actions -->
				<Card>
					<CardHeader>
						<CardTitle>Job Search</CardTitle>
					</CardHeader>
					<CardContent>
						<div class="space-y-3">
							<Button class="w-full justify-start">
								<Briefcase class="w-4 h-4 mr-2" />
								Browse Jobs
							</Button>
							<Button variant="outline" class="w-full justify-start">
								<FileText class="w-4 h-4 mr-2" />
								My Applications
							</Button>
							<Button variant="outline" class="w-full justify-start">
								<User class="w-4 h-4 mr-2" />
								Update Profile
							</Button>
						</div>
					</CardContent>
				</Card>
				
				<Card>
					<CardHeader>
						<CardTitle>Recent Activity</CardTitle>
					</CardHeader>
					<CardContent>
						<div class="text-center py-8 text-gray-500">
							<FileText class="w-12 h-12 mx-auto mb-4 text-gray-300" />
							<p>No recent activity</p>
							<p class="text-sm">Start by browsing available jobs</p>
						</div>
					</CardContent>
				</Card>
			{/if}
		</div>
	</main>
</div>
