<!-- Enhanced enum creation form with sophisticated features -->
<script lang="ts">
  import { enhance } from '$app/forms'
  import { goto } from '$app/navigation' 
  import { addToast } from '$stores/toast'
  import { ENUM_CATEGORIES, validateEnumData, createEnumSchema } from '$lib/server/validation/enum.schemas'
  import type { PageData, ActionData } from './$types'
  import type { EnumValue } from '$lib/types'
  import { 
    ArrowLeft, Plus, Trash2, GripVertical, Palette, Save, Eye,
    AlertCircle, CheckCircle, Wand2
  } from 'lucide-svelte'

  export let data: PageData
  export let form: ActionData

  const { consoleUser, companies } = data

  // Form state
  let category = ''
  let customCategory = ''
  let displayName = ''
  let description = ''
  let companyId = companies.length === 1 ? companies[0].id : ''
  let values: EnumValue[] = []
  let showColorPicker = -1
  let draggedIndex = -1
  let loading = false
  let errors: string[] = []
  let formTouched = false

  // Reactive validation
  $: if (formTouched) {
    const validation = validateEnumData(createEnumSchema, {
      category: category === 'custom' ? customCategory : category,
      display_name: displayName,
      description,
      company_id: companyId,
      values
    })
    errors = validation.errors || []
  }

  // Handle category change
  function handleCategoryChange() {
    if (category && category !== 'custom' && ENUM_CATEGORIES[category]) {
      displayName = ENUM_CATEGORIES[category].label
      description = ENUM_CATEGORIES[category].description
      
      // Load common values as template
      values = ENUM_CATEGORIES[category].common_values.map((val, index) => ({
        ...val,
        active: true,
        sort_order: index,
        description: ''
      }))
    } else if (category === 'custom') {
      displayName = ''
      description = ''
      values = []
    }
    formTouched = true
  }

  // Add new enum value
  function addValue() {
    const colors = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']
    const newValue: EnumValue = {
      key: '',
      label: '',
      color: colors[values.length % colors.length],
      active: true,
      sort_order: values.length,
      description: ''
    }
    values = [...values, newValue]
    formTouched = true
  }

  // Remove enum value
  function removeValue(index: number) {
    values = values.filter((_, i) => i !== index)
    values = values.map((val, i) => ({ ...val, sort_order: i }))
    formTouched = true
  }

  // Update enum value
  function updateValue(index: number, field: keyof EnumValue, value: any) {
    values[index] = { ...values[index], [field]: value }
    
    // Auto-generate key from label
    if (field === 'label' && value) {
      const autoKey = value.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '_')
        .substring(0, 30)
      if (autoKey !== values[index].key) {
        values[index].key = autoKey
      }
    }
    
    formTouched = true
  }

  // Drag and drop handling
  function handleDragStart(event: DragEvent, index: number) {
    draggedIndex = index
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move'
    }
  }

  function handleDragOver(event: DragEvent, index: number) {
    event.preventDefault()
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move'
    }
  }

  function handleDrop(event: DragEvent, targetIndex: number) {
    event.preventDefault()
    if (draggedIndex !== -1 && draggedIndex !== targetIndex) {
      const draggedItem = values[draggedIndex]
      const newValues = [...values]
      newValues.splice(draggedIndex, 1)
      newValues.splice(targetIndex, 0, draggedItem)
      
      // Update sort orders
      values = newValues.map((val, i) => ({ ...val, sort_order: i }))
      formTouched = true
    }
    draggedIndex = -1
  }

  // Color picker colors
  const colorOptions = [
    '#ef4444', '#f59e0b', '#eab308', '#22c55e', '#10b981', '#06b6d4',
    '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#ec4899', '#f43f5e',
    '#6b7280', '#374151', '#1f2937', '#111827', '#fbbf24', '#fb923c'
  ]

  // Handle form submission
  function handleSubmit() {
    loading = true
    formTouched = true
    
    return async ({ result, update }) => {
      loading = false
      
      if (result.type === 'success') {
        addToast({
          type: 'success',
          title: 'Enum Created',
          message: `${displayName} has been successfully created.`
        })
      } else if (result.type === 'failure') {
        addToast({
          type: 'error',
          title: 'Creation Failed',
          message: result.data?.error || 'Failed to create enum'
        })
      }
      
      await update()
    }
  }

  // Initialize if coming back from error
  if (form?.values) {
    category = form.values.category
    displayName = form.values.display_name
    description = form.values.description || ''
    companyId = form.values.company_id
    values = form.values.values || []
    formTouched = true
  }
