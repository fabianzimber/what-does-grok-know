import type { Memory } from "@/lib/types/analysis";
import { formatDate } from "@/lib/utils/date-utils";
import Link from "next/link";

interface MemoryCardProps {
  memory: Memory;
}

const TYPE_CONFIG: Record<Memory["type"], { label: string; color: string; bgColor: string }> = {
  fact: { label: "Fact", color: "text-blue-700", bgColor: "bg-blue-50" },
  decision: { label: "Decision", color: "text-purple-700", bgColor: "bg-purple-50" },
  learning: { label: "Learning", color: "text-green-700", bgColor: "bg-green-50" },
  preference: { label: "Preference", color: "text-orange-700", bgColor: "bg-orange-50" },
  goal: { label: "Goal", color: "text-rose-700", bgColor: "bg-rose-50" },
};

export function MemoryCard({ memory }: MemoryCardProps) {
  const config = TYPE_CONFIG[memory.type];
  const confidencePercent = Math.round(memory.confidence * 100);

  return (
    <div className="bg-white/70 backdrop-blur-sm border border-white/30 rounded-2xl p-5 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-start justify-between gap-3 mb-3">
        <span
          className={
            "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium $" +
            "{config.bgColor} $" +
            "{config.color}"
          }
        >
          {config.label}
        </span>
        <span className="text-xs text-brand-muted">{formatDate(new Date(memory.date))}</span>
      </div>

      <p className="text-sm text-brand-text leading-relaxed mb-4">{memory.content}</p>

      <div className="flex items-center justify-between">
        <Link
          href={"/conversation/$" + "{memory.conversationId}"}
          className="text-xs text-brand-primary hover:underline"
        >
          View source conversation
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-brand-muted">Confidence</span>
          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-primary to-brand-accent"
              style={{ width: "$" + "{confidencePercent}%" }}
            />
          </div>
          <span className="text-[10px] font-medium text-brand-text">{confidencePercent}%</span>
        </div>
      </div>
    </div>
  );
}
