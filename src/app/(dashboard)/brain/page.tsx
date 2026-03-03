"use client";

import { BrainControls } from "@/components/brain/brain-controls";
import { BrainLegend } from "@/components/brain/brain-legend";
import BrainScene from "@/components/brain/brain-scene";
import { NodeTooltip } from "@/components/brain/node-tooltip";
import { Progress } from "@/components/ui/progress";
import { useAnalysisContext } from "@/lib/context/analysis-provider";
import { getAllConversations } from "@/lib/storage/db-queries";
import type { ParsedConversation } from "@/lib/types/grok-data";
import type { BrainGraph, ColorMode } from "@/lib/types/visualization";
import { buildBrainGraph } from "@/lib/visualization/cluster-builder";
import { useCallback, useEffect, useMemo, useState } from "react";

interface HoveredNode {
  id: string;
  title: string;
  x: number;
  y: number;
}

export default function BrainPage() {
  const { analysis, isAnalyzing, progress } = useAnalysisContext();
  const [conversations, setConversations] = useState<ParsedConversation[]>([]);
  const [colorMode, setColorMode] = useState<ColorMode>("topic");
  const [hoveredNode, setHoveredNode] = useState<HoveredNode | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllConversations().then((convs) => {
      setConversations(convs);
      setLoading(false);
    });
  }, []);

  const graph: BrainGraph = useMemo(() => {
    if (!analysis || conversations.length === 0) {
      return { nodes: [], edges: [], clusters: [] };
    }
    return buildBrainGraph(conversations, analysis.topics, analysis.sentiment);
  }, [conversations, analysis]);

  const dateRange = useMemo(() => {
    if (conversations.length === 0) return undefined;
    const dates = conversations.map((c) => new Date(c.createdAt));
    const sorted = dates.sort((a, b) => a.getTime() - b.getTime());
    return {
      start: sorted[0].toLocaleDateString(),
      end: sorted[sorted.length - 1].toLocaleDateString(),
    };
  }, [conversations]);

  const nodeMap = useMemo(() => {
    const map = new Map<string, (typeof graph.nodes)[number]>();
    for (const node of graph.nodes) {
      map.set(node.id, node);
    }
    return map;
  }, [graph.nodes]);

  const handleNodeClick = useCallback((conversationId: string) => {
    window.location.href = `/conversation/${conversationId}`;
  }, []);

  const handleNodeHover = useCallback(
    (data: { id: string; title: string; x: number; y: number } | null) => {
      setHoveredNode(data);
    },
    [],
  );

  if (loading) {
    return (
      <div className="h-[calc(100vh-5rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-brand-primary/20 to-brand-accent/20 animate-pulse" />
          <p className="text-brand-muted text-sm">Loading conversations...</p>
        </div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="h-[calc(100vh-5rem)] flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-brand-text font-medium mb-2">No data yet</p>
          <p className="text-brand-muted text-sm">
            Upload your Grok export to visualize your conversations as a neural network.
          </p>
        </div>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="h-[calc(100vh-5rem)] flex items-center justify-center">
        <div className="text-center w-full max-w-sm space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-brand-primary/20 to-brand-accent/20 animate-pulse" />
          <div>
            <p className="text-brand-text font-medium">Building neural network...</p>
            <p className="text-sm text-brand-muted mt-1">{progress.message}</p>
          </div>
          <Progress value={progress.percent} />
          <p className="text-xs text-brand-muted">{progress.percent}%</p>
        </div>
      </div>
    );
  }

  const hovered = hoveredNode ? nodeMap.get(hoveredNode.id) : null;

  return (
    <div className="relative h-[calc(100vh-5rem)] overflow-hidden">
      <BrainScene
        graph={graph}
        colorMode={colorMode}
        onNodeClick={handleNodeClick}
        onNodeHover={handleNodeHover}
      />

      <BrainControls colorMode={colorMode} onColorModeChange={setColorMode} />

      <BrainLegend colorMode={colorMode} clusters={graph.clusters} dateRange={dateRange} />

      {hoveredNode && hovered && (
        <NodeTooltip
          title={hovered.title}
          messageCount={hovered.messageCount}
          date={new Date(hovered.date).toLocaleDateString()}
          sentiment={hovered.sentiment}
          x={hoveredNode.x}
          y={hoveredNode.y}
        />
      )}

      <div className="absolute top-4 left-4 z-10">
        <h1 className="text-white text-sm font-semibold tracking-wide">Neural Network</h1>
        <p className="text-white/40 text-[11px]">
          {graph.nodes.length} conversations / {graph.edges.length} connections
        </p>
      </div>
    </div>
  );
}
