import { analyzeBehavior } from "@/lib/analysis/behavioral-analyzer";
import { analyzeCognitive } from "@/lib/analysis/cognitive-analyzer";
import { extractMemories } from "@/lib/analysis/memory-extractor";
import { analyzeConversationSentiment } from "@/lib/analysis/sentiment-analyzer";
import { extractTopics } from "@/lib/analysis/topic-extractor";
import { analysisConfig } from "@/lib/constants/analysis-config";
import type {
  AnalysisProgress,
  AnalysisResult,
  ConversationSentiment,
  OverviewStats,
} from "@/lib/types/analysis";
import type { ParsedConversation, ParsedMessage } from "@/lib/types/grok-data";

interface WorkerInput {
  type: "analyze";
  conversations: ParsedConversation[];
  messages: ParsedMessage[];
}

function postProgress(phase: AnalysisProgress["phase"], percent: number, message: string): void {
  self.postMessage({ type: "progress", phase, percent, message });
}

function computeOverview(
  conversations: ParsedConversation[],
  messages: ParsedMessage[],
): OverviewStats {
  const humanMsgs = messages.filter((m) => m.sender === "human");
  const assistantMsgs = messages.filter((m) => m.sender === "assistant");

  const dates = conversations
    .map((c) => new Date(c.createdAt).getTime())
    .filter((t) => !Number.isNaN(t));
  const startDate = dates.length > 0 ? new Date(Math.min(...dates)) : new Date();
  const endDate = dates.length > 0 ? new Date(Math.max(...dates)) : new Date();

  const modelsUsed = new Set<string>();
  for (const msg of messages) {
    if (msg.model) modelsUsed.add(msg.model);
  }

  const starredCount = conversations.filter((c) => c.starred).length;
  const avgConversationLength =
    conversations.length > 0 ? messages.length / conversations.length : 0;

  const languageBreakdown: Record<string, number> = {};
  for (const conv of conversations) {
    languageBreakdown[conv.language] = (languageBreakdown[conv.language] ?? 0) + 1;
  }

  return {
    totalConversations: conversations.length,
    totalMessages: messages.length,
    totalHumanMessages: humanMsgs.length,
    totalAssistantMessages: assistantMsgs.length,
    dateRange: { start: startDate, end: endDate },
    modelsUsed: Array.from(modelsUsed),
    starredCount,
    avgConversationLength: Math.round(avgConversationLength * 10) / 10,
    languageBreakdown,
  };
}

self.onmessage = async (e: MessageEvent<WorkerInput>) => {
  if (e.data.type !== "analyze") return;

  const { conversations, messages } = e.data;

  try {
    postProgress("topics", 10, "Extracting topics via TF-IDF clustering...");

    const conversationTexts = conversations.map((c) => {
      const convMessages = messages
        .filter((m) => m.conversationId === c.id)
        .map((m) => m.text)
        .join(" ");
      return { id: c.id, text: convMessages, language: c.language };
    });

    const topics = extractTopics(conversationTexts, analysisConfig.topics);

    postProgress("sentiment", 30, "Analyzing sentiment across conversations...");

    const sentiment: ConversationSentiment[] = [];
    for (let i = 0; i < conversations.length; i++) {
      const conv = conversations[i];
      const convMsgs = messages
        .filter((m) => m.conversationId === conv.id)
        .map((m) => ({ id: m.id, text: m.text, sender: m.sender }));

      sentiment.push(analyzeConversationSentiment(convMsgs, conv.language, conv.id));

      if (i % 30 === 0) {
        const pct = 30 + Math.round((i / conversations.length) * 20);
        postProgress("sentiment", pct, `Sentiment: ${i}/${conversations.length} conversations`);
      }
    }

    postProgress("behavioral", 55, "Computing behavioral patterns...");
    const behavioral = analyzeBehavior(conversations, messages);

    postProgress("cognitive", 70, "Analyzing cognitive patterns...");
    const humanMessages = messages.filter((m) => m.sender === "human");
    const cognitive = analyzeCognitive(humanMessages, topics);

    postProgress("memories", 85, "Extracting memories and facts...");
    const memories = extractMemories(
      humanMessages,
      analysisConfig.memory.maxMemories,
      analysisConfig.memory.minConfidence,
    );

    const overview = computeOverview(conversations, messages);

    const result: AnalysisResult = {
      topics,
      sentiment,
      behavioral,
      cognitive,
      memories,
      overview,
    };

    postProgress("complete", 100, "Analysis complete!");
    self.postMessage({ type: "complete", result });
  } catch (err) {
    self.postMessage({ type: "error", message: (err as Error).message });
  }
};
