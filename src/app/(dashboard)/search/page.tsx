"use client";

import { SearchResults } from "@/components/search/search-results";
import { SearchInput } from "@/components/ui/search-input";
import { getAllConversations, getAllMessages } from "@/lib/storage/db-queries";
import type { ParsedConversation, ParsedMessage } from "@/lib/types/grok-data";
import { useCallback, useEffect, useRef, useState } from "react";

interface SearchResult {
  conversation: ParsedConversation;
  matchingMessages: ParsedMessage[];
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [conversations, setConversations] = useState<ParsedConversation[]>([]);
  const [messages, setMessages] = useState<ParsedMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getAllConversations(), getAllMessages()]).then(([convData, msgData]) => {
      if (!cancelled) {
        setConversations(convData);
        setMessages(msgData);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const performSearch = useCallback(
    (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      const q = searchQuery.toLowerCase();
      const convMap = new Map<string, ParsedConversation>();
      for (const c of conversations) {
        convMap.set(c.id, c);
      }

      const matchesByConv = new Map<string, ParsedMessage[]>();
      for (const msg of messages) {
        if (msg.text.toLowerCase().includes(q)) {
          const existing = matchesByConv.get(msg.conversationId) ?? [];
          existing.push(msg);
          matchesByConv.set(msg.conversationId, existing);
        }
      }

      const searchResults: SearchResult[] = [];
      for (const [convId, matchingMsgs] of matchesByConv) {
        const conv = convMap.get(convId);
        if (conv) {
          searchResults.push({ conversation: conv, matchingMessages: matchingMsgs });
        }
      }

      searchResults.sort((a, b) => b.matchingMessages.length - a.matchingMessages.length);
      setResults(searchResults);
    },
    [conversations, messages],
  );

  const handleQueryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        performSearch(value);
      }, 300);
    },
    [performSearch],
  );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-brand-text mb-1">Search</h1>
        <p className="text-sm text-brand-muted">Find anything across all your conversations</p>
      </div>

      <SearchInput
        placeholder="Search messages..."
        value={query}
        onChange={handleQueryChange}
        disabled={loading}
      />

      {query.trim() && (
        <p className="text-xs text-brand-muted">
          {results.length} conversation{results.length !== 1 ? "s" : ""} found
        </p>
      )}

      <SearchResults results={results} query={query} />
    </div>
  );
}
