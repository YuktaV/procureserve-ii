<script lang="ts">
  import '../app.css'
  import { onMount } from 'svelte'
  import { invalidate } from '$app/navigation'
  import type { LayoutData } from './$types'
  import { page } from '$app/stores'
  import { supabase } from '$lib/supabase'
  import Header from '$components/layout/Header.svelte'
  import Sidebar from '$components/layout/Sidebar.svelte'
  import Toast from '$components/shared/Toast.svelte'
  import { toastStore } from '$stores/toast'
  import { writable } from 'svelte/store'

  export let data: LayoutData

  $: ({ user, consoleUser } = data)

  const sidebarOpen = writable(true)
  let mounted = false

  onMount(() => {
    mounted = true
    // Default to open on desktop
    if (window.innerWidth >= 1024) {
      sidebarOpen.set(true)
    } else {
      sidebarOpen.set(false)
    }
  })

  function toggleSidebar() {
    sidebarOpen.update(state => !state)
  }

  // Set up auth state change listener
  onMount(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        invalidate('supabase:auth')
      }
    })

    return () => subscription.unsubscribe()
  })

  // Determine if we should show the full console layout
  $: isAuthPage = $page.route.id?.startsWith('/(auth)')
  $: isPublicPage = $page.route.id === '/'
  $: showConsoleLayout = !isAuthPage && !isPublicPage && consoleUser
</script>

<svelte:head>
  <title>ProcureServe Console</title>
</svelte:head>

{#if showConsoleLayout && consoleUser}
  <!-- Console Layout with New Sidebar -->
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900" data-sidebar="true">
    <!-- Sidebar -->
    <Sidebar {consoleUser} bind:sidebarOpen={$sidebarOpen} />

    <!-- Main Content -->
    <div class="flex flex-col min-h-screen transition-all duration-300 ease-in-out">
      <!-- Header -->
      <Header {consoleUser} sidebarOpen={$sidebarOpen} {toggleSidebar} />
      
      <!-- Page content -->
      <main class="flex-1 overflow-x-hidden">
        <div class="p-4 lg:p-6">
          <slot />
        </div>
      </main>
    </div>
  </div>
{:else}
  <!-- Simple layout for auth pages -->
  <div class="min-h-screen bg-background">
    <slot />
  </div>
{/if}

<!-- Toast notifications -->
<Toast bind:toasts={$toastStore} />

<style>
  :global(html) {
    scroll-behavior: smooth;
  }
  
  :global(body) {
    overscroll-behavior: none;
    overflow-x: hidden;
  }

  /* Custom scrollbar for sidebar */
  :global([data-sidebar="true"] .overflow-y-auto) {
    scrollbar-width: thin;
    scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
  }
  
  :global([data-sidebar="true"] .overflow-y-auto::-webkit-scrollbar) {
    width: 4px;
  }
  
  :global([data-sidebar="true"] .overflow-y-auto::-webkit-scrollbar-track) {
    background: transparent;
  }
  
  :global([data-sidebar="true"] .overflow-y-auto::-webkit-scrollbar-thumb) {
    background-color: rgba(156, 163, 175, 0.5);
    border-radius: 2px;
  }
  
  :global([data-sidebar="true"] .overflow-y-auto::-webkit-scrollbar-thumb:hover) {
    background-color: rgba(156, 163, 175, 0.7);
  }
</style>
