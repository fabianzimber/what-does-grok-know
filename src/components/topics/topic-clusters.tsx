"use client";

import type { TopicCluster } from "@/lib/types/analysis";

interface TopicClustersProps {
  clusters: TopicCluster[];
  onClusterClick?: (cluster: TopicCluster) => void;
  activeClusterId?: string | null;
}

export function TopicClusters({ clusters, onClusterClick, activeClusterId }: TopicClustersProps) {
  const maxSize = Math.max(...clusters.map((c) => c.size), 1);

  if (clusters.length === 0) {
    return (
      <div className="text-center py-12 text-brand-muted">
        <p className="text-lg">No topics extracted yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {clusters.map((cluster) => {
        const sizeRatio = cluster.size / maxSize;
        const isActive = activeClusterId === cluster.id;
        const scale = 0.85 + sizeRatio * 0.15;

        return (
          <button
            key={cluster.id}
            type="button"
            onClick={() => onClusterClick?.(cluster)}
            className={`text-left bg-white/70 backdrop-blur-sm border rounded-2xl p-5 transition-all duration-300 hover:shadow-lg cursor-pointer ${
              isActive
                ? "border-brand-primary ring-2 ring-brand-primary/20"
                : "border-white/30 hover:border-brand-primary/20"
            }`}
            style={{ transform: `scale(${scale})` }}
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <h4 className="text-sm font-semibold text-brand-text capitalize leading-tight">
                {cluster.label}
              </h4>
              <span
                className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full text-white text-xs font-bold"
                style={{ backgroundColor: cluster.color }}
              >
                {cluster.size}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {cluster.keywords.slice(0, 8).map((keyword) => (
                <span
                  key={keyword}
                  className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium"
                  style={{
                    backgroundColor: `${cluster.color}15`,
                    color: cluster.color,
                  }}
                >
                  {keyword}
                </span>
              ))}
            </div>

            <div className="mt-3">
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${sizeRatio * 100}%`,
                    backgroundColor: cluster.color,
                  }}
                />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
