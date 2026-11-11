import React from "react";
import { usePlayer, useTarget } from "@gerak/react";
import { clock, scene } from "./night-b-scene";

/** Binds each target to its element; all motion lives in `night-b-scene.ts`. Click replays. */
export const NightB: React.FC = () => {
  const playing = usePlayer(scene, clock);
  const night = useTarget(playing?.player, "night");
  const shift = useTarget(playing?.player, "shift");
  const dot = useTarget(playing?.player, "dot");
  return (
    <div className="stage" onClick={() => playing?.driver.replay()}>
      <div className="title">
        <span ref={night} className="word">
          NIGHT
        </span>
        <span ref={shift} className="word amber">
          SHIFT
        </span>
        <span ref={dot} className="dot" />
      </div>
    </div>
  );
};
