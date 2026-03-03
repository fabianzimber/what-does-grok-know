"use client";

import { Card } from "@/components/ui/card";
import { getModelColor, getModelLabel } from "@/lib/constants/models";
import type { BehavioralProfile } from "@/lib/types/analysis";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface BehavioralPanelProps {
  profile: BehavioralProfile;
}

const HOUR_LABELS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function BehavioralPanel({ profile }: BehavioralPanelProps) {
  const hourlyData = HOUR_LABELS.map((label, i) => ({
    hour: label,
    count: profile.peakHours[i] ?? 0,
  }));

  const dailyData = DAY_LABELS.map((label, i) => ({
    day: label,
    count: profile.peakDays[i] ?? 0,
  }));

  const modelEntries = Object.entries(profile.modelPreferences);
  const modelData = modelEntries.map(([model, count]) => ({
    name: getModelLabel(model),
    value: count,
    color: getModelColor(model),
  }));

  return (
    <div className="space-y-6">
      <Card>
        <h4 className="text-sm font-semibold text-brand-text mb-4">Hourly Activity</h4>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyData}>
              <XAxis dataKey="hour" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  background: "#1a1a1a",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "12px",
                }}
                labelFormatter={(v) => `${v}:00`}
              />
              <Bar dataKey="count" fill="#e63946" radius={[4, 4, 0, 0]} maxBarSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h4 className="text-sm font-semibold text-brand-text mb-4">Daily Activity</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData}>
                <XAxis dataKey="day" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    background: "#1a1a1a",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h4 className="text-sm font-semibold text-brand-text mb-4">Model Usage</h4>
          {modelData.length > 0 ? (
            <div className="flex items-center gap-4">
              <div className="h-48 w-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={modelData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      dataKey="value"
                      paddingAngle={2}
                    >
                      {modelData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "#1a1a1a",
                        border: "none",
                        borderRadius: "8px",
                        color: "#fff",
                        fontSize: "12px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col gap-2">
                {modelData.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-xs text-brand-text">{entry.name}</span>
                    <span className="text-xs text-brand-muted ml-auto">{entry.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-brand-muted">No model data available</p>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <p className="text-2xl font-bold text-brand-primary">
            {profile.avgMessagesPerConversation.toFixed(1)}
          </p>
          <p className="text-xs text-brand-muted mt-1">Avg Messages/Chat</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-brand-accent">
            {profile.avgSessionLength.toFixed(0)}
          </p>
          <p className="text-xs text-brand-muted mt-1">Avg Session (min)</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-brand-primary">
            {(profile.toolUsageRate * 100).toFixed(1)}%
          </p>
          <p className="text-xs text-brand-muted mt-1">Tool Usage</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-brand-accent">
            {(profile.thinkingTraceRate * 100).toFixed(1)}%
          </p>
          <p className="text-xs text-brand-muted mt-1">Thinking Traces</p>
        </Card>
      </div>
    </div>
  );
}
