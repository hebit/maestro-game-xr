import { useEffect, useMemo, useState } from "react";
import { useGestureDirection } from "./hooks";
import { usePoseName } from "../../hooks";
import { TimelineEvent, useTimeline } from "../../contexts";
import { useAvaibilityState } from "../../hooks/use-avaibility-state";

import { Tile } from "../tile";
import { subMilliseconds } from "date-fns";

export function PalmDetector({
  event,
}: {
  event: TimelineEvent & { hand: "left" | "right" };
}) {
  const poseName = usePoseName(event.hand);
  const gestureDirection = useGestureDirection(event.hand);
  const { matchEvent } = useTimeline();

  const duration = 1_600;
  const preDuration = 2_000;

  const { isAvailable, isVisible, isOff } = useAvaibilityState(
    event,
    preDuration,
    300,
    duration,
    duration
  );

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

    if (event.move.includes("down")) {
      // @ts-ignore
      window.pauseAnimations?.();
    } else {
      // @ts-ignore
      window.resumeAnimations?.();
    }

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

  const startTime = useMemo(
    () => subMilliseconds(event.time, preDuration),
    [event.time, preDuration]
  );

  /* useEffect(() => {
    if (expectedDirection === "up") {
      console.log(
        "PalmDetector - event.time:",
        format(event.time, "HH:mm:ss.SSS"),
        "startTime:",
        format(startTime, "HH:mm:ss.SSS")
      );
    }
  }, []); */

  const panelOpacity = 0.2;

  if (!isVisible) return null;

  return (
    <>
      {expectedDirection && (
        <Tile
          xPosition={event.position[0] / 2}
          duration={duration}
          preDuration={preDuration}
          direction={expectedDirection}
          color={color}
          startTime={startTime}
          panelOpacity={panelOpacity}
        />
      )}
    </>
  );
}
