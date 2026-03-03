import { cn } from "@/lib/utils/format-utils";
import type { ReactNode } from "react";

interface StatCardProps {
  icon?: ReactNode;
  value: string | number;
  label: string;
  trend?: { value: number; positive: boolean };
  className?: string;
}

export function StatCard({ icon, value, label, trend, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "glass-deep rounded-2xl p-3 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 relative overflow-hidden group/stat",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary/15 to-brand-accent/10 flex items-center justify-center text-brand-primary shadow-sm border border-brand-primary/15">
            {icon}
          </div>
        )}
        {trend && (
          <span
            className={cn(
              "text-xs font-medium px-2 py-0.5 rounded-full",
              trend.positive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500",
            )}
          >
            {trend.positive ? "+" : ""}
            {trend.value}%
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-brand-text">{value}</p>
        <p className="text-sm text-brand-muted mt-0.5">{label}</p>
      </div>
    </div>
  );
}
