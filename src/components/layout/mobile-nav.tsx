"use client";

import { cn } from "@/lib/utils/format-utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const mobileNavItems: NavItem[] = [
  { href: "/brain", label: "Brain", icon: "🧠" },
  { href: "/timeline", label: "Timeline", icon: "📅" },
  { href: "/topics", label: "Topics", icon: "💡" },
  { href: "/insights", label: "Insights", icon: "📊" },
  { href: "/search", label: "Search", icon: "🔍" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-brand-border md:hidden">
      <div className="flex items-center justify-around h-16">
        {mobileNavItems.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors",
                active ? "text-brand-primary" : "text-brand-muted",
              )}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
