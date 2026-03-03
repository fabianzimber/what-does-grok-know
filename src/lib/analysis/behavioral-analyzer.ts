import type { BehavioralProfile } from "@/lib/types/analysis";
import type { ParsedConversation, ParsedMessage } from "@/lib/types/grok-data";

export function analyzeBehavior(
  conversations: ParsedConversation[],
  messages: ParsedMessage[],
): BehavioralProfile {
  const peakHours = new Array<number>(24).fill(0);
  const peakDays = new Array<number>(7).fill(0);

  const humanMessages = messages.filter((m) => m.sender === "human");
  for (const msg of humanMessages) {
    const date = new Date(msg.createdAt);
    peakHours[date.getHours()]++;
    peakDays[date.getDay()]++;
  }

  const maxHour = Math.max(...peakHours, 1);
  const maxDay = Math.max(...peakDays, 1);
  const normalizedHours = peakHours.map((v) => v / maxHour);
  const normalizedDays = peakDays.map((v) => v / maxDay);

  const SESSION_GAP_MS = 30 * 60 * 1000;
  const sortedMsgs = [...humanMessages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  const sessions: Array<{ start: number; end: number }> = [];
  let sessionStart = 0;
  let sessionEnd = 0;

  for (let i = 0; i < sortedMsgs.length; i++) {
    const time = new Date(sortedMsgs[i].createdAt).getTime();
    if (i === 0) {
      sessionStart = time;
      sessionEnd = time;
      continue;
    }
    if (time - sessionEnd > SESSION_GAP_MS) {
      sessions.push({ start: sessionStart, end: sessionEnd });
      sessionStart = time;
    }
    sessionEnd = time;
  }
  if (sortedMsgs.length > 0) {
    sessions.push({ start: sessionStart, end: sessionEnd });
  }

  const avgSessionLength =
    sessions.length > 0
      ? sessions.reduce((sum, s) => sum + (s.end - s.start), 0) / sessions.length / 60000
      : 0;

  const avgMessagesPerConversation =
    conversations.length > 0 ? messages.length / conversations.length : 0;

  const modelPreferences: Record<string, number> = {};
  for (const msg of messages) {
    if (msg.model) {
      modelPreferences[msg.model] = (modelPreferences[msg.model] ?? 0) + 1;
    }
  }

  const toolConversations = conversations.filter((c) => c.hasToolUse).length;
  const toolUsageRate = conversations.length > 0 ? toolConversations / conversations.length : 0;

  const thinkingConversations = conversations.filter((c) => c.hasThinkingTraces).length;
  const thinkingTraceRate =
    conversations.length > 0 ? thinkingConversations / conversations.length : 0;

  return {
    peakHours: normalizedHours,
    peakDays: normalizedDays,
    avgSessionLength: Math.round(avgSessionLength * 10) / 10,
    avgMessagesPerConversation: Math.round(avgMessagesPerConversation * 10) / 10,
    modelPreferences,
    toolUsageRate: Math.round(toolUsageRate * 1000) / 1000,
    thinkingTraceRate: Math.round(thinkingTraceRate * 1000) / 1000,
  };
}
