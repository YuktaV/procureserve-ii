<script lang="ts">
	interface TableRowProps {
		class?: string;
		children?: any;
	}

	let { 
		class: className = '',
		children
	}: TableRowProps = $props();
</script>

<tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted {className}">
	{@render children?.()}
</tr>
