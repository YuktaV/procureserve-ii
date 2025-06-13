<!-- Enum detail view with activity history -->
<script lang="ts">
  import { goto } from '$app/navigation'
  import { addToast } from '$stores/toast'
  import type { PageData } from './$types'
  import { 
    ArrowLeft, Edit, Trash2, Copy, Download, Activity, 
    Calendar, User, Building, Tag, Palette, Eye, EyeOff
  } from 'lucide-svelte'

  export let data: PageData
  const { consoleUser, enum: enumData, operations, company } = data

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  function getOperationColor(operationType: string) {
    const colors = {
      create: 'text-green-600',
      update: 'text-blue-600', 
      delete: 'text-red-600',
      activate: 'text-green-600',
      deactivate: 'text-amber-600'
    }
    return colors[operationType] || 'text-muted-foreground'
  }

  function handleDuplicate() {
    addToast({
      type: 'info',
      title: 'Duplicate Enum',
      message: 'Duplicate functionality coming soon!'
    })
  }

  function handleExport() {
    const exportData = {
      category: enumData.category,
      display_name: enumData.metadata.display_name,
      description: enumData.metadata.description,
      values: enumData.values
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${enumData.category}-enum.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleDelete() {
    addToast({
      type: 'warning',
      title: 'Delete Enum',
      message: 'Are you sure? This action cannot be undone.',
      actions: [
        {
          label: 'Delete',
          action: () => {
            // TODO: Implement delete
            addToast({
              type: 'success',
              title: 'Enum Deleted',
              message: 'The enum has been successfully deleted.'
            })
            goto('/enums')
          },
          style: 'primary'
        },
        {
          label: 'Cancel', 
          action: () => {},
          style: 'secondary'
        }
      ]
    })
  }
</script>

<svelte:head>
  <title>{enumData.metadata.display_name} - Console</title>
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
        <h1 class="text-2xl font-bold">{enumData.metadata.display_name}</h1>
        <p class="text-muted-foreground mt-1">
          {enumData.category} • {company?.name}
        </p>
      </div>
    </div>
    
    <div class="flex items-center space-x-3">
      <button
        on:click={handleDuplicate}
        class="flex items-center px-3 py-2 text-sm font-medium border border-input bg-background hover:bg-accent rounded-md transition-colors"
      >
        <Copy class="w-4 h-4 mr-2" />
        Duplicate
      </button>
      <button
        on:click={handleExport}
        class="flex items-center px-3 py-2 text-sm font-medium border border-input bg-background hover:bg-accent rounded-md transition-colors"
      >
        <Download class="w-4 h-4 mr-2" />
        Export
      </button>
      <a
        href="/enums/{enumData.id}/edit"
        class="flex items-center px-3 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors"
      >
        <Edit class="w-4 h-4 mr-2" />
        Edit
      </a>
      <button
        on:click={handleDelete}
        class="flex items-center px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-md transition-colors"
      >
        <Trash2 class="w-4 h-4 mr-2" />
        Delete
      </button>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Main Content -->
    <div class="lg:col-span-2 space-y-6">
      <!-- Enum Information -->
      <div class="bg-card border rounded-lg p-6">
        <h3 class="text-lg font-semibold mb-4">Information</h3>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p class="text-muted-foreground">Category</p>
            <p class="font-medium">{enumData.category}</p>
          </div>
          <div>
            <p class="text-muted-foreground">Display Name</p>
            <p class="font-medium">{enumData.metadata.display_name}</p>
          </div>
          <div>
            <p class="text-muted-foreground">Version</p>
            <p class="font-medium">v{enumData.version}</p>
          </div>
          <div>
            <p class="text-muted-foreground">Total Values</p>
            <p class="font-medium">{enumData.values.length}</p>
          </div>
          <div>
            <p class="text-muted-foreground">Active Values</p>
            <p class="font-medium">{enumData.values.filter(v => v.active).length}</p>
          </div>
          <div>
            <p class="text-muted-foreground">System Enum</p>
            <p class="font-medium">{enumData.metadata.is_system ? 'Yes' : 'No'}</p>
          </div>
        </div>
        
        {#if enumData.metadata.description}
          <div class="mt-4 pt-4 border-t">
            <p class="text-muted-foreground text-sm">Description</p>
            <p class="text-sm mt-1">{enumData.metadata.description}</p>
          </div>
        {/if}
      </div>

      <!-- Enum Values -->
      <div class="bg-card border rounded-lg p-6">
        <h3 class="text-lg font-semibold mb-4">Values</h3>
        <div class="space-y-3">
          {#each enumData.values as value}
            <div class="flex items-center justify-between p-3 border border-input rounded-lg">
              <div class="flex items-center space-x-3">
                <div 
                  class="w-4 h-4 rounded-full border" 
                  style="background-color: {value.color}"
                ></div>
                <div>
                  <p class="font-medium {!value.active ? 'opacity-60' : ''}">{value.label}</p>
                  <p class="text-xs text-muted-foreground">{value.key}</p>
                </div>
              </div>
              
              <div class="flex items-center space-x-2">
                <span class="text-xs text-muted-foreground">
                  Order: {value.sort_order}
                </span>
                {#if value.active}
                  <div class="flex items-center text-green-600">
                    <Eye class="w-4 h-4" />
                    <span class="text-xs ml-1">Active</span>
                  </div>
                {:else}
                  <div class="flex items-center text-muted-foreground">
                    <EyeOff class="w-4 h-4" />
                    <span class="text-xs ml-1">Inactive</span>
                  </div>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>

    <!-- Sidebar -->
    <div class="space-y-6">
      <!-- Metadata -->
      <div class="bg-card border rounded-lg p-6">
        <h3 class="text-lg font-semibold mb-4">Metadata</h3>
        <div class="space-y-3 text-sm">
          <div class="flex items-center space-x-2">
            <Building class="w-4 h-4 text-muted-foreground" />
            <div>
              <p class="text-muted-foreground">Company</p>
              <p class="font-medium">{company?.name}</p>
            </div>
          </div>
          
          <div class="flex items-center space-x-2">
            <Calendar class="w-4 h-4 text-muted-foreground" />
            <div>
              <p class="text-muted-foreground">Created</p>
              <p class="font-medium">{formatDate(enumData.created_at)}</p>
            </div>
          </div>
          
          <div class="flex items-center space-x-2">
            <Calendar class="w-4 h-4 text-muted-foreground" />
            <div>
              <p class="text-muted-foreground">Last Modified</p>
              <p class="font-medium">{formatDate(enumData.updated_at)}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Activity History -->
      <div class="bg-card border rounded-lg p-6">
        <h3 class="text-lg font-semibold mb-4 flex items-center">
          <Activity class="w-5 h-5 mr-2" />
          Recent Activity
        </h3>
        
        {#if operations.length > 0}
          <div class="space-y-3">
            {#each operations as operation}
              <div class="flex items-start space-x-3 text-sm">
                <div class="w-2 h-2 rounded-full bg-primary mt-1.5"></div>
                <div class="flex-1">
                  <p class="font-medium {getOperationColor(operation.operation_type)}">
                    {operation.operation_type.replace('_', ' ').toUpperCase()}
                  </p>
                  <p class="text-muted-foreground text-xs">
                    by {operation.console_users?.email || 'System'}
                  </p>
                  <p class="text-muted-foreground text-xs">
                    {formatDate(operation.timestamp)}
                  </p>
                </div>
              </div>
            {/each}
          </div>
        {:else}
          <p class="text-muted-foreground text-sm">No activity history available</p>
        {/if}
      </div>
    </div>
  </div>
</div>
