<script lang="ts">
	import { toastSuccess, toastError, toastWarning, toastInfo, openModal, closeModal } from '$lib'
	import Button from '$lib/components/ui/button.svelte'
	import LoadingButton from '$lib/components/ui/loading-button.svelte'
	import Card from '$lib/components/ui/card.svelte'
	import CardHeader from '$lib/components/ui/card-header.svelte'
	import CardTitle from '$lib/components/ui/card-title.svelte'
	import CardContent from '$lib/components/ui/card-content.svelte'
	import FormField from '$lib/components/ui/form-field.svelte'
	import FormGroup from '$lib/components/ui/form-group.svelte'
	import Input from '$lib/components/ui/input.svelte'
	import Badge from '$lib/components/ui/badge.svelte'
	import Avatar from '$lib/components/ui/avatar.svelte'
	import Spinner from '$lib/components/ui/spinner.svelte'
	import Skeleton from '$lib/components/ui/skeleton.svelte'
	import ProgressBar from '$lib/components/ui/progress-bar.svelte'
	import EmptyState from '$lib/components/ui/empty-state.svelte'
	import Table from '$lib/components/ui/table.svelte'
	import TableHeader from '$lib/components/ui/table-header.svelte'
	import TableBody from '$lib/components/ui/table-body.svelte'
	import TableRow from '$lib/components/ui/table-row.svelte'
	import TableHead from '$lib/components/ui/table-head.svelte'
	import TableCell from '$lib/components/ui/table-cell.svelte'
	import { FileText, Plus } from 'lucide-svelte'

	let loading = $state(false)
	let formData = $state({ email: '', name: '', message: '' })
	let formErrors = $state({})

	function showSuccessToast() {
		toastSuccess('Success!', 'Your action was completed successfully.')
	}

	function showErrorToast() {
		toastError('Error occurred', 'Something went wrong. Please try again.')
	}

	function showWarningToast() {
		toastWarning('Warning', 'Please review your input before proceeding.')
	}

	function showInfoToast() {
		toastInfo('Information', 'Here is some helpful information for you.')
	}

	function showModal() {
		openModal({
			id: 'demo-modal',
			title: 'Demo Modal',
			description: 'This is a demonstration of the modal component',
			size: 'md'
		})
	}

	function simulateLoading() {
		loading = true
		setTimeout(() => {
			loading = false
			toastSuccess('Completed!', 'The operation finished successfully.')
		}, 2000)
	}

	function handleEmptyStateAction() {
		toastInfo('Action triggered', 'Empty state action button was clicked.')
	}
</script>

<svelte:head>
	<title>Component Demo - ProcureServe</title>
</svelte:head>

