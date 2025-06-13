<script lang="ts">
	import { modals } from '$lib/stores/modal-store';
	import Modal from './modal.svelte';
	import ModalDemoContent from '../demo/modal-demo-content.svelte';

	// Auto-update body scroll lock when modals are open
	$: if (typeof document !== 'undefined') {
		if ($modals.some(modal => modal.open)) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
	}
</script>

<!-- Render all active modals -->
{#each $modals as modal (modal.id)}
	{#if modal.open}
		<Modal
			id={modal.id}
			title={modal.title}
			description={modal.description}
			size={modal.size}
			closable={modal.closable}
			backdrop={modal.backdrop}
			open={modal.open}
		>
			{#if modal.component}
				<svelte:component this={modal.component} {...(modal.props || {})} />
			{:else if modal.id === 'demo-modal'}
				<ModalDemoContent />
			{:else}
				<slot {modal} />
			{/if}
		</Modal>
	{/if}
{/each}
