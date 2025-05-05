import { Canvas } from "@react-three/fiber";
import { XR, createXRStore } from "@react-three/xr";
import { useState } from "react";

const store = createXRStore({
  emulate: {
    primaryInputMode: "hand",
    syntheticEnvironment: false,
  },
});

export default function App() {
  const [red, setRed] = useState(false);

  return (
    <>
      <button onClick={() => store.enterVR()}>Enter VR</button>
      <Canvas>
        <XR store={store}>
          <mesh
            castShadow
            receiveShadow
            scale={0.5}
            position={[0, 1, -1]}
            onClick={() => setRed(!red)}
          >
            <boxGeometry />
            <meshStandardMaterial
              emissiveIntensity={1}
              emissive={red ? "red" : "blue"}
              toneMapped={false}
            />
          </mesh>
        </XR>
      </Canvas>
    </>
  );
}
