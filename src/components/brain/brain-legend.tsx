"use client";

import type { TopicCluster } from "@/lib/types/analysis";
import type { ColorMode } from "@/lib/types/visualization";

interface BrainLegendProps {
  colorMode: ColorMode;
  clusters: TopicCluster[];
  dateRange?: { start: string; end: string };
}

function TopicLegend({ clusters }: { clusters: TopicCluster[] }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-white/40 text-[10px] uppercase tracking-wider font-semibold">
        Topics
      </span>
      {clusters.map((cluster) => (
        <div key={cluster.id} className="flex items-center gap-2">
          <div
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: cluster.color }}
          />
          <span className="text-white/70 text-[11px] truncate max-w-[140px]">{cluster.label}</span>
        </div>
      ))}
    </div>
  );
}

function GradientLegend({
  label,
  startColor,
  endColor,
  startLabel,
  endLabel,
  midColor,
}: {
  label: string;
  startColor: string;
  endColor: string;
  startLabel: string;
  endLabel: string;
  midColor?: string;
}) {
  const gradient = midColor
    ? `linear-gradient(to right, ${startColor}, ${midColor}, ${endColor})`
    : `linear-gradient(to right, ${startColor}, ${endColor})`;

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-white/40 text-[10px] uppercase tracking-wider font-semibold">
        {label}
      </span>
      <div className="h-2 rounded-full w-full" style={{ background: gradient }} />
      <div className="flex justify-between">
        <span className="text-white/50 text-[10px]">{startLabel}</span>
        <span className="text-white/50 text-[10px]">{endLabel}</span>
      </div>
    </div>
  );
}

export function BrainLegend({ colorMode, clusters, dateRange }: BrainLegendProps) {
  return (
    <div className="absolute top-6 right-6 z-10 p-4 rounded-xl bg-black/50 backdrop-blur-xl border border-white/15 shadow-xl min-w-[170px]">
      {colorMode === "topic" && <TopicLegend clusters={clusters} />}

      {colorMode === "sentiment" && (
        <GradientLegend
          label="Sentiment"
          startColor="#e63946"
          midColor="#f4d03f"
          endColor="#10b981"
          startLabel="Negative"
          endLabel="Positive"
        />
      )}

      {colorMode === "time" && (
        <GradientLegend
          label="Timeline"
          startColor="#6366f1"
          endColor="#e63946"
          startLabel={dateRange?.start ?? "Earliest"}
          endLabel={dateRange?.end ?? "Latest"}
        />
      )}

      {colorMode === "model" && (
        <div className="flex flex-col gap-1.5">
          <span className="text-white/40 text-[10px] uppercase tracking-wider font-semibold">
            Model
          </span>
          <span className="text-white/50 text-[10px]">Colored by topic cluster</span>
        </div>
      )}

      {colorMode === "activity" && (
        <GradientLegend
          label="Activity"
          startColor="#c4b5fd"
          endColor="#e63946"
          startLabel="Low"
          endLabel="High"
        />
      )}
    </div>
  );
}
