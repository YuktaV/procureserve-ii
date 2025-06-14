<script lang="ts">
	import type { PageData } from './$types'
	import { goto } from '$app/navigation'
	import { Search, Plus, Users, Briefcase, TrendingUp, Clock } from 'lucide-svelte'
	
	export let data: PageData
	
	function navigateToJobs() {
		goto('/jobs')
	}
	
	function navigateToCandidates() {
		goto('/candidates')
	}
	
	function navigateToApplications() {
		goto('/applications')
	}
	
	function createJob() {
		goto('/jobs/create')
	}
	
	function addCandidate() {
		goto('/candidates/create')
	}
</script>

<svelte:head>
	<title>Recruitment Dashboard - ProcureServe</title>
	<meta name="description" content="Manage your recruitment process with jobs, candidates, and applications" />
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex justify-between items-center">
		<div>
			<h1 class="text-2xl font-semibold text-gray-900">Recruitment Dashboard</h1>
			<p class="text-gray-600">Manage jobs, candidates, and applications</p>
		</div>
		<div class="flex gap-3">
			<button 
				on:click={addCandidate}
				class="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2">
				<Users class="w-4 h-4" />
				Add Candidate
			</button>
			<button 
				on:click={createJob}
				class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
				<Plus class="w-4 h-4" />
				Create Job
			</button>
		</div>
	</div>
	
	<!-- Stats Cards -->
	<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
		<div class="bg-white rounded-lg border p-6">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-gray-600">Active Jobs</p>
					<p class="text-2xl font-semibold text-gray-900">
						{data.dashboard_data.recent_jobs.filter(j => j.status === 'published').length}
					</p>
				</div>
				<div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
					<Briefcase class="w-6 h-6 text-blue-600" />
				</div>
			</div>
		</div>
		
		<div class="bg-white rounded-lg border p-6">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-gray-600">Active Candidates</p>
					<p class="text-2xl font-semibold text-gray-900">
						{data.dashboard_data.recent_candidates.filter(c => c.status === 'active').length}
					</p>
				</div>
				<div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
					<Users class="w-6 h-6 text-green-600" />
				</div>
			</div>
		</div>
		
		<div class="bg-white rounded-lg border p-6">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-gray-600">Pending Applications</p>
					<p class="text-2xl font-semibold text-gray-900">
						{data.dashboard_data.recent_applications.filter(a => a.status === 'pending').length}
					</p>
				</div>
				<div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
					<Clock class="w-6 h-6 text-orange-600" />
				</div>
			</div>
		</div>
	</div>
	
	<!-- Recent Activity -->
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
		<!-- Recent Jobs -->
		<div class="bg-white rounded-lg border">
			<div class="p-6 border-b">
				<div class="flex justify-between items-center">
					<h2 class="text-lg font-semibold">Recent Jobs</h2>
					<button 
						on:click={navigateToJobs}
						class="text-blue-600 hover:text-blue-700 text-sm">
						View all
					</button>
				</div>
			</div>
			<div class="p-6">
				{#if data.dashboard_data.recent_jobs.length > 0}
					<div class="space-y-4">
						{#each data.dashboard_data.recent_jobs as job}
							<div class="flex items-center justify-between">
								<div>
									<p class="font-medium text-gray-900">{job.title}</p>
									<p class="text-sm text-gray-500">
										{new Date(job.created_at).toLocaleDateString()}
									</p>
								</div>
								<span class="bg-{job.status === 'published' ? 'green' : job.status === 'draft' ? 'yellow' : 'gray'}-100 
								           text-{job.status === 'published' ? 'green' : job.status === 'draft' ? 'yellow' : 'gray'}-800 
								           px-2 py-1 rounded-full text-xs font-medium">
									{job.status}
								</span>
							</div>
						{/each}
					</div>
				{:else}
					<div class="text-center py-8 text-gray-500">
						<Briefcase class="w-12 h-12 mx-auto mb-4 text-gray-300" />
						<p>No jobs yet</p>
						<button 
							on:click={createJob}
							class="mt-2 text-blue-600 hover:text-blue-700 text-sm">
							Create your first job
						</button>
					</div>
				{/if}
			</div>
		</div>
		
		<!-- Recent Candidates -->
		<div class="bg-white rounded-lg border">
			<div class="p-6 border-b">
				<div class="flex justify-between items-center">
					<h2 class="text-lg font-semibold">Recent Candidates</h2>
					<button 
						on:click={navigateToCandidates}
						class="text-blue-600 hover:text-blue-700 text-sm">
						View all
					</button>
				</div>
			</div>
			<div class="p-6">
				{#if data.dashboard_data.recent_candidates.length > 0}
					<div class="space-y-4">
						{#each data.dashboard_data.recent_candidates as candidate}
							<div class="flex items-center justify-between">
								<div>
									<p class="font-medium text-gray-900">{candidate.name}</p>
									<p class="text-sm text-gray-500">{candidate.email}</p>
								</div>
								<span class="bg-{candidate.status === 'active' ? 'green' : 'gray'}-100 
								           text-{candidate.status === 'active' ? 'green' : 'gray'}-800 
								           px-2 py-1 rounded-full text-xs font-medium">
									{candidate.status}
								</span>
							</div>
						{/each}
					</div>
				{:else}
					<div class="text-center py-8 text-gray-500">
						<Users class="w-12 h-12 mx-auto mb-4 text-gray-300" />
						<p>No candidates yet</p>
						<button 
							on:click={addCandidate}
							class="mt-2 text-blue-600 hover:text-blue-700 text-sm">
							Add your first candidate
						</button>
					</div>
				{/if}
			</div>
		</div>
	</div>
	
	<!-- Quick Actions -->
	<div class="bg-white rounded-lg border p-6">
		<h2 class="text-lg font-semibold mb-4">Quick Actions</h2>
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
			<button 
				on:click={createJob}
				class="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group">
				<div class="text-center">
					<div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200">
						<Plus class="w-6 h-6 text-blue-600" />
					</div>
					<p class="font-medium text-gray-900">Create Job</p>
					<p class="text-sm text-gray-500">Post a new position</p>
				</div>
			</button>
			
			<button 
				on:click={addCandidate}
				class="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors group">
				<div class="text-center">
					<div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-green-200">
						<Users class="w-6 h-6 text-green-600" />
					</div>
					<p class="font-medium text-gray-900">Add Candidate</p>
					<p class="text-sm text-gray-500">Source new talent</p>
				</div>
			</button>
			
			<button 
				on:click={navigateToJobs}
				class="p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors group">
				<div class="text-center">
					<div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-orange-200">
						<Search class="w-6 h-6 text-orange-600" />
					</div>
					<p class="font-medium text-gray-900">Search Jobs</p>
					<p class="text-sm text-gray-500">Find positions</p>
				</div>
			</button>
			
			<button 
				on:click={navigateToApplications}
				class="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors group">
				<div class="text-center">
					<div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-200">
						<TrendingUp class="w-6 h-6 text-purple-600" />
					</div>
					<p class="font-medium text-gray-900">View Applications</p>
					<p class="text-sm text-gray-500">Track progress</p>
				</div>
			</button>
		</div>
	</div>
</div>
