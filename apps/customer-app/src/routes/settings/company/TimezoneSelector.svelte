<script lang="ts">
	import { enhance } from '$app/forms'
	import Card from '$lib/components/ui/card.svelte'
	import CardContent from '$lib/components/ui/card-content.svelte'
	import Button from '$lib/components/ui/button.svelte'
	import { Save, Globe } from 'lucide-svelte'

	export let timezone: string
	export let locale: string
	export let canEdit: boolean

	// Common timezones
	const timezones = [
		{ value: 'America/New_York', label: 'Eastern Time (ET)' },
		{ value: 'America/Chicago', label: 'Central Time (CT)' },
		{ value: 'America/Denver', label: 'Mountain Time (MT)' },
		{ value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
		{ value: 'America/Phoenix', label: 'Arizona Time (MST)' },
		{ value: 'America/Anchorage', label: 'Alaska Time (AKT)' },
		{ value: 'Pacific/Honolulu', label: 'Hawaii Time (HST)' },
		{ value: 'Europe/London', label: 'London (GMT)' },
		{ value: 'Europe/Berlin', label: 'Berlin (CET)' },
		{ value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
		{ value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
		{ value: 'Asia/Kolkata', label: 'India (IST)' },
		{ value: 'Australia/Sydney', label: 'Sydney (AEDT)' }
	]

	// Common locales
	const locales = [
		{ value: 'en-US', label: 'English (United States)' },
		{ value: 'en-GB', label: 'English (United Kingdom)' },
		{ value: 'en-CA', label: 'English (Canada)' },
		{ value: 'es-US', label: 'Spanish (United States)' },
		{ value: 'es-ES', label: 'Spanish (Spain)' },
		{ value: 'fr-FR', label: 'French (France)' },
		{ value: 'de-DE', label: 'German (Germany)' },
		{ value: 'ja-JP', label: 'Japanese (Japan)' },
		{ value: 'zh-CN', label: 'Chinese (Simplified)' },
		{ value: 'pt-BR', label: 'Portuguese (Brazil)' }
	]

	let loading = false
	let selectedTimezone = timezone || 'America/New_York'
	let selectedLocale = locale || 'en-US'

	// Get current time in selected timezone for preview
	$: currentTime = new Intl.DateTimeFormat(selectedLocale, {
		timeZone: selectedTimezone,
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		timeZoneName: 'short'
	}).format(new Date())
</script>

<Card>
	<CardContent class="p-6">
		<div class="flex items-center gap-3 mb-6">
			<Globe class="w-6 h-6 text-primary" />
			<h2 class="text-xl font-semibold">Timezone & Localization</h2>
		</div>
		<p class="text-gray-600 mb-6">
			Configure your company's timezone and language preferences for consistent date/time display and localization.
		</p>
		
		<form 
			method="POST" 
			action="?/updateCompany"
			use:enhance={() => {
				loading = true
				return async ({ update }) => {
					loading = false
					await update()
				}
			}}
		>
			<!-- Hidden fields for other company data -->
			<input type="hidden" name="name" value="" />
			<input type="hidden" name="domain" value="" />
			<input type="hidden" name="industry" value="" />
			<input type="hidden" name="company_size" value="" />
			<input type="hidden" name="description" value="" />
			
			<div class="grid gap-6 md:grid-cols-2">
				<!-- Timezone Selection -->
				<div>
					<label for="timezone" class="block text-sm font-medium text-gray-700 mb-2">
						Company Timezone
					</label>
					<select
						id="timezone"
						name="timezone"
						bind:value={selectedTimezone}
						disabled={!canEdit}
						class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary disabled:bg-gray-50 disabled:text-gray-500"
					>
						{#each timezones as tz}
							<option value={tz.value}>{tz.label}</option>
						{/each}
					</select>
					<p class="mt-1 text-xs text-gray-500">
						This affects how dates and times are displayed throughout the application.
					</p>
				</div>

				<!-- Locale Selection -->
				<div>
					<label for="locale" class="block text-sm font-medium text-gray-700 mb-2">
						Language & Region
					</label>
					<select
						id="locale"
						name="locale"
						bind:value={selectedLocale}
						disabled={!canEdit}
						class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary disabled:bg-gray-50 disabled:text-gray-500"
					>
						{#each locales as loc}
							<option value={loc.value}>{loc.label}</option>
						{/each}
					</select>
					<p class="mt-1 text-xs text-gray-500">
						This affects number formatting, date formats, and currency display.
					</p>
				</div>
			</div>

			<!-- Preview -->
			<div class="mt-6 p-4 bg-gray-50 rounded-lg">
				<h3 class="text-sm font-medium text-gray-700 mb-2">Preview</h3>
				<p class="text-sm text-gray-600">
					<strong>Current time in your timezone:</strong> {currentTime}
				</p>
				<p class="text-xs text-gray-500 mt-1">
					Times will be displayed in this format throughout the application.
				</p>
			</div>

			{#if canEdit}
				<div class="mt-6 flex justify-end">
					<Button type="submit" disabled={loading}>
						<Save class="w-4 h-4 mr-2" />
						{loading ? 'Saving...' : 'Save Settings'}
					</Button>
				</div>
			{/if}
		</form>
	</CardContent>
</Card>
