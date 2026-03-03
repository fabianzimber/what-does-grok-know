"use client";

interface NodeTooltipProps {
  title: string;
  messageCount: number;
  date: string;
  sentiment: number;
  x: number;
  y: number;
}

function sentimentLabel(score: number): string {
  if (score > 0.3) return "Positive";
  if (score < -0.3) return "Negative";
  return "Neutral";
}

function sentimentIndicator(score: number): string {
  if (score > 0.3) return "text-green-400";
  if (score < -0.3) return "text-red-400";
  return "text-yellow-400";
}

export function NodeTooltip({ title, messageCount, date, sentiment, x, y }: NodeTooltipProps) {
  return (
    <div
      className="absolute z-50 pointer-events-none"
      style={{
        transform: `translate(${x + 12}px, ${y - 40}px)`,
        left: 0,
        top: 0,
      }}
    >
      <div className="px-4 py-3 rounded-xl bg-black/85 backdrop-blur-xl border border-white/20 shadow-2xl max-w-[260px]">
        <p className="text-white text-sm font-semibold leading-snug truncate">{title}</p>
        <div className="mt-1.5 flex flex-col gap-0.5">
          <span className="text-white/50 text-[10px]">{messageCount} messages</span>
          <span className="text-white/50 text-[10px]">{date}</span>
          <span className={`text-[10px] font-medium ${sentimentIndicator(sentiment)}`}>
            {sentimentLabel(sentiment)} ({sentiment > 0 ? "+" : ""}
            {sentiment.toFixed(2)})
          </span>
        </div>
      </div>
    </div>
  );
}
