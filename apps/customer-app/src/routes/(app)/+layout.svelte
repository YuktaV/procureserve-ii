<script lang="ts">
  import AppLayout from '$lib/components/layout/AppLayout.svelte'
  import type { LayoutData } from './$types'
  
  export let data: LayoutData
</script>

<AppLayout user={data.user} company={data.company}>
  <slot />
</AppLayout>
