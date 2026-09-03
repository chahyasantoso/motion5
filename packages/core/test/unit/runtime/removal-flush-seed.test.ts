import { describe, expect, it } from "vitest";
import type { ProjectDefinition, TrackDefinition } from "../../../src/contract/v5";
import { createManualClock } from "../../../src/ports/clock";
import { ProjectRuntime } from "../../../src/runtime/project-runtime";

/**
 * Issue #223, finding 4 of the re-review: what a removal owes the nodes that read it.
 *
 * `#derive` pushes to `touched` for an add and for a replacement and deliberately not for a removal,
 * and `#apply` returns without calling `invalidate` when `touched` is empty. The justification is a
 * claim about `graph/ir.ts`: "a removal's node is gone with nothing left depending on it, because
 * `finalizeGraph` would have refused the candidate otherwise." That claim is load-bearing, because it
 * is the whole reason a removal is allowed to publish nothing, and it is a premise about a file the
 * slice which wrote it did not change. This project's own rule is that a claim about the code is a
 * measurement rather than a premise, so these two cases are the measurement.
 *
 * The answer is that the premise is exactly half right, and the half it misses is the half finding 2
 * already found one member over. `finalizeGraph` walks every edge of every node and refuses a source
 * the candidate does not contain, so every reader that is an **edge** is caught, and `RA-98` is that
 * direction. But a solver reads every member `resolveSolvers` derived onto its `solves`, and no edge
 * points that way. `deriveDependants` names both kinds of reader for exactly that reason. `RA-99` is
 * the reader that is not an edge.
 *
 * `RA-10` in `structural-commit-flush.test.ts` owns that a commit with nothing to seed does not call
 * `invalidate` at all, and its removal has nothing depending on it. `RA-86` through `RA-88` own that
 * the public dependants query reads reverse topology rather than walking edges for it. Neither is
 * restated here: what these add is whether the seed a removal derives agrees with the readers that
 * query already names.
 *
 * The clock is manual and never ticks in either case. A flush that only happened because a frame
 * arrived would prove nothing about the commit.
 */

const compose = (node: { id: string }) => () => ({
  values: { node: node.id },
  sourceProgress: 0,
  sourceRevisions: {},
});

/* RA-98: one ordinary requirement edge between two free tracks, and nothing else. */
const SOURCE = "~/a";
const READER = "~/b";
/**
 * Reads `SOURCE` through a slot this layer holds no opinion about.
 *
 * `chain` rather than `base`, `root`, `solver` or `target`, because those five literals are the ones
 * `resolveSolvers` reads, and this case is about an ordinary dependency rather than a kinematic one.
 * Whether `demo` is registered and declares `chain` is `resolveForKeyframes`' question and no
 * registry is injected here, which is the same posture every other commit-path case in this
 * directory takes.
 */
const READER_TRACK: TrackDefinition = {
  id: "b",
  keyframes: { demo: { requires: { chain: "~/a" } } },
};
const EDGE_PROJECT: ProjectDefinition = {
  schemaVersion: 5,
  motions: [],
  freeTracks: [{ id: "a" }, READER_TRACK],
};

/* RA-99: a real chain, because a chain is the only shape that derives `solves` at all. */
const MOTION = "hero";
const UPPER = "hero/upper";
const LOWER = "hero/lower";
const RIG = "hero/rig";
/**
 * The bare `target` spelling, and it is the whole reason this rig is reachable.
 *
 * Under the goals dict a leaf is addressed by member id, so removing that leaf leaves a goal naming
 * a node the chain no longer holds and `ik-goal-unknown-member` refuses the candidate. The bare slot
 * names no member at all: it addresses whichever node is the single leaf, so a chain that loses its
 * leaf still has exactly one and every rule in `resolveSolvers` still passes. ADR-057 kept this
 * spelling deliberately as the degenerate case of the dict, which is what makes the gap below a
 * shipped shape rather than a contrived one.
 */
const RIG_TRACK: TrackDefinition = {
  id: "rig",
  keyframes: { ik: { requires: { root: "root", target: "goal" } } },
};
const UPPER_TRACK: TrackDefinition = {
  id: "upper",
  keyframes: { ik: { requires: { solver: "rig", base: "root" } } },
};
/** The one chain leaf, and the one node in the rig that nothing names an edge for. */
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
/** The ids a solver currently derives as its chain, in the order the derivation answers. */
function membersOf(runtime: ProjectRuntime, solverId: string): readonly string[] {
  return (runtime.graph.graph.nodeById[solverId]?.solves ?? []).map((member) => member.id);
}

describe("what a removal owes the nodes that read it", () => {
  it("RA-98 refuses a removal whose node is still read through an edge", () => {
    const runtime = runtimeFor(EDGE_PROJECT);
    const before = runtime.graph.sequence;

    // The premise of the case: this is a reader, and the query that answers who reads a node says so.
    expect(runtime.dependantsOf(SOURCE)).toEqual([READER]);

    // Refused, so the empty seed is sound for every reader that is an edge. `finalizeGraph` walks
    // every edge of every node rather than only the observation ones, and a plugin requirement is an
    // edge, so it is caught by the same check. The rule id says "observation" while the edge it
    // refuses is a requirement, which is a diagnostic misnaming what it caught rather than a hole in
    // the refusal; it is a shipped public rule id and is deliberately not renamed here.
    expect(() => runtime.track(SOURCE).remove()).toThrow(/^observation-unknown-source at /);

    // And a refused candidate leaves the removal undone, which is what makes the empty seed correct
    // rather than merely unobserved: there is no committed state for a flush to describe.
    expect(runtime.track(SOURCE).live).toBe(true);
    expect(runtime.graph.sequence).toBe(before);

    runtime.dispose();
  });

  it("RA-99 seeds the solver that read a removed chain member", () => {
    const runtime = runtimeFor(CHAIN_PROJECT);

    // The reader, and the reason it is the one the premise misses. Nothing in the rig names `LOWER`
    // as an edge source: it is read only because `resolveSolvers` derived it onto the solver's
    // `solves`, and `deriveDependants` walks that beside the edges for exactly this case.
    expect(runtime.dependantsOf(LOWER)).toEqual([RIG]);
    expect(membersOf(runtime, RIG)).toEqual([UPPER, LOWER]);

    const before = runtime.graph.sequence;
    runtime.track(LOWER).remove();

    // Accepted, which is the half of the premise that does not hold. Every rule in `resolveSolvers`
    // still passes: the solver keeps a root, keeps a member, and the bare `target` still addresses a
    // single leaf, so no diagnostic refuses the candidate and the commit lands.
    //
    // Read through the probe rather than through `track`, because `track` is the resolver and refuses
    // an id the project no longer holds. A removed node has no handle to answer `live` at all, which
    // is the distinction `tryTrack` exists for.
    expect(runtime.tryTrack(LOWER)).toBeUndefined();
    expect(membersOf(runtime, RIG)).toEqual([UPPER]);

    // So the solver's member set moved underneath it, and it is owed a flush. A removal seeds the
    // nodes that read the removed one, which is the answer `dependantsOf` already gives above, and
    // `RA-10` stays true beside this because a removal nothing depends on still seeds nothing.
    expect(runtime.graph.sequence).toBe(before + 1);

    runtime.dispose();
  });
});
