<script lang="ts">
  import { enhance } from '$app/forms'
  import { page } from '$app/stores'
  import { Eye, EyeOff, Shield, AlertCircle } from 'lucide-svelte'
  import { onMount } from 'svelte'
  import type { PageData, ActionData } from './$types'

  export let data: PageData
  export let form: ActionData

  let showPassword = false
  let loading = false
  let email = ''
  let password = ''

  $: errorMessage = $page.url.searchParams.get('error') || form?.error
  $: successMessage = $page.url.searchParams.get('message')

  function togglePasswordVisibility() {
    showPassword = !showPassword
  }

  onMount(() => {
    // Focus email input on mount
    const emailInput = document.getElementById('email')
    if (emailInput) emailInput.focus()
  })
</script>

<svelte:head>
  <title>Console Login - ProcureServe</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-background px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full space-y-8">
    <!-- Header -->
    <div class="text-center">
      <div class="mx-auto w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
        <Shield class="w-6 h-6 text-primary-foreground" />
      </div>
      <h2 class="text-3xl font-bold text-foreground">Console Access</h2>
      <p class="mt-2 text-sm text-muted-foreground">
        Sign in to your administrative account
      </p>
      {#if $page.url.hostname === 'localhost' || $page.url.hostname === '127.0.0.1'}
        <div class="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
          <p class="text-xs text-blue-700 dark:text-blue-300 font-medium">Development Mode</p>
          <p class="text-xs text-blue-600 dark:text-blue-400 mt-1">
            Use any of these test accounts with password: <code class="bg-blue-100 dark:bg-blue-800 px-1 rounded">admin123</code>
          </p>
          <div class="text-xs text-blue-600 dark:text-blue-400 mt-1 space-y-1">
            <div>• admin@procureserve.com (Super Admin)</div>
            <div>• support@procureserve.com (Company Admin)</div>
            <div>• sales@procureserve.com (Company Manager)</div>
          </div>
        </div>
      {/if}
    </div>

    <!-- Error/Success Messages -->
    {#if errorMessage}
      <div class="rounded-md bg-destructive/15 p-4">
        <div class="flex">
          <AlertCircle class="h-5 w-5 text-destructive" />
          <div class="ml-3">
            <h3 class="text-sm font-medium text-destructive">Authentication Error</h3>
            <div class="mt-2 text-sm text-destructive">
              {#if errorMessage === 'access_denied'}
                You don't have console access. Contact your administrator.
              {:else if errorMessage === 'account_inactive'}
                Your account has been deactivated. Contact your administrator.
              {:else}
                {errorMessage}
              {/if}
            </div>
          </div>
        </div>
      </div>
    {/if}

    {#if successMessage}
      <div class="rounded-md bg-green-50 p-4 dark:bg-green-900/20">
        <div class="flex">
          <div class="ml-3">
            <div class="text-sm text-green-700 dark:text-green-400">
              {successMessage}
            </div>
          </div>
        </div>
      </div>
    {/if}

    <!-- Login Form -->
    <form 
      method="POST" 
      action="?/login"
      use:enhance={() => {
        loading = true
        return async ({ update }) => {
          loading = false
          await update()
        }
      }}
      class="mt-8 space-y-6"
    >
      <div class="space-y-4">
        <!-- Email -->
        <div class="form-field">
          <label for="email" class="form-label">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autocomplete="email"
            required
            bind:value={email}
            class="form-input"
            placeholder="admin@company.com"
            disabled={loading}
          />
        </div>

        <!-- Password -->
        <div class="form-field">
          <label for="password" class="form-label">
            Password
          </label>
          <div class="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autocomplete="current-password"
              required
              bind:value={password}
              class="form-input pr-10"
              placeholder="Enter your password"
              disabled={loading}
            />
            <button
              type="button"
              class="absolute inset-y-0 right-0 pr-3 flex items-center"
              on:click={togglePasswordVisibility}
              disabled={loading}
            >
              {#if showPassword}
                <EyeOff class="h-4 w-4 text-muted-foreground" />
              {:else}
                <Eye class="h-4 w-4 text-muted-foreground" />
              {/if}
            </button>
          </div>
        </div>
      </div>

      <!-- Remember me and forgot password -->
      <div class="flex items-center justify-between">
        <label class="flex items-center">
          <input
            type="checkbox"
            name="remember"
            class="h-4 w-4 text-primary focus:ring-primary border-input rounded"
          />
          <span class="ml-2 text-sm text-muted-foreground">Remember me</span>
        </label>

        <div class="text-sm">
          <a
            href="/forgot-password"
            class="font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Forgot your password?
          </a>
        </div>
      </div>

      <!-- Submit Button -->
      <div>
        <button
          type="submit"
          disabled={loading || !email || !password}
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {#if loading}
            <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Signing in...
          {:else}
            Sign in to Console
          {/if}
        </button>
      </div>
    </form>

    <!-- Footer -->
    <div class="text-center">
      <p class="text-xs text-muted-foreground">
        This is a secure administrative area. All access is logged and monitored.
      </p>
      <div class="mt-4 flex items-center justify-center space-x-4 text-xs text-muted-foreground">
        <a href="/terms" class="hover:text-foreground transition-colors">Terms</a>
        <span>•</span>
        <a href="/privacy" class="hover:text-foreground transition-colors">Privacy</a>
        <span>•</span>
        <a href="/support" class="hover:text-foreground transition-colors">Support</a>
      </div>
    </div>
  </div>
</div>