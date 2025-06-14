<script lang="ts">
  import { onMount } from 'svelte'
  import { page } from '$app/stores'
  import Sidebar from './Sidebar.svelte'
  import SidebarContent from './SidebarContent.svelte'
  import Breadcrumbs from './breadcrumbs.svelte'
  import { Menu } from 'lucide-svelte'
  
  export let user: any = null
  export let company: any = null
  export let showBreadcrumbs = true
  export let title = ''
  
  let sidebarOpen = false
  let mounted = false
  
  onMount(() => {
    mounted = true
    // Default to open on desktop
    if (window.innerWidth >= 1024) {
      sidebarOpen = true
    }
  })
  
  function toggleSidebar() {
    sidebarOpen = !sidebarOpen
  }
  
  function closeSidebar() {
    sidebarOpen = false
  }
  
  // Generate page title from route
  $: pageTitle = title || generatePageTitle($page.url.pathname)
  
  function generatePageTitle(pathname: string): string {
    const segments = pathname.split('/').filter(Boolean)
    if (segments.length === 0) return 'Dashboard'
    
    const titleMap: Record<string, string> = {
      'dashboard': 'Dashboard',
      'jobs': 'Jobs',
      'candidates': 'Candidates', 
      'applications': 'Applications',
      'interviews': 'Interviews',
      'bench': 'Bench Sales',
      'talent': 'Available Talent',
      'requirements': 'Client Requirements',
      'submissions': 'Submissions',
      'reports': 'Reports',
      'activity': 'Activity',
      'settings': 'Settings',
      'users': 'User Management',
      'company': 'Company Settings',
      'profile': 'Profile Settings',
      'security': 'Security Settings',
      'preferences': 'Preferences'
    }
    
    return titleMap[segments[segments.length - 1]] || segments[segments.length - 1]
  }
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900" data-sidebar="true">
  <!-- Sidebar -->
  <Sidebar bind:isOpen={sidebarOpen} let:isOpen let:toggle let:close let:isMobile>
    <SidebarContent {isOpen} {toggle} {close} {isMobile} {user} {company} />
  </Sidebar>
  
  <!-- Main Content -->
  <div class="flex flex-col min-h-screen transition-all duration-300 ease-in-out
    {sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'}">
    
    <!-- Top Header -->
    <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 lg:px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <!-- Mobile menu button -->
          <button
            on:click={toggleSidebar}
            class="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu class="w-5 h-5" />
          </button>
          
          <div>
            <h1 class="text-xl font-semibold text-gray-900 dark:text-white">{pageTitle}</h1>
            {#if showBreadcrumbs}
              <!-- <Breadcrumbs /> - Temporarily disabled until breadcrumb generation is implemented -->
            {/if}
          </div>
        </div>
        
        <!-- Header actions slot -->
        <div class="flex items-center gap-3">
          <slot name="header-actions" />
        </div>
      </div>
    </header>
    
    <!-- Main content area -->
    <main class="flex-1 overflow-x-hidden">
      <div class="p-4 lg:p-6">
        <slot />
      </div>
    </main>
  </div>
</div>

<style>
  /* Smooth transitions for sidebar state changes */
  :global(body) {
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
