import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { useXRInputSourceState, useXRSpace } from "@react-three/xr";

export function HandRay({ side }: { side: "left" | "right" }) {
  const rayRef = useRef<THREE.Mesh>(null);

  const referenceSpace = useXRSpace();

  const sourceState = useXRInputSourceState("hand", side);

  useFrame((_, __, frame) => {
    if (!rayRef.current || !frame || !sourceState) return;

    const inputSource = sourceState?.inputSource;

    if (!referenceSpace || !inputSource) return;

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

    const rayLength = 2;
    const rayEnd = origin
      .clone()
      .add(direction.clone().multiplyScalar(rayLength));
    const rayCenter = origin.clone().add(rayEnd).multiplyScalar(0.5);

    rayRef.current.position.copy(rayCenter);

    rayRef.current.lookAt(rayEnd);
    rayRef.current.rotateX(Math.PI / 2);
  });

  return (
    <mesh ref={rayRef}>
      <cylinderGeometry args={[0.002, 0.002, 2, 8]} />
      <meshBasicMaterial color="red" transparent opacity={0.2} />
    </mesh>
  );
}
