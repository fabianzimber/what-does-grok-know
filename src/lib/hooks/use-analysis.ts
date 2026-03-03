"use client";

import {
  getAllConversations,
  getAllMessages,
  getAnalysis,
  saveAnalysis,
} from "@/lib/storage/db-queries";
import type { AnalysisProgress, AnalysisResult } from "@/lib/types/analysis";
import { useCallback, useRef, useState } from "react";

const INITIAL_PROGRESS: AnalysisProgress = {
  phase: "parsing",
  percent: 0,
  message: "Preparing analysis...",
};

export function useAnalysis() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [progress, setProgress] = useState<AnalysisProgress>(INITIAL_PROGRESS);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const workerRef = useRef<Worker | null>(null);

  const startAnalysis = useCallback(async () => {
    setError(null);

    try {
      const cached = await getAnalysis();
      if (cached) {
        setAnalysisResult(cached);
        setProgress({ phase: "complete", percent: 100, message: "Loaded from cache" });
        return;
      }
    } catch {
      // Cache miss, proceed with analysis
    }

    setIsAnalyzing(true);
    setProgress(INITIAL_PROGRESS);

    try {
      const [conversations, messages] = await Promise.all([
        getAllConversations(),
        getAllMessages(),
      ]);

      if (conversations.length === 0) {
        setError("No conversations found. Please upload your Grok data first.");
        setIsAnalyzing(false);
        return;
      }

      if (workerRef.current) {
        workerRef.current.terminate();
      }

      const worker = new Worker(new URL("@/lib/workers/analysis-worker.ts", import.meta.url), {
        type: "module",
      });
      workerRef.current = worker;

      worker.onmessage = async (e: MessageEvent) => {
        const { type } = e.data;

        if (type === "progress") {
          setProgress({
            phase: e.data.phase,
            percent: e.data.percent,
            message: e.data.message,
          });
        }

        if (type === "complete") {
          const result = e.data.result as AnalysisResult;
          setAnalysisResult(result);
          setProgress({ phase: "complete", percent: 100, message: "Analysis complete!" });
          setIsAnalyzing(false);
          worker.terminate();
          workerRef.current = null;

          try {
            await saveAnalysis(result);
          } catch (saveErr) {
            console.error("Failed to cache analysis:", saveErr);
          }
        }

        if (type === "error") {
          setError(e.data.message);
          setIsAnalyzing(false);
          worker.terminate();
          workerRef.current = null;
        }
      };

      worker.onerror = (err: ErrorEvent) => {
        setError(err.message || "Analysis worker failed");
        setIsAnalyzing(false);
        worker.terminate();
        workerRef.current = null;
      };

      worker.postMessage({
        type: "analyze",
        conversations,
        messages,
      });
    } catch (err) {
      setError((err as Error).message);
      setIsAnalyzing(false);
    }
  }, []);

  const clearAnalysis = useCallback(() => {
    setAnalysisResult(null);
    setProgress(INITIAL_PROGRESS);
    setError(null);
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
  }, []);

  return {
    analysisResult,
    progress,
    isAnalyzing,
    error,
    startAnalysis,
    clearAnalysis,
  };
}
