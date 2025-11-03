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
  position: [number, number, number];
  step: number;
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
  position: [number, number, number];
  step: number;
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
      position: bandComposition["varias-queixas"].general,
      step: 0,
    },
    {
      id: generateEventIdUUID(),
      hand: "both",
      move: "move-baton-up",
      position: bandComposition["varias-queixas"].general,
      step: 1,
    },
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-up",
      position: bandComposition["varias-queixas"].general,
      step: 2,
    },
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-up",
      position: bandComposition["varias-queixas"].general,
      step: 3,
    },
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-up",
      position: bandComposition["varias-queixas"].general,
      step: 4,
    },
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-palm-down-open",
      position: [-1, 1.7, -1.5],
      step: 5,
    },
    // Plateia: Ê, Faraó
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-palm-up-open",
      position: bandComposition["varias-queixas"].general,
      step: 6.25,
    },

    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-up",
      position: bandComposition["varias-queixas"].general,
      step: 7,
    },

    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-up",
      position: bandComposition["varias-queixas"].general,
      step: 7.75,
    },
    // Plateia: Ê, Faraó
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-palm-up-open",
      position: bandComposition["varias-queixas"].general,
      step: 8.25,
    },
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-up",
      position: [-1, 1.7, -1.5],
      step: 9,
    },
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-up",
      position: bandComposition["varias-queixas"].general,
      step: 9.75,
    },
    // Plateia: Ê, Faraó
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-palm-up-open",
      position: bandComposition["varias-queixas"].general,
      step: 10.25,
    },
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-up",
      position: [-1, 1.7, -1.5],
      step: 11,
    },
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-up",
      position: bandComposition["varias-queixas"].general,
      step: 11.75,
    },
    // Plateia: Ê, Faraó
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-palm-up-open",
      position: bandComposition["varias-queixas"].general,
      step: 12.25,
    },
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-up",
      position: [-1, 1.7, -1.5],
      step: 13,
    },
    // Deuses, divindade infinita do universo
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-down",
      position: bandComposition["varias-queixas"].general,
      step: 14,
    },
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-up",
      position: bandComposition["varias-queixas"].general,
      step: 14.5,
    },
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-up",
      position: bandComposition["varias-queixas"].general,
      step: 15,
    },
    {
      id: generateEventIdUUID(),
      hand: "left",
      move: "pointing",
      position: bandComposition["varias-queixas"].sax,
      step: 15.5,
    },
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-down",
      position: bandComposition["varias-queixas"].general,
      step: 16,
    },
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-up",
      position: bandComposition["varias-queixas"].general,
      step: 16.5,
    },
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-up",
      position: bandComposition["varias-queixas"].general,
      step: 17,
    },
    {
      id: generateEventIdUUID(),
      hand: "left",
      move: "pointing",
      position: bandComposition["varias-queixas"].sax,
      step: 17.5,
    },
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-down",
      position: bandComposition["varias-queixas"].general,
      step: 18,
    },
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-up",
      position: bandComposition["varias-queixas"].general,
      step: 18.5,
    },
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-up",
      position: bandComposition["varias-queixas"].general,
      step: 19,
    },
    {
      id: generateEventIdUUID(),
      hand: "left",
      move: "pointing",
      position: bandComposition["varias-queixas"].sax,
      step: 19.5,
    },
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-down",
      position: bandComposition["varias-queixas"].general,
      step: 20,
    },
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-up",
      position: bandComposition["varias-queixas"].general,
      step: 20.5,
    },
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-up",
      position: bandComposition["varias-queixas"].general,
      step: 21,
    },
    {
      id: generateEventIdUUID(),
      hand: "left",
      move: "pointing",
      position: bandComposition["varias-queixas"].sax,
      step: 21.5,
    },
    // A Emersão
    // Nem Osíris sabe como aconteceu
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-down",
      position: bandComposition["varias-queixas"].general,
      step: 22,
    },
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-up",
      position: bandComposition["varias-queixas"].general,
      step: 22.5,
    },
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-up",
      position: bandComposition["varias-queixas"].general,
      step: 23,
    },
    // A Emersão
    // Nem Osíris sabe como aconteceu (Coral)
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-palm-up-open",
      position: bandComposition["varias-queixas"].general,
      step: 24.25,
    },
    // A Ordem ou submissão do olho seu
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-down",
      position: bandComposition["varias-queixas"].general,
      step: 26,
    },
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-up",
      position: bandComposition["varias-queixas"].general,
      step: 26.5,
    },
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-up",
      position: bandComposition["varias-queixas"].general,
      step: 27,
    },
    /*    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-down",
      position: bandComposition["varias-queixas"].general,
      step: 28,
    },
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-up",
      position: bandComposition["varias-queixas"].general,
      step: 28.5,
    },
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-up",
      position: bandComposition["varias-queixas"].general,
      step: 29,
    }, */
    // Transformou-se na verdadeira humanidade (Coral)
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-palm-up-open",
      position: bandComposition["varias-queixas"].general,
      step: 28.5,
    },
    // Epopéia
    // Do código de Gerbi
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-down",
      position: bandComposition["varias-queixas"].general,
      step: 30,
    },
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-up",
      position: bandComposition["varias-queixas"].general,
      step: 30.5,
    },
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-up",
      position: bandComposition["varias-queixas"].general,
      step: 31,
    },
    // E Nut gerou as estrelas (Coral)
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-palm-up-open",
      position: bandComposition["varias-queixas"].general,
      step: 32.5,
    },
    // Osíris proclamou matrimônio com Ísis
    // E o mau Set, irado, o assassinou e impera
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-down",
      position: bandComposition["varias-queixas"].general,
      step: 33,
    },
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-up",
      position: bandComposition["varias-queixas"].general,
      step: 33.5,
    },
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-up",
      position: bandComposition["varias-queixas"].general,
      step: 34,
    },
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-down",
      position: bandComposition["varias-queixas"].general,
      step: 35,
    },
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-up",
      position: bandComposition["varias-queixas"].general,
      step: 36.5,
    },
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-up",
      position: bandComposition["varias-queixas"].general,
      step: 37,
    },
    // Hórus levando avante a vingança do pai
    // Derrotando o império do mau Set
    // Alô Bahia, canta aí
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-down",
      position: bandComposition["varias-queixas"].general,
      step: 38,
    },
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-up",
      position: bandComposition["varias-queixas"].general,
      step: 38.5,
    },
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-up",
      position: bandComposition["varias-queixas"].general,
      step: 39,
    },
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-down",
      position: bandComposition["varias-queixas"].general,
      step: 40,
    },
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-up",
      position: bandComposition["varias-queixas"].general,
      step: 40.5,
    },
    {
      id: generateEventIdUUID(),
      hand: "right",
      move: "move-baton-up",
      position: bandComposition["varias-queixas"].general,
      step: 41,
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
