import { useFrame } from "@react-three/fiber";
import { useXRInputSourceState, useXRSpace } from "@react-three/xr";
import { useState } from "react";
import { getPoseName } from "../utils";

export function usePoseName(hand: "left" | "right") {
  const [poseName, setPoseName] = useState<
    "none" | "palm-up-open" | "palm-down-open" | "pointing" | "clicking"
  >();

  const referenceSpace = useXRSpace();
  const sourceState = useXRInputSourceState("hand", hand);

  useFrame((_, __, frame) => {
    if (!sourceState?.inputSource || !frame) return null;

    const hand = sourceState.inputSource.hand;

    setPoseName(getPoseName(hand, frame, referenceSpace));
  });

  return poseName;
}
