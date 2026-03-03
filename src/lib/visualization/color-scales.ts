import { getModelColor } from "@/lib/constants/models";
import type { TopicCluster } from "@/lib/types/analysis";
import type { BrainNode, ColorMode } from "@/lib/types/visualization";

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function clamp01(t: number): number {
  return Math.max(0, Math.min(1, t));
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (v: number) => Math.round(v).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Returns the cluster color for a given cluster id.
 */
export function topicColor(clusterId: string, clusters: TopicCluster[]): string {
  const cluster = clusters.find((c) => c.id === clusterId);
  return cluster?.color ?? "#9ca3af";
}

/**
 * Maps a sentiment score (-1 to 1) to a red -> yellow -> green gradient.
 */
export function sentimentColor(score: number): string {
  const t = clamp01((score + 1) / 2); // normalize -1..1 to 0..1
  let r: number;
  let g: number;
  let b: number;

  if (t < 0.5) {
    // red -> yellow
    const s = t / 0.5;
    r = lerp(230, 244, s);
    g = lerp(57, 208, s);
    b = lerp(70, 63, s);
  } else {
    // yellow -> green
    const s = (t - 0.5) / 0.5;
    r = lerp(244, 16, s);
    g = lerp(208, 185, s);
    b = lerp(63, 129, s);
  }

  return rgbToHex(r, g, b);
}

/**
 * Maps a date within a range to a blue -> red gradient (early to recent).
 */
export function timeColor(date: Date, minDate: Date, maxDate: Date): string {
  const range = maxDate.getTime() - minDate.getTime();
  const t = range > 0 ? clamp01((date.getTime() - minDate.getTime()) / range) : 0.5;

  // Blue (#6366f1) -> Red (#e63946)
  const r = lerp(99, 230, t);
  const g = lerp(102, 57, t);
  const b = lerp(241, 70, t);

  return rgbToHex(r, g, b);
}

/**
 * Returns the color associated with a Grok model.
 */
export function modelColor(model: string): string {
  return getModelColor(model);
}

/**
 * Maps message count to a light -> dark activity intensity.
 * Low activity: light muted (#c4b5fd), high activity: vivid primary (#e63946).
 */
export function activityColor(messageCount: number, max: number): string {
  const t = max > 0 ? clamp01(messageCount / max) : 0;

  // Light purple (#c4b5fd) -> Deep red (#e63946)
  const r = lerp(196, 230, t);
  const g = lerp(181, 57, t);
  const b = lerp(253, 70, t);

  return rgbToHex(r, g, b);
}

export interface ColorContext {
  clusters: TopicCluster[];
  minDate: Date;
  maxDate: Date;
  maxMessageCount: number;
}

/**
 * Main dispatcher: returns the appropriate color for a node given the mode.
 */
export function getNodeColor(node: BrainNode, mode: ColorMode, ctx: ColorContext): string {
  switch (mode) {
    case "topic":
      return topicColor(node.clusterId, ctx.clusters);
    case "sentiment":
      return sentimentColor(node.sentiment);
    case "time":
      return timeColor(node.date, ctx.minDate, ctx.maxDate);
    case "model":
      // Use the cluster color as fallback since node does not store model directly
      return topicColor(node.clusterId, ctx.clusters);
    case "activity":
      return activityColor(node.messageCount, ctx.maxMessageCount);
    default:
      return "#9ca3af";
  }
}
