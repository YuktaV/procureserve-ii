<script lang="ts">
  export let isActive: boolean
  export let lastLoginAt: string | null = null
  export let isPending: boolean = false

  $: statusText = isPending ? 'Pending' : isActive ? 'Active' : 'Inactive'
  $: statusColor = isPending ? 'yellow' : isActive ? 'green' : 'red'
  
  function formatLastLogin(dateStr: string | null): string {
    if (!dateStr) return 'Never'
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return date.toLocaleDateString()
  }
</script>

<div class="flex items-center gap-2">
  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
    {statusColor === 'green' ? 'bg-green-100 text-green-800' : ''}
    {statusColor === 'yellow' ? 'bg-yellow-100 text-yellow-800' : ''}
    {statusColor === 'red' ? 'bg-red-100 text-red-800' : ''}">
    <span class="w-1.5 h-1.5 rounded-full mr-1.5
      {statusColor === 'green' ? 'bg-green-400' : ''}
      {statusColor === 'yellow' ? 'bg-yellow-400' : ''}
      {statusColor === 'red' ? 'bg-red-400' : ''}"></span>
    {statusText}
  </span>
  
  {#if !isPending && lastLoginAt}
    <span class="text-xs text-gray-500">
      Last: {formatLastLogin(lastLoginAt)}
    </span>
  {/if}
</div>
