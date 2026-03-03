import type { TopicCluster } from "./analysis";

export interface BrainNode {
  id: string;
  position: [number, number, number];
  size: number;
  color: string;
  clusterId: string;
  conversationId: string;
  title: string;
  messageCount: number;
  sentiment: number;
  date: Date;
}

export interface BrainEdge {
  source: string;
  target: string;
  weight: number;
}

export interface BrainGraph {
  nodes: BrainNode[];
  edges: BrainEdge[];
  clusters: TopicCluster[];
}

export type ColorMode = "topic" | "sentiment" | "time" | "model" | "activity";
