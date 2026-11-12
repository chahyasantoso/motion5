import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { applyValue, type RenderTarget } from "@gerak/dom";
import type { Pose2d } from "@gerak/moves";
import type { Player } from "@gerak/player";
import { centreIn, usePlayer, useTarget } from "@gerak/react";
import { BEAT_LABELS, DUST_SIDES, STRING_LENGTHS, clock, layout, scene } from "./showreel-b-scene";

type Frame = ReturnType<typeof scene>;
type ListTarget = {
  [K in keyof Frame]: Frame[K] extends readonly Pose2d[] ? K : never;
}[keyof Frame];
type Props = { readonly player: Player<Frame> | undefined; readonly i: number };

/** A ref that writes pose `i` of a list target onto its element. */
function useItem(player: Player<Frame> | undefined, target: ListTarget, i: number) {
  const render = useCallback(
    (element: RenderTarget, poses: readonly Pose2d[]) => applyValue(element, poses[i] ?? {}),
    [i],
  );
  return useTarget<Frame, ListTarget>(player, target, render);
}

const Letter: React.FC<Props & { target: ListTarget; char: string; className?: string }> = ({
  player,
  i,
  target,
  char,
  className = "ch",
}) => (
  <span ref={useItem(player, target, i)} className={className}>
    {char}
  </span>
);

const Speck: React.FC<Props> = ({ player, i }) => (
  <i ref={useItem(player, "dust", i)} className={`dust ${DUST_SIDES[i] ?? "left"}`} />
);

const Hanging: React.FC<Props & { char: string }> = ({ player, i, char }) => (
  <div ref={useItem(player, "hanging", i)} className="hang">
    <i className="string" style={{ height: STRING_LENGTHS[i] }} />
    <b>{char}</b>
  </div>
);

const Label: React.FC<Props> = ({ player, i }) => (
  <span ref={useItem(player, "labels", i)} className="label">
    {BEAT_LABELS[i]}
  </span>
);

const ANTICIPATE = [..."ANTICIPATE"];
const WEIGHT = [..."WEIGHT"];
const OVERLAP = [..."OVERLAP"];
const SETTLE = [..."SETTLE"];
const FINALE = ["Timing", "is", "everything"];

/** Binds each target to its element; all motion lives in `showreel-b-scene.ts`. Click replays. */
export const ShowreelB: React.FC = () => {
  const playing = usePlayer(scene, clock);
  const player = playing?.player;
  const cameraRef = useRef<HTMLDivElement | null>(null);
  const baseRef = useRef<HTMLElement | null>(null);
  const settleRefs = useRef<(HTMLElement | null)[]>([]);
  const [arcPath, setArcPath] = useState("");

  useLayoutEffect(() => {
    const stage = cameraRef.current;
    const base = baseRef.current;
    if (stage === null || base === null) return;
    const at = centreIn(base, stage);
    layout.px = at.x + 7;
    layout.py = at.y - 13;
    layout.settle = settleRefs.current.map((el, i) =>
      el === null ? (layout.settle[i] ?? { x: 640, y: 296 }) : centreIn(el, stage),
    );
    const top = Math.min(380, layout.py) - 430;
    setArcPath(`M640,380 Q${(640 + layout.px) / 2},${top} ${layout.px},${layout.py}`);
    player?.refresh();
  }, [player]);

  const camera = useTarget(player, "camera");
  const dot = useTarget(player, "dot");
  const cover = useTarget(player, "cover");
  const ringLaunch = useTarget(player, "ringLaunch");
  const ringLand = useTarget(player, "ringLand");
  const ringBurst = useTarget(player, "ringBurst");
  const ringPeriod = useTarget(player, "ringPeriod");
  const trailUp = useTarget(player, "trailUp");
  const trailArc = useTarget(player, "trailArc");
  const underline = useTarget(player, "underline");
  const floor = useTarget(player, "floor");
  const bar = useTarget(player, "bar");
  const credit = useTarget(player, "credit");
  const hud = useTarget(player, "hud");
  const timecode = useTarget(player, "timecode");

  const cameraBox = useCallback(
    (el: HTMLDivElement | null) => {
      cameraRef.current = el;
      camera(el);
    },
    [camera],
  );

  return (
    <div className="stage" onClick={() => playing?.driver.replay()}>
      <div ref={cameraBox} className="camera">
        <div ref={cover} className="wipe" />
        <svg className="fx" width="1280" height="720" viewBox="0 0 1280 720" aria-hidden="true">
          <path ref={trailUp} className="trail-up" d="M640,400 C640,230 640,60 640,-140" />
          <path ref={trailArc} className="trail-arc" d={arcPath} />
          <path ref={underline} className="underline" d="M380,373 C553,382.3 727,382.3 900,373" />
          <path ref={floor} className="floor" d="M300,490 L980,490" />
        </svg>

        <div className="word ant">
          {ANTICIPATE.map((char, i) => (
            <Letter key={i} player={player} i={i} target="anticipate" char={char} />
          ))}
        </div>

        <div className="word wgt">
          {WEIGHT.map((char, i) => (
            <Letter key={i} player={player} i={i} target="weight" char={char} />
          ))}
        </div>
        <div className="word wgt dust-row" aria-hidden="true">
          {WEIGHT.map((char, letter) => (
            <span key={letter} className="ch">
              {char}
              {[0, 1, 2].map((k) => (
                <Speck key={k} player={player} i={letter * 3 + k} />
              ))}
            </span>
          ))}
        </div>

        <div ref={bar} className="ovl">
          <div className="bar" />
          <div className="ovl-row">
            {OVERLAP.map((char, i) => (
              <Hanging key={i} player={player} i={i} char={char} />
            ))}
          </div>
        </div>

        <div className="word stl">
          {SETTLE.map((char, i) => (
            <span
              key={i}
              ref={(el) => {
                settleRefs.current[i] = el;
              }}
              className="ch"
            >
              <Letter player={player} i={i} target="settle" char={char} className="ch" />
            </span>
          ))}
        </div>

        <div className="word fin">
          {FINALE.map((word, i) => (
            <span key={i} className="mask">
              <Letter player={player} i={i} target="finale" char={word} className="fin-word" />
            </span>
          ))}
          <span className="mask fin-slot">
            <span className="fin-word">
              {"​"}
              <i ref={baseRef} className="fin-base" />
            </span>
          </span>
        </div>
        <div ref={credit} className="credit">
          CLAUDE <em>&#183;</em> MOTION DESIGN <em>&#183;</em> REEL 2026
        </div>

        <div ref={ringLaunch} className="ring" />
        <div ref={ringLand} className="ring" />
        <div ref={ringBurst} className="ring" />
        <div ref={ringPeriod} className="ring" />
        <div ref={dot} className="dot" />
      </div>
      <div className="vignette" />
      <div ref={hud} className="hud">
        <span className="labels">
          {BEAT_LABELS.map((_, i) => (
            <Label key={i} player={player} i={i} />
          ))}
        </span>
        <span ref={timecode} className="timecode" />
      </div>
    </div>
  );
};
