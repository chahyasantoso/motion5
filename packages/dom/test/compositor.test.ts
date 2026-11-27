import { INPUT_EVENTS, ease, liveAt, motion, type Pose2d, type Time } from "@gerak/core";
import {
  beat,
  box,
  compileScene,
  formatStageError,
  frame,
  listPose,
  poseOf,
  restReader,
  scene,
  scrollPoint,
  stagger,
  type Scene,
  type Stage,
} from "@gerak/stage";
import { describe, expect, it } from "vitest";
import {
  TRACK_TOLERANCE,
  scrollTracks,
  trackKeyframes,
  triggerTracks,
  type TrackSample,
} from "../src/compositor";

function compiled(piece: Scene): Stage {
  const result = compileScene(piece);
  if (!result.ok) throw new Error(result.errors.map(formatStageError).join("\n"));
  return result.stage;
}

const range = beat("range", { scroll: [scrollPoint(300), scrollPoint(1100)] });
const curve = motion(
  (t: Time): Pose2d => ({
    y: 40 * Math.sin(Math.PI * t.progress),
    rotation: 12 * t.progress * t.progress,
    opacity: 1 - t.progress,
  }),
);

const stage = compiled(
  scene(
    { length: 1000 },
    box("scrolled").moves(curve.in(range)),
    box("cards", { parts: true }).moves(stagger(curve, { spread: 0.4 }).in(range)),
    box("clocked").moves(
      motion(
        (t: Time, context?: { readonly time: Time }): Pose2d => ({
          x: t.progress + (context?.time.progress ?? 0),
        }),
      ).in(range),
    ),
    box("skewed").moves(motion((t: Time): Pose2d => ({ skewX: 10 * t.progress })).in(range)),
  ),
);

const MAX = 2000;
const names = new Set(["scrolled", "cards", "clocked", "skewed"]);
const input = { counts: { cards: 3 }, lines: {}, rest: restReader(), names };
const { tracks } = scrollTracks(stage, input, MAX);

function between(samples: readonly TrackSample[], y: number): TrackSample["fields"] {
  const after = samples.findIndex((s) => s.at >= y);
  const b = samples[after];
  const a = samples[Math.max(0, after - 1)];
  if (a === undefined || b === undefined) throw new Error(`no samples around ${y}`);
  const at = b.at === a.at ? 0 : (y - a.at) / (b.at - a.at);
  const out = { ...a.fields };
  for (const key of ["x", "y", "rotation", "scale", "scaleX", "scaleY", "opacity"] as const)
    out[key] = a.fields[key] + (b.fields[key] - a.fields[key]) * at;
  return out;
}

function engineAt(y: number, name: string, index?: number, count?: number): Pose2d {
  const { targets } = frame(stage, {
    time: liveAt(0),
    events: [{ kind: "value", name: INPUT_EVENTS.scroll, at: 0, value: y }],
  });
  const pose =
    index === undefined || count === undefined
      ? poseOf(targets[name])
      : listPose(targets[name], index, count);
  if (pose === undefined) throw new Error(`no pose for ${name}`);
  return pose;
}

describe("what the browser plays on a scroll timeline", () => {
  it("takes elements whose motions read only scroll-beat time, not one reading the clock", () => {
    expect([...tracks.keys()].sort()).toEqual(["cards", "scrolled"]);
  });

  it("leaves out an element that sets a field the browser does not play", () => {
    expect(tracks.has("skewed")).toBe(false);
  });

  it("keeps straight lines between its samples within tolerance of frame()", () => {
    const parts: [string, number | undefined, number | undefined][] = [
      ["scrolled", undefined, undefined],
      ["cards", 0, 3],
      ["cards", 2, 3],
    ];
    for (const [name, index, count] of parts) {
      const samples = tracks.get(name)?.parts[index ?? 0];
      if (samples === undefined) throw new Error(`no track for ${name}`);
      for (let k = 0; k <= 200; k += 1) {
        const y = (MAX * k) / 200 + 0.37;
        const line = between(samples, Math.min(MAX, y));
        const pose = engineAt(Math.min(MAX, y), name, index, count);
        expect(Math.abs(line.y - (pose.y ?? 0))).toBeLessThanOrEqual(TRACK_TOLERANCE.y);
        expect(Math.abs(line.rotation - (pose.rotation ?? 0))).toBeLessThanOrEqual(
          TRACK_TOLERANCE.rotation,
        );
        expect(Math.abs(line.opacity - (pose.opacity ?? 1))).toBeLessThanOrEqual(
          TRACK_TOLERANCE.opacity,
        );
      }
    }
  });

  it("holds the pose outside the beat with few keyframes", () => {
    const samples = tracks.get("scrolled")?.parts[0] ?? [];
    expect(samples.length).toBeLessThan(120);
    const keyframes = trackKeyframes(samples, MAX);
    expect(keyframes[0]?.offset).toBe(0);
    expect(keyframes.at(-1)?.offset).toBe(1);
    const transforms = keyframes.map((key: Keyframe) => String(key["transform"]));
    for (const transform of transforms)
      expect(transform).toMatch(/^translate3d\(.+\) rotate\(.+\)$/);
  });
});

