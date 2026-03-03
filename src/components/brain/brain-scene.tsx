"use client";

import type { BrainGraph, ColorMode } from "@/lib/types/visualization";
import dynamic from "next/dynamic";

const BrainCanvas = dynamic(() => import("./brain-canvas"), { ssr: false });

interface BrainSceneProps {
  graph: BrainGraph;
  colorMode: ColorMode;
  onNodeClick: (conversationId: string) => void;
  onNodeHover?: (node: { id: string; title: string; x: number; y: number } | null) => void;
}

export default function BrainScene({
  graph,
  colorMode,
  onNodeClick,
  onNodeHover,
}: BrainSceneProps) {
  return (
    <div className="relative w-full h-full min-h-[400px]">
      {graph.nodes.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-brand-muted">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-brand-primary/20 to-brand-accent/20 animate-pulse" />
            <p className="text-sm">Loading neural network...</p>
          </div>
        </div>
      ) : (
        <BrainCanvas
          graph={graph}
          colorMode={colorMode}
          onNodeClick={onNodeClick}
          onNodeHover={onNodeHover}
        />
      )}
    </div>
  );
}
