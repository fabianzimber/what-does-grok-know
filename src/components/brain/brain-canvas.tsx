"use client";

import type { BrainGraph, ColorMode } from "@/lib/types/visualization";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { EdgeConnections } from "./edge-connections";
import { NeuralNetwork } from "./neural-network";
import { ParticleField } from "./particle-field";

interface BrainCanvasProps {
  graph: BrainGraph;
  colorMode: ColorMode;
  onNodeClick: (conversationId: string) => void;
  onNodeHover?: (node: { id: string; title: string; x: number; y: number } | null) => void;
}

export default function BrainCanvas({
  graph,
  colorMode,
  onNodeClick,
  onNodeHover,
}: BrainCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 80], fov: 60 }}
      style={{ background: "#111128" }}
      gl={{ antialias: true, alpha: false }}
    >
      <ambientLight intensity={1.5} />
      <pointLight position={[100, 100, 100]} intensity={1.0} />
      <pointLight position={[-50, -50, 50]} intensity={0.8} color="#6366f1" />
      <pointLight position={[0, -80, -40]} intensity={0.5} color="#e63946" />

      <NeuralNetwork
        nodes={graph.nodes}
        colorMode={colorMode}
        clusters={graph.clusters}
        onNodeClick={onNodeClick}
        onNodeHover={onNodeHover}
      />
      <EdgeConnections edges={graph.edges} nodes={graph.nodes} />
      <ParticleField />

      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.5}
        zoomSpeed={0.8}
        minDistance={20}
        maxDistance={200}
      />
    </Canvas>
  );
}
