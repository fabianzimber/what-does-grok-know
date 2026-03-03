"use client";

import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";
import type { ParsedMessage } from "@/lib/types/grok-data";
import type { ParsedConversation } from "@/lib/types/grok-data";
import { formatDate } from "@/lib/utils/date-utils";
import { truncate } from "@/lib/utils/format-utils";
import Link from "next/link";

interface SearchResult {
  conversation: ParsedConversation;
  matchingMessages: ParsedMessage[];
}

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[]\]/g, "$&");
}

function highlightQuery(text: string, query: string): ReactNode {
  if (!query.trim()) return <>{text}</>;
  const parts = text.split(new RegExp(`(${escapeRegex(query)})`, "gi"));

  return (
    <>
      {parts.map((part, i) => {
        const isMatch = part.toLowerCase() === query.toLowerCase();
        return isMatch ? (
          <mark
            key={i}
            className="bg-brand-primary/20 text-brand-primary font-medium rounded px-0.5"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        );
      })}
    </>
  );
}

export function SearchResults({ results, query }: SearchResultsProps) {
  if (results.length === 0 && query.trim()) {
    return (
      <div className="text-center py-16 text-brand-muted">
        <p className="text-lg">No results found for &ldquo;{query}&rdquo;</p>
        <p className="text-sm mt-2">Try a different search term</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-16 text-brand-muted">
        <p className="text-lg">Start typing to search your conversations</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {results.map((result) => (
        <Link
          key={result.conversation.id}
          href={`/conversation/${result.conversation.id}`}
          className="block"
        >
          <Card className="hover:border-brand-primary/20 transition-all">
            <h4 className="text-sm font-semibold text-brand-text mb-1">
              {result.conversation.title || "Untitled"}
            </h4>
            <p className="text-xs text-brand-muted mb-2">
              {formatDate(new Date(result.conversation.createdAt))}
              <span className="mx-1">&middot;</span>
              {result.matchingMessages.length} matching messages
            </p>
            {result.matchingMessages.slice(0, 2).map((msg) => (
              <div
                key={msg.id}
                className="text-sm text-brand-text/80 mb-2 pl-3 border-l-2 border-brand-primary/20"
              >
                {highlightQuery(truncate(msg.text, 200), query)}
              </div>
            ))}
          </Card>
        </Link>
      ))}
    </div>
  );
}
