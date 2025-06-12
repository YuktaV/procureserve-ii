<script lang="ts">
	import Button from '$lib/components/ui/button.svelte'
	import { ArrowRight, Edit3 } from 'lucide-svelte'
	import { goto } from '$app/navigation'
	
	export let profileStatus: 'incomplete' | 'basic_complete' | 'full_complete'
	export let candidateName: string = ''
	export let showActions: boolean = true
	
	function completeProfile() {
		goto('/complete-profile')
	}
	
	function editProfile() {
		goto('/profile/edit')
	}
	
	$: actionNeeded = profileStatus !== 'full_complete'
	$: actionText = profileStatus === 'incomplete' 
		? 'Complete Your Profile' 
		: 'Update Profile Information'
</script>

<div class="bg-white rounded-lg border border-gray-200 p-6">
	<div class="flex items-center justify-between">
		<div>
			<h3 class="text-lg font-semibold text-gray-900">
				{#if candidateName}
					Welcome, {candidateName}!
				{:else}
					Profile Status
				{/if}
			</h3>
			
			{#if actionNeeded}
				<p class="text-sm text-gray-600 mt-1">
					{#if profileStatus === 'incomplete'}
						Complete your profile to get matched with relevant opportunities.
					{:else}
						Add more details to improve your job matching.
					{/if}
				</p>
			{:else}
				<p class="text-sm text-green-600 mt-1">
					Your profile is complete! You're ready to apply for jobs.
				</p>
			{/if}
		</div>
		
		{#if showActions}
			<div class="flex gap-2">
				{#if actionNeeded}
					<Button on:click={completeProfile}>
						{actionText}
						<ArrowRight class="w-4 h-4 ml-2" />
					</Button>
				{:else}
					<Button variant="outline" on:click={editProfile}>
						<Edit3 class="w-4 h-4 mr-2" />
						Edit Profile
					</Button>
				{/if}
			</div>
		{/if}
	</div>
</div>
