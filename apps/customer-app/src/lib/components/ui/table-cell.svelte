<script lang="ts">
	interface TableCellProps {
		class?: string;
		children?: any;
	}

	let { 
		class: className = '',
		children
	}: TableCellProps = $props();
</script>

<td class="p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] {className}">
	{@render children?.()}
</td>
