<script lang="ts">
	import Button from './button.svelte';

	interface EmptyStateProps {
		title: string;
		description?: string;
		icon?: any;
		actionText?: string;
		onAction?: () => void;
		class?: string;
	}

	let { 
		title,
		description,
		icon,
		actionText,
		onAction,
		class: className = ''
	}: EmptyStateProps = $props();
</script>

<div class="text-center py-12 px-4 {className}">
	{#if icon}
		<div class="mx-auto w-12 h-12 text-gray-400 mb-4">
			<svelte:component this={icon} class="w-full h-full" />
		</div>
	{/if}
	
	<h3 class="text-lg font-medium text-gray-900 mb-2">
		{title}
	</h3>
	
	{#if description}
		<p class="text-gray-500 mb-6 max-w-sm mx-auto">
			{description}
		</p>
	{/if}
	
	{#if actionText && onAction}
		<Button onclick={onAction}>
			{actionText}
		</Button>
	{/if}
</div>
