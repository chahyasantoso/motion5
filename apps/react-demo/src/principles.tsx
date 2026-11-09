import React, { useCallback } from "react";
import { applyPose } from "@motion5/dom";
import type { Player } from "@motion5/player";
import { usePlayer, useTarget } from "@motion5/react";
import { WORD, clock, scene } from "./principles-scene";

type Frame = ReturnType<typeof scene>;

/** One letter, driven by its entry in the scene's list of letter poses. */
const Letter: React.FC<{
  player: Player<Frame> | undefined;
  index: number;
  children: string;
}> = ({ player, index, children }) => {
  const render = useCallback(
    (element: Parameters<typeof applyPose>[0], poses: Frame["letters"]) => {
      const pose = poses[index];
      if (pose !== undefined) applyPose(element, pose);
    },
    [index],
  );
  const ref = useTarget(player, "letters", render);
  return (
    <span ref={ref} className="letter">
      {children}
    </span>
  );
};

/** A blob crouches, leaps over an arc with a trailing antenna, lands and the word fans out. Click replays. */
export const Principles: React.FC = () => {
  const playing = usePlayer(scene, clock);
  const player = playing?.player;
  const body = useTarget(player, "body");
  const stretch = useTarget(player, "stretch");
  const face = useTarget(player, "face");
  const antenna = useTarget(player, "antenna");
  const pad = useTarget(player, "pad");
  return (
    <div className="stage" onClick={() => playing?.driver.replay()}>
      <div className="word">
        {[...WORD].map((letter, index) => (
          <Letter key={index} player={player} index={index}>
            {letter}
          </Letter>
        ))}
      </div>
      <div className="ground" />
      <div ref={pad} className="pad" />
      <div ref={body} className="body">
        <div ref={stretch} className="stretch">
          <div ref={face} className="face">
            <div ref={antenna} className="antenna">
              <i />
            </div>
            <b className="eye left" />
            <b className="eye right" />
          </div>
        </div>
      </div>
    </div>
  );
};
