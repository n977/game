import {useRef, useEffect} from "react";
import {Level, Player} from "./lib/core";
import "./Controls.css";

const INPUT_PROPS = {
  type: "range",
  min: "0",
  max: "1",
  step: "0.1",
}

interface Props {
  level: React.MutableRefObject<Level | null>,
  player_id: string,
}

export function Controls({level, player_id}: Props) {
  const shotSpeed = useRef<HTMLInputElement | null>(null);
  const moveSpeed = useRef<HTMLInputElement | null>(null);

  const update = () => setInterval(() => {
    if (!level.current || !shotSpeed.current || !moveSpeed.current) return;

    const e = level.current.entities.find((e) => e instanceof Player && e.id === player_id);

    if (e && e instanceof Player) {
      e.shotSpeed = parseFloat(shotSpeed.current.value);
      e.moveSpeed = parseFloat(moveSpeed.current.value);
    }
  }, 1000);

  useEffect(() => {
    const i1 = update();

    return () => clearInterval(i1);
  }, []);

  return (
    <div className="status-controls">
      <div>
      <span>Shot Speed:</span>
      <input ref={shotSpeed} {...INPUT_PROPS} defaultValue="0.1"/>
      </div>
      <div>
      <span>Move Speed:</span>
      <input ref={moveSpeed} {...INPUT_PROPS} defaultValue="1"/>
      </div>
      </div>
  )
}
