import React, { useCallback } from "react";
import { applyPose, type RenderTarget } from "@gerak/dom";
import type { Pose2d } from "@gerak/moves";
import type { Player } from "@gerak/player";
import { usePlayer, useTarget } from "@gerak/react";
import { SIZE, STARTS, WORD, clock, scene } from "./pile-scene";

type Frame = ReturnType<typeof scene>;

/** A render for entry `index` of a list of poses. */
function pick(index: number) {
  return (element: RenderTarget, poses: readonly Pose2d[]) => {
    const pose = poses[index];
    if (pose !== undefined) applyPose(element, pose);
  };
}

/** One letter: its box laid out upright where its body starts, the glyph inside squashing on contact. */
const Letter: React.FC<{ player: Player<Frame> | undefined; index: number }> = ({
  player,
  index,
}) => {
  const box = useTarget(player, "letters", useCallback(pick(index), [index]));
  const glyph = useTarget(player, "glyphs", useCallback(pick(index), [index]));
  const start = STARTS[index];
  if (start === undefined) return null;
  const style = {
    left: start.x - SIZE.width / 2,
    top: start.y - SIZE.height / 2,
    width: SIZE.width,
    height: SIZE.height,
  };
  return (
    <div ref={box} className="pile-letter" style={style} data-motion-touch=".pile-letter">
      <span ref={glyph} className="pile-glyph">
        {WORD[index]}
      </span>
    </div>
  );
};

/** Every number of motion lives in `pile-scene.ts`; click replays. */
export const Pile: React.FC = () => {
  const playing = usePlayer(scene, clock);
  return (
    <div className="pile-stage" onClick={() => playing?.driver.replay()}>
      <div className="pile-floor" />
      {STARTS.map((_, index) => (
        <Letter key={index} player={playing?.player} index={index} />
      ))}
    </div>
  );
};
