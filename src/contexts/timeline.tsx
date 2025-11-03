import { Text } from "@react-three/drei";
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

export function generateEventIdUUID(): string {
  return crypto.randomUUID();
}

interface SingleHandTimelineEvent {
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

interface BothHandsTimelineEvent {
  id: string;
  hand: "both";
  move:
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

export type TimelineEvent = SingleHandTimelineEvent | BothHandsTimelineEvent;

export const TimelineContext = createContext({
  startTime: new Date(),
  events: [] as TimelineEvent[],
  score: 0,
  fails: [] as TimelineEvent["id"][],
  songId: generateEventIdUUID() as string,
  matchEvent(_event: TimelineEvent, _rating?: number) {},
});

export function useTimeline() {
  return useContext(TimelineContext);
}

const presetPositions: Record<string, [number, number, number]> = {
  middle: [0, 1.7, -1.5],
  left: [-1, 1.7, -1.5],
  right: [1, 1.7, -1.5],
};

const songConfig = {
  ["varias-queixas" as string]: {
    bpm: 107,
    startTime: 7_367,
  },
};

const bandComposition = {
  ["varias-queixas"]: {
    sax: presetPositions.right,
    guitar: presetPositions.left,
    drum: presetPositions.middle,
    general: presetPositions.middle,
  },
};

const eventsBySong = {
  ["varias-queixas" as string]: [
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-up",
      position: bandComposition["varias-queixas"].general, // [-1~1, 1.5~2.0, -1.5]
      step: 0, // 1.9s -> 1900ms
    },
    {
      id: generateEventIdUUID(),
      hand: "both",
      move: "move-baton-up",
      position: bandComposition["varias-queixas"].general, // [-1~1, 1.5~2.0, -1.5]
      step: 1, // 1.9s -> 1900ms
    },
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-up",
      position: bandComposition["varias-queixas"].general, // [-1~1, 1.5~2.0, -1.5]
      step: 2, // 1.9s -> 1900ms
    },
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-up",
      position: bandComposition["varias-queixas"].general, // [-1~1, 1.5~2.0, -1.5]
      step: 3, // 1.9s -> 1900ms
    },
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-up",
      position: bandComposition["varias-queixas"].general, // [-1~1, 1.5~2.0, -1.5]
      step: 4, // 1.9s -> 1900ms
    },
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-palm-down-open",
      position: [-1, 1.7, -1.5], // [-1~1, 1.5~2.0, -1.5]
      step: 5, // 1.9s -> 1900ms
    },
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-palm-up-open",
      position: bandComposition["varias-queixas"].general, // [-1~1, 1.5~2.0, -1.5]
      step: 6.25, // 1.9s -> 1900ms
    },

    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-up",
      position: bandComposition["varias-queixas"].general, // [-1~1, 1.5~2.0, -1.5]
      step: 7, // 1.9s -> 1900ms
    },

    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-up",
      position: bandComposition["varias-queixas"].general, // [-1~1, 1.5~2.0, -1.5]
      step: 7.75, // 1.9s -> 1900ms
    },

    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-palm-up-open",
      position: bandComposition["varias-queixas"].general, // [-1~1, 1.5~2.0, -1.5]
      step: 8.25, // 1.9s -> 1900ms
    },
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-up",
      position: [-1, 1.7, -1.5], // [-1~1, 1.5~2.0, -1.5]
      step: 9, // 1.9s -> 1900ms
    },
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-up",
      position: bandComposition["varias-queixas"].general, // [-1~1, 1.5~2.0, -1.5]
      step: 9.75, // 1.9s -> 1900ms
    },
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-palm-up-open",
      position: bandComposition["varias-queixas"].general, // [-1~1, 1.5~2.0, -1.5]
      step: 10.25, // 1.9s -> 1900ms
    },
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-up",
      position: [-1, 1.7, -1.5], // [-1~1, 1.5~2.0, -1.5]
      step: 11, // 1.9s -> 1900ms
    },
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-up",
      position: bandComposition["varias-queixas"].general, // [-1~1, 1.5~2.0, -1.5]
      step: 11.75, // 1.9s -> 1900ms
    },
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-palm-up-open",
      position: bandComposition["varias-queixas"].general, // [-1~1, 1.5~2.0, -1.5]
      step: 12.25, // 1.9s -> 1900ms
    },
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-up",
      position: [-1, 1.7, -1.5], // [-1~1, 1.5~2.0, -1.5]
      step: 13, // 1.9s -> 1900ms
    },
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-down",
      position: bandComposition["varias-queixas"].general, // [-1~1, 1.5~2.0, -1.5]
      step: 14, // 1.9s -> 1900ms
    },
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-up",
      position: bandComposition["varias-queixas"].general, // [-1~1, 1.5~2.0, -1.5]
      step: 14.5, // 1.9s -> 1900ms
    },
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-up",
      position: bandComposition["varias-queixas"].general, // [-1~1, 1.5~2.0, -1.5]
      step: 15, // 1.9s -> 1900ms
    },
    {
      id: generateEventIdUUID(),
      hand: "left",
      move: "pointing",
      position: bandComposition["varias-queixas"].general, // [-1~1, 1.5~2.0, -1.5]
      step: 15.5, // 1.9s -> 1900ms
    },
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-down",
      position: bandComposition["varias-queixas"].general, // [-1~1, 1.5~2.0, -1.5]
      step: 16, // 1.9s -> 1900ms
    },
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-up",
      position: bandComposition["varias-queixas"].general, // [-1~1, 1.5~2.0, -1.5]
      step: 16.5, // 1.9s -> 1900ms
    },
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-up",
      position: bandComposition["varias-queixas"].general, // [-1~1, 1.5~2.0, -1.5]
      step: 17, // 1.9s -> 1900ms
    },
    {
      id: generateEventIdUUID(),
      hand: "left",
      move: "pointing",
      position: bandComposition["varias-queixas"].general, // [-1~1, 1.5~2.0, -1.5]
      step: 17.5, // 1.9s -> 1900ms
    },
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-down",
      position: bandComposition["varias-queixas"].general, // [-1~1, 1.5~2.0, -1.5]
      step: 18, // 1.9s -> 1900ms
    },
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-up",
      position: bandComposition["varias-queixas"].general, // [-1~1, 1.5~2.0, -1.5]
      step: 18.5, // 1.9s -> 1900ms
    },
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-up",
      position: bandComposition["varias-queixas"].general, // [-1~1, 1.5~2.0, -1.5]
      step: 19, // 1.9s -> 1900ms
    },
    {
      id: generateEventIdUUID(),
      hand: "left",
      move: "pointing",
      position: bandComposition["varias-queixas"].general, // [-1~1, 1.5~2.0, -1.5]
      step: 19.5, // 1.9s -> 1900ms
    },
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-down",
      position: bandComposition["varias-queixas"].general, // [-1~1, 1.5~2.0, -1.5]
      step: 20, // 1.9s -> 1900ms
    },
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-up",
      position: bandComposition["varias-queixas"].general, // [-1~1, 1.5~2.0, -1.5]
      step: 20.5, // 1.9s -> 1900ms
    },
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-up",
      position: bandComposition["varias-queixas"].general, // [-1~1, 1.5~2.0, -1.5]
      step: 21, // 1.9s -> 1900ms
    },
    {
      id: generateEventIdUUID(),
      hand: "left",
      move: "pointing",
      position: bandComposition["varias-queixas"].general, // [-1~1, 1.5~2.0, -1.5]
      step: 21.5, // 1.9s -> 1900ms
    },
  ] as Omit<TimelineEvent, "time">[],
};

interface TimelineContextProviderProps extends React.PropsWithChildren {
  songId?: string;
}

const player = new Tone.Player({
  url: "/maestro-game-xr/varias-queixas.mp3",
  autostart: false,
}).toDestination();

export function TimelineContextProvider({
  songId = "varias-queixas",
  children,
}: TimelineContextProviderProps) {
  const startTime = useMemo(() => new Date(), []);

  const events = useMemo(() => {
    function calculateStepTime(step: number) {
      const bpm = songConfig[songId].bpm;
      const secondsPerBeat = 60 / bpm;
      return step * (secondsPerBeat * 4) * 1000;
    }
    return eventsBySong[songId].map((event) => {
      const eventRelativeTime = calculateStepTime(event.step);
      const eventTime = songConfig[songId].startTime + eventRelativeTime;
      return {
        ...event,
        time: addMilliseconds(startTime, eventTime),
      };
    }) as TimelineEvent[];
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
      <Text
        position={[0, 2, -1.5]}
        fontSize={0.05}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        Current Score: {score}
      </Text>
      {children}
    </TimelineContext.Provider>
  );
}
