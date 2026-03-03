"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/format-utils";
import { useEffect, useRef, useState } from "react";

interface ImportStats {
  totalConversations: number;
  totalMessages: number;
  totalHuman: number;
  totalAssistant: number;
  dateRange?: { start: string; end: string };
  modelsFound?: string[];
}

interface ImportSummaryProps {
  stats: ImportStats;
  className?: string;
}

function AnimatedNumber({ value }: { value: number }) {
  const [current, setCurrent] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (value === 0) {
      setCurrent(0);
      return;
    }
    const startTime = performance.now();
    const duration = 800;

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setCurrent(Math.round(value * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value]);

  return <span>{current.toLocaleString()}</span>;
}

export function ImportSummary({ stats, className }: ImportSummaryProps) {
  const items = [
    { label: "Conversations", value: stats.totalConversations, icon: "\u{1F4AC}" },
    { label: "Total Messages", value: stats.totalMessages, icon: "\u{1F4DD}" },
    { label: "Your Messages", value: stats.totalHuman, icon: "\u{1F464}" },
    { label: "Grok Responses", value: stats.totalAssistant, icon: "\u{1F916}" },
  ];

  return (
    <div className={cn("w-full max-w-lg mx-auto space-y-6", className)}>
      <div className="text-center">
        <div className="w-14 h-14 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-3">
          <svg
            className="w-7 h-7 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-brand-text">Import Complete</h3>
        <p className="text-sm text-brand-muted mt-1">Your Grok data has been loaded</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => (
          <Card key={item.label} className="p-4 text-center">
            <span className="text-2xl">{item.icon}</span>
            <p className="text-2xl font-bold text-brand-text mt-1">
              <AnimatedNumber value={item.value} />
            </p>
            <p className="text-xs text-brand-muted mt-0.5">{item.label}</p>
          </Card>
        ))}
      </div>

      {stats.dateRange && (
        <p className="text-center text-sm text-brand-muted">
          {stats.dateRange.start} &mdash; {stats.dateRange.end}
        </p>
      )}

      {stats.modelsFound && stats.modelsFound.length > 0 && (
        <div className="text-center">
          <p className="text-xs text-brand-muted mb-2">Models found</p>
          <div className="flex flex-wrap justify-center gap-1.5">
            {stats.modelsFound.map((model) => (
              <span
                key={model}
                className="px-2.5 py-0.5 rounded-full bg-brand-accent/10 text-brand-accent text-xs font-medium"
              >
                {model}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
