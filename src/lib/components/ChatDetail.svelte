<script lang="ts">
  import type { ProcessedChat, ChatRequest } from '$lib/types';
  import { format } from 'date-fns';
  import { MessageSquare, AlertCircle, CheckCircle, XCircle } from 'lucide-svelte';
  
  interface Props {
    chat: ProcessedChat;
  }
  
  let { chat }: Props = $props();
  let expanded = $state(false);
</script>

<div class="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
  <button
    onclick={() => expanded = !expanded}
    class="flex-1 flex items-center space-x-2 text-left"
  >
    <MessageSquare class="w-4 h-4 {chat.type === 'axiia' ? 'text-purple-600' : 'text-indigo-600'}" />
    <div class="flex-1">
      <p class="text-sm font-medium">
        {chat.title || (chat.type === 'axiia' ? 'AXIIA Chat' : 'Custom Chat')}
      </p>
      <p class="text-xs text-gray-600">
        {format(new Date(chat.timestamp), 'MMM d, HH:mm:ss')}
      </p>
    </div>
  </button>
  <div class="text-right">
    <p class="text-xs text-gray-600">Input: {chat.inputLength}</p>
    <p class="text-xs text-gray-600">Output: {chat.outputLength}</p>
    {#if chat.requests}
      <p class="text-xs text-gray-600">{chat.requests.length} requests</p>
    {/if}
  </div>
</div>

{#if expanded && chat.requests}
  <div class="mt-2 ml-6 space-y-2">
    {#if chat.systemPrompt}
      <div class="p-3 bg-blue-50 rounded">
        <p class="text-xs font-semibold text-blue-800 mb-1">System Prompt:</p>
        <p class="text-xs text-blue-700 whitespace-pre-wrap">
          {chat.systemPrompt.substring(0, 300)}{chat.systemPrompt.length > 300 ? '...' : ''}
        </p>
      </div>
    {/if}
    
    {#each chat.requests as request, idx}
      <div class="border-l-2 border-gray-200 pl-4">
        <div class="flex items-center justify-between mb-1">
          <p class="text-xs font-semibold text-gray-700">Request {idx + 1}</p>
          <div class="flex items-center space-x-2">
            {#if (request as any).terminatedByUser}
              <span class="text-xs text-orange-600 flex items-center">
                <AlertCircle class="w-3 h-3 mr-1" />
                Terminated
              </span>
            {/if}
            {#if (request as any).upstreamErrored}
              <span class="text-xs text-red-600 flex items-center">
                <XCircle class="w-3 h-3 mr-1" />
                Error
              </span>
            {:else}
              <span class="text-xs text-green-600 flex items-center">
                <CheckCircle class="w-3 h-3 mr-1" />
                Success
              </span>
            {/if}
          </div>
        </div>
        
        <p class="text-xs text-gray-600 mb-1">
          {format(new Date((request as any).timestamp || (request as any).createdAt), 'MMM d, HH:mm:ss')}
        </p>
        
        <div class="space-y-2">
          <div class="p-2 bg-gray-50 rounded">
            <p class="text-xs font-medium text-gray-700 mb-1">Input:</p>
            <p class="text-xs text-gray-600 whitespace-pre-wrap">
              {request.input.substring(0, 200)}{request.input.length > 200 ? '...' : ''}
            </p>
          </div>
          
          <div class="p-2 bg-green-50 rounded">
            <p class="text-xs font-medium text-gray-700 mb-1">Output:</p>
            <p class="text-xs text-gray-600 whitespace-pre-wrap">
              {request.output.substring(0, 200)}{request.output.length > 200 ? '...' : ''}
            </p>
          </div>
          
          {#if request.upstreamRequestId}
            <p class="text-xs text-gray-500">Request ID: {request.upstreamRequestId}</p>
          {/if}
        </div>
      </div>
    {/each}
  </div>
{/if}