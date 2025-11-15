import { useFrame } from "@react-three/fiber";
import { useFBX } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import { SkeletonUtils } from "three-stdlib";

import * as THREE from "three";
const animationRegistry = {
  instances: new Map<string, THREE.AnimationAction[]>(),

  register(variant: string, actions: THREE.AnimationAction[]) {
    this.instances.set(variant, actions);
  },

  unregister(variant: string) {
    this.instances.delete(variant);
  },

  stopAll() {
    this.instances.forEach((actions) => {
      actions.forEach((action) => action.stop());
    });
  },

  pauseAll() {
    this.instances.forEach((actions) => {
      actions.forEach((action) => {
        action.paused = true;
      });
    });
  },

  resumeAll() {
    this.instances.forEach((actions) => {
      actions.forEach((action) => {
        action.paused = false;
        if (!action.isRunning()) {
          action.play();
        }
      });
    });
  },
};

(window as any).stopAnimations = () => animationRegistry.stopAll();
(window as any).pauseAnimations = () => animationRegistry.pauseAll();
(window as any).resumeAnimations = () => animationRegistry.resumeAll();

export function Person({
  position,
  variant,
}: {
  position: "left" | "right" | "center";
  variant: "guitar" | "sax" | "drum";
}) {
  const positions = {
    left: {
      position: [-2.4, 0, -4.3] as const,
      rotation: [0, Math.PI / 4, 0] as const,
    },
    right: {
      position: [2.4, 0, -4.3] as const,
      rotation: [0, -Math.PI / 4, 0] as const,
    },
    center: {
      position: [0, 0, -5.5] as const,
      rotation: [0, 0, 0] as const,
    },
  };

  const positionProps = positions[position];

  const file = (() => {
    if (variant === "sax") return "/maestro-game-xr/P_SAX.fbx";
    if (variant === "drum") return "/maestro-game-xr/P_TAMBOR.fbx";
    if (variant === "guitar") return "/maestro-game-xr/P_GUITARRA.fbx";
  })();

  const original = useFBX(file!);

  const fbx = useMemo(() => SkeletonUtils.clone(original), [original]);

  const mixer = useRef<THREE.AnimationMixer | null>(null);
  const activeActions = useRef<THREE.AnimationAction[]>([]);

  useEffect(() => {
    if (!fbx) return;

    fbx.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const materials = Array.isArray(mesh.material)
            ? mesh.material
            : [mesh.material];

          materials.forEach((material) => {
            if (
              material instanceof THREE.MeshStandardMaterial ||
              material instanceof THREE.MeshPhongMaterial ||
              material instanceof THREE.MeshLambertMaterial
            ) {
              material.transparent = false;
              material.opacity = 1;
              material.depthWrite = true;
              material.side = THREE.FrontSide;

              if (material instanceof THREE.MeshStandardMaterial) {
                material.roughness = 0.9;
                material.metalness = 0.0;

                if (material.map) {
                  material.map.colorSpace = THREE.SRGBColorSpace;
                }
              }

              if (material instanceof THREE.MeshPhongMaterial) {
                material.shininess = 10;

                if (material.map) {
                  material.map.colorSpace = THREE.SRGBColorSpace;
                }
              }

              material.needsUpdate = true;
            }
          });
        }
      }
    });

    function animate() {
      if (variant === "sax") {
        mixer.current = new THREE.AnimationMixer(fbx);

        if (original.animations && original.animations.length > 0) {
          if (original.animations[1]) {
            const characterAction = mixer.current.clipAction(
              original.animations[1]
            );
            characterAction.play();
            activeActions.current.push(characterAction);
          }

          if (original.animations[2]) {
            const characterAction = mixer.current.clipAction(
              original.animations[2]
            );
            characterAction.play();
            activeActions.current.push(characterAction);
          }
        }
      }

      if (variant === "guitar") {
        mixer.current = new THREE.AnimationMixer(fbx);

        if (original.animations && original.animations.length > 0) {
          if (original.animations[0]) {
            const guitarAction = mixer.current.clipAction(
              original.animations[0]
            );
            guitarAction.play();
            activeActions.current.push(guitarAction);
          }

          if (original.animations[2]) {
            const characterAction = mixer.current.clipAction(
              original.animations[2]
            );
            characterAction.play();
            activeActions.current.push(characterAction);
          }
        }
      }

      if (variant === "drum") {
        mixer.current = new THREE.AnimationMixer(fbx);

        if (original.animations && original.animations.length > 0) {
          if (original.animations[0]) {
            const guitarAction = mixer.current.clipAction(
              original.animations[0]
            );
            guitarAction.play();
            activeActions.current.push(guitarAction);
          }
        }
      }
    }

    animate();

    animationRegistry.register(variant, activeActions.current);

    return () => {
      mixer.current?.stopAllAction();
      animationRegistry.unregister(variant);
      activeActions.current = [];
    };
  }, [fbx, original.animations]);

  useFrame((_, delta) => {
    mixer.current?.update(delta);
  });

  return (
    <>
      <group {...positionProps} scale={0.015}>
        <primitive object={fbx} />
      </group>
    </>
  );
}

useFBX.preload("/maestro-game-xr/P_GUITARRA.fbx");
useFBX.preload("/maestro-game-xr/P_SAX.fbx");
useFBX.preload("/maestro-game-xr/P_TAMBOR.fbx");
useFBX.preload("/maestro-game-xr/P_TROMPETE.fbx");
