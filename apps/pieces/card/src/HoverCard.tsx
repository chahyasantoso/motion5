import React from "react";
import { inputs } from "@gerak/core";
import { usePlayer, useTarget } from "@gerak/react";
import { clock, scene } from "./card-scene";

const cardTriggers = inputs({
  triggers: {
    enter: { targets: ["card"] },
    leave: { targets: ["card"] },
    down: { targets: ["card"] },
    up: { targets: ["card"] },
  },
});

/** The card's motion lives in `card-scene.ts`; the still hit area takes the pointer, so the lift never loses it. */
export const HoverCard: React.FC = () => {
  const playing = usePlayer(scene, clock);
  const card = useTarget(playing?.player, "card");
  const shadow = useTarget(playing?.player, "shadow");
  return (
    <div className="card-stage">
      <div
        className="card-hit"
        onPointerEnter={() => playing?.driver.trigger(cardTriggers, "enter", 1, "card")}
        onPointerLeave={() => playing?.driver.trigger(cardTriggers, "leave", 1, "card")}
        onPointerDown={() => playing?.driver.trigger(cardTriggers, "down", 1, "card")}
        onPointerUp={() => playing?.driver.trigger(cardTriggers, "up", 1, "card")}
      >
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
