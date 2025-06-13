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

  export let data: LayoutData

  $: ({ user, consoleUser } = data)

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
  <!-- Console Layout -->
  <div class="h-screen flex overflow-hidden bg-background">
    <!-- Sidebar -->
    <Sidebar {consoleUser} />

    <!-- Main content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->
      <Header {consoleUser} />
      
      <!-- Page content -->
      <main class="flex-1 overflow-auto console-main console-scrollbar">
        <div class="p-6">
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
  }
</style>