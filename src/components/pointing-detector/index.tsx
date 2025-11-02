import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { TimelineEvent, useTimeline } from "../../contexts";
import { differenceInMilliseconds } from "date-fns";
import { Circle } from "../circle";
import { usePointinDetector } from "./hooks";
import { useAvaibilityState } from "../../hooks/use-avaibility-state";

interface PointingDetectorProps {
  event: TimelineEvent;
}

export function PointingDetector({ event }: PointingDetectorProps) {
  const spherePos = event.position;

  const duration = 2_000;
  const visibleTime = duration + 100;
  const availableTime = 200;
  const fadeOutTime = 300;

  const sphereRef = useRef<THREE.Mesh>(null);
  const innerSphereMaterialRef = useRef<THREE.MeshBasicMaterial>(null);

  const [matched, setMatched] = useState(false);

  const { isAvailable, isVisible, isOff } = useAvaibilityState(
    event,
    visibleTime,
    availableTime,
    fadeOutTime,
    false
  );
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
    if (isPointing && isAvailable) {
      setMatched(true);
    }
  }, [isPointing, isAvailable]);

  useEffect(() => {
    if (matched) {
      matchEvent(event, 1);
    }
  }, [matched]);

  const color = useMemo(() => {
    if (isOff && !matched) return "red";
    return matched ? "green" : "white";
  }, [isOff, matched]);

  if (!isVisible) return null;

  return (
    <>
      <Circle position={spherePos} duration={duration} color={color} />

      <mesh ref={sphereRef} castShadow receiveShadow position={spherePos}>
        <sphereGeometry args={[0.6, 32, 32]} />

        <meshPhysicalMaterial
          metalness={0}
          roughness={1}
          envMapIntensity={0.9}
          clearcoat={1}
          transparent={true}
          opacity={0.1}
          reflectivity={0.2}
        />
      </mesh>
    </>
  );
}
