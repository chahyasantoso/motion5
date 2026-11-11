import React from "react";
import { usePlayer, useTarget } from "@gerak/react";
import { clock, scene } from "./night-c-scene";

/** Binds each target to its element; all motion lives in `night-c-scene.ts`. Click replays. */
export const NightC: React.FC = () => {
  const playing = usePlayer(scene, clock);
  const night = useTarget(playing?.player, "night");
  const shift = useTarget(playing?.player, "shift");
  const moon = useTarget(playing?.player, "moon");
  const glow = useTarget(playing?.player, "glow");
  return (
    <div className="stage" onClick={() => playing?.driver.replay()}>
      <div ref={glow} className="glow" />
      <div ref={moon} className="moon" />
      <div className="words">
        <span ref={night} className="word">
          NIGHT
        </span>
        <span ref={shift} className="word dim">
          SHIFT
        </span>
      </div>
    </div>
  );
};
