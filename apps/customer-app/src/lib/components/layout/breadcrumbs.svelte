<script lang="ts">
	import { ChevronRight } from 'lucide-svelte';

	interface BreadcrumbItem {
		label: string;
		href?: string;
		current?: boolean;
	}

	interface BreadcrumbsProps {
		items: BreadcrumbItem[];
		class?: string;
	}

	let { 
		items,
		class: className = ''
	}: BreadcrumbsProps = $props();
</script>

<nav aria-label="Breadcrumb" class="flex {className}">
	<ol class="inline-flex items-center space-x-1 md:space-x-3">
		{#each items as item, index}
			<li class="inline-flex items-center">
				{#if index > 0}
					<ChevronRight class="w-4 h-4 text-gray-400 mx-1" />
				{/if}
				
				{#if item.href && !item.current}
					<a 
						href={item.href}
						class="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
					>
						{item.label}
					</a>
				{:else}
					<span 
						class="text-sm font-medium {item.current ? 'text-gray-900' : 'text-gray-500'}"
						{...(item.current ? { 'aria-current': 'page' } : {})}
					>
						{item.label}
					</span>
				{/if}
			</li>
		{/each}
	</ol>
</nav>
