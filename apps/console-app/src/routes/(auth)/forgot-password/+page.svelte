<script lang="ts">
  import { enhance } from '$app/forms'
  import { page } from '$app/stores'
  import { Shield, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-svelte'
  import { onMount } from 'svelte'

  let loading = false
  let email = ''

  $: errorMessage = $page.form?.error
  $: successMessage = $page.form?.success

  onMount(() => {
    // Focus email input on mount
    const emailInput = document.getElementById('email')
    if (emailInput) emailInput.focus()
  })
</script>

<svelte:head>
  <title>Reset Password - Console</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-background px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full space-y-8">
    <!-- Header -->
    <div class="text-center">
      <div class="mx-auto w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
        <Shield class="w-6 h-6 text-primary-foreground" />
      </div>
      <h2 class="text-3xl font-bold text-foreground">Reset Password</h2>
      <p class="mt-2 text-sm text-muted-foreground">
        Enter your email address and we'll send you a secure reset link
      </p>
    </div>

    <!-- Back to Login -->
    <div class="text-center">
      <a 
        href="/login" 
        class="inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
      >
        <ArrowLeft class="w-4 h-4 mr-1" />
        Back to login
      </a>
    </div>

    <!-- Error/Success Messages -->
    {#if errorMessage}
      <div class="rounded-md bg-destructive/15 p-4">
        <div class="flex">
          <AlertCircle class="h-5 w-5 text-destructive" />
          <div class="ml-3">
            <h3 class="text-sm font-medium text-destructive">Error</h3>
            <div class="mt-2 text-sm text-destructive">
              {errorMessage}
            </div>
          </div>
        </div>
      </div>
    {/if}

    {#if successMessage}
      <div class="rounded-md bg-green-50 p-4 dark:bg-green-900/20">
        <div class="flex">
          <CheckCircle class="h-5 w-5 text-green-600 dark:text-green-400" />
          <div class="ml-3">
            <h3 class="text-sm font-medium text-green-800 dark:text-green-200">Success</h3>
            <div class="mt-2 text-sm text-green-700 dark:text-green-300">
              {successMessage}
            </div>
          </div>
        </div>
      </div>
    {/if}

    <!-- Reset Form -->
    <form 
      method="POST" 
      action="?/reset"
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
          <p class="mt-2 text-xs text-muted-foreground">
            Enter the email address associated with your console account
          </p>
        </div>
      </div>

      <!-- Submit Button -->
      <div>
        <button
          type="submit"
          disabled={loading || !email}
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {#if loading}
            <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Sending reset link...
          {:else}
            Send Reset Link
          {/if}
        </button>
      </div>
    </form>

    <!-- Security Notice -->
    <div class="text-center">
      <p class="text-xs text-muted-foreground">
        This is a secure administrative area. All password reset requests are logged and monitored.
      </p>
    </div>

    <!-- Footer Links -->
    <div class="text-center space-y-2">
      <div class="text-sm">
        <a
          href="/login"
          class="font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Remember your password? Sign in
        </a>
      </div>
      <div class="flex justify-center space-x-4 text-xs text-muted-foreground">
        <a href="#" class="hover:text-foreground transition-colors">Terms</a>
        <span>•</span>
        <a href="#" class="hover:text-foreground transition-colors">Privacy</a>
        <span>•</span>
        <a href="#" class="hover:text-foreground transition-colors">Support</a>
      </div>
    </div>
  </div>
</div>
