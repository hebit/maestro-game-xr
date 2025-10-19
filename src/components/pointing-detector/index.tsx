import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useXR, useXRInputSourceState, useXRSpace } from "@react-three/xr";
import React, { useRef, useState } from "react";
import { usePoseName } from "../../hooks";
import { TimelineEvent } from "../../contexts";
import { differenceInMilliseconds } from "date-fns";
import { useAvaibilityState } from "../../hooks/use-avaibility-state";

function usePointinDetector(
  isAvailableRef: boolean,
  sphereRef: React.RefObject<THREE.Mesh | null>
) {
  const [isPointing, setIsPointing] = useState(false);

  const poseName = usePoseName("left");
  const { session } = useXR();
  const referenceSpace = useXRSpace();
  const sourceState = useXRInputSourceState("hand", "left");

  useFrame((_, __, frame) => {
    if (!session) return;
    if (poseName !== "pointing") return;

    const inputSource = sourceState?.inputSource;

    if (!frame || !referenceSpace || !inputSource) return;

    const tip = inputSource.hand.get("index-finger-tip");
    const base =
      inputSource.hand.get("index-finger-phalanx-proximal") ||
      inputSource.hand.get("wrist");
    if (!tip || !base) return;

    const tipPose = frame.getJointPose?.(tip, referenceSpace);
    const basePose = frame.getJointPose?.(base, referenceSpace);
    if (!tipPose || !basePose) return;

    const origin = new THREE.Vector3().copy(basePose.transform.position);
    const tipPos = new THREE.Vector3().copy(tipPose.transform.position);
    const direction = tipPos.clone().sub(origin).normalize();

    // ray da mão
    const ray = new THREE.Ray(origin, direction);

    if (!isAvailableRef) return;

    // bounding sphere (esfera alvo)
    if (sphereRef.current) {
      // const [x, y, z] = spherePos;
      // const sphere = new THREE.Sphere(new THREE.Vector3(x, y, z));

      const sphere = new THREE.Sphere();
      sphereRef.current.geometry.computeBoundingSphere();
      sphere.copy(sphereRef.current.geometry.boundingSphere!);
      sphere.applyMatrix4(sphereRef.current.matrixWorld);

      const intersecta = ray.intersectsSphere(sphere);
      // console.log({ intersecta });
      if (intersecta) {
        setIsPointing(intersecta);
      }
    }
  });

  return isPointing;
}

interface PointingDetectorProps {
  event: TimelineEvent;
}

export function PointingDetector({ event }: PointingDetectorProps) {
  const spherePos = event.position;

  const sphereRef = useRef<THREE.Mesh>(null);
  const innerSphereMaterialRef = useRef<THREE.MeshBasicMaterial>(null);

  const { isAvailable, isVisible } = useAvaibilityState(event);

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

  if (!isVisible) return null;

  return (
    <>
      <mesh castShadow receiveShadow position={spherePos}>
        <sphereGeometry args={[0.1, 32, 32]} />

        <meshStandardMaterial
          ref={innerSphereMaterialRef}
          color={isPointing ? "red" : "skyblue"}
          transparent
          opacity={0}
        />
      </mesh>

      <mesh ref={sphereRef} castShadow receiveShadow position={spherePos}>
        <sphereGeometry args={[0.3, 32, 32]} />

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
