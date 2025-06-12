3}
        <JobLocationManager bind:locations {errors} />
      {:else if currentStep === 4}
        <CompensationByLocation 
          bind:compensation 
          {locations} />
      {/if}
      
      {#if errors.submit}
        <div class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-red-600 text-sm">{errors.submit}</p>
        </div>
      {/if}
    </div>
    
    <!-- Navigation Buttons -->
    <div class="flex justify-between mt-6">
      <button 
        type="button"
        on:click={prevStep}
        disabled={currentStep === 1}
        class="px-6 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
        Previous
      </button>
      
      <div class="flex gap-3">
        {#if currentStep === 4}
          <button 
            type="button"
            on:click={updateJob}
            disabled={isSubmitting}
            class="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg">
            {isSubmitting ? 'Updating...' : 'Update Job'}
          </button>
        {:else}
          <button 
            type="button"
            on:click={nextStep}
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
            Next
          </button>
        {/if}
      </div>
    </div>
  </div>
{/if}
