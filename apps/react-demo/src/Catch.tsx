import React, { useCallback } from "react";
import { applyPose, type RenderTarget } from "@motion5/dom";
import type { Player } from "@motion5/player";
import { usePlayer, useTarget } from "@motion5/react";
import { WORD, clock, scene } from "./catch-scene";

type Frame = ReturnType<typeof scene>;

const GLYPH_STYLE = { display: "inline-block" } as const;

/** One letter, bound to its own pose in the scene's `letters` list. */
const Glyph: React.FC<{ player: Player<Frame> | undefined; index: number; glyph: string }> = ({
  player,
  index,
  glyph,
}) => {
  const render = useCallback(
    (element: RenderTarget, letters: Frame["letters"]) => {
      const pose = letters[index];
      if (pose !== undefined) applyPose(element, pose);
    },
    [index],
  );
  const ref = useTarget(player, "letters", render);
  return (
    <span ref={ref} aria-hidden style={GLYPH_STYLE}>
      {glyph}
    </span>
  );
};

/** Binds each target to its element; all motion lives in `catch-scene.ts`. Click replays. */
export const Catch: React.FC = () => {
  const playing = usePlayer(scene, clock);
  const player = playing?.player;
  const upper = useTarget(player, "upper");
  const lower = useTarget(player, "lower");
  const elbow = useTarget(player, "elbow");
  const hand = useTarget(player, "hand");
  const ball = useTarget(player, "ball");
  return (
    <div className="catch-stage" onClick={() => playing?.driver.replay()}>
      <div className="catch-floor" />
      <div ref={upper} className="catch-bone catch-upper" />
      <div ref={lower} className="catch-bone catch-lower" />
      <div className="catch-joint catch-shoulder" />
      <div ref={elbow} className="catch-joint catch-elbow" />
      <div ref={ball} className="catch-ball" />
      <div ref={hand} className="catch-joint catch-hand" />
      <div className="catch-word" aria-label={WORD}>
        {[...WORD].map((glyph, index) => (
          <Glyph key={index} player={player} index={index} glyph={glyph} />
        ))}
      </div>
    </div>
  );
};
