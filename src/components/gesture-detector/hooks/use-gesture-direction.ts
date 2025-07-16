import { useFrame } from "@react-three/fiber";
import { useXR, useXRInputSourceState, useXRSpace } from "@react-three/xr";
import { useDebounce } from "@uidotdev/usehooks";
import { useRef, useState } from "react";
import * as THREE from "three";

export function useGestureDirection():
  | "none"
  | "right"
  | "left"
  | "up"
  | "down" {
  const { session } = useXR();
  const lastPositionRef = useRef<THREE.Vector3 | null>(null);

  const [gesture, setGesture] = useState<
    "none" | "right" | "left" | "up" | "down"
  >("none");

  const debounceGesture = useDebounce(gesture, 100);

  const referenceSpace = useXRSpace();
  const sourceState = useXRInputSourceState("hand", "left");

  useFrame((_, __, frame) => {
    if (!session) return;

    const wristJoint = sourceState?.inputSource.hand.get("wrist");

    if (!wristJoint) return;

    if (!frame || !referenceSpace) return;

    const wristPose = frame?.getJointPose?.(wristJoint, referenceSpace);

    if (!wristPose) return;

    const currentPos = new THREE.Vector3().copy(wristPose.transform.position);

    if (lastPositionRef.current) {
      const deltaVec = currentPos.clone().sub(lastPositionRef.current);

      const threshold = 0.0003;

      requestAnimationFrame(() => {
        if (
          Math.abs(deltaVec.y) > Math.abs(deltaVec.x) &&
          Math.abs(deltaVec.y) > threshold
        ) {
          setGesture(deltaVec.y > 0 ? "up" : "down");
        } else if (Math.abs(deltaVec.x) > threshold) {
          setGesture(deltaVec.x > 0 ? "right" : "left");
        } else {
          setGesture("none");
        }
      });
    }
    lastPositionRef.current = currentPos;
  });

  return debounceGesture;
}
