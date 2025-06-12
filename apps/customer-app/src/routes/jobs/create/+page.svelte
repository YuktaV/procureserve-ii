<script lang="ts">
  import { goto } from '$app/navigation'
  import JobBasicInfo from '../../lib/components/jobs/JobBasicInfo.svelte'
  import JobRequirements from '../../lib/components/jobs/JobRequirements.svelte'
  import JobLocationManager from '../../lib/components/jobs/JobLocationManager.svelte'
  import CompensationByLocation from '../../lib/components/jobs/CompensationByLocation.svelte'
  
  let currentStep = 1
  let errors: Record<string, string> = {}
  let isSubmitting = false
  
  // Form data matching our API schema
  let formData = {
    title: '',
    description: '',
    employment_type: '',
    experience_level: '',
    department: '',
    reports_to: '',
    start_date: '',
    application_deadline: '',
    requirements: {
      skills_required: [],
      skills_preferred: [],
      education: '',
      experience_years: 0,
      certifications: [],
      languages: []
    },
    locations: [],
    compensation: []
  }
  
  function nextStep() {
    if (validateCurrentStep()) {
      currentStep++
    }
  }
  
  function prevStep() {
    currentStep--
  }
  
  function validateCurrentStep() {
    errors = {}
    
    if (currentStep === 1) {
      if (!formData.title.trim()) errors.title = 'Job title is required'
      if (!formData.description.trim()) errors.description = 'Job description is required'
      if (!formData.employment_type) errors.employment_type = 'Employment type is required'
      if (!formData.experience_level) errors.experience_level = 'Experience level is required'
    }
    
    if (currentStep === 2) {
      if (formData.requirements.skills_required.length === 0) {
        errors.skills_required = 'At least one required skill is needed'
      }
    }
    
    if (currentStep === 3) {
      if (formData.locations.length === 0) {
        errors.locations = 'At least one location is required'
      }
    }
    
    return Object.keys(errors).length === 0
  }
  
  async function createJob() {
    if (!validateCurrentStep()) return
    
    isSubmitting = true
    
    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      const result = await response.json()
      
      if (response.ok) {
        goto(`/jobs/${result.data.id}`)
      } else {
        errors.submit = result.error || 'Failed to create job'
      }
    } catch (error) {
      errors.submit = 'Network error. Please try again.'
    } finally {
      isSubmitting = false
    }
  }
  
  function goBack() {
    goto('/jobs')
  }
</script>

<div class="max-w-4xl mx-auto">
  <!-- Header -->
  <div class="mb-6">
    <button on:click={goBack} class="text-blue-600 hover:text-blue-700 mb-2">
      ← Back to Jobs
    </button>
    <h1 class="text-2xl font-semibold">Create New Job</h1>
    <p class="text-gray-600">Step {currentStep} of 4</p>
  </div>
  
  <!-- Progress Bar -->
  <div class="mb-8">
    <div class="flex items-center justify-between mb-2">
      {#each ['Basic Info', 'Requirements', 'Locations', 'Compensation'] as step, index}
        <span class="text-sm {currentStep > index + 1 ? 'text-green-600' : currentStep === index + 1 ? 'text-blue-600' : 'text-gray-400'}">
          {step}
        </span>
      {/each}
    </div>
    <div class="w-full bg-gray-200 rounded-full h-2">
      <div class="bg-blue-600 h-2 rounded-full transition-all duration-300" style="width: {(currentStep / 4) * 100}%"></div>
    </div>
  </div>
</div>

  <!-- Form Content -->
  <div class="bg-white rounded-lg border p-6">
    {#if currentStep === 1}
      <JobBasicInfo bind:formData {errors} />
    {:else if currentStep === 2}
      <JobRequirements bind:requirements={formData.requirements} {errors} />
    {:else if currentStep === 3}
      <JobLocationManager bind:locations={formData.locations} {errors} />
    {:else if currentStep === 4}
      <CompensationByLocation 
        bind:compensation={formData.compensation} 
        locations={formData.locations} />
    {/if}
    
    {#if errors.submit}
      <div class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-red-600 text-sm">{errors.submit}</p>
      </div>
    {/if}
  </div>
  
  <!-- Navigation Buttons -->
  <div class="flex justify-between mt-6">
    <button 
      type="button"
      on:click={prevStep}
      disabled={currentStep === 1}
      class="px-6 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
      Previous
    </button>
    
    <div class="flex gap-3">
      {#if currentStep === 4}
        <button 
          type="button"
          on:click={createJob}
          disabled={isSubmitting}
          class="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg">
          {isSubmitting ? 'Creating...' : 'Create Job'}
        </button>
      {:else}
        <button 
          type="button"
          on:click={nextStep}
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
          Next
        </button>
      {/if}
    </div>
  </div>
</div>
