import Dexie, { type Table } from "dexie";
import type { AnalysisResult, Memory, TopicCluster } from "../types/analysis";
import type { ParsedConversation, ParsedMessage } from "../types/grok-data";

export class GrokDatabase extends Dexie {
  conversations!: Table<ParsedConversation, string>;
  messages!: Table<ParsedMessage, string>;
  analysisCache!: Table<{ key: string; value: string; updatedAt: Date }, string>;
  topicClusters!: Table<TopicCluster, string>;
  memories!: Table<Memory, string>;

  constructor() {
    super("grok-brain-db");
    this.version(1).stores({
      conversations: "id, title, createdAt, starred, language, *models",
      messages: "id, conversationId, sender, createdAt, model",
      analysisCache: "key",
      topicClusters: "id, label",
      memories: "id, type, conversationId, date, confidence",
    });
  }
}

export const db = new GrokDatabase();
