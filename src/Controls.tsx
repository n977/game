import { Player } from "./lib/core";
import "./Controls.css";

const INPUT_PROPS = {
  type: "range",
  min: "0",
  max: "1",
  step: "0.1",
};

interface Props {
  player: Player;
}

export function Controls({ player }: Props) {
  const updateShotSpeed = (e: React.ChangeEvent<HTMLInputElement>) =>
    (player.shotSpeed = parseFloat(e.target.value));
  const updateMoveSpeed = (e: React.ChangeEvent<HTMLInputElement>) =>
    (player.moveSpeed = parseFloat(e.target.value));

  return (
    <div className="status-controls">
      <div>
        <span>Shot Speed:</span>
        <input {...INPUT_PROPS} defaultValue="0.1" onChange={updateShotSpeed} />
      </div>
      <div>
        <span>Move Speed:</span>
        <input {...INPUT_PROPS} defaultValue="1" onChange={updateMoveSpeed} />
      </div>
    </div>
  );
}
