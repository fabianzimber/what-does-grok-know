"use client";

import { Footer } from "@/components/layout/footer";
import { FloatingOrbs } from "@/components/shared/floating-orbs";
import { GradientText } from "@/components/shared/gradient-text";
import { Button } from "@/components/ui/button";
import { ImportSummary } from "@/components/upload/import-summary";
import { UploadProgress } from "@/components/upload/upload-progress";
import { UploadZone } from "@/components/upload/upload-zone";
import { loadDemoData } from "@/lib/demo/load-demo";
import { hasData } from "@/lib/storage/db-queries";
import { db } from "@/lib/storage/db-schema";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

type PagePhase = "idle" | "parsing" | "storing" | "done";

interface ParseStats {
  totalConversations: number;
  totalMessages: number;
  totalHuman: number;
  totalAssistant: number;
  dateRange?: { start: string; end: string };
  modelsFound?: string[];
}

export default function LandingPage() {
  const router = useRouter();
  const workerRef = useRef<Worker | null>(null);

  const [phase, setPhase] = useState<PagePhase>("idle");
  const [progressPhase, setProgressPhase] = useState("parsing");
  const [progressPercent, setProgressPercent] = useState(0);
  const [stats, setStats] = useState<ParseStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    hasData().then((exists) => {
      if (exists) router.replace("/brain");
    });
  }, [router]);

  const handleFileLoaded = useCallback((text: string) => {
    setPhase("parsing");
    setError(null);

    const worker = new Worker(new URL("../lib/workers/parse-worker.ts", import.meta.url));
    workerRef.current = worker;

    worker.onmessage = async (e) => {
      const msg = e.data;

      if (msg.type === "progress") {
        setProgressPhase(msg.phase);
        setProgressPercent(msg.percent);
      }

      if (msg.type === "complete") {
        setPhase("storing");
        setProgressPhase("storing");
        setProgressPercent(95);

        try {
          await db.conversations.bulkPut(msg.conversations);
          await db.messages.bulkPut(msg.messages);

          const conversations = msg.conversations;
          const dates = conversations
            .map((c: { createdAt: string | Date }) => new Date(c.createdAt).getTime())
            .filter((t: number) => !Number.isNaN(t));

          const models = new Set<string>();
          for (const c of conversations) {
            for (const m of c.models) models.add(m);
          }

          setStats({
            totalConversations: msg.stats.totalConversations,
            totalMessages: msg.stats.totalMessages,
            totalHuman: msg.stats.totalHuman,
            totalAssistant: msg.stats.totalAssistant,
            dateRange:
              dates.length > 0
                ? {
                    start: new Date(Math.min(...dates)).toLocaleDateString(),
                    end: new Date(Math.max(...dates)).toLocaleDateString(),
                  }
                : undefined,
            modelsFound: models.size > 0 ? (Array.from(models) as string[]) : undefined,
          });

          setProgressPercent(100);
          setPhase("done");
        } catch (err) {
          setError(`Storage failed: ${(err as Error).message}`);
          setPhase("idle");
        }

        worker.terminate();
      }

      if (msg.type === "error") {
        setError(msg.message);
        setPhase("idle");
        worker.terminate();
      }
    };

    worker.postMessage({ type: "parse", data: text });
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <FloatingOrbs />

        <div className="w-full max-w-xl space-y-8 text-center">
          <div className="space-y-3">
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
              <GradientText>What Does Grok Know?</GradientText>
            </h1>
            <p className="text-lg text-brand-muted max-w-md mx-auto">
              Explore your Grok conversations. Discover patterns, insights, and memories hidden in
              your chats.
            </p>
          </div>

          {phase === "idle" && (
            <>
              <UploadZone onFileLoaded={handleFileLoaded} />
              {error && <p className="text-sm text-brand-primary font-medium">{error}</p>}
              <button
                type="button"
                onClick={async () => {
                  await loadDemoData();
                  router.push("/brain");
                }}
                className="text-sm text-brand-muted hover:text-brand-accent transition-colors underline"
              >
                or try with demo data
              </button>
            </>
          )}

          {(phase === "parsing" || phase === "storing") && (
            <UploadProgress phase={progressPhase} percent={progressPercent} />
          )}

          {phase === "done" && stats && (
            <div className="space-y-6">
              <ImportSummary stats={stats} />
              <Button size="lg" onClick={() => router.push("/brain")}>
                Explore Your Brain
              </Button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
