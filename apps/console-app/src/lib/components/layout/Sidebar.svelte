<script lang="ts">
  import { page } from '$app/stores'
  import { goto } from '$app/navigation'
  import { supabase } from '$lib/supabase'
  import type { ConsoleUser } from '$types'
  import { 
    Settings, 
    Building2, 
    Users, 
    FileText, 
    BarChart3, 
    Shield,
    LogOut,
    Menu,
    X,
    ChevronLeft,
    ChevronRight,
    Database
  } from 'lucide-svelte'
  import { writable } from 'svelte/store'
  import { onMount } from 'svelte'

  export let consoleUser: ConsoleUser

  const sidebarOpen = writable(true)
  let mounted = false
  let isMobile = false

  onMount(() => {
    mounted = true
    
    // Check if mobile
    const checkMobile = () => {
      isMobile = window.innerWidth < 768
      if (isMobile) {
        sidebarOpen.set(false)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    // Keyboard shortcut (Cmd/Ctrl + B)
    const handleKeyboard = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault()
        toggleSidebar()
      }
    }
    
    document.addEventListener('keydown', handleKeyboard)
    
    return () => {
      window.removeEventListener('resize', checkMobile)
      document.removeEventListener('keydown', handleKeyboard)
    }
  })

  function toggleSidebar() {
    sidebarOpen.update(state => !state)
  }

  function closeSidebar() {
    sidebarOpen.set(false)
  }

  // Navigation items based on user permissions
  $: navigationItems = [
    {
      section: 'Main',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          href: '/dashboard',
          icon: BarChart3,
          active: $page.url.pathname === '/dashboard'
        }
      ]
    },
    {
      section: 'Management',
      items: [
        {
          id: 'enums',
          label: 'Enum Management',
          href: '/enums',
          icon: FileText,
          active: $page.url.pathname.startsWith('/enums'),
          permissions: ['enums:read']
        },
        {
          id: 'companies',
          label: 'Companies',
          href: '/companies',
          icon: Building2,
          active: $page.url.pathname.startsWith('/companies'),
          permissions: ['companies:read'],
          show: consoleUser.role === 'super_admin'
        },
        {
          id: 'users',
          label: 'User Management',
          href: '/users',
          icon: Users,
          active: $page.url.pathname.startsWith('/users'),
          permissions: ['users:read']
        }
      ].filter(item => 
        (item.show === undefined || item.show) &&
        (!item.permissions || item.permissions.some(perm => hasPermission(perm)))
      )
    },
    {
      section: 'System',
      items: [
        {
          id: 'audit-logs',
          label: 'Audit Logs',
          href: '/audit-logs',
          icon: Shield,
          active: $page.url.pathname.startsWith('/audit-logs'),
          permissions: ['audit_logs:read']
        },
        {
          id: 'settings',
          label: 'Settings',
          href: '/settings',
          icon: Settings,
          active: $page.url.pathname.startsWith('/settings'),
          permissions: ['settings:read']
        }
      ].filter(item => 
        (!item.permissions || item.permissions.some(perm => hasPermission(perm)))
      )
    }
  ]

  function hasPermission(permission: string): boolean {
    if (consoleUser.role === 'super_admin') return true
    
    const [resource, action] = permission.split(':')
    return consoleUser.permissions.some(p => 
      p.resource === resource && p.actions.includes(action as any)
    )
  }

  async function handleLogout() {
    try {
      await supabase.auth.signOut()
      goto('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  function navigateTo(href: string) {
    goto(href)
    if (isMobile) {
      closeSidebar()
    }
  }

  $: isOpen = $sidebarOpen
  $: sidebarClasses = [
    'fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 ease-in-out',
    'bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800',
    'shadow-lg lg:shadow-none',
    isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
    isOpen ? 'w-72 lg:w-64' : 'lg:w-16'
  ].filter(Boolean).join(' ')

  $: overlayClasses = [
    'fixed inset-0 z-40 bg-black/50 transition-opacity duration-300',
    'lg:hidden',
    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
  ].join(' ')
</script>

<!-- Mobile overlay -->
{#if isMobile}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class={overlayClasses} on:click={closeSidebar}></div>
{/if}

<!-- Sidebar -->
<div class={sidebarClasses}>
  <!-- Header -->
  <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
    {#if isOpen}
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
          <Database class="w-5 h-5 text-white" />
        </div>
        <div class="min-w-0">
          <h1 class="font-semibold text-gray-900 dark:text-white truncate">Console</h1>
          <p class="text-xs text-gray-500 dark:text-gray-400 truncate">Admin Dashboard</p>
        </div>
      </div>
    {:else}
      <div class="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
        <Database class="w-5 h-5 text-white" />
      </div>
    {/if}
    
    <button
      on:click={toggleSidebar}
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

  <!-- User Profile -->
  {#if isOpen}
    <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center">
          <span class="text-sm font-medium text-purple-700 dark:text-purple-300">
            {consoleUser.email.charAt(0).toUpperCase()}
          </span>
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{consoleUser.email}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400 capitalize">
            {consoleUser.role.replace('_', ' ')}
          </p>
        </div>
      </div>
    </div>
  {:else}
    <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-center">
      <div class="w-8 h-8 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center">
        <span class="text-sm font-medium text-purple-700 dark:text-purple-300">
          {consoleUser.email.charAt(0).toUpperCase()}
        </span>
      </div>
    </div>
  {/if}

  <!-- Navigation -->
  <nav class="flex-1 overflow-y-auto p-4 space-y-6">
    {#each navigationItems as section}
      {#if section.items.length > 0}
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
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' 
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                    }
                    {!isOpen ? 'justify-center' : ''}"
                  title={!isOpen ? item.label : ''}
                >
                  <svelte:component this={item.icon} class="w-5 h-5 flex-shrink-0" />
                  {#if isOpen}
                    <span class="truncate">{item.label}</span>
                  {/if}
                </button>
              </li>
            {/each}
          </ul>
        </div>
      {/if}
    {/each}
  </nav>

  <!-- Footer -->
  <div class="border-t border-gray-200 dark:border-gray-700 p-4">
    <button
      on:click={handleLogout}
      class="w-full flex items-center gap-3 px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-lg transition-colors
        {!isOpen ? 'justify-center' : ''}"
      title={!isOpen ? 'Sign Out' : ''}
    >
      <LogOut class="w-5 h-5 flex-shrink-0" />
      {#if isOpen}
        <span>Sign Out</span>
      {/if}
    </button>

    <!-- Desktop toggle button -->
    {#if !isMobile}
      <button
        on:click={toggleSidebar}
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
</div>
