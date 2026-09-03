import { describe, expect, it } from "vitest";
import type { ProjectDefinition, TrackDefinition } from "../../../src/contract/v5";
import { createManualClock } from "../../../src/ports/clock";
import { ProjectRuntime } from "../../../src/runtime/project-runtime";

/**
 * Issue #223, finding 2 of the re-review: reverse topology has one owner and two derivations.
 *
 * 7a's whole invariant is that `finalizeGraph` derives `GraphIR.dependents` once per graph, from the
 * walk that already had the solver fan-in in hand, and that every consumer reads it instead of
 * walking for it. `GraphPublisher` reads it. `ProjectRuntime.dependantsOf` does not: it filters
 * `graph.nodes` on `node.edges.some((edge) => edge.sourceId === nodeId)`, one property access away
 * from the frozen answer.
 *
 * That is not only a duplicate, it is a weaker one, and that is the part these cases are about.
 * `deriveDependents` names both kinds of reader, because only one of them is an edge: a node reads
 * every source it names an edge for, and a solver reads every member `resolveSolvers` derived onto
 * its `solves`, which no edge points at. A reverse walk over edges alone misses every member of
 * every chain, so for any solver in the project the two mechanisms answer one question differently
 * and the surviving one is the mechanism that cannot see half the graph.
 *
 * The rig is a real chain rather than a goals-only group, because a chain is the only shape that
 * derives `solves` at all: `rig` binds a root and two members bind it as their solver, `upper` hangs
 * off the root and `lower` off `upper`, so `lower` is the one chain leaf and the goals dict
 * addresses it by member id. `plugin-group-edit.test.ts` deliberately avoids being a valid chain
 * because what it pins is the authored record; this file cannot, because what it pins is the
 * derivation.
 *
 * No `PluginRegistry` and no compile hooks, on the same reading: whether `ik` is registered and
 * declares these slots is `resolveForKeyframes`' question, and every fact below belongs to the layer
 * that owns the committed graph. The clock is manual and never ticks, so nothing here is answered by
 * a flush.
 */

const MOTION = "hero";
const ROOT = "hero/root";
const GOAL = "hero/goal";
const UPPER = "hero/upper";
const LOWER = "hero/lower";
const RIG = "hero/rig";
const SPARE = "hero/spare";

/** The chain base, and the node the solver binds as its root. */
const ROOT_TRACK: TrackDefinition = { id: "root" };
/** The frame the one leaf reaches toward. Read through the goals dict, never as a member. */
const GOAL_TRACK: TrackDefinition = { id: "goal" };
const UPPER_TRACK: TrackDefinition = {
  id: "upper",
  keyframes: { ik: { requires: { solver: "rig", base: "root" } } },
};
/**
 * The leaf, and the one node that reads a source twice.
 *
 * `chain` is an ordinary slot this layer holds no opinion about, bound to the same node `base`
 * already names. Two slots are two dependencies and stay two edges, which is what `memberKey` and
 * `requirementIdentity` buy; whether that is one dependant or two is this query's question, and
 * `RA-87` is where it is answered.
 */
const LOWER_TRACK: TrackDefinition = {
  id: "lower",
  keyframes: { ik: { requires: { solver: "rig", base: "upper", chain: "upper" } } },
};
const RIG_TRACK: TrackDefinition = {
  id: "rig",
  keyframes: { ik: { requires: { root: "root", targets: { lower: "goal" } } } },
};
/** Read by nothing at all, so the total map's empty entry has something to answer for. */
const SPARE_TRACK: TrackDefinition = { id: "spare" };
const PROJECT: ProjectDefinition = {
  schemaVersion: 5,
  motions: [
    {
      id: MOTION,
      trigger: { type: "manual" },
      tracks: [ROOT_TRACK, GOAL_TRACK, UPPER_TRACK, LOWER_TRACK, RIG_TRACK, SPARE_TRACK],
    },
  ],
};
const compose = (node: { id: string }) => () => ({
  values: { node: node.id },
  sourceProgress: 0,
  sourceRevisions: {},
});

function runtime(): ProjectRuntime {
  return new ProjectRuntime(PROJECT, { clock: createManualClock(), compose });
}
/** Returns the thrown value, because each case asserts on more than one facet of it. */
function thrownBy(operation: () => unknown): unknown {
  try {
    operation();
  } catch (error) {
    return error;
  }
  throw new Error("Expected the operation to throw.");
}

describe("one owner of reverse topology, read rather than rederived", () => {
  it("RA-86 names the solver that reads a node as a chain member", () => {
    const project = runtime();

    // The derivation says so, and it is the one this project already ships: `resolveSolvers` puts
    // both members on the solver's `solves`, and `deriveDependents` walks that beside the edges for
    // exactly this reason. A member's own value marks its solver dirty, so a caller asking who reads
    // this node before deleting it is owed the solver.
    expect(project.graph.graph.dependents[UPPER]).toContain(RIG);
    expect(project.graph.graph.dependents[LOWER]).toEqual([RIG]);

    // The public query has to agree with it. An edge walk answers `[LOWER]` here and `[]` below,
    // which is a preflight telling an editor that deleting the leaf of a live chain breaks nothing.
    expect(project.dependantsOf(UPPER)).toEqual([LOWER, RIG]);
    expect(project.dependantsOf(LOWER)).toEqual([RIG]);

    project.dispose();
  });

  it("RA-87 counts a reader that names one source twice as one dependant", () => {
    const project = runtime();

    // The derivation keeps a reader once per dependency, deliberately: a consumer walking it guards
    // on its own visited set, and collapsing duplicates there would be a second decision inside a
    // function whose only job is to state what the graph says. This query answers a set of readers,
    // so the collapse belongs here and nowhere else.
    expect(project.graph.graph.dependents[UPPER]).toEqual([LOWER, LOWER, RIG]);

    const readers = project.dependantsOf(UPPER);

    expect(readers).toEqual([LOWER, RIG]);
    expect(readers.filter((id) => id === LOWER)).toHaveLength(1);
    // First occurrence wins, which is the node order the edge walk this replaces produced. Order is
    // a pure function of the graph either way, and a caller listing dependants in a dialog reads it.
    expect([...readers]).toEqual([...readers].slice().sort((a, b) => (a < b ? -1 : 1)));
    expect(Object.isFrozen(readers)).toBe(true);

    project.dispose();
  });

  it("RA-88 answers an ordinary edge, an unread node and an unknown id exactly as before", () => {
    const project = runtime();

    // The equivalence half, green on purpose. Reading the frozen map may not move any answer an edge
    // walk already got right, or this slice is a rule change wearing a refactor's clothes.
    expect(project.dependantsOf(ROOT)).toEqual([UPPER, RIG]);
    expect(project.dependantsOf(RIG)).toEqual([UPPER, LOWER]);
    expect(project.dependantsOf(GOAL)).toEqual([RIG]);
    // Total, so a node nothing reads is an empty list rather than a missing entry, and an id the
    // project never had is the same empty answer rather than a throw: this is a preflight query, and
    // refusing an unknown id would make an editor ask twice.
    expect(project.dependantsOf(SPARE)).toEqual([]);
    expect(project.dependantsOf("hero/never")).toEqual([]);

    project.dispose();

    // And it is still a live-project read. `#assertLive` stays ahead of the map, because a disposed
    // runtime has no committed graph to answer from.
    expect(thrownBy(() => project.dependantsOf(ROOT))).toBeInstanceOf(TypeError);
  });
});
