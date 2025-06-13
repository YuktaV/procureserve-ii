<script lang="ts">
	import { toasts } from '$lib/stores/toast-store';
	import Toast from './toast.svelte';
	import { flip } from 'svelte/animate';

	interface ToastContainerProps {
		position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
		class?: string;
	}

	let { 
		position = 'top-right',
		class: className = ''
	}: ToastContainerProps = $props();

	// Position classes mapping
	const positionClasses = {
		'top-right': 'top-4 right-4',
		'top-left': 'top-4 left-4', 
		'bottom-right': 'bottom-4 right-4',
		'bottom-left': 'bottom-4 left-4',
		'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
		'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
	};
</script>

<!-- Toast Container -->
{#if $toasts.length > 0}
	<div 
		class="fixed z-50 flex flex-col gap-2 {positionClasses[position]} {className}"
		aria-live="polite"
		aria-label="Notifications"
	>
		{#each $toasts as toast (toast.id)}
			<div animate:flip={{ duration: 300 }}>
				<Toast {toast} />
			</div>
		{/each}
	</div>
{/if}
