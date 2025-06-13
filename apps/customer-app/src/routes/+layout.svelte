<script>
	import '../app.css'
	import { invalidateAll } from '$app/navigation'
	import { onMount } from 'svelte'
	import ToastContainer from '$lib/components/ui/toast-container.svelte'
	import ModalContainer from '$lib/components/ui/modal-container.svelte'

	export let data

	$: ({ supabase, session, user } = data)

	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((event, session) => {
			if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
				invalidateAll()
			}
		})

		return () => subscription.unsubscribe()
	})
</script>

<!-- Main layout for the customer application -->
<main class="min-h-screen bg-background">
	<slot />
</main>

<!-- Global Toast Container -->
<ToastContainer position="top-right" />

<!-- Global Modal Container -->
<ModalContainer />
