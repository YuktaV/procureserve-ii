<script lang="ts">
	interface ProgressBarProps {
		value: number;
		max?: number;
		size?: 'sm' | 'md' | 'lg';
		variant?: 'default' | 'success' | 'warning' | 'destructive';
		showLabel?: boolean;
		class?: string;
	}

	let { 
		value,
		max = 100,
		size = 'md',
		variant = 'default',
		showLabel = false,
		class: className = ''
	}: ProgressBarProps = $props();

	// Calculate percentage
	const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

	const sizeClasses = {
		sm: 'h-1',
		md: 'h-2',
		lg: 'h-3'
	};

	const variantClasses = {
		default: 'bg-primary',
		success: 'bg-green-500',
		warning: 'bg-yellow-500',
		destructive: 'bg-red-500'
	};
</script>

<div class="w-full {className}">
	{#if showLabel}
		<div class="flex justify-between text-sm text-gray-600 mb-1">
			<span>Progress</span>
			<span>{Math.round(percentage)}%</span>
		</div>
	{/if}
	
	<div class="w-full bg-gray-200 rounded-full {sizeClasses[size]}" role="progressbar" aria-valuenow={value} aria-valuemin="0" aria-valuemax={max}>
		<div 
			class="rounded-full transition-all duration-300 ease-in-out {sizeClasses[size]} {variantClasses[variant]}"
			style="width: {percentage}%"
		></div>
	</div>
</div>
