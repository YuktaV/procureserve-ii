<script lang="ts">
  import { page } from '$app/stores'
  import { goto } from '$app/navigation'
  import Card from '$lib/components/ui/card.svelte'
  import CardHeader from '$lib/components/ui/card-header.svelte'
  import CardTitle from '$lib/components/ui/card-title.svelte'
  import CardContent from '$lib/components/ui/card-content.svelte'
  import Button from '$lib/components/ui/button.svelte'
  import { 
    Briefcase,
    Users,
    Calendar,
    TrendingUp,
    CheckCircle,
    Clock,
    Building2,
    UserCheck,
    FileText,
    Target
  } from 'lucide-svelte'

  export let data

  $: ({ user, userType, profile, company, currentProcess, availableProcesses, dashboardData } = data)

  // Process switching for business users
  async function switchProcess(newProcess: string) {
    try {
      const response = await fetch('/api/user/switch-process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ process: newProcess })
      })
      
      if (response.ok) {
        // Reload the page to get new dashboard data
        location.reload()
      }
    } catch (error) {
      console.error('Error switching process:', error)
    }
  }
</script>

<svelte:head>
  <title>Dashboard - ProcuReServe</title>
</svelte:head>

<!-- Process Switcher for Business Users -->
{#if userType === 'business' && availableProcesses?.length > 1}
  <div class="mb-6">
    <div class="bg-white rounded-lg border p-4">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="font-medium text-gray-900">Current Process</h3>
          <p class="text-sm text-gray-500">
            {currentProcess === 'recruitment' ? 'Recruitment' : 'Bench Sales'}
          </p>
        </div>
        <div class="flex gap-2">
          {#each availableProcesses as process}
            <Button
              variant={currentProcess === process ? 'default' : 'outline'}
              size="sm"
              on:click={() => switchProcess(process)}
              class="capitalize"
            >
              {process === 'recruitment' ? 'Recruitment' : 'Bench Sales'}
            </Button>
          {/each}
        </div>
      </div>
    </div>
  </div>
{/if}

<!-- Welcome Section -->
<div class="mb-8">
  <h1 class="text-2xl font-bold text-gray-900 mb-2">
    Welcome back, {user.email}!
  </h1>
  {#if userType === 'candidate'}
    <p class="text-gray-600">Here's your job search overview and recent activity.</p>
  {:else if userType === 'business'}
    <p class="text-gray-600">
      Here's your {currentProcess === 'recruitment' ? 'recruitment' : 'bench sales'} dashboard overview.
    </p>
  {/if}
</div>

<!-- Candidate Dashboard -->
{#if userType === 'candidate'}
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
    <Card>
      <CardHeader class="pb-2">
        <CardTitle class="text-lg">Profile Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="flex items-center gap-3">
          {#if data.profileStatus === 'full_complete'}
            <CheckCircle class="w-8 h-8 text-green-500" />
            <div>
              <p class="font-medium text-green-700">Complete</p>
              <p class="text-sm text-gray-500">Profile is ready</p>
            </div>
          {:else}
            <Clock class="w-8 h-8 text-yellow-500" />
            <div>
              <p class="font-medium text-yellow-700">Incomplete</p>
              <p class="text-sm text-gray-500">Complete your profile</p>
            </div>
          {/if}
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader class="pb-2">
        <CardTitle class="text-lg">Applications</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="flex items-center gap-3">
          <FileText class="w-8 h-8 text-blue-500" />
          <div>
            <p class="text-2xl font-bold">{dashboardData?.my_applications?.length || 0}</p>
            <p class="text-sm text-gray-500">Active applications</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader class="pb-2">
        <CardTitle class="text-lg">Available Jobs</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="flex items-center gap-3">
          <Briefcase class="w-8 h-8 text-purple-500" />
          <div>
            <p class="text-2xl font-bold">{dashboardData?.available_jobs?.length || 0}</p>
            <p class="text-sm text-gray-500">New opportunities</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>

  <!-- Recent Applications -->
  {#if dashboardData?.my_applications?.length > 0}
    <Card class="mb-6">
      <CardHeader>
        <CardTitle>Recent Applications</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          {#each dashboardData.my_applications as application}
            <div class="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 class="font-medium">{application.jobs?.title}</h4>
                <p class="text-sm text-gray-500">{application.jobs?.companies?.name}</p>
              </div>
              <div class="text-right">
                <span class="inline-flex px-2 py-1 text-xs font-medium rounded-full
                  {application.status === 'applied' ? 'bg-blue-100 text-blue-800' :
                   application.status === 'interview' ? 'bg-yellow-100 text-yellow-800' :
                   application.status === 'hired' ? 'bg-green-100 text-green-800' :
                   'bg-gray-100 text-gray-800'}">
                  {application.status}
                </span>
                <p class="text-xs text-gray-500 mt-1">
                  {new Date(application.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          {/each}
        </div>
      </CardContent>
    </Card>
  {/if}

  <!-- Available Jobs -->
  {#if dashboardData?.available_jobs?.length > 0}
    <Card>
      <CardHeader>
        <CardTitle>Latest Job Opportunities</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          {#each dashboardData.available_jobs as job}
            <div class="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 class="font-medium">{job.title}</h4>
                <p class="text-sm text-gray-500">{job.companies?.name}</p>
                <p class="text-xs text-gray-400">{job.employment_type}</p>
              </div>
              <div class="text-right">
                <Button size="sm" on:click={() => goto(`/jobs/${job.id}`)}>
                  View Details
                </Button>
                <p class="text-xs text-gray-500 mt-1">
                  {new Date(job.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          {/each}
        </div>
      </CardContent>
    </Card>
  {/if}

<!-- Business Dashboard -->
{:else if userType === 'business'}
  
  <!-- Recruitment Dashboard -->
  {#if currentProcess === 'recruitment'}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-lg">Active Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="flex items-center gap-3">
            <Briefcase class="w-8 h-8 text-blue-500" />
            <div>
              <p class="text-2xl font-bold">{dashboardData?.recent_jobs?.length || 0}</p>
              <p class="text-sm text-gray-500">Posted jobs</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-lg">Candidates</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="flex items-center gap-3">
            <Users class="w-8 h-8 text-green-500" />
            <div>
              <p class="text-2xl font-bold">{dashboardData?.recent_candidates?.length || 0}</p>
              <p class="text-sm text-gray-500">In pipeline</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-lg">Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="flex items-center gap-3">
            <FileText class="w-8 h-8 text-purple-500" />
            <div>
              <p class="text-2xl font-bold">{dashboardData?.recent_applications?.length || 0}</p>
              <p class="text-sm text-gray-500">Total received</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

  <!-- Bench Sales Dashboard -->
  {:else if currentProcess === 'bench_sales'}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-lg">Bench Candidates</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="flex items-center gap-3">
            <UserCheck class="w-8 h-8 text-blue-500" />
            <div>
              <p class="text-2xl font-bold">{dashboardData?.bench_candidates?.length || 0}</p>
              <p class="text-sm text-gray-500">Available</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-lg">Opportunities</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="flex items-center gap-3">
            <Target class="w-8 h-8 text-green-500" />
            <div>
              <p class="text-2xl font-bold">{dashboardData?.project_opportunities?.length || 0}</p>
              <p class="text-sm text-gray-500">Projects</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="pb-2">
          <CardTitle class="text-lg">Placements</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="flex items-center gap-3">
            <TrendingUp class="w-8 h-8 text-purple-500" />
            <div>
              <p class="text-2xl font-bold">{dashboardData?.recent_placements?.length || 0}</p>
              <p class="text-sm text-gray-500">This month</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  {/if}

  <!-- Recent Activity Section -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {#if currentProcess === 'recruitment'}
      <!-- Recent Jobs -->
      {#if dashboardData?.recent_jobs?.length > 0}
        <Card>
          <CardHeader>
            <CardTitle>Recent Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-3">
              {#each dashboardData.recent_jobs as job}
                <div class="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 class="font-medium">{job.title}</h4>
                    <p class="text-sm text-gray-500 capitalize">{job.status}</p>
                  </div>
                  <p class="text-xs text-gray-400">
                    {new Date(job.created_at).toLocaleDateString()}
                  </p>
                </div>
              {/each}
            </div>
          </CardContent>
        </Card>
      {/if}

      <!-- Recent Applications -->
      {#if dashboardData?.recent_applications?.length > 0}
        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-3">
              {#each dashboardData.recent_applications as application}
                <div class="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 class="font-medium">{application.candidates?.name}</h4>
                    <p class="text-sm text-gray-500">{application.jobs?.title}</p>
                  </div>
                  <div class="text-right">
                    <span class="inline-flex px-2 py-1 text-xs font-medium rounded-full
                      {application.status === 'applied' ? 'bg-blue-100 text-blue-800' :
                       application.status === 'interview' ? 'bg-yellow-100 text-yellow-800' :
                       application.status === 'hired' ? 'bg-green-100 text-green-800' :
                       'bg-gray-100 text-gray-800'}">
                      {application.status}
                    </span>
                  </div>
                </div>
              {/each}
            </div>
          </CardContent>
        </Card>
      {/if}

    {:else if currentProcess === 'bench_sales'}
      <!-- Bench Candidates -->
      {#if dashboardData?.bench_candidates?.length > 0}
        <Card>
          <CardHeader>
            <CardTitle>Available Bench Candidates</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-3">
              {#each dashboardData.bench_candidates as candidate}
                <div class="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 class="font-medium">{candidate.name}</h4>
                    <p class="text-sm text-gray-500">{candidate.skills}</p>
                  </div>
                  <p class="text-xs text-gray-400">
                    {new Date(candidate.created_at).toLocaleDateString()}
                  </p>
                </div>
              {/each}
            </div>
          </CardContent>
        </Card>
      {/if}

      <!-- Recent Placements -->
      {#if dashboardData?.recent_placements?.length > 0}
        <Card>
          <CardHeader>
            <CardTitle>Recent Placements</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-3">
              {#each dashboardData.recent_placements as placement}
                <div class="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 class="font-medium">{placement.candidates?.name}</h4>
                    <p class="text-sm text-gray-500">{placement.jobs?.title}</p>
                  </div>
                  <div class="text-right">
                    <span class="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      Placed
                    </span>
                  </div>
                </div>
              {/each}
            </div>
          </CardContent>
        </Card>
      {/if}
    {/if}
  </div>
{/if}