const reveal = (back: "reverse" | "stay" | "replay", name: string = back) =>
  beat(`reveal-${name}`, 600, { when: scrollPoint(500).reached, back });
const rise = motion((t: Time): Pose2d => ({ y: 30 * (1 - t.progress), opacity: t.progress }));
const triggered = compiled(
  scene(
    { length: 1000 },
    box("cards", { parts: true }).moves(
      stagger(rise, { spread: 0.3 }).in(reveal("reverse"), ease.cubicOut),
    ),
    box("stays").moves(rise.in(reveal("stay"))),
    box("replays").moves(rise.in(reveal("replay"))),
    box("taken").moves(rise.in(reveal("stay", "taken")).take()),
    box("clocked").moves(
      motion(
        (t: Time, context?: { readonly time: Time }): Pose2d => ({
          y: t.progress + (context?.time.progress ?? 0),
        }),
      ).in(reveal("stay", "clocked")),
    ),
  ),
);
const triggerInput = {
  counts: { cards: 3 },
  lines: {},
  rest: restReader(),
  names: new Set(["cards", "stays", "replays", "taken", "clocked"]),
};
const { tracks: triggerSet } = triggerTracks(triggered, triggerInput);

describe("what the browser plays from a trigger beat", () => {
  it("takes elements that read only one trigger's progress, for each way back", () => {
    expect([...triggerSet.keys()].sort()).toEqual(["cards", "replays", "stays"]);
    expect(triggerSet.get("stays")?.beat.back).toBe("stay");
    expect(triggerSet.get("replays")?.beat.back).toBe("replay");
  });

  it("leaves out a taken motion, whose pose before the trigger is not its start", () => {
    expect(triggerSet.has("taken")).toBe(false);
  });

  it("keeps straight lines between its samples within tolerance of frame()", () => {
    const samples = triggerSet.get("cards")?.parts[1];
    if (samples === undefined) throw new Error("no track for cards");
    for (let k = 0; k <= 120; k += 1) {
      const ms = (600 * k) / 120;
      const { targets } = frame(triggered, {
        time: liveAt(ms),
        events: [{ kind: "value", name: INPUT_EVENTS.scroll, at: 0, value: 500 }],
      });
      const pose = listPose(targets["cards"], 1, 3);
      const line = between(samples, ms);
      expect(Math.abs(line.y - (pose?.y ?? 0))).toBeLessThanOrEqual(TRACK_TOLERANCE.y);
      expect(Math.abs(line.opacity - (pose?.opacity ?? 1))).toBeLessThanOrEqual(
        TRACK_TOLERANCE.opacity,
      );
    }
  });
});

describe("what the sampler refuses", () => {
  it("gives up on a scroll range too long to sample before running the scene across it", () => {
    let runs = 0;
    const counted = compiled(
      scene(
        { length: 1000 },
        box("counted").moves(
          motion((t: Time): Pose2d => {
            runs += 1;
            return { x: t.progress };
          }).in(range),
        ),
      ),
    );
    const names = new Set(["counted"]);
    expect(scrollTracks(counted, { ...input, names }, 1_000_000).tracks.size).toBe(0);
    expect(runs).toBeLessThan(10);
  });
});

