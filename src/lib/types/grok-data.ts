export interface MongoDate {
  $date: { $numberLong: string };
}

export interface ThinkingTrace {
  agent_id: { rollout_id: string };
  thinking_trace: string;
}

export interface Step {
  tool_use?: { name: string; args: string };
  result?: string;
}

export interface GrokResponse {
  _id: string;
  conversation_id: string;
  message: string;
  sender: "human" | "ASSISTANT";
  create_time: MongoDate;
  parent_response_id?: string;
  agent_thinking_traces?: ThinkingTrace[];
  steps?: Step[];
  model?: string;
  metadata?: Record<string, unknown>;
}

export interface GrokConversation {
  id: string;
  user_id: string;
  create_time: string;
  modify_time: string;
  title: string;
  summary: string;
  starred: boolean;
  system_prompt_name: string;
  media_types: string[];
  temporary: boolean;
}

export interface ConversationEntry {
  conversation: GrokConversation;
  responses: Array<{ response: GrokResponse; share_link: string | null }>;
}

export interface GrokExport {
  conversations: ConversationEntry[];
  projects?: unknown[];
  tasks?: unknown[];
  media_posts?: unknown[];
}

export interface ParsedConversation {
  id: string;
  title: string;
  createdAt: Date;
  modifiedAt: Date;
  starred: boolean;
  messageCount: number;
  humanMessages: number;
  assistantMessages: number;
  models: string[];
  hasThinkingTraces: boolean;
  hasToolUse: boolean;
  avgMessageLength: number;
  totalCharacters: number;
  language: "en" | "de" | "mixed";
}

export interface ParsedMessage {
  id: string;
  conversationId: string;
  text: string;
  sender: "human" | "assistant";
  createdAt: Date;
  model?: string;
  hasThinking: boolean;
  hasSteps: boolean;
  parentId?: string;
}
