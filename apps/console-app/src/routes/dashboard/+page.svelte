<script lang="ts">
  import type { PageData } from './$types'
  import { 
    FileText, 
    Building2, 
    Users, 
    Shield, 
    TrendingUp, 
    Activity,
    Plus,
    BarChart3
  } from 'lucide-svelte'

  export let data: PageData

  const { consoleUser } = data

  // Sample dashboard stats - in real app, this would come from the server
  const stats = [
    {
      label: 'Total Enums',
      value: '24',
      change: '+2 this week',
      trend: 'up',
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      label: 'Active Companies',
      value: consoleUser.role === 'super_admin' ? '12' : '1',
      change: '+1 this month',
      trend: 'up',
      icon: Building2,
      color: 'text-green-600'
    },
    {
      label: 'Console Users',
      value: '8',
      change: 'No change',
      trend: 'stable',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      label: 'Security Events',
      value: '156',
      change: '+12 today',
      trend: 'up',
      icon: Shield,
      color: 'text-orange-600'
    }
  ]

  const recentActivity = [
    {
      type: 'enum_updated',
      message: 'Work Authorization Types enum updated',
      user: 'admin@acme-staffing.com',
      time: '2 minutes ago',
      icon: FileText
    },
    {
      type: 'user_login',
      message: 'Console login from new IP address',
      user: 'manager@tech-solutions.com',
      time: '15 minutes ago',
      icon: Shield
    },
    {
      type: 'enum_created',
      message: 'New Priority Levels enum created',
      user: 'admin@acme-staffing.com',
      time: '1 hour ago',
      icon: Plus
    },
    {
      type: 'company_settings',
      message: 'Company settings updated',
      user: 'admin@global-hr.com',
      time: '3 hours ago',
      icon: Building2
    }
  ]

  const quickActions = [
    {
      title: 'Create New Enum',
      description: 'Add a new configurable enum category',
      href: '/enums/create',
      icon: Plus,
      color: 'bg-blue-500'
    },
    {
      title: 'Manage Companies',
      description: 'View and manage company settings',
      href: '/companies',
      icon: Building2,
      color: 'bg-green-500',
      show: consoleUser.role === 'super_admin'
    },
    {
      title: 'Invite User',
      description: 'Invite a new console user',
      href: '/users/invite',
      icon: Users,
      color: 'bg-purple-500'
    },
    {
      title: 'View Audit Logs',
      description: 'Review security and activity logs',
      href: '/audit-logs',
      icon: Shield,
      color: 'bg-orange-500'
    }
  ].filter(action => action.show !== false)
</script>

<svelte:head>
  <title>Dashboard - Console</title>
</svelte:head>

<div class="space-y-6">
  <!-- Welcome Header -->
  <div class="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-6 text-primary-foreground">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Welcome back!</h1>
        <p class="text-primary-foreground/80 mt-1">
          {consoleUser.email} • {consoleUser.role.replace('_', ' ').toUpperCase()}
        </p>
      </div>
      <Activity class="w-12 h-12 text-primary-foreground/60" />
    </div>
  </div>

  <!-- Stats Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {#each stats as stat}
      <div class="bg-card border rounded-lg p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-muted-foreground">{stat.label}</p>
            <p class="text-2xl font-bold mt-2">{stat.value}</p>
            <p class="text-xs text-muted-foreground mt-1 flex items-center">
              {#if stat.trend === 'up'}
                <TrendingUp class="w-3 h-3 mr-1 text-green-500" />
              {/if}
              {stat.change}
            </p>
          </div>
          <div class="p-3 rounded-full bg-muted">
            <svelte:component this={stat.icon} class="w-6 h-6 {stat.color}" />
          </div>
        </div>
      </div>
    {/each}
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Quick Actions -->
    <div class="lg:col-span-1">
      <div class="bg-card border rounded-lg p-6">
        <h3 class="text-lg font-semibold mb-4">Quick Actions</h3>
        <div class="space-y-3">
          {#each quickActions as action}
            <a
              href={action.href}
              class="flex items-center p-3 rounded-lg border hover:bg-accent transition-colors group"
            >
              <div class="p-2 rounded-md {action.color} text-white mr-3">
                <svelte:component this={action.icon} class="w-4 h-4" />
              </div>
              <div class="flex-1">
                <p class="font-medium text-sm group-hover:text-foreground">
                  {action.title}
                </p>
                <p class="text-xs text-muted-foreground">
                  {action.description}
                </p>
              </div>
            </a>
          {/each}
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="lg:col-span-2">
      <div class="bg-card border rounded-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">Recent Activity</h3>
          <a 
            href="/audit-logs" 
            class="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            View all →
          </a>
        </div>
        
        <div class="space-y-4">
          {#each recentActivity as activity}
            <div class="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div class="p-2 rounded-full bg-muted flex-shrink-0">
                <svelte:component this={activity.icon} class="w-4 h-4" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium">{activity.message}</p>
                <div class="flex items-center space-x-2 mt-1">
                  <p class="text-xs text-muted-foreground">by {activity.user}</p>
                  <span class="text-xs text-muted-foreground">•</span>
                  <p class="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>

  <!-- System Status -->
  <div class="bg-card border rounded-lg p-6">
    <h3 class="text-lg font-semibold mb-4">System Status</h3>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="flex items-center space-x-3">
        <div class="w-3 h-3 bg-green-500 rounded-full"></div>
        <div>
          <p class="text-sm font-medium">Database</p>
          <p class="text-xs text-muted-foreground">Operational</p>
        </div>
      </div>
      <div class="flex items-center space-x-3">
        <div class="w-3 h-3 bg-green-500 rounded-full"></div>
        <div>
          <p class="text-sm font-medium">Authentication</p>
          <p class="text-xs text-muted-foreground">Operational</p>
        </div>
      </div>
      <div class="flex items-center space-x-3">
        <div class="w-3 h-3 bg-green-500 rounded-full"></div>
        <div>
          <p class="text-sm font-medium">Real-time Updates</p>
          <p class="text-xs text-muted-foreground">Operational</p>
        </div>
      </div>
    </div>
  </div>
</div>