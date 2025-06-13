<script lang="ts">
	interface TableBodyProps {
		class?: string;
		children?: any;
	}

	let { 
		class: className = '',
		children
	}: TableBodyProps = $props();
</script>

<tbody class="[&_tr:last-child]:border-0 {className}">
	{@render children?.()}
</tbody>
