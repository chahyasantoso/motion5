import React from "react";
import { usePlayer, useTarget } from "@gerak/react";
import { clock, scene } from "./tempo-scene";

/** Binds each target to its element; all motion lives in `tempo-scene.ts`. Click replays. */
export const Tempo: React.FC = () => {
  const playing = usePlayer(scene, clock);
  const arm = useTarget(playing?.player, "arm");
  const right = useTarget(playing?.player, "right");
  const left = useTarget(playing?.player, "left");
  const title = useTarget(playing?.player, "title");
  return (
    <div className="stage" onClick={() => playing?.driver.replay()}>
      <div ref={left} className="mark left" />
      <div ref={right} className="mark right" />
      <div className="base" />
      <div ref={arm} className="arm">
        <div className="weight" />
      </div>
      <div className="pivot" />
      <div ref={title} className="title">
        TEMPO
      </div>
    </div>
  );
};
