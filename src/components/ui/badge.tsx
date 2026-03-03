import { cn } from "@/lib/utils/format-utils";
import type { ReactNode } from "react";

type BadgeVariant = "default" | "primary" | "accent" | "gold" | "muted";

interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children: ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-gray-100 text-brand-text",
  primary: "bg-brand-primary/10 text-brand-primary",
  accent: "bg-brand-accent/10 text-brand-accent",
  gold: "bg-brand-gold/20 text-yellow-700",
  muted: "bg-gray-50 text-brand-muted",
};

export function Badge({ variant = "default", className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
