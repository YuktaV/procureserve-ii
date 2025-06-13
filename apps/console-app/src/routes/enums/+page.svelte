<script lang="ts">
  import type { PageData } from './$types'
  import { 
    FileText, 
    Plus, 
    Search, 
    Filter,
    Download,
    Upload,
    Edit,
    Trash2,
    Eye,
    MoreHorizontal
  } from 'lucide-svelte'
  import { addToast } from '$stores/toast'

  export let data: PageData

  const { consoleUser, enums } = data

  let searchQuery = ''
  let selectedCategory = 'all'
  let showFilters = false

  // Sample enum data - in real app, this comes from the server
  const enumCategories = [
    { value: 'all', label: 'All Categories' },
    { value: 'work_authorization_types', label: 'Work Authorization Types' },
    { value: 'job_statuses', label: 'Job Statuses' },
    { value: 'candidate_statuses', label: 'Candidate Statuses' },
    { value: 'application_statuses', label: 'Application Statuses' },
    { value: 'priority_levels', label: 'Priority Levels' },
    { value: 'skill_levels', label: 'Skill Levels' }
  ]

  const sampleEnums = [
    {
      id: '1',
      category: 'work_authorization_types',
      display_name: 'Work Authorization Types',
      values: [
        { key: 'us_citizen', label: 'US Citizen', color: '#22c55e', active: true },
        { key: 'h1b', label: 'H1B Visa', color: '#f59e0b', active: true },
        { key: 'green_card', label: 'Green Card', color: '#3b82f6', active: true },
        { key: 'tn_visa', label: 'TN Visa', color: '#6b7280', active: false }
      ],
      updated_at: '2024-06-12T10:30:00Z',
      updated_by: 'admin@acme-staffing.com',
      usage_count: 1250
    },
    {
      id: '2',
      category: 'job_statuses',
      display_name: 'Job Statuses',
      values: [
        { key: 'open', label: 'Open', color: '#22c55e', active: true },
        { key: 'in_progress', label: 'In Progress', color: '#f59e0b', active: true },
        { key: 'on_hold', label: 'On Hold', color: '#ef4444', active: true },
        { key: 'closed', label: 'Closed', color: '#6b7280', active: true }
      ],
      updated_at: '2024-06-11T15:45:00Z',
      updated_by: 'manager@acme-staffing.com',
      usage_count: 450
    },
    {
      id: '3',
      category: 'priority_levels',
      display_name: 'Priority Levels',
      values: [
        { key: 'critical', label: 'Critical', color: '#ef4444', active: true },
        { key: 'high', label: 'High', color: '#f59e0b', active: true },
        { key: 'medium', label: 'Medium', color: '#3b82f6', active: true },
        { key: 'low', label: 'Low', color: '#6b7280', active: true }
      ],
      updated_at: '2024-06-10T09:15:00Z',
      updated_by: 'admin@acme-staffing.com',
      usage_count: 89
    }
  ]

  // Filter enums based on search and category
  $: filteredEnums = sampleEnums.filter(enumItem => {
    const matchesSearch = searchQuery === '' || 
      enumItem.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      enumItem.category.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = selectedCategory === 'all' || enumItem.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  function handleExport() {
    addToast({
      type: 'info',
      title: 'Export Started',
      message: 'Your enum data export is being prepared...'
    })
  }

  function handleImport() {
    addToast({
      type: 'info',
      title: 'Import Feature',
      message: 'Bulk import functionality coming soon!'
    })
  }

  function handleDeleteEnum(enumId: string) {
    addToast({
      type: 'warning',
      title: 'Delete Enum',
      message: 'Are you sure you want to delete this enum?',
      actions: [
        {
          label: 'Delete',
          action: () => {
            addToast({
              type: 'success',
              title: 'Enum Deleted',
              message: 'The enum has been successfully deleted.'
            })
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
  <title>Enum Management - Console</title>
</svelte:head>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold">Enum Management</h1>
      <p class="text-muted-foreground mt-1">
        Configure dropdown options and categorized values
      </p>
    </div>
    <div class="flex items-center space-x-3">
      <button
        on:click={handleImport}
        class="flex items-center px-4 py-2 text-sm font-medium border border-input bg-background hover:bg-accent rounded-md transition-colors"
      >
        <Upload class="w-4 h-4 mr-2" />
        Import
      </button>
      <button
        on:click={handleExport}
        class="flex items-center px-4 py-2 text-sm font-medium border border-input bg-background hover:bg-accent rounded-md transition-colors"
      >
        <Download class="w-4 h-4 mr-2" />
        Export
      </button>
      <a
        href="/enums/create"
        class="flex items-center px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors"
      >
        <Plus class="w-4 h-4 mr-2" />
        Create Enum
      </a>
    </div>
  </div>

  <!-- Filters -->
  <div class="bg-card border rounded-lg p-4">
    <div class="flex items-center space-x-4">
      <!-- Search -->
      <div class="relative flex-1 max-w-sm">
        <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search enums..."
          bind:value={searchQuery}
          class="pl-10 pr-4 py-2 w-full text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <!-- Category Filter -->
      <select
        bind:value={selectedCategory}
        class="px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {#each enumCategories as category}
          <option value={category.value}>{category.label}</option>
        {/each}
      </select>

      <!-- Advanced Filters Toggle -->
      <button
        on:click={() => showFilters = !showFilters}
        class="flex items-center px-3 py-2 text-sm font-medium border border-input bg-background hover:bg-accent rounded-md transition-colors"
      >
        <Filter class="w-4 h-4 mr-2" />
        Filters
      </button>
    </div>

    {#if showFilters}
      <div class="mt-4 pt-4 border-t">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium mb-2">Updated After</label>
            <input
              type="date"
              class="w-full px-3 py-2 text-sm bg-background border border-input rounded-md"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Updated By</label>
            <select class="w-full px-3 py-2 text-sm bg-background border border-input rounded-md">
              <option value="">All Users</option>
              <option value="admin@acme-staffing.com">admin@acme-staffing.com</option>
              <option value="manager@acme-staffing.com">manager@acme-staffing.com</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Usage Count</label>
            <select class="w-full px-3 py-2 text-sm bg-background border border-input rounded-md">
              <option value="">Any Usage</option>
              <option value="high">High Usage (>100)</option>
              <option value="medium">Medium Usage (10-100)</option>
              <option value="low">Low Usage (<10)</option>
            </select>
          </div>
        </div>
      </div>
    {/if}
  </div>

  <!-- Enums Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each filteredEnums as enumItem}
      <div class="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow">
        <!-- Header -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div class="p-2 bg-primary/10 rounded-lg">
              <FileText class="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 class="font-semibold">{enumItem.display_name}</h3>
              <p class="text-sm text-muted-foreground">{enumItem.category}</p>
            </div>
          </div>
          
          <!-- Actions Menu -->
          <div class="relative">
            <button class="p-1 hover:bg-accent rounded-md transition-colors">
              <MoreHorizontal class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Enum Values Preview -->
        <div class="space-y-2 mb-4">
          {#each enumItem.values.slice(0, 3) as value}
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <div 
                  class="w-3 h-3 rounded-full" 
                  style="background-color: {value.color}"
                ></div>
                <span class="text-sm {value.active ? '' : 'opacity-50'}">{value.label}</span>
              </div>
              {#if !value.active}
                <span class="text-xs text-muted-foreground">Inactive</span>
              {/if}
            </div>
          {/each}
          {#if enumItem.values.length > 3}
            <p class="text-xs text-muted-foreground">
              +{enumItem.values.length - 3} more values
            </p>
          {/if}
        </div>

        <!-- Metadata -->
        <div class="space-y-2 text-xs text-muted-foreground border-t pt-4">
          <div class="flex justify-between">
            <span>Usage:</span>
            <span class="font-medium">{enumItem.usage_count.toLocaleString()} records</span>
          </div>
          <div class="flex justify-between">
            <span>Updated:</span>
            <span>{formatDate(enumItem.updated_at)}</span>
          </div>
          <div class="flex justify-between">
            <span>By:</span>
            <span class="truncate max-w-32">{enumItem.updated_by}</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-between mt-4 pt-4 border-t">
          <div class="flex items-center space-x-2">
            <a
              href="/enums/{enumItem.id}"
              class="flex items-center px-2 py-1 text-xs font-medium border border-input bg-background hover:bg-accent rounded transition-colors"
            >
              <Eye class="w-3 h-3 mr-1" />
              View
            </a>
            <a
              href="/enums/{enumItem.id}/edit"
              class="flex items-center px-2 py-1 text-xs font-medium border border-input bg-background hover:bg-accent rounded transition-colors"
            >
              <Edit class="w-3 h-3 mr-1" />
              Edit
            </a>
          </div>
          <button
            on:click={() => handleDeleteEnum(enumItem.id)}
            class="flex items-center px-2 py-1 text-xs font-medium text-destructive hover:bg-destructive/10 rounded transition-colors"
          >
            <Trash2 class="w-3 h-3 mr-1" />
            Delete
          </button>
        </div>
      </div>
    {/each}
  </div>

  <!-- Empty State -->
  {#if filteredEnums.length === 0}
    <div class="text-center py-12">
      <FileText class="w-12 h-12 text-muted-foreground mx-auto mb-4" />
      <h3 class="text-lg font-semibold mb-2">No enums found</h3>
      <p class="text-muted-foreground mb-4">
        {searchQuery || selectedCategory !== 'all' 
          ? 'Try adjusting your search or filters' 
          : 'Get started by creating your first enum'}
      </p>
      {#if searchQuery === '' && selectedCategory === 'all'}
        <a
          href="/enums/create"
          class="inline-flex items-center px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors"
        >
          <Plus class="w-4 h-4 mr-2" />
          Create Your First Enum
        </a>
      {/if}
    </div>
  {/if}
</div>