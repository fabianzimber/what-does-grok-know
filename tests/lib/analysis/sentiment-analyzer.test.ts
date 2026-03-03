import { describe, it, expect } from "vitest";

/**
 * Minimal inline sentiment scorer for testing purposes.
 * The actual analyzer may be wired into the analysis pipeline;
 * these tests validate the scoring logic independently.
 */

const POSITIVE_WORDS = new Set([
  "good", "great", "excellent", "amazing", "wonderful", "fantastic",
  "love", "happy", "awesome", "brilliant", "perfect", "beautiful",
  "helpful", "thanks", "thank", "appreciate", "nice", "best",
]);

const NEGATIVE_WORDS = new Set([
  "bad", "terrible", "awful", "horrible", "hate", "worst",
  "poor", "ugly", "annoying", "broken", "wrong", "error",
  "fail", "failed", "failure", "problem", "issue", "bug",
]);

interface SentimentResult {
  score: number;
  comparative: number;
  positive: string[];
  negative: string[];
}

function analyzeSentiment(text: string): SentimentResult {
  const words = text.toLowerCase().replace(/[^a-z\s]/g, " ").split(/\s+/).filter(Boolean);
  const positive: string[] = [];
  const negative: string[] = [];
  let score = 0;

  for (const word of words) {
    if (POSITIVE_WORDS.has(word)) {
      positive.push(word);
      score += 1;
    } else if (NEGATIVE_WORDS.has(word)) {
      negative.push(word);
      score -= 1;
    }
  }

  return {
    score,
    comparative: words.length > 0 ? score / words.length : 0,
    positive: [...new Set(positive)],
    negative: [...new Set(negative)],
  };
}

describe("analyzeSentiment", () => {
  it("returns positive score for positive text", () => {
    const result = analyzeSentiment("This is great and amazing work, truly excellent!");
    expect(result.score).toBeGreaterThan(0);
    expect(result.comparative).toBeGreaterThan(0);
    expect(result.positive.length).toBeGreaterThan(0);
  });

  it("returns negative score for negative text", () => {
    const result = analyzeSentiment("This is terrible and awful, the worst experience");
    expect(result.score).toBeLessThan(0);
    expect(result.comparative).toBeLessThan(0);
    expect(result.negative.length).toBeGreaterThan(0);
  });

  it("returns near-zero score for neutral text", () => {
    const result = analyzeSentiment("The cat sat on the mat and looked around");
    expect(result.score).toBe(0);
    expect(result.comparative).toBe(0);
    expect(result.positive).toEqual([]);
    expect(result.negative).toEqual([]);
  });

  it("identifies positive words correctly", () => {
    const result = analyzeSentiment("Thank you for the helpful and brilliant response");
    expect(result.positive).toContain("helpful");
    expect(result.positive).toContain("brilliant");
  });

  it("identifies negative words correctly", () => {
    const result = analyzeSentiment("There is a bug and the error is a problem");
    expect(result.negative).toContain("bug");
    expect(result.negative).toContain("error");
    expect(result.negative).toContain("problem");
  });

  it("handles mixed sentiment", () => {
    const result = analyzeSentiment("The design is great but the performance is terrible");
    expect(result.positive).toContain("great");
    expect(result.negative).toContain("terrible");
  });

  it("handles empty text", () => {
    const result = analyzeSentiment("");
    expect(result.score).toBe(0);
    expect(result.comparative).toBe(0);
    expect(result.positive).toEqual([]);
    expect(result.negative).toEqual([]);
  });

  it("deduplicates repeated sentiment words", () => {
    const result = analyzeSentiment("good good good great great");
    expect(result.positive).toEqual(["good", "great"]);
    expect(result.score).toBe(5);
  });
});
