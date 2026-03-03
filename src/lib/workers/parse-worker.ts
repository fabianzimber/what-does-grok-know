import type { GrokExport, MongoDate, ParsedConversation, ParsedMessage } from "../types/grok-data";

function parseMongoDate(md: MongoDate): Date {
  return new Date(Number.parseInt(md.$date.$numberLong, 10));
}

function detectLanguage(text: string): "en" | "de" | "mixed" {
  const germanWords = /\b(und|der|die|das|ist|ich|ein|nicht|mit|auf|für|den|von|sie|sich)\b/gi;
  const matches = text.match(germanWords);
  const ratio = (matches?.length ?? 0) / (text.split(/\s+/).length || 1);
  if (ratio > 0.08) return "de";
  return "en";
}

self.onmessage = async (e: MessageEvent<{ type: string; data: string }>) => {
  if (e.data.type !== "parse") return;

  try {
    self.postMessage({
      type: "progress",
      phase: "parsing",
      percent: 5,
      message: "Parsing JSON...",
    });

    const raw: GrokExport = JSON.parse(e.data.data);
    const conversations: ParsedConversation[] = [];
    const messages: ParsedMessage[] = [];
    const total = raw.conversations.length;

    for (let i = 0; i < total; i++) {
      const entry = raw.conversations[i];
      const conv = entry.conversation;
      const responses = entry.responses;

      let humanCount = 0;
      let assistantCount = 0;
      let totalChars = 0;
      const models = new Set<string>();
      let hasThinking = false;
      let hasToolUse = false;
      const allText: string[] = [];

      for (const r of responses) {
        const resp = r.response;
        const sender = resp.sender === "human" ? ("human" as const) : ("assistant" as const);
        if (sender === "human") humanCount++;
        else assistantCount++;

        totalChars += resp.message.length;
        if (resp.model) models.add(resp.model);
        if (resp.agent_thinking_traces?.length) hasThinking = true;
        if (resp.steps?.length) hasToolUse = true;
        if (sender === "human") allText.push(resp.message);

        messages.push({
          id: resp._id,
          conversationId: conv.id,
          text: resp.message,
          sender,
          createdAt: parseMongoDate(resp.create_time),
          model: resp.model,
          hasThinking: !!resp.agent_thinking_traces?.length,
          hasSteps: !!resp.steps?.length,
          parentId: resp.parent_response_id,
        });
      }

      const msgCount = humanCount + assistantCount;
      conversations.push({
        id: conv.id,
        title: conv.title || "Untitled",
        createdAt: new Date(conv.create_time),
        modifiedAt: new Date(conv.modify_time),
        starred: conv.starred,
        messageCount: msgCount,
        humanMessages: humanCount,
        assistantMessages: assistantCount,
        models: Array.from(models),
        hasThinkingTraces: hasThinking,
        hasToolUse,
        avgMessageLength: msgCount > 0 ? totalChars / msgCount : 0,
        totalCharacters: totalChars,
        language: detectLanguage(allText.join(" ")),
      });

      if (i % 20 === 0) {
        const pct = 5 + Math.round((i / total) * 90);
        self.postMessage({
          type: "progress",
          phase: "parsing",
          percent: pct,
          message: `Parsed ${i}/${total} conversations`,
        });
      }
    }

    self.postMessage({
      type: "complete",
      conversations,
      messages,
      stats: {
        totalConversations: conversations.length,
        totalMessages: messages.length,
        totalHuman: conversations.reduce((s, c) => s + c.humanMessages, 0),
        totalAssistant: conversations.reduce((s, c) => s + c.assistantMessages, 0),
      },
    });
  } catch (err) {
    self.postMessage({ type: "error", message: (err as Error).message });
  }
};
