<script lang="ts">
  import { page } from '$app/stores'
  import type { ConsoleUser } from '$types'
  import { Bell, Search, Sun, Moon, ChevronDown } from 'lucide-svelte'
  import { writable } from 'svelte/store'

  export let consoleUser: ConsoleUser

  const darkMode = writable(false)
  let showUserMenu = false

  // Toggle dark mode
  function toggleDarkMode() {
    darkMode.update(dark => {
      const newDark = !dark
      if (newDark) {
        document.documentElement.classList.add('dark')
        localStorage.setItem('theme', 'dark')
      } else {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('theme', 'light')
      }
      return newDark
    })
  }

  // Initialize dark mode from localStorage
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = stored === 'dark' || (!stored && prefersDark)
    
    darkMode.set(isDark)
    if (isDark) {
      document.documentElement.classList.add('dark')
    }
  }

  // Get page title based on current route
  $: pageTitle = getPageTitle($page.url.pathname)

  function getPageTitle(pathname: string): string {
    if (pathname === '/dashboard') return 'Dashboard'
    if (pathname.startsWith('/enums')) return 'Enum Management'
    if (pathname.startsWith('/companies')) return 'Companies'
    if (pathname.startsWith('/users')) return 'User Management'
    if (pathname.startsWith('/audit-logs')) return 'Audit Logs'
    if (pathname.startsWith('/settings')) return 'Settings'
    return 'Console'
  }

  // Get breadcrumbs
  $: breadcrumbs = getBreadcrumbs($page.url.pathname)

  function getBreadcrumbs(pathname: string): Array<{label: string; href?: string}> {
    const segments = pathname.split('/').filter(Boolean)
    const crumbs = [{ label: 'Console', href: '/dashboard' }]
    
    let currentPath = ''
    for (const segment of segments) {
      currentPath += `/${segment}`
      
      let label = segment.charAt(0).toUpperCase() + segment.slice(1)
      if (segment === 'audit-logs') label = 'Audit Logs'
      if (segment === 'enum-management') label = 'Enum Management'
      
      crumbs.push({ 
        label,
        href: segments.indexOf(segment) === segments.length - 1 ? undefined : currentPath
      })
    }
    
    return crumbs
  }
</script>

<header class="console-header h-16 flex items-center justify-between px-6 lg:pl-6">
  <!-- Left side - Title and breadcrumbs -->
  <div class="flex items-center space-x-4 lg:ml-64">
    <div>
      <h1 class="text-lg font-semibold">{pageTitle}</h1>
      <nav class="flex items-center space-x-1 text-sm text-muted-foreground">
        {#each breadcrumbs as crumb, index}
          {#if index > 0}
            <span>/</span>
          {/if}
          {#if crumb.href}
            <a href={crumb.href} class="hover:text-foreground transition-colors">
              {crumb.label}
            </a>
          {:else}
            <span class="text-foreground">{crumb.label}</span>
          {/if}
        {/each}
      </nav>
    </div>
  </div>

  <!-- Right side - Actions -->
  <div class="flex items-center space-x-4">
    <!-- Search -->
    <div class="relative hidden md:block">
      <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <input
        type="text"
        placeholder="Search..."
        class="pl-10 pr-4 py-2 w-64 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
      />
    </div>

    <!-- Dark mode toggle -->
    <button
      on:click={toggleDarkMode}
      class="p-2 rounded-md hover:bg-accent transition-colors"
      aria-label="Toggle dark mode"
    >
      {#if $darkMode}
        <Sun class="w-5 h-5" />
      {:else}
        <Moon class="w-5 h-5" />
      {/if}
    </button>

    <!-- Notifications -->
    <button
      class="p-2 rounded-md hover:bg-accent transition-colors relative"
      aria-label="Notifications"
    >
      <Bell class="w-5 h-5" />
      <!-- Notification badge -->
      <span class="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full"></span>
    </button>

    <!-- User menu -->
    <div class="relative">
      <button
        on:click={() => showUserMenu = !showUserMenu}
        class="flex items-center space-x-2 p-2 rounded-md hover:bg-accent transition-colors"
      >
        <div class="w-7 h-7 bg-primary rounded-full flex items-center justify-center">
          <span class="text-primary-foreground font-medium text-sm">
            {consoleUser.email.charAt(0).toUpperCase()}
          </span>
        </div>
        <ChevronDown class="w-4 h-4" />
      </button>

      {#if showUserMenu}
        <div class="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-md shadow-lg z-50">
          <div class="p-3 border-b">
            <p class="text-sm font-medium">{consoleUser.email}</p>
            <p class="text-xs text-muted-foreground capitalize">
              {consoleUser.role.replace('_', ' ')}
            </p>
          </div>
          <div class="p-1">
            <a
              href="/settings/profile"
              class="block px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
              on:click={() => showUserMenu = false}
            >
              Profile Settings
            </a>
            <a
              href="/settings/security"
              class="block px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
              on:click={() => showUserMenu = false}
            >
              Security
            </a>
            <hr class="my-1" />
            <button
              on:click={() => {
                showUserMenu = false
                // Handle logout
              }}
              class="block w-full text-left px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      {/if}
    </div>
  </div>
</header>

<!-- Close user menu when clicking outside -->
{#if showUserMenu}
  <div
    class="fixed inset-0 z-40"
    on:click={() => showUserMenu = false}
    on:keydown={() => showUserMenu = false}
    role="button"
    tabindex="0"
    aria-label="Close menu"
  ></div>
{/if}