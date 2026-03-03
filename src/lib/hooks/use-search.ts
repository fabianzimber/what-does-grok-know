"use client";

import { analysisConfig } from "@/lib/constants/analysis-config";
import { getAllMessages } from "@/lib/storage/db-queries";
import type { SearchResult } from "@/lib/workers/search-worker";
import { useCallback, useEffect, useRef, useState } from "react";

export function useSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isIndexed, setIsIndexed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const initIndex = useCallback(async () => {
    try {
      const messages = await getAllMessages();
      if (messages.length === 0) return;

      if (workerRef.current) {
        workerRef.current.terminate();
      }

      const worker = new Worker(new URL("@/lib/workers/search-worker.ts", import.meta.url), {
        type: "module",
      });
      workerRef.current = worker;

      worker.onmessage = (e: MessageEvent) => {
        const { type } = e.data;
        if (type === "indexed") setIsIndexed(true);
        if (type === "results") {
          setResults(e.data.results);
          setIsSearching(false);
        }
        if (type === "error") {
          setError(e.data.message);
          setIsSearching(false);
        }
      };

      worker.onerror = (err: ErrorEvent) => {
        setError(err.message || "Search worker error");
        setIsSearching(false);
      };

      worker.postMessage({ type: "index", messages });
    } catch (err) {
      setError((err as Error).message);
    }
  }, []);

  const searchQuery = useCallback(
    (q: string) => {
      setQuery(q);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      if (!q.trim()) {
        setResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);

      debounceRef.current = setTimeout(() => {
        if (workerRef.current && isIndexed) {
          workerRef.current.postMessage({
            type: "search",
            query: q,
            maxResults: analysisConfig.search.maxResults,
          });
        } else {
          setIsSearching(false);
        }
      }, 200);
    },
    [isIndexed],
  );

  useEffect(() => {
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return {
    query,
    setQuery: searchQuery,
    results,
    isSearching,
    isIndexed,
    error,
    initIndex,
  };
}
