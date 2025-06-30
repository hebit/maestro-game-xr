import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useXR, useXRInputSourceState, useXRSpace } from "@react-three/xr";
import React, { useEffect, useRef, useState } from "react";
import { Text } from "@react-three/drei";
import { usePoseName } from "./hooks";

export function PointingDetector() {
  const { session } = useXR();
  const poseName = usePoseName();
  const [isPointing, setIsPointing] = useState(false);
  const isAvailableRef = useRef<boolean>(false);

  const referenceSpace = useXRSpace();
  const sourceState = useXRInputSourceState("hand", "left");

  React.useEffect(() => {
    if (poseName !== "pointing") setIsPointing(false);
  }, [poseName]);

  useFrame((_, __, frame) => {
    if (!session) return;
    if (poseName !== "pointing") return;

    const inputSource = sourceState?.inputSource;

    if (!frame || !referenceSpace || !inputSource) return;

    const tip = inputSource.hand.get("index-finger-tip");
    const base =
      inputSource.hand.get("index-finger-metacarpal") ||
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

    if (!isAvailableRef.current) return;

    // bounding sphere (esfera alvo)
    if (sphereRef.current) {
      const sphere = new THREE.Sphere();
      sphereRef.current.geometry.computeBoundingSphere();
      sphere.copy(sphereRef.current.geometry.boundingSphere!);
      sphere.applyMatrix4(sphereRef.current.matrixWorld);

      const intersecta = ray.intersectsSphere(sphere);
      if (intersecta) {
        console.log({ intersecta, sphere, direction });
        setIsPointing(intersecta);
      }
    }
  });

  const [spherePos, setSpherePos] = useState<[number, number, number]>([
    0, 2, -1.5,
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      isAvailableRef.current = false;
      setIsPointing(false);
      setSpherePos([-1 + Math.random() * 2, 1.5 + Math.random() * 0.5, -1.5]);

      setTimeout(() => {
        isAvailableRef.current = true;
      }, 100);
    }, 3_000);

    return () => clearInterval(interval);
  }, []);

  const sphereRef = useRef<THREE.Mesh>(null);

  return (
    <>
      <Text
        position={[0.5, 1.3, -2]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {isPointing ? "Apontando para a esfera!" : "Não está apontando"}
      </Text>
      <mesh ref={sphereRef} castShadow receiveShadow position={spherePos}>
        <sphereGeometry args={[0.3, 32, 32]} />

        <meshStandardMaterial
          emissiveIntensity={1}
          emissive={isPointing ? "red" : "skyblue"}
          toneMapped={false}
        />
      </mesh>
    </>
  );
}
