import { useNavigate, useParams } from "react-router";
import { Button } from "../components";
import { ScoreBoard } from "../components/score-board";

export function FinishPage() {
  const navigate = useNavigate();

  const { score } = useParams();

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 4, 5]} intensity={0.6} />
      <directionalLight position={[-3, 2, -2]} intensity={0.3} />
      <Button
        position={[0, 1.0, -2]}
        label={"VOLTAR"}
        onClick={() => navigate("/maestro-game-xr/lobby")}
      />

      {score && <ScoreBoard score={score} position={[0, 2.7, -6]} />}
    </>
  );
}
