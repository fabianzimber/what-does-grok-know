import type { CognitiveProfile } from "@/lib/types/analysis";
import type { TopicCluster } from "@/lib/types/analysis";
import type { ParsedMessage } from "@/lib/types/grok-data";
import { tokenize } from "./text-utils";

export function analyzeCognitive(
  humanMessages: ParsedMessage[],
  topicClusters: TopicCluster[],
): CognitiveProfile {
  if (humanMessages.length === 0) {
    return {
      vocabularyRichness: 0,
      avgMessageLength: 0,
      questionRatio: 0,
      codeBlockRatio: 0,
      topicBreadth: 0,
      uniqueWords: 0,
      totalWords: 0,
    };
  }

  const allTokens: string[] = [];
  const uniqueTokens = new Set<string>();
  let totalCharacters = 0;
  let questionCount = 0;
  let codeBlockCount = 0;

  for (const msg of humanMessages) {
    const tokens = tokenize(msg.text);
    for (const t of tokens) {
      allTokens.push(t);
      uniqueTokens.add(t);
    }
    totalCharacters += msg.text.length;
    if (msg.text.includes("?")) questionCount++;
    if (msg.text.includes("```")) codeBlockCount++;
  }

  const totalWords = allTokens.length;
  const uniqueWords = uniqueTokens.size;
  const vocabularyRichness = totalWords > 0 ? uniqueWords / totalWords : 0;
  const avgMessageLength = totalCharacters / humanMessages.length;
  const questionRatio = questionCount / humanMessages.length;
  const codeBlockRatio = codeBlockCount / humanMessages.length;

  const userConversationIds = new Set(humanMessages.map((m) => m.conversationId));
  const engagedClusters = new Set<string>();
  for (const cluster of topicClusters) {
    for (const convId of cluster.conversationIds) {
      if (userConversationIds.has(convId)) {
        engagedClusters.add(cluster.id);
        break;
      }
    }
  }
  const topicBreadth = engagedClusters.size;

  return {
    vocabularyRichness: Math.round(vocabularyRichness * 10000) / 10000,
    avgMessageLength: Math.round(avgMessageLength * 10) / 10,
    questionRatio: Math.round(questionRatio * 1000) / 1000,
    codeBlockRatio: Math.round(codeBlockRatio * 1000) / 1000,
    topicBreadth,
    uniqueWords,
    totalWords,
  };
}
