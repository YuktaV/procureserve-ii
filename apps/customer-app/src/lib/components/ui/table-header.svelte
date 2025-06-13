<script lang="ts">
	interface TableHeaderProps {
		class?: string;
		children?: any;
	}

	let { 
		class: className = '',
		children
	}: TableHeaderProps = $props();
</script>

<thead class="[&_tr]:border-b {className}">
	{@render children?.()}
</thead>
