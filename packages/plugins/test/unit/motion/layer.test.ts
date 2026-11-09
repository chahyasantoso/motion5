import { describe, expect, it } from "vitest";
import { Engine, PluginCatalog, createManualClock, type TrackDefinition } from "@motion5/core";
import { createFakeInterpolator, createFakeScheduler } from "@motion5/core/testing";
import { builtinModels } from "@motion5/plugins/models";
import { dropPlugin } from "@motion5/plugins/motion/drop";
import { hopPlugin } from "@motion5/plugins/motion/hop";
import { layerPlugin } from "@motion5/plugins/motion/layer";

function load(tracks: readonly TrackDefinition[]) {
  const handle = new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
    plugins: new PluginCatalog({
      models: builtinModels,
      plugins: [dropPlugin, hopPlugin, layerPlugin],
    }),
  }).load({ schemaVersion: 5, motions: [{ id: "m", trigger: { type: "manual" }, tracks }] });
  for (const { id } of tracks) handle.mount(`m/${id}`);
  return (progress: number) => {
    for (const { id } of tracks) handle.seek(`m/${id}`, progress);
    const patch = handle.get("m/both");
    if (patch?.status !== "ready") throw new Error(`m/both is ${patch?.status ?? "absent"}`);
    return patch.outputs.values;
  };
}

const both: TrackDefinition = {
  id: "both",
  output: { plugin: "layer" },
  input: { requires: { moves: { first: "a", second: "b" } } },
};

describe("layer", () => {
  it("adds offsets, multiplies scales and opacity, and keeps the first pivot", () => {
    const read = load([
      {
        id: "a",
        output: { model: "Sprite2d" },
        input: { values: { x: 10, scaleY: 0.5, transformOrigin: "50% 100%" } },
      },
      {
        id: "b",
        output: { model: "Sprite2d" },
        input: { values: { x: 5, y: 3, scaleY: 0.8, opacity: 0.5, transformOrigin: "0 0" } },
      },
      both,
    ]);
    expect(read(0)).toEqual({
      x: 15,
      y: 3,
      scaleY: 0.4,
      opacity: 0.5,
      transformOrigin: "50% 100%",
    });
  });

  it("combines two moves frame by frame: a drop with a hop on top lands where both rest", () => {
    const read = load([
      { id: "a", output: { plugin: "drop" }, input: { param: { distance: 300 } } },
      { id: "b", output: { plugin: "hop" }, input: { param: { height: 40, bounces: 1 } } },
      both,
    ]);
    expect(read(0)).toMatchObject({ y: -300 });
    expect(read(1)).toMatchObject({ x: 0, y: 0, scaleX: 1, scaleY: 1 });
  });
});
