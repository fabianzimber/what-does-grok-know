"use client";

import { Card } from "@/components/ui/card";
import type { ConversationSentiment, TopicCluster } from "@/lib/types/analysis";
import type { ParsedConversation } from "@/lib/types/grok-data";
import { useMemo } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface DeepInsightsPanelProps {
  topics: TopicCluster[];
  sentiments: ConversationSentiment[];
  conversations: ParsedConversation[];
}

interface MonthBucket {
  month: string;
  [topic: string]: string | number;
}

function buildTopicTimeline(
  topics: TopicCluster[],
  conversations: ParsedConversation[],
): MonthBucket[] {
  const convMap = new Map(conversations.map((c) => [c.id, c]));
  const months = new Map<string, Record<string, number>>();

  for (const topic of topics) {
    for (const cid of topic.conversationIds) {
      const conv = convMap.get(cid);
      if (!conv) continue;
      const key = `${conv.createdAt.getFullYear()}-${String(conv.createdAt.getMonth() + 1).padStart(2, "0")}`;
      if (!months.has(key)) months.set(key, {});
      const bucket = months.get(key) ?? {};
      bucket[topic.label] = (bucket[topic.label] ?? 0) + 1;
    }
  }

  return Array.from(months.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, counts]) => ({ month, ...counts }));
}

function getThinkingStats(conversations: ParsedConversation[]) {
  const total = conversations.length;
  const withThinking = conversations.filter((c) => c.hasThinkingTraces).length;
  const withTools = conversations.filter((c) => c.hasToolUse).length;
  const thinkingRate = total > 0 ? withThinking / total : 0;
  const toolRate = total > 0 ? withTools / total : 0;
  return { total, withThinking, withTools, thinkingRate, toolRate };
}

export function DeepInsightsPanel({ topics, sentiments, conversations }: DeepInsightsPanelProps) {
  const timelineData = useMemo(
    () => buildTopicTimeline(topics, conversations),
    [topics, conversations],
  );

  const thinkingStats = useMemo(() => getThinkingStats(conversations), [conversations]);

  const sentimentComparison = useMemo(() => {
    const sentMap = new Map(sentiments.map((s) => [s.conversationId, s]));
    let thinkingTotal = 0;
    let thinkingCount = 0;
    let standardTotal = 0;
    let standardCount = 0;
    for (const conv of conversations) {
      const sent = sentMap.get(conv.id);
      if (!sent) continue;
      if (conv.hasThinkingTraces) {
        thinkingTotal += sent.overall;
        thinkingCount++;
      } else {
        standardTotal += sent.overall;
        standardCount++;
      }
    }
    return {
      thinkingAvg: thinkingCount > 0 ? thinkingTotal / thinkingCount : 0,
      standardAvg: standardCount > 0 ? standardTotal / standardCount : 0,
      thinkingCount,
      standardCount,
    };
  }, [conversations, sentiments]);

  const topTopics = topics.slice(0, 5);

  return (
    <div className="space-y-4">
      <Card>
        <h4 className="text-sm font-semibold text-brand-text mb-2">Topic Evolution Over Time</h4>
        {timelineData.length > 1 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData}>
                <XAxis dataKey="month" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "#1a1a1a",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                {topTopics.map((topic) => (
                  <Area
                    key={topic.id}
                    type="monotone"
                    dataKey={topic.label}
                    stackId="1"
                    fill={topic.color}
                    stroke={topic.color}
                    fillOpacity={0.6}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-sm text-brand-muted py-8 text-center">
            Not enough data for topic timeline
          </p>
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h4 className="text-sm font-semibold text-brand-text mb-2">Thinking Model Usage</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-brand-muted">With Thinking Traces</span>
              <span className="text-lg font-bold text-brand-accent">
                {thinkingStats.withThinking}
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-accent to-brand-primary transition-all duration-500"
                style={{ width: `${(thinkingStats.thinkingRate * 100).toFixed(1)}%` }}
              />
            </div>
            <p className="text-xs text-brand-muted">
              {(thinkingStats.thinkingRate * 100).toFixed(1)}% of conversations use thinking models
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-brand-border">
              <span className="text-sm text-brand-muted">With Tool Use</span>
              <span className="text-lg font-bold text-brand-primary">
                {thinkingStats.withTools}
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-primary to-brand-gold transition-all duration-500"
                style={{ width: `${(thinkingStats.toolRate * 100).toFixed(1)}%` }}
              />
            </div>
            <p className="text-xs text-brand-muted">
              {(thinkingStats.toolRate * 100).toFixed(1)}% of conversations include tool usage
            </p>
          </div>
        </Card>

        <Card>
          <h4 className="text-sm font-semibold text-brand-text mb-2">
            Sentiment: Thinking vs Standard
          </h4>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-xs text-brand-muted mb-2">Thinking Model Conversations</p>
              <p className="text-3xl font-bold text-brand-accent">
                {sentimentComparison.thinkingAvg.toFixed(3)}
              </p>
              <p className="text-xs text-brand-muted mt-1">
                avg sentiment ({sentimentComparison.thinkingCount} chats)
              </p>
            </div>
            <div className="border-t border-brand-border" />
            <div className="text-center">
              <p className="text-xs text-brand-muted mb-2">Standard Conversations</p>
              <p className="text-3xl font-bold text-brand-primary">
                {sentimentComparison.standardAvg.toFixed(3)}
              </p>
              <p className="text-xs text-brand-muted mt-1">
                avg sentiment ({sentimentComparison.standardCount} chats)
              </p>
            </div>
            {sentimentComparison.thinkingCount > 0 && sentimentComparison.standardCount > 0 && (
              <p className="text-xs text-brand-muted text-center pt-2 border-t border-brand-border">
                {sentimentComparison.thinkingAvg > sentimentComparison.standardAvg
                  ? "Thinking model conversations tend to be more positive"
                  : sentimentComparison.thinkingAvg < sentimentComparison.standardAvg
                    ? "Standard conversations tend to be more positive"
                    : "Both modes show similar sentiment patterns"}
              </p>
            )}
          </div>
        </Card>
      </div>

      <Card>
        <h4 className="text-sm font-semibold text-brand-text mb-2">Interest Shifts</h4>
        {topTopics.length > 0 ? (
          <div className="space-y-3">
            {topTopics.map((topic, i) => (
              <div key={topic.id} className="flex items-center gap-3">
                <span
                  className="text-sm font-bold min-w-[1.5rem] text-center"
                  style={{ color: topic.color }}
                >
                  #{i + 1}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-brand-text">{topic.label}</span>
                    <span className="text-xs text-brand-muted">{topic.size} conversations</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${topics.length > 0 ? (topic.size / topics[0].size) * 100 : 0}%`,
                        backgroundColor: topic.color,
                      }}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 max-w-[200px]">
                  {topic.keywords.slice(0, 4).map((kw) => (
                    <span
                      key={kw}
                      className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-brand-muted"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-brand-muted py-8 text-center">No topic data available</p>
        )}
      </Card>
    </div>
  );
}
