<script>
	import Card from '$lib/components/ui/card.svelte'
	import CardHeader from '$lib/components/ui/card-header.svelte'
	import CardTitle from '$lib/components/ui/card-title.svelte'
	import CardDescription from '$lib/components/ui/card-description.svelte'
	import CardContent from '$lib/components/ui/card-content.svelte'
	import Button from '$lib/components/ui/button.svelte'
	import { Building2, User, ArrowRight, CheckCircle } from 'lucide-svelte'
	import { goto } from '$app/navigation'

	function navigateToBusinessRegister() {
		goto('/register/business')
	}

	function navigateToCandidateRegister() {
		goto('/register/candidate')
	}

	function navigateToLogin() {
		goto('/login')
	}
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
	<div class="max-w-4xl w-full">
		<div class="text-center mb-12">
			<h1 class="text-4xl font-bold text-gray-900 mb-4">Join ProcureServe</h1>
			<p class="text-xl text-gray-600">
				Choose your registration type to get started
			</p>
		</div>

		<!-- Registration Options -->
		<div class="grid md:grid-cols-2 gap-8 mb-8">
			<!-- Business Registration -->
			<Card class="relative overflow-hidden">
				<CardHeader class="text-center pb-6">
					<div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
						<Building2 class="w-8 h-8 text-primary" />
					</div>
					<CardTitle class="text-2xl">For Businesses</CardTitle>
					<CardDescription class="text-base">
						Staffing agencies and direct employers
					</CardDescription>
				</CardHeader>
				<CardContent class="text-center">
					<div class="space-y-4 mb-6">
						<div class="flex items-center text-sm text-gray-600">
							<CheckCircle class="w-4 h-4 text-green-600 mr-2" />
							Post and manage job openings
						</div>
						<div class="flex items-center text-sm text-gray-600">
							<CheckCircle class="w-4 h-4 text-green-600 mr-2" />
							Search and manage candidates
						</div>
						<div class="flex items-center text-sm text-gray-600">
							<CheckCircle class="w-4 h-4 text-green-600 mr-2" />
							Track applications and submissions
						</div>
						<div class="flex items-center text-sm text-gray-600">
							<CheckCircle class="w-4 h-4 text-green-600 mr-2" />
							AI-powered matching and insights
						</div>
						<div class="flex items-center text-sm text-gray-600">
							<CheckCircle class="w-4 h-4 text-green-600 mr-2" />
							Enterprise security and compliance
						</div>
					</div>
					
					<Button on:click={navigateToBusinessRegister} class="w-full" size="lg">
						Register Your Business
						<ArrowRight class="w-4 h-4 ml-2" />
					</Button>
					
					<p class="text-xs text-gray-500 mt-3">
						Includes document verification and approval process
					</p>
				</CardContent>
			</Card>

			<!-- Candidate Registration -->
			<Card class="relative overflow-hidden">
				<CardHeader class="text-center pb-6">
					<div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<User class="w-8 h-8 text-blue-600" />
					</div>
					<CardTitle class="text-2xl">For Candidates</CardTitle>
					<CardDescription class="text-base">
						Job seekers and consultants
					</CardDescription>
				</CardHeader>
				<CardContent class="text-center">
					<div class="space-y-4 mb-6">
						<div class="flex items-center text-sm text-gray-600">
							<CheckCircle class="w-4 h-4 text-green-600 mr-2" />
							Create your professional profile
						</div>
						<div class="flex items-center text-sm text-gray-600">
							<CheckCircle class="w-4 h-4 text-green-600 mr-2" />
							Browse and apply to jobs
						</div>
						<div class="flex items-center text-sm text-gray-600">
							<CheckCircle class="w-4 h-4 text-green-600 mr-2" />
							Track your applications
						</div>
						<div class="flex items-center text-sm text-gray-600">
							<CheckCircle class="w-4 h-4 text-green-600 mr-2" />
							Get matched with opportunities
						</div>
						<div class="flex items-center text-sm text-gray-600">
							<CheckCircle class="w-4 h-4 text-green-600 mr-2" />
							Manage your career journey
						</div>
					</div>
					
					<Button on:click={navigateToCandidateRegister} variant="outline" class="w-full" size="lg">
						Join as a Candidate
						<ArrowRight class="w-4 h-4 ml-2" />
					</Button>
					
					<p class="text-xs text-gray-500 mt-3">
						Quick registration with instant access
					</p>
				</CardContent>
			</Card>
		</div>

		<!-- Login Option -->
		<div class="text-center">
			<p class="text-gray-600 mb-4">Already have an account?</p>
			<Button variant="ghost" on:click={navigateToLogin} size="lg">
				Sign In to Your Account
			</Button>
		</div>

		<!-- Additional Information -->
		<div class="mt-12 text-center">
			<div class="bg-gray-100 rounded-lg p-6 max-w-2xl mx-auto">
				<h3 class="font-semibold text-gray-900 mb-2">Why Choose ProcureServe?</h3>
				<p class="text-sm text-gray-600">
					Our platform streamlines the entire staffing process with enterprise-grade security, 
					AI-powered matching, and comprehensive compliance tools. Join thousands of businesses 
					and candidates already using ProcureServe to accelerate their success.
				</p>
			</div>
		</div>
	</div>
</div>
