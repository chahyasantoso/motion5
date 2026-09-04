import { describe, expect, it } from "vitest";
import type { MotionDefinition, ProjectDefinition, TriggerSignal } from "../../../src/contract/v5";
import { IncrementalGraphBuilder } from "../../../src/adapters/graph-builder/incremental";
import { createManualClock } from "../../../src/ports/clock";
import {
  ProjectRuntime,
  type ProjectRuntimeOptions,
  type StagedTrack,
} from "../../../src/runtime/project-runtime";

/**
 * Issue #223, the immediate-verb refusal at every verb that has one.
 *
 * ADR-064 decided that a verb applying immediately is refused by name inside a recipe rather than
 * deferred into it, because a settle step cannot refuse: deferring one would move its failure to
 * after the graph committed and after the retained definition moved, and one condition would end up
 * with two failure contracts. `RA-68` pins that for tier 0 and tier 2.
 *
 * It was enforced for those two tiers and stated for four more verbs. `SchemaTransaction` narrows
 * what a recipe is handed, and both its docblock and `ProjectHandle.edit`'s said that `mount`,
 * `seek`, `subscribe` and `dispose` "are not reachable through it" -- true of the transaction object,
 * and never true of the run, because the recipe closure holds the `ProjectHandle` the caller called
 * `edit` on. `seek`, `mount`, `unmount`, `invalidate` and `signal` are all reachable through it, none
 * of them consults the open transaction, and every one of them publishes or mounts immediately and
 * survives an abort. That is the same half-loud, half-silent shape ADR-064's own rule exists to
 * refuse.
 *
 * These cases own which verbs refuse inside a recipe and which do not. `RA-68` owns the two tiers
 * and nothing here restates it. What is new is that the guard is asked by the members `ProjectRuntime`
 * itself publishes, so the narrowing is documentation about the transaction rather than the
 * enforcement of anything.
 *
 * `RA-85` is the other direction, and it is why this file is not "refuse everything reachable":
 * `adopt` and `destroyAdopted` are structural, so they compose into the one commit and must not
 * refuse, and a subscription taken inside a recipe is the caller's own object and receives the
 * commit's flush.
 *
 * The clock is manual and never ticks. A publication that only happened because a frame arrived
 * would prove nothing about what a recipe let through.
 */

const MOTION_ID = "hero";
const ARM_ID = "hero/arm";
const LEG_ID = "hero/leg";
const HAND_ID = "hero/hand";
const FOOT_ID = "hero/foot";
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
 * A signal, shaped by a cast because no case here reads it.
 *
 * The hook records that it was asked, which is the whole of what `RA-83` is about: whether the
 * driver layer was reached at all from inside a recipe.
 */
const SIGNAL = { type: "play" } as unknown as TriggerSignal;

/**
 * The seam, asserted before it is used.
 *
 * Nothing is declared locally any more. `ProjectRuntime.signal` and
 * `ProjectRuntimeOptions.signalMotion` are both real members, so this takes the shipped type and
 * `typecheck` is what proves the signature rather than a local alias standing in front of it.
 *
 * The assertion stays, on `editing()`'s own rule: a bare call would
 * make `RA-83` fail with "signal is not a function", which is a call that could not run rather than
 * an assertion that disagreed, and failing-first means failing assertions. Issue #260.
 */
function signalling(runtime: ProjectRuntime): ProjectRuntime {
  expect(typeof runtime.signal).toBe("function");
  return runtime;
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
/** The one shape every case below asserts about a refusal, so no case restates half of it. */
function expectImmediate(thrown: unknown, verb: string): void {
  expect(thrown).toBeInstanceOf(TypeError);
  expect((thrown as Error).message).toMatch(/^schema-transaction-immediate: /);
  expect((thrown as Error).message).toContain(verb);
}

interface Rig {
  readonly runtime: ProjectRuntime;
  readonly journal: readonly string[];
  readonly builds: number;
  readonly sequence: number;
  readonly progressed: readonly string[];
}
/**
 * One runtime, one ordered journal, one build counter, and one record of every progress write.
 *
 * `progressed` is separate from the journal because `seek` is the one verb whose whole effect is a
 * progress write plus a flush, and a case that could only see the flush would be green against a
 * guard that published nothing while still moving the playhead.
 */
function rig(): Rig {
  const entries: string[] = [];
  const progressed: string[] = [];
  const record = (line: string): void => {
    entries.push(line);
  };
  const inner = new IncrementalGraphBuilder();
  let builds = 0;
  const staged = (nodeId: string): StagedTrack => ({
    commit: () => record(`stage-commit ${nodeId}`),
    rollback: () => record(`stage-rollback ${nodeId}`),
  });
  const options = {
    clock: createManualClock(),
    compose,
    graphBuilder: {
      build: (project: ProjectDefinition) => {
        builds += 1;
        return inner.build(project);
      },
    },
    compileTrack: (track: { duration?: number }, nodeId?: string) =>
      record(`compile ${String(nodeId)} ${String(track.duration)}`),
    disposeTrack: (nodeId: string) => record(`dispose ${nodeId}`),
    stageTrack: (track: { duration?: number }, nodeId: string) => {
      record(`stage ${nodeId} ${String(track.duration)}`);
      return staged(nodeId);
    },
    setProgress: (nodeId: string, progress: number) => {
      progressed.push(`${nodeId} ${String(progress)}`);
    },
    addMotionTrack: (_motionId: string, trackId: string) => record(`motion-add ${trackId}`),
    replaceMotionTrack: (_motionId: string, trackId: string) => record(`motion-replace ${trackId}`),
    removeMotionTrack: (_motionId: string, trackId: string) => record(`motion-remove ${trackId}`),
    createMotion: (definition: MotionDefinition) => record(`motion-create ${definition.id}`),
    destroyMotion: (motionId: string) => record(`motion-destroy ${motionId}`),
    signalMotion: (motionId: string) => record(`signal ${motionId}`),
  } as ProjectRuntimeOptions;
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
    get progressed() {
      return [...progressed];
    },
  };
}

