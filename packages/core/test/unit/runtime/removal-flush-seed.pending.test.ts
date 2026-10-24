// @ts-nocheck
import { describe, expect, it } from "vitest";
import type { ProjectDefinition, TrackDefinition } from "../../../src/contract/v5";
import { createManualClock } from "../../../src/ports/clock";
import { ProjectRuntime } from "../../../src/runtime/project-runtime";

/**
 * Issue #223, finding 4, the reader that is not an edge: a solver reads every member
 * `resolveSolvers` derived onto its `solves`, and no edge points that way.
 *
 * The rig is a real kinematic chain, which needs the built-in solver plugins Phase 5 replaces with
 * tables and declared dependencies. Ported with those, or deleted with the legacy solver.
 */

const compose = (node: { id: string }) => () => ({
  outputs: { values: { node: node.id } },
  sourceProgress: 0,
  sourceRevisions: {},
});

const MOTION = "hero";
const UPPER = "hero/upper";
const LOWER = "hero/lower";
const RIG = "hero/rig";
const RIG_TRACK: TrackDefinition = {
  id: "rig",
  keyframes: { ik: { requires: { root: "root", target: "goal" } } },
};
const UPPER_TRACK: TrackDefinition = {
  id: "upper",
  keyframes: { ik: { requires: { solver: "rig", base: "root" } } },
};
const LOWER_TRACK: TrackDefinition = {
  id: "lower",
  keyframes: { ik: { requires: { solver: "rig", base: "upper" } } },
};
const CHAIN_PROJECT: ProjectDefinition = {
  schemaVersion: 5,
  motions: [
    {
      id: MOTION,
      trigger: { type: "manual" },
      tracks: [{ id: "root" }, { id: "goal" }, RIG_TRACK, UPPER_TRACK, LOWER_TRACK],
    },
  ],
};

function runtimeFor(project: ProjectDefinition): ProjectRuntime {
  return new ProjectRuntime(project, { clock: createManualClock(), compose });
}
function membersOf(runtime: ProjectRuntime, solverId: string): readonly string[] {
  return (runtime.graph.graph.nodeById[solverId]?.solves ?? []).map((member) => member.id);
}

describe("a removal seeds a solver that read the removed chain member", () => {
  it("RA-99 seeds the solver that read a removed chain member", () => {
    const runtime = runtimeFor(CHAIN_PROJECT);
    expect(runtime.dependantsOf(LOWER)).toEqual([RIG]);
    expect(membersOf(runtime, RIG)).toEqual([UPPER, LOWER]);

    const before = runtime.graph.sequence;
    runtime.track(LOWER).remove();

    expect(runtime.tryTrack(LOWER)).toBeUndefined();
    expect(membersOf(runtime, RIG)).toEqual([UPPER]);
    expect(runtime.graph.sequence).toBe(before + 1);

    runtime.dispose();
  });
});
