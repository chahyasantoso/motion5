import React from "react";
import { pageInputs } from "@gerak/core";
import { usePlayer, useTarget } from "@gerak/react";
import { clock, scene } from "./card-scene";

/** The card's motion lives in `card-scene.ts`; the still hit area takes the pointer, so the lift never loses it. */
export const HoverCard: React.FC = () => {
  const playing = usePlayer(scene, clock);
  const card = useTarget(playing?.player, "card");
  const shadow = useTarget(playing?.player, "shadow");
  return (
    <div className="card-stage">
      <div
        className="card-hit"
        onPointerEnter={() => playing?.driver.set(pageInputs, "hovered", 1, "card")}
        onPointerLeave={() => {
          playing?.driver.set(pageInputs, "hovered", 0, "card");
          playing?.driver.set(pageInputs, "pressed", 0, "card");
        }}
        onPointerDown={() => playing?.driver.set(pageInputs, "pressed", 1, "card")}
        onPointerUp={() => playing?.driver.set(pageInputs, "pressed", 0, "card")}
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
