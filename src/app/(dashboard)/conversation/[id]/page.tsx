"use client";

import { ConversationViewer } from "@/components/shared/conversation-viewer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getModelColor, getModelLabel } from "@/lib/constants/models";
import { getConversation, getMessages } from "@/lib/storage/db-queries";
import type { ParsedConversation, ParsedMessage } from "@/lib/types/grok-data";
import { formatDate } from "@/lib/utils/date-utils";
import { formatNumber } from "@/lib/utils/format-utils";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ConversationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [conversation, setConversation] = useState<ParsedConversation | null>(null);
  const [messages, setMessages] = useState<ParsedMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    Promise.all([getConversation(id), getMessages(id)]).then(([convData, msgData]) => {
      if (!cancelled) {
        setConversation(convData ?? null);
        setMessages(msgData);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64 rounded-lg" />
        <Skeleton className="h-4 w-48 rounded" />
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={`msg-skel-${i}`} className="h-20 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="text-center py-20">
        <p className="text-lg text-brand-muted mb-4">Conversation not found</p>
        <Button onClick={() => router.push("/timeline")}>Back to Timeline</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <button
          type="button"
          onClick={() => router.push("/timeline")}
          className="inline-flex items-center gap-1 text-sm text-brand-muted hover:text-brand-primary transition-colors mb-4 cursor-pointer"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          Back to Timeline
        </button>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-brand-text mb-1">
              {conversation.starred && <span className="text-yellow-500 mr-2">&#9733;</span>}
              {conversation.title || "Untitled conversation"}
            </h1>
            <p className="text-sm text-brand-muted">
              {formatDate(new Date(conversation.createdAt))}
              <span className="mx-1.5">&middot;</span>
              {formatNumber(conversation.messageCount)} messages
              <span className="mx-1.5">&middot;</span>
              {conversation.humanMessages} from you, {conversation.assistantMessages} from Grok
            </p>
          </div>
        </div>

        {conversation.models.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {conversation.models.map((model) => (
              <span
                key={model}
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                style={{
                  backgroundColor: `${getModelColor(model)}15`,
                  color: getModelColor(model),
                }}
              >
                {getModelLabel(model)}
              </span>
            ))}
            {conversation.language !== "en" && (
              <Badge variant="muted">{conversation.language.toUpperCase()}</Badge>
            )}
          </div>
        )}
      </div>

      <div className="bg-white/50 backdrop-blur-sm border border-white/30 rounded-2xl p-4">
        <ConversationViewer messages={messages} />
      </div>
    </div>
  );
}
