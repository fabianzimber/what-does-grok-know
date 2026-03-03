"use client";

import type { BrainEdge, BrainNode } from "@/lib/types/visualization";
import { useMemo } from "react";
import * as THREE from "three";

interface EdgeConnectionsProps {
  edges: BrainEdge[];
  nodes: BrainNode[];
}

export function EdgeConnections({ edges, nodes }: EdgeConnectionsProps) {
  const positionLookup = useMemo(() => {
    const map = new Map<string, [number, number, number]>();
    for (const node of nodes) {
      map.set(node.id, node.position);
    }
    return map;
  }, [nodes]);

  const geometry = useMemo(() => {
    const positions: number[] = [];

    for (const edge of edges) {
      const sourcePos = positionLookup.get(edge.source);
      const targetPos = positionLookup.get(edge.target);
      if (!sourcePos || !targetPos) continue;

      positions.push(sourcePos[0], sourcePos[1], sourcePos[2]);
      positions.push(targetPos[0], targetPos[1], targetPos[2]);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, [edges, positionLookup]);

  if (edges.length === 0) return null;

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial
        color="#ffffff"
        transparent
        opacity={0.2}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
}
