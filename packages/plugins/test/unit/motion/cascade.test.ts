import { describe, expect, it } from "vitest";
import { Engine, PluginCatalog, createManualClock } from "@motion5/core";
import { createFakeInterpolator, createFakeScheduler } from "@motion5/core/testing";
import { builtinModels } from "@motion5/plugins/models";
import { cascadePlugin } from "@motion5/plugins/motion/cascade";
import { dropPose } from "../../../src/motion/drop";
import { hopPose } from "../../../src/motion/hop";

function load(param: Record<string, number | string>) {
  const handle = new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
    plugins: new PluginCatalog({ models: builtinModels, plugins: [cascadePlugin] }),
  }).load({
    schemaVersion: 5,
    motions: [
      {
        id: "m",
        trigger: { type: "manual" },
        tracks: [{ id: "word", output: { plugin: "cascade" }, input: { param } }],
      },
    ],
  });
  handle.mount("m/word");
  return (progress: number) => {
    handle.seek("m/word", progress);
    const patch = handle.get("m/word");
    if (patch?.status !== "ready") throw new Error(`m/word is ${patch?.status ?? "absent"}`);
    return patch.outputs.values;
  };
}

describe("cascade", () => {
  it("publishes one row per count, named by index", () => {
    const rows = load({ move: "drop", count: 3, distance: 100 })(0);
    expect(Array.isArray(rows) && rows.map(({ id }) => id)).toEqual(["0", "1", "2"]);
  });

  it("runs each row's move, staggered, and rests every row by the end", () => {
    const param = { move: "drop", count: 3, stagger: 0.5, distance: 100, squash: 0.2 };
    const read = load(param);
    // Three rows at 0.5 span 2 row lengths, so at Motion progress 0.5 row 1 has just started.
    expect(read(0.5)).toEqual([
      { id: "0", cells: dropPose(param, 1) },
      { id: "1", cells: dropPose(param, 0.5) },
      { id: "2", cells: dropPose(param, 0) },
    ]);
    const end = read(1);
    expect(Array.isArray(end) && end.map(({ cells }) => cells)).toEqual([
      dropPose(param, 1),
      dropPose(param, 1),
      dropPose(param, 1),
    ]);
  });

  it("runs hops when asked", () => {
    const param = { move: "hop", count: 2, stagger: 0, height: 50, bounces: 1 };
    const row = load(param)(0.3);
    expect(Array.isArray(row) && row[0]?.cells).toEqual(hopPose(param, 0.3).values);
  });

  it("is refused without a count or with a move it does not know", () => {
    expect(() => load({ move: "drop", distance: 1 })).toThrow(/count/);
    expect(() => load({ move: "spin", count: 2 })).toThrow(/move/);
  });
});
