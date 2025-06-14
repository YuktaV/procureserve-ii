<script lang="ts">
  import { page } from '$app/stores'
  import { goto } from '$app/navigation'
  import { 
    Home, 
    Briefcase, 
    Users, 
    Calendar,
    FileText,
    Settings,
    Building2,
    BarChart3,
    UserPlus,
    Search,
    Bell,
    ChevronLeft,
    ChevronRight,
    Menu,
    X
  } from 'lucide-svelte'
  
  export let isOpen = true
  export let toggle: () => void
  export let close: () => void
  export let isMobile = false
  export let user: any = null
  export let company: any = null
  
  // Navigation items based on user role and process permissions
  $: navigationItems = getNavigationItems(user)
  
  function getNavigationItems(user: any) {
    if (!user) return []
    
    const items = [
      {
        section: 'Main',
        items: [
          { name: 'Dashboard', href: '/dashboard', icon: Home, active: $page.url.pathname === '/dashboard' },
        ]
      }
    ]
    
    // Add process-specific navigation
    if (user.process_permissions?.includes('recruitment')) {
      items.push({
        section: 'Recruitment',
        items: [
          { name: 'Jobs', href: '/jobs', icon: Briefcase, active: $page.url.pathname.startsWith('/jobs') },
          { name: 'Candidates', href: '/candidates', icon: Users, active: $page.url.pathname.startsWith('/candidates') },
          { name: 'Applications', href: '/applications', icon: FileText, active: $page.url.pathname.startsWith('/applications') },
          { name: 'Interviews', href: '/interviews', icon: Calendar, active: $page.url.pathname.startsWith('/interviews') },
        ]
      })
    }
    
    if (user.process_permissions?.includes('bench_sales')) {
      items.push({
        section: 'Bench Sales',
        items: [
          { name: 'Available Talent', href: '/bench/talent', icon: UserPlus, active: $page.url.pathname.startsWith('/bench/talent') },
          { name: 'Client Requirements', href: '/bench/requirements', icon: Search, active: $page.url.pathname.startsWith('/bench/requirements') },
          { name: 'Submissions', href: '/bench/submissions', icon: FileText, active: $page.url.pathname.startsWith('/bench/submissions') },
        ]
      })
    }
    
    // Admin and manager features
    if (['admin', 'manager'].includes(user.role)) {
      items.push({
        section: 'Analytics',
        items: [
          { name: 'Reports', href: '/reports', icon: BarChart3, active: $page.url.pathname.startsWith('/reports') },
          { name: 'Activity', href: '/activity', icon: Bell, active: $page.url.pathname.startsWith('/activity') },
        ]
      })
    }
    
    // Settings (always available)
    items.push({
      section: 'Account',
      items: [
        { name: 'Settings', href: '/settings', icon: Settings, active: $page.url.pathname.startsWith('/settings') },
      ]
    })
    
    return items
  }
  
  function navigateTo(href: string) {
    goto(href)
    if (isMobile) {
      close()
    }
  }
  
  async function signOut() {
    const response = await fetch('/api/auth/signout', { method: 'POST' })
    if (response.ok) {
      goto('/')
    }
  }
</script>

<!-- Header -->
<div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
  {#if isOpen}
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
        <Building2 class="w-5 h-5 text-white" />
      </div>
      <div class="min-w-0">
        <h1 class="font-semibold text-gray-900 dark:text-white truncate">ProcureServe</h1>
        {#if company}
          <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{company.name}</p>
        {/if}
      </div>
    </div>
  {:else}
    <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
      <Building2 class="w-5 h-5 text-white" />
    </div>
  {/if}
  
  <button
    on:click={toggle}
    class="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors lg:hidden"
    aria-label="Toggle sidebar"
  >
    {#if isOpen}
      <X class="w-4 h-4" />
    {:else}
      <Menu class="w-4 h-4" />
    {/if}
  </button>
</div>

<!-- Navigation -->
<nav class="flex-1 overflow-y-auto p-4 space-y-6">
  {#each navigationItems as section}
    <div>
      {#if isOpen}
        <h3 class="px-2 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {section.section}
        </h3>
      {/if}
      
      <ul class="space-y-1">
        {#each section.items as item}
          <li>
            <button
              on:click={() => navigateTo(item.href)}
              class="w-full flex items-center gap-3 px-2 py-2 text-sm font-medium rounded-lg transition-colors
                {item.active 
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' 
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                }
                {!isOpen ? 'justify-center' : ''}"
              title={!isOpen ? item.name : ''}
            >
              <svelte:component this={item.icon} class="w-5 h-5 flex-shrink-0" />
              {#if isOpen}
                <span class="truncate">{item.name}</span>
              {/if}
            </button>
          </li>
        {/each}
      </ul>
    </div>
  {/each}
</nav>

<!-- Footer / User Profile -->
<div class="border-t border-gray-200 dark:border-gray-700 p-4">
  {#if user}
    <div class="flex items-center gap-3 {!isOpen ? 'justify-center' : ''}">
      <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
        <span class="text-sm font-medium text-gray-700">
          {user.profile?.first_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
        </span>
      </div>
      
      {#if isOpen}
        <div class="min-w-0 flex-1">
          <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
            {user.profile?.first_name ? `${user.profile.first_name} ${user.profile.last_name || ''}`.trim() : user.email}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{user.role}</p>
        </div>
        
        <button
          on:click={signOut}
          class="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title="Sign out"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      {/if}
    </div>
  {/if}
  
  <!-- Desktop toggle button -->
  {#if !isMobile}
    <button
      on:click={toggle}
      class="hidden lg:flex w-full items-center justify-center mt-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-700"
      title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
    >
      {#if isOpen}
        <ChevronLeft class="w-4 h-4" />
      {:else}
        <ChevronRight class="w-4 h-4" />
      {/if}
    </button>
  {/if}
</div>
