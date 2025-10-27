import { useFrame } from "@react-three/fiber";
import { differenceInMilliseconds } from "date-fns";
import { useMemo, useRef } from "react";
import * as THREE from "three";

export function Arrow({
  direction = "up",
  color,
  duration = 3_000,
  noTail = false,
}: {
  direction: "up" | "down" | "left" | "right";
  color?: string;
  duration?: number;
  noTail?: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const finishLineRef = useRef<THREE.Group>(null);
  const arrowHeadRef = useRef<THREE.Mesh>(null);
  const arrowBodyRef = useRef<THREE.Mesh>(null);

  const base = new THREE.Vector3(0, 1.2, -6);
  const progressed = useRef(0);
  const startTime = useMemo(() => new Date(), []);

  const distance = 4.5;
  const finishLinePosition = useMemo(() => {
    return base.clone().add(new THREE.Vector3(0, 0, distance));
  }, [base]);

  const finishArrowPosition = useMemo(() => {
    return finishLinePosition.clone().add(new THREE.Vector3(0, 0, 0.5));
  }, [finishLinePosition]);

  const rotations = {
    up: [0, 0, 0],
    down: [0, 0, Math.PI],
    right: [0, 0, -Math.PI / 2],
    left: [0, 0, Math.PI / 2],
  };
  const rotation = rotations[direction] || rotations.up;

  useFrame(() => {
    if (group.current && arrowHeadRef.current && arrowBodyRef.current) {
      const elpasedTime = differenceInMilliseconds(new Date(), startTime);
      progressed.current = Math.min(elpasedTime / duration, 1);
      const zDistance = (finishArrowPosition.z - base.z) * progressed.current;

      const headMaterial = arrowHeadRef.current
        .material as THREE.MeshBasicMaterial;
      const bodyMaterial = arrowBodyRef.current
        .material as THREE.MeshBasicMaterial;

      if (progressed.current) {
        const opacityProgress = progressed.current * 10;
        headMaterial.opacity = Math.min(opacityProgress, 1);
        bodyMaterial.opacity = Math.min(opacityProgress, 1);
        headMaterial.transparent = true;
        bodyMaterial.transparent = true;
      }

      group.current.position.copy(base).add(new THREE.Vector3(0, 0, zDistance));
    }
  });

  return (
    <>
      <group ref={group} position={base}>
        <group rotation={rotation as [number, number, number]}>
          <mesh ref={arrowHeadRef} position={[0, 0.015, 0]}>
            <coneGeometry args={[0.1, 0.15, 4]} />
            <meshBasicMaterial
              color={color ?? "white"}
              transparent
              opacity={1}
            />
          </mesh>

          {!noTail && (
            <mesh ref={arrowBodyRef} position={[0, -0.1, 0]}>
              <boxGeometry args={[0.1, 0.1, 0.04]} />
              <meshBasicMaterial
                color={color ?? "white"}
                transparent
                opacity={1}
              />
            </mesh>
          )}
        </group>
      </group>

      <group ref={finishLineRef} position={finishLinePosition}>
        <group position={[0, -0.14, 0]}>
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[0.7, 1.0, 0.02]} />
            <meshBasicMaterial
              color={color ?? "blue"}
              transparent
              opacity={0.1}
            />
          </mesh>

          <mesh>
            <boxGeometry args={[0.7, 0.05, 0.02]} />
            <meshBasicMaterial color="white" transparent opacity={0.8} />
          </mesh>
        </group>
      </group>
    </>
  );
}
