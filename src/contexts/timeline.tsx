import { addMilliseconds } from "date-fns";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import * as Tone from "tone";

export interface TimelineEvent {
  id: string;
  hand: "left" | "right";
  move:
    | "pointing"
    | "move-palm-down-open"
    | "move-palm-up-open"
    | "move-baton-left"
    | "move-baton-right"
    | "move-baton-up"
    | "move-baton-down";
  position: [number, number, number]; // [-1~1, 1.5~2.0, -1.5]
  step: number; // 1.9s -> 1900ms
  time: Date;
}

export const TimelineContext = createContext({
  startTime: new Date(),
  events: [] as TimelineEvent[],
  score: 0,
  fails: [] as TimelineEvent["id"][],
  songId: "varias-queixas" as string,
  matchEvent(_event: TimelineEvent, _rating?: number) {},
});

export function useTimeline() {
  return useContext(TimelineContext);
}

const eventsBySong = {
  ["varias-queixas" as string]: [
    {
      id: "hash-0",
      hand: "left",
      move: "pointing",
      position: [1, 1.7, -1.5], // [-1~1, 1.5~2.0, -1.5]
      step: 1_900, // 1.9s -> 1900ms
    },
    {
      id: "hash-1",
      hand: "right",
      move: "move-baton-down",
      position: [0, 1.7, -1.5], // [-1~1, 1.5~2.0, -1.5]
      step: 4_500, // 1.9s -> 1900ms
    },
    {
      id: "hash-2",
      hand: "left",
      move: "pointing",
      position: [-1, 1.7, -1.5], // [-1~1, 1.5~2.0, -1.5]
      step: 8_900, // 1.9s -> 1900ms
    },
    {
      id: "hash-3",
      hand: "right",
      move: "move-baton-up",
      position: [0, 1.7, -1.5], // [-1~1, 1.5~2.0, -1.5]
      step: 13_000, // 1.9s -> 1900ms
    },
    {
      id: "hash-4",
      hand: "right",
      move: "move-baton-left",
      position: [0, 1.7, -1.5], // [-1~1, 1.5~2.0, -1.5]
      step: 14_500, // 1.9s -> 1900ms
    },
    {
      id: "hash-5",
      hand: "left",
      move: "pointing",
      position: [0.5, 1.7, -1.5], // [-1~1, 1.5~2.0, -1.5]
      step: 19_900, // 1.9s -> 1900ms
    },
    {
      id: "hash-6",
      hand: "left",
      move: "pointing",
      position: [0, 1.7, -1.5], // [-1~1, 1.5~2.0, -1.5]
      step: 21_900, // 1.9s -> 1900ms
    },
    {
      id: "hash-7",
      hand: "left",
      move: "pointing",
      position: [0.5, 1.7, -1.5], // [-1~1, 1.5~2.0, -1.5]
      step: 115_000, // 1.9s -> 1900ms
    },
  ] as Omit<TimelineEvent, "time">[],
};

interface TimelineContextProviderProps extends React.PropsWithChildren {
  songId?: string;
}

const player = new Tone.Player({
  url: "/maestro-game-xr/varias-queixas.mp3",
  // loop: true,
  // autostart: true,
});

export function TimelineContextProvider({
  songId = "varias-queixas",
  children,
}: TimelineContextProviderProps) {
  const startTime = useMemo(() => new Date(), []);

  const events = useMemo(() => {
    return eventsBySong[songId].map((event) => ({
      ...event,
      time: addMilliseconds(startTime, event.step),
    })) as TimelineEvent[];
  }, [startTime]);

  const [score, setScore] = useState<number>(0);

  const matchEvent = useCallback(
    (event: TimelineEvent, rating: number | undefined = 1) => {
      console.log({ event, rating });
      setScore((score) => score + 10 * rating);
    },
    [setScore]
  );

  useEffect(() => {
    console.log("AUDIO PLAY");
    player.start();
  }, []);

  return (
    <TimelineContext.Provider
      value={{
        songId,
        startTime,
        events,
        fails: [],
        score,
        matchEvent,
      }}
    >
      {children}
    </TimelineContext.Provider>
  );
}
