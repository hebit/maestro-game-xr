import { useFrame } from "@react-three/fiber";
import { useXR, useXRInputSourceState, useXRSpace } from "@react-three/xr";
import { useDebounce } from "@uidotdev/usehooks";
import { useRef, useState } from "react";
import * as THREE from "three";

export function useGestureDirection(
  hand: "left" | "right" = "left"
): "none" | "right" | "left" | "up" | "down" {
  const { session } = useXR();
  const lastPositionRef = useRef<THREE.Vector3 | null>(null);

  const [gesture, setGesture] = useState<
    "none" | "right" | "left" | "up" | "down"
  >("none");

  const debounceGesture = useDebounce(gesture, 100);

  const referenceSpace = useXRSpace();
  const sourceState = useXRInputSourceState("hand", hand);

  useFrame((_, __, frame) => {
    if (!session) return;
    if (!sourceState?.inputSource) return;

    const inputSource = sourceState.inputSource;
    if (!inputSource.hand) return;

    const wristJoint = inputSource.hand.get("wrist");
    if (!wristJoint) return;

    if (!frame || !referenceSpace) return;

    const wristPose = frame.getJointPose?.(wristJoint, referenceSpace);
    if (!wristPose) return;

    const currentPos = new THREE.Vector3().copy(wristPose.transform.position);

    if (lastPositionRef.current) {
      const deltaVec = currentPos.clone().sub(lastPositionRef.current);

      const threshold = 0.002;

      const magnitude = deltaVec.length();

      if (magnitude > threshold) {
        const absX = Math.abs(deltaVec.x);
        const absY = Math.abs(deltaVec.y);
        const absZ = Math.abs(deltaVec.z);

        if (absY > absX && absY > absZ) {
          setGesture(deltaVec.y > 0 ? "up" : "down");
        } else if (absX > absY && absX > absZ) {
          setGesture(deltaVec.x > 0 ? "right" : "left");
        } else {
          setGesture("none");
        }
      } else {
        setGesture("none");
      }
    }

    lastPositionRef.current = currentPos.clone();
  });

  return debounceGesture;
}
