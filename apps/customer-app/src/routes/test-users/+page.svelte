<script lang="ts">
  import { browser } from '$app/environment'
  import Button from '$lib/components/ui/button.svelte'
  import Card from '$lib/components/ui/card.svelte'
  import CardHeader from '$lib/components/ui/card-header.svelte'
  import CardTitle from '$lib/components/ui/card-title.svelte'
  import CardContent from '$lib/components/ui/card-content.svelte'
  import { LogOut, User, Shield, Users, Briefcase, XCircle } from 'lucide-svelte'
  
  export let data
  
  const testUsers = [
    {
      email: 'admin@acme-staffing.com',
      role: 'Admin',
      permissions: ['recruitment', 'bench_sales'],
      description: 'Full access to both processes',
      icon: Shield,
      color: 'bg-purple-500'
    },
    {
      email: 'manager@acme-staffing.com', 
      role: 'Manager',
      permissions: ['recruitment', 'bench_sales'],
      description: 'Full access to both processes',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      email: 'recruiter@acme-staffing.com',
      role: 'Recruiter', 
      permissions: ['recruitment'],
      description: 'Recruitment process only',
      icon: User,
      color: 'bg-green-500'
    },
    {
      email: 'bench@acme-staffing.com',
      role: 'Bench Sales',
      permissions: ['bench_sales'], 
      description: 'Bench sales process only',
      icon: Briefcase,
      color: 'bg-orange-500'
    },
    {
      email: 'noprocess@acme-staffing.com',
      role: 'No Access',
      permissions: [],
      description: 'No process permissions (access denied)',
      icon: XCircle,
      color: 'bg-red-500'
    }
  ]
  
  let loading: string | null = null
  
  async function loginAs(email: string) {
    if (!browser) return

    loading = email

    try {
      const formData = new FormData()
      formData.set('email', email)
      formData.set('password', 'password123')
      formData.set('userType', 'business')

      const response = await fetch('/login?/login', {
        method: 'POST',
        body: formData
      })

      if (response.redirected) {
        // Follow the redirect from the login action
        window.location.href = response.url
      } else if (response.ok) {
        // Fallback - reload to trigger auth flow
        window.location.reload()
      } else {
        console.error('Login failed')
        loading = null
      }
    } catch (error) {
      console.error('Login error:', error)
      loading = null
    }
  }
  
  async function signOut() {
    if (!browser) return
    
    loading = 'signout'
    
    try {
      const response = await fetch('/api/signout', {
        method: 'POST'
      })
      
      if (response.ok) {
        window.location.href = '/login'
      }
    } catch (error) {
      console.error('Signout error:', error)
      loading = null
    }
  }
</script>

<svelte:head>
  <title>Test Users - PSII Authentication</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 py-8">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900">PSII Authentication Testing</h1>
      <p class="mt-2 text-gray-600">Quick login interface for testing different user permissions</p>
      
      {#if data.user}
        <div class="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg inline-block">
          <div class="flex items-center gap-2 text-green-800">
            <User class="w-5 h-5" />
            <span class="font-medium">Currently logged in as: {data.user.email}</span>
            <Button 
              size="sm" 
              variant="outline" 
              on:click={signOut}
              disabled={loading === 'signout'}
              class="ml-4"
            >
              {#if loading === 'signout'}
                Signing out...
              {:else}
                <LogOut class="w-4 h-4 mr-1" />
                Sign Out
              {/if}
            </Button>
          </div>
        </div>
      {/if}
    </div>
    
    <!-- Test Users Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {#each testUsers as user}
        <Card class="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle class="flex items-center gap-3">
              <div class="w-10 h-10 {user.color} rounded-full flex items-center justify-center">
                <svelte:component this={user.icon} class="w-5 h-5 text-white" />
              </div>
              <div>
                <div class="text-lg font-semibold">{user.role}</div>
                <div class="text-sm text-gray-500 font-normal">{user.email}</div>
              </div>
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <div class="space-y-3">
              <p class="text-sm text-gray-600">{user.description}</p>
              
              <div class="flex flex-wrap gap-1">
                {#each user.permissions as permission}
                  <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {permission}
                  </span>
                {/each}
                {#if user.permissions.length === 0}
                  <span class="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                    No permissions
                  </span>
                {/if}
              </div>
              
              <Button 
                class="w-full mt-4" 
                on:click={() => loginAs(user.email)}
                disabled={loading !== null}
                variant={data.user?.email === user.email ? "outline" : "default"}
              >
                {#if loading === user.email}
                  Logging in...
                {:else if data.user?.email === user.email}
                  Currently logged in
                {:else}
                  Login as {user.role}
                {/if}
              </Button>
            </div>
          </CardContent>
        </Card>
      {/each}
    </div>
    
    <!-- Expected Behaviors -->
    <Card>
      <CardHeader>
        <CardTitle>Expected Behaviors</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 class="font-semibold text-green-700 mb-2">Multi-Process Users (Admin, Manager)</h4>
            <ul class="space-y-1 text-gray-600">
              <li>• Should redirect to <code>/select-process</code></li>
              <li>• Can choose between recruitment or bench sales</li>
              <li>• Access to both process dashboards</li>
            </ul>
          </div>
          
          <div>
            <h4 class="font-semibold text-blue-700 mb-2">Single-Process Users (Recruiter, Bench)</h4>
            <ul class="space-y-1 text-gray-600">
              <li>• Direct redirect to specific dashboard</li>
              <li>• Recruiter → <code>/recruitment/dashboard</code></li>
              <li>• Bench → <code>/bench-sales/dashboard</code></li>
            </ul>
          </div>
          
          <div>
            <h4 class="font-semibold text-red-700 mb-2">No Access User</h4>
            <ul class="space-y-1 text-gray-600">
              <li>• Should redirect to <code>/access-denied</code></li>
              <li>• Cannot access any process dashboards</li>
              <li>• Appropriate error message displayed</li>
            </ul>
          </div>
          
          <div>
            <h4 class="font-semibold text-purple-700 mb-2">Process Protection</h4>
            <ul class="space-y-1 text-gray-600">
              <li>• Recruiter cannot access <code>/bench-sales/*</code></li>
              <li>• Bench user cannot access <code>/recruitment/*</code></li>
              <li>• Proper permission validation on all routes</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
    
    <!-- Debug Info -->
    {#if data.user}
      <Card class="mt-6">
        <CardHeader>
          <CardTitle>Debug Information</CardTitle>
        </CardHeader>
        <CardContent>
          <pre class="bg-gray-100 p-4 rounded text-xs overflow-auto">{JSON.stringify(data, null, 2)}</pre>
        </CardContent>
      </Card>
    {/if}
  </div>
</div>
