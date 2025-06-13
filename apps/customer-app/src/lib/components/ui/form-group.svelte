<script lang="ts">
	interface FormGroupProps {
		title?: string;
		description?: string;
		class?: string;
		children?: any;
	}

	let { 
		title,
		description,
		class: className = '',
		children
	}: FormGroupProps = $props();
</script>

<fieldset class="space-y-4 {className}">
	{#if title}
		<legend class="text-lg font-medium text-gray-900">{title}</legend>
	{/if}
	
	{#if description}
		<p class="text-sm text-gray-600 -mt-2">{description}</p>
	{/if}
	
	<div class="space-y-4">
		{@render children?.()}
	</div>
</fieldset>
