import React from "react";
import { usePlayer, useTarget } from "@gerak/react";
import { clock, scene } from "./kelvin-scene";

export const Kelvin: React.FC = () => {
  const playing = usePlayer(scene, clock);
  const name = useTarget(playing?.player, "name");
  const rule = useTarget(playing?.player, "rule");
  const tag = useTarget(playing?.player, "tag");
  const caption = useTarget(playing?.player, "caption");
  return (
    <div className="stage" onClick={() => playing?.driver.replay()}>
      <div ref={name} className="name">
        KELVIN
      </div>
      <div ref={rule} className="rule" />
      <div ref={tag} className="tag">
        <div className="string" />
        <div className="card">
          <span className="label">Cast iron</span>
          <span className="price">$489</span>
        </div>
      </div>
      <div ref={caption} className="caption">
        The kettle, considered.
      </div>
    </div>
  );
};
