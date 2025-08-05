<script lang="ts">
  import type { ProcessedProblem } from '$lib/types';
  import { format } from 'date-fns';
  import { FileText, MessageSquare, CheckCircle, XCircle, Target } from 'lucide-svelte';
  import ChatDetail from './ChatDetail.svelte';
  import SubmissionDetail from './SubmissionDetail.svelte';
  
  interface Props {
    problem: ProcessedProblem;
    index: number;
  }
  
  let { problem, index }: Props = $props();
  let expanded = $state(false);
  
  const validSubmissions = $derived(problem.submissions.filter(s => s.isValid).length);
  const submissionsWithFeedback = $derived(problem.submissions.filter(s => s.hasFeedback).length);
</script>

<div class="bg-white rounded-lg shadow p-6">
  <div class="flex items-center justify-between mb-4">
    <div>
      <h3 class="text-lg font-semibold text-gray-900">
        Problem {index + 1}: {problem.problemId}
      </h3>
      {#if problem.problemVersion}
        <p class="text-sm text-gray-600">Version {problem.problemVersion}</p>
      {/if}
      {#if problem.resolvedProblemId}
        <p class="text-xs text-gray-500">ID: {problem.resolvedProblemId}</p>
      {/if}
    </div>
    <button
      onclick={() => expanded = !expanded}
      class="text-sm text-blue-600 hover:text-blue-800"
    >
      {expanded ? 'Collapse' : 'Expand'}
    </button>
  </div>
  
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
    <div>
      <p class="text-sm text-gray-600">Created At</p>
      <p class="text-sm font-medium">{format(new Date(problem.createdAt), 'MMM d, HH:mm')}</p>
    </div>
    <div>
      <p class="text-sm text-gray-600">Submissions</p>
      <p class="text-sm font-medium">{problem.submissions.length} ({validSubmissions} valid)</p>
    </div>
    <div>
      <p class="text-sm text-gray-600">With Feedback</p>
      <p class="text-sm font-medium">{submissionsWithFeedback}</p>
    </div>
    <div>
      <p class="text-sm text-gray-600">Chats</p>
      <p class="text-sm font-medium">{problem.chats.length}</p>
    </div>
  </div>
  
  {#if problem.feedbackReceived}
    <div class="mb-4 p-3 bg-green-50 rounded-lg">
      <p class="text-sm font-medium text-green-800">Feedback Received</p>
      <p class="text-xs text-green-600">
        {format(new Date(problem.feedbackReceived.timestamp), 'MMM d, HH:mm:ss')}
      </p>
    </div>
  {/if}
  
  {#if problem.labelPredictionStats}
    <div class="mb-4 p-3 bg-blue-50 rounded-lg">
      <p class="text-sm font-medium text-blue-800 flex items-center gap-2">
        <Target class="w-4 h-4" />
        Label Prediction Test Results
      </p>
      <div class="mt-2 grid grid-cols-3 gap-2 text-xs">
        <div>
          <p class="text-blue-600">Total Tests</p>
          <p class="font-semibold text-blue-900">{problem.labelPredictionStats.totalTests}</p>
        </div>
        <div>
          <p class="text-blue-600">Correct</p>
          <p class="font-semibold text-blue-900">{problem.labelPredictionStats.correctTests}</p>
        </div>
        <div>
          <p class="text-blue-600">Accuracy</p>
          <p class="font-semibold text-blue-900">{problem.labelPredictionStats.accuracy.toFixed(1)}%</p>
        </div>
      </div>
    </div>
  {/if}
  
  {#if expanded}
    <div class="space-y-4 border-t pt-4">
      <div>
        <h4 class="text-sm font-semibold text-gray-700 mb-2">Submissions</h4>
        <div class="space-y-2">
          {#each problem.submissions as submission}
            <SubmissionDetail {submission} />
          {/each}
        </div>
      </div>
      
      {#if problem.chats.length > 0}
        <div>
          <h4 class="text-sm font-semibold text-gray-700 mb-2">Chat Sessions</h4>
          <div class="space-y-2">
            {#each problem.chats as chat}
              <ChatDetail {chat} />
            {/each}
          </div>
        </div>
      {/if}
    </div>
  {/if}
</div>