<script lang="ts">
  import { fly, fade } from 'svelte/transition'
  import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-svelte'
  import type { ToastMessage } from '$types'
  import { removeToast } from '$stores/toast'

  export let toasts: ToastMessage[]

  function getIcon(type: ToastMessage['type']) {
    switch (type) {
      case 'success': return CheckCircle
      case 'error': return AlertCircle
      case 'warning': return AlertTriangle
      case 'info': return Info
      default: return Info
    }
  }

  function getStyles(type: ToastMessage['type']) {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200'
      case 'error': return 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200'
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200'
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200'
      default: return 'bg-gray-50 border-gray-200 text-gray-800 dark:bg-gray-900/20 dark:border-gray-800 dark:text-gray-200'
    }
  }
</script>

{#if toasts.length > 0}
  <div class="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
    {#each toasts as toast (toast.id)}
      <div
        transition:fly={{ x: 300, duration: 300 }}
        class="border rounded-lg p-4 shadow-lg backdrop-blur-sm {getStyles(toast.type)}"
      >
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svelte:component this={getIcon(toast.type)} class="w-5 h-5" />
          </div>
          <div class="ml-3 flex-1">
            <h4 class="text-sm font-medium">{toast.title}</h4>
            {#if toast.message}
              <p class="text-sm mt-1 opacity-90">{toast.message}</p>
            {/if}
            {#if toast.actions && toast.actions.length > 0}
              <div class="mt-3 flex space-x-2">
                {#each toast.actions as action}
                  <button
                    on:click={action.action}
                    class="text-xs font-medium px-2 py-1 rounded {
                      action.style === 'primary' 
                        ? 'bg-current text-white opacity-80 hover:opacity-100' 
                        : 'border border-current opacity-60 hover:opacity-80'
                    } transition-opacity"
                  >
                    {action.label}
                  </button>
                {/each}
              </div>
            {/if}
          </div>
          <button
            on:click={() => removeToast(toast.id)}
            class="flex-shrink-0 ml-4 opacity-50 hover:opacity-75 transition-opacity"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </div>
    {/each}
  </div>
{/if}