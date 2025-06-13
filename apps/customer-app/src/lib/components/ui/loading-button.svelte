<script lang="ts">
	import Button from './button.svelte';
	import Spinner from './spinner.svelte';

	interface LoadingButtonProps {
		loading?: boolean;
		disabled?: boolean;
		variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
		size?: 'default' | 'sm' | 'lg' | 'icon';
		class?: string;
		type?: 'button' | 'submit' | 'reset';
		children?: any;
		onclick?: () => void;
	}

	let { 
		loading = false,
		disabled = false,
		variant = 'default',
		size = 'default',
		class: className = '',
		type = 'button',
		children,
		onclick
	}: LoadingButtonProps = $props();

	const isDisabled = loading || disabled;
</script>

<Button
	{variant}
	{size}
	{type}
	disabled={isDisabled}
	class="relative {className}"
	{onclick}
>
	{#if loading}
		<div class="absolute inset-0 flex items-center justify-center">
			<Spinner size="sm" class="text-current" />
		</div>
		<div class="opacity-0">
			{@render children?.()}
		</div>
	{:else}
		{@render children?.()}
	{/if}
</Button>
