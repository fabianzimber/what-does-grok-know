"use client";

import {
  getAllConversations,
  getAllMessages,
  getAnalysis,
  saveAnalysis,
} from "@/lib/storage/db-queries";
import type { AnalysisProgress, AnalysisResult } from "@/lib/types/analysis";
import { type ReactNode, createContext, useContext, useEffect, useRef, useState } from "react";

interface AnalysisContextValue {
  analysis: AnalysisResult | null;
  isAnalyzing: boolean;
  progress: AnalysisProgress;
  error: string | null;
}

const AnalysisContext = createContext<AnalysisContextValue>({
  analysis: null,
  isAnalyzing: false,
  progress: { phase: "parsing", percent: 0, message: "" },
  error: null,
});

export function useAnalysisContext() {
  return useContext(AnalysisContext);
}

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState<AnalysisProgress>({
    phase: "parsing",
    percent: 0,
    message: "Preparing...",
  });
  const [error, setError] = useState<string | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    async function init() {
      try {
        const cached = await getAnalysis();
        if (cached) {
          setAnalysis(cached);
          setProgress({ phase: "complete", percent: 100, message: "Loaded from cache" });
          return;
        }
      } catch {
        // Cache miss, proceed with analysis
      }

      setIsAnalyzing(true);

      try {
        const [conversations, messages] = await Promise.all([
          getAllConversations(),
          getAllMessages(),
        ]);

        if (conversations.length === 0) {
          setIsAnalyzing(false);
          return;
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
            setAnalysis(result);
            setProgress({
              phase: "complete",
              percent: 100,
              message: "Analysis complete!",
            });
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
          setError(err.message || "Analysis failed");
          setIsAnalyzing(false);
          worker.terminate();
          workerRef.current = null;
        };

        worker.postMessage({ type: "analyze", conversations, messages });
      } catch (err) {
        setError((err as Error).message);
        setIsAnalyzing(false);
      }
    }

    init();

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, []);

  return (
    <AnalysisContext.Provider value={{ analysis, isAnalyzing, progress, error }}>
      {children}
    </AnalysisContext.Provider>
  );
}
