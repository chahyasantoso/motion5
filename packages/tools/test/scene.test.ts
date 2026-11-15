import { describe, expect, it } from "vitest";
import type { Time } from "@gerak/moves";
import {
  parseEvents,
  readSceneModule,
  sampleScene,
  sceneTimeline,
  type SceneModule,
} from "@gerak/tools/scene";
import { reviewSceneModule } from "../src/scene/review";
import { renderTimeline } from "../src/timeline/timeline";

const SCENE_REVIEW = { hold: 500, jump: 150, turn: 150, ratio: 1.5 };
import * as timing from "../../../apps/pieces/timing/src/timing-scene";

function moduleOf(value: unknown): SceneModule {
  const read = readSceneModule(value);
  if ("reason" in read) throw new Error(read.reason);
  return read;
}

describe("scene tools", () => {
  const beat = moduleOf(timing);

  it("sample a scene module with no browser, at times or progress", () => {
    const halfway: Time = { progress: 0.5, clock: { kind: "timed", elapsed: 1500, length: 3000 } };
    const [atHalf] = sampleScene(beat, { kind: "time", ms: [1500] });
    expect(atHalf?.targets).toEqual(timing.scene(halfway));
    const [start] = sampleScene(beat, { kind: "progress", progress: [0] }, ["dot"], ["x"]);
    expect(start).toEqual({ at: 0, targets: { dot: { x: -1300 } } });
  });

  it("refuse a module without a scene or a duration, saying which", () => {
    expect(readSceneModule({ durationMs: 10 })).toEqual({
      reason: "The module exports no `scene`, a function from time to targets.",
    });
    expect(readSceneModule({ scene: () => ({}) })).toEqual({
      reason: "The module exports no `durationMs`, a positive number.",
    });
  });

  it("draw one timeline row per target", () => {
    const code = sceneTimeline(beat);
    if (code.kind !== "timeline") throw new Error("No timeline.");
    expect(code.rows.map(({ node }) => node)).toEqual(["letters", "dot", "cover"]);
  });

  it("find each target's start and rest within one step of what sampling gives", () => {
    const timeline = sceneTimeline(beat);
    if (timeline.kind !== "timeline") throw new Error("No timeline.");
    const dot = timeline.rows.find(({ node }) => node === "dot");
    if (dot?.kind !== "moves") throw new Error("The dot should move.");
    expect(Math.abs(dot.start - 880)).toBeLessThanOrEqual(timeline.step);
    expect(Math.abs(dot.rest - 1870)).toBeLessThanOrEqual(timeline.step);
    const [atRest, later] = sampleScene(beat, { kind: "time", ms: [dot.rest, 2300] });
    expect(atRest?.targets.dot).toEqual(later?.targets.dot);
  });

  it("draw one bar per target with its times, and a still target as still", () => {
    const text = renderTimeline(sceneTimeline(beat));
    const dotLine = text.split("\n").find((line) => line.startsWith("dot "));
    expect(dotLine).toMatch(/^dot +\.+#+\.+ {2}\d+-\d+ ms$/);
    const still = sceneTimeline(moduleOf({ scene: () => ({ p: { x: 1 } }), durationMs: 100 }));
    expect(still).toMatchObject({ kind: "timeline", rows: [{ kind: "still", node: "p" }] });
  });
});

describe("scene tools and events", () => {
  it("read a module's own cues and refuse ones that are not events", async () => {
    const catcher = moduleOf(await import("../../../apps/pieces/catch/src/catch-scene"));
    expect(catcher.cues.map(({ name }) => name)).toEqual(["catch"]);
    expect(readSceneModule({ scene: () => ({}), durationMs: 10, cues: [{ at: 1 }] })).toEqual({
      reason: "The module's `cues` must be a list of { name, at, target } events.",
    });
  });

  it("parse an event list, and refuse one out of order or malformed", () => {
    expect(parseEvents("enter:card@1000,leave:card@1120,go@1500")).toEqual([
      { name: "enter", at: 1000, target: "card" },
      { name: "leave", at: 1120, target: "card" },
      { name: "go", at: 1500 },
    ]);
    expect(parseEvents("leave:card@1120,enter:card@1000")).toHaveProperty("reason");
    expect(parseEvents("enter card")).toHaveProperty("reason");
  });

  it("play the events given beside the scene's own", async () => {
    const card = moduleOf(await import("../../../apps/pieces/card/src/card-scene"));
    const lifted = sampleScene(
      card,
      { kind: "time", ms: [1400] },
      ["card"],
      ["y"],
      [{ name: "enter", at: 1000, target: "card" }],
    );
    expect(lifted[0]?.targets.card).toSatisfy(
      (card: unknown) =>
        typeof card === "object" && card !== null && Number(Reflect.get(card, "y")) < -10,
    );
  });
});

describe("samples as events", () => {
  it("parse a value before the time, with or without a target", () => {
    expect(parseEvents("mouthOpen=0.6@1234,blink:left=1@1300,go@1500")).toEqual([
      { name: "mouthOpen", at: 1234, value: 0.6 },
      { name: "blink", at: 1300, target: "left", value: 1 },
      { name: "go", at: 1500 },
    ]);
    expect(parseEvents("mouthOpen=@1234")).toHaveProperty("reason");
  });

  it("are reviewed when a cue falls after the end, which no clock reaches", () => {
    const late = moduleOf({
      scene: () => ({ dot: { x: 0 } }),
      durationMs: 1000,
      cues: [
        { name: "mouthOpen", at: 900, value: 0.2 },
        { name: "mouthOpen", at: 1100, value: 0.4 },
        { name: "mouthOpen", at: 1200, value: 0.1 },
      ],
    });
    expect(reviewSceneModule(late, SCENE_REVIEW).findings).toContain(
      '2 cues come after the end at 1000 ms, the first "mouthOpen" at 1100 ms; no clock reaches them, so lengthen the story or cut the recording.',
    );
  });
});

describe("a module's limits", () => {
  const base = { durationMs: 10, scene: () => ({}) };

  it("reads per-target limits, empty when absent", () => {
    expect(moduleOf(base).limits).toEqual({});
    expect(moduleOf({ ...base, limits: { body: { jump: 0.1, turn: 0 } } }).limits).toEqual({
      body: { jump: 0.1, turn: 0 },
    });
  });

  it("refuses a malformed limit, naming the target and field", () => {
    for (const bad of [-1, "1", Number.NaN, Infinity])
      expect(readSceneModule({ ...base, limits: { body: { jump: bad } } })).toEqual({
        reason: expect.stringContaining("`limits.body.jump`"),
      });
    expect(readSceneModule({ ...base, limits: { body: { speed: 1 } } })).toEqual({
      reason: expect.stringContaining("`limits.body.speed`"),
    });
    expect(readSceneModule({ ...base, limits: { body: 3 } })).toEqual({
      reason: expect.stringContaining("`limits.body`"),
    });
    expect(readSceneModule({ ...base, limits: [] })).toEqual({
      reason: expect.stringContaining("`limits`"),
    });
  });
});

describe("events with a point", () => {
  it("parse a point after the time, and keep commas inside it", () => {
    expect(parseEvents("click:stage@300(640,360),go@500")).toEqual([
      { name: "click", at: 300, target: "stage", x: 640, y: 360 },
      { name: "go", at: 500 },
    ]);
  });
});
