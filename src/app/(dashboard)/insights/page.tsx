"use client";

import { BehavioralPanel } from "@/components/insights/behavioral-panel";
import { CognitivePanel } from "@/components/insights/cognitive-panel";
import { DeepInsightsPanel } from "@/components/insights/deep-insights-panel";
import { EmotionalPanel } from "@/components/insights/emotional-panel";
import { OverviewStats } from "@/components/insights/overview-stats";
import { AnalysisGate } from "@/components/shared/analysis-gate";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs } from "@/components/ui/tabs";
import { useAnalysisContext } from "@/lib/context/analysis-provider";
import { getAllConversations } from "@/lib/storage/db-queries";
import type { ParsedConversation } from "@/lib/types/grok-data";
import { useEffect, useState } from "react";

const INSIGHT_TABS = [
  { id: "overview", label: "Overview" },
  { id: "behavioral", label: "Behavioral" },
  { id: "cognitive", label: "Cognitive" },
  { id: "emotional", label: "Emotional" },
  { id: "deep", label: "Deep Insights" },
];

export default function InsightsPage() {
  const { analysis } = useAnalysisContext();
  const [conversations, setConversations] = useState<ParsedConversation[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getAllConversations().then((convData) => {
      if (!cancelled) {
        setConversations(convData);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-text mb-1">Insights</h1>
          <p className="text-sm text-brand-muted">Deep analysis of your Grok usage patterns</p>
        </div>
        <Skeleton className="h-10 w-96 rounded-lg" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={`stat-${i}`} className="h-28 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-brand-text mb-1">Insights</h1>
        <p className="text-sm text-brand-muted">Deep analysis of your Grok usage patterns</p>
      </div>

      <AnalysisGate>
        {analysis ? (
          <>
            <Tabs tabs={INSIGHT_TABS} activeTab={activeTab} onTabChange={setActiveTab} />
            {activeTab === "overview" && <OverviewStats stats={analysis.overview} />}
            {activeTab === "behavioral" && <BehavioralPanel profile={analysis.behavioral} />}
            {activeTab === "cognitive" && <CognitivePanel profile={analysis.cognitive} />}
            {activeTab === "emotional" && <EmotionalPanel sentiments={analysis.sentiment} />}
            {activeTab === "deep" && (
              <DeepInsightsPanel
                topics={analysis.topics}
                conversations={conversations}
                sentiments={analysis.sentiment}
              />
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-brand-muted">
              No analysis data available. Upload your Grok export to get started.
            </p>
          </div>
        )}
      </AnalysisGate>
    </div>
  );
}
