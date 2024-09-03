import { Player } from "./lib/core";
import "./CustomizationDialog.css";

interface Props {
  modal: React.MutableRefObject<HTMLDialogElement | null>;
  player: React.MutableRefObject<Player | null>;
  color: string;
  setColor: React.Dispatch<string>;
}

export function CustomizationDialog({ modal, player, color, setColor }: Props) {
  const close = () => {
    if (modal.current === null) {
      return;
    }

    modal.current.close();
  };

  const confirm = () => {
    if (!player.current) return;

    if (color.match(/^#[0123456789abcdef]{6}$/)) {
      player.current.color = color;
    }

    player.current = null;
    setColor("#000000");
    close();
  };

  return (
    <dialog ref={modal} className="modal">
      <header className="modal-header">
        <h2>Customize</h2>
      </header>
      <div className="modal-field">
        <span>Player color:</span>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
      </div>
      <div className="modal-btn-group">
        <button className="btn btn--accent" onClick={confirm}>
          Confirm
        </button>
        <button className="btn" onClick={close}>
          Close
        </button>
      </div>
    </dialog>
  );
}
