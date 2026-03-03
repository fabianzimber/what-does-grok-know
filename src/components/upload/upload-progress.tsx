"use client";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils/format-utils";

interface UploadProgressProps {
  phase: string;
  percent: number;
  className?: string;
}

const phaseLabels: Record<string, string> = {
  parsing: "Parsing conversations...",
  indexing: "Building index...",
  analyzing: "Analyzing content...",
  storing: "Storing data...",
  complete: "Complete!",
};

export function UploadProgress({ phase, percent, className }: UploadProgressProps) {
  const label = phaseLabels[phase] ?? phase;

  return (
    <div className={cn("w-full max-w-md mx-auto space-y-4", className)}>
      <div className="text-center">
        <div className="w-12 h-12 mx-auto rounded-full bg-brand-primary/10 flex items-center justify-center mb-3">
          <svg className="w-6 h-6 text-brand-primary animate-spin" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        </div>
        <p className="text-sm font-medium text-brand-text">{label}</p>
        <p className="text-xs text-brand-muted mt-1">{Math.round(percent)}%</p>
      </div>

      <Progress value={percent} />
    </div>
  );
}
