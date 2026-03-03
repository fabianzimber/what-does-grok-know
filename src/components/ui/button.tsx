"use client";

import { cn } from "@/lib/utils/format-utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-br from-brand-primary to-brand-primary/80 text-white rounded-full hover:shadow-lg hover:shadow-brand-primary/25 active:scale-[0.97] shadow-md border border-brand-primary/40",
  secondary:
    "bg-white/80 backdrop-blur-sm border border-brand-border text-brand-text rounded-full hover:bg-white hover:border-brand-primary/20 active:scale-[0.97]",
  ghost:
    "bg-transparent text-brand-text rounded-full hover:bg-brand-primary/8 active:scale-[0.97] border border-transparent hover:border-brand-primary/15",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-1.5 text-sm",
  md: "px-6 py-2.5 text-sm",
  lg: "px-8 py-3 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
