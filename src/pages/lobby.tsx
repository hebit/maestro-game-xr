import { useNavigate } from "react-router";
import { Button } from "../components";

export function LobbyPage() {
  const navigate = useNavigate();

  return (
    <>
      <Button
        position={[-1, 1.0, -2]}
        label={"FARAO"}
        onClick={() => navigate("/maestro-game-xr/play/farao")}
      />
      <Button
        position={[1.5, 1.0, -2]}
        label={"THEY DONT CARE ABOUT US"}
        onClick={() =>
          navigate("/maestro-game-xr/play/they-dont-care-about-us")
        }
      />
    </>
  );
}
