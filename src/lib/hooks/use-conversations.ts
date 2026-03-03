"use client";

import {
  getAllConversations,
  getConversation as getConversationById,
  getConversationCount,
} from "@/lib/storage/db-queries";
import type { ParsedConversation } from "@/lib/types/grok-data";
import { useCallback, useEffect, useState } from "react";

export function useConversations() {
  const [conversations, setConversations] = useState<ParsedConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState(0);

  const loadConversations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [data, total] = await Promise.all([getAllConversations(), getConversationCount()]);
      setConversations(data);
      setCount(total);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const getConversation = useCallback(
    async (id: string): Promise<ParsedConversation | undefined> => {
      const local = conversations.find((c) => c.id === id);
      if (local) return local;
      return getConversationById(id);
    },
    [conversations],
  );

  const refresh = useCallback(() => {
    loadConversations();
  }, [loadConversations]);

  return {
    conversations,
    loading,
    error,
    count,
    getConversation,
    refresh,
  };
}
