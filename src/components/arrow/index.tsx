import { useFrame } from "@react-three/fiber";
import { differenceInMilliseconds } from "date-fns";
import { useMemo, useRef } from "react";
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
  const finishLineRef = useRef<THREE.Group>(null);
  const arrowHeadRef = useRef<THREE.Mesh>(null);
  const arrowBodyRef = useRef<THREE.Mesh>(null);

  const base = new THREE.Vector3(0, 1.5, -2);
  const progressed = useRef(0);
  const startTime = useMemo(() => new Date(), []);

  const finishLinePosition = useMemo(() => {
    const distance = 0.4;
    return base.clone().add(new THREE.Vector3(0, -distance, -0.4));
  }, [base]);

  const rotations = {
    up: [Math.PI, 0, 0],
    down: [0, 0, 0],
    left: [0, 0, -Math.PI / 2],
    right: [0, 0, Math.PI / 2],
  };
  const rotation = rotations[direction] || rotations.up;

  useFrame(() => {
    if (group.current && arrowHeadRef.current && arrowBodyRef.current) {
      const elpasedTime = differenceInMilliseconds(new Date(), startTime);
      progressed.current = Math.min(elpasedTime / duration, 1);
      const distance = 0.4 * progressed.current;

      // Update arrow head material
      const headMaterial = arrowHeadRef.current
        .material as THREE.MeshBasicMaterial;
      const bodyMaterial = arrowBodyRef.current
        .material as THREE.MeshBasicMaterial;

      if (progressed.current) {
        // Update opacity
        headMaterial.opacity = Math.max(progressed.current, 0.2);
        bodyMaterial.opacity = Math.max(progressed.current, 0.2);
        headMaterial.transparent = true;
        bodyMaterial.transparent = true;

        // Update color
        if (progressed.current >= 0.77) {
          headMaterial.color = new THREE.Color(color);
          bodyMaterial.color = new THREE.Color(color);
        } else {
          headMaterial.color = new THREE.Color("white");
          bodyMaterial.color = new THREE.Color("white");
        }
      }

      // Update position based on direction
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
    <>
      <group
        ref={group}
        rotation={rotation as [number, number, number]}
        position={base}
      >
        {/* Arrow Head - Triangle */}
        <mesh ref={arrowHeadRef} position={[0, 0.15, 0]}>
          <coneGeometry args={[0.1, 0.15, 3]} />
          <meshBasicMaterial color="white" transparent opacity={0.2} />
        </mesh>

        {/* Arrow Body - Rectangle */}
        <mesh ref={arrowBodyRef} position={[0, 0.05, 0]}>
          <boxGeometry args={[0.1, 0.05, 0.04]} />
          <meshBasicMaterial color="white" transparent opacity={0.2} />
        </mesh>
      </group>

      <group ref={finishLineRef} position={finishLinePosition}>
        <mesh>
          <boxGeometry args={[0.8, 0.02, 0.02]} />
          <meshBasicMaterial color="white" transparent opacity={0.5} />
        </mesh>
      </group>
    </>
  );
}
