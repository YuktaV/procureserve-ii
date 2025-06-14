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

  async function handleLogout() {
    try {
      const { supabase } = await import('$lib/supabase')
      await supabase.auth.signOut()
      window.location.href = '/login'
    } catch (error) {
      console.error('Logout error:', error)
      window.location.href = '/login'
    }
  }
</script>

<header class="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6">
  <div class="flex items-center justify-between h-full">
    <!-- Left side - Title -->
    <div>
      <h1 class="text-xl font-semibold text-gray-900 dark:text-white">{pageTitle}</h1>
    </div>

    <!-- Right side - Actions -->
    <div class="flex items-center gap-3">
      <!-- Search -->
      <div class="relative hidden md:block">
        <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          class="pl-10 pr-4 py-2 w-64 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:text-white dark:placeholder-gray-400"
        />
      </div>

      <!-- Dark mode toggle -->
      <button
        on:click={toggleDarkMode}
        class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Toggle dark mode"
      >
        {#if $darkMode}
          <Sun class="w-5 h-5 text-gray-600 dark:text-gray-300" />
        {:else}
          <Moon class="w-5 h-5 text-gray-600 dark:text-gray-300" />
        {/if}
      </button>

      <!-- Notifications -->
      <button
        class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
        aria-label="Notifications"
      >
        <Bell class="w-5 h-5 text-gray-600 dark:text-gray-300" />
        <span class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
      </button>

      <!-- User menu -->
      <div class="relative">
        <button
          on:click={() => showUserMenu = !showUserMenu}
          class="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <div class="w-7 h-7 bg-purple-600 rounded-full flex items-center justify-center">
            <span class="text-white font-medium text-sm">
              {consoleUser.email.charAt(0).toUpperCase()}
            </span>
          </div>
          <ChevronDown class="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </button>

        {#if showUserMenu}
          <div class="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
            <div class="p-4 border-b border-gray-200 dark:border-gray-700">
              <p class="text-sm font-medium text-gray-900 dark:text-white truncate">{consoleUser.email}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {consoleUser.role.replace('_', ' ')}
              </p>
            </div>
            <div class="p-2">
              <button
                on:click={() => {
                  showUserMenu = false
                  handleLogout()
                }}
                class="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</header>

<!-- Close user menu when clicking outside -->
{#if showUserMenu}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="fixed inset-0 z-40"
    on:click={() => showUserMenu = false}
  ></div>
{/if}
