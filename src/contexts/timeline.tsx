import { Text } from "@react-three/drei";
import { addMilliseconds, format } from "date-fns";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Howl } from "howler";
import { useNavigate } from "react-router";

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
  paused: false,
  matchEvent(_event: TimelineEvent, _rating?: number) {},
  pause() {},
  resume() {},
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
  ["farao" as string]: {
    bpm: 107,
    startTime: 7_367,
  },
  ["they-dont-care-about-us" as string]: {
    bpm: 90,
    startTime: 10_448,
  },
};

const bandComposition = {
  ["farao"]: {
    sax: presetPositions.right,
    guitar: presetPositions.left,
    drum: presetPositions.middle,
    general: presetPositions.middle,
  },
  ["they-dont-care-about-us"]: {
    sax: presetPositions.right,
    guitar: presetPositions.left,
    drum: presetPositions.middle,
    general: presetPositions.middle,
  },
};

const eventsBySong = {
  ["farao" as string]: [
    {
      move: "move-baton-up",
      id: generateEventIdUUID(),
      step: 1.25,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    {
      move: "move-baton-up",
      id: generateEventIdUUID(),
      step: 1.75,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    {
      move: "move-baton-up",
      id: generateEventIdUUID(),
      step: 2.25,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    {
      move: "move-baton-up",
      id: generateEventIdUUID(),
      step: 2.75,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    {
      move: "move-baton-up",
      id: generateEventIdUUID(),
      step: 3.25,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    {
      move: "move-baton-up",
      id: generateEventIdUUID(),
      step: 3.75,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    {
      move: "move-baton-up",
      id: generateEventIdUUID(),
      step: 4.25,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    {
      move: "move-baton-up",
      id: generateEventIdUUID(),
      step: 4.75,
      hand: "right",
      position: bandComposition["farao"].general,
    },

    {
      move: "move-palm-down-open",
      id: generateEventIdUUID(),
      step: 5.0,
      hand: "left",
      position: bandComposition["farao"].guitar,
    },

    {
      move: "move-palm-up-open",
      id: generateEventIdUUID(),
      step: 7.0,
      hand: "left",
      position: bandComposition["farao"].guitar,
    },
    {
      move: "move-baton-up",
      id: generateEventIdUUID(),
      step: 8.25,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    {
      move: "move-baton-up",
      id: generateEventIdUUID(),
      step: 8.75,
      hand: "right",
      position: bandComposition["farao"].general,
    },

    {
      move: "move-palm-up-open",
      id: generateEventIdUUID(),
      step: 9.0,
      hand: "left",
      position: bandComposition["farao"].guitar,
    },
    {
      move: "move-baton-up",
      id: generateEventIdUUID(),
      step: 10.25,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    {
      move: "move-baton-up",
      id: generateEventIdUUID(),
      step: 10.75,
      hand: "right",
      position: bandComposition["farao"].general,
    },

    {
      move: "move-palm-up-open",
      id: generateEventIdUUID(),
      step: 11.0,
      hand: "left",
      position: bandComposition["farao"].guitar,
    },
    {
      move: "move-baton-up",
      id: generateEventIdUUID(),
      step: 12.25,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    {
      move: "move-baton-up",
      id: generateEventIdUUID(),
      step: 12.75,
      hand: "right",
      position: bandComposition["farao"].general,
    },

    {
      move: "move-palm-up-open",
      id: generateEventIdUUID(),
      step: 13.0,
      hand: "left",
      position: bandComposition["farao"].guitar,
    },
    {
      move: "move-baton-up",
      id: generateEventIdUUID(),
      step: 14.25,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    {
      move: "move-baton-up",
      id: generateEventIdUUID(),
      step: 14.75,
      hand: "right",
      position: bandComposition["farao"].general,
    },

    {
      move: "move-baton-down",
      id: generateEventIdUUID(),
      step: 15.0,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    {
      move: "move-baton-up",
      id: generateEventIdUUID(),
      step: 15.25,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    {
      move: "move-baton-up",
      id: generateEventIdUUID(),
      step: 15.75,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    {
      move: "pointing",
      id: generateEventIdUUID(),
      step: 16.125,
      hand: "left",
      position: bandComposition["farao"].guitar,
    },

    {
      move: "move-baton-down",
      id: generateEventIdUUID(),
      step: 17.0,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    {
      move: "move-baton-up",
      id: generateEventIdUUID(),
      step: 17.25,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    {
      move: "move-baton-up",
      id: generateEventIdUUID(),
      step: 17.75,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    {
      move: "pointing",
      id: generateEventIdUUID(),
      step: 18.125,
      hand: "left",
      position: bandComposition["farao"].guitar,
    },

    {
      move: "move-baton-down",
      id: generateEventIdUUID(),
      step: 19.0,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    {
      move: "move-baton-up",
      id: generateEventIdUUID(),
      step: 19.25,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    {
      move: "move-baton-up",
      id: generateEventIdUUID(),
      step: 19.75,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    {
      move: "pointing",
      id: generateEventIdUUID(),
      step: 20.125,
      hand: "left",
      position: bandComposition["farao"].guitar,
    },

    {
      move: "move-baton-down",
      id: generateEventIdUUID(),
      step: 21.0,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    {
      move: "move-baton-up",
      id: generateEventIdUUID(),
      step: 21.25,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    {
      move: "move-baton-up",
      id: generateEventIdUUID(),
      step: 21.75,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    {
      move: "pointing",
      id: generateEventIdUUID(),
      step: 22.125,
      hand: "left",
      position: bandComposition["farao"].guitar,
    },

    {
      move: "move-baton-down",
      id: generateEventIdUUID(),
      step: 23.0,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    {
      move: "move-baton-up",
      id: generateEventIdUUID(),
      step: 23.25,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    {
      move: "move-baton-up",
      id: generateEventIdUUID(),
      step: 23.75,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    {
      move: "move-baton-down",
      id: generateEventIdUUID(),
      step: 24.0,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    {
      move: "move-baton-up",
      id: generateEventIdUUID(),
      step: 24.25,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    {
      move: "move-baton-up",
      id: generateEventIdUUID(),
      step: 24.75,
      hand: "right",
      position: bandComposition["farao"].general,
    },

    {
      move: "move-palm-up-open",
      id: generateEventIdUUID(),
      step: 25.25,
      hand: "left",
      position: bandComposition["farao"].guitar,
    },

    {
      move: "move-baton-down",
      id: generateEventIdUUID(),
      step: 27.0,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    {
      move: "move-baton-up",
      id: generateEventIdUUID(),
      step: 27.25,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    {
      move: "move-baton-up",
      id: generateEventIdUUID(),
      step: 27.75,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    {
      move: "move-baton-down",
      id: generateEventIdUUID(),
      step: 28.0,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    {
      move: "move-baton-up",
      id: generateEventIdUUID(),
      step: 28.25,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    {
      move: "move-baton-up",
      id: generateEventIdUUID(),
      step: 28.75,
      hand: "right",
      position: bandComposition["farao"].general,
    },

    {
      move: "move-palm-up-open",
      id: generateEventIdUUID(),
      step: 29.25,
      hand: "left",
      position: bandComposition["farao"].guitar,
    },

    {
      move: "move-baton-down",
      id: generateEventIdUUID(),
      step: 31.0,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    {
      move: "move-baton-up",
      id: generateEventIdUUID(),
      step: 31.25,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    {
      move: "move-baton-up",
      id: generateEventIdUUID(),
      step: 31.75,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    {
      move: "move-baton-down",
      id: generateEventIdUUID(),
      step: 32.0,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    {
      move: "move-baton-up",
      id: generateEventIdUUID(),
      step: 32.25,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    {
      move: "move-baton-up",
      id: generateEventIdUUID(),
      step: 32.75,
      hand: "right",
      position: bandComposition["farao"].general,
    },

    {
      move: "move-palm-up-open",
      id: generateEventIdUUID(),
      step: 33.25,
      hand: "left",
      position: bandComposition["farao"].guitar,
    },

    {
      move: "move-baton-down",
      id: generateEventIdUUID(),
      step: 35.0,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    {
      move: "move-baton-up",
      id: generateEventIdUUID(),
      step: 35.25,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    {
      move: "move-baton-up",
      id: generateEventIdUUID(),
      step: 35.75,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    {
      move: "move-baton-down",
      id: generateEventIdUUID(),
      step: 36.0,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    {
      move: "move-baton-up",
      id: generateEventIdUUID(),
      step: 36.25,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    {
      move: "move-baton-up",
      id: generateEventIdUUID(),
      step: 36.75,
      hand: "right",
      position: bandComposition["farao"].general,
    },

    {
      move: "move-baton-down",
      id: generateEventIdUUID(),
      step: 39.0,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    {
      move: "move-baton-up",
      id: generateEventIdUUID(),
      step: 39.25,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    {
      move: "move-baton-up",
      id: generateEventIdUUID(),
      step: 39.75,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    {
      move: "move-baton-down",
      id: generateEventIdUUID(),
      step: 40.0,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    {
      move: "move-baton-up",
      id: generateEventIdUUID(),
      step: 49.25,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    {
      move: "move-baton-up",
      id: generateEventIdUUID(),
      step: 40.75,
      hand: "right",
      position: bandComposition["farao"].general,
    },

    {
      move: "pointing",
      id: generateEventIdUUID(),
      step: 42.0,
      hand: "left",
      position: bandComposition["farao"].guitar,
    },
    {
      move: "move-baton-up",
      id: generateEventIdUUID(),
      step: 42.125,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    {
      move: "move-baton-up",
      id: generateEventIdUUID(),
      step: 42.375,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    {
      move: "move-baton-up",
      id: generateEventIdUUID(),
      step: 42.625,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    /*    {
      move: "move-baton-up",
      id: generateEventIdUUID(),
      step: 42.875,
      hand: "right",
      position: bandComposition["farao"].general,
    }, */

    {
      move: "pointing",
      id: generateEventIdUUID(),
      step: 43.0,
      hand: "left",
      position: bandComposition["farao"].guitar,
    },

    {
      move: "move-baton-up",
      id: generateEventIdUUID(),
      step: 43.125,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    {
      move: "move-baton-up",
      id: generateEventIdUUID(),
      step: 43.375,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    {
      move: "move-baton-up",
      id: generateEventIdUUID(),
      step: 43.625,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    /*   {
      move: "move-baton-up",
      id: generateEventIdUUID(),
      step: 43.875,
      hand: "right",
      position: bandComposition["farao"].general,
    }, */

    {
      move: "pointing",
      id: generateEventIdUUID(),
      step: 44.0,
      hand: "left",
      position: bandComposition["farao"].guitar,
    },

    {
      move: "move-baton-up",
      id: generateEventIdUUID(),
      step: 44.125,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    {
      move: "move-baton-up",
      id: generateEventIdUUID(),
      step: 44.375,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    {
      move: "move-baton-up",
      id: generateEventIdUUID(),
      step: 44.625,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    /*  {
      move: "move-baton-up",
      id: generateEventIdUUID(),
      step: 44.875,
      hand: "right",
      position: bandComposition["farao"].general,
    }, */

    {
      move: "move-baton-up",
      id: generateEventIdUUID(),
      step: 45.125,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    {
      move: "move-baton-up",
      id: generateEventIdUUID(),
      step: 45.375,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    {
      move: "move-baton-up",
      id: generateEventIdUUID(),
      step: 45.625,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    {
      move: "move-baton-up",
      id: generateEventIdUUID(),
      step: 45.875,
      hand: "right",
      position: bandComposition["farao"].general,
    },

    {
      move: "move-palm-up-open",
      id: generateEventIdUUID(),
      step: 47.0,
      hand: "left",
      position: bandComposition["farao"].guitar,
    },
    {
      move: "pointing",
      id: generateEventIdUUID(),
      step: 48.0,
      hand: "left",
      position: bandComposition["farao"].general,
    },
    {
      move: "pointing",
      id: generateEventIdUUID(),
      step: 49.0,
      hand: "left",
      position: bandComposition["farao"].guitar,
    },
    {
      move: "move-palm-up-open",
      id: generateEventIdUUID(),
      step: 51.0,
      hand: "left",
      position: bandComposition["farao"].general,
    },
    {
      move: "move-palm-up-open",
      id: generateEventIdUUID(),
      step: 53.0,
      hand: "left",
      position: bandComposition["farao"].guitar,
    },

    {
      move: "pointing",
      id: generateEventIdUUID(),
      step: 55.0,
      hand: "left",
      position: bandComposition["farao"].guitar,
    },
    {
      move: "move-baton-right",
      id: generateEventIdUUID(),
      step: 55.25,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    {
      move: "move-baton-right",
      id: generateEventIdUUID(),
      step: 55.5,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    {
      move: "move-baton-right",
      id: generateEventIdUUID(),
      step: 55.75,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    {
      move: "pointing",
      id: generateEventIdUUID(),
      step: 56.0,
      hand: "left",
      position: bandComposition["farao"].guitar,
    },
    /*  {
      move: "move-baton-down",
      id: generateEventIdUUID(),
      step: 56.0,
      hand: "right",
      position: bandComposition["farao"].general,
    }, */

    {
      move: "move-palm-up-open",
      id: generateEventIdUUID(),
      step: 57.0,
      hand: "left",
      position: bandComposition["farao"].general,
    },

    {
      move: "pointing",
      id: generateEventIdUUID(),
      step: 59.0,
      hand: "left",
      position: bandComposition["farao"].guitar,
    },
    {
      move: "move-baton-right",
      id: generateEventIdUUID(),
      step: 59.25,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    {
      move: "move-baton-right",
      id: generateEventIdUUID(),
      step: 59.5,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    {
      move: "move-baton-right",
      id: generateEventIdUUID(),
      step: 59.75,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    {
      move: "pointing",
      id: generateEventIdUUID(),
      step: 60.0,
      hand: "left",
      position: bandComposition["farao"].guitar,
    },
    /* {
      move: "move-baton-down",
      id: generateEventIdUUID(),
      step: 60.0,
      hand: "right",
      position: bandComposition["farao"].general,
    }, */

    {
      move: "move-palm-up-open",
      id: generateEventIdUUID(),
      step: 61.0,
      hand: "left",
      position: bandComposition["farao"].guitar,
    },
    {
      move: "pointing",
      id: generateEventIdUUID(),
      step: 62.5,
      hand: "left",
      position: bandComposition["farao"].guitar,
    },
    {
      move: "pointing",
      id: generateEventIdUUID(),
      step: 63.25,
      hand: "left",
      position: bandComposition["farao"].guitar,
    },
    {
      move: "pointing",
      id: generateEventIdUUID(),
      step: 64.5,
      hand: "left",
      position: bandComposition["farao"].guitar,
    },
    {
      move: "pointing",
      id: generateEventIdUUID(),
      step: 65.25,
      hand: "left",
      position: bandComposition["farao"].guitar,
    },
    /*  {
      move: "pointing",
      id: generateEventIdUUID(),
      step: 66.0,
      hand: "left",
      position: bandComposition["farao"].guitar,
    }, */
    {
      move: "move-baton-down",
      id: generateEventIdUUID(),
      step: 66.25,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    {
      move: "move-baton-down",
      id: generateEventIdUUID(),
      step: 66.5,
      hand: "right",
      position: bandComposition["farao"].general,
    },
    {
      move: "move-baton-down",
      id: generateEventIdUUID(),
      step: 66.75,
      hand: "right",
      position: bandComposition["farao"].general,
    },
  ] as Omit<TimelineEvent, "time">[],
  ["they-dont-care-about-us" as string]: [
    ...createIntroSampleTheyDontCareAboutUs(1),
    ...createIntroSampleTheyDontCareAboutUs(1.5),
    ...createIntroSampleTheyDontCareAboutUs(2),
    ...createIntroSampleTheyDontCareAboutUs(2.5),
    ...createIntroSampleTheyDontCareAboutUs(3),
    ...createIntroSampleTheyDontCareAboutUs(3.5),
    {
      move: "pointing",
      id: generateEventIdUUID(),
      step: 4.125,
      hand: "left",
      position: bandComposition["they-dont-care-about-us"].guitar,
    },
    {
      move: "move-baton-up",
      id: generateEventIdUUID(),
      step: 4.75,
      hand: "right",
      position: bandComposition["they-dont-care-about-us"].general,
    },
    {
      move: "pointing",
      id: generateEventIdUUID(),
      step: 5.125,
      hand: "left",
      position: bandComposition["they-dont-care-about-us"].guitar,
    },
    {
      move: "move-baton-up",
      id: generateEventIdUUID(),
      step: 5.75,
      hand: "right",
      position: bandComposition["they-dont-care-about-us"].general,
    },

    {
      move: "pointing",
      id: generateEventIdUUID(),
      step: 6.125,
      hand: "left",
      position: bandComposition["they-dont-care-about-us"].guitar,
    },
    {
      move: "move-baton-up",
      id: generateEventIdUUID(),
      step: 6.75,
      hand: "right",
      position: bandComposition["they-dont-care-about-us"].general,
    },
    /* {
      move: "pointing",
      id: generateEventIdUUID(),
      step: 7.125,
      hand: "left",
      position: bandComposition["they-dont-care-about-us"].guitar,
    },
    {
      move: "move-baton-up",
      id: generateEventIdUUID(),
      step: 7.75,
      hand: "right",
      position: bandComposition["they-dont-care-about-us"].general,
    }, */

    {
      move: "move-palm-up-open",
      id: generateEventIdUUID(),
      step: 7.25,
      hand: "left",
      position: bandComposition["they-dont-care-about-us"].general,
    },

    {
      move: "pointing",
      id: generateEventIdUUID(),
      step: 8.75,
      hand: "left",
      position: bandComposition["they-dont-care-about-us"].guitar,
    },
    {
      move: "pointing",
      id: generateEventIdUUID(),
      step: 9.0,
      hand: "left",
      position: bandComposition["they-dont-care-about-us"].general,
    },
    {
      move: "pointing",
      id: generateEventIdUUID(),
      step: 9.125,
      hand: "left",
      position: bandComposition["they-dont-care-about-us"].guitar,
    },
    {
      move: "move-baton-down",
      id: generateEventIdUUID(),
      step: 10.25,
      hand: "both",
      position: bandComposition["they-dont-care-about-us"].general,
    },
  ],
};

function createIntroSampleTheyDontCareAboutUs(step: number) {
  return [
    /* {
      move: "move-baton-up",
      id: generateEventIdUUID(),
      step: step,
      hand: "right",
      position: bandComposition["they-dont-care-about-us"].general,
    }, */
    {
      move: "move-baton-down",
      id: generateEventIdUUID(),
      step: step,
      hand: "right",
      position: bandComposition["they-dont-care-about-us"].general,
    },
    /*  {
      move: "move-baton-down",
      id: generateEventIdUUID(),
      step: step + 0.125,
      hand: "right",
      position: bandComposition["they-dont-care-about-us"].sax,
    }, */
    //
    /*     {
      move: "pointing",
      id: generateEventIdUUID(),
      step: step + 0.25,
      hand: "left",
      position: bandComposition["they-dont-care-about-us"].guitar,
    },

    {
      move: "move-baton-down",
      id: generateEventIdUUID(),
      step: step + 0.5,
      hand: "right",
      position: bandComposition["they-dont-care-about-us"].general,
    },
    {
      move: "move-baton-down",
      id: generateEventIdUUID(),
      step: step + 0.625,
      hand: "right",
      position: bandComposition["they-dont-care-about-us"].general,
    }, */
  ];
}

interface TimelineContextProviderProps extends React.PropsWithChildren {
  songId?: string;
}

const player = {
  ["farao" as string]: new Howl({
    src: ["/maestro-game-xr/farao.mp3"],
    html5: true,
    volume: 0.1,
  }),
  ["they-dont-care-about-us" as string]: new Howl({
    src: ["/maestro-game-xr/they-dont-care-about-us.mp3"],
    html5: true,
    volume: 0.1,
  }),
};

export function TimelineContextProvider({
  songId = "farao",
  children,
}: TimelineContextProviderProps) {
  const [startTime, setStartTime] = useState<Date>();

  const navigate = useNavigate();

  const events = useMemo(() => {
    if (!startTime) return [] as TimelineEvent[];

    function calculateStepTime(step: number) {
      const bpm = songConfig[songId].bpm;
      const secondsPerBeat = 60 / bpm;
      return (step - 1) * (secondsPerBeat * 4) * 1000;
    }

    // console.log("startTime", format(startTime, "HH:mm:ss.SSS"));

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
  const [paused, setPaused] = useState<boolean>(false);

  const matchEvent = useCallback(
    (event: TimelineEvent, rating: number | undefined = 1) => {
      console.log({ event, rating });
      setScore((score) => score + 10 * rating);
    },
    [setScore]
  );

  useEffect(() => {
    events.forEach((event) => {
      if (event.move !== "move-palm-up-open") return;
      console.log(`${event.move} at ${format(event.time, "HH:mm:ss.SSS")}`);
    });
  }, [events]);

  useEffect(() => {
    player[songId].once("play", () => {
      const actualStartTime = new Date();
      setStartTime(actualStartTime);
      console.log(
        "SONG ACTUALLY STARTED:",
        format(actualStartTime, "HH:mm:ss.SSS")
      );
    });

    player[songId].play();
    return () => {
      player[songId].stop();
    };
  }, []);

  useEffect(() => {
    const callback = () => {
      console.log("STOP:", format(new Date(), "HH:mm:ss.SSS"));
      setTimeout(() => {
        navigate("/maestro-game-xr/finish/" + score);
      }, 2_000);
    };
    player[songId].on("end", callback);

    return () => {
      player[songId].off("end", callback);
    };
  }, [score]);

  if (!startTime) return null;

  return (
    <TimelineContext.Provider
      value={{
        songId,
        startTime,
        events,
        fails: [],
        score,
        paused,
        pause() {
          setPaused(true);
          player[songId].pause();
        },
        resume() {
          setPaused(false);
          player[songId].play();
        },
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
