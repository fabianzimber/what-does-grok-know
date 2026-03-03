"use client";

import { Card } from "@/components/ui/card";
import type { ConversationSentiment } from "@/lib/types/analysis";
import { useMemo } from "react";
import {
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface EmotionalPanelProps {
  sentiments: ConversationSentiment[];
  positiveWords?: string[];
  negativeWords?: string[];
}

function getSentimentLabel(score: number): string {
  if (score >= 0.5) return "Very Positive";
  if (score >= 0.15) return "Positive";
  if (score > -0.15) return "Neutral";
  if (score > -0.5) return "Negative";
  return "Very Negative";
}

function getSentimentColor(score: number): string {
  if (score >= 0.15) return "text-green-600";
  if (score > -0.15) return "text-yellow-600";
  return "text-red-500";
}

export function EmotionalPanel({
  sentiments,
  positiveWords = [],
  negativeWords = [],
}: EmotionalPanelProps) {
  const chartData = useMemo(() => {
    return sentiments.map((s, i) => ({
      index: i + 1,
      score: s.overall,
    }));
  }, [sentiments]);

  const overallScore = useMemo(() => {
    if (sentiments.length === 0) return 0;
    const sum = sentiments.reduce((acc, s) => acc + s.overall, 0);
    return sum / sentiments.length;
  }, [sentiments]);

  const positiveCount = sentiments.filter((s) => s.overall > 0.1).length;
  const negativeCount = sentiments.filter((s) => s.overall < -0.1).length;
  const neutralCount = sentiments.length - positiveCount - negativeCount;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center md:col-span-1">
          <p className={`text-3xl font-bold ${getSentimentColor(overallScore)}`}>
            {overallScore.toFixed(2)}
          </p>
          <p className="text-xs text-brand-muted mt-1">
            Overall: {getSentimentLabel(overallScore)}
          </p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-green-600">{positiveCount}</p>
          <p className="text-xs text-brand-muted mt-1">Positive Chats</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-yellow-600">{neutralCount}</p>
          <p className="text-xs text-brand-muted mt-1">Neutral Chats</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-red-500">{negativeCount}</p>
          <p className="text-xs text-brand-muted mt-1">Negative Chats</p>
        </Card>
      </div>

      <Card>
        <h4 className="text-sm font-semibold text-brand-text mb-4">Sentiment Over Time</h4>
        {chartData.length > 0 ? (
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis
                  dataKey="index"
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  label={{
                    value: "Conversation #",
                    position: "insideBottom",
                    offset: -5,
                    fontSize: 11,
                  }}
                />
                <YAxis domain={[-1, 1]} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "#1a1a1a",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => [value.toFixed(3), "Sentiment"]}
                />
                <ReferenceLine y={0} stroke="#9ca3af" strokeDasharray="3 3" />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#e63946"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: "#e63946" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-sm text-brand-muted py-8 text-center">No sentiment data available</p>
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h4 className="text-sm font-semibold text-green-600 mb-3">Positive Signals</h4>
          {positiveWords.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {positiveWords.slice(0, 30).map((word) => (
                <span
                  key={word}
                  className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-green-50 text-green-700"
                >
                  {word}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-brand-muted">No data yet</p>
          )}
        </Card>
        <Card>
          <h4 className="text-sm font-semibold text-red-500 mb-3">Negative Signals</h4>
          {negativeWords.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {negativeWords.slice(0, 30).map((word) => (
                <span
                  key={word}
                  className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-red-50 text-red-600"
                >
                  {word}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-brand-muted">No data yet</p>
          )}
        </Card>
      </div>
    </div>
  );
}
