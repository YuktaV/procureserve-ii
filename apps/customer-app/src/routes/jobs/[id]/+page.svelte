<script lang="ts">
  import type { PageData } from './$types'
  import { goto } from '$app/navigation'
  
  export let data: PageData
  
  function editJob() {
    goto(`/jobs/${data.job.id}/edit`)
  }
  
  function goBack() {
    goto('/jobs')
  }
  
  function getLocationDisplay(location: any) {
    if (location.location_type === 'remote') return 'Remote'
    if (location.city && location.country) return `${location.city}, ${location.country}`
    if (location.city) return location.city
    if (location.country) return location.country
    return `${location.location_type} location`
  }
  
  function getCompensationDisplay(comp: any) {
    if (!comp.salary_min && !comp.salary_max) return 'Not specified'
    
    const min = comp.salary_min ? `${comp.salary_currency} ${comp.salary_min.toLocaleString()}` : ''
    const max = comp.salary_max ? `${comp.salary_currency} ${comp.salary_max.toLocaleString()}` : ''
    
    if (min && max) return `${min} - ${max} ${comp.salary_frequency}`
    if (min) return `From ${min} ${comp.salary_frequency}`
    if (max) return `Up to ${max} ${comp.salary_frequency}`
    return 'Not specified'
  }
</script>

{#if data.error}
  <div class="max-w-4xl mx-auto">
    <div class="bg-red-50 border border-red-200 rounded-lg p-4">
      <p class="text-red-600">Error loading job: {data.error}</p>
      <button on:click={goBack} class="text-blue-600 hover:text-blue-700 mt-2">
        ← Back to Jobs
      </button>
    </div>
  </div>
{:else if data.job}
  <div class="max-w-4xl mx-auto">
    <!-- Header -->
    <div class="mb-6">
      <button on:click={goBack} class="text-blue-600 hover:text-blue-700 mb-2">
        ← Back to Jobs
      </button>
      
      <div class="flex justify-between items-start">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <h1 class="text-2xl font-semibold">{data.job.title}</h1>
            <span class="bg-{data.job.status === 'published' ? 'green' : data.job.status === 'draft' ? 'yellow' : 'gray'}-100 
                         text-{data.job.status === 'published' ? 'green' : data.job.status === 'draft' ? 'yellow' : 'gray'}-800 
                         px-3 py-1 rounded-full text-sm font-medium">
              {data.job.status}
            </span>
          </div>
          
          <div class="flex items-center gap-4 text-gray-600">
            <span>{data.job.employment_type}</span>
            <span>•</span>
            <span>{data.job.experience_level}</span>
            {#if data.job.department}
              <span>•</span>
              <span>{data.job.department}</span>
            {/if}
          </div>
        </div>
        
        <button 
          on:click={editJob}
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
          Edit Job
        </button>
      </div>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Description -->
        <div class="bg-white rounded-lg border p-6">
          <h2 class="text-lg font-semibold mb-4">Job Description</h2>
          <div class="prose max-w-none">
            <p class="whitespace-pre-wrap">{data.job.description}</p>
          </div>
        </div>
        
        <!-- Requirements -->
        <div class="bg-white rounded-lg border p-6">
          <h2 class="text-lg font-semibold mb-4">Requirements</h2>
          
          {#if data.job.requirements?.skills_required?.length}
            <div class="mb-4">
              <h3 class="font-medium mb-2">Required Skills</h3>
              <div class="flex flex-wrap gap-2">
                {#each data.job.requirements.skills_required as skill}
                  <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">{skill}</span>
                {/each}
              </div>
            </div>
          {/if}
          
          {#if data.job.requirements?.skills_preferred?.length}
            <div class="mb-4">
              <h3 class="font-medium mb-2">Preferred Skills</h3>
              <div class="flex flex-wrap gap-2">
                {#each data.job.requirements.skills_preferred as skill}
                  <span class="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">{skill}</span>
                {/each}
              </div>
            </div>
          {/if}
          
          {#if data.job.requirements?.education}
            <div class="mb-4">
              <h3 class="font-medium mb-2">Education</h3>
              <p class="text-gray-600">{data.job.requirements.education}</p>
            </div>
          {/if}
          
          {#if data.job.requirements?.experience_years}
            <div>
              <h3 class="font-medium mb-2">Experience</h3>
              <p class="text-gray-600">{data.job.requirements.experience_years} years</p>
            </div>
          {/if}
        </div>
      </div>
      
      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Locations -->
        <div class="bg-white rounded-lg border p-6">
          <h2 class="text-lg font-semibold mb-4">Locations</h2>
          <div class="space-y-3">
            {#each data.job.locations || [] as location}
              <div class="border-l-4 border-blue-500 pl-3">
                <div class="flex items-center gap-2 mb-1">
                  <span class="font-medium">{getLocationDisplay(location)}</span>
                  {#if location.is_primary}
                    <span class="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">Primary</span>
                  {/if}
                </div>
                
                <div class="text-sm text-gray-600 space-y-1">
                  <p>Type: {location.location_type}</p>
                  <p>Headcount: {location.headcount}</p>
                  
                  {#if location.hybrid_days_in_office}
                    <p>Office days: {location.hybrid_days_in_office}/week</p>
                  {/if}
                  
                  <div class="flex gap-2 mt-2">
                    {#if location.visa_sponsorship_available}
                      <span class="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs">Visa sponsorship</span>
                    {/if}
                    {#if location.relocation_assistance_available}
                      <span class="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-xs">Relocation assist</span>
                    {/if}
                  </div>
                </div>
              </div>
            {/each}
          </div>
        </div>
        
        <!-- Compensation -->
        {#if data.job.compensation?.length}
          <div class="bg-white rounded-lg border p-6">
            <h2 class="text-lg font-semibold mb-4">Compensation</h2>
            <div class="space-y-3">
              {#each data.job.compensation as comp, index}
                <div class="border-l-4 border-green-500 pl-3">
                  <p class="font-medium">{getLocationDisplay(data.job.locations?.[index])}</p>
                  <p class="text-gray-600">{getCompensationDisplay(comp)}</p>
                  
                  {#if comp.cost_of_living_adjustment !== 0}
                    <p class="text-sm text-gray-500">
                      COLA: {comp.cost_of_living_adjustment > 0 ? '+' : ''}{comp.cost_of_living_adjustment}%
                    </p>
                  {/if}
                  
                  <div class="flex gap-2 mt-2 text-xs">
                    {#if comp.bonus_eligible}
                      <span class="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">Bonus eligible</span>
                    {/if}
                    {#if comp.equity_eligible}
                      <span class="bg-purple-100 text-purple-800 px-2 py-0.5 rounded">Equity eligible</span>
                    {/if}
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {/if}
        
        <!-- Details -->
        <div class="bg-white rounded-lg border p-6">
          <h2 class="text-lg font-semibold mb-4">Details</h2>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Created:</span>
              <span>{new Date(data.job.created_at).toLocaleDateString()}</span>
            </div>
            
            {#if data.job.start_date}
              <div class="flex justify-between">
                <span class="text-gray-600">Start Date:</span>
                <span>{new Date(data.job.start_date).toLocaleDateString()}</span>
              </div>
            {/if}
            
            {#if data.job.application_deadline}
              <div class="flex justify-between">
                <span class="text-gray-600">Deadline:</span>
                <span>{new Date(data.job.application_deadline).toLocaleDateString()}</span>
              </div>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
