import { useTexture } from "@react-three/drei";
import * as THREE from "three";

export function Skybox() {
  const texture = useTexture("/maestro-game-xr/bg-361.jpg");

  return (
    <mesh>
      <sphereGeometry args={[500, 60, 60, Math.PI / 3]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}
