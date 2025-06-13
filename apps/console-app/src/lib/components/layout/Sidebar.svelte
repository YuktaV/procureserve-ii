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
    X
  } from 'lucide-svelte'
  import { writable } from 'svelte/store'

  export let consoleUser: ConsoleUser

  const sidebarCollapsed = writable(false)
  let showMobileMenu = false

  // Navigation items based on user permissions
  $: navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: '/dashboard',
      icon: BarChart3,
      active: $page.url.pathname === '/dashboard'
    },
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
    },
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
    // Show if no specific show condition or show condition is true
    (item.show === undefined || item.show) &&
    // Show if user has required permissions
    (!item.permissions || item.permissions.some(perm => hasPermission(perm)))
  )

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

  function toggleMobileMenu() {
    showMobileMenu = !showMobileMenu
  }
</script>

<!-- Mobile menu button -->
<div class="lg:hidden fixed top-4 left-4 z-50">
  <button
    on:click={toggleMobileMenu}
    class="p-2 rounded-md bg-card border shadow-sm"
    aria-label="Toggle menu"
  >
    {#if showMobileMenu}
      <X class="w-5 h-5" />
    {:else}
      <Menu class="w-5 h-5" />
    {/if}
  </button>
</div>

<!-- Sidebar -->
<div class="console-sidebar {showMobileMenu ? 'fixed inset-y-0 left-0 z-40' : 'hidden'} lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0">
  <!-- Mobile backdrop -->
  {#if showMobileMenu}
    <div 
      class="fixed inset-0 bg-black/50 lg:hidden z-30"
      on:click={toggleMobileMenu}
      on:keydown={toggleMobileMenu}
      role="button"
      tabindex="0"
      aria-label="Close menu"
    ></div>
  {/if}

  <div class="flex flex-col flex-1 min-h-0 bg-card border-r relative z-40">
    <!-- Logo -->
    <div class="flex items-center h-16 px-4 border-b">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <span class="text-primary-foreground font-bold text-sm">PS</span>
        </div>
        <div>
          <h1 class="text-lg font-semibold">Console</h1>
          <p class="text-xs text-muted-foreground">Admin Dashboard</p>
        </div>
      </div>
    </div>

    <!-- User info -->
    <div class="px-4 py-3 border-b bg-muted/50">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <span class="text-primary-foreground font-medium text-sm">
            {consoleUser.email.charAt(0).toUpperCase()}
          </span>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium truncate">{consoleUser.email}</p>
          <p class="text-xs text-muted-foreground capitalize">
            {consoleUser.role.replace('_', ' ')}
          </p>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
      {#each navigationItems as item}
        <a
          href={item.href}
          class="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors {
            item.active 
              ? 'bg-primary text-primary-foreground' 
              : 'text-muted-foreground hover:text-foreground hover:bg-accent'
          }"
          on:click={() => showMobileMenu = false}
        >
          <svelte:component this={item.icon} class="w-5 h-5 mr-3" />
          {item.label}
        </a>
      {/each}
    </nav>

    <!-- Logout -->
    <div class="px-4 py-4 border-t">
      <button
        on:click={handleLogout}
        class="flex items-center w-full px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
      >
        <LogOut class="w-5 h-5 mr-3" />
        Sign Out
      </button>
    </div>
  </div>
</div>