import type { TopicCluster } from "@/lib/types/analysis";
import { getCleanTokens } from "./text-utils";

const CLUSTER_COLORS = [
  "#e63946",
  "#457b9d",
  "#2a9d8f",
  "#e9c46a",
  "#f4a261",
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#06b6d4",
  "#ec4899",
  "#84cc16",
];

interface TopicConfig {
  maxClusters: number;
  minClusterSize: number;
  tfidfMinScore: number;
  maxKeywordsPerCluster: number;
}

interface DocumentInput {
  id: string;
  text: string;
  language?: "en" | "de" | "mixed";
}

export function computeTFIDF(documents: string[][]): Map<string, number[]> {
  const vocab = new Map<string, number>();
  const docFreq = new Map<string, number>();

  for (const doc of documents) {
    const seen = new Set<string>();
    for (const token of doc) {
      if (!vocab.has(token)) vocab.set(token, vocab.size);
      if (!seen.has(token)) {
        docFreq.set(token, (docFreq.get(token) ?? 0) + 1);
        seen.add(token);
      }
    }
  }

  const N = documents.length;
  const result = new Map<string, number[]>();

  for (const [term, idx] of vocab) {
    const df = docFreq.get(term) ?? 1;
    const idf = Math.log(1 + N / df);
    const scores = new Array<number>(N).fill(0);

    for (let d = 0; d < N; d++) {
      const doc = documents[d];
      const termCount = doc.filter((t) => t === term).length;
      const tf = doc.length > 0 ? termCount / doc.length : 0;
      scores[d] = tf * idf;
    }

    result.set(term, scores);
  }

  return result;
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom > 0 ? dot / denom : 0;
}

function buildDocVectors(tfidf: Map<string, number[]>, numDocs: number): number[][] {
  const terms = Array.from(tfidf.keys());
  const vectors: number[][] = [];
  for (let d = 0; d < numDocs; d++) {
    const vec: number[] = [];
    for (const term of terms) {
      const scores = tfidf.get(term) ?? [];
      vec.push(scores[d]);
    }
    vectors.push(vec);
  }
  return vectors;
}

export function kMeansCluster(vectors: number[][], k: number, maxIter = 30): number[] {
  const n = vectors.length;
  if (n === 0) return [];
  if (n <= k) return vectors.map((_, i) => i);

  const dim = vectors[0].length;
  const assignments = new Array<number>(n).fill(0);

  // Initialize centroids using k-means++ style selection
  const centroids: number[][] = [];
  const firstIdx = Math.floor(Math.random() * n);
  centroids.push([...vectors[firstIdx]]);

  for (let c = 1; c < k; c++) {
    const distances: number[] = vectors.map((v) => {
      let minDist = Number.POSITIVE_INFINITY;
      for (const cent of centroids) {
        const dist = 1 - cosineSimilarity(v, cent);
        if (dist < minDist) minDist = dist;
      }
      return minDist;
    });
    const totalDist = distances.reduce((a, b) => a + b, 0);
    let r = Math.random() * totalDist;
    let chosen = 0;
    for (let i = 0; i < n; i++) {
      r -= distances[i];
      if (r <= 0) {
        chosen = i;
        break;
      }
    }
    centroids.push([...vectors[chosen]]);
  }

  for (let iter = 0; iter < maxIter; iter++) {
    let changed = false;

    // Assign each vector to nearest centroid
    for (let i = 0; i < n; i++) {
      let bestCluster = 0;
      let bestSim = -1;
      for (let c = 0; c < k; c++) {
        const sim = cosineSimilarity(vectors[i], centroids[c]);
        if (sim > bestSim) {
          bestSim = sim;
          bestCluster = c;
        }
      }
      if (assignments[i] !== bestCluster) {
        assignments[i] = bestCluster;
        changed = true;
      }
    }

    if (!changed) break;

    // Recompute centroids
    for (let c = 0; c < k; c++) {
      const members = vectors.filter((_, i) => assignments[i] === c);
      if (members.length === 0) continue;
      for (let d = 0; d < dim; d++) {
        centroids[c][d] = members.reduce((sum, v) => sum + v[d], 0) / members.length;
      }
    }
  }

  return assignments;
}

function getTopKeywords(
  tfidf: Map<string, number[]>,
  docIndices: number[],
  maxKeywords: number,
): string[] {
  const termScores = new Map<string, number>();
  for (const [term, scores] of tfidf) {
    let totalScore = 0;
    for (const idx of docIndices) {
      totalScore += scores[idx];
    }
    termScores.set(term, totalScore / docIndices.length);
  }

  return Array.from(termScores.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxKeywords)
    .map(([term]) => term);
}

export function extractTopics(conversations: DocumentInput[], config: TopicConfig): TopicCluster[] {
  if (conversations.length === 0) return [];

  const documents = conversations.map((c) => getCleanTokens(c.text, c.language ?? "en"));

  const tfidf = computeTFIDF(documents);

  // Filter low-scoring terms
  const filtered = new Map<string, number[]>();
  for (const [term, scores] of tfidf) {
    const maxScore = Math.max(...scores);
    if (maxScore >= config.tfidfMinScore) {
      filtered.set(term, scores);
    }
  }

  const k = Math.min(config.maxClusters, Math.max(2, Math.floor(conversations.length / 5)));
  const vectors = buildDocVectors(filtered, conversations.length);
  const assignments = kMeansCluster(vectors, k);

  // Build clusters
  const clusterMap = new Map<number, number[]>();
  for (let i = 0; i < assignments.length; i++) {
    const cluster = assignments[i];
    if (!clusterMap.has(cluster)) clusterMap.set(cluster, []);
    clusterMap.get(cluster)?.push(i);
  }

  const clusters: TopicCluster[] = [];
  let colorIdx = 0;
  for (const [, docIndices] of clusterMap) {
    if (docIndices.length < config.minClusterSize) continue;

    const keywords = getTopKeywords(filtered, docIndices, config.maxKeywordsPerCluster);
    if (keywords.length === 0) continue;

    const label = keywords.slice(0, 3).join(", ");
    const convIds = docIndices.map((i) => conversations[i].id);

    clusters.push({
      id: `topic-${colorIdx}`,
      label,
      keywords,
      conversationIds: convIds,
      size: convIds.length,
      color: CLUSTER_COLORS[colorIdx % CLUSTER_COLORS.length],
    });
    colorIdx++;
  }

  return clusters.sort((a, b) => b.size - a.size);
}
