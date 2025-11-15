import { Suspense, useState } from "react";
import { useTimeline } from "../../contexts";
import { useFrame } from "@react-three/fiber";
import { addSeconds, subSeconds } from "date-fns";
import { PointingDetector } from "../pointing-detector";
import { GestureDetector } from "../gesture-detector";
import { HandRay } from "../hand-ray";
import { BothGestureDetector } from "../both-gesture-detector";
import { PalmDetector } from "../palm-detector";
import { Button } from "../ui";
import { useNavigate } from "react-router";

export function Canva() {
  const { events } = useTimeline();

  const [candidateEvents, setCandidateEvents] = useState<typeof events>([]);
  const navigate = useNavigate();

  useFrame(() => {
    const now = new Date();
    const start = subSeconds(now, 2);
    const end = addSeconds(now, 3.5);
    const nearEvents = events.filter(
      (event) => event.time >= start && event.time <= end
    );

    const candidates = nearEvents.slice(0, 10);
    setCandidateEvents(candidates);
  });

  function renderEvents() {
    return candidateEvents.map((event) => {
      if (event.move === "pointing") {
        return <PointingDetector event={event} key={event.id} />;
      }

      if (
        event.move === "move-palm-down-open" ||
        event.move === "move-palm-up-open"
      ) {
        return <PalmDetector event={event} key={event.id} />;
      }

      if (event.hand === "both") {
        return <BothGestureDetector event={event} key={event.id} />;
      }

      return <GestureDetector event={event} key={event.id} />;
    });
  }

  return (
    <>
      <ambientLight intensity={1} />
      <ambientLight position={[0, 0, -1]} intensity={1} />
      <directionalLight position={[3, 4, 5]} intensity={0.3} />
      <directionalLight position={[-3, 2, -2]} intensity={0.3} />
      {renderEvents()}
      <HandRay side="left" />
      <HandRay side="right" />
      <Suspense>
        <group rotation={[0, Math.PI, 0]}>
          <Button
            label="Voltar"
            position={[0, 1.2, -1]}
            onClick={() => navigate("/maestro-game-xr/lobby")}
          />
        </group>
      </Suspense>
    </>
  );
}
