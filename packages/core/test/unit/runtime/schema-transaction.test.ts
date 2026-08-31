import { describe, expect, it } from "vitest";
import type {
  MotionDefinition,
  ProjectDefinition,
  TrackDefinition,
} from "../../../src/contract/v5";
import type { MotionHandle } from "../../../src/contract/motion-handle";
import type { TrackHandle } from "../../../src/contract/track-handle";
import { IncrementalGraphBuilder } from "../../../src/adapters/graph-builder/incremental";
import { createManualClock } from "../../../src/ports/clock";
import {
  ProjectRuntime,
  type ProjectRuntimeOptions,
  type StagedTrack,
} from "../../../src/runtime/project-runtime";

/**
 * Issue #223, slice D.
 *
 * `edit(recipe)` is the verb the issue says has no vocabulary: build a project's structure up
 * incrementally from nothing, driven by runtime code, with each step individually correct and the
 * whole thing committed once. `n` ops across `m` tracks cost one candidate build, one
 * `GraphBinding.replace`, one `ObservationState.commit` and one flush, and a throw inside the recipe
 * commits nothing at all.
 *
 * These cases own how many transactions a sequence of authored ops runs, and what one recipe sees of
 * itself while it is open. `RA-1` through `RA-7` own the order one transaction applies and reverts
 * its hooks and `RA-8` through `RA-13` own the flush it seeds; nothing here restates either. What is
 * new is that a commit can now carry more than one change, which is the first thing that can tell a
 * derived hook list from an accumulated one.
 *
 * `RA-65` is that case, and it is the reason the derivation travels with this slice rather than ahead
 * of it: before a recipe exists, every commit carries exactly one change, so a per-entry-point hook
 * list and a derived one are indistinguishable and a refactor shipped alone would have had no
 * evidence of its own to ship with.
 *
 * The clock is manual and never ticks. A flush that only happened because a frame arrived would
 * prove nothing about a commit.
 */

const MOTION_ID = "hero";
const ARM_ID = "hero/arm";
const LEG_ID = "hero/leg";
const HAND_ID = "hero/hand";
const FOOT_ID = "hero/foot";
const CAPE_ID = "villain/cape";
const VILLAIN: MotionDefinition = { id: "villain", trigger: { type: "manual" }, tracks: [] };
const PROJECT: ProjectDefinition = {
  schemaVersion: 5,
  motions: [{ id: MOTION_ID, trigger: { type: "manual" }, tracks: [{ id: "arm" }, { id: "leg" }] }],
};
/** One key per node, so a shared key cannot hide a missing publication behind an output merge. */
const compose = (node: { id: string }) => () => ({
  values: { [node.id]: 1 },
  sourceProgress: 0,
  sourceRevisions: {},
});

/**
 * The two members this slice adds, declared locally because they do not exist yet.
 *
 * A test file naming a member the source has not landed fails `typecheck` and stops `quality` before
 * `npm test`, which is a broken file rather than evidence. `StaleSeam`, `ComposeSeam`, `TierZeroEdits`,
 * `RequireEdits`, `GroupEdits` and `ResolveSeam` are the precedent, and the commit that lands the
 * source deletes this declaration rather than restating it.
 *
 * Narrowed to what the cases below actually reach. The shipped interface is wider; a local seam that
 * restated all of it would be a second author of the contract.
 */
interface TransactionSeam {
  addMotion(definition: MotionDefinition): MotionHandle;
  motion(motionId: string): MotionHandle;
  addTrack(track: TrackDefinition, options?: { motionId?: string }): TrackHandle;
  track(nodeId: string): TrackHandle;
  tryTrack(nodeId: string): TrackHandle | undefined;
}
interface EditSeam {
  edit<T>(recipe: (tx: TransactionSeam) => T): T;
}
/**
 * The seam, asserted before it is cast.
 *
 * A cast alone would make every case below fail with "edit is not a function", which is a call that
 * could not run rather than an assertion that disagreed, and failing-first means failing assertions.
 * `RA-16` asserts a member is gone the same way and `RA-27` asserts a spelling the same way; this is
 * the mirror of both.
 */
