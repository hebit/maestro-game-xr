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
      const yDistance = (finishArrowPosition.y - base.y) * progressed.current;
      const zDistance = (finishArrowPosition.z - base.z) * progressed.current;

      console.log({
        yDistance,
        progress: progressed.current,
      });

      /*  const headMaterial = arrowHeadRef.current
        .material as THREE.MeshBasicMaterial;
      const bodyMaterial = arrowBodyRef.current
        .material as THREE.MeshBasicMaterial; */

      // comment here
      /* if (progressed.current) {
        headMaterial.opacity = Math.max(progressed.current, 0.2);
        bodyMaterial.opacity = Math.max(progressed.current, 0.2);
        headMaterial.transparent = true;
        bodyMaterial.transparent = true;

        if (progressed.current >= 0.77) {
          headMaterial.color = new THREE.Color(color);
          bodyMaterial.color = new THREE.Color(color);
        } else {
          headMaterial.color = new THREE.Color("white");
          bodyMaterial.color = new THREE.Color("white");
        }
      } */

      if (direction === "up")
        group.current.position
          .copy(base)
          .add(new THREE.Vector3(0, 0, zDistance));
      if (direction === "down") {
        console.log({
          pos: new THREE.Vector3(1, 1, 1)
            .copy(base)
            .add(new THREE.Vector3(0, 0, zDistance)),
        });
        group.current.position
          .copy(base)
          .add(new THREE.Vector3(0, 0, zDistance));
      }
      if (direction === "left")
        group.current.position
          .copy(base)
          .add(new THREE.Vector3(0, 0, zDistance));
      if (direction === "right")
        group.current.position
          .copy(base)
          .add(new THREE.Vector3(0, 0, zDistance));
    }
  });

  /* useFrame(() => {
    if (!group.current) return;

    group.current.rotation.set(
      ...[
        0,
        group.current.rotation.y,
        group.current.rotation.z + Math.PI / 2 / 100,
      ]
    );
  }); */

  console.log({ base, finishLinePosition });

  return (
    <>
      <group
        ref={group}
        //rotation={rotation as [number, number, number]}
        //position={base.clone().add(new THREE.Vector3(0, 0.4, 0))}
        position={base}
      >
        <group rotation={rotation as [number, number, number]}>
          {/*   <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.3, 0.3, 0.5]} />
            <meshBasicMaterial color={"white"} transparent opacity={0.1} />
          </mesh> */}
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
