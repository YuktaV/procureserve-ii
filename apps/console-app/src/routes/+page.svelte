<script>
  import { goto } from '$app/navigation'
  import { onMount } from 'svelte'
  import { Shield, ArrowRight, CheckCircle } from 'lucide-svelte'

  onMount(() => {
    // Auto-redirect to dashboard if already authenticated
    // This will be handled by the layout and hooks
  })

  const features = [
    'Secure role-based access control',
    'Real-time enum configuration',
    'Comprehensive audit logging',
    'Multi-company management',
    'Advanced permission system',
    'Bulk import/export tools'
  ]
</script>

<svelte:head>
  <title>ProcureServe Console</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center px-4">
  <div class="max-w-4xl w-full">
    <!-- Header -->
    <div class="text-center mb-12">
      <div class="mx-auto w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6">
        <Shield class="w-8 h-8 text-primary-foreground" />
      </div>
      <h1 class="text-4xl md:text-5xl font-bold text-foreground mb-4">
        ProcureServe Console
      </h1>
      <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
        Administrative dashboard for managing configurable enums, companies, users, and system settings
      </p>
    </div>

    <!-- Features Grid -->
    <div class="grid md:grid-cols-2 gap-6 mb-12">
      {#each features as feature}
        <div class="flex items-center space-x-3 text-foreground">
          <CheckCircle class="w-5 h-5 text-green-500 flex-shrink-0" />
          <span class="text-lg">{feature}</span>
        </div>
      {/each}
    </div>

    <!-- CTA -->
    <div class="text-center">
      <a
        href="/login"
        class="inline-flex items-center px-8 py-4 text-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors shadow-lg hover:shadow-xl"
      >
        Access Console
        <ArrowRight class="w-5 h-5 ml-2" />
      </a>
      <p class="text-sm text-muted-foreground mt-4">
        Secure administrative access required
      </p>
    </div>

    <!-- Footer -->
    <div class="text-center mt-12 pt-8 border-t border-border">
      <p class="text-sm text-muted-foreground">
        © 2024 ProcureServe. All rights reserved. • 
        <a href="/terms" class="hover:text-foreground transition-colors">Terms</a> • 
        <a href="/privacy" class="hover:text-foreground transition-colors">Privacy</a>
      </p>
    </div>
  </div>
</div>