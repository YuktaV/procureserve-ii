<!-- Enum edit form - simplified version -->
<script lang="ts">
  import { enhance } from '$app/forms'
  import { goto } from '$app/navigation'
  import { addToast } from '$stores/toast'
  import { validateEnumData, updateEnumSchema } from '$lib/server/validation/enum.schemas'
  import type { PageData, ActionData } from './$types'
  import type { EnumValue } from '$lib/types'
  import { ArrowLeft, Plus, Trash2, Save, Eye, AlertCircle, CheckCircle } from 'lucide-svelte'

  export let data: PageData
  export let form: ActionData

  const { consoleUser, enum: enumData, company } = data

  // Form state - pre-fill with existing data
  let displayName = enumData.metadata.display_name
  let description = enumData.metadata.description || ''
  let values: EnumValue[] = [...enumData.values].sort((a, b) => a.sort_order - b.sort_order)
  let loading = false
  let errors: string[] = []
  let formTouched = false

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
    formTouched = true
  }

  // Handle form submission
  function handleSubmit() {
    loading = true
    return async ({ result, update }) => {
      loading = false
      if (result.type === 'success') {
        addToast({
          type: 'success',
          title: 'Enum Updated',
          message: `${displayName} has been successfully updated.`
        })
      } else if (result.type === 'failure') {
        addToast({
          type: 'error',
          title: 'Update Failed',
          message: result.data?.error || 'Failed to update enum'
        })
      }
      await update()
    }
  }

  // Check if form has changes
  $: hasChanges = formTouched && (
    displayName !== enumData.metadata.display_name ||
    description !== (enumData.metadata.description || '') ||
    JSON.stringify(values) !== JSON.stringify(enumData.values)
  )
</script>

<svelte:head>
  <title>Edit {enumData.metadata.display_name} - Console</title>
</svelte:head>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex items-center space-x-4">
    <button on:click={() => goto(`/enums/${enumData.id}`)} class="p-2 hover:bg-accent rounded-md">
      <ArrowLeft class="w-5 h-5" />
    </button>
    <div>
      <h1 class="text-2xl font-bold">Edit {enumData.metadata.display_name}</h1>
      <p class="text-muted-foreground">{enumData.category} • v{enumData.version} • {company?.name}</p>
    </div>
  </div>

  <!-- Form -->
  <form method="POST" action="?/update" use:enhance={handleSubmit} class="space-y-6">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
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
                required
                class="w-full px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Description</label>
              <textarea
                bind:value={description}
                name="description"
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
            <button type="button" on:click={addValue} class="flex items-center px-3 py-1 text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md">
              <Plus class="w-3 h-3 mr-1" />
              Add Value
            </button>
          </div>

          <div class="space-y-3">
            {#each values as value, index}
              <div class="flex items-center space-x-3 p-3 border border-input rounded-lg">
                <div class="w-8 h-8 rounded-md border-2 border-border" style="background-color: {value.color}"></div>
                <div class="flex-1">
                  <input
                    type="text"
                    bind:value={value.key}
                    on:input={(e) => updateValue(index, 'key', e.target.value)}
                    placeholder="key"
                    class="w-full px-2 py-1 text-sm bg-background border border-input rounded focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                <div class="flex-1">
                  <input
                    type="text"
                    bind:value={value.label}
                    on:input={(e) => updateValue(index, 'label', e.target.value)}
                    placeholder="Display Label"
                    class="w-full px-2 py-1 text-sm bg-background border border-input rounded focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                <label class="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    bind:checked={value.active}
                    on:change={(e) => updateValue(index, 'active', e.target.checked)}
                    class="w-4 h-4 text-primary bg-background border-input rounded focus:ring-primary focus:ring-2"
                  />
                  <span class="text-sm text-muted-foreground">Active</span>
                </label>
                <button type="button" on:click={() => removeValue(index)} class="p-1 text-muted-foreground hover:text-destructive">
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            {/each}
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="bg-card border rounded-lg p-6">
        <div class="space-y-3">
          <button
            type="submit"
            disabled={loading || !displayName || values.length === 0 || !values.some(v => v.active) || !hasChanges}
            class="w-full flex items-center justify-center px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
          >
            {#if loading}
              <div class="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2"></div>
              Updating...
            {:else}
              <Save class="w-4 h-4 mr-2" />
              Update Enum
            {/if}
          </button>
          
          <button
            type="button"
            on:click={() => goto(`/enums/${enumData.id}`)}
            class="w-full flex items-center justify-center px-4 py-2 text-sm font-medium border border-input bg-background hover:bg-accent rounded-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Hidden form fields -->
    <input type="hidden" name="values" value={JSON.stringify(values)} />
    <input type="hidden" name="version" value={enumData.version} />
  </form>
</div>