<div class="container mx-auto py-8 px-4 max-w-4xl">
	<h1 class="text-3xl font-bold mb-8">UI Component Demo</h1>
	
	<div class="grid gap-6">
		<!-- Toast Demo -->
		<Card>
			<CardHeader>
				<CardTitle>Toast Notifications</CardTitle>
			</CardHeader>
			<CardContent>
				<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
					<Button on:click={showSuccessToast} class="w-full">Success</Button>
					<Button on:click={showErrorToast} variant="destructive" class="w-full">Error</Button>
					<Button on:click={showWarningToast} variant="outline" class="w-full">Warning</Button>
					<Button on:click={showInfoToast} variant="secondary" class="w-full">Info</Button>
				</div>
			</CardContent>
		</Card>

		<!-- Modal Demo -->
		<Card>
			<CardHeader>
				<CardTitle>Modal System</CardTitle>
			</CardHeader>
			<CardContent>
				<Button on:click={showModal}>Open Modal</Button>
			</CardContent>
		</Card>

		<!-- Form Components Demo -->
		<Card>
			<CardHeader>
				<CardTitle>Form Components</CardTitle>
			</CardHeader>
			<CardContent>
				<FormGroup title="Contact Information" description="Please fill out your details">
					<FormField label="Full Name" required helpText="Enter your first and last name">
						{#snippet children(props)}
							<Input {...props} bind:value={formData.name} placeholder="John Doe" />
						{/snippet}
					</FormField>
					
					<FormField label="Email Address" required error={formErrors.email} helpText="We'll never share your email">
						{#snippet children(props)}
							<Input {...props} type="email" bind:value={formData.email} placeholder="you@example.com" />
						{/snippet}
					</FormField>
					
					<FormField label="Message" helpText="Optional message">
						{#snippet children(props)}
							<Input {...props} bind:value={formData.message} placeholder="Your message here..." />
						{/snippet}
					</FormField>
				</FormGroup>
			</CardContent>
		</Card>

		<!-- Loading States Demo -->
		<Card>
			<CardHeader>
				<CardTitle>Loading States</CardTitle>
			</CardHeader>
			<CardContent>
				<div class="space-y-4">
					<div class="flex items-center gap-4">
						<Spinner size="sm" />
						<Spinner size="md" />
						<Spinner size="lg" />
						<span class="text-sm text-gray-600">Different spinner sizes</span>
					</div>
					
					<div class="space-y-2">
						<Skeleton width="w-3/4" height="h-4" />
						<Skeleton width="w-1/2" height="h-4" />
						<Skeleton width="w-5/6" height="h-4" />
					</div>
					
					<LoadingButton {loading} on:click={simulateLoading}>
						{loading ? 'Processing...' : 'Start Process'}
					</LoadingButton>
					
					<div class="space-y-3">
						<h4 class="text-sm font-medium">Progress Examples:</h4>
						<ProgressBar value={25} showLabel />
						<ProgressBar value={50} variant="success" showLabel />
						<ProgressBar value={75} variant="warning" size="lg" showLabel />
						<ProgressBar value={90} variant="destructive" />
					</div>
				</div>
			</CardContent>
		</Card>

		<!-- Badge & Avatar Demo -->
		<Card>
			<CardHeader>
				<CardTitle>Badges & Avatars</CardTitle>
			</CardHeader>
			<CardContent>
				<div class="space-y-4">
					<div class="flex flex-wrap gap-2">
						<Badge>Default</Badge>
						<Badge variant="secondary">Secondary</Badge>
						<Badge variant="success">Success</Badge>
						<Badge variant="warning">Warning</Badge>
						<Badge variant="destructive">Error</Badge>
						<Badge variant="outline">Outline</Badge>
					</div>
					
					<div class="flex items-center gap-4">
						<Avatar size="sm" alt="John Doe" />
						<Avatar size="md" alt="Jane Smith" />
						<Avatar size="lg" alt="Bob Johnson" />
						<Avatar size="xl" alt="Alice Williams" />
					</div>
				</div>
			</CardContent>
		</Card>

		<!-- Table Demo -->
		<Card>
			<CardHeader>
				<CardTitle>Data Table</CardTitle>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Role</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<TableRow>
							<TableCell class="flex items-center gap-2">
								<Avatar size="sm" alt="John Doe" />
								John Doe
							</TableCell>
							<TableCell><Badge variant="success">Active</Badge></TableCell>
							<TableCell>Admin</TableCell>
							<TableCell>
								<Button size="sm" variant="outline">Edit</Button>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell class="flex items-center gap-2">
								<Avatar size="sm" alt="Jane Smith" />
								Jane Smith
							</TableCell>
							<TableCell><Badge variant="warning">Pending</Badge></TableCell>
							<TableCell>User</TableCell>
							<TableCell>
								<Button size="sm" variant="outline">Edit</Button>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell class="flex items-center gap-2">
								<Avatar size="sm" alt="Bob Johnson" />
								Bob Johnson
							</TableCell>
							<TableCell><Badge variant="destructive">Inactive</Badge></TableCell>
							<TableCell>Manager</TableCell>
							<TableCell>
								<Button size="sm" variant="outline">Edit</Button>
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</CardContent>
		</Card>

		<!-- Empty State Demo -->
		<Card>
			<CardHeader>
				<CardTitle>Empty State</CardTitle>
			</CardHeader>
			<CardContent>
				<EmptyState
					title="No documents found"
					description="Get started by creating your first document or uploading an existing one."
					icon={FileText}
					actionText="Create Document"
					onAction={handleEmptyStateAction}
				/>
			</CardContent>
		</Card>
	</div>
</div>
