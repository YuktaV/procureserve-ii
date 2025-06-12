<script lang="ts">
	import Card from '$lib/components/ui/card.svelte'
	import CardHeader from '$lib/components/ui/card-header.svelte'
	import CardTitle from '$lib/components/ui/card-title.svelte'
	import CardContent from '$lib/components/ui/card-content.svelte'
	import Button from '$lib/components/ui/button.svelte'
	import { Upload, FileText, Check, AlertTriangle, Send } from 'lucide-svelte'
	import { enhance } from '$app/forms'
	
	export let data
	export let form
	
	let loading = false
	let submitLoading = false
	
	// Document requirements
	const requiredDocuments = [
		{
			type: 'business_license',
			name: 'Business License',
			description: 'Current business license or registration certificate',
			required: true
		},
		{
			type: 'insurance_certificate',
			name: 'Insurance Certificate',
			description: 'Certificate of general liability insurance',
			required: true
		},
		{
			type: 'contact_id',
			name: 'Contact ID',
			description: 'Government-issued ID for primary contact (optional)',
			required: false
		}
	]
	
	// Check which documents are uploaded
	$: uploadedTypes = data.existingDocuments.map(doc => doc.document_type)
	$: requiredUploaded = requiredDocuments
		.filter(doc => doc.required)
		.every(doc => uploadedTypes.includes(doc.type))
	
	function getDocumentStatus(docType: string) {
		return uploadedTypes.includes(docType)
	}
	
	function formatFileSize(bytes: number) {
		if (bytes === 0) return '0 Bytes'
		const k = 1024
		const sizes = ['Bytes', 'KB', 'MB']
		const i = Math.floor(Math.log(bytes) / Math.log(k))
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
	}
</script>

<div class="min-h-screen bg-gray-50 py-12 px-4">
	<div class="max-w-4xl mx-auto">
		<!-- Header -->
		<div class="mb-8">
			<div class="text-center">
				<h1 class="text-3xl font-bold text-gray-900">Upload Required Documents</h1>
				<p class="mt-2 text-gray-600">
					Upload your business documents for {data.company?.name}
				</p>
			</div>
		</div>

		{#if form?.error}
			<div class="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
				<div class="flex items-center gap-2">
					<AlertTriangle class="w-5 h-5 text-red-600" />
					<p class="text-red-800">{form.error}</p>
				</div>
			</div>
		{/if}

		{#if form?.success}
			<div class="mb-6 p-4 rounded-lg bg-green-50 border border-green-200">
				<div class="flex items-center gap-2">
					<Check class="w-5 h-5 text-green-600" />
					<p class="text-green-800">{form.message}</p>
				</div>
			</div>
		{/if}

		<!-- Document Upload Cards -->
		<div class="space-y-6 mb-8">
			{#each requiredDocuments as doc}
				<Card>
					<CardHeader>
						<CardTitle class="flex items-center gap-2">
							<FileText class="w-5 h-5" />
							{doc.name}
							{#if doc.required}
								<span class="text-red-500">*</span>
							{/if}
							{#if getDocumentStatus(doc.type)}
								<Check class="w-4 h-4 text-green-600 ml-auto" />
							{/if}
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div class="space-y-4">
							<p class="text-sm text-gray-600">{doc.description}</p>
							
							<!-- Show uploaded file if exists -->
							{@const uploadedDoc = data.existingDocuments.find(d => d.document_type === doc.type)}
							{#if uploadedDoc}
								<div class="bg-green-50 border border-green-200 rounded-lg p-3">
									<div class="flex items-center justify-between">
										<div>
											<p class="font-medium text-green-900">{uploadedDoc.file_name}</p>
											<p class="text-sm text-green-700">
												Uploaded on {new Date(uploadedDoc.uploaded_at).toLocaleDateString()}
											</p>
										</div>
										<Check class="w-5 h-5 text-green-600" />
									</div>
								</div>
							{/if}
							
							<!-- Upload form -->
							<form 
								method="POST" 
								action="?/uploadDocument" 
								enctype="multipart/form-data"
								use:enhance={() => {
									loading = true
									return async ({ result, update }) => {
										loading = false
										await update()
									}
								}}
							>
								<input type="hidden" name="company_id" value={data.companyId} />
								<input type="hidden" name="document_type" value={doc.type} />
								
								<div class="flex items-center gap-4">
									<input
										type="file"
										name="file"
										accept=".pdf"
										class="flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:bg-primary/90"
									/>
									<Button 
										type="submit" 
										disabled={loading}
										size="sm"
										variant={getDocumentStatus(doc.type) ? "outline" : "default"}
									>
										<Upload class="w-4 h-4 mr-2" />
										{loading ? 'Uploading...' : getDocumentStatus(doc.type) ? 'Replace' : 'Upload'}
									</Button>
								</div>
								
								<div class="text-xs text-gray-500 mt-2">
									PDF files only, maximum 5MB
								</div>
							</form>
						</div>
					</CardContent>
				</Card>
			{/each}
		</div>

		<!-- Submit for Review -->
		<Card>
			<CardHeader>
				<CardTitle class="flex items-center gap-2">
					<Send class="w-5 h-5" />
					Submit for Review
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div class="space-y-4">
					{#if requiredUploaded}
						<div class="bg-green-50 border border-green-200 rounded-lg p-4">
							<div class="flex items-center gap-2">
								<Check class="w-5 h-5 text-green-600" />
								<div>
									<h3 class="font-medium text-green-900">Ready for Review</h3>
									<p class="text-sm text-green-800">
										All required documents have been uploaded. You can now submit your registration for review.
									</p>
								</div>
							</div>
						</div>
						
						<form 
							method="POST" 
							action="?/submitForReview"
							use:enhance={() => {
								submitLoading = true
								return async ({ result, update }) => {
									submitLoading = false
									await update()
								}
							}}
						>
							<input type="hidden" name="company_id" value={data.companyId} />
							<Button 
								type="submit" 
								disabled={submitLoading}
								class="w-full"
							>
								<Send class="w-4 h-4 mr-2" />
								{submitLoading ? 'Submitting...' : 'Submit for Review'}
							</Button>
						</form>
					{:else}
						<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
							<div class="flex items-center gap-2">
								<AlertTriangle class="w-5 h-5 text-yellow-600" />
								<div>
									<h3 class="font-medium text-yellow-900">Documents Required</h3>
									<p class="text-sm text-yellow-800">
										Please upload all required documents before submitting for review.
									</p>
								</div>
							</div>
						</div>
						
						<Button disabled class="w-full">
							<Send class="w-4 h-4 mr-2" />
							Submit for Review
						</Button>
					{/if}
					
					<div class="text-sm text-gray-600">
						<h4 class="font-medium mb-2">What happens next?</h4>
						<ul class="space-y-1 text-sm">
							<li>• Your registration will be reviewed by our team</li>
							<li>• You'll receive email updates on your status</li>
							<li>• Review typically takes 1-3 business days</li>
							<li>• Once approved, you can start using ProcureServe</li>
						</ul>
					</div>
				</div>
			</CardContent>
		</Card>

		<!-- Support Information -->
		<div class="mt-8 text-center">
			<p class="text-sm text-gray-600">
				Need help with document upload? 
				<a href="mailto:support@procureserve.com" class="text-primary hover:underline">
					Contact our support team
				</a>
			</p>
		</div>
	</div>
</div>
