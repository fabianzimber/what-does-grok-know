export const grokModels: Record<string, { label: string; color: string }> = {
  "grok-3": { label: "Grok 3", color: "#e63946" },
  "grok-3-thinking": { label: "Grok 3 Thinking", color: "#6366f1" },
  "grok-420": { label: "Grok 420", color: "#f4d03f" },
  "grok-2": { label: "Grok 2", color: "#e67e22" },
  "grok-2-imageGen": { label: "Grok 2 ImageGen", color: "#10b981" },
  "grok-3-deepsearch": { label: "Grok 3 DeepSearch", color: "#2c3e50" },
  "grok-3-reasoning": { label: "Grok 3 Reasoning", color: "#8b5cf6" },
  "grok-web": { label: "Grok Web", color: "#06b6d4" },
};

export function getModelColor(model: string): string {
  return grokModels[model]?.color ?? "#9ca3af";
}

export function getModelLabel(model: string): string {
  return grokModels[model]?.label ?? model;
}
