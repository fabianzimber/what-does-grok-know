export interface TopicCluster {
  id: string;
  label: string;
  keywords: string[];
  conversationIds: string[];
  size: number;
  color: string;
}

export interface SentimentResult {
  score: number;
  comparative: number;
  positive: string[];
  negative: string[];
}

export interface ConversationSentiment {
  conversationId: string;
  overall: number;
  byMessage: Array<{ messageId: string; score: number }>;
}

export interface BehavioralProfile {
  peakHours: number[];
  peakDays: number[];
  avgSessionLength: number;
  avgMessagesPerConversation: number;
  modelPreferences: Record<string, number>;
  toolUsageRate: number;
  thinkingTraceRate: number;
}

export interface CognitiveProfile {
  vocabularyRichness: number;
  avgMessageLength: number;
  questionRatio: number;
  codeBlockRatio: number;
  topicBreadth: number;
  uniqueWords: number;
  totalWords: number;
}

export interface Memory {
  id: string;
  type: "fact" | "decision" | "learning" | "preference" | "goal";
  content: string;
  source: string;
  conversationId: string;
  date: Date;
  confidence: number;
}

export interface AnalysisResult {
  topics: TopicCluster[];
  sentiment: ConversationSentiment[];
  behavioral: BehavioralProfile;
  cognitive: CognitiveProfile;
  memories: Memory[];
  overview: OverviewStats;
}

export interface OverviewStats {
  totalConversations: number;
  totalMessages: number;
  totalHumanMessages: number;
  totalAssistantMessages: number;
  dateRange: { start: Date; end: Date };
  modelsUsed: string[];
  starredCount: number;
  avgConversationLength: number;
  languageBreakdown: Record<string, number>;
}

export type AnalysisProgress = {
  phase: "parsing" | "topics" | "sentiment" | "behavioral" | "cognitive" | "memories" | "complete";
  percent: number;
  message: string;
};
