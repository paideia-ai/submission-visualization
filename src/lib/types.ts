// Re-export types from the corrected zod schema
import type { z } from 'zod';

// Import the schemas
import {
  SessionDataSchema,
  SessionSchema,
  ProgressSchema,
  SubmissionSnapshotSchema,
  FeedbackSchema,
  FeedbackMembershipSchema,
  FeedbackRunSchema,
  CustomChatSchema,
  AxiiaChatSchema,
  ChatSchema,
  ChatRequestSchema,
  ProblemSetSchema,
  ProblemSetItemSchema,
  LabelPredictionPairTestSchema,
  LabelPredictionPairSchema
} from '../../zod_schema_corrected';

// Infer types from schemas
export type SessionData = z.infer<typeof SessionDataSchema>;
export type Session = z.infer<typeof SessionSchema>;
export type Progress = z.infer<typeof ProgressSchema>;
export type SubmissionSnapshot = z.infer<typeof SubmissionSnapshotSchema>;
export type Feedback = z.infer<typeof FeedbackSchema>;
export type FeedbackMembership = z.infer<typeof FeedbackMembershipSchema>;
export type FeedbackRun = z.infer<typeof FeedbackRunSchema>;
export type CustomChat = z.infer<typeof CustomChatSchema>;
export type AxiiaChat = z.infer<typeof AxiiaChatSchema>;
export type Chat = z.infer<typeof ChatSchema>;
export type ChatRequest = z.infer<typeof ChatRequestSchema>;
export type ProblemSet = z.infer<typeof ProblemSetSchema>;
export type ProblemSetItem = z.infer<typeof ProblemSetItemSchema>;
export type LabelPredictionPairTest = z.infer<typeof LabelPredictionPairTestSchema>;
export type LabelPredictionPair = z.infer<typeof LabelPredictionPairSchema>;

// Additional types for the visualization
export interface SessionInfo {
  id: string;
  isComplete: boolean;
  totalProblems: number;
  problemSetId?: string;
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

export interface SnapshotAccuracy {
  snapshotId: string;
  timestamp: string;
  textPreview: string;
  totalTests: number;
  correctTests: number;
  accuracy: number;
}

export interface LabelPredictionStats {
  totalTests: number;
  correctTests: number;
  accuracy: number;
  bySnapshot: SnapshotAccuracy[];
}

export interface ProcessedProblem {
  problemId: string;
  problemVersion?: number;
  resolvedProblemId?: string;
  createdAt: string;
  submissions: ProcessedSubmission[];
  chats: ProcessedChat[];
  labelPredictionStats?: LabelPredictionStats;
  feedbackReceived?: {
    timestamp: string;
    feedbackText: string;
  };
}

export interface ProcessedSubmission {
  id: string;
  timestamp: string;
  isValid: boolean;
  hasFeedback: boolean;
  text: string;
  textId: string;
  feedback: Feedback | null;
  textPreview?: string;
}

export interface ProcessedChat {
  type: 'axiia' | 'custom';
  title?: string;
  timestamp: string;
  inputLength: number;
  outputLength: number;
  systemPrompt?: string;
  requests?: ChatRequest[];
}

export interface VisualizationData {
  sessionInfo: SessionInfo;
  problemSet?: ProblemSet;
  problems: ProcessedProblem[];
  timeline: TimelineEvent[];
  chatStats: ChatStats;
}