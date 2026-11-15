import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { applyValue } from "@gerak/dom";
import type { Player } from "@gerak/player";
import type { Pose2d } from "@gerak/moves";
import { usePlayer, useTarget } from "@gerak/react";
import { DROPLETS, RINGS, WORD, clock, scene } from "./splash-scene";

type Frame = ReturnType<typeof scene>;
type PoseList = {
  [K in keyof Frame]: Frame[K] extends readonly Pose2d[] ? K : never;
}[keyof Frame];

/** An element driven by entry `index` of one list of poses in the scene. */
function Part<K extends PoseList>({
  player,
  target,
  index,
  className,
  style,
  children,
}: {
  player: Player<Frame> | undefined;
  target: K;
  index: number;
  className: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}) {
  const render = useCallback(
    (element: Parameters<typeof applyValue>[0], poses: Frame[K]) => {
      const pose = poses[index];
      if (pose !== undefined) applyValue(element, pose);
    },
    [index],
  );
  const ref = useTarget(player, target, render);
  return (
    <div ref={ref} className={className} style={style} aria-hidden>
      {children}
    </div>
  );
}

const Ring: React.FC<{ width: number; height: number; wide: number }> = ({
  width,
  height,
  wide,
}) => (
  <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
    <ellipse
      cx={width / 2}
      cy={height / 2}
      rx={width / 2 - 2}
      ry={height / 2 - 2}
      className="ring-line"
      strokeWidth={wide}
    />
    <ellipse
      cx={width / 2}
      cy={height / 2}
      rx={width / 2 - 2 - width * 0.035}
      ry={height / 2 - 2 - height * 0.035}
      className="ring-line ring-inner"
      strokeWidth={wide}
    />
  </svg>
);

/** A drop falls into a pool, rings and droplets answer, and the word rises out. Click replays. */
export const Splash: React.FC = () => {
  const playing = usePlayer(scene, clock);
  const player = playing?.player;
  const dropRef = useTarget(player, "drop");
  const slots = useRef<(HTMLSpanElement | null)[]>([]);
  const [centres, setCentres] = useState<number[]>([]);
  useLayoutEffect(() => {
    setCentres(slots.current.map((slot) => (slot ? slot.offsetLeft + slot.offsetWidth / 2 : 0)));
  }, []);
  return (
    <div className="stage" onClick={() => playing?.driver.replay()}>
      <div className="sky" />
      <div className="pool" />
      {RINGS.map((_, i) => (
        <Part key={i} player={player} target="rings" index={i} className="ring">
          <Ring width={1160} height={300} wide={3.5} />
        </Part>
      ))}
      {DROPLETS.map((d, i) => (
        <Part
          key={i}
          player={player}
          target="ripples"
          index={i}
          className="ripple"
          style={{ left: 640 + d.dx - 70, top: SURFACE + d.depth - 18 }}
        >
          <Ring width={140} height={36} wide={1.6} />
        </Part>
      ))}
      {centres.map((x, i) => (
        <Part
          key={i}
          player={player}
          target="foam"
          index={i}
          className="ripple"
          style={{ left: x - 70, top: SURFACE - 18 }}
        >
          <Ring width={140} height={36} wide={2} />
        </Part>
      ))}
      <div className="below" aria-hidden>
        <div className="word mirror">
          {[...WORD].map((glyph, i) => (
            <span key={i} className="slot">
              <Part player={player} target="letters" index={i} className="glyph">
                {glyph}
              </Part>
            </span>
          ))}
        </div>
      </div>
      <div className="above">
        <div className="word" aria-label={WORD}>
          {[...WORD].map((glyph, i) => (
            <span
              key={i}
              className="slot"
              ref={(element) => {
                slots.current[i] = element;
              }}
            >
              <Part player={player} target="letters" index={i} className="glyph">
                {glyph}
              </Part>
            </span>
          ))}
        </div>
      </div>
      {DROPLETS.map((d, i) => (
        <Part
          key={i}
          player={player}
          target="droplets"
          index={i}
          className="droplet"
          style={{
            left: 640 + d.dx - d.size / 2,
            top: SURFACE + d.depth - d.size * 1.4,
            width: d.size,
            height: d.size * 1.4,
          }}
        />
      ))}
      <div ref={dropRef} className="drop" aria-hidden />
    </div>
  );
};

const SURFACE = 560;
