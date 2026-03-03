import type { Memory } from "@/lib/types/analysis";
import type { ParsedMessage } from "@/lib/types/grok-data";

interface MemoryPattern {
  regex: RegExp;
  type: Memory["type"];
  confidence: number;
}

const EN_PATTERNS: MemoryPattern[] = [
  // Facts - personal identity
  { regex: /\bmy name is\s+([^.,!?]+)/i, type: "fact", confidence: 0.95 },
  { regex: /\bi(?:'m| am) (?:a|an)\s+([^.,!?]+)/i, type: "fact", confidence: 0.85 },
  { regex: /\bi work (?:at|for|as|in)\s+([^.,!?]+)/i, type: "fact", confidence: 0.9 },
  { regex: /\bi live (?:in|at|near)\s+([^.,!?]+)/i, type: "fact", confidence: 0.9 },
  { regex: /\bi(?:'m| am) from\s+([^.,!?]+)/i, type: "fact", confidence: 0.85 },
  { regex: /\bi have (?:a |been |worked )\s*([^.,!?]+)/i, type: "fact", confidence: 0.7 },
  { regex: /\bi(?:'m| am) (\d+)\s*(?:years? old)?/i, type: "fact", confidence: 0.9 },
  { regex: /\bmy (?:job|role|position|title) is\s+([^.,!?]+)/i, type: "fact", confidence: 0.85 },
  { regex: /\bi speak\s+([^.,!?]+)/i, type: "fact", confidence: 0.8 },
  { regex: /\bi(?:'m| am) currently\s+([^.,!?]+)/i, type: "fact", confidence: 0.75 },
  { regex: /\bi studied\s+([^.,!?]+)/i, type: "fact", confidence: 0.8 },
  { regex: /\bi majored in\s+([^.,!?]+)/i, type: "fact", confidence: 0.85 },

  // Decisions
  { regex: /\bi(?:'ve| have) decided\s+(?:to\s+)?([^.,!?]+)/i, type: "decision", confidence: 0.9 },
  { regex: /\bi(?:'m| am) going to\s+([^.,!?]+)/i, type: "decision", confidence: 0.7 },
  { regex: /\bi chose\s+([^.,!?]+)/i, type: "decision", confidence: 0.85 },
  {
    regex: /\bi(?:'ll| will) (?:start|begin|switch|move|change)\s+([^.,!?]+)/i,
    type: "decision",
    confidence: 0.75,
  },
  { regex: /\bmy plan is to\s+([^.,!?]+)/i, type: "decision", confidence: 0.8 },

  // Learnings
  {
    regex: /\bi(?:'ve| have) learned\s+(?:that\s+)?([^.,!?]+)/i,
    type: "learning",
    confidence: 0.85,
  },
  { regex: /\bi realized\s+(?:that\s+)?([^.,!?]+)/i, type: "learning", confidence: 0.8 },
  { regex: /\bi found out\s+(?:that\s+)?([^.,!?]+)/i, type: "learning", confidence: 0.8 },
  { regex: /\bi discovered\s+(?:that\s+)?([^.,!?]+)/i, type: "learning", confidence: 0.8 },
  { regex: /\bi understand\s+(?:that\s+)?([^.,!?]+)/i, type: "learning", confidence: 0.7 },
  { regex: /\bnow i know\s+(?:that\s+)?([^.,!?]+)/i, type: "learning", confidence: 0.85 },

  // Preferences
  { regex: /\bi prefer\s+([^.,!?]+)/i, type: "preference", confidence: 0.9 },
  { regex: /\bi(?:'d| would) rather\s+([^.,!?]+)/i, type: "preference", confidence: 0.85 },
  { regex: /\bi really like\s+([^.,!?]+)/i, type: "preference", confidence: 0.75 },
  { regex: /\bi like\s+([^.,!?]+)/i, type: "preference", confidence: 0.7 },
  { regex: /\bi love\s+([^.,!?]+)/i, type: "preference", confidence: 0.75 },
  { regex: /\bi(?:'m| am) a fan of\s+([^.,!?]+)/i, type: "preference", confidence: 0.8 },
  { regex: /\bi (?:don't|do not) like\s+([^.,!?]+)/i, type: "preference", confidence: 0.75 },
  { regex: /\bi hate\s+([^.,!?]+)/i, type: "preference", confidence: 0.75 },
  { regex: /\bmy favorite\s+([^.,!?]+)/i, type: "preference", confidence: 0.85 },

  // Goals
  { regex: /\bi want to\s+([^.,!?]+)/i, type: "goal", confidence: 0.8 },
  { regex: /\bi(?:'m| am) trying to\s+([^.,!?]+)/i, type: "goal", confidence: 0.8 },
  { regex: /\bi hope to\s+([^.,!?]+)/i, type: "goal", confidence: 0.75 },
  { regex: /\bi need to\s+([^.,!?]+)/i, type: "goal", confidence: 0.65 },
  { regex: /\bi wish\s+([^.,!?]+)/i, type: "goal", confidence: 0.7 },
  { regex: /\bmy goal is\s+(?:to\s+)?([^.,!?]+)/i, type: "goal", confidence: 0.9 },
  { regex: /\bi(?:'m| am) working (?:on|towards)\s+([^.,!?]+)/i, type: "goal", confidence: 0.8 },
  { regex: /\bi dream of\s+([^.,!?]+)/i, type: "goal", confidence: 0.75 },
];

const DE_PATTERNS: MemoryPattern[] = [
  { regex: /\bich bin\s+(?:eine?\s+)?([^.,!?]+)/i, type: "fact", confidence: 0.85 },
  { regex: /\bich arbeite\s+(?:als|bei|in|f\u00fcr)\s+([^.,!?]+)/i, type: "fact", confidence: 0.9 },
  { regex: /\bich wohne\s+(?:in|bei|nahe)\s+([^.,!?]+)/i, type: "fact", confidence: 0.9 },
  { regex: /\bich komme aus\s+([^.,!?]+)/i, type: "fact", confidence: 0.85 },
  { regex: /\bmein name ist\s+([^.,!?]+)/i, type: "fact", confidence: 0.95 },
  { regex: /\bich habe\s+([^.,!?]+)/i, type: "fact", confidence: 0.65 },
  { regex: /\bich studiere\s+([^.,!?]+)/i, type: "fact", confidence: 0.8 },
  { regex: /\bich spreche\s+([^.,!?]+)/i, type: "fact", confidence: 0.8 },
  {
    regex: /\bich habe (?:mich )?(?:entschieden|beschlossen)\s+([^.,!?]+)/i,
    type: "decision",
    confidence: 0.9,
  },
  { regex: /\bich werde\s+([^.,!?]+)/i, type: "decision", confidence: 0.7 },
  { regex: /\bich habe gelernt\s+(?:dass\s+)?([^.,!?]+)/i, type: "learning", confidence: 0.85 },
  {
    regex: /\bich habe herausgefunden\s+(?:dass\s+)?([^.,!?]+)/i,
    type: "learning",
    confidence: 0.8,
  },
  { regex: /\bich verstehe\s+(?:dass\s+)?([^.,!?]+)/i, type: "learning", confidence: 0.7 },
  { regex: /\bich bevorzuge\s+([^.,!?]+)/i, type: "preference", confidence: 0.9 },
  { regex: /\bich mag\s+([^.,!?]+)/i, type: "preference", confidence: 0.7 },
  { regex: /\bich liebe\s+([^.,!?]+)/i, type: "preference", confidence: 0.75 },
  { regex: /\bich m\u00f6chte\s+([^.,!?]+)/i, type: "goal", confidence: 0.8 },
  { regex: /\bich will\s+([^.,!?]+)/i, type: "goal", confidence: 0.8 },
  { regex: /\bich versuche\s+([^.,!?]+)/i, type: "goal", confidence: 0.75 },
  { regex: /\bmein ziel ist\s+([^.,!?]+)/i, type: "goal", confidence: 0.9 },
];

function generateId(): string {
  return `mem-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function extractMemories(
  humanMessages: ParsedMessage[],
  maxMemories: number,
  minConfidence: number,
): Memory[] {
  const memories: Memory[] = [];
  const seenContent = new Set<string>();

  for (const msg of humanMessages) {
    const text = msg.text;
    const patterns = [...EN_PATTERNS, ...DE_PATTERNS];

    for (const pattern of patterns) {
      const match = text.match(pattern.regex);
      if (!match?.[1]) continue;

      const content = match[1].trim();
      if (content.length < 3 || content.length > 200) continue;

      const normalized = content.toLowerCase().trim();
      if (seenContent.has(normalized)) continue;
      seenContent.add(normalized);

      if (pattern.confidence < minConfidence) continue;

      memories.push({
        id: generateId(),
        type: pattern.type,
        content: match[0].trim(),
        source: text.slice(0, 120) + (text.length > 120 ? "..." : ""),
        conversationId: msg.conversationId,
        date: new Date(msg.createdAt),
        confidence: pattern.confidence,
      });
    }
  }

  memories.sort((a, b) => b.confidence - a.confidence);
  return memories.slice(0, maxMemories);
}
