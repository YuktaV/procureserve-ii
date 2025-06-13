<script lang="ts">
	interface SkeletonProps {
		class?: string;
		width?: string;
		height?: string;
		rounded?: boolean;
	}

	let { 
		class: className = '',
		width = 'w-full',
		height = 'h-4',
		rounded = false
	}: SkeletonProps = $props();
</script>

<div 
	class="animate-pulse bg-gray-200 {width} {height} {rounded ? 'rounded-full' : 'rounded'} {className}"
	aria-label="Loading content"
>
</div>
