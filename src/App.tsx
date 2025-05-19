import { Canvas, useFrame } from "@react-three/fiber";
import {
  XR,
  createXRStore,
  useXRInputSourceState,
  useXRSpace,
  XRSpace as XRSpaceProvider,
} from "@react-three/xr";
import { useState } from "react";
import { getPoseName } from "./utils";

const store = createXRStore({
  emulate: {
    primaryInputMode: "hand",
    syntheticEnvironment: false,
  },
});

function Inside() {
  const [red, setRed] = useState(false);

  const referenceSpace = useXRSpace();
  const sourceState = useXRInputSourceState("hand", "left");

  useFrame((_, __, frame) => {
    if (!sourceState?.inputSource || !frame) return null;

    const hand = sourceState.inputSource.hand;

    console.log({ pose: getPoseName(hand, frame, referenceSpace) });
  });
  return (
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
  );
}

export default function App() {
  return (
    <>
      <button onClick={() => store.enterVR()}>Enter VR</button>
      <Canvas>
        <XR store={store}>
          <XRSpaceProvider space={"local-floor"}>
            <Inside />
          </XRSpaceProvider>
        </XR>
      </Canvas>
    </>
  );
}
