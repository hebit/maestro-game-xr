import { isClicking } from "./is-clicking";
import { isPalmOpen } from "./is-palm-open";
import { isPointing } from "./is-pointing";

export function getPoseName(
  hand: XRHand,
  frame: XRFrame,
  referenceSpace: XRSpace
) {
  const palmState = isPalmOpen(hand, frame, referenceSpace);
  if (palmState?.open) {
    return palmState.orientation === "up" ? "palm-up-open" : "palm-down-open";
  }

  if (isPointing(hand, frame, referenceSpace)) {
    return "pointing";
  }

  if (isClicking(hand, frame, referenceSpace)) {
    return "clicking";
  }

  return "none";
}
