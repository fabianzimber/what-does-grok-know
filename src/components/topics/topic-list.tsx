"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { TopicCluster } from "@/lib/types/analysis";
import type { ParsedConversation } from "@/lib/types/grok-data";
import { formatDate } from "@/lib/utils/date-utils";
import { truncate } from "@/lib/utils/format-utils";
import Link from "next/link";
import { useMemo, useState } from "react";

interface TopicListProps {
  clusters: TopicCluster[];
  conversations: ParsedConversation[];
  filterClusterId?: string | null;
}

type SortKey = "size" | "label";

export function TopicList({ clusters, conversations, filterClusterId }: TopicListProps) {
  const [sortBy, setSortBy] = useState<SortKey>("size");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const convMap = useMemo(() => {
    const map = new Map<string, ParsedConversation>();
    for (const c of conversations) {
      map.set(c.id, c);
    }
    return map;
  }, [conversations]);

  const sorted = useMemo(() => {
    const filtered = filterClusterId ? clusters.filter((c) => c.id === filterClusterId) : clusters;

    return [...filtered].sort((a, b) => {
      if (sortBy === "size") return b.size - a.size;
      return a.label.localeCompare(b.label);
    });
  }, [clusters, sortBy, filterClusterId]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-brand-text">Topics ({sorted.length})</h3>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setSortBy("size")}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
              sortBy === "size"
                ? "bg-brand-primary text-white"
                : "bg-gray-100 text-brand-muted hover:text-brand-text"
            }`}
          >
            By Size
          </button>
          <button
            type="button"
            onClick={() => setSortBy("label")}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
              sortBy === "label"
                ? "bg-brand-primary text-white"
                : "bg-gray-100 text-brand-muted hover:text-brand-text"
            }`}
          >
            A-Z
          </button>
        </div>
      </div>

      {sorted.map((cluster) => {
        const isExpanded = expandedId === cluster.id;
        const clusterConvs = cluster.conversationIds
          .map((id) => convMap.get(id))
          .filter(Boolean) as ParsedConversation[];

        return (
          <Card key={cluster.id} className="overflow-hidden">
            <button
              type="button"
              onClick={() => setExpandedId(isExpanded ? null : cluster.id)}
              className="w-full text-left flex items-center justify-between gap-3 cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: cluster.color }}
                />
                <span className="text-sm font-medium text-brand-text capitalize truncate">
                  {cluster.label}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant="muted">{cluster.size} chats</Badge>
                <svg
                  className={`w-4 h-4 text-brand-muted transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </div>
            </button>

            {isExpanded && clusterConvs.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                {clusterConvs.map((conv) => (
                  <Link
                    key={conv.id}
                    href={`/conversation/${conv.id}`}
                    className="flex items-center justify-between gap-2 p-2.5 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    <span className="text-sm text-brand-text group-hover:text-brand-primary truncate">
                      {truncate(conv.title || "Untitled", 60)}
                    </span>
                    <span className="text-xs text-brand-muted shrink-0">
                      {formatDate(new Date(conv.createdAt))}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </Card>
        );
      })}

      {sorted.length === 0 && (
        <div className="text-center py-12 text-brand-muted">
          <p>No topics to display</p>
        </div>
      )}
    </div>
  );
}
