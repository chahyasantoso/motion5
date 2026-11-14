import React from "react";
import { usePlayer, useTarget } from "@gerak/react";
import { clock, scene } from "./night-d-scene";

/** Binds each target to its element; all motion lives in `night-d-scene.ts`. Click replays. */
export const NightD: React.FC = () => {
  const playing = usePlayer(scene, clock);
  const night = useTarget(playing?.player, "night");
  const shift = useTarget(playing?.player, "shift");
  const dial = useTarget(playing?.player, "dial");
  const hand = useTarget(playing?.player, "hand");
  return (
    <div className="stage" onClick={() => playing?.driver.replay()}>
      <div ref={night} className="word night">
        NIGHT
      </div>
      <div ref={shift} className="word shift">
        SHIFT
      </div>
      <div ref={dial} className="dial">
        <div ref={hand} className="hand">
          <i />
        </div>
      </div>
    </div>
  );
};
