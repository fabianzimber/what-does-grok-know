export const analysisConfig = {
  topics: {
    maxClusters: 12,
    minClusterSize: 3,
    tfidfMinScore: 0.01,
    maxKeywordsPerCluster: 8,
  },
  sentiment: {
    neutralThreshold: 0.05,
  },
  memory: {
    minConfidence: 0.6,
    maxMemories: 500,
  },
  search: {
    maxResults: 50,
    fuzzyThreshold: 0.3,
  },
  brain: {
    maxEdges: 200,
    particleCount: 2000,
    nodeMinSize: 0.3,
    nodeMaxSize: 2.0,
  },
} as const;
