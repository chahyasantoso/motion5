import { describe, expect, it } from "vitest";
import { Engine, PluginCatalog, createManualClock, type TrackDefinition } from "@motion5/core";
import { createFakeInterpolator, createFakeScheduler } from "@motion5/core/testing";
import { atProgress, drop, hop, window } from "@motion5/moves";
import { builtinModels } from "@motion5/plugins/models";
import { dropPlugin } from "@motion5/plugins/motion/drop";
import { hopPlugin } from "@motion5/plugins/motion/hop";
import { spriteCells } from "../../../src/motion/move-plugin";

type Param = Readonly<Record<string, number>>;

function engineOutputs(plugin: "hop" | "drop", param: Param, progress: number) {
  const track: TrackDefinition = { id: "t", output: { plugin }, input: { param } };
  const handle = new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
    plugins: new PluginCatalog({ models: builtinModels, plugins: [hopPlugin, dropPlugin] }),
  }).load({
    schemaVersion: 5,
    motions: [{ id: "m", trigger: { type: "manual" }, tracks: [track] }],
  });
  handle.mount("m/t");
  handle.seek("m/t", progress);
  const current = handle.get("m/t");
  if (current?.status !== "ready") throw new Error(`m/t is ${current?.status ?? "absent"}`);
  return current.outputs;
}

const PROGRESS = [0, 0.1, 0.25, 0.4, 4 / 7, 0.6, 0.75, 6 / 7, 0.95, 1];

describe("a move plugin and its move", () => {
  const hops: readonly Param[] = [
    { height: 400, bounces: 1, decay: 0.25, squash: 0.4 },
    { height: 120, bounces: 0 },
    { height: 300, bounces: 3, decay: 0.6, squash: 0.2, dx: 80 },
    { height: 200, bounces: 2, from: 0.2, to: 0.8 },
  ];
  const drops: readonly Param[] = [
    { distance: 300 },
    { distance: 120, squash: 0.5 },
    { distance: 200, squash: 0.25, from: 0.5, to: 1 },
  ];

  it.each(hops)("hop %j publishes what the move returns", (param) => {
    for (const progress of PROGRESS) {
      const time = window(atProgress(progress), param.from ?? 0, param.to ?? 1);
      const { contact, ...pose } = hop(hop.read(param), time);
      expect(engineOutputs("hop", param, progress)).toEqual({
        values: spriteCells(pose),
        contact,
      });
    }
  });

  it.each(drops)("drop %j publishes what the move returns", (param) => {
    for (const progress of PROGRESS) {
      const time = window(atProgress(progress), param.from ?? 0, param.to ?? 1);
      expect(engineOutputs("drop", param, progress)).toEqual({
        values: spriteCells(drop(drop.read(param), time)),
      });
    }
  });

  it("declares the move's options as the plugin's param, with a window", () => {
    expect(Object.keys(hopPlugin.inputs.param?.fields ?? {}).sort()).toEqual(
      ["bounces", "decay", "dx", "from", "height", "squash", "to"].sort(),
    );
    expect(hopPlugin.inputs.param?.fields.height?.optional).toBeUndefined();
    expect(hopPlugin.inputs.param?.fields.decay?.optional).toBe(true);
  });
});

describe("spriteCells", () => {
  it("writes the anchor as a transform origin and keeps only pose fields", () => {
    expect(spriteCells({ x: 1, scaleY: 0.5, anchor: "bottom" })).toEqual({
      x: 1,
      scaleY: 0.5,
      transformOrigin: "50% 100%",
    });
    expect(spriteCells({ y: 2 })).toEqual({ y: 2 });
  });
});
