import { Canvas } from "@react-three/fiber";
import { XR, createXRStore, XRSpace as XRSpaceProvider } from "@react-three/xr";
import { Text } from "@react-three/drei";
import { useEffect, useMemo, useState } from "react";
import {
  //Canva,
  GestureDetector,
  Skybox,
} from "./components";
//import { TimelineContextProvider } from "./contexts";

const store = createXRStore({
  emulate: {
    primaryInputMode: "hand",
    syntheticEnvironment: "office_large",
    //syntheticEnvironment: false,
    // syntheticEnvironment: false,
  },
});

function Game() {
  const [ms, setMs] = useState<number>(5_000);

  useEffect(() => {
    const interval = setInterval(
      () =>
        setMs((value) => {
          if (value <= 0) {
            return 0;
          }

          return value - 1_000;
        }),
      1_000
    );

    return () => clearInterval(interval);
  }, []);

  function renderText() {
    if (ms <= 0) return "GO!";

    return (ms / 1_000).toFixed(0);
  }

  const started = ms <= 0;

  const time = useMemo(() => new Date(), [started]);

  return (
    <>
      {started ? (
        <>
          <ambientLight />
          <GestureDetector
            event={{
              hand: "right",
              id: "abc123",
              move: "move-baton-down",
              position: [0, 1.7, -1.5],
              step: 4500,
              time,
            }}
          />
          {/* <TimelineContextProvider>
          <Canva />
        </TimelineContextProvider> */}
        </>
      ) : (
        <Text
          position={[0, 2.5, -2]}
          fontSize={0.2}
          color={"blue"}
          anchorX="center"
          anchorY="middle"
        >
          {renderText()}
        </Text>
      )}

      {/* <Countdown time={5_000} poseName={poseName} /> */}
      {/* <GestureDetector /> */}

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
            <Skybox />
            <Game />
          </XRSpaceProvider>
        </XR>
      </Canvas>
    </>
  );
}
