import React, { useCallback, useLayoutEffect, useMemo, useRef } from "react";
import { applyPose, applyReveal } from "@motion5/dom";
import type { Player } from "@motion5/player";
import { centreIn, useTarget, usePlayer } from "@motion5/react";
import { WORD, beatClock, timingScene } from "./timing-scene";

type Beat = ReturnType<ReturnType<typeof timingScene>>;

const GLYPH_STYLE = { display: "inline-block" } as const;

const Glyph: React.FC<{ player: Player<Beat> | undefined; index: number; glyph: string }> = ({
  player,
  index,
  glyph,
}) => {
  const render = useCallback(
    (element: Parameters<typeof applyPose>[0], letters: Beat["letters"]) => {
      const pose = letters[index];
      if (pose !== undefined) applyPose(element, pose);
    },
    [index],
  );
  const ref = useTarget(player, "letters", render);
  return (
    <span ref={ref} aria-hidden style={GLYPH_STYLE} className="beat-glyph">
      {glyph}
    </span>
  );
};

/** The timing beat as plain code: one scene of moves on one clock. Click replays. */
export const TimingBeat: React.FC = () => {
  const centre = useRef({ x: 0, y: 0 }).current;
  const scene = useMemo(() => timingScene(centre), [centre, timingScene]);
  const playing = usePlayer(scene, beatClock);
  const dotRef = useRef<HTMLSpanElement | null>(null);
  const coverRef = useRef<HTMLDivElement | null>(null);
  const dot = useTarget(playing?.player, "dot");
  const cover = useTarget(playing?.player, "cover", applyReveal);

  useLayoutEffect(() => {
    if (dotRef.current === null || coverRef.current === null) return;
    Object.assign(centre, centreIn(dotRef.current, coverRef.current));
    playing?.player.refresh();
  }, [centre, playing]);

  return (
    <div onClick={() => playing?.driver.replay()}>
      <div className="beat-stage">
        <div className="beat-word">
          <span aria-label={WORD}>
            {[...WORD].map((glyph, index) => (
              <Glyph key={index} player={playing?.player} index={index} glyph={glyph} />
            ))}
          </span>
          <span
            ref={(element) => {
              dotRef.current = element;
              dot(element);
            }}
            className="beat-dot"
          />
        </div>
        <div
          ref={(element) => {
            coverRef.current = element;
            cover(element);
          }}
          className="beat-cover"
        />
      </div>
    </div>
  );
};
