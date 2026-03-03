"use client";

import type { ParsedConversation } from "@/lib/types/grok-data";
import { useMemo, useState } from "react";

interface HeatmapCalendarProps {
  conversations: ParsedConversation[];
}

interface DayCell {
  date: Date;
  count: number;
  dateStr: string;
}

function getColorIntensity(count: number, maxCount: number): string {
  if (count === 0) return "bg-gray-100";
  const ratio = count / Math.max(maxCount, 1);
  if (ratio <= 0.25) return "bg-brand-primary/20";
  if (ratio <= 0.5) return "bg-brand-primary/40";
  if (ratio <= 0.75) return "bg-brand-primary/70";
  return "bg-brand-primary";
}

function buildCalendarGrid(conversations: ParsedConversation[]): {
  grid: DayCell[][];
  maxCount: number;
} {
  const messageCounts = new Map<string, number>();
  for (const conv of conversations) {
    const date = new Date(conv.createdAt);
    const key = date.toISOString().split("T")[0];
    messageCounts.set(key, (messageCounts.get(key) ?? 0) + conv.messageCount);
  }

  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 364);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  const weeks: DayCell[][] = [];
  let currentWeek: DayCell[] = [];
  let maxCount = 0;

  const cursor = new Date(startDate);
  while (cursor <= today) {
    const dateStr = cursor.toISOString().split("T")[0];
    const count = messageCounts.get(dateStr) ?? 0;
    if (count > maxCount) maxCount = count;

    currentWeek.push({
      date: new Date(cursor),
      count,
      dateStr,
    });

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }

    cursor.setDate(cursor.getDate() + 1);
  }

  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  return { grid: weeks, maxCount };
}

const DAY_LABELS = ["Sun", "", "Tue", "", "Thu", "", "Sat"];
const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function HeatmapCalendar({ conversations }: HeatmapCalendarProps) {
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    text: string;
  } | null>(null);

  const { grid, maxCount } = useMemo(() => buildCalendarGrid(conversations), [conversations]);

  const monthHeaders = useMemo(() => {
    const headers: { label: string; colStart: number }[] = [];
    let lastMonth = -1;
    for (let w = 0; w < grid.length; w++) {
      const firstDay = grid[w][0];
      if (!firstDay) continue;
      const month = firstDay.date.getMonth();
      if (month !== lastMonth) {
        headers.push({ label: MONTH_LABELS[month], colStart: w });
        lastMonth = month;
      }
    }
    return headers;
  }, [grid]);

  return (
    <div className="bg-white/70 backdrop-blur-sm border border-white/30 rounded-2xl p-6">
      <h3 className="text-sm font-semibold text-brand-text mb-4">Activity</h3>
      <div className="overflow-x-auto">
        <div className="inline-flex flex-col gap-0.5 relative min-w-fit">
          <div className="flex gap-0.5 ml-8 mb-1">
            {monthHeaders.map((mh) => (
              <span
                key={`${mh.label}-${mh.colStart}`}
                className="text-[10px] text-brand-muted"
                style={{
                  position: "absolute",
                  left: `${mh.colStart * 14 + 32}px`,
                }}
              >
                {mh.label}
              </span>
            ))}
          </div>

          <div className="flex gap-0.5 mt-4">
            <div className="flex flex-col gap-0.5 mr-1">
              {DAY_LABELS.map((label, i) => (
                <div
                  key={`day-${i}`}
                  className="h-[12px] flex items-center text-[10px] text-brand-muted"
                >
                  {label}
                </div>
              ))}
            </div>

            {grid.map((week, wi) => (
              <div key={`week-${wi}`} className="flex flex-col gap-0.5">
                {week.map((day) => (
                  <div
                    key={day.dateStr}
                    className={`w-[12px] h-[12px] rounded-[2px] cursor-pointer transition-all hover:ring-1 hover:ring-brand-primary/50 ${getColorIntensity(day.count, maxCount)}`}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setTooltip({
                        x: rect.left + rect.width / 2,
                        y: rect.top - 8,
                        text: `${day.count} messages on ${day.date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`,
                      });
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  />
                ))}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-1 mt-3 ml-8">
            <span className="text-[10px] text-brand-muted mr-1">Less</span>
            <div className="w-[12px] h-[12px] rounded-[2px] bg-gray-100" />
            <div className="w-[12px] h-[12px] rounded-[2px] bg-brand-primary/20" />
            <div className="w-[12px] h-[12px] rounded-[2px] bg-brand-primary/40" />
            <div className="w-[12px] h-[12px] rounded-[2px] bg-brand-primary/70" />
            <div className="w-[12px] h-[12px] rounded-[2px] bg-brand-primary" />
            <span className="text-[10px] text-brand-muted ml-1">More</span>
          </div>
        </div>
      </div>

      {tooltip && (
        <div
          className="fixed z-50 px-2 py-1 text-xs bg-brand-text text-white rounded pointer-events-none whitespace-nowrap"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: "translate(-50%, -100%)",
          }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
}
