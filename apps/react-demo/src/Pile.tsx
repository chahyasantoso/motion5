import React, { useCallback } from "react";
import { applyPose, type RenderTarget } from "@motion5/dom";
import type { Player } from "@motion5/player";
import { usePlayer, useTarget } from "@motion5/react";
import { SIZE, STARTS, WORD, clock, scene } from "./pile-scene";

type Frame = ReturnType<typeof scene>;

/** One letter, laid out where its box starts, moved by its pose. */
const Letter: React.FC<{ player: Player<Frame> | undefined; index: number }> = ({
  player,
  index,
}) => {
  const render = useCallback(
    (element: RenderTarget, letters: Frame["letters"]) => {
      const pose = letters[index];
      if (pose !== undefined) applyPose(element, pose);
    },
    [index],
  );
  const ref = useTarget(player, "letters", render);
  const start = STARTS[index];
  if (start === undefined) return null;
  const style = {
    left: start.x - SIZE.width / 2,
    top: start.y - SIZE.height / 2,
    width: SIZE.width,
    height: SIZE.height,
  };
  return (
    <div ref={ref} className="pile-letter" style={style}>
      {WORD[index]}
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
