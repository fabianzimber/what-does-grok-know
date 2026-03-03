import { analysisConfig } from "@/lib/constants/analysis-config";
import type { ConversationSentiment, TopicCluster } from "@/lib/types/analysis";
import type { ParsedConversation } from "@/lib/types/grok-data";
import type { BrainEdge, BrainGraph, BrainNode } from "@/lib/types/visualization";
import { computeGraphLayout } from "./graph-layout";

const { nodeMinSize, nodeMaxSize, maxEdges } = analysisConfig.brain;

function normalizeSize(messageCount: number, minCount: number, maxCount: number): number {
  if (maxCount === minCount) return (nodeMinSize + nodeMaxSize) / 2;
  const t = (messageCount - minCount) / (maxCount - minCount);
  return nodeMinSize + t * (nodeMaxSize - nodeMinSize);
}

function findClusterForConversation(
  conversationId: string,
  clusters: TopicCluster[],
): TopicCluster | undefined {
  return clusters.find((c) => c.conversationIds.includes(conversationId));
}

function computeTopicOverlap(
  clusterA: TopicCluster | undefined,
  clusterB: TopicCluster | undefined,
): number {
  if (!clusterA || !clusterB) return 0;
  if (clusterA.id === clusterB.id) return 1.0;

  const setA = new Set(clusterA.keywords);
  const setB = new Set(clusterB.keywords);
  let shared = 0;
  for (const kw of setA) {
    if (setB.has(kw)) shared++;
  }
  const union = new Set([...clusterA.keywords, ...clusterB.keywords]).size;
  return union > 0 ? shared / union : 0;
}

/**
 * Build the top-N similarity edges from conversations using shared
 * cluster membership and keyword overlap (Jaccard similarity).
 */
function buildEdges(
  conversations: ParsedConversation[],
  clusters: TopicCluster[],
  limit: number,
): BrainEdge[] {
  const clusterLookup = new Map<string, TopicCluster>();
  for (const conv of conversations) {
    const cluster = findClusterForConversation(conv.id, clusters);
    if (cluster) clusterLookup.set(conv.id, cluster);
  }

  const candidates: BrainEdge[] = [];
  for (let i = 0; i < conversations.length; i++) {
    for (let j = i + 1; j < conversations.length; j++) {
      const a = conversations[i];
      const b = conversations[j];
      const cA = clusterLookup.get(a.id);
      const cB = clusterLookup.get(b.id);
      const weight = computeTopicOverlap(cA, cB);
      if (weight > 0) {
        candidates.push({ source: a.id, target: b.id, weight });
      }
    }
  }

  candidates.sort((a, b) => b.weight - a.weight);
  return candidates.slice(0, limit);
}

/**
 * Converts parsed conversations, topic clusters, and sentiment data
 * into a BrainGraph suitable for 3D rendering.
 */
export function buildBrainGraph(
  conversations: ParsedConversation[],
  clusters: TopicCluster[],
  sentiments: ConversationSentiment[],
): BrainGraph {
  if (conversations.length === 0) {
    return { nodes: [], edges: [], clusters };
  }

  const sentimentMap = new Map<string, number>();
  for (const s of sentiments) {
    sentimentMap.set(s.conversationId, s.overall);
  }

  const messageCounts = conversations.map((c) => c.messageCount);
  const minCount = Math.min(...messageCounts);
  const maxCount = Math.max(...messageCounts);

  const fallbackClusterId = clusters[0]?.id ?? "uncategorized";
  const fallbackColor = clusters[0]?.color ?? "#9ca3af";

  // Prepare layout nodes
  const layoutNodes = conversations.map((conv) => {
    const cluster = findClusterForConversation(conv.id, clusters);
    return {
      id: conv.id,
      clusterId: cluster?.id ?? fallbackClusterId,
    };
  });

  const positions = computeGraphLayout(layoutNodes);

  const nodes: BrainNode[] = conversations.map((conv, i) => {
    const cluster = findClusterForConversation(conv.id, clusters);
    return {
      id: conv.id,
      position: positions[i] ?? [0, 0, 0],
      size: normalizeSize(conv.messageCount, minCount, maxCount),
      color: cluster?.color ?? fallbackColor,
      clusterId: cluster?.id ?? fallbackClusterId,
      conversationId: conv.id,
      title: conv.title,
      messageCount: conv.messageCount,
      sentiment: sentimentMap.get(conv.id) ?? 0,
      date: conv.createdAt,
    };
  });

  const edges = buildEdges(conversations, clusters, maxEdges);

  return { nodes, edges, clusters };
}
