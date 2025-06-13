<script lang="ts">
	import { closeModal } from '$lib/stores/modal-store';
	import Button from '$lib/components/ui/button.svelte';

	const handleConfirm = () => {
		closeModal('demo-modal');
		// Add your confirmation logic here
	};

	const handleCancel = () => {
		closeModal('demo-modal');
	};
</script>

<div class="space-y-4">
	<p class="text-gray-600">
		This is the content inside the modal. You can put any component or content here.
		The modal is fully accessible and supports keyboard navigation.
	</p>
	
	<div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
		<h4 class="font-medium text-blue-900 mb-2">Features included:</h4>
		<ul class="text-sm text-blue-800 space-y-1">
			<li>• Keyboard navigation (ESC to close)</li>
			<li>• Click outside to close</li>
			<li>• Focus management</li>
			<li>• Screen reader support</li>
			<li>• Smooth animations</li>
		</ul>
	</div>
	
	<div class="flex justify-end gap-3 pt-4 border-t">
		<Button variant="outline" on:click={handleCancel}>
			Cancel
		</Button>
		<Button on:click={handleConfirm}>
			Confirm
		</Button>
	</div>
</div>
