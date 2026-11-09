import { describe, expect, it } from "vitest";
import type { MotionDefinition } from "../../src/contract/v5";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/testing/fakes";
import { testEngine } from "../support/builtin-registry";

function ramp(id: string) {
  return {
    id,
    output: { model: "TestRecord" },
    input: {
      values: {
        x: [
          { p: 0, v: 0 },
          { p: 1, v: 100 },
        ],
      },
    },
  };
}

function run(stagger: number, ids: readonly string[]) {
  const clock = createManualClock();
  const scheduler = createFakeScheduler();
  const motion: MotionDefinition = {
    id: "m",
    trigger: { type: "time", duration: 1000 },
    stagger,
    tracks: ids.map(ramp),
  };
  const handle = testEngine({
    clock,
    interpolator: createFakeInterpolator(),
    scheduler,
  }).load({ schemaVersion: 5, motions: [motion] });
  for (const id of ids) handle.mount(`m/${id}`);
  const progressAt = (ms: number): readonly number[] => {
    clock.tick(ms);
    scheduler.flush();
    return ids.map((id) => {
      const patch = handle.get(`m/${id}`);
      return patch?.status === "ready" ? patch.sourceProgress : -1;
    });
  };
  return progressAt;
}

describe("Motion stagger", () => {
  it("finishes every track at the end of the Motion", () => {
    expect(run(0.25, ["a", "b", "c"])(1000)).toEqual([1, 1, 1]);
  });

  it("starts each track one stagger of a track's length after the last", () => {
    // Three tracks at 0.25 span 1.5 track lengths, so each lasts 2/3 of the Motion.
    const advance = run(0.25, ["a", "b", "c"]);
    const [a, b, c] = advance(500);
    expect(a).toBeCloseTo(0.75, 10);
    expect(b).toBeCloseTo(0.5, 10);
    expect(c).toBeCloseTo(0.25, 10);
  });

  it("runs tracks one after another at 1, with no refusal above it", () => {
    const sequential = run(1, ["a", "b"]);
    expect(sequential(500)).toEqual([1, 0]);
    const spaced = run(3, ["a", "b"]);
    expect(spaced(600)[1]).toBe(0);
    expect(spaced(400)).toEqual([1, 1]);
  });

  it("keeps a zero stagger on the Motion's own position", () => {
    expect(run(0, ["a", "b"])(500)).toEqual([0.5, 0.5]);
  });

  it("is monotonic for every track across a pass", () => {
    const advance = run(0.5, ["a", "b", "c"]);
    let previous = [0, 0, 0];
    for (let step = 0; step < 20; step += 1) {
      const next = advance(50);
      next.forEach((value, index) => expect(value).toBeGreaterThanOrEqual(previous[index] ?? 0));
      previous = [...next];
    }
    expect(previous).toEqual([1, 1, 1]);
  });
});
