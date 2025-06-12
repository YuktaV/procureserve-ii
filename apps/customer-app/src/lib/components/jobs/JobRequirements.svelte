<script lang="ts">
  export let requirements: any = {
    skills_required: [],
    skills_preferred: [],
    education: '',
    experience_years: 0,
    certifications: [],
    languages: []
  }
  export let errors: Record<string, string> = {}
  
  let newSkillRequired = ''
  let newSkillPreferred = ''
  let newCertification = ''
  let newLanguage = ''
  
  function addSkillRequired() {
    if (newSkillRequired.trim()) {
      requirements.skills_required = [...requirements.skills_required, newSkillRequired.trim()]
      newSkillRequired = ''
    }
  }
  
  function addSkillPreferred() {
    if (newSkillPreferred.trim()) {
      requirements.skills_preferred = [...requirements.skills_preferred, newSkillPreferred.trim()]
      newSkillPreferred = ''
    }
  }
  
  function addCertification() {
    if (newCertification.trim()) {
      requirements.certifications = [...requirements.certifications, newCertification.trim()]
      newCertification = ''
    }
  }
  
  function addLanguage() {
    if (newLanguage.trim()) {
      requirements.languages = [...requirements.languages, newLanguage.trim()]
      newLanguage = ''
    }
  }
  
  function removeItem(array: string[], index: number) {
    return array.filter((_, i) => i !== index)
  }
</script>

<div class="space-y-4">
  <h3 class="text-lg font-medium">Requirements</h3>
  
  <!-- Required Skills -->
  <div>
    <label class="block text-sm font-medium mb-2">Required Skills *</label>
    <div class="flex gap-2 mb-2">
      <input 
        type="text" 
        bind:value={newSkillRequired}
        placeholder="JavaScript, React, Node.js..."
        class="flex-1 border rounded-lg px-3 py-2"
        on:keydown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkillRequired())}>
      <button 
        type="button"
        on:click={addSkillRequired}
        class="bg-blue-600 text-white px-4 py-2 rounded-lg">
        Add
      </button>
    </div>
    <div class="flex flex-wrap gap-2">
      {#each requirements.skills_required as skill, index}
        <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
          {skill}
          <button 
            type="button"
            on:click={() => requirements.skills_required = removeItem(requirements.skills_required, index)}
            class="text-blue-600 hover:text-blue-800">×</button>
        </span>
      {/each}
    </div>
    {#if errors.skills_required}
      <p class="text-red-500 text-sm mt-1">{errors.skills_required}</p>
    {/if}
  </div>
  
  <!-- Preferred Skills -->
  <div>
    <label class="block text-sm font-medium mb-2">Preferred Skills</label>
    <div class="flex gap-2 mb-2">
      <input 
        type="text" 
        bind:value={newSkillPreferred}
        placeholder="Docker, AWS, GraphQL..."
        class="flex-1 border rounded-lg px-3 py-2"
        on:keydown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkillPreferred())}>
      <button 
        type="button"
        on:click={addSkillPreferred}
        class="bg-gray-600 text-white px-4 py-2 rounded-lg">
        Add
      </button>
    </div>
    <div class="flex flex-wrap gap-2">
      {#each requirements.skills_preferred as skill, index}
        <span class="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
          {skill}
          <button 
            type="button"
            on:click={() => requirements.skills_preferred = removeItem(requirements.skills_preferred, index)}
            class="text-gray-600 hover:text-gray-800">×</button>
        </span>
      {/each}
    </div>
  </div>
</div>
