
      <!-- Process Permissions -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Process Access *
        </label>
        <div class="space-y-2">
          <PermissionMatrix 
            permissions={processPermissions} 
            editable={true} 
            onChange={updatePermissions} />
          
          <!-- Hidden inputs for form submission -->
          {#each processPermissions as permission}
            <input type="hidden" name="process_permissions" value={permission} />
          {/each}
        </div>
        <p class="mt-1 text-sm text-gray-500">
          Select which processes this user can access
        </p>
      </div>

      <!-- Business Unit -->
      {#if businessUnits.length > 0}
        <div>
          <label for="business_unit_id" class="block text-sm font-medium text-gray-700 mb-2">
            Business Unit
          </label>
          <select
            id="business_unit_id"
            name="business_unit_id"
            bind:value={businessUnitId}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
            <option value="">No specific unit</option>
            {#each businessUnits as unit}
              <option value={unit.id}>{unit.name}</option>
            {/each}
          </select>
        </div>
      {/if}

      <!-- Custom Message -->
      <div>
        <label for="message" class="block text-sm font-medium text-gray-700 mb-2">
          Personal Message (Optional)
        </label>
        <textarea
          id="message"
          name="message"
          bind:value={message}
          rows="3"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Add a personal message to the invitation email..."></textarea>
      </div>
    </div>

    <!-- Actions -->
    <div class="mt-6 flex justify-end gap-3">
      <button
        type="button"
        on:click={handleCancel}
        class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
        Cancel
      </button>
      
      <button
        type="submit"
        disabled={isSubmitting || processPermissions.length === 0}
        class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
        {isSubmitting ? 'Sending...' : 'Send Invitation'}
      </button>
    </div>
  </form>
</div>
