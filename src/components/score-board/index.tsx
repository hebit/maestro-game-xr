import { useMemo } from "react";
import * as THREE from "three";
import { Text, Float, Center } from "@react-three/drei";
import { useSpring, animated, config } from "@react-spring/three";
import { ScoreBoardProps } from "./types";

const COLORS = {
  green: "#009B3A",
  red: "#E70012",
  yellow: "#DFB700",
  black: "#1a1a1a",
  white: "#ffffff",
};

const FONT_URL = "/maestro-game-xr/bonoco.ttf";

export function ScoreBoard({ score, position }: ScoreBoardProps) {
  const { scale, rotation } = useSpring({
    from: { scale: 0, rotation: [0, -Math.PI / 4, 0] },
    to: { scale: 1, rotation: [0, 0, 0] },
    config: config.wobbly,
    delay: 4200,
  });

  const phrase = useMemo(() => {
    const phrases = ["YOU ROCK!", "BROCOU!", "BARRIL DOBRADO!"];
    return phrases[Math.floor(Math.random() * phrases.length)];
  }, []);

  return (
    <animated.group
      position={position}
      scale={scale}
      rotation={rotation as unknown as [number, number, number]}
    >
      <Float speed={4} rotationIntensity={0.2} floatIntensity={0.5}>
        <Center>
          <group>
            <group scale={[1.2, 0.5, 1]}>
              <mesh position={[0, 0, -0.3]} rotation={[0, 0, 0.5]}>
                <circleGeometry args={[4.5, 5]} />
                <meshBasicMaterial color={COLORS.black} toneMapped={false} />
              </mesh>
            </group>

            <group scale={[1, 0.7, 1]}>
              <mesh position={[1.5, -0.4, -0.16]} rotation={[0, 0, -0.6]}>
                <circleGeometry args={[2.6, 7]} />
                <meshStandardMaterial
                  color={COLORS.red}
                  side={THREE.DoubleSide}
                />
              </mesh>
            </group>

            <mesh position={[0, -0.8, -0.15]} rotation={[0, 0, -0.1]}>
              <planeGeometry args={[6, 2.0]} />
              <meshStandardMaterial
                color={COLORS.green}
                side={THREE.DoubleSide}
              />
            </mesh>

            <Text
              font={FONT_URL}
              position={[0.05, 0.85, 0.01]}
              fontSize={1}
              color={COLORS.black}
              anchorX="center"
              anchorY="middle"
            >
              {phrase}
            </Text>
            <Text
              font={FONT_URL}
              position={[0, 0.9, 0.1]}
              fontSize={1}
              color={COLORS.white}
              outlineWidth={0.05}
              outlineColor={COLORS.black}
              anchorX="center"
              anchorY="middle"
            >
              {phrase}
            </Text>

            <Text
              font={FONT_URL}
              position={[0.1, -0.6, 0.1]}
              fontSize={2.5}
              color={COLORS.black}
              anchorX="center"
              anchorY="middle"
            >
              {score.toLocaleString()}
            </Text>

            <Text
              font={FONT_URL}
              position={[0, -0.5, 0.2]}
              fontSize={2.5}
              color={COLORS.yellow}
              outlineWidth={0.08}
              outlineColor={COLORS.black}
              anchorX="center"
              anchorY="middle"
            >
              {score.toLocaleString()}
            </Text>

            <Text
              font={FONT_URL}
              position={[2, -1.2, 0.25]}
              fontSize={0.5}
              rotation={[0, 0, -0.2]}
              color={COLORS.white}
              outlineWidth={0.02}
              outlineColor={COLORS.black}
            >
              PTS
            </Text>
          </group>
        </Center>
      </Float>
    </animated.group>
  );
}
