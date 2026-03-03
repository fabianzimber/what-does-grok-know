"use client";

import { useThree } from "@react-three/fiber";
import { useCallback, useRef } from "react";
import * as THREE from "three";

const DEFAULT_POSITION = new THREE.Vector3(0, 0, 80);
const LOOK_AT_OFFSET = 30;
const LERP_SPEED = 0.05;

interface UseBrainCameraReturn {
  focusNode: (position: [number, number, number]) => void;
  resetCamera: () => void;
}

/**
 * Hook for smooth camera control in the brain visualization.
 * Call focusNode to animate the camera toward a specific node position.
 * Call resetCamera to return to the default overview.
 */
export function useBrainCamera(): UseBrainCameraReturn {
  const { camera } = useThree();
  const targetRef = useRef<THREE.Vector3 | null>(null);
  const animatingRef = useRef(false);

  const animateToTarget = useCallback(
    (target: THREE.Vector3) => {
      targetRef.current = target;
      if (animatingRef.current) return;
      animatingRef.current = true;

      const animate = () => {
        if (!targetRef.current) {
          animatingRef.current = false;
          return;
        }

        const lookTarget = targetRef.current.clone();
        const cameraTarget = targetRef.current.clone().add(new THREE.Vector3(0, 0, LOOK_AT_OFFSET));

        camera.position.lerp(cameraTarget, LERP_SPEED);
        camera.lookAt(lookTarget);
        camera.updateProjectionMatrix();

        const dist = camera.position.distanceTo(cameraTarget);
        if (dist < 0.5) {
          animatingRef.current = false;
          targetRef.current = null;
          return;
        }

        requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
    },
    [camera],
  );

  const focusNode = useCallback(
    (position: [number, number, number]) => {
      const target = new THREE.Vector3(position[0], position[1], position[2]);
      animateToTarget(target);
    },
    [animateToTarget],
  );

  const resetCamera = useCallback(() => {
    animateToTarget(new THREE.Vector3(0, 0, 0));
    // Override target position to default overview
    const animate = () => {
      camera.position.lerp(DEFAULT_POSITION, LERP_SPEED);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();

      const dist = camera.position.distanceTo(DEFAULT_POSITION);
      if (dist < 0.5) return;
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [camera, animateToTarget]);

  return { focusNode, resetCamera };
}
