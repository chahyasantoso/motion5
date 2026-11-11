import React, { useCallback, useLayoutEffect, useRef } from "react";
import { applyValue, type RenderTarget } from "@gerak/dom";
import type { Pose2d } from "@gerak/moves";
import type { Player } from "@gerak/player";
import { centreIn, usePlayer, useTarget } from "@gerak/react";
import { BEATS, clock, geo, scene, STRINGS } from "./showreel-scene";

type Frame = ReturnType<typeof scene>;
type Playing = Player<Frame> | undefined;
type ListKey = "ant" | "wgt" | "dust" | "hangers" | "stl" | "fin";
type Rgb = readonly [number, number, number];

const INK: Rgb = [16, 17, 20];
const PAPER: Rgb = [243, 239, 230];
const CORAL: Rgb = [255, 91, 58];

const rgb = (a: Rgb, b: Rgb, p: number) =>
  `rgb(${a.map((v, i) => Math.round(v + ((b[i] ?? v) - v) * p)).join(",")})`;
const blur = (px: number) => (px > 0.05 ? `blur(${px.toFixed(2)}px)` : "none");
const pad = (v: number) => String(v).padStart(2, "0");

/** One element bound to one pose of a list target. */
const Item: React.FC<{
  player: Playing;
  target: ListKey;
  i: number;
  className?: string;
  id?: string;
  touch?: string;
  children?: React.ReactNode;
}> = ({ player, target, i, className, id, touch, children }) => {
  const render = useCallback(
    (el: RenderTarget, poses: readonly Pose2d[]) => applyValue(el, poses[i] ?? {}),
    [i],
  );
  return (
    <span
      ref={useTarget(player, target, render)}
      className={className}
      id={id}
      data-motion-touch={touch}
    >
      {children}
    </span>
  );
};

/** A stroke shown between a tail and a head, each a share of its length. */
const drawSegment = (el: RenderTarget, value: { drawn: number; tail: number }) => {
  if (!(el instanceof SVGPathElement)) return;
  const length = el.getTotalLength();
  const from = value.tail * length;
  const to = Math.max(from, value.drawn * length);
  el.style.strokeDasharray = `${to - from} ${length + 20}`;
  el.style.strokeDashoffset = String(-from);
  el.style.opacity = to - from > 0.5 ? "1" : "0";
};

const drawUnderline = (el: RenderTarget, drawn: Pose2d) => {
  applyValue(el, drawn);
  el.style.opacity = (drawn.drawn ?? 1) > 0.002 ? "1" : "0";
};

/** Colour, blur and the counter's text: values the scene carries as plain numbers. */
const paintStage = (el: RenderTarget, paint: Frame["paint"]) => {
  if (!(el instanceof HTMLElement)) return;
  const each = (selector: string, fn: (node: HTMLElement, i: number) => void) =>
    el.querySelectorAll<HTMLElement>(selector).forEach(fn);
  each("#ant .ch", (node, i) => {
    node.style.color = rgb(PAPER, CORAL, paint.antCharge[i] ?? 0);
    node.style.filter = blur(paint.antBlur[i] ?? 0);
  });
  each("#wgt .ch", (node, i) => (node.style.filter = blur(paint.wgtBlur[i] ?? 0)));
  each("#stl .ch", (node, i) => {
    node.style.color = rgb(PAPER, INK, paint.ink);
    node.style.filter = blur(paint.stlBlur[i] ?? 0);
  });
  each(".ul", (node) => (node.style.stroke = rgb(PAPER, INK, paint.ink)));
  each(".floor-half", (node) => (node.style.background = rgb(PAPER, CORAL, paint.floorCoral)));
  each("#dot", (node) => (node.style.background = rgb(CORAL, INK, paint.dotInk)));
  each("#hud", (node) => (node.style.opacity = paint.hudOpacity.toFixed(3)));
  each("#idx", (node) => (node.textContent = BEATS[paint.beat] ?? ""));
  each("#tc", (node) => {
    const t = Math.min(15000, Math.max(0, paint.ms));
    node.textContent = `00:${pad(Math.floor(t / 1000))}:${pad(Math.floor(((t % 1000) * 30) / 1000))}`;
  });
};

