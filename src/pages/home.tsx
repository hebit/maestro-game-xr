import { Image } from "@react-three/drei";
import { useNavigate } from "react-router";
import { Button } from "../components";

export function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      <Image
        position={[0, 2.0, -2]}
        transparent
        scale={2.0}
        url="/maestro-game-xr/logo.png"
      />
      <Button
        position={[0, 1.0, -2]}
        label="PLAY"
        onClick={() => navigate("lobby")}
      />
    </>
  );
}
