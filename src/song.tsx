import { Text } from "@react-three/drei";
import { useCallback, useEffect, useRef, useState } from "react";

import * as Tone from "tone";

interface ButtonProps {
  position: [number, number, number];
  onClick?(): void;
  label: string;
}

const Button = ({ position, onClick, label }: ButtonProps) => {
  const meshRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handlePointerEnter = () => {
    setHovered(true);
  };

  const handlePointerLeave = () => {
    setHovered(false);
  };

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={handleClick}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <boxGeometry args={[1, 0.5, 0.1]} />
      <meshStandardMaterial color={hovered ? "lightblue" : "blue"} />
      <Text
        position={[0, 0, 0.1]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </mesh>
  );
};

export function Song() {
  const playSong = useCallback(() => {
    const synth = new Tone.Synth().toDestination();
    const now = Tone.now();
    synth.triggerAttackRelease("C4", "8n", now);
    synth.triggerAttackRelease("E4", "8n", now + 0.5);
    synth.triggerAttackRelease("G4", "8n", now + 1);
  }, []);

  return (
    <>
      <Button onClick={playSong} label="Play" position={[0, 2, -2]} />
    </>
  );
}
