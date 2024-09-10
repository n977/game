import { Controls } from "./Controls";
import { Level, Player } from "./lib/core";
import "./Status.css";

interface Props {
  level: React.MutableRefObject<Level | null>;
  score: [string, number];
  index: number;
}

export function Status({ level, score, index }: Props) {
  const player = level.current?.findEntity((e) => e.id === score[0]);

  return (
    <div className="status">
      <header className="status-header">Player {index}</header>
      <span>Score: {score[1]}</span>
      {player instanceof Player && <Controls player={player} />}
    </div>
  );
}
