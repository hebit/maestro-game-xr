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
          id: "hash-0",
          hand: "left",
          move: "pointing",
          time: new Date(startTime.getTime() + 3_900),
          position: [1, 1.7, -1.5], // [-1~1, 1.5~2.0, -1.5]
          step: 1_900, // 1.9s -> 1900ms
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
