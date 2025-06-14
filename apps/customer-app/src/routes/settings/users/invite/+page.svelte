<script lang="ts">
  import UserInviteForm from './UserInviteForm.svelte'
  import type { PageData, ActionData } from './$types'

  export let data: PageData
  export let form: ActionData
</script>

<svelte:head>
  <title>Invite User - ProcureServe</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <UserInviteForm businessUnits={data.businessUnits} {form} />
</div>