/** Binds each target to its element; all motion lives in `showreel-scene.ts`. Click replays. */
export const Showreel: React.FC = () => {
  const playing = usePlayer(scene, clock);
  const player = playing?.player;
  const cameraRef = useRef<HTMLDivElement | null>(null);
  const camera = useTarget(player, "camera");
  const setCamera = useCallback(
    (el: HTMLDivElement | null) => {
      cameraRef.current = el;
      camera(el);
    },
    [camera],
  );

  useLayoutEffect(() => {
    const cam = cameraRef.current;
    if (!cam) return;
    cam.querySelectorAll<HTMLElement>("#stl .ch").forEach((el, i) => {
      geo.stl[i] = { ...centreIn(el, cam), w: el.offsetWidth };
    });
    cam.querySelectorAll<HTMLElement>("#wgt .ch").forEach((el, i) => {
      geo.wgt[i] = { x: centreIn(el, cam).x, w: el.offsetWidth };
    });
    const base = cam.querySelector<HTMLElement>("#fin-base");
    if (base) {
      const point = centreIn(base, cam);
      geo.px = point.x + 7;
      geo.py = point.y - 13;
    }
    const arc = cam.querySelector("#trail-arc");
    arc?.setAttribute(
      "d",
      `M 640 380 Q ${(640 + geo.px) / 2} ${Math.min(380, geo.py) - 430} ${geo.px} ${geo.py}`,
    );
    const first = geo.stl[0];
    const last = geo.stl[5];
    const half =
      first && last ? Math.max(640 - (first.x - first.w / 2), last.x + last.w / 2 - 640) - 6 : 280;
    for (const side of [-1, 1]) {
      const end = 640 + side * half;
      cam
        .querySelector(side < 0 ? "#ul-left" : "#ul-right")
        ?.setAttribute(
          "d",
          `M 640 382.3 C ${640 + (side * half) / 3} 382.3 ${640 + (side * half * 2) / 3} 379 ${end} 373`,
        );
    }
    player?.refresh();
  }, [player]);

  return (
    <div
      className="stage"
      ref={useTarget(player, "paint", paintStage)}
      onClick={() => playing?.driver.replay()}
    >
      <div id="camera" ref={setCamera}>
        <div id="wipe" ref={useTarget(player, "wipe")} />
        <svg id="fx" width="1280" height="720" viewBox="0 0 1280 720" aria-hidden="true">
          <path
            id="trail-up"
            d="M 640 400 L 640 -140"
            stroke="#ff5b3a"
            strokeWidth="3"
            ref={useTarget(player, "trailUp", drawSegment)}
          />
          <path
            id="trail-arc"
            stroke="#ff5b3a"
            strokeWidth="2.5"
            ref={useTarget(player, "trailArc", drawSegment)}
          />
          <path
            id="ul-left"
            className="ul"
            strokeWidth="7"
            ref={useTarget(player, "underline", drawUnderline)}
          />
          <path
            id="ul-right"
            className="ul"
            strokeWidth="7"
            ref={useTarget(player, "underline", drawUnderline)}
          />
        </svg>

        <div className="word" id="ant">
          {[..."ANTICIPATE"].map((c, i) => (
            <Item key={i} player={player} target="ant" i={i} className="ch" touch="#ant .ch">
              {c}
            </Item>
          ))}
        </div>

        <div id="floor" ref={useTarget(player, "floor")}>
          <div className="floor-half" id="floor-left" ref={useTarget(player, "floorLeft")} />
          <div className="floor-half" id="floor-right" ref={useTarget(player, "floorRight")} />
        </div>
        <div className="word" id="wgt">
          {[..."WEIGHT"].map((c, i) => (
            <Item key={i} player={player} target="wgt" i={i} className="ch">
              {c}
            </Item>
          ))}
        </div>
        <div id="dust">
          {Array.from({ length: 18 }, (_, j) => (
            <Item key={j} player={player} target="dust" i={j} className="dust" />
          ))}
        </div>

        <div id="ovl" ref={useTarget(player, "overlap")}>
          <div id="bar" />
          <div id="ovl-row">
            {[..."OVERLAP"].map((c, i) => (
              <Item key={i} player={player} target="hangers" i={i} className="hg" touch=".hg">
                <i className="str" style={{ height: STRINGS[i] }} />
                <b>{c}</b>
              </Item>
            ))}
          </div>
        </div>

        <div className="word" id="stl">
          {[..."SETTLE"].map((c, i) => (
            <Item key={i} player={player} target="stl" i={i} className="ch" touch="#stl .ch">
              {c}
            </Item>
          ))}
        </div>

        <div className="word" id="fin">
          {["Timing", "is", "everything"].map((w, i) => (
            <span key={w} className="fm">
              <Item player={player} target="fin" i={i} className="fw">
                {w}
              </Item>
            </span>
          ))}
          <span className="fm" id="fin-slot">
            <span className="fw rest">
              {"​"}
              <i id="fin-base" />
            </span>
          </span>
        </div>
        <div id="credit" ref={useTarget(player, "credit")}>
          CLAUDE <em>·</em> MOTION DESIGN <em>·</em> REEL 2026
        </div>

        <div className="ring" ref={useTarget(player, "ringLaunch")} />
        <div className="ring" ref={useTarget(player, "ringLand")} />
        <div className="ring" ref={useTarget(player, "ringBurst")} />
        <div className="ring" ref={useTarget(player, "ringPeriod")} />
        <div id="dot" ref={useTarget(player, "dot")} />
      </div>
      <div id="vignette" />
      <div id="hud">
        <span id="idx" />
        <span id="tc" />
      </div>
    </div>
  );
};
