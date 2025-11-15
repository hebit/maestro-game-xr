import { useFrame } from "@react-three/fiber";
import { differenceInMilliseconds, format } from "date-fns";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

export function Tile({
  direction = "up",
  color,
  preDuration = 1_200,
  duration = 3_000,
  xPosition = 0,
  panelOpacity = 0.2,
  startTime,
}: {
  direction: "up" | "down";
  color?: string;
  duration?: number;
  preDuration?: number;
  xPosition?: number;
  panelOpacity?: number;
  startTime: Date;
}) {
  const group = useRef<THREE.Group>(null);
  const finishLineRef = useRef<THREE.Group>(null);
  const tileRef = useRef<THREE.Mesh>(null);
  const offSetControlRef = useRef<THREE.Group>(null);
  const animationStartedRef = useRef(false);
  const animationStartTimeRef = useRef<Date | null>(null);

  const titleSize = 2.0;
  const base = new THREE.Vector3(0, 1.2 - 0.14, -5.5);
  const progressed = useRef(0);

  const distance = 4.0;
  const finishLinePosition = useMemo(() => {
    return base.clone().add(new THREE.Vector3(0, 0, distance));
  }, [base]);

  const finishArrowPosition = useMemo(() => {
    return finishLinePosition.clone().add(new THREE.Vector3(0, 0, titleSize));
  }, [finishLinePosition]);

  const arrowRotations = {
    up: [0, 0, 0],
    down: [0, 0, Math.PI],
    right: [0, 0, -Math.PI / 2],
    left: [0, 0, Math.PI / 2],
  };
  const arrowRotation = arrowRotations[direction] || arrowRotations.up;
  const preShift = 0;

  useEffect(() => {
    console.log(
      "Tile mounted for direction",
      direction,
      "at",
      format(new Date(), "HH:mm:ss.SSS"),
      "startTime:",
      format(startTime, "HH:mm:ss.SSS")
    );
  }, []);

  useFrame(() => {
    if (group.current) {
      const now = new Date();

      if (!animationStartedRef.current && now >= startTime) {
        animationStartedRef.current = true;
        animationStartTimeRef.current = now;
        console.log(
          "Animation started for direction",
          direction,
          "at",
          format(now, "HH:mm:ss.SSS")
        );
      }

      if (!animationStartedRef.current) {
        group.current.position.copy(base);
        return;
      }

      const elapsedTime = differenceInMilliseconds(
        now,
        animationStartTimeRef.current!
      );

      if (elapsedTime < preDuration + preShift) {
        progressed.current = Math.min(
          elapsedTime / (preDuration + preShift),
          1
        );
        const zDistance = (finishLinePosition.z - base.z) * progressed.current;

        group.current.position
          .copy(base)
          .add(new THREE.Vector3(0, 0, zDistance));

        if (
          direction === "up" &&
          progressed.current >= 0.99 &&
          progressed.current < 1
        ) {
          console.log(
            `Phase 1 almost complete (${(progressed.current * 100).toFixed(
              2
            )}%)`,
            "at",
            format(now, "HH:mm:ss.SSS"),
            "elapsed:",
            elapsedTime,
            "ms"
          );
        }
      }
    }
  });

  useFrame(() => {
    if (
      group.current &&
      animationStartedRef.current &&
      animationStartTimeRef.current
    ) {
      const now = new Date();
      const elapsedTime = differenceInMilliseconds(
        now,
        animationStartTimeRef.current
      );

      if (elapsedTime >= preDuration + preShift) {
        progressed.current = Math.min(
          (elapsedTime - preDuration - preShift) / duration,
          1
        );
        const zDistance =
          (finishArrowPosition.z - finishLinePosition.z) * progressed.current;

        group.current.position
          .copy(finishLinePosition)
          .add(new THREE.Vector3(0, 0, zDistance));

        const currentZ = group.current.position.z;
        const zCutDistance = finishLinePosition.z - currentZ;

        if (zCutDistance <= 0 && tileRef.current && offSetControlRef.current) {
          if (elapsedTime - preDuration < 50 && direction === "up") {
            console.log(
              "== tile passed the finish line ==",
              format(now, "HH:mm:ss.SSS"),
              "elapsed since animation start:",
              elapsedTime,
              "ms"
            );
          }
          const newHeight = Math.max(0, titleSize - Math.abs(zCutDistance));
          offSetControlRef.current.position.z = -Math.abs(zCutDistance) / 2;
          tileRef.current.geometry = new THREE.BoxGeometry(
            finishLineWidth,
            newHeight,
            0.001
          );
        }
      }
    }
  });

  const finishLineWidth = 0.7;

  const titleHeight = titleSize;

  return (
    <group
      position={[xPosition / 2, 0, 0]}
      rotation={[0, (xPosition * Math.PI * -1) / 4, 0]}
    >
      <group ref={group} position={base}>
        <group ref={offSetControlRef}>
          <group rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            <group position={[0, titleHeight / 2, 0]}>
              <mesh ref={tileRef}>
                <boxGeometry args={[finishLineWidth, titleHeight, 0.001]} />
                <meshBasicMaterial color="blue" transparent opacity={1} />
              </mesh>
            </group>
          </group>
        </group>
      </group>

      <group ref={finishLineRef} position={finishLinePosition}>
        <group rotation={arrowRotation as [number, number, number]}>
          <mesh position={[0, 0.07, 0]}>
            <coneGeometry args={[0.1, 0.1, 4]} />
            <meshBasicMaterial color="white" transparent opacity={0.8} />
          </mesh>
        </group>
        <group position={[0, 0, 0]}>
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[finishLineWidth, 1.0, 0.02]} />
            <meshBasicMaterial
              color={color ?? "blue"}
              transparent
              opacity={panelOpacity}
            />
          </mesh>

          <mesh>
            <boxGeometry args={[finishLineWidth, 0.05, 0.02]} />
            <meshBasicMaterial color="white" transparent opacity={0.8} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
