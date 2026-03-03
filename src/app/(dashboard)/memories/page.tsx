"use client";

import { MemoryList } from "@/components/memories/memory-list";
import { AnalysisGate } from "@/components/shared/analysis-gate";
import { useAnalysisContext } from "@/lib/context/analysis-provider";

export default function MemoriesPage() {
  const { analysis } = useAnalysisContext();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-brand-text mb-1">Memories</h1>
        <p className="text-sm text-brand-muted">
          Facts, decisions, and learnings extracted from your conversations
        </p>
      </div>

      <AnalysisGate>
        {analysis && analysis.memories.length > 0 ? (
          <MemoryList memories={analysis.memories} />
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-brand-muted">
              No memories extracted yet. Upload your Grok export to get started.
            </p>
          </div>
        )}
      </AnalysisGate>
    </div>
  );
}
