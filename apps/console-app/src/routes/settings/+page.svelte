<script lang="ts">
  import { onMount } from 'svelte'
  import { Settings, Save, Shield, Database, Mail, Palette, Globe } from 'lucide-svelte'

  export let data

  let settings = {
    system: {
      app_name: 'ProcureServe Console',
      maintenance_mode: false,
      debug_mode: false
    },
    security: {
      password_min_length: 8,
      session_timeout: 30,
      max_login_attempts: 5
    },
    email: {
      smtp_host: '',
      smtp_port: 587,
      smtp_username: '',
      use_tls: true
    },
    ui: {
      theme: 'light',
      timezone: 'UTC',
      date_format: 'MM/DD/YYYY'
    }
  }

  let loading = false
  let saved = false

  onMount(async () => {
    // Load current settings
  })

  async function saveSettings() {
    loading = true
    try {
      // Save settings to backend
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      saved = true
      setTimeout(() => saved = false, 3000)
    } catch (error) {
      console.error('Failed to save settings:', error)
    } finally {
      loading = false
    }
  }
</script>

<svelte:head>
  <title>Settings | Console</title>
</svelte:head>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-3xl font-bold">Settings</h1>
      <p class="text-muted-foreground">Configure system settings and preferences</p>
    </div>
    <div class="flex items-center space-x-3">
      <button
        on:click={saveSettings}
        disabled={loading}
        class="flex items-center px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 rounded-md transition-colors"
      >
        <Save class="w-4 h-4 mr-2" />
        {loading ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
      </button>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Navigation -->
    <div class="space-y-2">
      <h2 class="text-lg font-semibold mb-4">Categories</h2>
      <nav class="space-y-1">
        <a href="#system" class="flex items-center px-3 py-2 text-sm font-medium bg-accent text-accent-foreground rounded-md">
          <Settings class="w-4 h-4 mr-2" />
          System
        </a>
        <a href="#security" class="flex items-center px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
          <Shield class="w-4 h-4 mr-2" />
          Security
        </a>
        <a href="#email" class="flex items-center px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
          <Mail class="w-4 h-4 mr-2" />
          Email
        </a>
        <a href="#ui" class="flex items-center px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
          <Palette class="w-4 h-4 mr-2" />
          Interface
        </a>
      </nav>
    </div>

    <!-- Settings Content -->
    <div class="lg:col-span-2 space-y-6">
      <!-- System Settings -->
      <div id="system" class="bg-card border rounded-lg p-6">
        <h3 class="text-lg font-semibold mb-4 flex items-center">
          <Settings class="w-5 h-5 mr-2" />
          System Settings
        </h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">Application Name</label>
            <input
              type="text"
              bind:value={settings.system.app_name}
              class="w-full px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div class="flex items-center justify-between">
            <div>
              <label class="block text-sm font-medium">Maintenance Mode</label>
              <p class="text-xs text-muted-foreground">Temporarily disable access for maintenance</p>
            </div>
            <input
              type="checkbox"
              bind:checked={settings.system.maintenance_mode}
              class="w-4 h-4"
            />
          </div>
          <div class="flex items-center justify-between">
            <div>
              <label class="block text-sm font-medium">Debug Mode</label>
              <p class="text-xs text-muted-foreground">Enable detailed error logging</p>
            </div>
            <input
              type="checkbox"
              bind:checked={settings.system.debug_mode}
              class="w-4 h-4"
            />
          </div>
        </div>
      </div>

      <!-- Security Settings -->
      <div id="security" class="bg-card border rounded-lg p-6">
        <h3 class="text-lg font-semibold mb-4 flex items-center">
          <Shield class="w-5 h-5 mr-2" />
          Security Settings
        </h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">Minimum Password Length</label>
            <input
              type="number"
              bind:value={settings.security.password_min_length}
              min="6"
              max="50"
              class="w-full px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Session Timeout (minutes)</label>
            <input
              type="number"
              bind:value={settings.security.session_timeout}
              min="5"
              max="480"
              class="w-full px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Max Login Attempts</label>
            <input
              type="number"
              bind:value={settings.security.max_login_attempts}
              min="3"
              max="10"
              class="w-full px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      </div>

      <!-- Email Settings -->
      <div id="email" class="bg-card border rounded-lg p-6">
        <h3 class="text-lg font-semibold mb-4 flex items-center">
          <Mail class="w-5 h-5 mr-2" />
          Email Settings
        </h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">SMTP Host</label>
            <input
              type="text"
              bind:value={settings.email.smtp_host}
              placeholder="smtp.example.com"
              class="w-full px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">SMTP Port</label>
            <input
              type="number"
              bind:value={settings.email.smtp_port}
              class="w-full px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">SMTP Username</label>
            <input
              type="text"
              bind:value={settings.email.smtp_username}
              class="w-full px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div class="flex items-center justify-between">
            <div>
              <label class="block text-sm font-medium">Use TLS</label>
              <p class="text-xs text-muted-foreground">Enable secure email transmission</p>
            </div>
            <input
              type="checkbox"
              bind:checked={settings.email.use_tls}
              class="w-4 h-4"
            />
          </div>
        </div>
      </div>

      <!-- UI Settings -->
      <div id="ui" class="bg-card border rounded-lg p-6">
        <h3 class="text-lg font-semibold mb-4 flex items-center">
          <Palette class="w-5 h-5 mr-2" />
          Interface Settings
        </h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">Theme</label>
            <select
              bind:value={settings.ui.theme}
              class="w-full px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Timezone</label>
            <select
              bind:value={settings.ui.timezone}
              class="w-full px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Date Format</label>
            <select
              bind:value={settings.ui.date_format}
              class="w-full px-3 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</div> 