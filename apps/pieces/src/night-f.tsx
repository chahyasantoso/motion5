import React from "react";
import { usePlayer, useTarget } from "@gerak/react";
import { clock, scene } from "./night-f-scene";

/** Binds each target to its element; all motion lives in `night-f-scene.ts`. Click replays. */
export const NightF: React.FC = () => {
  const playing = usePlayer(scene, clock);
  const night = useTarget(playing?.player, "night");
  const shift = useTarget(playing?.player, "shift");
  const lamp = useTarget(playing?.player, "lamp");
  return (
    <div className="stage" onClick={() => playing?.driver.replay()}>
      <div ref={night} className="word night">
        NIGHT
      </div>
      <div ref={shift} className="word shift">
        SHIFT
      </div>
      <div ref={lamp} className="lamp" />
    </div>
  );
};
