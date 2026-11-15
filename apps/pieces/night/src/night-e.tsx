import React from "react";
import { usePlayer, useTarget } from "@gerak/react";
import { clock, scene } from "./night-e-scene";

/** Binds each target to its element; all motion lives in `night-e-scene.ts`. Click replays. */
export const NightE: React.FC = () => {
  const playing = usePlayer(scene, clock);
  const night = useTarget(playing?.player, "night");
  const shift = useTarget(playing?.player, "shift");
  const moon = useTarget(playing?.player, "moon");
  return (
    <div className="stage" onClick={() => playing?.driver.replay()}>
      <div className="words">
        <span ref={night} className="word night">
          NIGHT
        </span>
        <span ref={shift} className="word shift">
          SHIFT
        </span>
      </div>
      <div ref={moon} className="moon">
        <div className="thread" />
        <div className="crescent" />
      </div>
    </div>
  );
};
