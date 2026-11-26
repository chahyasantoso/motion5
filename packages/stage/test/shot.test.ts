import { eventLog, motion, state, type Pose2d, type Time } from "@gerak/core";
import { describe, expect, it } from "vitest";
import {
  beat,
  box,
  compileScene,
  formatStageError,
  frame,
  poseOf,
  scene,
  scrollPoint,
  shot,
  type MotionContext,
  type Scene,
  type Stage,
} from "../src";

function compiled(piece: Scene): Stage {
  const result = compileScene(piece);
  if (!result.ok) throw new Error(result.errors.map(formatStageError).join("\n"));
  return result.stage;
}

const at = (ms: number, length: number): Time => ({
  progress: Math.min(1, ms / length),
  clock: { kind: "timed", elapsed: ms, length },
});
const slide = motion((t: Time): Pose2d => ({ x: 100 * t.progress }));

function xOf(stage: Stage, name: string, ms: number): number | undefined {
  return poseOf(frame(stage, { time: at(ms, stage.durationMs) }).targets[name])?.x;
}

/** A shot whose one box slides across its own `ms`-long beat, written from 0. */
function sliding(name: string, ms: number): Scene {
  return scene({ name }, box(`${name}Box`).moves(slide.in(beat("go", ms))));
}

describe("shot", () => {
  it("plays each shot from its own 0, one after another", () => {
    const stage = compiled(scene(shot(sliding("hook", 600)), shot(sliding("story", 800))));
    expect(stage.shots).toEqual([
      { name: "hook", index: 0, from: 0, to: 600, overlap: 0 },
      { name: "story", index: 1, from: 600, to: 1400, overlap: 0 },
    ]);
    expect(stage.durationMs).toBe(1400);
    expect(xOf(stage, "hookBox", 300)).toBeCloseTo(50);
    expect(xOf(stage, "storyBox", 1000)).toBeCloseTo(50);
    expect(stage.beats["story.go"]).toMatchObject({ from: 600, to: 1400 });
  });

  it("moves every later shot when an earlier one grows", () => {
    const stage = compiled(scene(shot(sliding("hook", 900)), shot(sliding("story", 800))));
    expect(stage.shots?.[1]).toMatchObject({ from: 900, to: 1700 });
    expect(xOf(stage, "storyBox", 1300)).toBeCloseTo(50);
  });

  it("starts a shot early by its overlap", () => {
    const stage = compiled(
      scene(shot(sliding("hook", 600)), shot(sliding("story", 800), { overlap: 150 })),
    );
    expect(stage.shots?.[1]).toEqual({
      name: "story",
      index: 1,
      from: 450,
      to: 1250,
      overlap: 150,
    });
    expect(stage.visibleAt(500)).toMatchObject({ hookBox: true, storyBox: true });
  });

  it("shows a shot's elements only during the shot, unless they show wider", () => {
    const wide = scene(
      { name: "wide" },
      box("lingers").shows(beat("stay", 1200)),
      box("stays").moves(slide.in(beat("go", 600))),
    );
    const stage = compiled(scene(shot(wide, { length: 600 }), shot(sliding("next", 800))));
    expect(stage.visibleAt(300)).toMatchObject({ stays: true, lingers: true, nextBox: false });
    expect(stage.visibleAt(900)).toMatchObject({ stays: false, lingers: true, nextBox: true });
  });

  it("ends a shot on an absolute ms with until", () => {
    const stage = compiled(
      scene(shot(sliding("hook", 600)), shot(sliding("story", 800), { until: 1500 })),
    );
    expect(stage.shots?.[1]).toMatchObject({ from: 600, to: 1500 });
    expect(() =>
      scene(shot(sliding("a", 600)), shot(sliding("b", 800), { until: 1500, length: 900 })),
    ).toThrow(/until.*length|length.*until/);
    expect(() => scene(shot(sliding("c", 600)), shot(sliding("d", 800), { until: 600 }))).toThrow(
      /until/,
    );
  });

  it("refuses a shot with no beats and no length", () => {
    expect(() => scene(shot(scene({ name: "empty" }, box("still"))))).toThrow(/length/);
    expect(() =>
      compiled(scene(shot(scene({ name: "card" }, box("card")), { length: 500 }))),
    ).not.toThrow();
  });

  it("refuses one element bound directly and in a shot, while allowing sequential shots", () => {
    const shared = box("shared");
    const one = scene({ name: "one" }, shared.moves(slide.in(beat("go", 500))));
    const two = scene({ name: "two" }, box("other").moves(slide), shared);
    expect(() => compiled(scene(shot(one), shot(two, { length: 500 })))).not.toThrow();
    expect(() => scene(shared, shot(one))).toThrow(/"shared"/);
  });

  it("hands a shot's motions its events at its own ms", () => {
    const taps = state(0, (count, event) => (event.name === "tap" ? count + 1 : count));
    const seen: number[] = [];
    const counting = scene(
      { name: "count" },
      box("counter").moves(
        motion((_t: Time, context?: MotionContext): Pose2d => {
          if (context === undefined) return {};
          seen.push(context.events.find((event) => event.name === "tap")?.at ?? -1);
          return { x: taps(context.time, context.events) };
        }),
      ),
    );
    const stage = compiled(
      scene(
        { cues: [{ name: "tap", at: 700 }] },
        shot(sliding("hook", 600)),
        shot(counting, { length: 400 }),
      ),
    );
    const { targets } = frame(stage, { time: at(800, 1000), events: stage.cues });
    expect(poseOf(targets["counter"])?.x).toBe(1);
    expect(seen.at(-1)).toBe(100);
  });

  it("reads another shot's element at the scene's time", () => {
    const leader = box("leader");
    const lead = scene({ name: "lead" }, leader.moves(slide.in(beat("go", 1000))));
    const follow = scene(
      { name: "follow" },
      box("follower").moves(
        motion(
          (_t: Time, context?: MotionContext): Pose2d => ({
            x: context?.read(leader).x ?? 0,
          }),
        ),
      ),
    );
    const stage = compiled(scene(shot(lead), shot(follow, { length: 500, overlap: 500 })));
    expect(xOf(stage, "follower", 750)).toBeCloseTo(75);
  });

  it("hands a shot an event logged after it first ran, from a growing log", () => {
    const taps = state(0, (count, event) => (event.name === "tap" ? count + 1 : count));
    const counting = scene(
      { name: "count" },
      box("tally").moves(
        motion(
          (_t: Time, context?: MotionContext): Pose2d =>
            context === undefined ? {} : { x: taps(context.time, context.events) },
        ),
      ),
    );
    const stage = compiled(scene(shot(sliding("hook", 600)), shot(counting, { length: 400 })));
    const log = eventLog();
    const tally = (ms: number) =>
      poseOf(frame(stage, { time: at(ms, 1000), events: log.events }).targets["tally"])?.x;
    expect(tally(700)).toBe(0);
    log.add({ name: "tap", at: 750 });
    expect(tally(800)).toBe(1);
  });

  it("keeps a reel's shots in place when the reel joins a scene with no shots of its own", () => {
    const reel = scene(shot(sliding("a", 500)), shot(sliding("b", 500)));
    const stage = compiled(scene(box("frame"), reel, shot(sliding("c", 300))));
    expect(stage.shots?.map(({ name, from, to }) => [name, from, to])).toEqual([
      ["a", 0, 500],
      ["b", 500, 1000],
      ["c", 1000, 1300],
    ]);
    expect(() => scene(shot(sliding("d", 400)), scene(shot(sliding("e", 400))))).toThrow(
      /holds shots/,
    );
  });

  it("refuses scroll and trigger beats inside a shot", () => {
    const scrolled = scene(
      { name: "scrolled" },
      box("s").moves(slide.in(beat("wheel", { scroll: [scrollPoint(0), scrollPoint(400)] }))),
    );
    expect(() => scene(shot(scrolled, { length: 500 }))).toThrow(/scroll and trigger/);
  });

  it("sees only events at or after the shot's start", () => {
    const beats = state(0, (count, event) => (event.name === "beat" ? count + 1 : count));
    const seen: number[] = [];
    const makeCounting = () =>
      scene(
        { name: "count" },
        box("counter").moves(
          motion((_t: Time, context?: MotionContext): Pose2d => {
            if (context === undefined) return {};
            seen.length = 0;
            for (const event of context.events) if (event.name === "beat") seen.push(event.at);
            return { x: beats(context.time, context.events) };
          }),
        ),
      );
    const withBeats = compiled(
      scene(
        {
          cues: [
            { name: "beat", at: 500 },
            { name: "beat", at: 700 },
          ],
        },
        shot(sliding("hook", 600)),
        shot(makeCounting(), { length: 400 }),
      ),
    );
    const noBeats = compiled(
      scene(shot(sliding("hook", 600)), shot(makeCounting(), { length: 400 })),
    );
    const read = (stage: Stage, ms: number) =>
      poseOf(frame(stage, { time: at(ms, 1000), events: stage.cues }).targets["counter"])?.x;
    expect(read(withBeats, 650)).toBe(read(noBeats, 650));
    expect(read(withBeats, 700)).toBe(1);
    expect(seen).toEqual([100]);
  });

  it("with overlap, ignores events before the overlapped shot start", () => {
    const beats = state(0, (count, event) => (event.name === "beat" ? count + 1 : count));
    const seen: number[] = [];
    const makeCounting = () =>
      scene(
        { name: "count" },
        box("counter").moves(
          motion((_t: Time, context?: MotionContext): Pose2d => {
            if (context === undefined) return {};
            seen.length = 0;
            for (const event of context.events) if (event.name === "beat") seen.push(event.at);
            return { x: beats(context.time, context.events) };
          }),
        ),
      );
    const withBeats = compiled(
      scene(
        {
          cues: [
            { name: "beat", at: 440 },
            { name: "beat", at: 600 },
          ],
        },
        shot(sliding("hook", 600)),
        shot(makeCounting(), { length: 400, overlap: 150 }),
      ),
    );
    const noBeats = compiled(
      scene(shot(sliding("hook", 600)), shot(makeCounting(), { length: 400, overlap: 150 })),
    );
    const read = (stage: Stage, ms: number) =>
      poseOf(frame(stage, { time: at(ms, 850), events: stage.cues }).targets["counter"])?.x;
    expect(read(withBeats, 500)).toBe(read(noBeats, 500));
    expect(read(withBeats, 600)).toBe(1);
    expect(seen).toEqual([150]);
  });

  it("sees a beat at the exact start of the shot at local 0", () => {
    const beats = state(0, (count, event) => (event.name === "beat" ? count + 1 : count));
    const seen: number[] = [];
    const counting = scene(
      { name: "count" },
      box("counter").moves(
        motion((_t: Time, context?: MotionContext): Pose2d => {
          if (context === undefined) return {};
          seen.length = 0;
          for (const event of context.events) if (event.name === "beat") seen.push(event.at);
          return { x: beats(context.time, context.events) };
        }),
      ),
    );
    const stage = compiled(
      scene(
        { cues: [{ name: "beat", at: 600 }] },
        shot(sliding("hook", 600)),
        shot(counting, { length: 400 }),
      ),
    );
    const x = poseOf(
      frame(stage, { time: at(600, 1000), events: stage.cues }).targets["counter"],
    )?.x;
    expect(x).toBe(1);
    expect(seen).toEqual([0]);
  });

  it("keeps another shot's own events when read through context.read", () => {
    const beats = state(0, (count, event) => (event.name === "beat" ? count + 1 : count));
    const leader = box("leader");
    const lead = scene(
      { name: "lead" },
      leader.moves(
        motion(
          (_t: Time, context?: MotionContext): Pose2d =>
            context === undefined ? {} : { x: beats(context.time, context.events) },
        ),
      ),
    );
    const follow = scene(
      { name: "follow" },
      box("follower").moves(
        motion(
          (_t: Time, context?: MotionContext): Pose2d => ({
            x: context?.read(leader).x ?? 0,
          }),
        ),
      ),
    );
    const stage = compiled(
      scene(
        { cues: [{ name: "beat", at: 200 }] },
        shot(lead, { length: 600 }),
        shot(follow, { length: 400 }),
      ),
    );
    const x = poseOf(
      frame(stage, { time: at(700, 1000), events: stage.cues }).targets["follower"],
    )?.x;
    expect(x).toBe(1);
  });

  it("refuses a shot inside a shot", () => {
    const inner = scene(shot(sliding("inner", 300)));
    expect(() => scene(shot(inner, { length: 300 }))).toThrow(/shot/);
  });
});
