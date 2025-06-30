import { Canvas, useFrame } from "@react-three/fiber";
import {
  XR,
  createXRStore,
  useXRInputSourceState,
  useXRSpace,
  XRSpace as XRSpaceProvider,
} from "@react-three/xr";
import { Text } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { getPoseName } from "./utils";
import { usePoseName, usePreviousValue } from "./hooks";
import { GestureDetector } from "./gesture-detector";
import { Mesh } from "three";
import { PointingDetector } from "./pointing-detector";

const store = createXRStore({
  emulate: {
    primaryInputMode: "hand",
    syntheticEnvironment: false,
  },
});

function Countdown({
  time,
  poseName,
}: {
  time: number;
  poseName: string | undefined;
}) {
  const [ms, setMs] = useState<number>(time);
  const previousPoseName = usePreviousValue(poseName);
  const [matched, setMatched] = useState<boolean>(false);

  useEffect(() => {
    setMs(time);
    setMatched(false);
    const interval = setInterval(
      () =>
        setMs((value) => {
          if (value <= 0) {
            setMatched(false);
            return time;
          }

          return value - 1_000;
        }),
      1_000
    );

    return () => clearInterval(interval);
  }, [time]);

  function renderText() {
    if (ms <= 0) return "GO!";

    return (ms / 1_000).toFixed(0);
  }

  const isReady = ms <= 0;

  useEffect(() => {
    if (!isReady) return;
    // console.log({ poseName, isReady, previousPoseName });
    if (poseName === "clicking" && previousPoseName !== "clicking")
      setMatched(true);
  }, [isReady, poseName, previousPoseName]);

  return (
    <>
      <Text
        position={[0, 2.5, -2]}
        fontSize={0.2}
        color={matched ? "blue" : "white"}
        anchorX="center"
        anchorY="middle"
      >
        {renderText()}
      </Text>
    </>
  );
}

function Inside() {
  const [red, setRed] = useState(false);
  const poseName = usePoseName();

  return (
    <>
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
      {/* <Countdown time={5_000} poseName={poseName} /> */}
      <GestureDetector />

      {/* <PointingDetector /> */}
      {/*  {poseName && (
        <Text
          position={[0, 1.5, -2]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {poseName}
        </Text>
      )} */}
    </>
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
