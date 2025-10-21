import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { TimelineEvent, useTimeline } from "../../contexts";
import { differenceInMilliseconds } from "date-fns";
import { useAvaibilityState } from "../../hooks/use-avaibility-state";
import { Circle } from "../circle";
import { usePointinDetector } from "./hooks";

interface PointingDetectorProps {
  event: TimelineEvent;
}

export function PointingDetector({ event }: PointingDetectorProps) {
  const spherePos = event.position;

  const sphereRef = useRef<THREE.Mesh>(null);
  const innerSphereMaterialRef = useRef<THREE.MeshBasicMaterial>(null);

  const { isAvailable, isVisible } = useAvaibilityState(event);
  const { matchEvent } = useTimeline();

  useFrame(() => {
    if (!isVisible || !innerSphereMaterialRef.current) return;

    if (Array.isArray(innerSphereMaterialRef.current)) {
      return;
    }
    const now = new Date();
    const diff = differenceInMilliseconds(event.time, now);
    const percentage = (1_000 - diff) / 1_000;
    const t = Math.min(percentage, 1);
    innerSphereMaterialRef.current.opacity = t;
  });

  const isPointing = usePointinDetector(isAvailable, sphereRef);

  useEffect(() => {
    if (isPointing) {
      matchEvent(event, 1);
    }
  }, [isPointing]);

  const color = useMemo(() => {
    if (!isAvailable) return "white";
    return isPointing ? "green" : "red";
  }, [isAvailable, isPointing]);

  if (!isVisible) return null;

  return (
    <>
      <Circle position={spherePos} duration={2_000} color={color} />

      <mesh ref={sphereRef} castShadow receiveShadow position={spherePos}>
        <sphereGeometry args={[0.4, 32, 32]} />

        <meshPhysicalMaterial
          metalness={0}
          roughness={1}
          envMapIntensity={0.9}
          clearcoat={1}
          transparent={true}
          opacity={0.5}
          reflectivity={0.2}
        />
      </mesh>
    </>
  );
}
