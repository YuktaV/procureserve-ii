<script lang="ts">
	interface TableProps {
		class?: string;
		children?: any;
	}

	let { 
		class: className = '',
		children
	}: TableProps = $props();
</script>

<div class="relative overflow-auto">
	<table class="w-full caption-bottom text-sm border-collapse {className}">
		{@render children?.()}
	</table>
</div>
