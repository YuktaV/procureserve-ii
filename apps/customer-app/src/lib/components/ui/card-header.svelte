<script lang="ts">
	import { cn } from '$lib/utils'
	
	let className: string = ''
	export { className as class }
</script>

<div class={cn('space-y-1.5 p-6', className)} {...$$restProps}>
	<slot />
</div>
