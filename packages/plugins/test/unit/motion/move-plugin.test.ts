import { describe, expect, it } from "vitest";
import { Engine, PluginCatalog, createManualClock, type TrackDefinition } from "@motion5/core";
import { createFakeInterpolator, createFakeScheduler } from "@motion5/core/testing";
import { atProgress, drop, hop, rope, window, wipe } from "@motion5/moves";
import { builtinModels } from "@motion5/plugins/models";
import { dropPlugin } from "@motion5/plugins/motion/drop";
import { hopPlugin } from "@motion5/plugins/motion/hop";
import { ropePlugin } from "@motion5/plugins/motion/rope";
import { wipePlugin } from "@motion5/plugins/motion/wipe";
import { spriteCells } from "../../../src/motion/move-plugin";

type Param = Readonly<Record<string, number | string>>;
type NumberParam = Readonly<Record<string, number>>;
type Row = { readonly id: string; readonly cells: { readonly x: number; readonly y: number } };

function engineOutputs(
  plugin: "hop" | "drop" | "wipe" | "rope",
  param: Param,
  progress: number,
  values?: readonly Row[],
) {
  const track: TrackDefinition = {
    id: "t",
    output: { plugin },
    input: values === undefined ? { param } : { param, values },
  };
  const handle = new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
    plugins: new PluginCatalog({
      models: builtinModels,
      plugins: [hopPlugin, dropPlugin, wipePlugin, ropePlugin],
    }),
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
  const hops: readonly NumberParam[] = [
    { height: 400, bounces: 1, decay: 0.25, squash: 0.4 },
    { height: 120, bounces: 0 },
    { height: 300, bounces: 3, decay: 0.6, squash: 0.2, dx: 80 },
    { height: 200, bounces: 2, from: 0.2, to: 0.8 },
  ];
  const drops: readonly NumberParam[] = [
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

  it.each([
    { radius: 200, x: 10, y: 20 },
    { radius: 80, x: 0, y: 0, from: 0.25, to: 0.75 },
  ])("wipe %j publishes its reveal as a clip path", (param) => {
    for (const progress of PROGRESS) {
      const { x, y, radius } = wipe(
        wipe.read(param),
        window(atProgress(progress), param.from ?? 0, param.to ?? 1),
      );
      expect(engineOutputs("wipe", param, progress)).toEqual({
        values: { clipPath: `circle(${radius}px at ${x}px ${y}px)` },
      });
    }
  });

  it.each([{}, { angle: 90, pin: "end", release: "free", overshoot: 0.2, ripple: 0.3 }])(
    "rope %j publishes its anchors from the track's points",
    (param) => {
      const rows: readonly Row[] = [
        { id: "a", cells: { x: 0, y: 0 } },
        { id: "b", cells: { x: 0, y: 100 } },
        { id: "c", cells: { x: 100, y: 120 } },
      ];
      const points = rows.map(({ id, cells }) => ({ id, ...cells }));
      for (const progress of PROGRESS) {
        const anchors = rope(rope.read(param), atProgress(progress), { points });
        expect(engineOutputs("rope", param, progress, rows)).toEqual({
          values: anchors.map(({ id, ...cells }) => ({ id, cells })),
        });
      }
    },
  );

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
