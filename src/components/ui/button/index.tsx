import * as THREE from "three";
import { Text } from "@react-three/drei";
import { ButtonProps } from "./types";
import { useState } from "react";

export function Button({ label, position, onClick }: ButtonProps) {
  const [hovered, setHovered] = useState(false);

  const textWidth = label.length * 0.1;

  const size = [textWidth + 0.4, 0.4] as const;

  return (
    <group
      position={position}
      onClick={onClick}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <mesh>
        <planeGeometry args={size} />
        <meshBasicMaterial
          transparent
          opacity={hovered ? 0.2 : 0.4}
          color={hovered ? "white" : "black"}
        />
        <lineSegments>
          <edgesGeometry args={[new THREE.PlaneGeometry(...size)]} />
          <lineBasicMaterial color="white" linewidth={5} />
        </lineSegments>
      </mesh>
      <Text
        font="/maestro-game-xr/bonoco.ttf"
        position={[0, 0, 0.00001]}
        fontSize={0.15}
        color={"white"}
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
}
