<script lang="ts">
  export let formData: any
  export let errors: Record<string, string> = {}
  
  // Sample options - these would come from configurable enums in production
  const employmentTypes = [
    'Full-time',
    'Part-time', 
    'Contract',
    'Temporary',
    'Internship'
  ]
  
  const experienceLevels = [
    'Entry Level',
    'Mid Level',
    'Senior Level',
    'Executive Level'
  ]
</script>

<div class="space-y-4">
  <h3 class="text-lg font-medium">Basic Information</h3>
  
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <!-- Job Title -->
    <div class="md:col-span-2">
      <label class="block text-sm font-medium mb-1">Job Title *</label>
      <input 
        type="text" 
        bind:value={formData.title}
        placeholder="Senior Software Engineer"
        class="w-full border rounded-lg px-3 py-2 {errors.title ? 'border-red-500' : ''}">
      {#if errors.title}
        <p class="text-red-500 text-sm mt-1">{errors.title}</p>
      {/if}
    </div>
    
    <!-- Employment Type -->
    <div>
      <label class="block text-sm font-medium mb-1">Employment Type *</label>
      <select 
        bind:value={formData.employment_type}
        class="w-full border rounded-lg px-3 py-2 {errors.employment_type ? 'border-red-500' : ''}">
        <option value="">Select type</option>
        {#each employmentTypes as type}
          <option value={type}>{type}</option>
        {/each}
      </select>
      {#if errors.employment_type}
        <p class="text-red-500 text-sm mt-1">{errors.employment_type}</p>
      {/if}
    </div>
    
    <!-- Experience Level -->
    <div>
      <label class="block text-sm font-medium mb-1">Experience Level *</label>
      <select 
        bind:value={formData.experience_level}
        class="w-full border rounded-lg px-3 py-2 {errors.experience_level ? 'border-red-500' : ''}">
        <option value="">Select level</option>
        {#each experienceLevels as level}
          <option value={level}>{level}</option>
        {/each}
      </select>
      {#if errors.experience_level}
        <p class="text-red-500 text-sm mt-1">{errors.experience_level}</p>
      {/if}
    </div>
    
    <!-- Department -->
    <div>
      <label class="block text-sm font-medium mb-1">Department</label>
      <input 
        type="text" 
        bind:value={formData.department}
        placeholder="Engineering"
        class="w-full border rounded-lg px-3 py-2">
    </div>
    
    <!-- Start Date -->
    <div>
      <label class="block text-sm font-medium mb-1">Start Date</label>
      <input 
        type="date" 
        bind:value={formData.start_date}
        class="w-full border rounded-lg px-3 py-2">
    </div>
  </div>
  
  <!-- Description -->
  <div>
    <label class="block text-sm font-medium mb-1">Job Description *</label>
    <textarea 
      bind:value={formData.description}
      rows="6"
      placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
      class="w-full border rounded-lg px-3 py-2 {errors.description ? 'border-red-500' : ''}"></textarea>
    {#if errors.description}
      <p class="text-red-500 text-sm mt-1">{errors.description}</p>
    {/if}
  </div>
</div>
