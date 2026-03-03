"use client";

import { cn } from "@/lib/utils/format-utils";

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onTabChange, className }: TabsProps) {
  return (
    <div className={cn("flex gap-1 border-b border-brand-border", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "px-4 py-2.5 text-sm font-medium transition-all duration-200 relative cursor-pointer",
            activeTab === tab.id ? "text-brand-primary" : "text-brand-muted hover:text-brand-text",
          )}
        >
          {tab.label}
          {activeTab === tab.id && (
            <>
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-primary/0 via-brand-primary to-brand-primary/0 rounded-full" />
              <span className="absolute inset-0 bg-brand-primary/5 rounded-lg" />
            </>
          )}
        </button>
      ))}
    </div>
  );
}
