import * as THREE from "three";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Glow } from "./components";
import { CircleProps } from "./types";

export function Circle({ position, duration, color }: CircleProps) {
  const segments = 64;
  const size = 0.4;
  const initialMeshSize = size / 1000;
  const decreaseDuration = duration;
  const fadeOutDuration = 100;

  const blueLineRef = useRef<THREE.LineSegments>(null);
  const blueMeshRef = useRef<THREE.Mesh>(null);
  const startTimeRef = useRef<number | null>(null);

  // Calculate rotation to face (0,0,0)
  const rotationY = useMemo(() => {
    if (!position) return 0;

    const target = new THREE.Vector3(0, 0, 0);
    const currentPos = new THREE.Vector3(position[0], position[1], position[2]);
    const direction = target.clone().sub(currentPos).normalize();

    // Calculate Y rotation to face the target
    return Math.atan2(direction.x, direction.z);
  }, [position]);

  useFrame((state) => {
    if (!blueLineRef.current || !blueMeshRef.current) return;

    if (startTimeRef.current === null) {
      startTimeRef.current = state.clock.elapsedTime * 1000;
    }

    const currentTime = state.clock.elapsedTime * 1000;
    const elapsed = currentTime - startTimeRef.current;
    const lineProgress = Math.min(elapsed / decreaseDuration, 1);

    const scale = 1 - lineProgress;

    blueLineRef.current.scale.setScalar(scale);

    if (scale <= 0.01) {
      blueLineRef.current.visible = false;
    }

    if (scale <= 0) {
      const circleProgress = Math.min(
        (elapsed - decreaseDuration) / fadeOutDuration,
        1
      );

      const minRadius = initialMeshSize;
      const maxRadius = size;
      const currentRadius =
        minRadius + (maxRadius - minRadius) * circleProgress;

      const scaleRatio = currentRadius / minRadius;
      blueMeshRef.current.scale.setScalar(scaleRatio);
      blueMeshRef.current.visible = true;
    }
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <group position={[0, 0, -0.01]}>
        <Glow />
      </group>
      <lineSegments>
        <edgesGeometry args={[new THREE.CircleGeometry(size, segments)]} />
        <lineBasicMaterial color="white" linewidth={10} />
      </lineSegments>

      <lineSegments ref={blueLineRef}>
        <edgesGeometry args={[new THREE.CircleGeometry(size, segments)]} />
        <lineBasicMaterial color="blue" linewidth={10} />
      </lineSegments>

      <mesh ref={blueMeshRef} visible={false}>
        <circleGeometry args={[initialMeshSize, segments]} />
        <meshBasicMaterial transparent opacity={0.5} color={color} />
      </mesh>
    </group>
  );
}
