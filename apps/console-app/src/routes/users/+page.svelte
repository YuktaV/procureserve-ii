<script lang="ts">
  import { onMount } from 'svelte'
  import { Users, Plus, Search, Filter, UserCheck, UserX } from 'lucide-svelte'

  export let data

  let users: any[] = []
  let searchQuery = ''
  let loading = true

  onMount(async () => {
    // Load users data
    loading = false
  })
</script>

<svelte:head>
  <title>Users | Console</title>
</svelte:head>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-3xl font-bold">Users</h1>
      <p class="text-muted-foreground">Manage system users and permissions</p>
    </div>
    <div class="flex items-center space-x-3">
      <button class="flex items-center px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors">
        <Plus class="w-4 h-4 mr-2" />
        Add User
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
          placeholder="Search users..."
          bind:value={searchQuery}
          class="pl-10 pr-4 py-2 w-full text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <button class="flex items-center px-3 py-2 text-sm font-medium border border-input bg-background hover:bg-accent rounded-md transition-colors">
        <Filter class="w-4 h-4 mr-2" />
        Filters
      </button>
    </div>
  </div>

  <!-- Users List -->
  <div class="bg-card border rounded-lg">
    <div class="px-6 py-4 border-b">
      <h2 class="text-lg font-semibold flex items-center">
        <Users class="w-5 h-5 mr-2" />
        All Users
      </h2>
    </div>
    <div class="p-6">
      {#if loading}
        <div class="text-center py-8">Loading users...</div>
      {:else if users.length === 0}
        <div class="text-center py-12">
          <Users class="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 class="text-lg font-semibold mb-2">No users found</h3>
          <p class="text-muted-foreground mb-4">Get started by adding your first user</p>
          <button class="inline-flex items-center px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors">
            <Plus class="w-4 h-4 mr-2" />
            Add User
          </button>
        </div>
      {:else}
        <div class="space-y-4">
          {#each users as user}
            <div class="flex items-center justify-between p-4 border rounded-lg">
              <div class="flex items-center space-x-3">
                <div class="p-2 bg-primary/10 rounded-lg">
                  <UserCheck class="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 class="font-semibold">{user.email}</h3>
                  <p class="text-sm text-muted-foreground">{user.role}</p>
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
    </div>
  </div>
</div> 