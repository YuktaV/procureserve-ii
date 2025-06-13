<script lang="ts">
	import { closeModal } from '$lib/stores/modal-store';
	import { fade, scale } from 'svelte/transition';
	import { X } from 'lucide-svelte';

	interface ModalProps {
		id: string;
		title?: string;
		description?: string;
		size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
		closable?: boolean;
		backdrop?: boolean;
		open?: boolean;
		class?: string;
		children?: any;
	}

	let { 
		id,
		title,
		description,
		size = 'md',
		closable = true,
		backdrop = true,
		open = true,
		class: className = '',
		children
	}: ModalProps = $props();

	// Size classes mapping
	const sizeClasses = {
		sm: 'max-w-sm',
		md: 'max-w-md',
		lg: 'max-w-lg',
		xl: 'max-w-2xl',
		full: 'max-w-full mx-4'
	};

	const handleClose = () => {
		if (closable) {
			closeModal(id);
		}
	};

	const handleBackdropClick = (event: MouseEvent) => {
		if (backdrop && closable && event.target === event.currentTarget) {
			handleClose();
		}
	};

	const handleKeydown = (event: KeyboardEvent) => {
		if (event.key === 'Escape' && closable) {
			handleClose();
		}
	};
</script>

{#if open}
	<!-- Backdrop -->
	<div
		class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
		transition:fade={{ duration: 200 }}
		onclick={handleBackdropClick}
		onkeydown={handleKeydown}
		role="dialog"
		aria-modal="true"
		aria-labelledby={title ? `${id}-title` : undefined}
		aria-describedby={description ? `${id}-description` : undefined}
		tabindex="-1"
	>
		<!-- Modal Content -->
		<div
			class="bg-white rounded-lg shadow-lg w-full {sizeClasses[size]} max-h-[90vh] overflow-hidden flex flex-col {className}"
			transition:scale={{ duration: 200, start: 0.95 }}
			onclick={(e) => e.stopPropagation()}
		>
			<!-- Header -->
			{#if title || closable}
				<div class="flex items-center justify-between p-6 border-b">
					<div>
						{#if title}
							<h2 id="{id}-title" class="text-lg font-semibold text-gray-900">{title}</h2>
						{/if}
						{#if description}
							<p id="{id}-description" class="text-sm text-gray-600 mt-1">{description}</p>
						{/if}
					</div>
					
					{#if closable}
						<button
							onclick={handleClose}
							class="p-2 hover:bg-gray-100 rounded-full transition-colors"
							aria-label="Close modal"
						>
							<X class="w-4 h-4" />
						</button>
					{/if}
				</div>
			{/if}

			<!-- Content -->
			<div class="flex-1 overflow-y-auto p-6">
				{@render children?.()}
			</div>
		</div>
	</div>
{/if}
