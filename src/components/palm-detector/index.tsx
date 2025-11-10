import { useEffect, useMemo, useState } from "react";
import { useGestureDirection } from "./hooks";
import { usePoseName } from "../../hooks";
import { TimelineEvent, useTimeline } from "../../contexts";
import { useAvaibilityState } from "../../hooks/use-avaibility-state";

import { Tile } from "../tile";

export function PalmDetector({
  event,
}: {
  event: TimelineEvent & { hand: "left" | "right" };
}) {
  const poseName = usePoseName(event.hand);
  const gestureDirection = useGestureDirection(event.hand);
  const { matchEvent } = useTimeline();

  const duration = 2_400;

  const { isAvailable, isVisible, isOff } = useAvaibilityState(
    event,
    3_400,
    300,
    duration + 600,
    duration
  );

  /*   useEffect(() => {
    console.log({
      isAvailable,
      isVisible,
      isOff,
    });
  }, [isAvailable, isVisible, isOff]); */

  const [matchingTime, setMatchingTime] = useState(0);
  const [matching, setMatching] = useState(false);
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
      setMatching(true);
      // matchEvent(event, 1);
    }
  }, [executedMove, event.move, isAvailable]);

  useEffect(() => {
    if (!matching) return;

    const interval = setInterval(() => {
      setMatchingTime((time) => time + 100);
    }, 100);

    return () => clearInterval(interval);
  }, [matching]);

  useEffect(() => {
    if (matchingTime < 1_000) return;

    if (!matched) {
      setMatched(true);
      matchEvent(event, 1);
    }
  }, [matchingTime]);

  const expectedDirection = (() => {
    if (event.move.includes("down")) return "down";
    if (event.move.includes("up")) return "up";
  })();

  const color = useMemo(() => {
    if (isOff && !matched) return "red";
    if (!matched && matchingTime > 0) return "#78ff78";
    if (matched || matchingTime > 0) return "green";
    return "white";
  }, [isOff, matched, matchingTime]);

  const panelOpacity = 0.2;

  if (!isVisible) return null;

  return (
    <>
      {expectedDirection && (
        <Tile
          xPosition={event.position[0] / 2}
          duration={duration}
          direction={expectedDirection}
          color={color}
          panelOpacity={panelOpacity}
        />
      )}
    </>
  );
}
