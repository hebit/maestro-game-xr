import { useMemo, useState } from "react";
import { useTimeline } from "../../contexts";
import { useFrame } from "@react-three/fiber";
import { addSeconds, subSeconds } from "date-fns";
import { PointingDetector } from "../pointing-detector";
import { GestureDetector } from "../gesture-detector";
import { Song } from "../../song";
import { Text } from "@react-three/drei";

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

  const time = useMemo(() => addSeconds(new Date(), 5), [events]);

  return (
    <>
      <ambientLight />
      {/* <pointLight position={[10, 10, 10]} /> */}
      {renderEvents()}
      <GestureDetector
        event={{
          hand: "right",
          id: "abc123",
          move: "move-baton-down",
          position: [0, 1.7, -1.5],
          step: 4500,
          time,
        }}
      />
      <Text
        position={[0, 2.5, -2]}
        fontSize={0.2}
        color={"blue"}
        anchorX="center"
        anchorY="middle"
      >
        {candidateEvents.length > 0
          ? JSON.stringify(candidateEvents[0].move)
          : `none: ${events.length}`}
      </Text>
      <Song />
    </>
  );
}
