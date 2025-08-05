<script lang="ts">
  import type { ProblemSet } from '$lib/types';
  import { FileText } from 'lucide-svelte';
  
  interface Props {
    problemSet: ProblemSet;
  }
  
  let { problemSet }: Props = $props();
  let expanded = $state(false);
</script>

<div class="bg-white rounded-lg shadow p-6">
  <div class="flex items-center justify-between mb-4">
    <h2 class="text-lg font-semibold text-gray-900 flex items-center">
      <FileText class="w-5 h-5 mr-2 text-gray-600" />
      Problem Set Information
    </h2>
    <button
      onclick={() => expanded = !expanded}
      class="text-sm text-blue-600 hover:text-blue-800"
    >
      {expanded ? 'Collapse' : 'Expand'}
    </button>
  </div>
  
  <div class="text-sm text-gray-600">
    <p>Problem Set ID: {problemSet.id}</p>
    <p>Total Problems: {problemSet.problems.length}</p>
  </div>
  
  {#if expanded}
    <div class="mt-4 space-y-2 border-t pt-4">
      {#each problemSet.problems as problem, index}
        <div class="p-3 bg-gray-50 rounded">
          <p class="text-sm font-medium text-gray-900">
            {index + 1}. {problem.problem_id}
          </p>
          <div class="mt-1 text-xs text-gray-600 space-y-1">
            <p>Version: {problem.problem_version}</p>
            <p>Resolved ID: {problem.resolved_problem_id}</p>
            {#if problem.progress_id}
              <p>Progress ID: {problem.progress_id}</p>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>