import { useState } from "react";
import { useTimeline } from "../../contexts";
import { useFrame } from "@react-three/fiber";
import { addSeconds, subSeconds } from "date-fns";
import { PointingDetector } from "../pointing-detector";
import { GestureDetector } from "../gesture-detector";
import { Song } from "../../song";

export function Canva() {
  const { events } = useTimeline();

  const [candidateEvents, setCandidateEvents] = useState<typeof events>([]);

  useFrame(() => {
    // requestAnimationFrame(() => {
    const now = new Date();
    const start = subSeconds(now, 2);
    const end = addSeconds(now, 1.5);
    const nearEvents = events.filter(
      (event) => event.time >= start && event.time <= end
    );

    const candidates = nearEvents.slice(0, 3);
    setCandidateEvents(candidates);
    // });
  });

  function renderEvents() {
    // console.log({ candidateEvents });
    return candidateEvents.map((event) => {
      if (event.move === "pointing") {
        return <PointingDetector event={event} key={event.id} />;
      }

      return <GestureDetector event={event} key={event.id} />;
    });
  }

  return (
    <>
      <ambientLight />
      {renderEvents()}

      <Song />
    </>
  );
}
