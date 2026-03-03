"use client";

import type { Memory } from "@/lib/types/analysis";
import { useMemo, useState } from "react";
import { MemoryCard } from "./memory-card";

interface MemoryListProps {
  memories: Memory[];
}

type MemoryType = Memory["type"] | "all";
type SortKey = "confidence" | "date";

const TYPE_FILTERS: { id: MemoryType; label: string }[] = [
  { id: "all", label: "All" },
  { id: "fact", label: "Facts" },
  { id: "decision", label: "Decisions" },
  { id: "learning", label: "Learnings" },
  { id: "preference", label: "Preferences" },
  { id: "goal", label: "Goals" },
];

export function MemoryList({ memories }: MemoryListProps) {
  const [typeFilter, setTypeFilter] = useState<MemoryType>("all");
  const [sortBy, setSortBy] = useState<SortKey>("confidence");

  const filtered = useMemo(() => {
    let result = typeFilter === "all" ? memories : memories.filter((m) => m.type === typeFilter);

    result = [...result].sort((a, b) => {
      if (sortBy === "confidence") return b.confidence - a.confidence;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return result;
  }, [memories, typeFilter, sortBy]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1">
          {TYPE_FILTERS.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setTypeFilter(filter.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                typeFilter === filter.id
                  ? "bg-brand-primary text-white"
                  : "bg-white/70 text-brand-muted hover:text-brand-text"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setSortBy("confidence")}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
              sortBy === "confidence"
                ? "bg-brand-accent text-white"
                : "bg-gray-100 text-brand-muted"
            }`}
          >
            By Confidence
          </button>
          <button
            type="button"
            onClick={() => setSortBy("date")}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
              sortBy === "date" ? "bg-brand-accent text-white" : "bg-gray-100 text-brand-muted"
            }`}
          >
            By Date
          </button>
        </div>
      </div>

      <p className="text-xs text-brand-muted">
        Showing {filtered.length} of {memories.length} memories
      </p>

      <div className="space-y-3">
        {filtered.map((memory) => (
          <MemoryCard key={memory.id} memory={memory} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-brand-muted">
          <p>No memories found for this filter</p>
        </div>
      )}
    </div>
  );
}
