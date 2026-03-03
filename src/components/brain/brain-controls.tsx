"use client";

import type { ColorMode } from "@/lib/types/visualization";
import { cn } from "@/lib/utils/format-utils";

interface BrainControlsProps {
  colorMode: ColorMode;
  onColorModeChange: (mode: ColorMode) => void;
}

const modes: { value: ColorMode; label: string }[] = [
  { value: "topic", label: "Topics" },
  { value: "sentiment", label: "Sentiment" },
  { value: "time", label: "Timeline" },
  { value: "model", label: "Model" },
  { value: "activity", label: "Activity" },
];

export function BrainControls({ colorMode, onColorModeChange }: BrainControlsProps) {
  return (
    <div className="absolute bottom-6 left-6 z-10 flex gap-2 p-2 rounded-xl bg-black/50 backdrop-blur-xl border border-white/15 shadow-xl">
      {modes.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => onColorModeChange(value)}
          className={cn(
            "px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200",
            colorMode === value
              ? "bg-gradient-to-r from-brand-primary to-brand-primary/70 text-white shadow-lg shadow-brand-primary/30 border border-brand-primary/40"
              : "text-white/60 hover:text-white hover:bg-white/15 border border-white/10",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
