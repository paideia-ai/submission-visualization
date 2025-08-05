<script lang="ts">
  import type { TimelineEvent } from '$lib/types';
  import { format } from 'date-fns';
  import { FileText, MessageSquare, Award } from 'lucide-svelte';
  
  interface Props {
    timeline: TimelineEvent[];
  }
  
  let { timeline }: Props = $props();
  
  function getEventIcon(event: TimelineEvent) {
    switch (event.type) {
      case 'submission':
        return FileText;
      case 'chat':
        return MessageSquare;
      case 'feedback':
        return Award;
      default:
        return FileText;
    }
  }
  
  function getEventColor(event: TimelineEvent) {
    switch (event.type) {
      case 'submission':
        return event.hasFeedback ? 'text-green-600' : 'text-blue-600';
      case 'chat':
        return event.chatType === 'axiia' ? 'text-purple-600' : 'text-indigo-600';
      case 'feedback':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  }
  
  function getEventLabel(event: TimelineEvent) {
    switch (event.type) {
      case 'submission':
        return event.hasFeedback ? 'Submission (with feedback)' : 'Submission';
      case 'chat':
        return event.chatTitle || (event.chatType === 'axiia' ? 'AXIIA Chat' : 'Custom Chat');
      case 'feedback':
        return 'Feedback Received';
      default:
        return 'Event';
    }
  }
</script>

<div class="bg-white rounded-lg shadow p-6">
  <h2 class="text-lg font-semibold text-gray-900 mb-4">Timeline</h2>
  
  <div class="space-y-4 max-h-96 overflow-y-auto">
    {#each timeline as event, i}
      <div class="flex items-start space-x-3">
        <div class="flex-shrink-0">
          <div class="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
            <svelte:component this={getEventIcon(event)} class="w-5 h-5 {getEventColor(event)}" />
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between">
            <p class="text-sm font-medium text-gray-900">
              {getEventLabel(event)}
            </p>
            <span class="text-xs text-gray-500">
              {format(new Date(event.timestamp), 'MMM d, HH:mm:ss')}
            </span>
          </div>
          <p class="text-sm text-gray-500">
            Problem: {event.problemId}
          </p>
        </div>
      </div>
      {#if i < timeline.length - 1}
        <div class="ml-5 border-l-2 border-gray-200 h-4"></div>
      {/if}
    {/each}
  </div>
</div>