describe("beat-scoped sampling and rest dependencies", () => {
  it("reports exact rest dependencies from beat edges and context.rest reads while ignoring non-handed elements", () => {
    const secA = box("secA");
    const secB = box("secB");
    const triggerSec = box("triggerSec");
    const unusedBox = box("unusedBox");
    const scrollBeat = beat("s", { scroll: [secA.top, secB.end] });
    const trigBeat = beat("t", 400, { when: triggerSec.top.reached, back: "stay" });
    const piece = compiled(
      scene(
        { length: 1000 },
        box("sEl").moves(
          motion(
            (t: Time, ctx?: { readonly rest: { get(n: string): { readonly width: number } } }) => ({
              x: t.progress * 100 + (ctx?.rest.get("slotInMotion").width ?? 0),
            }),
          ).in(scrollBeat),
        ),
        box("tEl").moves(motion((t: Time): Pose2d => ({ y: t.progress * 50 })).in(trigBeat)),
        box("engineEl").moves(
          motion(
            (_t: Time, ctx?: { readonly rest: { get(n: string): { readonly x: number } } }) => ({
              x: ctx?.rest.get("unusedBox").x ?? 0,
            }),
          ),
        ),
        unusedBox,
      ),
    );
    const measured = restReader({
      secA: { x: 500, y: 300, width: 1000, height: 200 },
      secB: { x: 500, y: 900, width: 1000, height: 200 },
      triggerSec: { x: 500, y: 1200, width: 1000, height: 200 },
      slotInMotion: { x: 100, y: 100, width: 40, height: 40 },
      unusedBox: { x: 50, y: 50, width: 50, height: 50 },
    });
    const allNames = new Set(["sEl", "tEl", "engineEl", "unusedBox"]);
    const sRes = scrollTracks(piece, { lines: {}, rest: measured, names: allNames }, 2000);
    expect([...sRes.tracks.keys()]).toEqual(["sEl"]);
    expect([...sRes.deps].sort()).toEqual(["secA", "secB", "slotInMotion"]);

    const left = new Set(["tEl", "engineEl", "unusedBox"]);
    const tRes = triggerTracks(piece, { lines: {}, rest: measured, names: left });
    expect([...tRes.tracks.keys()]).toEqual(["tEl"]);
    expect([...tRes.deps]).toEqual(["triggerSec"]);
  });

  it("samples a 20,000 px scroll range only inside active beats, matching frame() including .take() and zero-width beats", () => {
    let calls = 0;
    const active = beat("active", { scroll: [scrollPoint(4000), scrollPoint(4400)] });
    const stepSec = box("stepSec");
    const zeroWidth = beat("step", { scroll: [stepSec.top, stepSec.end] });
    const stepped = beat("stepped", { scroll: [scrollPoint(12000), scrollPoint(12200)] });
    const piece = compiled(
      scene(
        { length: 1000 },
        box("mover").moves(
          motion((t: Time): Pose2d => {
            calls += 1;
            return { y: 100 * Math.sin((Math.PI * t.progress) / 2) };
          }).in(active),
        ),
        box("jumper").moves(
          motion((t: Time): Pose2d => ({ x: 80 * t.progress }))
            .in(stepped)
            .take(),
        ),
        box("snap").moves(
          motion((t: Time): Pose2d => ({ opacity: 1 - 0.5 * t.progress })).in(zeroWidth),
        ),
      ),
    );
    const maxScroll = 20_000;
    const zeroRest = restReader({ stepSec: { x: 500, y: 8000, width: 1000, height: 0 } });
    const scoped = scrollTracks(
      piece,
      { lines: {}, rest: zeroRest, names: new Set(["mover", "jumper", "snap"]) },
      maxScroll,
    );
    expect(calls).toBeLessThan(120);
    expect([...scoped.tracks.keys()].sort()).toEqual(["jumper", "mover", "snap"]);

    for (const y of [
      0, 3999, 4000, 4123, 4400, 7999, 8000, 8001, 11999, 12000, 12100, 12200, 20000,
    ]) {
      const { targets } = frame(piece, {
        time: liveAt(0),
        rest: zeroRest,
        events: [{ kind: "value", name: INPUT_EVENTS.scroll, at: 0, value: y }],
      });
      for (const name of ["mover", "jumper", "snap"] as const) {
        const samples = scoped.tracks.get(name)?.parts[0] ?? [];
        const line = between(samples, y);
        const pose = poseOf(targets[name]);
        expect(Math.abs(line.x - (pose?.x ?? 0)), `${name}.x @ ${y}`).toBeLessThanOrEqual(
          TRACK_TOLERANCE.x,
        );
        expect(Math.abs(line.y - (pose?.y ?? 0)), `${name}.y @ ${y}`).toBeLessThanOrEqual(
          TRACK_TOLERANCE.y,
        );
        expect(
          Math.abs(line.opacity - (pose?.opacity ?? 1)),
          `${name}.opacity @ ${y}`,
        ).toBeLessThanOrEqual(TRACK_TOLERANCE.opacity);
      }
    }
  });
});
