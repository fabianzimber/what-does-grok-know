"use client";

import { GradientText } from "@/components/shared/gradient-text";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-30 glass-brand border-b border-brand-primary/10 shadow-sm">
      <div className="flex items-center justify-between px-4 h-12">
        <h1 className="text-lg font-bold md:hidden">
          <GradientText>What Does Grok Know?</GradientText>
        </h1>

        <div className="hidden md:block" />

        <Link href="/">
          <Button variant="secondary" size="sm">
            New Import
          </Button>
        </Link>
      </div>
    </header>
  );
}
