interface LayoutNode {
  id: string;
  clusterId: string;
}

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

const ITERATIONS = 150;
const REPULSION = 600;
const ATTRACTION = 0.008;
const CLUSTER_ATTRACTION = 0.03;
const DAMPING = 0.92;
const MAX_VELOCITY = 2.5;
const BOUNDS = 45;

function randomInSphere(radius: number): Vec3 {
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  const r = radius * Math.cbrt(Math.random());
  return {
    x: r * Math.sin(phi) * Math.cos(theta),
    y: r * Math.sin(phi) * Math.sin(theta),
    z: r * Math.cos(phi),
  };
}

function computeClusterCenters(clusterIds: string[]): Map<string, Vec3> {
  const centers = new Map<string, Vec3>();
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  clusterIds.forEach((id, i) => {
    const t = (i + 0.5) / clusterIds.length;
    const phi = Math.acos(1 - 2 * t);
    const theta = goldenAngle * i;
    const radius = 28;
    centers.set(id, {
      x: radius * Math.sin(phi) * Math.cos(theta),
      y: radius * Math.sin(phi) * Math.sin(theta),
      z: radius * Math.cos(phi),
    });
  });

  return centers;
}

/**
 * Force-directed 3D layout. Produces spherical cloud distribution
 * with cluster grouping. Uses uniform scaling to preserve 3D shape.
 */
export function computeGraphLayout(nodes: LayoutNode[]): [number, number, number][] {
  const n = nodes.length;
  if (n === 0) return [];

  const clusterIds = [...new Set(nodes.map((nd) => nd.clusterId))];
  const clusterCenters = computeClusterCenters(clusterIds);

  const positions: Vec3[] = nodes.map((nd) => {
    const center = clusterCenters.get(nd.clusterId) ?? { x: 0, y: 0, z: 0 };
    const offset = randomInSphere(12);
    return {
      x: center.x + offset.x,
      y: center.y + offset.y,
      z: center.z + offset.z,
    };
  });

  const velocities: Vec3[] = Array.from({ length: n }, () => ({ x: 0, y: 0, z: 0 }));

  const clusterMap = new Map<string, number[]>();
  nodes.forEach((nd, i) => {
    const list = clusterMap.get(nd.clusterId) ?? [];
    list.push(i);
    clusterMap.set(nd.clusterId, list);
  });

  for (let iter = 0; iter < ITERATIONS; iter++) {
    const temperature = 1 - iter / ITERATIONS;
    const repulsionScale = REPULSION * temperature;

    for (let i = 0; i < n; i++) {
      let fx = 0;
      let fy = 0;
      let fz = 0;

      // Repulsion from all other nodes
      for (let j = 0; j < n; j++) {
        if (i === j) continue;
        const dx = positions[i].x - positions[j].x;
        const dy = positions[i].y - positions[j].y;
        const dz = positions[i].z - positions[j].z;
        const distSq = dx * dx + dy * dy + dz * dz;
        if (distSq > 10000) continue;
        const dist = Math.sqrt(distSq) + 0.01;
        const force = repulsionScale / distSq;
        fx += (dx / dist) * force;
        fy += (dy / dist) * force;
        fz += (dz / dist) * force;
      }

      // Attraction toward cluster center
      const center = clusterCenters.get(nodes[i].clusterId);
      if (center) {
        fx += (center.x - positions[i].x) * CLUSTER_ATTRACTION;
        fy += (center.y - positions[i].y) * CLUSTER_ATTRACTION;
        fz += (center.z - positions[i].z) * CLUSTER_ATTRACTION;
      }

      // Intra-cluster spring attraction
      const sameCluster = clusterMap.get(nodes[i].clusterId) ?? [];
      for (const j of sameCluster) {
        if (i === j) continue;
        const dx = positions[j].x - positions[i].x;
        const dy = positions[j].y - positions[i].y;
        const dz = positions[j].z - positions[i].z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.01;
        if (dist > 35) continue;
        fx += dx * ATTRACTION;
        fy += dy * ATTRACTION;
        fz += dz * ATTRACTION;
      }

      // Gentle centering force to keep cloud compact
      fx -= positions[i].x * 0.001;
      fy -= positions[i].y * 0.001;
      fz -= positions[i].z * 0.001;

      velocities[i].x = (velocities[i].x + fx) * DAMPING;
      velocities[i].y = (velocities[i].y + fy) * DAMPING;
      velocities[i].z = (velocities[i].z + fz) * DAMPING;

      const speed = Math.sqrt(velocities[i].x ** 2 + velocities[i].y ** 2 + velocities[i].z ** 2);
      if (speed > MAX_VELOCITY) {
        const scale = MAX_VELOCITY / speed;
        velocities[i].x *= scale;
        velocities[i].y *= scale;
        velocities[i].z *= scale;
      }

      positions[i].x += velocities[i].x;
      positions[i].y += velocities[i].y;
      positions[i].z += velocities[i].z;
    }
  }

  // Uniform scaling: find max extent across ALL axes, scale uniformly
  // This preserves the 3D cloud shape instead of squishing it
  let maxExtent = 0;
  let cx = 0;
  let cy = 0;
  let cz = 0;
  for (const p of positions) {
    cx += p.x;
    cy += p.y;
    cz += p.z;
  }
  cx /= n;
  cy /= n;
  cz /= n;

  for (const p of positions) {
    const dx = p.x - cx;
    const dy = p.y - cy;
    const dz = p.z - cz;
    const ext = Math.max(Math.abs(dx), Math.abs(dy), Math.abs(dz));
    if (ext > maxExtent) maxExtent = ext;
  }

  const uniformScale = maxExtent > 0 ? BOUNDS / maxExtent : 1;

  return positions.map((p) => [
    (p.x - cx) * uniformScale,
    (p.y - cy) * uniformScale,
    (p.z - cz) * uniformScale,
  ]);
}
