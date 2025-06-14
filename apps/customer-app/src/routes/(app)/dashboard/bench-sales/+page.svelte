="w-12 h-12 mx-auto mb-4 text-gray-300" />
						<p>No bench candidates yet</p>
						<button 
							on:click={addBenchCandidate}
							class="mt-2 text-green-600 hover:text-green-700 text-sm">
							Add your first bench candidate
						</button>
					</div>
				{/if}
			</div>
		</div>
		
		<!-- Project Opportunities -->
		<div class="bg-white rounded-lg border">
			<div class="p-6 border-b">
				<div class="flex justify-between items-center">
					<h2 class="text-lg font-semibold">Project Opportunities</h2>
					<button 
						on:click={navigateToProjects}
						class="text-blue-600 hover:text-blue-700 text-sm">
						View all
					</button>
				</div>
			</div>
			<div class="p-6">
				{#if data.dashboard_data.project_opportunities.length > 0}
					<div class="space-y-4">
						{#each data.dashboard_data.project_opportunities as project}
							<div class="flex items-center justify-between">
								<div>
									<p class="font-medium text-gray-900">{project.title}</p>
									<p class="text-sm text-gray-500">
										{project.employment_type} • {new Date(project.created_at).toLocaleDateString()}
									</p>
								</div>
								<span class="bg-{project.status === 'published' ? 'blue' : project.status === 'draft' ? 'yellow' : 'gray'}-100 
								           text-{project.status === 'published' ? 'blue' : project.status === 'draft' ? 'yellow' : 'gray'}-800 
								           px-2 py-1 rounded-full text-xs font-medium">
									{project.status}
								</span>
							</div>
						{/each}
					</div>
				{:else}
					<div class="text-center py-8 text-gray-500">
						<Target class="w-12 h-12 mx-auto mb-4 text-gray-300" />
						<p>No project opportunities yet</p>
						<button 
							on:click={searchProjects}
							class="mt-2 text-blue-600 hover:text-blue-700 text-sm">
							Search for projects
						</button>
					</div>
				{/if}
			</div>
		</div>
	</div>
	
	<!-- Recent Placements -->
	{#if data.dashboard_data.recent_placements.length > 0}
		<div class="bg-white rounded-lg border">
			<div class="p-6 border-b">
				<div class="flex justify-between items-center">
					<h2 class="text-lg font-semibold">Recent Placements</h2>
					<button 
						on:click={navigateToPlacements}
						class="text-purple-600 hover:text-purple-700 text-sm">
						View all
					</button>
				</div>
			</div>
			<div class="p-6">
				<div class="space-y-4">
					{#each data.dashboard_data.recent_placements as placement}
						<div class="flex items-center justify-between">
							<div>
								<p class="font-medium text-gray-900">
									{placement.candidates?.name} → {placement.jobs?.title}
								</p>
								<p class="text-sm text-gray-500">
									{placement.jobs?.employment_type} • {new Date(placement.created_at).toLocaleDateString()}
								</p>
							</div>
							<span class="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
								Placed
							</span>
						</div>
					{/each}
				</div>
			</div>
		</div>
	{/if}
	
	<!-- Quick Actions -->
	<div class="bg-white rounded-lg border p-6">
		<h2 class="text-lg font-semibold mb-4">Quick Actions</h2>
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
			<button 
				on:click={addBenchCandidate}
				class="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors group">
				<div class="text-center">
					<div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-green-200">
						<Plus class="w-6 h-6 text-green-600" />
					</div>
					<p class="font-medium text-gray-900">Add Candidate</p>
					<p class="text-sm text-gray-500">Add to bench</p>
				</div>
			</button>
			
			<button 
				on:click={searchProjects}
				class="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group">
				<div class="text-center">
					<div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200">
						<Search class="w-6 h-6 text-blue-600" />
					</div>
					<p class="font-medium text-gray-900">Find Projects</p>
					<p class="text-sm text-gray-500">Search opportunities</p>
				</div>
			</button>
			
			<button 
				on:click={navigateToBenchCandidates}
				class="p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors group">
				<div class="text-center">
					<div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-orange-200">
						<Users class="w-6 h-6 text-orange-600" />
					</div>
					<p class="font-medium text-gray-900">Manage Bench</p>
					<p class="text-sm text-gray-500">View candidates</p>
				</div>
			</button>
			
			<button 
				on:click={navigateToPlacements}
				class="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors group">
				<div class="text-center">
					<div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-200">
						<Award class="w-6 h-6 text-purple-600" />
					</div>
					<p class="font-medium text-gray-900">Track Placements</p>
					<p class="text-sm text-gray-500">Monitor success</p>
				</div>
			</button>
		</div>
	</div>
</div>
