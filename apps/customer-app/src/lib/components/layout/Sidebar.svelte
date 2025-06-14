<script lang="ts">
  import { onMount } from 'svelte'
  import { writable } from 'svelte/store'
  
  export let isOpen = false
  export let variant: 'default' | 'floating' | 'inset' = 'default'
  export let side: 'left' | 'right' = 'left'
  export let collapsible = true
  
  // Sidebar state management
  const sidebarState = writable(isOpen)
  let isMobile = false
  let mounted = false
  
  onMount(() => {
    mounted = true
    
    // Check if mobile
    const checkMobile = () => {
      isMobile = window.innerWidth < 768
      if (isMobile) {
        sidebarState.set(false)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    // Keyboard shortcut (Cmd/Ctrl + B)
    const handleKeyboard = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault()
        toggle()
      }
    }
    
    document.addEventListener('keydown', handleKeyboard)
    
    return () => {
      window.removeEventListener('resize', checkMobile)
      document.removeEventListener('keydown', handleKeyboard)
    }
  })
  
  function toggle() {
    sidebarState.update(state => !state)
  }
  
  function close() {
    sidebarState.set(false)
  }
  
  // Subscribe to state changes
  $: if (mounted) {
    isOpen = $sidebarState
  }
  
  // CSS variables for width
  $: sidebarWidth = '16rem'
  $: sidebarWidthMobile = '18rem'
  
  // Dynamic classes
  $: sidebarClasses = [
    'fixed inset-y-0 z-50 flex flex-col transition-all duration-300 ease-in-out',
    'bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800',
    'shadow-lg lg:shadow-none',
    side === 'left' ? 'left-0' : 'right-0',
    variant === 'floating' ? 'rounded-r-lg m-2 h-[calc(100vh-1rem)]' : '',
    variant === 'inset' ? 'lg:relative lg:inset-0 lg:shadow-none' : '',
    isOpen ? 'translate-x-0' : side === 'left' ? '-translate-x-full lg:translate-x-0' : 'translate-x-full lg:translate-x-0',
    isOpen ? `w-[${sidebarWidthMobile}] lg:w-[${sidebarWidth}]` : collapsible ? 'lg:w-16' : `lg:w-[${sidebarWidth}]`
  ].filter(Boolean).join(' ')
  
  // Overlay classes for mobile
  $: overlayClasses = [
    'fixed inset-0 z-40 bg-black/50 transition-opacity duration-300',
    'lg:hidden',
    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
  ].join(' ')
</script>

<!-- Mobile overlay -->
{#if isMobile}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class={overlayClasses} on:click={close}></div>
{/if}

<!-- Sidebar -->
<div class={sidebarClasses} style="--sidebar-width: {sidebarWidth}; --sidebar-width-mobile: {sidebarWidthMobile}">
  <slot {isOpen} {toggle} {close} {isMobile} />
</div>

<style>
  :global([data-sidebar="true"]) {
    --sidebar-width: 16rem;
    --sidebar-width-mobile: 18rem;
  }
</style>
