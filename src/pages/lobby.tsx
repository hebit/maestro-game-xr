import { useNavigate } from "react-router";
import { Button } from "../components";

export function LobbyPage() {
  const navigate = useNavigate();

  return (
    <>
      <Button
        position={[0, 1.0, -2]}
        label="VARIAS QUEIXAS"
        onClick={() => navigate("/maestro-game-xr/play/varias-queixas")}
      />
    </>
  );
}
