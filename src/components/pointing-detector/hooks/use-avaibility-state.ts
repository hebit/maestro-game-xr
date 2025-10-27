import { useFrame } from "@react-three/fiber";
import { useState } from "react";
import { differenceInMilliseconds } from "date-fns";
import { TimelineEvent } from "../../../contexts";

export function useAvaibilityState(
  event: TimelineEvent,
  visibleTime: number | undefined = 2_000,
  availableTime: number | undefined = 500,
  shutdownTime: number | undefined = 500
) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);

  useFrame(() => {
    const now = new Date();

    if (now <= event.time) {
      setIsVisible(differenceInMilliseconds(event.time, now) <= visibleTime);
      setIsAvailable(
        differenceInMilliseconds(event.time, now) <= availableTime
      );
    } else {
      const shouldRender =
        differenceInMilliseconds(now, event.time) < shutdownTime;
      setIsVisible(shouldRender);
      setIsAvailable(shouldRender);
    }
  });

  return { isVisible, isAvailable };
}
