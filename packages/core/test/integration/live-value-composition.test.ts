import { describe, expect, it } from "vitest";
import type { ProjectDefinition } from "../../src/contract/v5";
import { PluginRegistry } from "../../src/domain/plugins";
import { Engine, type ProjectHandle } from "../../src/engine";
import { fkPlugin } from "../../src/plugins/fk";
import { ikPlugin } from "../../src/plugins/ik";
import { transformPlugin } from "../../src/plugins/transform";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/testing/fakes";

/**
 * Issue #218, part B of #212. The two surfaces one call has to reach.
 *
 * ADR-051's worked rig, so the numbers are the ones `IK-1` and `IK-13` already pin: root at
 * `200,300`, goal at `320,340`, lengths `80` and `60`, which solves to `40.168` and `-51.318`. A
 * member's `length` reaches the solve only through the publisher's `MemberState`, and that is read
 * from `Track.interpolated()`, so a mask that did not land in that one read cannot move a rotation
 * here at all.
 */
const SHOULDER = "walker/shoulder";
const TARGET = "walker/hand-target";
const SOLVER = "walker/arm-solve";
const UPPER = "walker/upper-arm";
const FOREARM = "walker/forearm";
const NODES = [SHOULDER, TARGET, SOLVER, UPPER, FOREARM] as const;
const PROJECT: ProjectDefinition = {
  schemaVersion: 5,
  motions: [
    {
      id: "walker",
      trigger: { type: "manual" },
      tracks: [
        { id: "shoulder", keyframes: { transform: { values: { x: 200, y: 300, rotation: 0 } } } },
        {
          id: "hand-target",
          keyframes: { transform: { values: { x: 320, y: 340, rotation: 0 } } },
        },
        {
          id: "arm-solve",
          keyframes: { ik: { requires: { root: "shoulder", target: "hand-target" } } },
        },
        {
          id: "upper-arm",
          keyframes: {
            fk: { values: { length: 80 }, requires: { base: "shoulder", solver: "arm-solve" } },
          },
        },
        {
          id: "forearm",
          keyframes: {
            fk: { values: { length: 60 }, requires: { base: "upper-arm", solver: "arm-solve" } },
          },
        },
      ],
    },
  ],
};

function load(): ProjectHandle {
  const plugins = new PluginRegistry();
  plugins.register(transformPlugin);
  plugins.register(fkPlugin);
  plugins.register(ikPlugin);
  const handle = new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
    plugins,
  }).load(PROJECT);
  for (const id of NODES) handle.mount(id);
  handle.seek(SHOULDER, 0);
  return handle;
}
function values(handle: ProjectHandle, id: string): Readonly<Record<string, unknown>> {
  const patch = handle.get(id);
  expect(patch).toBeDefined();
  return patch?.values ?? {};
}
function solved(handle: ProjectHandle): Readonly<Record<string, number>> {
  return values(handle, SOLVER).rotations as Readonly<Record<string, number>>;
}

describe("a masked value reaches composition and the publisher's MemberState", () => {
  it("LV-2 reaches both surfaces from one call", () => {
    const handle = load();
    const before = values(handle, UPPER);
    expect(solved(handle)[UPPER]).toBeCloseTo(40.168, 3);

    handle.track(UPPER).overrideValues({ length: 100 });
    // The solver's own flush. One seam is the whole claim, and `LV-5` owns invalidate-once.
    handle.seek(SHOULDER, 0);

    // Ordinary composition: the bone this mask belongs to composes a different frame.
    expect(values(handle, UPPER)).not.toEqual(before);
    // The publisher-delivered MemberState: the solve read the same 100 and moved.
    expect(solved(handle)[UPPER]).not.toBeCloseTo(40.168, 3);
    // And both agree about it, because the tip still lands on the goal with the longer bone.
    expect(values(handle, FOREARM).x).toBeCloseTo(320, 1);
    expect(values(handle, FOREARM).y).toBeCloseTo(340, 1);
    handle.dispose();
  });

  it("LV-3 makes a dependent IK solver recompute from the masked member", () => {
    const handle = load();
    const rotations = solved(handle);
    expect(rotations[UPPER]).toBeCloseTo(40.168, 3);
    expect(rotations[FOREARM]).toBeCloseTo(-51.318, 3);

    handle.track(FOREARM).overrideValues({ length: 100 });
    handle.seek(SHOULDER, 0);

    // A member's length is an input to the solve, so both published rotations move.
    expect(solved(handle)[UPPER]).not.toBeCloseTo(40.168, 3);
    expect(solved(handle)[FOREARM]).not.toBeCloseTo(-51.318, 3);
    // Recomputed rather than merely different: the tip is on the goal with the new geometry.
    expect(values(handle, FOREARM).x).toBeCloseTo(320, 1);
    expect(values(handle, FOREARM).y).toBeCloseTo(340, 1);
    handle.dispose();
  });
});
