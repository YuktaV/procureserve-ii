<script lang="ts">
  import type { PageData } from './$types'
  export let data: PageData
</script>

<svelte:head>
  <title>Debug Auth - ProcureServe</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 py-12 px-4">
  <div class="max-w-2xl mx-auto">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Authentication Debug</h1>
    
    <div class="bg-white shadow rounded-lg p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">Authentication State</h2>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Auth User:</label>
          <pre class="mt-1 p-2 bg-gray-100 rounded text-sm">{JSON.stringify(data.authUser, null, 2)}</pre>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700">Auth Error:</label>
          <pre class="mt-1 p-2 bg-gray-100 rounded text-sm">{data.authError || 'None'}</pre>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700">Customer User:</label>
          <pre class="mt-1 p-2 bg-gray-100 rounded text-sm">{JSON.stringify(data.customerUser, null, 2)}</pre>
        </div>
      </div>
    </div>
    
    <div class="flex space-x-4">
      <a href="/login" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Go to Login
      </a>
      <a href="/" class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
        Go to Home
      </a>
    </div>
  </div>
</div>
