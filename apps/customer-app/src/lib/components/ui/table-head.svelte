<script lang="ts">
	interface TableHeadProps {
		class?: string;
		children?: any;
	}

	let { 
		class: className = '',
		children
	}: TableHeadProps = $props();
</script>

<th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] {className}">
	{@render children?.()}
</th>
