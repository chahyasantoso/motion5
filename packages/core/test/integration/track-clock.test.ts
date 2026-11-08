import { describe, expect, it } from "vitest";
import type { MotionDefinition, PluginDefinition, TriggerDefinition } from "../../src/contract/v5";
import { defineModel } from "../../src/contract/v5";
import { Spec } from "../../src/contract/spec-builder";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/testing/fakes";
import { PluginCatalog } from "../../src/domain/plugin-catalog";
import { testEngine } from "../support/builtin-registry";
import { testModels } from "../support/test-models";

const CLOCK_OUT = defineModel({
  id: "ClockOut",
  spec: Spec.record({ timed: Spec.number(), elapsed: Spec.number(), length: Spec.number() }),
});

const clockProbe: PluginDefinition = {
  id: "clockProbe",
  inputs: {},
  outputs: { values: CLOCK_OUT },
  transform(_input, { clock }) {
    switch (clock.kind) {
      case "timed":
        return { values: { timed: 1, elapsed: clock.elapsed, length: clock.length } };
      case "untimed":
        return { values: { timed: 0, elapsed: 0, length: 0 } };
      default:
        throw new TypeError("unknown clock");
    }
  },
};

function run(trigger: TriggerDefinition, stagger: number, ids: readonly string[]) {
  const clock = createManualClock();
  const scheduler = createFakeScheduler();
  const catalog = new PluginCatalog({ models: [...testModels, CLOCK_OUT], plugins: [clockProbe] });
  const motion: MotionDefinition = {
    id: "m",
    trigger,
    stagger,
    tracks: ids.map((id) => ({ id, output: { plugin: "clockProbe" } })),
  };
  const handle = testEngine({
    clock,
    interpolator: createFakeInterpolator(),
    scheduler,
    plugins: catalog,
  }).load({ schemaVersion: 5, motions: [motion] });
  for (const id of ids) handle.mount(`m/${id}`);
  return (ms: number) => {
    clock.tick(ms);
    scheduler.flush();
    return ids.map((id) => {
      const patch = handle.get(`m/${id}`);
      return patch?.status === "ready" ? patch.outputs.values : undefined;
    });
  };
}

describe("a track's clock", () => {
  it("gives each staggered track the milliseconds of its own window", () => {
    // 1000 ms over three tracks at 0.25 spans 1.5 track lengths: each track lasts 1000 / 1.5 ms.
    const [a, b, c] = run({ type: "time", duration: 1000 }, 0.25, ["a", "b", "c"])(500);
    const length = 1000 / 1.5;
    expect(a).toEqual({
      timed: 1,
      elapsed: expect.closeTo(0.75 * length, 6),
      length: expect.closeTo(length, 6),
    });
    expect(b).toEqual({
      timed: 1,
      elapsed: expect.closeTo(0.5 * length, 6),
      length: expect.closeTo(length, 6),
    });
    expect(c).toEqual({
      timed: 1,
      elapsed: expect.closeTo(0.25 * length, 6),
      length: expect.closeTo(length, 6),
    });
  });

  it("gives every track the whole duration under no stagger", () => {
    expect(run({ type: "time", duration: 800 }, 0, ["a"])(200)).toEqual([
      { timed: 1, elapsed: 200, length: 800 },
    ]);
  });

  it("is untimed under a manual trigger", () => {
    expect(run({ type: "manual" }, 0, ["a"])(200)).toEqual([{ timed: 0, elapsed: 0, length: 0 }]);
  });
});
