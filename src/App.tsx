import { useEffect, useRef, useState } from "react";
import { Level, Player, Orientation } from "./lib/core";
import { CustomizationDialog } from "./CustomizationDialog";
import "./App.css";
import { Status } from "./Status";

const PLAYER_SIZE = 20;
const PLAYER_OFFSET = 50;
const PLAYER_VELOCITY = 7;
const PLAYER_SHOT_SPEED = 0.1;
const TICK_SPEED = 49;

const destroy = (intervals: number[]) => intervals.forEach(clearInterval);

export default function App() {
  const [score, setScore] = useState<Record<string, number>>({});
  const [color, setColor] = useState<string>("#000000");
  const cvs = useRef<HTMLCanvasElement>(null);
  const level = useRef<Level | null>(null);
  const modal = useRef<HTMLDialogElement>(null);
  const player = useRef<Player | null>(null);

  const update = () =>
    setInterval(
      () =>
        setScore((state) => {
          if (!level.current) {
            return state;
          }

          return { ...level.current.score };
        }),
      TICK_SPEED,
    );
  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!cvs.current || !level.current) return;

    const rect = cvs.current.getBoundingClientRect();
    const pos = {
      x: e.clientX - rect.x,
      y: e.clientY - rect.y,
    };

    // Prevent players from going out of bounds.
    if (
      pos.y < PLAYER_OFFSET ||
      pos.y > cvs.current.clientHeight - PLAYER_OFFSET
    )
      return;

    const en = level.current.findEntity((e) => e.hits(pos, 10));

    if (en && en instanceof Player) {
      // Ignore input if the player already moves in the given direction.
      if (pos.y > en.pos.y) {
        if (en.velocity.y < 0) return;
      } else {
        if (en.velocity.y > 0) return;
      }

      en.velocity.y *= -1;
    }
  };
  const onClick = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!cvs.current || !level.current || !modal.current) return;

    const rect = cvs.current.getBoundingClientRect();
    const pos = {
      x: e.clientX - rect.x,
      y: e.clientY - rect.y,
    };

    const en = level.current.findEntity((e) => e.hits(pos, 10));

    if (en && en instanceof Player) {
      player.current = en;
      setColor(en.color);

      modal.current.showModal();
    }
  };
  const onKeyDown = (e: KeyboardEvent) => {
    if (!level.current) return;

    if (e.key === " ") {
      level.current.pause = !level.current.pause;
    }
  };
  const statuses = Object.entries(score).map((e, i) => (
    <Status level={level} score={e} index={i + 1} key={e[0]} />
  ));

  useEffect(() => {
    const ctx = cvs.current!.getContext("2d");
    level.current = new Level(ctx!, TICK_SPEED, "#ffffff");
    level.current.spawn(
      new Player(
        level.current,
        { x: PLAYER_OFFSET, y: 0 },
        { x: 0, y: PLAYER_VELOCITY * -1 },
        PLAYER_SIZE,
        "#000000",
        Orientation.Right,
        PLAYER_SHOT_SPEED,
      ),
    );
    level.current.spawn(
      new Player(
        level.current,
        {
          x:
            level.current.ctx.canvas.clientWidth -
            PLAYER_OFFSET -
            2 * PLAYER_SIZE,
          y: level.current.ctx.canvas.clientHeight - 2 * PLAYER_SIZE,
        },
        { x: 0, y: PLAYER_VELOCITY },
        PLAYER_SIZE,
        "#ff0000",
        Orientation.Left,
        PLAYER_SHOT_SPEED,
      ),
    );

    const i1 = level.current.run();
    const i2 = update();

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      destroy([i1, i2]);
    };
  }, []);

  return (
    <div className="layout">
      <header>
        <span className="layout-header-msg">Press &lt;Space&gt; to pause</span>
      </header>
      <main className="game">
        {statuses[0]}
        <canvas
          className="graphics"
          width="500"
          height="500"
          onMouseMove={onMouseMove}
          onClick={onClick}
          ref={cvs}
        />
        {statuses[1]}
      </main>
      <CustomizationDialog
        modal={modal}
        player={player}
        color={color}
        setColor={setColor}
      />
    </div>
  );
}
