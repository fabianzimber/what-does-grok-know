import { cn } from "@/lib/utils/format-utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn("bg-gray-200 rounded animate-pulse", className)} />;
}
