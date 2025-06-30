import { useXR, useXRInputSourceState, useXRSpace } from "@react-three/xr";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Text } from "@react-three/drei";
import { useDebounce } from "@uidotdev/usehooks";
import { usePoseName } from "./hooks";

function useGestureDirection(): "none" | "right" | "left" | "up" | "down" {
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

export function GestureDetector() {
  const poseName = usePoseName();
  const gestureDirection = useGestureDirection();

  const message = useMemo(() => {
    if (poseName === "none") return undefined;

    if (poseName === "palm-down-open" && gestureDirection === "down")
      return "move-palm-down-open";
    if (poseName === "palm-up-open" && gestureDirection === "up")
      return "move-palm-up-open";

    if (poseName === "clicking" && gestureDirection !== "none") {
      return `move-baton-${gestureDirection}`;
    }
  }, [poseName, gestureDirection]);

  return (
    <Text
      position={[0, 1.2, -2]}
      fontSize={0.2}
      color="white"
      anchorX="center"
      anchorY="middle"
    >
      {message || "Sem gesto"}
    </Text>
  );
}
