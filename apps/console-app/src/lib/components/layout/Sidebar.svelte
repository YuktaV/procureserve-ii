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
    Database
  } from 'lucide-svelte'

  export let consoleUser: ConsoleUser

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
  }
</script>

<!-- Sidebar Container -->
<div class="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
  <!-- Header -->
  <div class="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
    <div class="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
      <Database class="w-5 h-5 text-white" />
    </div>
    <div>
      <h1 class="font-semibold text-gray-900 dark:text-white">Console</h1>
      <p class="text-xs text-gray-500 dark:text-gray-400">Administration</p>
    </div>
  </div>

  <!-- User Profile -->
  <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center">
        <span class="text-sm font-medium text-purple-700 dark:text-purple-300">
          {consoleUser.email.charAt(0).toUpperCase()}
        </span>
      </div>
      <div class="min-w-0 flex-1">
        <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
          {consoleUser.email}
        </p>
        <p class="text-xs text-gray-500 dark:text-gray-400 capitalize">
          {consoleUser.role.replace('_', ' ')}
        </p>
      </div>
    </div>
  </div>

  <!-- Navigation -->
  <nav class="flex-1 overflow-y-auto p-4">
    <div class="space-y-6">
      {#each navigationItems as section}
        {#if section.items.length > 0}
          <div>
            <h3 class="px-2 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {section.section}
            </h3>
            
            <div class="space-y-1">
              {#each section.items as item}
                <button
                  on:click={() => navigateTo(item.href)}
                  class="w-full flex items-center gap-3 px-2 py-2 text-sm font-medium rounded-lg transition-colors text-left
                    {item.active 
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' 
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                    }"
                >
                  <svelte:component this={item.icon} class="w-5 h-5 flex-shrink-0" />
                  <span>{item.label}</span>
                </button>
              {/each}
            </div>
          </div>
        {/if}
      {/each}
    </div>
  </nav>

  <!-- Footer -->
  <div class="border-t border-gray-200 dark:border-gray-700 p-4">
    <button
      on:click={handleLogout}
      class="w-full flex items-center gap-3 px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-lg transition-colors"
    >
      <LogOut class="w-5 h-5 flex-shrink-0" />
      <span>Sign Out</span>
    </button>
  </div>
</div>
