<script lang="ts">
  import type { ProcessType } from 'shared-types'

  export let permissions: ProcessType[]
  export let editable: boolean = false
  export let onChange: ((newPermissions: ProcessType[]) => void) | undefined = undefined

  const availableProcesses: { key: ProcessType; label: string; color: string }[] = [
    { key: 'recruitment', label: 'Recruitment', color: 'blue' },
    { key: 'bench_sales', label: 'Bench Sales', color: 'purple' }
  ]

  function togglePermission(process: ProcessType) {
    if (!editable || !onChange) return
    
    const newPermissions = permissions.includes(process)
      ? permissions.filter(p => p !== process)
      : [...permissions, process]
    
    onChange(newPermissions)
  }
</script>

<div class="flex flex-wrap gap-2">
  {#each availableProcesses as process}
    {@const hasPermission = permissions.includes(process.key)}
    
    <button
      type="button"
      class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-colors
        {hasPermission ? `bg-${process.color}-100 text-${process.color}-800 border-${process.color}-200` : 'bg-gray-100 text-gray-500 border-gray-200'}
        {editable ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}
        border"
      disabled={!editable}
      on:click={() => togglePermission(process.key)}
    >
      {#if hasPermission}
        <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
      {:else}
        <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
        </svg>
      {/if}
      {process.label}
    </button>
  {/each}

  {#if permissions.length === 0}
    <span class="text-sm text-gray-400 italic">No process access</span>
  {/if}
</div>
