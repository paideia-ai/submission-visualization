<script lang="ts">
  import type { ProcessedSubmission } from '$lib/types';
  import { format } from 'date-fns';
  import { CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-svelte';
  
  interface Props {
    submission: ProcessedSubmission;
  }
  
  let { submission }: Props = $props();
  let expanded = $state(false);
</script>

<div class="p-3 bg-gray-50 rounded">
  <div class="flex items-start space-x-2">
    <div class="flex-shrink-0">
      {#if submission.isValid}
        <CheckCircle class="w-4 h-4 text-green-500" />
      {:else}
        <XCircle class="w-4 h-4 text-red-500" />
      {/if}
    </div>
    <div class="flex-1 min-w-0">
      <div class="flex items-center justify-between">
        <p class="text-xs text-gray-600">
          {format(new Date(submission.timestamp), 'MMM d, HH:mm:ss')}
        </p>
        <div class="flex items-center space-x-2">
          {#if submission.hasFeedback}
            <span class="text-xs text-green-600 font-medium">Has Feedback</span>
          {/if}
          <button
            onclick={() => expanded = !expanded}
            class="text-xs text-blue-600 hover:text-blue-800 flex items-center"
          >
            {expanded ? 'Show less' : 'Show more'}
            {#if expanded}
              <ChevronUp class="w-3 h-3 ml-1" />
            {:else}
              <ChevronDown class="w-3 h-3 ml-1" />
            {/if}
          </button>
        </div>
      </div>
      
      <div class="mt-1">
        {#if expanded}
          <p class="text-sm text-gray-700 whitespace-pre-wrap">{submission.text}</p>
        {:else}
          <p class="text-sm text-gray-700">
            {submission.text?.substring(0, 200)}{submission.text?.length > 200 ? '...' : ''}
          </p>
        {/if}
      </div>
      
      {#if submission.feedback}
        <div class="mt-3 p-3 bg-yellow-50 rounded">
          <p class="text-sm font-semibold text-gray-700 mb-2">Feedback Evaluation:</p>
          {#each submission.feedback.feedbackMemberships as membership}
            {@const run = membership.run}
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <p class="text-sm font-medium text-gray-700">
                  Overall Rating: <span class="text-lg font-bold text-yellow-700">{JSON.parse(run.extractedFields).overall || 'N/A'}</span>
                </p>
                <p class="text-xs text-gray-600">
                  {format(new Date(run.createdAt), 'MMM d, HH:mm:ss')}
                </p>
              </div>
              
              <div class="p-2 bg-yellow-100 rounded">
                <p class="text-sm text-gray-700 whitespace-pre-wrap">{run.renderedResult}</p>
              </div>
              
              {#if expanded && run.extractedFields}
                <div class="mt-2">
                  <p class="text-xs font-medium text-gray-600">Extracted Fields:</p>
                  <p class="text-sm text-gray-700">{run.extractedFields}</p>
                </div>
              {/if}
              
              <div class="flex items-center justify-between text-xs text-gray-500">
                <span>Request ID: {run.upstreamRequestId}</span>
                {#if run.upstreamErrored}
                  <span class="text-red-600">Error occurred</span>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      {/if}
      
      {#if expanded}
        <div class="mt-2 text-xs text-gray-500">
          <p>Submission ID: {submission.id}</p>
          <p>Text ID: {submission.textId}</p>
        </div>
      {/if}
    </div>
  </div>
</div>