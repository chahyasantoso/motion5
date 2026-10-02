import { describe, expect, it } from "vitest";
import { createGapPipeline, type GapPipeline } from "../src/filler/pipeline";
import { createLiveRig } from "../src/live/live-rig";
import type { RigSolver } from "../src/rig/solver";

/** A solver that only counts: which ones were built and which were disposed, in order. */
function counting() {
  const built: RigSolver[] = [];
  const disposed: RigSolver[] = [];
  const createSolver = (): RigSolver => {
    const solver: RigSolver = {
      solve: () => new Map(),
      dispose: () => disposed.push(solver),
    };
    built.push(solver);
    return solver;
  };
  const pipelines: GapPipeline[] = [];
  const createImageTrust = () => {
    const pipeline = createGapPipeline({ filler: { kind: "raw" } });
    pipelines.push(pipeline);
    return pipeline;
  };
  return { built, disposed, pipelines, createSolver, createImageTrust };
}

describe("live rig lifecycle", () => {
  it("GF-69 restarts rig and image half together and never builds a rig after disposal", () => {
    const probe = counting();
    const rig = createLiveRig(probe.createSolver, probe.createImageTrust);
    expect(rig.solver).toBe(probe.built[0]);
    expect(rig.imageTrust).toBe(probe.pipelines[0]);
    rig.restart();
    // The fresh rig replaces the old one, which is released, and the image half restarts with it.
    expect(probe.built).toHaveLength(2);
    expect(probe.disposed).toEqual([probe.built[0]]);
    expect(rig.solver).toBe(probe.built[1]);
    expect(rig.imageTrust).toBe(probe.pipelines[1]);
    rig.dispose();
    expect(probe.disposed).toEqual([probe.built[0], probe.built[1]]);
    // A calibration read resolving after pagehide restarts nothing, so nothing leaks undisposed.
    rig.restart();
    rig.dispose();
    expect(probe.built).toHaveLength(2);
    expect(probe.pipelines).toHaveLength(2);
    expect(probe.disposed).toHaveLength(2);
  });
});
