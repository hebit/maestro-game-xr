import { useFrame } from "@react-three/fiber";
import { differenceInMilliseconds } from "date-fns";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

export function Arrow({
  direction = "up",
  color = "orange",
  duration = 2_000,
}: {
  direction: "up" | "down" | "left" | "right";
  color?: string;
  duration?: number;
}) {
  const group = useRef<THREE.Group>(null);
  const base = new THREE.Vector3(0, 1.5, -2);
  const progressed = useRef(0);
  const materialBodyRef = useRef<THREE.MeshStandardMaterial>(null);
  const materialHeadRef = useRef<THREE.MeshStandardMaterial>(null);
  const startTime = useMemo(() => new Date(), []);

  const length = 0.2;
  const headLen = 0.1;

  const rotations = {
    up: [0, 0, 0],
    down: [Math.PI, 0, 0],
    left: [0, 0, Math.PI / 2],
    right: [0, 0, -Math.PI / 2],
  };
  const rotation = rotations[direction] || rotations.up;

  useEffect(() => {
    console.log("Arrow:MOUNT:", direction);
    return () => {
      console.log("Arrow:UNMOUNT:", direction);
    };
  }, []);

  useFrame(() => {
    if (group.current) {
      const elpasedTime = differenceInMilliseconds(new Date(), startTime);
      progressed.current = Math.min(elpasedTime / duration, 1);
      const distance = 0.4 * progressed.current;

      if (materialBodyRef.current)
        materialBodyRef.current.opacity = Math.max(progressed.current, 0.2);
      if (materialHeadRef.current)
        materialHeadRef.current.opacity = Math.max(progressed.current, 0.2);

      console.log("dir: ", direction, progressed.current);

      if (direction === "up")
        group.current.position
          .copy(base)
          .add(new THREE.Vector3(0, -distance, -0.8 + distance * 3));
      if (direction === "down")
        group.current.position
          .copy(base)
          .add(new THREE.Vector3(0, -distance, -0.8 + distance * 3));
      if (direction === "left")
        group.current.position
          .copy(base)
          .add(new THREE.Vector3(0, -distance, -0.8 + distance * 3));
      if (direction === "right")
        group.current.position
          .copy(base)
          .add(new THREE.Vector3(0, -distance, -0.8 + distance * 3));
    }
  });

  return (
    <group
      ref={group}
      rotation={rotation as [number, number, number]}
      position={base}
    >
      <mesh position={[0, (length - headLen) / 2 - length / 2, 0]}>
        <cylinderGeometry args={[0.04, 0.04, length - headLen, 12]} />
        <meshStandardMaterial
          ref={materialBodyRef}
          opacity={1}
          transparent
          color={color}
        />
      </mesh>
      <mesh position={[0, length / 2 - headLen / 2, 0]}>
        <coneGeometry args={[0.08, headLen, 16]} />
        <meshStandardMaterial
          ref={materialHeadRef}
          opacity={1}
          transparent
          color={color}
        />
      </mesh>
    </group>
  );
}
