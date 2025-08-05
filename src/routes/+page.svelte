<script lang="ts">
  import type { PageData } from './$types';
  import SessionOverview from '$lib/components/SessionOverview.svelte';
  import Timeline from '$lib/components/Timeline.svelte';
  import ProblemCard from '$lib/components/ProblemCard.svelte';
  import ChatActivity from '$lib/components/ChatActivity.svelte';
  import ProblemSetInfo from '$lib/components/ProblemSetInfo.svelte';
  import { AlertCircle } from 'lucide-svelte';
  
  let { data }: { data: PageData } = $props();
  
  const totalSubmissions = $derived(
    data.data ? data.data.problems.reduce((sum, p) => sum + p.submissions.length, 0) : 0
  );
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  {#if data.error || !data.data}
    <div class="bg-red-50 border border-red-200 rounded-lg p-6">
      <div class="flex items-center space-x-3">
        <AlertCircle class="w-6 h-6 text-red-600 flex-shrink-0" />
        <div>
          <h3 class="text-lg font-medium text-red-900">Error Loading Data</h3>
          <p class="text-sm text-red-700 mt-1">
            {data.error || 'Failed to load visualization data'}
          </p>
        </div>
      </div>
    </div>
  {:else}
    <div class="space-y-8">
      <!-- Session Overview -->
      <SessionOverview 
        sessionInfo={data.data.sessionInfo} 
        chatStats={data.data.chatStats}
        {totalSubmissions}
      />
      
      <!-- Problem Set Info -->
      {#if data.data.problemSet}
        <ProblemSetInfo problemSet={data.data.problemSet} />
      {/if}
      
      <!-- Two column layout for Timeline and Chat Activity -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Timeline timeline={data.data.timeline} />
        <ChatActivity problems={data.data.problems} />
      </div>
      
      <!-- Problems Section -->
      <div>
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Problem Details</h2>
        <div class="space-y-6">
          {#each data.data.problems as problem, index}
            <ProblemCard {problem} {index} />
          {/each}
        </div>
      </div>
    </div>
  {/if}
</div>