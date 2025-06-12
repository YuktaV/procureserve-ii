<script lang="ts">
	import Card from '$lib/components/ui/card.svelte'
	import CardHeader from '$lib/components/ui/card-header.svelte'
	import CardTitle from '$lib/components/ui/card-title.svelte'
	import CardContent from '$lib/components/ui/card-content.svelte'
	import Button from '$lib/components/ui/button.svelte'
	import { 
		Briefcase, 
		Users, 
		FileText, 
		TrendingUp,
		Search,
		Plus,
		UserPlus
	} from 'lucide-svelte'
	import { goto } from '$app/navigation'
	
	export let data
	
	// Mock recruitment dashboard data
	const stats = [
		{ label: 'Active Jobs', value: '8', icon: Briefcase, color: 'text-blue-600' },
		{ label: 'New Candidates', value: '24', icon: Users, color: 'text-green-600' },
		{ label: 'Active Submissions', value: '15', icon: FileText, color: 'text-purple-600' },
		{ label: 'Placements This Month', value: '3', icon: TrendingUp, color: 'text-orange-600' }
	]
	
	const quickActions = [
		{ label: 'Post New Job', icon: Plus, action: () => goto('/jobs/new'), color: 'bg-blue-600' },
		{ label: 'Add Candidate', icon: UserPlus, action: () => goto('/candidates/new'), color: 'bg-green-600' },
		{ label: 'Search Candidates', icon: Search, action: () => goto('/candidates'), color: 'bg-purple-600' }
	]
</script>

<svelte:head>
	<title>Recruitment Dashboard - ProcureServe</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
		<div>
			<h1 class="text-2xl font-bold text-gray-900">Recruitment Dashboard</h1>
			<p class="text-gray-600">Manage job postings, candidates, and placements</p>
		</div>
		<div class="text-sm text-gray-500">
			Welcome back, {data.user.profile?.first_name || 'Recruiter'}
		</div>
	</div>
	
	<!-- Stats Cards -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
		{#each stats as stat}
			<Card>
				<CardContent class="p-6">
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm font-medium text-gray-600">{stat.label}</p>
							<p class="text-2xl font-bold text-gray-900">{stat.value}</p>
						</div>
						<div class={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
							<svelte:component this={stat.icon} class="w-6 h-6" />
						</div>
					</div>
				</CardContent>
			</Card>
		{/each}
	</div>
	
	<!-- Quick Actions -->
	<Card>
		<CardHeader>
			<CardTitle>Quick Actions</CardTitle>
		</CardHeader>
		<CardContent>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
				{#each quickActions as action}
					<Button
						variant="outline"
						class="h-20 flex flex-col gap-2 {action.color} text-white border-none hover:opacity-90"
						on:click={action.action}
					>
						<svelte:component this={action.icon} class="w-6 h-6" />
						<span class="text-sm font-medium">{action.label}</span>
					</Button>
				{/each}
			</div>
		</CardContent>
	</Card>
	
	<!-- Recent Activity -->
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
		<Card>
			<CardHeader>
				<CardTitle>Recent Jobs</CardTitle>
			</CardHeader>
			<CardContent>
				<div class="space-y-3">
					<div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
						<div>
							<p class="font-medium">Senior React Developer</p>
							<p class="text-sm text-gray-600">Posted 2 days ago</p>
						</div>
						<span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
					</div>
					<div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
						<div>
							<p class="font-medium">Product Manager</p>
							<p class="text-sm text-gray-600">Posted 5 days ago</p>
						</div>
						<span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Draft</span>
					</div>
				</div>
			</CardContent>
		</Card>
		
		<Card>
			<CardHeader>
				<CardTitle>Recent Submissions</CardTitle>
			</CardHeader>
			<CardContent>
				<div class="space-y-3">
					<div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
						<div>
							<p class="font-medium">John Smith → Senior React Developer</p>
							<p class="text-sm text-gray-600">Submitted today</p>
						</div>
						<span class="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Pending</span>
					</div>
					<div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
						<div>
							<p class="font-medium">Sarah Johnson → Product Manager</p>
							<p class="text-sm text-gray-600">Submitted yesterday</p>
						</div>
						<span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Interview</span>
					</div>
				</div>
			</CardContent>
		</Card>
	</div>
</div>
