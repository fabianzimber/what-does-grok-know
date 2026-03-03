"use client";

import type { ParsedMessage } from "@/lib/types/grok-data";
import { MessageBubble } from "./message-bubble";

interface ConversationViewerProps {
  messages: ParsedMessage[];
}

export function ConversationViewer({ messages }: ConversationViewerProps) {
  if (messages.length === 0) {
    return (
      <div className="text-center py-16 text-brand-muted">
        <p>No messages in this conversation</p>
      </div>
    );
  }

  return (
    <div className="space-y-1 py-4">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} isHuman={msg.sender === "human"} />
      ))}
    </div>
  );
}
