import { useState } from "react";
import { useTimeline } from "../../contexts";
import { useFrame } from "@react-three/fiber";
import { addSeconds, subSeconds } from "date-fns";
import { PointingDetector } from "../pointing-detector";
import { GestureDetector } from "../gesture-detector";
import { HandRay } from "../hand-ray";

export function Canva() {
  const { events } = useTimeline();

  const [candidateEvents, setCandidateEvents] = useState<typeof events>([]);

  useFrame(() => {
    const now = new Date();
    const start = subSeconds(now, 2);
    const end = addSeconds(now, 3.5);
    const nearEvents = events.filter(
      (event) => event.time >= start && event.time <= end
    );

    const candidates = nearEvents.slice(0, 4);
    setCandidateEvents(candidates);
  });

  function renderEvents() {
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
      <HandRay side="left" />
      <HandRay side="right" />
    </>
  );
}
