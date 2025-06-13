<script lang="ts">
	import Label from './label.svelte';

	interface FormFieldProps {
		label?: string;
		required?: boolean;
		error?: string;
		helpText?: string;
		id?: string;
		class?: string;
		children?: any;
	}

	let { 
		label,
		required = false,
		error,
		helpText,
		id,
		class: className = '',
		children
	}: FormFieldProps = $props();

	// Generate unique ID if not provided
	const fieldId = id || `field-${Math.random().toString(36).substr(2, 9)}`;
	const errorId = `${fieldId}-error`;
	const helpId = `${fieldId}-help`;
</script>

<div class="space-y-2 {className}">
	{#if label}
		<Label for={fieldId} class={required ? "after:content-['*'] after:ml-0.5 after:text-red-500" : ""}>
			{label}
		</Label>
	{/if}
	
	<div class="relative">
		{@render children?.({ 
			id: fieldId, 
			'aria-describedby': [helpText ? helpId : '', error ? errorId : ''].filter(Boolean).join(' ') || undefined,
			'aria-invalid': error ? 'true' : undefined,
			class: error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : undefined
		})}
	</div>
	
	{#if helpText}
		<p id={helpId} class="text-sm text-gray-600">
			{helpText}
		</p>
	{/if}
	
	{#if error}
		<p id={errorId} class="text-sm text-red-600 flex items-center gap-1" role="alert">
			<svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
				<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
			</svg>
			{error}
		</p>
	{/if}
</div>
