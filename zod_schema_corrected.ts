// Corrected Zod Schema (TypeScript) - Complete version

import { z } from 'zod';

const ProblemSetItemSchema = z.object({
  problem_id: z.string(),
  progress_id: z.string().nullable(),
  problem_version: z.number(),
  resolved_problem_id: z.string()
});

const ProblemSetSchema = z.object({
  id: z.string(),
  problems: z.array(ProblemSetItemSchema),
  expireMinutes: z.number().nullable()
});

const ChatRequestSchema = z.object({
  id: z.string(),
  chatId: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  input: z.string(),
  output: z.string(),
  streamingId: z.string().nullable(),
  upstreamRequestId: z.string().nullable(), // CORRECTED: Can be null
  upstreamErrored: z.union([z.boolean(), z.number()]), // Can be boolean or 0/1
  terminatedByUser: z.union([z.boolean(), z.number()])
});

const ChatSchema = z.object({
  id: z.string(),
  createdAt: z.string().datetime(),
  systemPrompt: z.string(),
  chatRequests: z.array(ChatRequestSchema)
});

const AxiiaChatSchema = z.object({
  id: z.string(),
  chat: ChatSchema
});

const CustomChatSchema = z.object({
  id: z.string(),
  progressId: z.string(),
  title: z.string(),
  sourcePresetId: z.string().nullable(),
  chat: ChatSchema
});

const FeedbackRunSchema = z.object({
  id: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  problemId: z.string(),
  problemVersion: z.number(),
  submissionTextId: z.string(),
  output: z.string(),
  taskObservationId: z.string().nullable(),
  upstreamRequestId: z.string(),
  upstreamErrored: z.union([z.boolean(), z.number()]),
  terminatedByUser: z.union([z.boolean(), z.number()]),
  extractedFields: z.string(), // JSON string
  renderedResult: z.string()
});

const FeedbackMembershipSchema = z.object({
  id: z.number(),
  runId: z.string(),
  feedbackId: z.string(),
  run: FeedbackRunSchema
});

const FeedbackSchema = z.object({
  id: z.string(),
  timestamp: z.string().datetime(),
  snapshotId: z.string(),
  feedbackMemberships: z.array(FeedbackMembershipSchema)
});

const SubmissionSnapshotSchema = z.object({
  id: z.string(),
  timestamp: z.string().datetime(),
  isValid: z.union([z.boolean(), z.number()]),
  progressId: z.string(),
  textId: z.string(),
  text: z.string(),
  feedback: FeedbackSchema.nullable()
});

// NEW: Schema for labelPredictionPairTests
const LabelPredictionPairSchema = z.object({
  id: z.string(),
  problemId: z.string(),
  groupName: z.string(),
  name: z.string(),
  version: z.number(),
  input: z.string(),
  output: z.string()
});

const LabelPredictionPairTestSchema = z.object({
  id: z.string(),
  timestamp: z.string().datetime(),
  progressId: z.string(),
  snapshotId: z.string(),
  pairId: z.string(),
  upstreamRequestId: z.string(),
  output: z.string(),
  extractedOutput: z.string().nullable(), // Can be null based on the data
  isCorrect: z.boolean(),
  pair: LabelPredictionPairSchema
});

const ProgressSchema = z.object({
  id: z.string(),
  problemId: z.string(),
  createdAt: z.string().datetime(),
  labelPredictionBatchTestUnlocked: z.boolean().nullable(),
  axiiaChat: AxiiaChatSchema.nullable(),
  submissionSnapshots: z.array(SubmissionSnapshotSchema),
  customChats: z.array(CustomChatSchema),
  labelPredictionPairTests: z.array(LabelPredictionPairTestSchema) // NEW FIELD
});

const SessionSchema = z.object({
  id: z.string(),
  isComplete: z.union([z.boolean(), z.number()]), // Can be true/false or 1/0
  problemSet: ProblemSetSchema,
  progresses: z.array(ProgressSchema)
});

// Root schema - array of sessions
const SessionDataSchema = z.array(SessionSchema);

// Type inference
type ProblemSetItem = z.infer<typeof ProblemSetItemSchema>;
type ProblemSet = z.infer<typeof ProblemSetSchema>;
type ChatRequest = z.infer<typeof ChatRequestSchema>;
type Chat = z.infer<typeof ChatSchema>;
type AxiiaChat = z.infer<typeof AxiiaChatSchema>;
type CustomChat = z.infer<typeof CustomChatSchema>;
type FeedbackRun = z.infer<typeof FeedbackRunSchema>;
type FeedbackMembership = z.infer<typeof FeedbackMembershipSchema>;
type Feedback = z.infer<typeof FeedbackSchema>;
type SubmissionSnapshot = z.infer<typeof SubmissionSnapshotSchema>;
type LabelPredictionPair = z.infer<typeof LabelPredictionPairSchema>;
type LabelPredictionPairTest = z.infer<typeof LabelPredictionPairTestSchema>;
type Progress = z.infer<typeof ProgressSchema>;
type Session = z.infer<typeof SessionSchema>;
type SessionData = z.infer<typeof SessionDataSchema>;

export {
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
};

export type {
  SessionData,
  Session,
  Progress,
  SubmissionSnapshot,
  Feedback,
  FeedbackMembership,
  FeedbackRun,
  CustomChat,
  AxiiaChat,
  Chat,
  ChatRequest,
  ProblemSet,
  ProblemSetItem,
  LabelPredictionPairTest,
  LabelPredictionPair
};