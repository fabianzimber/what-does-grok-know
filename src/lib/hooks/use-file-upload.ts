"use client";

import { db } from "@/lib/storage/db-schema";
import type { ParsedConversation, ParsedMessage } from "@/lib/types/grok-data";
import { useCallback, useRef, useState } from "react";

type UploadPhase = "idle" | "reading" | "parsing" | "storing" | "complete";

export function useFileUpload() {
  const [phase, setPhase] = useState<UploadPhase>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const workerRef = useRef<Worker | null>(null);

  const reset = useCallback(() => {
    setPhase("idle");
    setProgress(0);
    setError(null);
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
  }, []);

  const handleFile = useCallback(async (file: File) => {
    setError(null);
    setPhase("reading");
    setProgress(0);

    try {
      if (!file.name.endsWith(".json")) {
        setError("Please upload a JSON file");
        setPhase("idle");
        return;
      }

      if (file.size > 500 * 1024 * 1024) {
        setError("File is too large (max 500MB)");
        setPhase("idle");
        return;
      }

      const text = await file.text();
      setProgress(15);
      setPhase("parsing");

      if (workerRef.current) {
        workerRef.current.terminate();
      }

      const worker = new Worker(new URL("@/lib/workers/parse-worker.ts", import.meta.url), {
        type: "module",
      });
      workerRef.current = worker;

      worker.onmessage = async (e: MessageEvent) => {
        const { type } = e.data;

        if (type === "progress") {
          setProgress(15 + Math.round(e.data.percent * 0.55));
        }

        if (type === "complete") {
          setPhase("storing");
          setProgress(75);

          try {
            const conversations = e.data.conversations as ParsedConversation[];
            const messages = e.data.messages as ParsedMessage[];

            await db.transaction(
              "rw",
              [db.conversations, db.messages, db.analysisCache, db.topicClusters, db.memories],
              async () => {
                await db.conversations.clear();
                await db.messages.clear();
                await db.analysisCache.clear();
                await db.topicClusters.clear();
                await db.memories.clear();

                const CHUNK_SIZE = 500;

                for (let i = 0; i < conversations.length; i += CHUNK_SIZE) {
                  const chunk = conversations.slice(i, i + CHUNK_SIZE);
                  await db.conversations.bulkPut(chunk);
                }
                setProgress(85);

                for (let i = 0; i < messages.length; i += CHUNK_SIZE) {
                  const chunk = messages.slice(i, i + CHUNK_SIZE);
                  await db.messages.bulkPut(chunk);
                }
                setProgress(95);
              },
            );

            setProgress(100);
            setPhase("complete");
          } catch (storeErr) {
            setError(`Failed to store data: ${(storeErr as Error).message}`);
            setPhase("idle");
          }

          worker.terminate();
          workerRef.current = null;
        }

        if (type === "error") {
          setError(e.data.message);
          setPhase("idle");
          worker.terminate();
          workerRef.current = null;
        }
      };

      worker.onerror = (err: ErrorEvent) => {
        setError(err.message || "Parse worker failed");
        setPhase("idle");
        worker.terminate();
        workerRef.current = null;
      };

      worker.postMessage({ type: "parse", data: text });
    } catch (err) {
      setError((err as Error).message);
      setPhase("idle");
    }
  }, []);

  return {
    phase,
    progress,
    error,
    handleFile,
    reset,
    isUploading: phase !== "idle" && phase !== "complete",
  };
}
