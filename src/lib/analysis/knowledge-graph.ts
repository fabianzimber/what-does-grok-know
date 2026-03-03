import type { ParsedMessage } from "@/lib/types/grok-data";

export interface KnowledgeNode {
  id: string;
  label: string;
  weight: number;
}

export interface KnowledgeEdge {
  source: string;
  target: string;
  weight: number;
}

export interface KnowledgeGraph {
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
}

const SKIP_WORDS = new Set([
  "the",
  "this",
  "that",
  "these",
  "those",
  "here",
  "there",
  "where",
  "when",
  "what",
  "which",
  "who",
  "how",
  "why",
  "can",
  "could",
  "would",
  "should",
  "will",
  "shall",
  "may",
  "might",
  "must",
  "have",
  "has",
  "had",
  "been",
  "being",
  "also",
  "just",
  "very",
  "then",
  "than",
  "with",
  "from",
  "into",
  "over",
  "after",
  "before",
  "between",
  "through",
  "about",
  "some",
  "any",
  "each",
  "every",
  "most",
  "other",
  "another",
  "such",
  "only",
  "same",
  "but",
  "and",
  "for",
  "not",
  "all",
  "are",
  "was",
  "were",
  "der",
  "die",
  "das",
  "und",
  "ist",
  "ich",
  "sie",
  "wir",
  "yes",
  "yeah",
  "sure",
  "okay",
  "thanks",
  "thank",
  "please",
  "hello",
  "hey",
  "well",
  "now",
  "let",
  "try",
  "see",
  "get",
]);

function extractEntities(text: string): string[] {
  const entities: string[] = [];
  const cleaned = text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]+`/g, " ")
    .replace(/https?:\/\/\S+/g, " ");

  const capitalizedPattern = /\b([A-Z][a-zA-Z]{2,}(?:\s+[A-Z][a-zA-Z]+)*)\b/g;
  let match: RegExpExecArray | null;
  match = capitalizedPattern.exec(cleaned);
  while (match !== null) {
    const entity = match[1].trim();
    if (!SKIP_WORDS.has(entity.toLowerCase()) && entity.length > 2) {
      entities.push(entity);
    }
    match = capitalizedPattern.exec(cleaned);
  }

  const techPattern = /\b([A-Z][a-z]+(?:[A-Z][a-z]+)+|[a-z]+(?:-[a-z]+){1,})\b/g;
  match = techPattern.exec(cleaned);
  while (match !== null) {
    entities.push(match[1]);
    match = techPattern.exec(cleaned);
  }

  return entities;
}

function normalizeEntity(entity: string): string {
  return entity.trim();
}

export function buildKnowledgeGraph(
  messages: ParsedMessage[],
  maxNodes = 100,
  maxEdges = 200,
): KnowledgeGraph {
  const conversationMessages = new Map<string, ParsedMessage[]>();
  for (const msg of messages) {
    if (!conversationMessages.has(msg.conversationId)) {
      conversationMessages.set(msg.conversationId, []);
    }
    conversationMessages.get(msg.conversationId)?.push(msg);
  }

  const entityCount = new Map<string, number>();
  const coOccurrence = new Map<string, number>();

  for (const [, msgs] of conversationMessages) {
    const convText = msgs.map((m) => m.text).join(" ");
    const entities = extractEntities(convText);
    const uniqueEntities = [...new Set(entities.map(normalizeEntity))];

    for (const entity of uniqueEntities) {
      entityCount.set(entity, (entityCount.get(entity) ?? 0) + 1);
    }

    for (let i = 0; i < uniqueEntities.length; i++) {
      for (let j = i + 1; j < uniqueEntities.length; j++) {
        const pair = [uniqueEntities[i], uniqueEntities[j]].sort().join("|||");
        coOccurrence.set(pair, (coOccurrence.get(pair) ?? 0) + 1);
      }
    }
  }

  const sortedEntities = Array.from(entityCount.entries())
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxNodes);

  const nodeSet = new Set(sortedEntities.map(([e]) => e));
  const maxCount = sortedEntities.length > 0 ? sortedEntities[0][1] : 1;

  const nodes: KnowledgeNode[] = sortedEntities.map(([entity, count]) => ({
    id: entity,
    label: entity,
    weight: count / maxCount,
  }));

  const edges: KnowledgeEdge[] = [];
  const sortedPairs = Array.from(coOccurrence.entries())
    .filter(([pair]) => {
      const [a, b] = pair.split("|||");
      return nodeSet.has(a) && nodeSet.has(b);
    })
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxEdges);

  const maxEdgeWeight = sortedPairs.length > 0 ? sortedPairs[0][1] : 1;

  for (const [pair, count] of sortedPairs) {
    const [source, target] = pair.split("|||");
    edges.push({ source, target, weight: count / maxEdgeWeight });
  }

  return { nodes, edges };
}
