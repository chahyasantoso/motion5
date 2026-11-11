import React from "react";
import { usePlayer, useTarget } from "@gerak/react";
import { clock, scene } from "./saved-scene";

/** Binds each target to its element; all motion lives in `saved-scene.ts`. Click replays. */
export const Saved: React.FC = () => {
  const playing = usePlayer(scene, clock);
  const mark = useTarget(playing?.player, "mark");
  const word = useTarget(playing?.player, "word");
  return (
    <div className="stage" onClick={() => playing?.driver.replay()}>
      <div className="pill">
        <svg ref={mark} className="mark" viewBox="0 0 24 24" width="28" height="28">
          <circle cx="12" cy="12" r="12" fill="#2f9e6e" />
          <path
            d="M6.5 12.5l3.8 3.8 7.2-8"
            fill="none"
            stroke="#fff"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span ref={word} className="word">
          Saved
        </span>
      </div>
    </div>
  );
};