describe("a verb that applies immediately refuses inside a recipe", () => {
  it("RA-79 refuses seek inside a recipe and publishes nothing", () => {
    const test = rig();
    test.runtime.mount(ARM_ID);
    const sequence = test.sequence;
    let thrown: unknown;

    editing(test.runtime).edit((tx) => {
      tx.addTrack({ id: "hand" }, { motionId: MOTION_ID });
      thrown = thrownBy(() => test.runtime.seek(ARM_ID, 0.5));
    });

    // A seek is a progress write and a flush, and both of them land immediately: the batch is the
    // caller's answer, so it cannot be deferred into the commit without the return value becoming a
    // lie about a publication that has not happened. Refused by name instead.
    expectImmediate(thrown, "seek");
    expect(test.progressed).toEqual([]);
    // One flush, and it is the commit's rather than the seek's.
    expect(test.sequence).toBe(sequence + 1);

    // The accepting direction, in the same rig, because a guard that refuses everywhere is green
    // against the refusal alone.
    const batch = test.runtime.seek(ARM_ID, 0.5);

    expect(batch.diagnostics).toEqual([]);
    expect(test.progressed).toEqual([`${ARM_ID} 0.5`]);

    test.runtime.dispose();
  });

  it("RA-80 refuses mount inside a recipe and still mounts what the commit added", () => {
    const test = rig();
    let thrown: unknown;

    editing(test.runtime).edit((tx) => {
      tx.addTrack({ id: "hand" }, { motionId: MOTION_ID });
      thrown = thrownBy(() => test.runtime.mount(LEG_ID));
    });

    // Mount refuses an id absent from the committed graph, so a recipe mounting what it just staged
    // fails today with `Unknown graph node`, which names the wrong cause; and mounting a node that
    // already existed succeeds, moves the member revision, and survives the abort.
    expectImmediate(thrown, "mount");
    // The refusal costs the caller nothing it needed: an added track is mounted by the commit, which
    // is the one caller of the mount that is not a public one.
    expect(test.runtime.instanceCount).toBe(1);
    expect(test.runtime.track(HAND_ID).live).toBe(true);

    // The accepting direction: the public verb is unchanged outside a recipe, and it still answers
    // with the instance rather than with a boolean.
    const instance = {};

    expect(test.runtime.mount(ARM_ID, instance)).toBe(instance);
    expect(test.runtime.instanceCount).toBe(2);

    test.runtime.dispose();
  });

  it("RA-81 refuses unmount inside a recipe and leaves the member set alone", () => {
    const test = rig();
    test.runtime.mount(ARM_ID);
    const members = test.runtime.graph.memberCount;
    let thrown: unknown;

    editing(test.runtime).edit((tx) => {
      tx.addTrack({ id: "hand" }, { motionId: MOTION_ID });
      thrown = thrownBy(() => test.runtime.unmount(ARM_ID));
    });

    // The one verb of the five that could have been deferred honestly, because it returns nothing
    // and refuses nothing. Deferring one of five is two failure contracts for one condition, which
    // is the defect this slice is closing rather than a shape to add a fifth copy of.
    expectImmediate(thrown, "unmount");
    // Two: the one mounted before the recipe, still mounted, and the one the commit added. The
    // refusal is what keeps the first number from being zero.
    expect(test.runtime.instanceCount).toBe(2);
    // The commit mounted the added node, so the count moved by exactly what the commit added.
    expect(test.runtime.graph.memberCount).toBe(members + 1);

    // The accepting direction.
    test.runtime.unmount(ARM_ID);

    expect(test.runtime.instanceCount).toBe(1);

    test.runtime.dispose();
  });

  it("RA-82 refuses invalidate inside a recipe and flushes once for the commit", () => {
    const test = rig();
    test.runtime.mount(ARM_ID);
    const sequence = test.sequence;
    let thrown: unknown;

    editing(test.runtime).edit((tx) => {
      tx.addTrack({ id: "hand" }, { motionId: MOTION_ID });
      thrown = thrownBy(() => test.runtime.invalidate([ARM_ID]));
    });

    // The public invalidate is the value tier's ending with none of its own bookkeeping, so it is
    // refused for exactly the reason `setValues` is. What is not refused is the same call reached
    // from a hook while a commit is applying: `#open` is cleared before the settle steps run, which
    // is what keeps a Motion's own invalidate on the path it has always been on.
    expectImmediate(thrown, "invalidate");
    expect(test.sequence).toBe(sequence + 1);

    // The accepting direction.
    expect(test.runtime.invalidate([ARM_ID]).diagnostics).toEqual([]);
    expect(test.sequence).toBe(sequence + 2);

    test.runtime.dispose();
  });

  it("RA-83 refuses signal inside a recipe and reaches the driver layer not at all", () => {
    const test = rig();
    let thrown: unknown;

    editing(test.runtime).edit((tx) => {
      tx.addTrack({ id: "hand" }, { motionId: MOTION_ID });
      thrown = thrownBy(() => signalling(test.runtime).signal(MOTION_ID, SIGNAL));
    });

    // Tier 0's twin, and the verb the review's own list of four missed. A signal reaches the created
    // trigger port of a live Motion, which plays it and publishes, so it applies immediately and
    // survives an abort for the same reason `setTrigger` does. It lived in a closure over the engine's
    // Motion map, where the rule's owner cannot be asked, which is why the fix routes it through the
    // runtime as a hook like every other Motion-owned side effect in that file.
    expectImmediate(thrown, "signal");
    expect(test.journal.filter((line) => line.startsWith("signal"))).toEqual([]);

    // The accepting direction: unchanged outside a recipe, and it still reaches the layer that owns
    // the driver rather than being answered here.
    signalling(test.runtime).signal(MOTION_ID, SIGNAL);

    expect(test.journal.filter((line) => line.startsWith("signal"))).toEqual([
      `signal ${MOTION_ID}`,
    ]);

    test.runtime.dispose();
  });

  it("RA-84 mutates nothing on a refusal a recipe catches and keeps going after", () => {
    const test = rig();
    test.runtime.mount(ARM_ID);
    const builds = test.builds;
    const sequence = test.sequence;

    editing(test.runtime).edit((tx) => {
      tx.addTrack({ id: "hand" }, { motionId: MOTION_ID });
      expectImmediate(
        thrownBy(() => test.runtime.seek(ARM_ID, 0.5)),
        "seek",
      );
      expectImmediate(
        thrownBy(() => test.runtime.invalidate([ARM_ID])),
        "invalidate",
      );
      tx.addTrack({ id: "foot" }, { motionId: MOTION_ID });
    });

    // The guard refuses before anything it guards has run, so a recipe that catches its own refusal
    // is a recipe that staged two adds: one candidate build, one flush, both tracks live. A guard
    // placed after the effect would leave the count here at three.
    expect(test.builds).toBe(builds + 1);
    expect(test.sequence).toBe(sequence + 1);
    expect(test.progressed).toEqual([]);
    expect(test.runtime.track(HAND_ID).live).toBe(true);
    expect(test.runtime.track(FOOT_ID).live).toBe(true);

    test.runtime.dispose();
  });

  it("RA-85 leaves the structural verbs and a subscription reachable inside a recipe", () => {
    const test = rig();
    const owner = {};
    const builds = test.builds;
    let heard = 0;

    editing(test.runtime).edit((tx) => {
      tx.addTrack({ id: "hand" }, { motionId: MOTION_ID });
      // Structural, so they reach `#commit` and merge into the open pair exactly as the transaction's
      // own `addTrack` does. Neither is on `SchemaTransaction`, and that was never a guarantee that
      // they could not be reached: it is what makes the narrowing documentation rather than a fence.
      const adopted = test.runtime.adopt({ id: "foot" }, owner, { motionId: MOTION_ID });

      expect(adopted.id).toBe(FOOT_ID);
      expect(test.runtime.track(FOOT_ID).live).toBe(true);

      test.runtime.destroyAdopted(FOOT_ID, owner);

      expect(test.runtime.tryTrack(FOOT_ID)).toBeUndefined();
      // A listener is the caller's own object. It survives an abort harmlessly, and taken inside a
      // recipe it receives the commit's flush, which is what a caller building a structure up wants.
      test.runtime.graph.registry.subscribeNode(HAND_ID, () => {
        heard += 1;
      });
    });

    // One commit for the add, the adopt and the destroy together, and the subscription heard it.
    expect(test.builds).toBe(builds + 1);
    expect(test.runtime.track(HAND_ID).live).toBe(true);
    expect(test.runtime.tryTrack(FOOT_ID)).toBeUndefined();
    expect(heard).toBe(1);

    test.runtime.dispose();
  });
});

/**
 * Asserts the transaction seam before a case uses it, on `schema-transaction.test.ts`'s own rule.
 *
 * Restated here rather than exported from that file: a shared harness between two evidence files is
 * one owner of two slices' rigs, and the assertion is one line.
 */
function editing(runtime: ProjectRuntime): ProjectRuntime {
  expect(typeof runtime.edit).toBe("function");
  return runtime;
}
