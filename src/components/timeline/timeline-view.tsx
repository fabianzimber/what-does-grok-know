"use client";

import type { ParsedConversation } from "@/lib/types/grok-data";
import { useMemo, useState } from "react";
import { ConversationCard } from "./conversation-card";

interface TimelineViewProps {
  conversations: ParsedConversation[];
}

interface MonthGroup {
  key: string;
  label: string;
  conversations: ParsedConversation[];
}

function groupByMonth(conversations: ParsedConversation[]): MonthGroup[] {
  const groups = new Map<string, ParsedConversation[]>();

  for (const conv of conversations) {
    const date = new Date(conv.createdAt);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const existing = groups.get(key) ?? [];
    existing.push(conv);
    groups.set(key, existing);
  }

  return Array.from(groups.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([key, convs]) => {
      const [year, month] = key.split("-");
      const date = new Date(Number(year), Number(month) - 1);
      const label = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
      return { key, label, conversations: convs };
    });
}

export function TimelineView({ conversations }: TimelineViewProps) {
  const [filter, setFilter] = useState<"all" | "starred">("all");

  const filtered = useMemo(() => {
    if (filter === "starred") {
      return conversations.filter((c) => c.starred);
    }
    return conversations;
  }, [conversations, filter]);

  const groups = useMemo(() => groupByMonth(filtered), [filtered]);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-6">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
            filter === "all"
              ? "bg-brand-primary text-white"
              : "bg-white/70 text-brand-muted hover:text-brand-text"
          }`}
        >
          All ({conversations.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter("starred")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
            filter === "starred"
              ? "bg-brand-primary text-white"
              : "bg-white/70 text-brand-muted hover:text-brand-text"
          }`}
        >
          Starred ({conversations.filter((c) => c.starred).length})
        </button>
      </div>

      {groups.map((group) => (
        <div key={group.key}>
          <div className="sticky top-0 z-10 bg-brand-bg/90 backdrop-blur-sm py-3 mb-3">
            <h3 className="text-sm font-semibold text-brand-muted uppercase tracking-wider">
              {group.label}
              <span className="ml-2 text-xs font-normal">({group.conversations.length})</span>
            </h3>
          </div>
          <div className="space-y-3 mb-6">
            {group.conversations.map((conv) => (
              <ConversationCard key={conv.id} conversation={conv} />
            ))}
          </div>
        </div>
      ))}

      {groups.length === 0 && (
        <div className="text-center py-16 text-brand-muted">
          <p className="text-lg">No conversations found</p>
        </div>
      )}
    </div>
  );
}
