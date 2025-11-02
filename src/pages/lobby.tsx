import { useNavigate } from "react-router";
import { Button, PointingDetector } from "../components";
import { useMemo } from "react";

export function LobbyPage() {
  const navigate = useNavigate();

  const startTime = useMemo(() => new Date(), []);

  return (
    <>
      <PointingDetector
        event={{
          hand: "left",
          id: "acaskl",
          move: "pointing",
          step: 7_000,
          time: new Date(startTime.getTime() + 7_000),
          position: [1, 1.7, -1.5],
        }}
      />
      <Button
        position={[0, 1.0, -2]}
        label="VARIAS QUEIXAS"
        onClick={() => navigate("/maestro-game-xr/play/varias-queixas")}
      />
    </>
  );
}
