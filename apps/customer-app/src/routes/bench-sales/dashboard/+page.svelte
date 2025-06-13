<script lang="ts">
	import Card from '$lib/components/ui/card.svelte'
	import CardHeader from '$lib/components/ui/card-header.svelte'
	import CardTitle from '$lib/components/ui/card-title.svelte'
	import CardContent from '$lib/components/ui/card-content.svelte'
	import Button from '$lib/components/ui/button.svelte'
	import Badge from '$lib/components/ui/badge.svelte'
	import EmptyState from '$lib/components/ui/empty-state.svelte'
	import { 
		Users, 
		Building2, 
		FolderOpen, 
		TrendingUp,
		UserPlus,
		Plus,
		Search,
		DollarSign
	} from 'lucide-svelte'
	import { goto } from '$app/navigation'
	
	export let data
	
	// Calculate stats from real data
	$: availableConsultants = data.stats.consultants.find(c => c.status === 'available')?.count || 0
	$: placedConsultants = data.stats.consultants.find(c => c.status === 'placed')?.count || 0
	$: totalConsultants = data.stats.consultants.reduce((sum, consultant) => sum + consultant.count, 0)
	$: activeClients = data.stats.clients.find(c => c.status === 'active')?.count || 0
	$: totalClients = data.stats.clients.reduce((sum, client) => sum + client.count, 0)
	$: activeProjects = data.stats.projects.find(p => p.status === 'active')?.count || 0
	$: totalProjects = data.stats.projects.reduce((sum, project) => sum + project.count, 0)
	$: activePlacements = data.stats.placements.find(p => p.status === 'active')?.count || 0
	
	const quickActions = [
		{ label: 'Add Consultant', icon: UserPlus, action: () => goto('/bench-sales/consultants/new'), color: 'bg-blue-600' },
		{ label: 'New Project', icon: Plus, action: () => goto('/bench-sales/projects/new'), color: 'bg-green-600' },
		{ label: 'Find Matches', icon: Search, action: () => goto('/bench-sales/matches'), color: 'bg-purple-600' }
	]
	
	function getStatusColor(status: string): string {
		const colors = {
			'available': 'bg-green-100 text-green-800',
			'placed': 'bg-blue-100 text-blue-800',
			'unavailable': 'bg-gray-100 text-gray-800',
			'active': 'bg-green-100 text-green-800',
			'inactive': 'bg-gray-100 text-gray-800',
			'prospect': 'bg-yellow-100 text-yellow-800',
			'draft': 'bg-gray-100 text-gray-800',
			'completed': 'bg-blue-100 text-blue-800'
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
	<title>Bench Sales Dashboard - ProcureServe</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
		<div>
			<h1 class="text-2xl font-bold text-gray-900">Bench Sales Dashboard</h1>
			<p class="text-gray-600">Manage consultants, clients, and project placements</p>
		</div>
		<div class="text-sm text-gray-500">
			Welcome back, {data.user.profile?.first_name || 'Sales Rep'}
		</div>
	</div>
	
	<!-- Stats Cards -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
		<Card>
			<CardContent class="p-6">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-600">Available Consultants</p>
						<p class="text-2xl font-bold text-gray-900">{availableConsultants}</p>
						<p class="text-xs text-gray-500">of {totalConsultants} total</p>
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
						<p class="text-sm font-medium text-gray-600">Active Clients</p>
						<p class="text-2xl font-bold text-gray-900">{activeClients}</p>
						<p class="text-xs text-gray-500">of {totalClients} total</p>
					</div>
					<div class="p-3 rounded-full bg-gray-100 text-blue-600">
						<Building2 class="w-6 h-6" />
					</div>
				</div>
			</CardContent>
		</Card>
		
		<Card>
			<CardContent class="p-6">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-600">Active Projects</p>
						<p class="text-2xl font-bold text-gray-900">{activeProjects}</p>
						<p class="text-xs text-gray-500">of {totalProjects} total</p>
					</div>
					<div class="p-3 rounded-full bg-gray-100 text-purple-600">
						<FolderOpen class="w-6 h-6" />
					</div>
				</div>
			</CardContent>
		</Card>
		
		<Card>
			<CardContent class="p-6">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-medium text-gray-600">Active Placements</p>
						<p class="text-2xl font-bold text-gray-900">{activePlacements}</p>
						<p class="text-xs text-gray-500">current revenue streams</p>
					</div>
					<div class="p-3 rounded-full bg-gray-100 text-orange-600">
						<DollarSign class="w-6 h-6" />
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
				<CardTitle>Recent Projects</CardTitle>
			</CardHeader>
			<CardContent>
				{#if data.recentProjects.length > 0}
					<div class="space-y-3">
						{#each data.recentProjects as project}
							<div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
								<div>
									<p class="font-medium">{project.title}</p>
									<p class="text-sm text-gray-600">{project.clients?.name} • Created {formatDate(project.created_at)}</p>
								</div>
								<Badge class={getStatusColor(project.status)}>
									{project.status}
								</Badge>
							</div>
						{/each}
					</div>
				{:else}
					<EmptyState 
						icon={FolderOpen}
						title="No projects yet"
						description="Create your first client project to get started"
						actionText="Create Project"
						on:action={() => goto('/bench-sales/projects/new')}
					/>
				{/if}
			</CardContent>
		</Card>
		
		<Card>
			<CardHeader>
				<CardTitle>Recent Placements</CardTitle>
			</CardHeader>
			<CardContent>
				{#if data.recentPlacements.length > 0}
					<div class="space-y-3">
						{#each data.recentPlacements as placement}
							<div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
								<div>
									<p class="font-medium">{placement.consultants?.first_name} {placement.consultants?.last_name} → {placement.projects?.title}</p>
									<p class="text-sm text-gray-600">Started {formatDate(placement.start_date)}</p>
								</div>
								<Badge class={getStatusColor(placement.status)}>
									{placement.status}
								</Badge>
							</div>
						{/each}
					</div>
				{:else}
					<EmptyState 
						icon={DollarSign}
						title="No placements yet"
						description="Placements will appear here when consultants are assigned to projects"
						compact={true}
					/>
				{/if}
			</CardContent>
		</Card>
	</div>
</div>
