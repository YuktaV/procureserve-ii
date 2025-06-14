<script lang="ts">
  import { onMount } from 'svelte'
  import Card from '$lib/components/ui/card.svelte'
  import CardHeader from '$lib/components/ui/card-header.svelte'
  import CardTitle from '$lib/components/ui/card-title.svelte'
  import CardContent from '$lib/components/ui/card-content.svelte'
  import { Building2, Plus, Search, Filter } from 'lucide-svelte'

  export let data

  let companies = []
  let searchQuery = ''
  let loading = true

  onMount(async () => {
    // Load companies data
    loading = false
  })
</script>

<svelte:head>
  <title>Companies | Console</title>
</svelte:head>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-3xl font-bold">Companies</h1>
      <p class="text-muted-foreground">Manage companies in the system</p>
    </div>
    <div class="flex items-center space-x-3">
      <button class="flex items-center px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors">
        <Plus class="w-4 h-4 mr-2" />
        Add Company
      </button>
    </div>
  </div>

  <!-- Search and Filters -->
  <Card>
    <CardContent class="p-4">
      <div class="flex items-center space-x-4">
        <div class="relative flex-1 max-w-sm">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search companies..."
            bind:value={searchQuery}
            class="pl-10 pr-4 py-2 w-full text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <button class="flex items-center px-3 py-2 text-sm font-medium border border-input bg-background hover:bg-accent rounded-md transition-colors">
          <Filter class="w-4 h-4 mr-2" />
          Filters
        </button>
      </div>
    </CardContent>
  </Card>

  <!-- Companies List -->
  <Card>
    <CardHeader>
      <CardTitle class="flex items-center">
        <Building2 class="w-5 h-5 mr-2" />
        All Companies
      </CardTitle>
    </CardHeader>
    <CardContent>
      {#if loading}
        <div class="text-center py-8">Loading companies...</div>
      {:else if companies.length === 0}
        <div class="text-center py-12">
          <Building2 class="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 class="text-lg font-semibold mb-2">No companies found</h3>
          <p class="text-muted-foreground mb-4">Get started by adding your first company</p>
          <button class="inline-flex items-center px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors">
            <Plus class="w-4 h-4 mr-2" />
            Add Company
          </button>
        </div>
      {:else}
        <div class="space-y-4">
          {#each companies as company}
            <div class="flex items-center justify-between p-4 border rounded-lg">
              <div class="flex items-center space-x-3">
                <div class="p-2 bg-primary/10 rounded-lg">
                  <Building2 class="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 class="font-semibold">{company.name}</h3>
                  <p class="text-sm text-muted-foreground">{company.domain}</p>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <button class="px-3 py-1 text-xs font-medium border border-input bg-background hover:bg-accent rounded transition-colors">
                  View
                </button>
                <button class="px-3 py-1 text-xs font-medium border border-input bg-background hover:bg-accent rounded transition-colors">
                  Edit
                </button>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </CardContent>
  </Card>
</div> 