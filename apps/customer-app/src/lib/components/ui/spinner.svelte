<script lang="ts">
	interface SpinnerProps {
		size?: 'sm' | 'md' | 'lg';
		class?: string;
	}

	let { 
		size = 'md',
		class: className = ''
	}: SpinnerProps = $props();

	const sizeClasses = {
		sm: 'w-4 h-4',
		md: 'w-6 h-6', 
		lg: 'w-8 h-8'
	};
</script>

<div 
	class="inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite] {sizeClasses[size]} {className}"
	role="status"
	aria-label="Loading"
>
	<span class="sr-only">Loading...</span>
</div>
