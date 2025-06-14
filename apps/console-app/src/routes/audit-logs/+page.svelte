<script lang="ts">
  import { onMount } from 'svelte'
  import { FileText, Search, Filter, Calendar, User, Activity } from 'lucide-svelte'

  export let data

  let logs: any[] = []
  let searchQuery = ''
  let loading = true

  onMount(async () => {
    // Load audit logs data
    loading = false
  })

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString()
  }
</script>

<svelte:head>
  <title>Audit Logs | Console</title>
</svelte:head>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-3xl font-bold">Audit Logs</h1>
      <p class="text-muted-foreground">Track system activities and changes</p>
    </div>
    <div class="flex items-center space-x-3">
      <button class="flex items-center px-4 py-2 text-sm font-medium border border-input bg-background hover:bg-accent rounded-md transition-colors">
        <Calendar class="w-4 h-4 mr-2" />
        Export Logs
      </button>
    </div>
  </div>

  <!-- Search and Filters -->
  <div class="bg-card border rounded-lg p-4">
    <div class="flex items-center space-x-4">
      <div class="relative flex-1 max-w-sm">
        <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search logs..."
          bind:value={searchQuery}
          class="pl-10 pr-4 py-2 w-full text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <select class="px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring">
        <option value="">All Actions</option>
        <option value="create">Create</option>
        <option value="update">Update</option>
        <option value="delete">Delete</option>
        <option value="login">Login</option>
      </select>
      <button class="flex items-center px-3 py-2 text-sm font-medium border border-input bg-background hover:bg-accent rounded-md transition-colors">
        <Filter class="w-4 h-4 mr-2" />
        Filters
      </button>
    </div>
  </div>

  <!-- Audit Logs List -->
  <div class="bg-card border rounded-lg">
    <div class="px-6 py-4 border-b">
      <h2 class="text-lg font-semibold flex items-center">
        <Activity class="w-5 h-5 mr-2" />
        System Activity
      </h2>
    </div>
    <div class="p-6">
      {#if loading}
        <div class="text-center py-8">Loading audit logs...</div>
      {:else if logs.length === 0}
        <div class="text-center py-12">
          <FileText class="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 class="text-lg font-semibold mb-2">No audit logs found</h3>
          <p class="text-muted-foreground">System activity will appear here</p>
        </div>
      {:else}
        <div class="space-y-4">
          {#each logs as log}
            <div class="flex items-start space-x-4 p-4 border rounded-lg">
              <div class="p-2 bg-primary/10 rounded-lg">
                <Activity class="w-4 h-4 text-primary" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <h3 class="font-medium">{log.action}</h3>
                  <span class="text-sm text-muted-foreground">{formatDate(log.timestamp)}</span>
                </div>
                <p class="text-sm text-muted-foreground mt-1">{log.description}</p>
                <div class="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                  <span class="flex items-center">
                    <User class="w-3 h-3 mr-1" />
                    {log.user_email}
                  </span>
                  <span>Resource: {log.resource_type}</span>
                  <span>IP: {log.ip_address}</span>
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>
</div> 