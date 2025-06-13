<script lang="ts">
	import Card from '$lib/components/ui/card.svelte'
	import CardHeader from '$lib/components/ui/card-header.svelte'
	import CardTitle from '$lib/components/ui/card-title.svelte'
	import CardContent from '$lib/components/ui/card-content.svelte'
	import Button from '$lib/components/ui/button.svelte'
	import Badge from '$lib/components/ui/badge.svelte'
	import EmptyState from '$lib/components/ui/empty-state.svelte'
	import { 
		Briefcase, 
		Users, 
		FileText, 
		TrendingUp,
		Search,
		Plus,
		UserPlus,
		Calendar
	} from 'lucide-svelte'
	import { goto } from '$app/navigation'
	
	export let data
	
	// Calculate stats from real data
	$: totalJobs = data.stats.jobs.reduce((sum, job) => sum + job.count, 0)
	$: activeJobs = data.stats.jobs.find(j => j.status === 'active')?.count || 0
	$: totalCandidates = data.stats.candidates.reduce((sum, candidate) => sum + candidate.count, 0)
	$: activeCandidates = data.stats.candidates.find(c => c.status === 'active')?.count || 0
	$: totalApplications = data.stats.applications.reduce((sum, app) => sum + app.count, 0)
	$: thisMonthPlacements = data.stats.applications.find(a => a.status === 'hired')?.count || 0
	
	const quickActions = [
		{ label: 'Post New Job', icon: Plus, action: () => goto('/recruitment/jobs/new'), color: 'bg-blue-600' },
		{ label: 'Add Candidate', icon: UserPlus, action: () => goto('/recruitment/candidates/new'), color: 'bg-green-600' },
		{ label: 'Search Candidates', icon: Search, action: () => goto('/recruitment/candidates'), color: 'bg-purple-600' }
	]
	
	function getStatusColor(status: string): string {
		const colors = {
			'active': 'bg-green-100 text-green-800',
			'draft': 'bg-gray-100 text-gray-800', 
			'paused': 'bg-yellow-100 text-yellow-800',
			'filled': 'bg-blue-100 text-blue-800',
			'applied': 'bg-blue-100 text-blue-800',
			'screening': 'bg-yellow-100 text-yellow-800',
			'interview': 'bg-purple-100 text-purple-800',
			'hired': 'bg-green-100 text-green-800'
		}
		return colors[status] || 'bg-gray-100 text-gray-800'
	}
	
	function formatDate(dateString: string): string {
		const date = new Date(dateString)
		const now = new Date()
		const diffTime = Math.abs(now.getTime() - date.getTime())
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
		
		if (diffDays === 1) return 'Today'
		if (diffDays === 2) return 'Yesterday'
		if (diffDays <= 7) return `${diffDays - 1} days ago`
		return date.toLocaleDateString()
	}
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
		<Card>
			<CardContent class="p-6">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-600">Active Jobs</p>
						<p class="text-2xl font-bold text-gray-900">{activeJobs}</p>
					</div>
					<div class="p-3 rounded-full bg-gray-100 text-blue-600">
						<Briefcase class="w-6 h-6" />
					</div>
				</div>
			</CardContent>
		</Card>
		
		<Card>
			<CardContent class="p-6">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-600">Active Candidates</p>
						<p class="text-2xl font-bold text-gray-900">{activeCandidates}</p>
					</div>
					<div class="p-3 rounded-full bg-gray-100 text-green-600">
						<Users class="w-6 h-6" />
					</div>
				</div>
			</CardContent>
		</Card>
		
		<Card>
			<CardContent class="p-6">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-600">Total Applications</p>
						<p class="text-2xl font-bold text-gray-900">{totalApplications}</p>
					</div>
					<div class="p-3 rounded-full bg-gray-100 text-purple-600">
						<FileText class="w-6 h-6" />
					</div>
				</div>
			</CardContent>
		</Card>
		
		<Card>
			<CardContent class="p-6">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-600">Placements This Month</p>
						<p class="text-2xl font-bold text-gray-900">{thisMonthPlacements}</p>
					</div>
					<div class="p-3 rounded-full bg-gray-100 text-orange-600">
						<TrendingUp class="w-6 h-6" />
					</div>
				</div>
			</CardContent>
		</Card>
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
				{#if data.recentJobs.length > 0}
					<div class="space-y-3">
						{#each data.recentJobs as job}
							<div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
								<div>
									<p class="font-medium">{job.title}</p>
									<p class="text-sm text-gray-600">Posted {formatDate(job.created_at)}</p>
								</div>
								<Badge class={getStatusColor(job.status)}>
									{job.status}
								</Badge>
							</div>
						{/each}
					</div>
				{:else}
					<EmptyState 
						icon={Briefcase}
						title="No jobs yet"
						description="Create your first job posting to get started"
						actionText="Create Job"
						on:action={() => goto('/recruitment/jobs/new')}
					/>
				{/if}
			</CardContent>
		</Card>
		
		<Card>
			<CardHeader>
				<CardTitle>Recent Submissions</CardTitle>
			</CardHeader>
			<CardContent>
				{#if data.recentSubmissions.length > 0}
					<div class="space-y-3">
						{#each data.recentSubmissions as submission}
							<div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
								<div>
									<p class="font-medium">{submission.candidates?.name} → {submission.jobs?.title}</p>
									<p class="text-sm text-gray-600">Submitted {formatDate(submission.created_at)}</p>
								</div>
								<Badge class={getStatusColor(submission.status)}>
									{submission.status}
								</Badge>
							</div>
						{/each}
					</div>
				{:else}
					<EmptyState 
						icon={FileText}
						title="No submissions yet"
						description="Applications will appear here when candidates apply"
						compact={true}
					/>
				{/if}
			</CardContent>
		</Card>
	</div>
</div>
