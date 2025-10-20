import { useMemo } from "react";
import * as THREE from "three";
import { GlowProps } from "./types";

export function Glow({ color }: GlowProps) {
  const shaderColor = color || new THREE.Color(0, 0, 1);

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        color: { value: shaderColor },
        innerRadius: { value: 0.15 },
        maxOpacity: { value: 0.4 },
      },
      vertexShader: `
        varying vec2 vUv;
        
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        uniform float innerRadius;
        uniform float maxOpacity;
        varying vec2 vUv;
        
        void main() {
          vec2 center = vec2(0.5, 0.5);
          float distance = length(vUv - center) * 2.0;
          
          float alpha = 0.0;
          
          if (distance <= innerRadius) {
            alpha = 0.0; 
          } else if (distance <= 1.0) {
            float gradientPosition = (distance - innerRadius) / (1.0 - innerRadius);
            
            if (gradientPosition <= 0.8) {
              alpha = maxOpacity * (gradientPosition / 0.8);
            } else {
              alpha = maxOpacity * (1.0 - (gradientPosition - 0.8) / 0.2);
            }
          }
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    });
  }, []);

  return (
    <sprite scale={[1, 1, 1]}>
      <primitive object={shaderMaterial} attach="material" />
    </sprite>
  );
}
