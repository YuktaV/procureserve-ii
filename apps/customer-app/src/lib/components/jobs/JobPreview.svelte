<script lang="ts">
  export let formData: any
  
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

<div class="space-y-4">
  <h3 class="text-lg font-medium">Job Preview</h3>
  
  <div class="bg-gray-50 rounded-lg p-6 border">
    <!-- Header -->
    <div class="mb-4">
      <h1 class="text-xl font-semibold text-gray-900 mb-2">
        {formData.title || 'Job Title'}
      </h1>
      
      <div class="flex items-center gap-4 text-sm text-gray-600">
        <span>{formData.employment_type || 'Employment Type'}</span>
        <span>•</span>
        <span>{formData.experience_level || 'Experience Level'}</span>
        {#if formData.department}
          <span>•</span>
          <span>{formData.department}</span>
        {/if}
      </div>
    </div>
    
    <!-- Description -->
    {#if formData.description}
      <div class="mb-4">
        <h3 class="font-medium mb-2">Description</h3>
        <p class="text-gray-700 text-sm whitespace-pre-wrap">{formData.description}</p>
      </div>
    {/if}
    
    <!-- Requirements -->
    {#if formData.requirements?.skills_required?.length}
      <div class="mb-4">
        <h3 class="font-medium mb-2">Required Skills</h3>
        <div class="flex flex-wrap gap-1">
          {#each formData.requirements.skills_required as skill}
            <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{skill}</span>
          {/each}
        </div>
      </div>
    {/if}
    
    <!-- Locations -->
    {#if formData.locations?.length}
      <div class="mb-4">
        <h3 class="font-medium mb-2">Locations ({formData.locations.length})</h3>
        <div class="space-y-2">
          {#each formData.locations as location}
            <div class="flex items-center justify-between text-sm">
              <span>{getLocationDisplay(location)}</span>
              <span class="text-gray-500">{location.headcount} position{location.headcount !== 1 ? 's' : ''}</span>
            </div>
          {/each}
        </div>
      </div>
    {/if}
    
    <!-- Compensation -->
    {#if formData.compensation?.length}
      <div>
        <h3 class="font-medium mb-2">Compensation</h3>
        <div class="space-y-1 text-sm">
          {#each formData.compensation as comp, index}
            <div class="flex items-center justify-between">
              <span>{getLocationDisplay(formData.locations?.[index])}</span>
              <span class="text-gray-600">{getCompensationDisplay(comp)}</span>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</div>
