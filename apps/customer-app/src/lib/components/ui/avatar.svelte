<script lang="ts">
	interface AvatarProps {
		src?: string;
		alt?: string;
		fallback?: string;
		size?: 'sm' | 'md' | 'lg' | 'xl';
		class?: string;
	}

	let { 
		src,
		alt = '',
		fallback = '?',
		size = 'md',
		class: className = ''
	}: AvatarProps = $props();

	const sizeClasses = {
		sm: 'w-8 h-8 text-xs',
		md: 'w-10 h-10 text-sm',
		lg: 'w-12 h-12 text-base',
		xl: 'w-16 h-16 text-lg'
	};

	let imageError = $state(false);

	const handleImageError = () => {
		imageError = true;
	};

	// Generate fallback from name/email if provided
	const generateFallback = (text: string) => {
		return text
			.split(' ')
			.slice(0, 2)
			.map(word => word.charAt(0))
			.join('')
			.toUpperCase();
	};

	const displayFallback = alt ? generateFallback(alt) : fallback;
</script>

<div 
	class="relative inline-flex items-center justify-center rounded-full bg-gray-100 {sizeClasses[size]} {className}"
>
	{#if src && !imageError}
		<img
			{src}
			{alt}
			class="w-full h-full rounded-full object-cover"
			on:error={handleImageError}
		/>
	{:else}
		<span class="font-medium text-gray-600">
			{displayFallback}
		</span>
	{/if}
</div>
