import type { AnalysisResult } from "../types/analysis";
import type { ParsedConversation, ParsedMessage } from "../types/grok-data";
import { db } from "./db-schema";

export async function getConversationCount(): Promise<number> {
  return db.conversations.count();
}

export async function getAllConversations(): Promise<ParsedConversation[]> {
  return db.conversations.orderBy("createdAt").reverse().toArray();
}

export async function getConversation(id: string): Promise<ParsedConversation | undefined> {
  return db.conversations.get(id);
}

export async function getMessages(conversationId: string): Promise<ParsedMessage[]> {
  return db.messages.where("conversationId").equals(conversationId).sortBy("createdAt");
}

export async function getAllMessages(): Promise<ParsedMessage[]> {
  return db.messages.toArray();
}

export async function getHumanMessages(): Promise<ParsedMessage[]> {
  return db.messages.where("sender").equals("human").toArray();
}

export async function saveAnalysis(result: AnalysisResult): Promise<void> {
  await db.analysisCache.put({
    key: "latest",
    value: JSON.stringify(result),
    updatedAt: new Date(),
  });
  if (result.topics.length > 0) {
    await db.topicClusters.bulkPut(result.topics);
  }
  if (result.memories.length > 0) {
    await db.memories.bulkPut(result.memories);
  }
}

export async function getAnalysis(): Promise<AnalysisResult | null> {
  const cached = await db.analysisCache.get("latest");
  if (!cached) return null;
  return JSON.parse(cached.value) as AnalysisResult;
}

export async function clearDatabase(): Promise<void> {
  await Promise.all([
    db.conversations.clear(),
    db.messages.clear(),
    db.analysisCache.clear(),
    db.topicClusters.clear(),
    db.memories.clear(),
  ]);
}

export async function hasData(): Promise<boolean> {
  return (await db.conversations.count()) > 0;
}

export async function isDemoData(): Promise<boolean> {
  const first = await db.conversations.orderBy("createdAt").first();
  return first?.title?.startsWith("[Demo]") ?? false;
}
