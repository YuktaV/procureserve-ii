<script lang="ts">
	interface BadgeProps {
		variant?: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline';
		size?: 'sm' | 'md' | 'lg';
		class?: string;
		children?: any;
	}

	let { 
		variant = 'default',
		size = 'md',
		class: className = '',
		children
	}: BadgeProps = $props();

	const variantClasses = {
		default: 'bg-primary text-primary-foreground',
		secondary: 'bg-secondary text-secondary-foreground',
		success: 'bg-green-100 text-green-800 border-green-200',
		warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
		destructive: 'bg-red-100 text-red-800 border-red-200',
		outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
	};

	const sizeClasses = {
		sm: 'px-2 py-0.5 text-xs',
		md: 'px-2.5 py-0.5 text-sm',
		lg: 'px-3 py-1 text-sm'
	};
</script>

<span 
	class="inline-flex items-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 {variantClasses[variant]} {sizeClasses[size]} {className}"
>
	{@render children?.()}
</span>
