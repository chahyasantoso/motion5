import React from "react";
import { usePlayer, useTarget, useWatch } from "@gerak/react";
import { clock, scene } from "./card-scene";

/** The card's motion lives in `card-scene.ts`; the still hit area takes the pointer, so the lift never loses it. */
export const HoverCard: React.FC = () => {
  const playing = usePlayer(scene, clock);
  const watch = useWatch(playing?.driver, "card");
  const card = useTarget(playing?.player, "card");
  const shadow = useTarget(playing?.player, "shadow");
  return (
    <div className="card-stage">
      <div ref={watch} className="card-hit">
        <div ref={shadow} className="card-shadow" />
        <div ref={card} className="card">
          <span className="card-kicker">Field notes</span>
          <span className="card-title">Moss grows north, mostly</span>
          <span className="card-meta">6 min read</span>
        </div>
      </div>
    </div>
  );
};
