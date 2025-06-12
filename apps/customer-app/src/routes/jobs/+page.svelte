<script lang="ts">
  import type { PageData } from './$types'
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  
  export let data: PageData
  
  let searchQuery = ''
  let statusFilter = data.filters.status || 'all'
  let locationTypeFilter = data.filters.location_type || 'all'
  
  // Filter jobs locally
  $: filteredJobs = data.jobs.filter(job => {
    const matchesSearch = searchQuery === '' || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter
    
    const matchesLocationType = locationTypeFilter === 'all' ||
      job.locations?.some(loc => loc.location_type === locationTypeFilter)
    
    return matchesSearch && matchesStatus && matchesLocationType
  })
  
  function createJob() {
    goto('/jobs/create')
  }
  
  function viewJob(jobId: string) {
    goto(`/jobs/${jobId}`)
  }
  
  function editJob(jobId: string) {
    goto(`/jobs/${jobId}/edit`)
  }
  
  function getLocationSummary(job: any) {
    if (!job.locations?.length) return 'No locations'
    
    const types = [...new Set(job.locations.map((l: any) => l.location_type))]
    const cities = [...new Set(job.locations
      .filter((l: any) => l.city)
      .map((l: any) => l.city))]
    
    if (types.includes('remote')) return 'Remote'
    if (types.includes('hybrid')) return `Hybrid (${cities.join(', ')})`
    return cities.join(', ') || 'Office locations'
  }
</script>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex justify-between items-center">
    <div>
      <h1 class="text-2xl font-semibold text-gray-900">Jobs</h1>
      <p class="text-gray-600">Manage your job postings and track applications</p>
    </div>
    <button 
      on:click={createJob}
      class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
      Create Job
    </button>
  </div>
</div>
                Edit
              </button>
            </div>
          </div>
        </div>
      {/each}
    </div>
    
    <!-- Pagination -->
    {#if data.pagination.total > data.pagination.limit}
      <div class="flex justify-center mt-8">
        <div class="flex items-center gap-2">
          {#if data.pagination.page > 1}
            <a href="?page={data.pagination.page - 1}" 
               class="px-3 py-2 border rounded-lg hover:bg-gray-50">
              Previous
            </a>
          {/if}
          
          <span class="px-3 py-2 text-sm text-gray-600">
            Page {data.pagination.page} of {Math.ceil(data.pagination.total / data.pagination.limit)}
          </span>
          
          {#if data.pagination.has_more}
            <a href="?page={data.pagination.page + 1}" 
               class="px-3 py-2 border rounded-lg hover:bg-gray-50">
              Next
            </a>
          {/if}
        </div>
      </div>
    {/if}
  {/if}
