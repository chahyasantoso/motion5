import { describe, expect, it } from "vitest";
import { validateV5 } from "@motion5/core";
import { atProgress } from "@motion5/moves";
import {
  parseEvents,
  readSceneModule,
  sampleScene,
  sceneTimeline,
  type SceneModule,
} from "@motion5/tools/scene";
import { loadBuiltinCatalog, timelineOf } from "@motion5/tools/engine";
import timingBeat from "../../../apps/react-demo/src/timing-beat.json";
import * as timing from "../../../apps/react-demo/src/timing-scene";

function moduleOf(value: unknown): SceneModule {
  const read = readSceneModule(value);
  if ("reason" in read) throw new Error(read.reason);
  return read;
}

describe("scene tools", () => {
  const beat = moduleOf(timing);

  it("sample a scene module with no browser, at times or progress", () => {
    const [atHalf] = sampleScene(beat, { kind: "time", ms: [1500] });
    expect(atHalf?.targets).toEqual(timing.scene(atProgress(0.5)));
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

  it("draw the same timeline for the code scene as for the engine project", async () => {
    const catalog = await loadBuiltinCatalog();
    const project = validateV5(timingBeat, catalog);
    if (project.kind === "refused") throw new Error(JSON.stringify(project.diagnostics));
    const engine = timelineOf(project.value, catalog);
    const code = sceneTimeline(beat);
    if (engine.kind !== "timeline" || code.kind !== "timeline") throw new Error("No timeline.");
    const spans = (rows: typeof code.rows) =>
      rows.map((row) => (row.kind === "moves" ? [row.start, row.rest] : "still"));
    expect(spans(code.rows)).toEqual(spans(engine.rows));
    expect(code.rows.map(({ node }) => node)).toEqual(["letters", "dot", "cover"]);
  });
});

describe("scene tools and events", () => {
  it("read a module's own cues and refuse ones that are not events", async () => {
    const catcher = moduleOf(await import("../../../apps/react-demo/src/catch-scene"));
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
    const card = moduleOf(await import("../../../apps/react-demo/src/card-scene"));
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

describe("events with a point", () => {
  it("parse a point after the time, and keep commas inside it", () => {
    expect(parseEvents("click:stage@300(640,360),go@500")).toEqual([
      { name: "click", at: 300, target: "stage", x: 640, y: 360 },
      { name: "go", at: 500 },
    ]);
  });
});
