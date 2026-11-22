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
  sceneBuilder,
  scrollPoint,
  stagger,
  type SceneBuilder,
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

function compiled(scene: SceneBuilder): Stage {
  const result = compileScene(scene);
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
  sceneBuilder({ length: 1000 })
    .element(box("scrolled"))
    .motion(curve.in(range))
    .element(box("cards", { parts: true }))
    .motion(stagger(curve, { spread: 0.4 }).in(range))
    .element(box("clocked"))
    .motion(
      motion(
        (t: Time, context?: { readonly time: Time }): Pose2d => ({
          x: t.progress + (context?.time.progress ?? 0),
        }),
      ).in(range),
    )
    .element(box("skewed"))
    .motion(motion((t: Time): Pose2d => ({ skewX: 10 * t.progress })).in(range)),
);

const MAX = 2000;
const names = new Set(["scrolled", "cards", "clocked", "skewed"]);
const input = { counts: { cards: 3 }, lines: {}, rest: restReader(), names };
const tracks = scrollTracks(stage, input, MAX);

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
    events: [{ name: INPUT_EVENTS.scroll, at: 0, value: y }],
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
  sceneBuilder({ length: 1000 })
    .element(box("cards", { parts: true }))
    .motion(stagger(rise, { spread: 0.3 }).in(reveal("reverse"), ease.cubicOut))
    .element(box("stays"))
    .motion(rise.in(reveal("stay")))
    .element(box("replays"))
    .motion(rise.in(reveal("replay")))
    .element(box("taken"))
    .motion(rise.in(reveal("stay", "taken")).take())
    .element(box("clocked"))
    .motion(
      motion(
        (t: Time, context?: { readonly time: Time }): Pose2d => ({
          y: t.progress + (context?.time.progress ?? 0),
        }),
      ).in(reveal("stay", "clocked")),
    ),
);
const triggerInput = {
  counts: { cards: 3 },
  lines: {},
  rest: restReader(),
  names: new Set(["cards", "stays", "replays", "taken", "clocked"]),
};
const triggerSet = triggerTracks(triggered, triggerInput);

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
        events: [{ name: INPUT_EVENTS.scroll, at: 0, value: 500 }],
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
      sceneBuilder({ length: 1000 })
        .element(box("counted"))
        .motion(
          motion((t: Time): Pose2d => {
            runs += 1;
            return { x: t.progress };
          }).in(range),
        ),
    );
    const names = new Set(["counted"]);
    expect(scrollTracks(counted, { ...input, names }, 1_000_000).size).toBe(0);
    expect(runs).toBeLessThan(10);
  });
});
