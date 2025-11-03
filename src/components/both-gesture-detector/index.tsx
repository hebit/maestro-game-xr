import { useEffect, useMemo, useState } from "react";
import { useGestureDirection } from "./hooks";
import { usePoseName } from "../../hooks";
import { TimelineEvent, useTimeline } from "../../contexts";
import { useAvaibilityState } from "../../hooks/use-avaibility-state";

import { Arrow } from "../arrow";

export function BothGestureDetector({
  event,
}: {
  event: TimelineEvent & { hand: "both" };
}) {
  const leftPoseName = usePoseName("left");
  const rightPoseName = usePoseName("right");
  const leftGestureDirection = useGestureDirection("left");
  const rightGestureDirection = useGestureDirection("right");
  const { matchEvent } = useTimeline();

  const { isAvailable, isVisible, isOff } = useAvaibilityState(
    event,
    3_000,
    300,
    500
  );
  const [matched, setMatched] = useState(false);

  const executedMove = useMemo(() => {
    if (leftPoseName === "none" || rightPoseName === "none") return undefined;

    if (
      leftPoseName === "palm-down-open" &&
      leftGestureDirection === "down" &&
      rightPoseName === "palm-up-open" &&
      rightGestureDirection === "up"
    )
      return "move-palm-down-open";
    if (
      leftPoseName === "palm-up-open" &&
      leftGestureDirection === "up" &&
      rightPoseName === "palm-down-open" &&
      rightGestureDirection === "down"
    )
      return "move-palm-up-open";

    if (
      leftPoseName === "clicking" &&
      leftGestureDirection !== "none" &&
      rightPoseName === "clicking" &&
      rightGestureDirection !== "none"
    ) {
      return `move-baton-${leftGestureDirection}`;
    }
  }, [
    leftPoseName,
    leftGestureDirection,
    rightPoseName,
    rightGestureDirection,
  ]);

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
    if (isOff && !matched) return "red";
    return matched ? "green" : "white";
  }, [isOff, matched]);

  if (!isVisible) return null;

  return (
    <>
      {expectedDirection && (
        <>
          <group position={[-0.1, 0, 0]}>
            <Arrow
              duration={3_000}
              noTail={event.move.includes("palm")}
              direction={expectedDirection}
              color={color}
              finishLineXShift={0.1}
            />
          </group>
          <group position={[0.1, 0, 0]}>
            <Arrow
              duration={3_000}
              noTail={event.move.includes("palm")}
              direction={expectedDirection}
              color={color}
              hideFinishLine
            />
          </group>
        </>
      )}
    </>
  );
}
