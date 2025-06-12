Location Type</label>
          <select bind:value={location.location_type} class="w-full border rounded-lg px-3 py-2">
            <option value="office">Office</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>
        
        <!-- Headcount -->
        <div>
          <label class="block text-sm font-medium mb-1">Headcount</label>
          <input 
            type="number" 
            min="1" 
            bind:value={location.headcount}
            class="w-full border rounded-lg px-3 py-2">
        </div>
        
        {#if location.location_type !== 'remote'}
          <!-- City -->
          <div>
            <label class="block text-sm font-medium mb-1">City</label>
            <input 
              type="text" 
              bind:value={location.city}
              placeholder="New York"
              class="w-full border rounded-lg px-3 py-2">
          </div>
          
          <!-- Country -->
          <div>
            <label class="block text-sm font-medium mb-1">Country</label>
            <input 
              type="text" 
              bind:value={location.country}
              placeholder="United States"
              class="w-full border rounded-lg px-3 py-2">
          </div>
        {/if}
        
        {#if location.location_type === 'hybrid'}
          <!-- Hybrid days in office -->
          <div>
            <label class="block text-sm font-medium mb-1">Days in Office</label>
            <input 
              type="number" 
              min="1" 
              max="7" 
              bind:value={location.hybrid_days_in_office}
              class="w-full border rounded-lg px-3 py-2">
          </div>
        {/if}
        
        <!-- Visa Sponsorship -->
        <div class="flex items-center space-x-2">
          <input 
            type="checkbox" 
            bind:checked={location.visa_sponsorship_available}
            class="text-blue-600">
          <label class="text-sm">Visa sponsorship available</label>
        </div>
        
        <!-- Relocation Assistance -->
        <div class="flex items-center space-x-2">
          <input 
            type="checkbox" 
            bind:checked={location.relocation_assistance_available}
            class="text-blue-600">
          <label class="text-sm">Relocation assistance available</label>
        </div>
      </div>
    </div>
  {/each}
  
  {#if locations.length === 0}
    <div class="text-center py-8 text-gray-500">
      <p>No locations added yet.</p>
      <button 
        type="button"
        on:click={addLocation}
        class="mt-2 text-blue-600 hover:text-blue-700">
        Add your first location
      </button>
    </div>
  {/if}
</div>
