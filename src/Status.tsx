import { Controls } from "./Controls";
import { Level } from "./lib/core";
import "./Status.css";

interface Props {
level: React.MutableRefObject<Level | null>; score: [string, number]; index: number;
}

export function Status({level, score, index}: Props) {
      return <div className="status">
        <header className="status-header">
              Player {index}
            </header>
            <span>Score: {score[1]}</span>

      <Controls level={level} player_id={score[0]}/>
      </div>
}


