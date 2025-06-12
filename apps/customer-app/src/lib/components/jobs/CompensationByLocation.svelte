<script lang="ts">
  import type { JobCompensation } from '../../../../../packages/shared-types'
  
  export let compensation: Omit<JobCompensation, 'id' | 'job_id' | 'company_id' | 'created_at' | 'updated_at'>[] = []
  export let locations: any[] = []
  
  // Initialize compensation for each location
  $: if (locations.length > compensation.length) {
    compensation = [
      ...compensation,
      ...Array(locations.length - compensation.length).fill(null).map(() => ({
        salary_currency: 'USD',
        salary_frequency: 'annual',
        bonus_eligible: false,
        commission_eligible: false,
        equity_eligible: false,
        cost_of_living_adjustment: 0
      }))
    ]
  }
  
  function getLocationLabel(index: number) {
    const location = locations[index]
    if (!location) return `Location ${index + 1}`
    
    if (location.location_type === 'remote') return 'Remote'
    if (location.city && location.country) return `${location.city}, ${location.country}`
    if (location.city) return location.city
    if (location.country) return location.country
    return `${location.location_type} location`
  }
</script>

<div class="space-y-4">
  <h3 class="text-lg font-medium">Compensation by Location</h3>
  
  {#each compensation as comp, index}
    {#if locations[index]}
      <div class="border rounded-lg p-4 bg-gray-50">
        <h4 class="font-medium mb-3">{getLocationLabel(index)}</h4>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Salary Range -->
          <div>
            <label class="block text-sm font-medium mb-1">Min Salary</label>
            <input 
              type="number" 
              min="0"
              bind:value={comp.salary_min}
              placeholder="50000"
              class="w-full border rounded-lg px-3 py-2">
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1">Max Salary</label>
            <input 
              type="number" 
              min="0"
              bind:value={comp.salary_max}
              placeholder="80000"
              class="w-full border rounded-lg px-3 py-2">
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1">Currency</label>
            <select bind:value={comp.salary_currency} class="w-full border rounded-lg px-3 py-2">
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="CAD">CAD</option>
            </select>
          </div>
          
          <!-- Frequency -->
          <div>
            <label class="block text-sm font-medium mb-1">Frequency</label>
            <select bind:value={comp.salary_frequency} class="w-full border rounded-lg px-3 py-2">
              <option value="hourly">Hourly</option>
              <option value="monthly">Monthly</option>
              <option value="annual">Annual</option>
            </select>
          </div>
          
          <!-- Cost of Living Adjustment -->
          <div>
            <label class="block text-sm font-medium mb-1">Cost of Living Adj. (%)</label>
            <input 
              type="number" 
              min="-50" 
              max="100"
              bind:value={comp.cost_of_living_adjustment}
              class="w-full border rounded-lg px-3 py-2">
          </div>
        </div>
        
        <!-- Additional Benefits -->
        <div class="mt-4 space-y-2">
          <div class="flex items-center space-x-4">
            <label class="flex items-center space-x-2">
              <input type="checkbox" bind:checked={comp.bonus_eligible} class="text-blue-600">
              <span class="text-sm">Bonus eligible</span>
            </label>
            
            <label class="flex items-center space-x-2">
              <input type="checkbox" bind:checked={comp.commission_eligible} class="text-blue-600">
              <span class="text-sm">Commission eligible</span>
            </label>
            
            <label class="flex items-center space-x-2">
              <input type="checkbox" bind:checked={comp.equity_eligible} class="text-blue-600">
              <span class="text-sm">Equity eligible</span>
            </label>
          </div>
        </div>
      </div>
    {/if}
  {/each}
</div>
