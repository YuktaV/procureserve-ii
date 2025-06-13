<script lang="ts">
	import { removeToast, type Toast } from '$lib/stores/toast-store';
	import { fade, fly } from 'svelte/transition';

	interface ToastProps {
		toast: Toast;
	}

	let { toast }: ToastProps = $props();

	// Icon mapping for different toast types
	const icons = {
		success: '✓',
		error: '✕',
		warning: '⚠',
		info: 'ℹ'
	};

	// Color classes for different toast types
	const typeClasses = {
		success: 'bg-green-50 border-green-200 text-green-900',
		error: 'bg-red-50 border-red-200 text-red-900', 
		warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
		info: 'bg-blue-50 border-blue-200 text-blue-900'
	};

	const iconClasses = {
		success: 'bg-green-100 text-green-600',
		error: 'bg-red-100 text-red-600',
		warning: 'bg-yellow-100 text-yellow-600', 
		info: 'bg-blue-100 text-blue-600'
	};

	const handleDismiss = () => {
		removeToast(toast.id);
	};
</script>

<div
	class="flex items-start gap-3 p-4 border rounded-lg shadow-sm max-w-sm {typeClasses[toast.type]}"
	transition:fly={{ x: 300, duration: 300 }}
	role="alert"
	aria-live="polite"
>
	<!-- Icon -->
	<div class="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold {iconClasses[toast.type]}">
		{icons[toast.type]}
	</div>
	
	<!-- Content -->
	<div class="flex-1 min-w-0">
		<p class="text-sm font-medium">{toast.title}</p>
		{#if toast.description}
			<p class="text-sm opacity-80 mt-1">{toast.description}</p>
		{/if}
	</div>
	
	<!-- Dismiss button -->
	{#if toast.dismissible}
		<button
			onclick={handleDismiss}
			class="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 transition-colors"
			aria-label="Dismiss notification"
		>
			<span class="sr-only">Dismiss</span>
			<svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
				<path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
			</svg>
		</button>
	{/if}
</div>
