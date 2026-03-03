"use client";

import { HeatmapCalendar } from "@/components/timeline/heatmap-calendar";
import { TimelineView } from "@/components/timeline/timeline-view";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllConversations } from "@/lib/storage/db-queries";
import type { ParsedConversation } from "@/lib/types/grok-data";
import { useEffect, useState } from "react";

export default function TimelinePage() {
  const [conversations, setConversations] = useState<ParsedConversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getAllConversations().then((data) => {
      if (!cancelled) {
        setConversations(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-text mb-1">Timeline</h1>
          <p className="text-sm text-brand-muted">Your conversation history at a glance</p>
        </div>
        <Skeleton className="h-40 w-full rounded-2xl" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={`skel-${i}`} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-brand-text mb-1">Timeline</h1>
        <p className="text-sm text-brand-muted">Your conversation history at a glance</p>
      </div>

      <HeatmapCalendar conversations={conversations} />
      <TimelineView conversations={conversations} />
    </div>
  );
}
