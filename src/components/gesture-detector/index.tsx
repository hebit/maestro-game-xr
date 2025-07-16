import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useGestureDirection } from "./hooks";
import { usePoseName } from "../../hooks";
import { TimelineEvent } from "../../contexts";
import { useAvaibilityState } from "../../hooks/use-avaibility-state";
import { useFrame } from "@react-three/fiber";
import { differenceInMilliseconds } from "date-fns";

export function GestureDetector({ event }: { event: TimelineEvent }) {
  const poseName = usePoseName(event.hand);
  const gestureDirection = useGestureDirection();

  const meshRef = useRef<THREE.Mesh>(null);
  const meshMaterialRef = useRef<THREE.MeshStandardMaterial>(null);

  const { isAvailable, isVisible } = useAvaibilityState(event);
  const [matched, setMatched] = useState(false);

  const executedMove = useMemo(() => {
    if (poseName === "none") return undefined;

    if (poseName === "palm-down-open" && gestureDirection === "down")
      return "move-palm-down-open";
    if (poseName === "palm-up-open" && gestureDirection === "up")
      return "move-palm-up-open";

    if (poseName === "clicking" && gestureDirection !== "none") {
      return `move-baton-${gestureDirection}`;
    }
  }, [poseName, gestureDirection]);

  useEffect(() => {
    if (!isAvailable) return;

    console.log({ executedMove });
    if (executedMove === event.move) {
      setMatched(true);
    }
  }, [executedMove, event.move, isAvailable]);

  useFrame(() => {
    if (!isVisible || !meshRef.current) return;
    if (!meshRef.current) return;

    let startY = 1.2;
    let endY = 1.8;
    let startX = 0;
    let endX = 0;

    if (
      event.move === "move-baton-down" ||
      event.move === "move-palm-down-open"
    ) {
      startY = 1.8;
      endY = 1.2;
    }

    if (event.move.includes("left") || event.move.includes("right")) {
      startY = 1.5;
      endY = 1.5;

      if (event.move.includes("left")) {
        startX = 0.5;
        endX = -0.5;
      } else {
        startX = -0.5;
        endX = 0.5;
      }
    }

    const now = new Date();
    const diff = differenceInMilliseconds(event.time, now);
    const percentage = Math.abs(2_000 - diff) / 2_000;
    const t = Math.min(percentage, 1);
    const newY = startY + (endY - startY) * t;
    const newX = startX + (endX - startX) * t;

    meshRef.current.position.setY(newY);
    meshRef.current.position.setX(newX);
  });

  useFrame(() => {
    if (!isVisible || !meshMaterialRef.current) return;

    const now = new Date();
    const diff = differenceInMilliseconds(event.time, now);
    console.log({ diff });
    const percentage = Math.abs(2_000 - diff) / 2_000;
    const t = Math.min(percentage, 1);
    meshMaterialRef.current.opacity = t;
  });

  const isSides = event.move.includes("left") || event.move.includes("right");

  if (!isVisible) return null;

  return (
    <>
      <mesh ref={meshRef} position={[0, 1.5, -2]}>
        <boxGeometry args={isSides ? [0.1, 1, 0.1] : [1, 0.1, 0.1]} />
        <meshStandardMaterial
          ref={meshMaterialRef}
          color={matched ? "red" : "skyblue"}
          opacity={1}
          transparent
        />
      </mesh>
      {/* <Text
      position={[0, 1.2, -2]}
      fontSize={0.2}
      color="white"
      anchorX="center"
      anchorY="middle"
      >
      {message || "Sem gesto"}
    </Text> */}
    </>
  );
}
