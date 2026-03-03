import { describe, it, expect } from "vitest";
import { tokenize, getCleanTokens } from "@/lib/analysis/text-utils";
import { computeTFIDF, kMeansCluster, extractTopics } from "@/lib/analysis/topic-extractor";

describe("tokenize", () => {
  it("lowercases and splits text into words", () => {
    const result = tokenize("Hello World Test");
    expect(result).toEqual(["hello", "world", "test"]);
  });

  it("removes URLs", () => {
    const result = tokenize("Visit https://example.com for info");
    expect(result).toEqual(["visit", "for", "info"]);
  });

  it("strips code blocks", () => {
    const input = "Before ```const x = 1;``` after";
    const result = tokenize(input);
    expect(result).toEqual(["before", "after"]);
  });

  it("filters single-character words", () => {
    const result = tokenize("I a am ok");
    expect(result).toEqual(["am", "ok"]);
  });
});

describe("getCleanTokens", () => {
  it("removes English stopwords and stems", () => {
    const tokens = getCleanTokens("the quick running fox jumps over lazy dogs", "en");
    expect(tokens).not.toContain("the");
    expect(tokens).not.toContain("over");
    expect(tokens.length).toBeGreaterThan(0);
  });

  it("removes German stopwords when language is de", () => {
    const tokens = getCleanTokens("der schnelle Fuchs und die Entwicklung", "de");
    expect(tokens).not.toContain("der");
    expect(tokens).not.toContain("und");
    expect(tokens).not.toContain("die");
  });

  it("removes both stopword sets in mixed mode", () => {
    const tokens = getCleanTokens("the der and und programming Entwicklung", "mixed");
    expect(tokens).not.toContain("the");
    expect(tokens).not.toContain("der");
    expect(tokens).not.toContain("and");
    expect(tokens).not.toContain("und");
  });
});

describe("computeTFIDF", () => {
  it("returns a map of term scores", () => {
    const docs = [
      ["apple", "banana", "apple"],
      ["banana", "cherry"],
      ["apple", "cherry", "cherry"],
    ];
    const result = computeTFIDF(docs);
    expect(result).toBeInstanceOf(Map);
    expect(result.has("apple")).toBe(true);
    expect(result.has("banana")).toBe(true);
    expect(result.has("cherry")).toBe(true);
  });

  it("assigns higher TF-IDF to rarer terms", () => {
    const docs = [
      ["rare", "common"],
      ["common", "common"],
      ["common", "common"],
    ];
    const result = computeTFIDF(docs);
    const rareScores = result.get("rare")!;
    const commonScores = result.get("common")!;
    // Both have tf=0.5 in doc 0, but rare IDF > common IDF
    expect(rareScores[0]).toBeGreaterThan(commonScores[0]);
  });

  it("handles empty documents", () => {
    const result = computeTFIDF([]);
    expect(result.size).toBe(0);
  });
});

describe("kMeansCluster", () => {
  it("returns empty array for empty input", () => {
    expect(kMeansCluster([], 3)).toEqual([]);
  });

  it("assigns sequential indices when n <= k", () => {
    const vectors = [[1, 0], [0, 1]];
    const result = kMeansCluster(vectors, 5);
    expect(result).toEqual([0, 1]);
  });

  it("produces correct number of assignments", () => {
    const vectors = [
      [1, 0, 0],
      [0.9, 0.1, 0],
      [0, 1, 0],
      [0, 0.9, 0.1],
      [0, 0, 1],
      [0.1, 0, 0.9],
    ];
    const result = kMeansCluster(vectors, 3);
    expect(result.length).toBe(6);
    const unique = new Set(result);
    expect(unique.size).toBeLessThanOrEqual(3);
  });
});

describe("extractTopics", () => {
  it("returns empty array for empty input", () => {
    const result = extractTopics([], {
      maxClusters: 5,
      minClusterSize: 1,
      tfidfMinScore: 0.01,
      maxKeywordsPerCluster: 5,
    });
    expect(result).toEqual([]);
  });

  it("extracts topic clusters from conversations", () => {
    const conversations = Array.from({ length: 10 }, (_, i) => ({
      id: String(i),
      text: i < 5
        ? "javascript typescript react frontend development component"
        : "python machine learning data science neural network model",
      language: "en" as const,
    }));

    const result = extractTopics(conversations, {
      maxClusters: 3,
      minClusterSize: 1,
      tfidfMinScore: 0.01,
      maxKeywordsPerCluster: 5,
    });

    expect(result.length).toBeGreaterThan(0);
    for (const cluster of result) {
      expect(cluster).toHaveProperty("id");
      expect(cluster).toHaveProperty("label");
      expect(cluster).toHaveProperty("keywords");
      expect(cluster).toHaveProperty("conversationIds");
      expect(cluster).toHaveProperty("size");
      expect(cluster).toHaveProperty("color");
      expect(cluster.keywords.length).toBeGreaterThan(0);
      expect(cluster.size).toBeGreaterThanOrEqual(1);
    }
  });
});
