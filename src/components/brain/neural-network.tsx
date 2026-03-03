"use client";

import type { TopicCluster } from "@/lib/types/analysis";
import type { BrainNode, ColorMode } from "@/lib/types/visualization";
import { type ColorContext, getNodeColor } from "@/lib/visualization/color-scales";
import { type ThreeEvent, useFrame } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

interface NeuralNetworkProps {
  nodes: BrainNode[];
  colorMode: ColorMode;
  clusters: TopicCluster[];
  onNodeClick: (conversationId: string) => void;
  onNodeHover?: (node: { id: string; title: string; x: number; y: number } | null) => void;
}

const tempObject = new THREE.Object3D();
const tempColor = new THREE.Color();

export function NeuralNetwork({
  nodes,
  colorMode,
  clusters,
  onNodeClick,
  onNodeHover,
}: NeuralNetworkProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const hoveredRef = useRef<number | null>(null);
  const breathRef = useRef(0);

  const colorCtx = useMemo<ColorContext>(() => {
    const dates = nodes.map((n) => new Date(n.date).getTime());
    const counts = nodes.map((n) => n.messageCount);
    return {
      clusters,
      minDate: new Date(Math.min(...dates)),
      maxDate: new Date(Math.max(...dates)),
      maxMessageCount: Math.max(...counts, 1),
    };
  }, [nodes, clusters]);

  const colors = useMemo(() => {
    return nodes.map((node) => {
      const hex = getNodeColor(node, colorMode, colorCtx);
      return new THREE.Color(hex);
    });
  }, [nodes, colorMode, colorCtx]);

  // Set initial positions and colors via useEffect (mesh must be mounted)
  useEffect(() => {
    if (!meshRef.current) return;
    const mesh = meshRef.current;

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      tempObject.position.set(node.position[0], node.position[1], node.position[2]);
      tempObject.scale.setScalar(node.size);
      tempObject.updateMatrix();
      mesh.setMatrixAt(i, tempObject.matrix);
      mesh.setColorAt(i, colors[i]);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [nodes, colors]);

  // Breathing animation + hover highlight
  useFrame((_, delta) => {
    if (!meshRef.current) return;
    breathRef.current += delta;
    const breath = Math.sin(breathRef.current * 0.8) * 0.05 + 1;
    const mesh = meshRef.current;

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const isHovered = hoveredRef.current === i;
      const scale = node.size * breath * (isHovered ? 1.4 : 1);

      tempObject.position.set(node.position[0], node.position[1], node.position[2]);
      tempObject.scale.setScalar(scale);
      tempObject.updateMatrix();
      mesh.setMatrixAt(i, tempObject.matrix);

      if (isHovered) {
        tempColor.set("#ffffff");
        mesh.setColorAt(i, tempColor);
      } else {
        mesh.setColorAt(i, colors[i]);
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  });

  const handlePointerOver = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      const idx = e.instanceId;
      if (idx === undefined || idx >= nodes.length) return;
      hoveredRef.current = idx;
      document.body.style.cursor = "pointer";
      const node = nodes[idx];
      onNodeHover?.({
        id: node.id,
        title: node.title,
        x: e.nativeEvent.clientX,
        y: e.nativeEvent.clientY,
      });
    },
    [nodes, onNodeHover],
  );

  const handlePointerOut = useCallback(() => {
    hoveredRef.current = null;
    document.body.style.cursor = "auto";
    onNodeHover?.(null);
  }, [onNodeHover]);

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      const idx = e.instanceId;
      if (idx === undefined || idx >= nodes.length) return;
      onNodeClick(nodes[idx].conversationId);
    },
    [nodes, onNodeClick],
  );

  if (nodes.length === 0) return null;

  const mesh = (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, nodes.length]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      <sphereGeometry args={[1, 16, 12]} />
      <meshStandardMaterial
        roughness={0.3}
        metalness={0.1}
        emissive="#4040ff"
        emissiveIntensity={0.4}
      />
    </instancedMesh>
  );

  return mesh;
}
