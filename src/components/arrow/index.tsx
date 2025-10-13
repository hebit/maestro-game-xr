import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
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
  const finishLineRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/maestro-game-xr/arrow.glb");
  const base = new THREE.Vector3(0, 1.5, -2);
  const progressed = useRef(0);
  const startTime = useMemo(() => new Date(), []);

  // Z do arrow vai de 0.4 até -2
  // range de 2.4 unidades
  // progresso até 0.8 -> 33%
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

      group.current.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          const material = child.material as THREE.Material;

          if (progressed.current) {
            if ("opacity" in material) {
              (material as any).opacity = Math.max(progressed.current, 0.2);
              material.transparent = true;
            }

            if ("color" in material) {
              if (progressed.current >= 0.77) {
                (material as any).color = new THREE.Color(color);
              } else {
                (material as any).color = new THREE.Color("white");
              }
            }

            if ("emissive" in material) {
              if (progressed.current >= 0.77) {
                (material as any).emissive = new THREE.Color(0x000000);
              } else {
                (material as any).emissive = new THREE.Color(0x444444);
              }
            }
          }
        }
      });

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

  const clonedScene = useMemo(() => {
    const cloned = scene.clone();

    cloned.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const material = child.material as THREE.Material;
        if ("color" in material) {
          (material as any).color = new THREE.Color(color);
        }
        if ("transparent" in material) {
          (material as any).transparent = true;
        }
      }
    });

    return cloned;
  }, [scene, color]);

  return (
    <>
      <group
        ref={group}
        rotation={rotation as [number, number, number]}
        position={base}
      >
        <primitive object={clonedScene} />
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

useGLTF.preload("/maestro-game-xr/arrow.glb");
