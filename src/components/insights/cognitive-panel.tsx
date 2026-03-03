"use client";

import { Card } from "@/components/ui/card";
import type { CognitiveProfile } from "@/lib/types/analysis";
import { formatNumber, formatPercent } from "@/lib/utils/format-utils";

interface CognitivePanelProps {
  profile: CognitiveProfile;
}

interface GaugeProps {
  label: string;
  value: number;
  maxValue?: number;
  displayValue: string;
  description?: string;
}

function Gauge({ label, value, maxValue = 1, displayValue, description }: GaugeProps) {
  const percent = Math.min((value / maxValue) * 100, 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-brand-text">{label}</span>
        <span className="text-sm font-semibold text-brand-primary">{displayValue}</span>
      </div>
      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-primary to-brand-accent transition-all duration-700 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      {description && <p className="text-xs text-brand-muted">{description}</p>}
    </div>
  );
}

function getRichnessLabel(value: number): string {
  if (value >= 0.8) return "Exceptional";
  if (value >= 0.6) return "Rich";
  if (value >= 0.4) return "Moderate";
  if (value >= 0.2) return "Basic";
  return "Limited";
}

function getQuestionLabel(ratio: number): string {
  if (ratio >= 0.5) return "Very Inquisitive";
  if (ratio >= 0.3) return "Inquisitive";
  if (ratio >= 0.15) return "Balanced";
  return "Directive";
}

export function CognitivePanel({ profile }: CognitivePanelProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="text-center">
          <p className="text-3xl font-bold text-brand-primary">
            {formatNumber(profile.uniqueWords)}
          </p>
          <p className="text-xs text-brand-muted mt-1">Unique Words</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-brand-accent">{formatNumber(profile.totalWords)}</p>
          <p className="text-xs text-brand-muted mt-1">Total Words</p>
        </Card>
        <Card className="text-center col-span-2 md:col-span-1">
          <p className="text-3xl font-bold text-brand-primary">
            {profile.avgMessageLength.toFixed(0)}
          </p>
          <p className="text-xs text-brand-muted mt-1">Avg Message Length (chars)</p>
        </Card>
      </div>

      <Card>
        <h4 className="text-sm font-semibold text-brand-text mb-6">Cognitive Indicators</h4>
        <div className="space-y-6">
          <Gauge
            label="Vocabulary Richness"
            value={profile.vocabularyRichness}
            displayValue={`${formatPercent(profile.vocabularyRichness)} - ${getRichnessLabel(profile.vocabularyRichness)}`}
            description="Ratio of unique words to total words (type-token ratio)"
          />
          <Gauge
            label="Question Ratio"
            value={profile.questionRatio}
            displayValue={`${formatPercent(profile.questionRatio)} - ${getQuestionLabel(profile.questionRatio)}`}
            description="How often you ask questions vs. make statements"
          />
          <Gauge
            label="Code Usage"
            value={profile.codeBlockRatio}
            displayValue={formatPercent(profile.codeBlockRatio)}
            description="Messages containing code blocks"
          />
          <Gauge
            label="Topic Breadth"
            value={profile.topicBreadth}
            maxValue={Math.max(profile.topicBreadth, 20)}
            displayValue={`${profile.topicBreadth} topics`}
            description="Number of distinct topics discussed"
          />
        </div>
      </Card>
    </div>
  );
}
