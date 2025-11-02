import { useFrame } from "@react-three/fiber";
import { useState } from "react";
import { TimelineEvent } from "../contexts";
import { differenceInMilliseconds } from "date-fns";

export function useAvaibilityState(
  event: TimelineEvent,
  visibleTime: number | undefined = 2_000,
  availableTime: number | undefined = 300,
  shutdownTime: number | undefined = 500,
  usePostEventDetection: boolean | undefined = true
) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [isOff, setIsOff] = useState(false);

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
      const shouldBeAvailable = usePostEventDetection
        ? differenceInMilliseconds(now, event.time) < availableTime
        : false;
      setIsVisible(shouldRender);
      setIsAvailable(shouldBeAvailable);
      setIsOff(!shouldBeAvailable);
    }
  });

  return { isVisible, isAvailable, isOff };
}
