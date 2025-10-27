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

      // Increase threshold for Meta Quest - more forgiving detection
      const threshold = 0.002; // Increased from 0.0003

      // Calculate movement magnitude
      const magnitude = deltaVec.length();

      // Only process if there's significant movement
      if (magnitude > threshold) {
        // Determine dominant direction
        const absX = Math.abs(deltaVec.x);
        const absY = Math.abs(deltaVec.y);
        const absZ = Math.abs(deltaVec.z);

        // Find the dominant axis
        if (absY > absX && absY > absZ) {
          // Vertical movement
          setGesture(deltaVec.y > 0 ? "up" : "down");
        } else if (absX > absY && absX > absZ) {
          // Horizontal movement
          setGesture(deltaVec.x > 0 ? "right" : "left");
        } else {
          // Z-axis or ambiguous movement - consider as none
          setGesture("none");
        }

        console.log("Gesture detected:", {
          delta: deltaVec,
          magnitude,
          threshold,
          gesture:
            absY > absX && absY > absZ
              ? deltaVec.y > 0
                ? "up"
                : "down"
              : absX > absY && absX > absZ
              ? deltaVec.x > 0
                ? "right"
                : "left"
              : "none",
        });
      } else {
        setGesture("none");
      }
    }

    lastPositionRef.current = currentPos.clone();
  });

  return debounceGesture;
}
