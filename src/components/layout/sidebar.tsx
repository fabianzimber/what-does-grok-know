"use client";

import { cn } from "@/lib/utils/format-utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { href: "/brain", label: "Brain", icon: "\u{1F9E0}" },
  { href: "/timeline", label: "Timeline", icon: "\u{1F4C5}" },
  { href: "/topics", label: "Topics", icon: "\u{1F4A1}" },
  { href: "/insights", label: "Insights", icon: "\u{1F4CA}" },
  { href: "/memories", label: "Memories", icon: "\u{1F516}" },
  { href: "/search", label: "Search", icon: "\u{1F50D}" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 glass-brand border-r border-brand-primary/15 hidden md:flex flex-col z-40">
      <div className="p-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">{"\u{1F9E0}"}</span>
          <span className="font-bold text-brand-text gradient-text text-lg">GrokBrain</span>
        </Link>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                active
                  ? "bg-gradient-to-r from-brand-primary/15 to-brand-accent/5 text-brand-primary border border-brand-primary/15"
                  : "text-brand-muted hover:bg-white/40 hover:text-brand-text",
              )}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-brand-primary/15">
        <p className="text-xs text-brand-muted text-center font-medium">What Does Grok Know?</p>
        <div className="w-full h-px bg-gradient-to-r from-brand-primary/0 via-brand-primary/30 to-brand-primary/0 mt-2" />
      </div>
    </aside>
  );
}
