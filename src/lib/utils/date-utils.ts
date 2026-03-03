import type { MongoDate } from "../types/grok-data";

export function parseMongoDate(mongoDate: MongoDate): Date {
  const ms = Number.parseInt(mongoDate.$date.$numberLong, 10);
  return new Date(ms);
}

export function parseISODate(dateStr: string): Date {
  return new Date(dateStr);
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(date: Date): string {
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getHour(date: Date): number {
  return date.getHours();
}

export function getDayOfWeek(date: Date): number {
  return date.getDay();
}

export function daysBetween(a: Date, b: Date): number {
  return Math.abs(a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24);
}
