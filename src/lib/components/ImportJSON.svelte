<script lang="ts">
  import { Upload, X, AlertCircle, CheckCircle, FileJson, RotateCcw } from 'lucide-svelte';
  import { SessionDataSchema } from '$lib/schemas';
  import { useDataStore } from '$lib/stores/dataStore.svelte';
  import { goto, invalidateAll } from '$app/navigation';
  import type { ZodError } from 'zod';
  
  const dataStore = useDataStore();
  
  let showModal = $state(false);
  let isLoading = $state(false);
  let error = $state<string | null>(null);
  let success = $state<string | null>(null);
  let fileInput = $state<HTMLInputElement | null>(null);
  let isDragging = $state(false);
  
  function formatZodError(error: ZodError): string {
    const issues = error.issues.map(issue => {
      const path = issue.path.join('.');
      let message = issue.message;
      
      // Provide more user-friendly messages
      if (issue.code === 'invalid_type') {
        message = `Expected ${issue.expected} but got ${(issue as any).received || 'undefined'}`;
      } else if (message.includes('datetime')) {
        message = 'Invalid datetime format (expected ISO 8601 format like "2024-01-01T12:00:00Z")';
      }
      
      return `• ${path ? `At "${path}": ` : ''}${message}`;
    });
    
    return `Validation failed:\n${issues.join('\n')}`;
  }
  
  async function handleFile(file: File) {
    if (!file) return;
    
    error = null;
    success = null;
    isLoading = true;
    
    try {
      // Read file
      const text = await file.text();
      
      // Parse JSON
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error('Invalid JSON format. Please check your file is valid JSON.');
      }
      
      // Validate with Zod schema
      const validatedData = SessionDataSchema.parse(data);
      
      // Calculate stats for success message
      const totalSessions = validatedData.length;
      const totalProblems = validatedData.reduce((sum, session) => 
        sum + session.progresses.length, 0
      );
      
      // Store the custom data
      dataStore.setCustomData(validatedData, file.name);
      
      success = `Successfully loaded ${totalSessions} session${totalSessions !== 1 ? 's' : ''} with ${totalProblems} problem${totalProblems !== 1 ? 's' : ''}`;
      
      // Reload the page after a short delay
      setTimeout(async () => {
        showModal = false;
        await invalidateAll();
      }, 1500);
      
    } catch (e) {
      if (e instanceof Error) {
        if (e.name === 'ZodError') {
          error = formatZodError(e as ZodError);
        } else {
          error = e.message;
        }
      } else {
        error = 'An unknown error occurred';
      }
    } finally {
      isLoading = false;
      // Reset file input
      if (fileInput) {
        fileInput.value = '';
      }
    }
  }
  
  async function handleFileSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) await handleFile(file);
  }
  
  function handleDragOver(event: DragEvent) {
    event.preventDefault();
    isDragging = true;
  }
  
  function handleDragLeave(event: DragEvent) {
    event.preventDefault();
    isDragging = false;
  }
  
  async function handleDrop(event: DragEvent) {
    event.preventDefault();
    isDragging = false;
    
    const file = event.dataTransfer?.files[0];
    if (file && file.type === 'application/json') {
      await handleFile(file);
    } else if (file) {
      error = 'Please upload a JSON file';
    }
  }
  
  async function handleReset() {
    dataStore.resetToDefault();
    showModal = false;
    await invalidateAll();
  }
</script>

<!-- Import Button in Header -->
<div class="flex items-center gap-2">
  {#if dataStore.isCustomData}
    <div class="flex items-center gap-2 text-sm">
      <FileJson class="w-4 h-4 text-blue-600" />
      <span class="text-gray-600">Using: {dataStore.fileName}</span>
      <button
        onclick={handleReset}
        class="inline-flex items-center gap-1 px-2 py-1 text-sm text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100 transition-colors"
      >
        <RotateCcw class="w-3 h-3" />
        Reset
      </button>
    </div>
  {/if}
  
  <button
    onclick={() => showModal = true}
    class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
  >
    <Upload class="w-4 h-4" />
    Import JSON
  </button>
</div>

<!-- Modal -->
{#if showModal}
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex min-h-screen items-center justify-center p-4">
      <!-- Backdrop -->
      <button 
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        onclick={() => showModal = false}
        aria-label="Close modal"
      ></button>
      
      <!-- Modal Content -->
      <div class="relative bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
        <!-- Close Button -->
        <button
          onclick={() => showModal = false}
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
        >
          <X class="w-5 h-5" />
        </button>
        
        <!-- Modal Header -->
        <div class="mb-6">
          <h3 class="text-lg font-medium text-gray-900">Import JSON Data</h3>
          <p class="mt-1 text-sm text-gray-500">
            Upload a JSON file that matches the required schema for visualization.
          </p>
        </div>
        
        <!-- File Upload Area -->
        <div class="mb-6">
          <label
            for="file-upload"
            class="relative cursor-pointer rounded-lg border-2 border-dashed p-6 hover:border-gray-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 block transition-colors {isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}"
            ondragover={handleDragOver}
            ondragleave={handleDragLeave}
            ondrop={handleDrop}
          >
            <div class="text-center">
              <FileJson class="mx-auto h-12 w-12 {isDragging ? 'text-blue-600' : 'text-gray-400'}" />
              <div class="mt-2">
                <span class="text-sm font-medium text-blue-600 hover:text-blue-500">
                  Click to upload
                </span>
                <span class="text-sm text-gray-500"> or drag and drop</span>
              </div>
              <p class="text-xs text-gray-500 mt-1">JSON files only</p>
            </div>
            <input
              bind:this={fileInput}
              id="file-upload"
              name="file-upload"
              type="file"
              accept=".json,application/json"
              class="sr-only"
              onchange={handleFileSelect}
              disabled={isLoading}
            />
          </label>
        </div>
        
        <!-- Loading State -->
        {#if isLoading}
          <div class="mb-4 p-4 bg-blue-50 rounded-lg">
            <div class="flex items-center">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              <span class="text-sm text-blue-700">Validating JSON file...</span>
            </div>
          </div>
        {/if}
        
        <!-- Error Message -->
        {#if error}
          <div class="mb-4 p-4 bg-red-50 rounded-lg">
            <div class="flex items-start">
              <AlertCircle class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div class="ml-3">
                <h4 class="text-sm font-medium text-red-900">Validation Error</h4>
                <pre class="mt-1 text-sm text-red-700 whitespace-pre-wrap font-mono text-xs">{error}</pre>
              </div>
            </div>
          </div>
        {/if}
        
        <!-- Success Message -->
        {#if success}
          <div class="mb-4 p-4 bg-green-50 rounded-lg">
            <div class="flex items-center">
              <CheckCircle class="w-5 h-5 text-green-600 flex-shrink-0" />
              <div class="ml-3">
                <p class="text-sm font-medium text-green-900">{success}</p>
              </div>
            </div>
          </div>
        {/if}
        
        <!-- Schema Requirements -->
        <div class="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 class="text-sm font-medium text-gray-900 mb-2">Schema Requirements</h4>
          <ul class="text-xs text-gray-600 space-y-1">
            <li>• Array of session objects at root level</li>
            <li>• Each session must have: id, isComplete, problemSet, progresses</li>
            <li>• Progresses must contain: axiiaChat, submissionSnapshots, customChats</li>
            <li>• All timestamps must be in ISO 8601 format</li>
            <li>• Boolean fields can be true/false or 1/0</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
{/if}