</script>

<svelte:head>
  <title>Create Enum - Console</title>
</svelte:head>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex items-center justify-between">
    <div class="flex items-center space-x-4">
      <button
        on:click={() => goto('/enums')}
        class="p-2 hover:bg-accent rounded-md transition-colors"
      >
        <ArrowLeft class="w-5 h-5" />
      </button>
      <div>
        <h1 class="text-2xl font-bold">Create New Enum</h1>
        <p class="text-muted-foreground mt-1">
          Configure a new set of dropdown options
        </p>
      </div>
    </div>
  </div>

  <!-- Form Errors -->
  {#if form?.error || errors.length > 0}
    <div class="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
      <div class="flex items-center space-x-2 mb-2">
        <AlertCircle class="w-5 h-5 text-destructive" />
        <h3 class="font-semibold text-destructive">Validation Errors</h3>
      </div>
      <ul class="space-y-1 text-sm text-destructive">
        {#if form?.error}
          <li>{form.error}</li>
        {/if}
        {#each errors as error}
          <li>{error}</li>
        {/each}
      </ul>
    </div>
  {/if}

  <!-- Main Form -->
  <form 
    method="POST" 
    action="?/create" 
    use:enhance={handleSubmit} 
    class="space-y-6"
  >
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column -->
      <div class="lg:col-span-2 space-y-6">
        
        <!-- Company Selection -->
        {#if companies.length > 1}
          <div class="bg-card border rounded-lg p-6">
            <h3 class="text-lg font-semibold mb-4">Company</h3>
            <select 
              bind:value={companyId}
              name="company_id"
              required
              class="w-full px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select a company...</option>
              {#each companies as company}
                <option value={company.id}>{company.name}</option>
              {/each}
            </select>
          </div>
        {:else if companies.length === 1}
          <input type="hidden" name="company_id" value={companies[0].id} />
        {/if}

        <!-- Category Selection -->
        <div class="bg-card border rounded-lg p-6">
          <h3 class="text-lg font-semibold mb-4">Category</h3>
          <div class="space-y-4">
            <select 
              bind:value={category}
              on:change={handleCategoryChange}
              name="category"
              required
              class="w-full px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select a category...</option>
              {#each Object.entries(ENUM_CATEGORIES) as [key, config]}
                <option value={key}>{config.label}</option>
              {/each}
            </select>

            {#if category === 'custom'}
              <div class="space-y-2">
                <label class="block text-sm font-medium">Custom Category Key</label>
                <input
                  type="text"
                  bind:value={customCategory}
                  placeholder="e.g., department_types"
                  pattern="[a-z_]+"
                  class="w-full px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <p class="text-xs text-muted-foreground">
                  Use lowercase letters and underscores only
                </p>
              </div>
            {/if}
          </div>
        </div>

        <!-- Basic Information -->
        <div class="bg-card border rounded-lg p-6">
          <h3 class="text-lg font-semibold mb-4">Basic Information</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2">Display Name</label>
              <input
                type="text"
                bind:value={displayName}
                name="display_name"
                placeholder="e.g., Work Authorization Types"
                required
                class="w-full px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Description</label>
              <textarea
                bind:value={description}
                name="description"
                placeholder="Describe what this enum is used for..."
                rows="3"
                class="w-full px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Enum Values -->
        <div class="bg-card border rounded-lg p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold">Enum Values</h3>
            <div class="flex items-center space-x-2">
              {#if category && category !== 'custom' && ENUM_CATEGORIES[category]?.common_values?.length > 0}
                <button
                  type="button"
                  on:click={handleCategoryChange}
                  class="flex items-center px-3 py-1 text-xs font-medium border border-input bg-background hover:bg-accent rounded-md transition-colors"
                >
                  <Wand2 class="w-3 h-3 mr-1" />
                  Use Template
                </button>
              {/if}
              <button
                type="button"
                on:click={addValue}
                class="flex items-center px-3 py-1 text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors"
              >
                <Plus class="w-3 h-3 mr-1" />
                Add Value
              </button>
            </div>
          </div>

          <div class="space-y-3">
            {#each values as value, index}
              <div 
                class="flex items-center space-x-3 p-3 border border-input rounded-lg hover:border-ring transition-colors"
                draggable="true"
                on:dragstart={(e) => handleDragStart(e, index)}
                on:dragover={(e) => handleDragOver(e, index)}
                on:drop={(e) => handleDrop(e, index)}
              >
                <!-- Drag Handle -->
                <div class="cursor-move text-muted-foreground hover:text-foreground">
                  <GripVertical class="w-4 h-4" />
                </div>

                <!-- Color Picker -->
                <div class="relative">
                  <button
                    type="button"
                    on:click={() => showColorPicker = showColorPicker === index ? -1 : index}
                    class="w-8 h-8 rounded-md border-2 border-border hover:border-ring transition-colors"
                    style="background-color: {value.color}"
                  >
                    <span class="sr-only">Pick color</span>
                  </button>
                  
                  {#if showColorPicker === index}
                    <div class="absolute top-10 left-0 z-10 bg-popover border border-border rounded-lg p-3 shadow-lg">
                      <div class="grid grid-cols-6 gap-2">
                        {#each colorOptions as color}
                          <button
                            type="button"
                            on:click={() => {
                              updateValue(index, 'color', color)
                              showColorPicker = -1
                            }}
                            class="w-6 h-6 rounded-md border border-border hover:border-ring transition-colors"
                            style="background-color: {color}"
                          >
                            <span class="sr-only">{color}</span>
                          </button>
                        {/each}
                      </div>
                    </div>
                  {/if}
                </div>

                <!-- Key Input -->
                <div class="flex-1">
                  <input
                    type="text"
                    bind:value={value.key}
                    on:input={(e) => updateValue(index, 'key', e.target.value)}
                    placeholder="key"
                    pattern="[a-z0-9_]+"
                    class="w-full px-2 py-1 text-sm bg-background border border-input rounded focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>

                <!-- Label Input -->
                <div class="flex-1">
                  <input
                    type="text"
                    bind:value={value.label}
                    on:input={(e) => updateValue(index, 'label', e.target.value)}
                    placeholder="Display Label"
                    class="w-full px-2 py-1 text-sm bg-background border border-input rounded focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>

                <!-- Active Toggle -->
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    bind:checked={value.active}
                    on:change={(e) => updateValue(index, 'active', e.target.checked)}
                    class="w-4 h-4 text-primary bg-background border-input rounded focus:ring-primary focus:ring-2"
                  />
                  <span class="text-sm text-muted-foreground">Active</span>
                </label>

                <!-- Remove Button -->
                <button
                  type="button"
                  on:click={() => removeValue(index)}
                  class="p-1 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            {/each}

            {#if values.length === 0}
              <div class="text-center py-8 text-muted-foreground">
                <Palette class="w-8 h-8 mx-auto mb-2" />
                <p>No enum values yet</p>
                <p class="text-sm">Click "Add Value" to get started</p>
              </div>
            {/if}
          </div>
        </div>
      </div>

      <!-- Right Column: Preview and Actions -->
      <div class="space-y-6">
        <!-- Preview -->
        <div class="bg-card border rounded-lg p-6">
          <h3 class="text-lg font-semibold mb-4 flex items-center">
            <Eye class="w-5 h-5 mr-2" />
            Preview
          </h3>
          
          {#if displayName && values.length > 0}
            <div class="space-y-3">
              <div>
                <p class="text-sm font-medium">{displayName}</p>
                {#if description}
                  <p class="text-xs text-muted-foreground mt-1">{description}</p>
                {/if}
              </div>
              
              <div class="space-y-2">
                {#each values.filter(v => v.active) as value}
                  <div class="flex items-center space-x-2 p-2 bg-accent/50 rounded">
                    <div 
                      class="w-3 h-3 rounded-full" 
                      style="background-color: {value.color}"
                    ></div>
                    <span class="text-sm">{value.label || value.key}</span>
                  </div>
                {/each}
                
                {#if values.some(v => !v.active)}
                  <div class="pt-2 border-t">
                    <p class="text-xs text-muted-foreground mb-1">Inactive values:</p>
                    {#each values.filter(v => !v.active) as value}
                      <div class="flex items-center space-x-2 p-2 bg-muted/50 rounded opacity-60">
                        <div 
                          class="w-3 h-3 rounded-full" 
                          style="background-color: {value.color}"
                        ></div>
                        <span class="text-sm">{value.label || value.key}</span>
                      </div>
                    {/each}
                  </div>
                {/if}
              </div>
            </div>
          {:else}
            <p class="text-sm text-muted-foreground">Fill in the form to see a preview</p>
          {/if}
        </div>

        <!-- Validation Status -->
        <div class="bg-card border rounded-lg p-6">
          <h3 class="text-lg font-semibold mb-4">Validation</h3>
          <div class="space-y-2">
            <div class="flex items-center space-x-2">
              {#if companyId}
                <CheckCircle class="w-4 h-4 text-green-500" />
                <span class="text-sm">Company selected</span>
              {:else}
                <AlertCircle class="w-4 h-4 text-amber-500" />
                <span class="text-sm">Company required</span>
              {/if}
            </div>
            
            <div class="flex items-center space-x-2">
              {#if category}
                <CheckCircle class="w-4 h-4 text-green-500" />
                <span class="text-sm">Category selected</span>
              {:else}
                <AlertCircle class="w-4 h-4 text-amber-500" />
                <span class="text-sm">Category required</span>
              {/if}
            </div>
            
            <div class="flex items-center space-x-2">
              {#if displayName}
                <CheckCircle class="w-4 h-4 text-green-500" />
                <span class="text-sm">Display name provided</span>
              {:else}
                <AlertCircle class="w-4 h-4 text-amber-500" />
                <span class="text-sm">Display name required</span>
              {/if}
            </div>
            
            <div class="flex items-center space-x-2">
              {#if values.length > 0 && values.some(v => v.active)}
                <CheckCircle class="w-4 h-4 text-green-500" />
                <span class="text-sm">{values.length} values, {values.filter(v => v.active).length} active</span>
              {:else}
                <AlertCircle class="w-4 h-4 text-amber-500" />
                <span class="text-sm">At least one active value required</span>
              {/if}
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="bg-card border rounded-lg p-6">
          <div class="space-y-3">
            <button
              type="submit"
              disabled={loading || errors.length > 0 || !companyId || !category || !displayName || values.length === 0 || !values.some(v => v.active)}
              class="w-full flex items-center justify-center px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
            >
              {#if loading}
                <div class="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2"></div>
                Creating...
              {:else}
                <Save class="w-4 h-4 mr-2" />
                Create Enum
              {/if}
            </button>
            
            <button
              type="button"
              on:click={() => goto('/enums')}
              class="w-full flex items-center justify-center px-4 py-2 text-sm font-medium border border-input bg-background hover:bg-accent rounded-md transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Hidden form fields -->
    <input type="hidden" name="values" value={JSON.stringify(values)} />
  </form>
</div>

<!-- Click outside to close color picker -->
<svelte:window on:click={() => showColorPicker = -1} />
