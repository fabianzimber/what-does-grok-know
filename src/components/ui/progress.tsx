import { cn } from "@/lib/utils/format-utils";

interface ProgressProps {
  value: number;
  className?: string;
}

export function Progress({ value, className }: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      className={cn(
        "w-full h-3 bg-gray-200/50 rounded-full overflow-hidden backdrop-blur-sm border border-white/30 shadow-inner",
        className,
      )}
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-brand-primary via-brand-accent to-brand-primary transition-all duration-500 ease-out relative overflow-hidden"
        style={{ width: `${clamped}%` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-shimmer" />
      </div>
    </div>
  );
}
