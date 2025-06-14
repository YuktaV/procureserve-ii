<script lang="ts">
  import { page } from '$app/stores'
  import UserDirectory from './UserDirectory.svelte'
  import type { PageData } from './$types'

  export let data: PageData

  $: pageTitle = 'User Management'
</script>

<svelte:head>
  <title>{pageTitle} - ProcureServe</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <UserDirectory 
    users={data.users}
    invitations={data.invitations}
    businessUnits={data.businessUnits}
    canEdit={data.canEdit}
  />
</div>
