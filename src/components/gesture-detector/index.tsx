import { useEffect, useMemo, useState } from "react";
import { useGestureDirection } from "./hooks";
import { usePoseName } from "../../hooks";
import { TimelineEvent, useTimeline } from "../../contexts";
import { useAvaibilityState } from "../../hooks/use-avaibility-state";

import { Arrow } from "../arrow";

export function GestureDetector({ event }: { event: TimelineEvent }) {
  const poseName = usePoseName(event.hand);
  const gestureDirection = useGestureDirection();
  const { matchEvent } = useTimeline();

  const { isAvailable, isVisible } = useAvaibilityState(event);
  const [matched, setMatched] = useState(false);

  const executedMove = useMemo(() => {
    if (poseName === "none") return undefined;

    if (poseName === "palm-down-open" && gestureDirection === "down")
      return "move-palm-down-open";
    if (poseName === "palm-up-open" && gestureDirection === "up")
      return "move-palm-up-open";

    if (poseName === "clicking" && gestureDirection !== "none") {
      return `move-baton-${gestureDirection}`;
    }
  }, [poseName, gestureDirection]);

  useEffect(() => {
    if (!isAvailable) return;

    if (executedMove === event.move) {
      setMatched(true);
      matchEvent(event, 1);
    }
  }, [executedMove, event.move, isAvailable]);

  const expectedDirection = (() => {
    if (event.move.includes("left")) return "left";
    if (event.move.includes("right")) return "right";
    if (event.move.includes("down")) return "down";
    if (event.move.includes("up")) return "up";
  })();

  const color = useMemo(() => {
    if (!isAvailable) return "white";
    return matched ? "green" : "red";
  }, [isAvailable, matched]);

  if (!isVisible) return null;

  return (
    <>
      {expectedDirection && (
        <Arrow
          noTail={event.move.includes("palm")}
          direction={expectedDirection}
          color={color}
        />
      )}
    </>
  );
}
