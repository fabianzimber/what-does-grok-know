import { tokenize } from "@/lib/analysis/text-utils";
import type { ParsedMessage } from "@/lib/types/grok-data";

export interface SearchResult {
  messageId: string;
  conversationId: string;
  score: number;
  snippet: string;
}

interface InvertedIndex {
  index: Map<string, Set<string>>;
  messages: Map<string, ParsedMessage>;
  tokenCache: Map<string, string[]>;
}

let invertedIndex: InvertedIndex | null = null;

function buildIndex(messages: ParsedMessage[]): InvertedIndex {
  const index = new Map<string, Set<string>>();
  const messageMap = new Map<string, ParsedMessage>();
  const tokenCache = new Map<string, string[]>();

  for (const msg of messages) {
    messageMap.set(msg.id, msg);
    const tokens = tokenize(msg.text);
    tokenCache.set(msg.id, tokens);

    for (const token of tokens) {
      if (!index.has(token)) {
        index.set(token, new Set());
      }
      index.get(token)?.add(msg.id);
    }
  }

  return { index, messages: messageMap, tokenCache };
}

function editDistance1(word: string): string[] {
  const results: string[] = [];
  const alphabet = "abcdefghijklmnopqrstuvwxyz";

  for (let i = 0; i < word.length; i++) {
    results.push(word.slice(0, i) + word.slice(i + 1));
  }

  for (let i = 0; i < word.length; i++) {
    for (const c of alphabet) {
      if (c !== word[i]) {
        results.push(word.slice(0, i) + c + word.slice(i + 1));
      }
    }
  }

  for (let i = 0; i <= word.length; i++) {
    for (const c of alphabet) {
      results.push(word.slice(0, i) + c + word.slice(i));
    }
  }

  for (let i = 0; i < word.length - 1; i++) {
    results.push(word.slice(0, i) + word[i + 1] + word[i] + word.slice(i + 2));
  }

  return results;
}

function search(query: string, idx: InvertedIndex, maxResults: number): SearchResult[] {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return [];

  const scoreMap = new Map<string, number>();

  for (const token of queryTokens) {
    const exactMatches = idx.index.get(token);
    if (exactMatches) {
      for (const msgId of exactMatches) {
        scoreMap.set(msgId, (scoreMap.get(msgId) ?? 0) + 1.0);
      }
    }

    if (token.length >= 3) {
      const fuzzyVariants = editDistance1(token);
      for (const variant of fuzzyVariants) {
        const fuzzyMatches = idx.index.get(variant);
        if (fuzzyMatches) {
          for (const msgId of fuzzyMatches) {
            scoreMap.set(msgId, (scoreMap.get(msgId) ?? 0) + 0.5);
          }
        }
      }
    }
  }

  const results: SearchResult[] = [];
  for (const [msgId, baseScore] of scoreMap) {
    const msg = idx.messages.get(msgId);
    if (!msg) continue;

    const tokens = idx.tokenCache.get(msgId) ?? [];
    let tfBoost = 0;
    for (const qToken of queryTokens) {
      const count = tokens.filter((t) => t === qToken).length;
      tfBoost += count;
    }

    const finalScore = baseScore + tfBoost * 0.1;

    const text = msg.text;
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    let snippetStart = lowerText.indexOf(lowerQuery);
    if (snippetStart === -1) {
      for (const qToken of queryTokens) {
        const pos = lowerText.indexOf(qToken);
        if (pos !== -1) {
          snippetStart = pos;
          break;
        }
      }
    }
    if (snippetStart === -1) snippetStart = 0;

    const start = Math.max(0, snippetStart - 40);
    const end = Math.min(text.length, snippetStart + 160);
    const snippet =
      (start > 0 ? "..." : "") + text.slice(start, end).trim() + (end < text.length ? "..." : "");

    results.push({
      messageId: msgId,
      conversationId: msg.conversationId,
      score: Math.round(finalScore * 100) / 100,
      snippet,
    });
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, maxResults);
}

self.onmessage = (
  e: MessageEvent<
    | { type: "index"; messages: ParsedMessage[] }
    | { type: "search"; query: string; maxResults?: number }
  >,
) => {
  const { type } = e.data;

  if (type === "index") {
    const { messages } = e.data as { type: "index"; messages: ParsedMessage[] };
    self.postMessage({ type: "indexing", count: messages.length });
    invertedIndex = buildIndex(messages);
    self.postMessage({
      type: "indexed",
      termCount: invertedIndex.index.size,
      messageCount: messages.length,
    });
    return;
  }

  if (type === "search") {
    const { query, maxResults } = e.data as {
      type: "search";
      query: string;
      maxResults?: number;
    };
    if (!invertedIndex) {
      self.postMessage({ type: "error", message: "Index not built yet" });
      return;
    }
    const results = search(query, invertedIndex, maxResults ?? 50);
    self.postMessage({ type: "results", results, query });
  }
};
