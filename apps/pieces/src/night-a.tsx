import React from "react";
import { usePlayer, useTarget } from "@gerak/react";
import { clock, scene } from "./night-a-scene";

/** Binds each target to its element; all motion lives in `night-a-scene.ts`. Click replays. */
export const NightA: React.FC = () => {
  const playing = usePlayer(scene, clock);
  const night = useTarget(playing?.player, "night");
  const shift = useTarget(playing?.player, "shift");
  const dot = useTarget(playing?.player, "dot");
  return (
    <div className="stage" onClick={() => playing?.driver.replay()}>
      <div className="words">
        <span ref={night} className="word">
          NIGHT
        </span>
        <span ref={shift} className="word amber">
          SHIFT
        </span>
      </div>
      <div ref={dot} className="dot" />
    </div>
  );
};