function editing(runtime: ProjectRuntime): EditSeam {
  const candidate = runtime as unknown as Partial<EditSeam>;
  expect(typeof candidate.edit).toBe("function");
  return candidate as EditSeam;
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

interface Rig {
  readonly runtime: ProjectRuntime;
  readonly journal: readonly string[];
  readonly builds: number;
  readonly sequence: number;
  readonly graph: object;
}
/**
 * One runtime, one ordered journal across every hook a commit can reach, and one build counter.
 *
 * The journal is ordered rather than counted because `RA-65`'s whole subject is which hook ran and
 * in what order, and two counters cannot tell an add followed by a replace from an add alone. The
 * build counter wraps the real `IncrementalGraphBuilder` rather than replacing it, so the number it
 * reports is the number of candidate graphs this runtime actually derived.
 */
function rig(): Rig {
  const entries: string[] = [];
  const record = (line: string): void => {
    entries.push(line);
  };
  const inner = new IncrementalGraphBuilder();
  let builds = 0;
  const staged = (nodeId: string): StagedTrack => ({
    commit: () => record(`stage-commit ${nodeId}`),
    rollback: () => record(`stage-rollback ${nodeId}`),
  });
  const options: ProjectRuntimeOptions = {
    clock: createManualClock(),
    compose,
    graphBuilder: {
      build: (project) => {
        builds += 1;
        return inner.build(project);
      },
    },
    compileTrack: (track, nodeId) => record(`compile ${String(nodeId)} ${String(track.duration)}`),
    disposeTrack: (nodeId) => record(`dispose ${nodeId}`),
    stageTrack: (track, nodeId) => {
      record(`stage ${nodeId} ${String(track.duration)}`);
      return staged(nodeId);
    },
    addMotionTrack: (_motionId, trackId, duration) =>
      record(`motion-add ${trackId} ${String(duration)}`),
    replaceMotionTrack: (_motionId, trackId, duration) =>
      record(`motion-replace ${trackId} ${String(duration)}`),
    removeMotionTrack: (_motionId, trackId) => record(`motion-remove ${trackId}`),
    createMotion: (definition) => record(`motion-create ${definition.id}`),
    destroyMotion: (motionId) => record(`motion-destroy ${motionId}`),
    setMotionStagger: (motionId, stagger) =>
      record(`motion-stagger ${motionId} ${String(stagger)}`),
  };
  const runtime = new ProjectRuntime(PROJECT, options);
  return {
    runtime,
    get journal() {
      return [...entries];
    },
    get builds() {
      return builds;
    },
    get sequence() {
      return runtime.graph.sequence;
    },
    get graph() {
      return runtime.graph.graph;
    },
  };
}

describe("one recipe is one transaction", () => {
  it("RA-62 collapses many ops across many tracks into one candidate build and one flush", () => {
    const test = rig();
    test.runtime.mount(ARM_ID);
    const builds = test.builds;
    const sequence = test.sequence;

    editing(test.runtime).edit((tx) => {
      const villain = tx.addMotion(VILLAIN);
      villain.addTrack({ id: "cape" });
      tx.addTrack({ id: "hand" }, { motionId: MOTION_ID });
      tx.track(LEG_ID).addObserve({ source: ARM_ID });
      tx.track(ARM_ID).replace({ id: "arm", duration: 250 });
    });

    // Five ops over three tracks and one motion. Today each of them is a whole transaction, which
    // is the actual reason the issue says there is no vocabulary for building a structure up.
    expect(test.builds).toBe(builds + 1);
    expect(test.sequence).toBe(sequence + 1);

    // And it committed all five, which is what stops the case from being green against an edit that
    // silently drops everything after the first op.
    expect(test.runtime.motion("villain").trackIds).toEqual([CAPE_ID]);
    expect(test.runtime.track(CAPE_ID).live).toBe(true);
    expect(test.runtime.track(HAND_ID).live).toBe(true);
    expect(test.runtime.track(LEG_ID).definition.observes).toEqual([{ source: ARM_ID }]);
    expect(test.runtime.track(ARM_ID).definition.duration).toBe(250);

    test.runtime.dispose();
  });

  it("RA-63 commits nothing when the recipe throws, and issues no live handle", () => {
    const test = rig();
    const graph = test.graph;
    const builds = test.builds;
    const sequence = test.sequence;
    const leg = test.runtime.track(LEG_ID).definition;
    const refusal = new Error("The recipe changed its mind.");
    let escaped: TrackHandle | undefined;

    const thrown = thrownBy(() =>
      editing(test.runtime).edit((tx) => {
        escaped = tx.addTrack({ id: "hand" }, { motionId: MOTION_ID });
        tx.track(LEG_ID).addObserve({ source: ARM_ID });
        tx.addMotion(VILLAIN);
        throw refusal;
      }),
    );

    // Verbatim, not wrapped: the recipe's own failure is the reason the caller can act on.
    expect(thrown).toBe(refusal);
    // Nothing was applied, so there is nothing to revert and no hook was reached at all. This is the
    // half that comes free from A1: an effect is only applied by #commit.
    expect(test.journal).toEqual([]);
    expect(test.builds).toBe(builds);
    expect(test.sequence).toBe(sequence);
    expect(test.graph).toBe(graph);
    // The handle was issued inside the recipe and its token was never registered, so it answers the
    // question every handle answers without throwing, and answers it false.
    expect(escaped?.live).toBe(false);
    expect(() => test.runtime.track(HAND_ID)).toThrow(/Unknown graph node "hero\/hand"/);
    expect(() => test.runtime.motion("villain")).toThrow(/Unknown motion "villain"/);
    // Identity, because a plan that rebuilt an untouched entry is exactly what costs the incremental
    // builder its cache hit, and deep equality cannot see the difference. See ADR-058.
    expect(test.runtime.track(LEG_ID).definition).toBe(leg);

    test.runtime.dispose();
  });

  it("RA-64 resolves a read inside the recipe against the staged plan", () => {
    const test = rig();

    editing(test.runtime).edit((tx) => {
      const hand = tx.addTrack({ id: "hand", duration: 100 }, { motionId: MOTION_ID });

      // A two-step edit sees its own first step, or "each step individually correct" is a claim
      // about a step that cannot read what the step before it wrote.
      expect(hand.live).toBe(true);
      expect(tx.tryTrack(HAND_ID)).toBeDefined();
      expect(tx.track(HAND_ID).definition).toBe(hand.definition);
      expect(tx.motion(MOTION_ID).trackIds).toEqual([ARM_ID, LEG_ID, HAND_ID]);

      tx.track(HAND_ID).addObserve({ source: ARM_ID });
      expect(tx.track(HAND_ID).definition.observes).toEqual([{ source: ARM_ID }]);

      tx.track(HAND_ID).replace({ id: "hand", duration: 250, observes: [{ source: ARM_ID }] });
      expect(tx.track(HAND_ID).definition.duration).toBe(250);
    });

    // And the committed graph is what the last step staged rather than what the first one did.
    expect(test.runtime.track(HAND_ID).definition).toEqual({
      id: "hand",
      duration: 250,
      observes: [{ source: ARM_ID }],
    });
    expect(test.runtime.graph.graph.nodes.map((node) => node.id)).toContain(HAND_ID);

    test.runtime.dispose();
  });

  it("RA-65 registers a track added and then edited in one recipe with its Motion once", () => {
    const test = rig();

    editing(test.runtime).edit((tx) => {
      tx.addTrack({ id: "hand", duration: 100 }, { motionId: MOTION_ID });
      tx.track(HAND_ID).replace({ id: "hand", duration: 250 });
      tx.track(HAND_ID).addObserve({ source: ARM_ID });
    });

    // Three ops on one node, and the hooks are what one add costs rather than what three ops
    // accumulate. A per-op hook list would put a replaceMotionTrack in the effects and the
    // addMotionTrack in the settle steps, and effects run first, so the Motion would be asked to
    // replace a track it has not been told about yet. The order is also the one `RA-3` pins: the
    // compile before the registration, because Motion resolves by id against the live compiled map.
    expect(test.journal).toEqual(["compile hero/hand 250", "motion-add hero/hand 250"]);
    // Named rather than implied by the list above, because these two are what would appear if the
    // hooks were accumulated, and a reader has to be able to see which fact is on trial.
    expect(test.journal.filter((line) => line.startsWith("motion-replace"))).toEqual([]);
    expect(test.journal.filter((line) => line.startsWith("stage "))).toEqual([]);
    // The compile was handed the definition the recipe ends on, not the one it opened with.
    expect(test.runtime.track(HAND_ID).definition).toEqual({
      id: "hand",
      duration: 250,
      observes: [{ source: ARM_ID }],
    });
    expect(test.runtime.instanceCount).toBe(1);

    test.runtime.dispose();
  });

  it("RA-66 returns the recipe's answer and commits nothing when nothing changed", () => {
    const test = rig();
    test.runtime.track(LEG_ID).addObserve({ source: ARM_ID });
    const graph = test.graph;
    const builds = test.builds;
    const sequence = test.sequence;
    const journal = test.journal;

    const answer = editing(test.runtime).edit((tx) => {
      // Both no-ops on this tier's idempotence rule: a redundant add and an absent remove.
      tx.track(LEG_ID).addObserve({ source: ARM_ID });
      tx.track(LEG_ID).removeObserve({ source: FOOT_ID });
      return tx.tryTrack(HAND_ID);
    });

    // The recipe's value is the caller's, which is what makes `edit` usable for a lookup that
    // happens to make no change.
    expect(answer).toBeUndefined();
    // A recipe that staged nothing must not spend a candidate build or a frame's worth of flush
    // machinery saying so, on exactly the rule `RA-10` states for a commit that derives no node.
    expect(test.builds).toBe(builds);
    expect(test.sequence).toBe(sequence);
    expect(test.graph).toBe(graph);
    expect(test.journal).toEqual(journal);

    test.runtime.dispose();
  });

  it("RA-67 refuses a recipe opened inside a recipe and leaves the surface usable", () => {
    const test = rig();

    const thrown = thrownBy(() =>
      editing(test.runtime).edit((tx) => {
        tx.addTrack({ id: "hand" }, { motionId: MOTION_ID });
        editing(test.runtime).edit(() => undefined);
      }),
    );

    // Refused rather than joined. A nested recipe that silently joined the open one would return
    // before anything it asked for had committed, so a helper's cost and guarantees would depend on
    // whether something above it had opened a transaction, which is the invisible context this
    // project has declined to build several times.
    expect(thrown).toBeInstanceOf(TypeError);
    expect((thrown as Error).message).toMatch(/^schema-transaction-nested: /);
    expect(test.journal).toEqual([]);
    expect(() => test.runtime.track(HAND_ID)).toThrow(/Unknown graph node "hero\/hand"/);

    // The accepting direction, in the same rig, because a verb that refuses everything is green
    // against the refusal alone: a recipe after a recipe is two transactions, not a wedged surface.
    editing(test.runtime).edit((tx) => tx.addTrack({ id: "hand" }, { motionId: MOTION_ID }));
    editing(test.runtime).edit((tx) => tx.addTrack({ id: "foot" }, { motionId: MOTION_ID }));

    expect(test.runtime.track(HAND_ID).live).toBe(true);
    expect(test.runtime.track(FOOT_ID).live).toBe(true);

    test.runtime.dispose();
  });

  it("RA-68 refuses an edit that applies immediately from inside a recipe", () => {
    const test = rig();

    const tierZero = thrownBy(() =>
      editing(test.runtime).edit((tx) => tx.motion(MOTION_ID).setStagger(0.25)),
    );

    // Tier 0 reaches the layer that owns the driver rather than a candidate graph, so it cannot
    // travel with a transaction: deferring it into the settle steps would move its refusal to after
    // the graph committed and after the retained definition moved, which is the contract `RA-35`
    // pins. It is refused by name instead of given a second, weaker failure contract.
    expect(tierZero).toBeInstanceOf(TypeError);
    expect((tierZero as Error).message).toMatch(/^schema-transaction-immediate: /);
    expect((tierZero as Error).message).toContain("setStagger");
    expect(test.journal).toEqual([]);

    // The value tier is refused through the same guard and for the same reason: it ends at its own
    // invalidate, so it publishes inside the recipe and survives an abort.
    const tierTwo = thrownBy(() =>
      editing(test.runtime).edit(() => test.runtime.setValues(ARM_ID, {})),
    );

    expect((tierTwo as Error).message).toMatch(/^schema-transaction-immediate: /);
    expect((tierTwo as Error).message).toContain("setValues");

    // The accepting direction, in the same rig. Both verbs are unchanged outside a recipe, which is
    // the half that stops this case from being green against a guard that refuses everywhere.
    test.runtime.motion(MOTION_ID).setStagger(0.25);

    expect(test.journal).toEqual(["motion-stagger hero 0.25"]);
    expect(test.runtime.motion(MOTION_ID).definition.stagger).toBe(0.25);
    expect(test.runtime.setValues(ARM_ID, {}).diagnostics).toEqual([]);

    test.runtime.dispose();
  });
});
