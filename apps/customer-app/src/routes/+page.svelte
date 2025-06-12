<script>
	import Button from '$lib/components/ui/button.svelte'
	import Card from '$lib/components/ui/card.svelte'
	import CardContent from '$lib/components/ui/card-content.svelte'
	import { Building2, Users, Zap, Shield, ArrowRight } from 'lucide-svelte'
	import { goto } from '$app/navigation'

	function navigateToLogin() {
		goto('/login')
	}

	function navigateToRegister() {
		goto('/register')
	}

	function navigateToCandidateRegister() {
		goto('/register/candidate')
	}
</script>

<svelte:head>
	<title>ProcureServe - Streamline Your Staffing & Recruitment</title>
</svelte:head>

<!-- Hero Section -->
<div class="bg-gradient-to-br from-primary/10 via-background to-secondary/10 min-h-screen">
	<div class="container mx-auto px-4 py-16">
		<!-- Navigation -->
		<nav class="flex justify-between items-center mb-16">
			<div class="flex items-center gap-2">
				<Building2 class="w-8 h-8 text-primary" />
				<span class="text-2xl font-bold">ProcureServe</span>
			</div>
			<div class="flex items-center gap-4">
				<Button variant="ghost" on:click={navigateToLogin}>Sign In</Button>
				<Button on:click={navigateToRegister}>Get Started</Button>
			</div>
		</nav>
		
		<!-- Hero Content -->
		<div class="text-center max-w-4xl mx-auto">
			<h1 class="text-4xl md:text-6xl font-bold text-foreground mb-6">
				Streamline Your
				<span class="text-primary">Staffing & Recruitment</span>
			</h1>
			<p class="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
				Modern platform for staffing agencies, direct employers, and candidates. 
				Manage jobs, candidates, and submissions with enterprise-grade security.
			</p>
			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<Button size="lg" on:click={navigateToRegister}>
					Start Free Trial
					<ArrowRight class="w-4 h-4 ml-2" />
				</Button>
				<Button variant="outline" size="lg" on:click={navigateToLogin}>
					Sign In
				</Button>
			</div>
		</div>
	</div>
</div>

<!-- Features Section -->
<div class="py-16 bg-background">
	<div class="container mx-auto px-4">
		<div class="text-center mb-12">
			<h2 class="text-3xl font-bold mb-4">Why Choose ProcureServe?</h2>
			<p class="text-muted-foreground max-w-2xl mx-auto">
				Built specifically for the staffing industry with features that matter most
			</p>
		</div>
		
		<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
			<Card>
				<CardContent class="p-6 text-center">
					<Building2 class="w-12 h-12 text-primary mx-auto mb-4" />
					<h3 class="font-semibold mb-2">Multi-Tenant</h3>
					<p class="text-sm text-muted-foreground">
						Secure company isolation with role-based access control
					</p>
				</CardContent>
			</Card>
			
			<Card>
				<CardContent class="p-6 text-center">
					<Users class="w-12 h-12 text-primary mx-auto mb-4" />
					<h3 class="font-semibold mb-2">Dual Processes</h3>
					<p class="text-sm text-muted-foreground">
						Support both recruitment and bench sales operations
					</p>
				</CardContent>
			</Card>
			
			<Card>
				<CardContent class="p-6 text-center">
					<Zap class="w-12 h-12 text-primary mx-auto mb-4" />
					<h3 class="font-semibold mb-2">Configurable</h3>
					<p class="text-sm text-muted-foreground">
						Customize enums, workflows, and business rules
					</p>
				</CardContent>
			</Card>
			
			<Card>
				<CardContent class="p-6 text-center">
					<Shield class="w-12 h-12 text-primary mx-auto mb-4" />
					<h3 class="font-semibold mb-2">Enterprise Security</h3>
					<p class="text-sm text-muted-foreground">
						Row-level security and comprehensive audit logging
					</p>
				</CardContent>
			</Card>
		</div>
	</div>
</div>

<!-- CTA Section -->
<div class="py-16 bg-primary/5">
	<div class="container mx-auto px-4 text-center">
		<h2 class="text-3xl font-bold mb-4">Ready to Get Started?</h2>
		<p class="text-muted-foreground mb-8 max-w-2xl mx-auto">
			Join hundreds of staffing agencies and employers already using ProcureServe 
			to streamline their recruitment processes.
		</p>
		<div class="flex flex-col sm:flex-row gap-4 justify-center">
			<Button size="lg" on:click={navigateToRegister}>
				Register Your Business
			</Button>
			<Button variant="outline" size="lg" on:click={navigateToCandidateRegister}>
				Join as a Candidate
			</Button>
		</div>
	</div>
</div>

<!-- Footer -->
<footer class="py-8 border-t bg-background">
	<div class="container mx-auto px-4">
		<div class="flex flex-col md:flex-row justify-between items-center">
			<div class="flex items-center gap-2 mb-4 md:mb-0">
				<Building2 class="w-6 h-6 text-primary" />
				<span class="font-semibold">ProcureServe</span>
			</div>
			<div class="flex gap-6 text-sm text-muted-foreground">
				<a href="/about" class="hover:text-foreground">About</a>
				<a href="/contact" class="hover:text-foreground">Contact</a>
				<a href="/privacy" class="hover:text-foreground">Privacy</a>
				<a href="/terms" class="hover:text-foreground">Terms</a>
			</div>
		</div>
		<div class="mt-4 pt-4 border-t text-center text-sm text-muted-foreground">
			© 2024 ProcureServe. All rights reserved.
		</div>
	</div>
</footer>
