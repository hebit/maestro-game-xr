import { useFrame } from "@react-three/fiber";
import { useFBX } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import { SkeletonUtils } from "three-stdlib";

import * as THREE from "three";

export function Person({ variant }: { variant: "left" | "right" | "center" }) {
  const variants = {
    left: {
      position: [-2.4, 0, -4] as const,
      rotation: [0, Math.PI / 4, 0] as const,
    },
    right: {
      position: [2.4, 0, -4] as const,
      rotation: [0, -Math.PI / 4, 0] as const,
    },
    center: {
      position: [0, 0, -5] as const,
      rotation: [0, 0, 0] as const,
    },
  };

  const positionProps = variants[variant];

  const original = useFBX("/maestro-game-xr/person.fbx");

  const fbx = useMemo(() => SkeletonUtils.clone(original), [original]);

  const mixer = useRef<THREE.AnimationMixer | null>(null);

  useEffect(() => {}, [fbx]);

  useFrame((_, delta) => {
    mixer.current?.update(delta);
  });

  return (
    <>
      <group {...positionProps} scale={0.015}>
        <primitive object={fbx} />
      </group>

      {/*    <primitive
        position={[2, 0, -3]}
        rotation={[0, -Math.PI / 2 - Math.PI / 4, 0]} // gira 90° no eixo Y
        object={fbx}
        scale={0.002}
      />
      <primitive
        position={[0, 0, -3.5]}
        rotation={[0, -Math.PI / 2, 0]} // gira 90° no eixo Y
        object={fbx}
        scale={0.002}
      /> */}
      {/* 
          <primitive
        position={[0, 0, -3]}
        rotation={[0, -Math.PI / 2, 0]} // gira 90° no eixo Y
        object={fbx}
        scale={0.002}
      />
      <primitive
        position={[1, 0, -3]}
        rotation={[0, Math.PI + Math.PI / 4, 0]} // gira 90° no eixo Y
        object={fbx}
        scale={0.002}
      /> */}
    </>
  );
}

useFBX.preload("/maestro-game-xr/person.fbx");
