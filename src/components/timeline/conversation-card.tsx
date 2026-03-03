import { Badge } from "@/components/ui/badge";
import { getModelColor, getModelLabel } from "@/lib/constants/models";
import type { ParsedConversation } from "@/lib/types/grok-data";
import { formatDate } from "@/lib/utils/date-utils";
import { formatNumber } from "@/lib/utils/format-utils";
import Link from "next/link";

interface ConversationCardProps {
  conversation: ParsedConversation;
}

export function ConversationCard({ conversation }: ConversationCardProps) {
  const { id, title, createdAt, messageCount, models, starred, language, hasThinkingTraces } =
    conversation;

  return (
    <Link
      href={`/conversation/${id}`}
      className="block bg-white/70 backdrop-blur-sm border border-white/30 rounded-2xl p-5 transition-all duration-300 hover:shadow-lg hover:border-brand-primary/20 group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {starred && (
              <span className="text-yellow-500 text-sm" aria-label="Starred">
                &#9733;
              </span>
            )}
            <h4 className="text-sm font-semibold text-brand-text truncate group-hover:text-brand-primary transition-colors">
              {title || "Untitled conversation"}
            </h4>
          </div>

          <p className="text-xs text-brand-muted">
            {formatDate(new Date(createdAt))}
            <span className="mx-1.5">&middot;</span>
            {formatNumber(messageCount)} messages
          </p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {language !== "en" && <Badge variant="muted">{language.toUpperCase()}</Badge>}
          {hasThinkingTraces && <Badge variant="accent">Thinking</Badge>}
        </div>
      </div>

      {models.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {models.map((model) => (
            <span
              key={model}
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium"
              style={{
                backgroundColor: `${getModelColor(model)}15`,
                color: getModelColor(model),
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: getModelColor(model) }}
              />
              {getModelLabel(model)}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
