export interface SessionInfo {
  id: string;
  isComplete: boolean;
  totalProblems: number;
  problemSetId?: string;
}

export interface ProblemSetItem {
  problem_id: string;
  progress_id: string | null;
  problem_version: number;
  resolved_problem_id: string;
}

export interface ProblemSet {
  id: string;
  problems: ProblemSetItem[];
}

export interface FeedbackRun {
  id: string;
  createdAt: string;
  updatedAt: string;
  output: string;
  extractedFields: {
    overall: string;
  };
  renderedResult: string;
  upstreamRequestId: string;
  upstreamErrored: boolean;
  parsedFeedback: {
    criteria_scores: Record<string, any>;
    overall: string;
    analysis: string | null;
  };
}

export interface Feedback {
  id: string;
  timestamp: string;
  runs: FeedbackRun[];
}

export interface Submission {
  id: string;
  timestamp: string;
  isValid: boolean;
  hasFeedback: boolean;
  text: string;
  textId: string;
  feedback: Feedback | null;
  textPreview?: string;
}

export interface ChatRequest {
  id: string;
  timestamp: string;
  input: string;
  output: string;
  terminated: boolean;
  errored: boolean;
  upstreamRequestId: string | null;
}

export interface Chat {
  type: 'axiia' | 'custom';
  title?: string;
  timestamp: string;
  inputLength: number;
  outputLength: number;
  systemPrompt?: string;
  requests?: ChatRequest[];
}

export interface Problem {
  problemId: string;
  problemVersion?: number;
  resolvedProblemId?: string;
  createdAt: string;
  submissions: Submission[];
  chats: Chat[];
  feedbackReceived?: {
    timestamp: string;
    feedbackText: string;
  };
}

export interface TimelineEvent {
  type: 'submission' | 'chat' | 'feedback';
  problemId: string;
  timestamp: string;
  hasFeedback?: boolean;
  chatType?: 'axiia' | 'custom';
  chatTitle?: string;
}

export interface ChatStats {
  totalChats: number;
  totalRequests: number;
  axiiaChats: number;
  customChats: number;
}

export interface VisualizationData {
  sessionInfo: SessionInfo;
  problemSet?: ProblemSet;
  problems: Problem[];
  timeline: TimelineEvent[];
  chatStats: ChatStats;
}