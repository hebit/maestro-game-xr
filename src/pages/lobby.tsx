import { useNavigate } from "react-router";
import { Button } from "../components";
import { useGestureDirection } from "../components/gesture-detector/hooks";
import { usePoseName } from "../hooks";
import { Text } from "@react-three/drei";

export function LobbyPage() {
  const navigate = useNavigate();
  const poseName = usePoseName("right");
  const gestureDirection = useGestureDirection("right");

  return (
    <>
      <Text position={[0, 1.5, -2]} fontSize={0.5} color="white">
        {poseName} - {gestureDirection}
      </Text>
      <Button
        position={[0, 1.0, -2]}
        label="VARIAS QUEIXAS"
        onClick={() => navigate("/maestro-game-xr/play/varias-queixas")}
      />
    </>
  );
}
