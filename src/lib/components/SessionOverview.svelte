<script lang="ts">
  import type { SessionInfo, ChatStats } from '$lib/types';
  import { CheckCircle2, XCircle, MessageSquare, FileText } from 'lucide-svelte';
  
  interface Props {
    sessionInfo: SessionInfo;
    chatStats: ChatStats;
    totalSubmissions: number;
  }
  
  let { sessionInfo, chatStats, totalSubmissions }: Props = $props();
</script>

<div class="bg-white rounded-lg shadow p-6">
  <h2 class="text-lg font-semibold text-gray-900 mb-4">Session Overview</h2>
  
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <div class="bg-gray-50 rounded-lg p-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600">Status</p>
          <p class="text-lg font-semibold text-gray-900">
            {sessionInfo.isComplete ? 'Complete' : 'In Progress'}
          </p>
        </div>
        {#if sessionInfo.isComplete}
          <CheckCircle2 class="w-8 h-8 text-green-500" />
        {:else}
          <XCircle class="w-8 h-8 text-orange-500" />
        {/if}
      </div>
    </div>
    
    <div class="bg-gray-50 rounded-lg p-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600">Total Problems</p>
          <p class="text-lg font-semibold text-gray-900">{sessionInfo.totalProblems}</p>
        </div>
        <FileText class="w-8 h-8 text-blue-500" />
      </div>
    </div>
    
    <div class="bg-gray-50 rounded-lg p-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600">Total Submissions</p>
          <p class="text-lg font-semibold text-gray-900">{totalSubmissions}</p>
        </div>
        <FileText class="w-8 h-8 text-purple-500" />
      </div>
    </div>
    
    <div class="bg-gray-50 rounded-lg p-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600">Total Chats</p>
          <p class="text-lg font-semibold text-gray-900">{chatStats.totalChats}</p>
          <p class="text-xs text-gray-500">{chatStats.totalRequests} requests</p>
        </div>
        <MessageSquare class="w-8 h-8 text-indigo-500" />
      </div>
    </div>
  </div>
  
  <div class="mt-4 text-xs text-gray-500">
    <p>Session ID: {sessionInfo.id}</p>
    {#if sessionInfo.problemSetId}
      <p>Problem Set ID: {sessionInfo.problemSetId}</p>
    {/if}
  </div>
</div>