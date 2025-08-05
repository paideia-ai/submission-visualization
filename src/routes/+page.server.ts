import type { PageServerLoad } from './$types';
import type { 
  VisualizationData, 
  SessionData, 
  TimelineEvent, 
  ProcessedProblem,
  ProcessedChat,
  ProcessedSubmission,
  LabelPredictionStats,
  SnapshotAccuracy,
  ProblemSetItem,
  ChatRequest,
  LabelPredictionPairTest
} from '$lib/types';
import { readFile } from 'fs/promises';
import { join } from 'path';

export const load: PageServerLoad = async () => {
  try {
    // Load the original JSON file from the same directory as the app
    const dataPath = join(process.cwd(), 'lijamie525.json');
    const rawData = await readFile(dataPath, 'utf-8');
    const sessions: SessionData = JSON.parse(rawData);
    
    // Process the first session (assuming single session for now)
    const session = sessions[0];
    if (!session) {
      throw new Error('No session data found');
    }
    
    // Process problems from progresses
    const problems: ProcessedProblem[] = [];
    const timeline: TimelineEvent[] = [];
    let totalChats = 0;
    let totalRequests = 0;
    let axiiaChats = 0;
    let customChats = 0;
    
    // Group progresses by problemId
    const progressesByProblem = new Map<string, typeof session.progresses[0][]>();
    for (const progress of session.progresses) {
      const existing = progressesByProblem.get(progress.problemId) || [];
      existing.push(progress);
      progressesByProblem.set(progress.problemId, existing);
    }
    
    // Process each problem
    for (const [problemId, progresses] of progressesByProblem) {
      // Find the problem metadata from problemSet
      const problemMeta = session.problemSet.problems.find((p: ProblemSetItem) => p.problem_id === problemId);
      
      // Get the earliest progress for createdAt
      const earliestProgress = progresses.reduce((earliest, current) => 
        new Date(current.createdAt) < new Date(earliest.createdAt) ? current : earliest
      );
      
      // Process submissions
      const submissions: ProcessedSubmission[] = [];
      for (const progress of progresses) {
        for (const snapshot of progress.submissionSnapshots) {
          submissions.push({
            id: snapshot.id,
            timestamp: snapshot.timestamp,
            isValid: snapshot.isValid === true || snapshot.isValid === 1,
            hasFeedback: snapshot.feedback !== null,
            text: snapshot.text,
            textId: snapshot.textId,
            feedback: snapshot.feedback,
            textPreview: snapshot.text.substring(0, 100) + (snapshot.text.length > 100 ? '...' : '')
          });
          
          // Add to timeline
          timeline.push({
            type: 'submission',
            problemId,
            timestamp: snapshot.timestamp,
            hasFeedback: snapshot.feedback !== null
          });
          
          if (snapshot.feedback) {
            timeline.push({
              type: 'feedback',
              problemId,
              timestamp: snapshot.feedback.timestamp
            });
          }
        }
      }
      
      // Process chats
      const chats: ProcessedChat[] = [];
      for (const progress of progresses) {
        // Process axiiaChat
        if (progress.axiiaChat) {
          axiiaChats++;
          const chat = progress.axiiaChat.chat;
          totalRequests += chat.chatRequests.length;
          
          chats.push({
            type: 'axiia',
            timestamp: chat.createdAt,
            inputLength: chat.chatRequests.reduce((sum: number, req: ChatRequest) => sum + req.input.length, 0),
            outputLength: chat.chatRequests.reduce((sum: number, req: ChatRequest) => sum + req.output.length, 0),
            systemPrompt: chat.systemPrompt,
            requests: chat.chatRequests
          });
          
          // Add to timeline
          timeline.push({
            type: 'chat',
            problemId,
            timestamp: chat.createdAt,
            chatType: 'axiia'
          });
        }
        
        // Process customChats
        for (const customChat of progress.customChats) {
          customChats++;
          const chat = customChat.chat;
          totalRequests += chat.chatRequests.length;
          
          chats.push({
            type: 'custom',
            title: customChat.title,
            timestamp: chat.createdAt,
            inputLength: chat.chatRequests.reduce((sum: number, req: ChatRequest) => sum + req.input.length, 0),
            outputLength: chat.chatRequests.reduce((sum: number, req: ChatRequest) => sum + req.output.length, 0),
            systemPrompt: chat.systemPrompt,
            requests: chat.chatRequests
          });
          
          // Add to timeline
          timeline.push({
            type: 'chat',
            problemId,
            timestamp: chat.createdAt,
            chatType: 'custom',
            chatTitle: customChat.title
          });
        }
      }
      
      totalChats += chats.length;
      
      // Calculate label prediction stats for thinking-traps problem
      let labelPredictionStats: LabelPredictionStats | undefined;
      if (problemId === '000501-thinking-traps') {
        let totalTests = 0;
        let correctTests = 0;
        
        // Group tests by snapshotId
        const testsBySnapshot = new Map<string, LabelPredictionPairTest[]>();
        
        for (const progress of progresses) {
          for (const test of progress.labelPredictionPairTests) {
            totalTests++;
            if (test.isCorrect) correctTests++;
            
            const existing = testsBySnapshot.get(test.snapshotId) || [];
            existing.push(test);
            testsBySnapshot.set(test.snapshotId, existing);
          }
        }
        
        // Calculate accuracy per snapshot
        const bySnapshot: SnapshotAccuracy[] = [];
        
        for (const [snapshotId, tests] of testsBySnapshot) {
          // Find the corresponding submission snapshot
          let snapshot: ProcessedSubmission | undefined;
          for (const submission of submissions) {
            if (submission.id === snapshotId) {
              snapshot = submission;
              break;
            }
          }
          
          const snapshotCorrect = tests.filter(t => t.isCorrect).length;
          bySnapshot.push({
            snapshotId,
            timestamp: snapshot?.timestamp || '',
            textPreview: snapshot?.textPreview || 'Snapshot not found',
            totalTests: tests.length,
            correctTests: snapshotCorrect,
            accuracy: (snapshotCorrect / tests.length) * 100
          });
        }
        
        // Sort by timestamp
        bySnapshot.sort((a, b) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        
        if (totalTests > 0) {
          labelPredictionStats = {
            totalTests,
            correctTests,
            accuracy: (correctTests / totalTests) * 100,
            bySnapshot
          };
        }
      }
      
      problems.push({
        problemId,
        problemVersion: problemMeta?.problem_version,
        resolvedProblemId: problemMeta?.resolved_problem_id,
        createdAt: earliestProgress.createdAt,
        submissions: submissions.sort((a, b) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        ),
        chats: chats.sort((a, b) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        ),
        labelPredictionStats,
        feedbackReceived: submissions.find(s => s.hasFeedback) ? {
          timestamp: submissions.find(s => s.hasFeedback)!.feedback!.timestamp,
          feedbackText: ''
        } : undefined
      });
    }
    
    // Sort timeline by timestamp
    timeline.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    const visualizationData: VisualizationData = {
      sessionInfo: {
        id: session.id,
        isComplete: session.isComplete === true || session.isComplete === 1,
        totalProblems: session.problemSet.problems.length,
        problemSetId: session.problemSet.id
      },
      problemSet: session.problemSet,
      problems: problems.sort((a, b) => {
        // Sort by the order in the problem set
        const aIndex = session.problemSet.problems.findIndex((p: ProblemSetItem) => p.problem_id === a.problemId);
        const bIndex = session.problemSet.problems.findIndex((p: ProblemSetItem) => p.problem_id === b.problemId);
        return aIndex - bIndex;
      }),
      timeline,
      chatStats: {
        totalChats,
        totalRequests,
        axiiaChats,
        customChats
      }
    };
    
    return {
      data: visualizationData
    };
  } catch (error) {
    console.error('Error loading visualization data:', error);
    return {
      data: null,
      error: `Failed to load visualization data: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};