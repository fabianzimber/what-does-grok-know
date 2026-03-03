import { cn } from "@/lib/utils/format-utils";
import type { ReactNode } from "react";

interface CardProps {
  className?: string;
  children: ReactNode;
}

export function Card({ className, children }: CardProps) {
  return (
    <div
      className={cn(
        "glass-deep rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:border-brand-primary/20 relative overflow-hidden group/card",
        className,
      )}
    >
      {children}
    </div>
  );
}
