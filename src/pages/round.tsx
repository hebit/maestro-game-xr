import { useXRInputSourceEvent, useXRInputSourceState } from "@react-three/xr";
import { useEffect, useState } from "react";
import { TimelineContextProvider } from "../contexts";
import { Canva, Person } from "../components";
import { Text } from "@react-three/drei";

export function RoundPage() {
  const [ms, setMs] = useState<number>(5_000);

  const handState = useXRInputSourceState("hand", "right");
  const inputSource = handState?.inputSource;

  useXRInputSourceEvent(inputSource, "select", () => {}, []);

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

  return (
    <>
      {started ? (
        <>
          <TimelineContextProvider>
            <Person position="center" variant="guitar" />
            <Person position="right" variant="drum" />
            <Person position="left" variant="sax" />
            <Canva />
          </TimelineContextProvider>
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
    </>
  );
}
