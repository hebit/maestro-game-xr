import * as THREE from "three";
import { useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useXR, useXRInputSourceState, useXRSpace } from "@react-three/xr";
import { usePoseName } from "../../../hooks/use-pose-name";

export function usePointinDetector(
  isAvailable: boolean,
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
    if (!isAvailable) return;

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

    const ray = new THREE.Ray(origin, direction);

    if (sphereRef.current) {
      const sphere = new THREE.Sphere();
      sphereRef.current.geometry.computeBoundingSphere();
      sphere.copy(sphereRef.current.geometry.boundingSphere!);
      sphere.applyMatrix4(sphereRef.current.matrixWorld);

      const intersecta = ray.intersectsSphere(sphere);

      /* const material = sphereRef.current.material as THREE.MeshBasicMaterial;
      if (intersecta) {
        material.color.set("yellow");
      } else {
        material.color.set("white");
      } */

      setIsPointing(intersecta);
    } else {
      setIsPointing(false);
    }
  });

  return isPointing;
}
