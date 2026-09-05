import { describe, expect, it } from "vitest";
import type {
  MotionDefinition,
  ProjectDefinition,
  TrackDefinition,
} from "../../../src/contract/v5";
import { StaleMotionHandleError, type MotionHandle } from "../../../src/contract/motion-handle";
import { createManualClock } from "../../../src/ports/clock";
import {
  ProjectRuntime,
  type ProjectRuntimeOptions,
  type StagedTrack,
} from "../../../src/runtime/project-runtime";

/**
 * Issue #223, slice A1.
 *
 * `ProjectRuntime` sequences every structural change: it applies the hooks that must be in place
 * before the graph is asked to accept a candidate, asks it, reverts them when it refuses, and runs
 * the steps that settle once it accepted. Five entry points each carried their own copy of that
 * sequence, and the ordering is load-bearing in three separate ways -- ADR-031 for the compiled
 * map, ADR-035 for rollback precedence, ADR-045 for republish-before-restore.
 *
 * These cases pin the sequence itself rather than the Tracks a composition happens to build, so the
 * hooks are injected here instead of driven through `Engine`. They are equivalence evidence: they
 * are green against the five copies and green against the one commit path that replaces them, and
 * an ordering that changed in either direction is what they exist to fail on.
 *
 * `U-5` through `U-8` in `track-staging.test.ts` already own the replacement staging order and its
 * rollback precedence. Nothing here restates them; these are the four paths those cases do not
 * reach.
 *
 * `RA-114` through `RA-117` are the later addition, issue #303, and they own a second subject on the
 * same sequence: what one of those injected hooks may do to the runtime whose commit it is part of.
 * A hook is caller code, so it can call `dispose()` from inside the try, and the question is which
 * phase the commit was in when it did. They live here rather than in a file of their own because the
 * answer is an ordering between the same hooks these seven cases already order, and because the
 * journal below is the instrument: a rollback step that reached a torn-down composition and one that
 * reached a live composition are indistinguishable by any counter and differ by one line here.
 */

const MOTION_ID = "hero";
const NODE_ID = "hero/arm";
const ADDED_ID = "hero/hand";
const BASE_PROJECT: ProjectDefinition = {
  schemaVersion: 5,
  motions: [{ id: MOTION_ID, trigger: { type: "manual" }, tracks: [{ id: "arm" }] }],
};
/** Refused by the candidate graph rather than by authored validation, so the rollback runs. */
const REJECTED_TRACK: TrackDefinition = { id: "hand", observes: [{ source: "~/missing" }] };
/**
 * Refused by `assertAuthoredMotionId` inside the candidate build, after every entry check passed.
 *
 * The trigger is valid, the tracks are empty, and the id is not a duplicate, so this reaches
 * `replaceGraph` and nothing earlier. That is the only way to observe a rejected motion add at all.
 */
const REJECTED_MOTION: MotionDefinition = {
  id: "villain/rogue",
  trigger: { type: "manual" },
  tracks: [],
};
const compose = (node: { id: string }) => () => ({
  values: { node: node.id },
  sourceProgress: 0,
  sourceRevisions: {},
});

interface Recorder {
  readonly entries: readonly string[];
  readonly options: ProjectRuntimeOptions;
}
/**
 * The runtime a hook tears down, held in a box rather than passed as a parameter.
 *
 * The runtime does not exist until the options it is constructed from do, so a hook that disposes it
 * cannot close over it directly. Assigned once, immediately after construction, and read only from
 * inside a hook.
 */
interface Host {
  runtime?: ProjectRuntime;
}
/**
 * Which hook tears the project down, named by hook rather than by phase.
 *
 * Which hook disposes is what decides which phase the commit is in when it happens, and that is the
 * whole difference between a refusal and a completion: `compileTrack` and `replaceMotionTrack` are
 * effects, applied inside the try and covered by the rollback, while `addMotionTrack` is a settle
 * step, which runs after the graph accepted and has no revert at all.
 */
type DisposingHook =
  | "createMotion"
  | "compileTrack"
  | "stageTrack"
  | "replaceMotionTrack"
  | "addMotionTrack";
/** What one rig's hooks do beyond recording, and the whole of what a case configures. */
interface Behaviour {
  readonly createMotion?: Error;
  readonly disposeFrom?: DisposingHook;
  /**
   * Thrown by the disposing hook after it disposed, so the two facts can be measured apart.
   *
   * A hook that disposes and then fails has two things to report and only one of them may reach the
   * caller. Without a second failure the disposal is the only candidate and the precedence between
   * them is unobservable.
   */
  readonly throwAfterDispose?: Error;
  /**
   * Whether a staging seam is wired at all, stated rather than implied.
   *
   * `RA-1` through `RA-7` were written against a rig with no staging seam, so a replacement leaves
   * `staged` undefined and its settle step is the no-op it already was. Wiring one unconditionally
   * would change the rig those seven cases measure, which is a licence this slice does not need.
   */
  readonly staging?: boolean;
  readonly host?: Host;
}
/**
 * One ordered journal across every hook a structural commit can reach, because the order is the
 * invariant.
 *
 * Six counters could not tell a compile-then-dispose from a dispose-then-compile, and could not
 * tell a hook that ran once from a hook that ran twice during a rollback. One list can.
 */
function recorder(behaviour: Behaviour = {}): Recorder {
  const entries: string[] = [];
  const record = (line: string): void => {
    entries.push(line);
  };
  /**
   * The teardown, and the failure that may follow it, as one step every hook runs after recording.
   *
   * After the record rather than before it, so the journal names the hook that disposed instead of
   * leaving the disposal to be inferred from whatever stopped happening after it.
   */
  const disposing = (hook: DisposingHook): void => {
    if (behaviour.disposeFrom !== hook) return;
    behaviour.host?.runtime?.dispose();
    if (behaviour.throwAfterDispose !== undefined) throw behaviour.throwAfterDispose;
  };
  const staging = behaviour.staging === true || behaviour.disposeFrom === "stageTrack";
  return {
    get entries() {
      return [...entries];
    },
    options: {
      clock: createManualClock(),
      compose,
      compileTrack: (_track, nodeId) => {
        record(`compile ${String(nodeId)}`);
        disposing("compileTrack");
      },
      disposeTrack: (nodeId) => record(`dispose ${nodeId}`),
      addMotionTrack: (_motionId, trackId, duration) => {
        record(`motion-add ${trackId} ${String(duration)}`);
        disposing("addMotionTrack");
      },
      replaceMotionTrack: (_motionId, trackId, duration) => {
        record(`motion-replace ${trackId} ${String(duration)}`);
        disposing("replaceMotionTrack");
      },
      removeMotionTrack: (_motionId, trackId) => record(`motion-remove ${trackId}`),
      createMotion: (definition) => {
        record(`motion-create ${definition.id}`);
        if (behaviour.createMotion) throw behaviour.createMotion;
        disposing("createMotion");
      },
      destroyMotion: (motionId) => record(`motion-destroy ${motionId}`),
      // The last line of a teardown, and the one the whole of issue #303 is about: every rollback
      // step and every settle step above reaches a composition, so a journal that records this can
      // say whether they reached a live one.
      disposeComposition: () => record("composition-dispose"),
      ...(staging
        ? {
            stageTrack: (_track: TrackDefinition, nodeId: string): StagedTrack => {
              record(`stage ${nodeId}`);
              disposing("stageTrack");
              return {
                commit: () => record(`stage-commit ${nodeId}`),
                rollback: () => record(`stage-rollback ${nodeId}`),
              };
            },
          }
        : {}),
    },
  };
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
/**
 * The outcome either way, for a case whose subject is that nothing was thrown.
 *
 * `thrownBy` above refuses that direction, and a bare call cannot express it either: before this
 * slice `RA-117`'s call throws from the graph layer, so the case would end on a call that could not
 * finish rather than on an assertion that disagreed, and failing-first means failing assertions.
 * `schema-transaction.test.ts` needed the same thing for `RA-109` and gives the same reason.
 */
function outcomeOf<T>(operation: () => T): { value: T | undefined; thrown: unknown } {
  try {
    return { value: operation(), thrown: undefined };
  } catch (error) {
    return { value: undefined, thrown: error };
  }
}
/** Every line in the journal equal to `line`, so exactly-once is a count rather than a position. */
function occurrences(journal: Recorder, line: string): number {
  return journal.entries.filter((entry) => entry === line).length;
}
/**
 * Every committed node whose graph-side definition is not the retained one, by identity.
 *
 * Identity rather than deep equality, and that is the point of the case that reads it: a snapshot
 * handing a fresh object for an untouched entry is exactly what costs `IncrementalGraphBuilder` its
 * `cached.track === track` hit, and deep equality cannot see the difference. See ADR-058.
 */
function disagreeing(runtime: ProjectRuntime): readonly string[] {
  return runtime.graph.graph.nodes
    .filter((node) => runtime.track(node.id).definition !== node.track)
    .map((node) => node.id);
}

describe("a structural change runs one transaction, in one order", () => {
  it("RA-1 creates the Motion before the graph is asked and destroys it on refusal", () => {
    const journal = recorder();
    const runtime = new ProjectRuntime(BASE_PROJECT, journal.options);

    runtime.addMotion({ id: "villain", trigger: { type: "manual" }, tracks: [] });

    // Before, not after. A driver that cannot be created must not leave a definition or a node
    // behind for a later addTrack to accept. See ADR-032.
    expect(journal.entries).toEqual(["motion-create villain"]);

    const thrown = thrownBy(() => runtime.addMotion(REJECTED_MOTION));

    expect(thrown).toBeInstanceOf(TypeError);
    expect((thrown as Error).message).toMatch(/^motion-id at /);
    expect(journal.entries).toEqual([
      "motion-create villain",
      "motion-create villain/rogue",
      "motion-destroy villain/rogue",
    ]);

    runtime.dispose();
  });

  it("RA-2 reports a createMotion failure verbatim and rolls nothing back", () => {
    const refusal = new Error("Scroll source is not registered.");
    const journal = recorder({ createMotion: refusal });
    const runtime = new ProjectRuntime(BASE_PROJECT, journal.options);

    const thrown = thrownBy(() =>
      runtime.addMotion({ id: "villain", trigger: { type: "manual" }, tracks: [] }),
    );

    // The hook refused before it wrote anything, so it is not destroyed a second time, and the
    // failure is not wrapped. Same rule `U-7` pins on `replaceMotionTrack`: an effect counts as
    // applied only once its call returned.
    expect(thrown).toBe(refusal);
    expect(journal.entries).toEqual(["motion-create villain"]);
    expect(() => runtime.destroyMotion("villain")).toThrow(/Unknown motion "villain"/);

    runtime.dispose();
  });

  it("RA-3 compiles a new Track, then registers it with its Motion, then mounts it", () => {
    const journal = recorder();
    const runtime = new ProjectRuntime(BASE_PROJECT, journal.options);

    const handle = runtime.addTrack({ id: "hand", duration: 250 }, { motionId: MOTION_ID });

    // The Motion entry must be written after the compile, because Motion resolves by id against the
    // live compiled map and an earlier call would resolve nothing. See ADR-031.
    expect(journal.entries).toEqual(["compile hero/hand", "motion-add hero/hand 250"]);
    expect(handle.id).toBe(ADDED_ID);
    expect(handle.live).toBe(true);
    expect(runtime.instanceCount).toBe(1);

    runtime.dispose();
  });

  it("RA-4 disposes the compiled Track and registers nothing when the graph refuses", () => {
    const journal = recorder();
    const runtime = new ProjectRuntime(BASE_PROJECT, journal.options);

    const thrown = thrownBy(() => runtime.addTrack(REJECTED_TRACK, { motionId: MOTION_ID }));

    expect(thrown).toBeInstanceOf(TypeError);
    expect((thrown as Error).message).toMatch(/^observation-unknown-source at /);
    expect(journal.entries).toEqual(["compile hero/hand", "dispose hero/hand"]);
    expect(runtime.instanceCount).toBe(0);
    expect(() => runtime.track(ADDED_ID)).toThrow(/Unknown graph node "hero\/hand"/);

    runtime.dispose();
  });

  it("RA-5 drops the entry before the removal hooks run, and runs them in order", () => {
    const journal = recorder();
    const runtime = new ProjectRuntime(BASE_PROJECT, journal.options);
    runtime.mount(NODE_ID);
    const handle = runtime.track(NODE_ID);

    handle.remove();

    expect(journal.entries).toEqual(["dispose hero/arm", "motion-remove hero/arm"]);
    expect(handle.live).toBe(false);
    expect(runtime.instanceCount).toBe(0);
    expect(() => runtime.track(NODE_ID)).toThrow(/Unknown graph node "hero\/arm"/);

    runtime.dispose();
  });

  it("RA-6 refuses a Motion that still owns tracks and reaches no hook", () => {
    const journal = recorder();
    const runtime = new ProjectRuntime(BASE_PROJECT, journal.options);

    const thrown = thrownBy(() => runtime.destroyMotion(MOTION_ID));

    expect(thrown).toBeInstanceOf(TypeError);
    expect((thrown as Error).message).toBe(
      'Motion "hero" still has 1 track(s). Remove them before destroying it.',
    );
    expect(journal.entries).toEqual([]);

    runtime.track(NODE_ID).remove();
    runtime.destroyMotion(MOTION_ID);

    expect(journal.entries).toEqual([
      "dispose hero/arm",
      "motion-remove hero/arm",
      "motion-destroy hero",
    ]);

    runtime.dispose();
  });

  it("RA-7 leaves the retained definitions and the committed graph agreeing", () => {
    const journal = recorder();
    const runtime = new ProjectRuntime(BASE_PROJECT, journal.options);

    expect(disagreeing(runtime)).toEqual([]);

    runtime.addTrack({ id: "hand" }, { motionId: MOTION_ID });
    expect(disagreeing(runtime)).toEqual([]);

    runtime.track(ADDED_ID).replace({ id: "hand", duration: 250 });
    expect(disagreeing(runtime)).toEqual([]);

    // A refused candidate has to leave the pair agreeing too, which is the half a commit path that
    // writes its maps before the graph accepted would get wrong.
    thrownBy(() => runtime.track(ADDED_ID).replace(REJECTED_TRACK));
    expect(disagreeing(runtime)).toEqual([]);
    expect(runtime.track(ADDED_ID).definition).toEqual({ id: "hand", duration: 250 });

    runtime.track(ADDED_ID).remove();
    expect(disagreeing(runtime)).toEqual([]);

    runtime.dispose();
  });

  it("RA-114 refuses the commit a hook disposed, rolls it back, then tears down once", () => {
    const host: Host = {};
    const journal = recorder({ disposeFrom: "compileTrack", host });
    const runtime = new ProjectRuntime(BASE_PROJECT, journal.options);
    host.runtime = runtime;

    const thrown = thrownBy(() =>
      runtime.addTrack({ id: "hand", duration: 250 }, { motionId: MOTION_ID }),
    );

    // The owner that decided, not the layer that noticed. Every effect after this one used to run
    // against a composition whose `disposeComposition` had already returned, `replaceGraph` then
    // reached `GraphRuntime`'s own liveness check, and `Error: GraphRuntime is disposed.` reached the
    // caller: the exact shape issue #288 corrected for a recipe, one indirection further in.
    expect(thrown).toBeInstanceOf(Error);
    expect((thrown as Error).message).toBe("ProjectRuntime is disposed.");
    // Not an `AggregateError`, which is the assertion that the rollback itself did not fail. A
    // `disposeTrack` handed to a torn-down composition is exactly the kind of thing that would.
    expect(thrown).not.toBeInstanceOf(AggregateError);

    // The order is the whole decision. The compiled Track the effect created is disposed while the
    // composition is still live, and the composition is torn down after that. A teardown that ran
    // where `dispose()` was called inverts these two lines and hands the rollback a composition that
    // no longer exists, which is a double teardown of a host resource in one direction and a leak of
    // it in the other. Neither is a contract.
    expect(journal.entries).toEqual([
      "compile hero/hand",
      "dispose hero/hand",
      "composition-dispose",
    ]);

    // Neither the graph nor the retained pair ever saw the candidate, and the journal is where that
    // is measured rather than a second assertion: `motion-add hero/hand` is a settle step, so its
    // absence is `#adoptMaps` and the settle phase never being reached, not a quiet hook.
    expect(journal.entries).not.toContain("motion-add hero/hand 250");
    expect(runtime.instanceCount).toBe(0);

    // Exactly once, asked the way a caller asks it. The disposal the hook requested is the disposal
    // that happened, and the explicit call after it is the no-op `dispose` already was.
    runtime.dispose();
    expect(occurrences(journal, "composition-dispose")).toBe(1);
    expect((thrownBy(() => runtime.track(NODE_ID)) as Error).message).toBe(
      "ProjectRuntime is disposed.",
    );
  });

  it("RA-115 keeps a hook's own failure ahead of the disposal it also asked for", () => {
    const refusal = new Error("Scroll source is not registered.");
    const host: Host = {};
    const journal = recorder({
      disposeFrom: "replaceMotionTrack",
      throwAfterDispose: refusal,
      staging: true,
      host,
    });
    const runtime = new ProjectRuntime(BASE_PROJECT, journal.options);
    host.runtime = runtime;

    const thrown = thrownBy(() => runtime.track(NODE_ID).replace({ id: "arm", duration: 500 }));

    // Two things are true of this call and only one may reach the caller. The hook failed before it
    // returned, so `rejectAfterRollback` rethrows it untouched and the disposal is not allowed to
    // replace the diagnosis: ADR-035's rule read from the other end, and the reason the disposal is
    // an answer rather than an error of its own.
    expect(thrown).toBe(refusal);

    // The staged replacement is rolled back and never committed, and the effect that threw is not
    // reverted, because an effect counts as applied only once its call returned. That is `RA-2`'s
    // rule, asked of a hook that disposed as well as failed. The rollback line still precedes the
    // teardown, which is the same ordering `RA-114` owns arriving through a different phase.
    expect(journal.entries).toEqual([
      "stage hero/arm",
      "motion-replace hero/arm 500",
      "stage-rollback hero/arm",
      "composition-dispose",
    ]);
    expect(journal.entries).not.toContain("stage-commit hero/arm");
    expect(occurrences(journal, "composition-dispose")).toBe(1);
  });

  it("RA-116 answers as disposed from the call rather than from the teardown", () => {
    const observed: string[] = [];
    let host: ProjectRuntime | undefined;
    let handle: MotionHandle | undefined;
    const options: ProjectRuntimeOptions = {
      clock: createManualClock(),
      compose,
      compileTrack: () => {
        host?.dispose();
        // Read from inside the window, which is the only place the window exists. The retained pair
        // is still full here and the graph is still live, because the teardown is the thing that was
        // deferred, and neither of those may show through to a caller that has already asked for the
        // disposal and had its call return.
        observed.push(`live ${String(handle?.live)}`);
        observed.push(
          `stale ${String(thrownBy(() => handle?.definition) instanceof StaleMotionHandleError)}`,
        );
        observed.push(`motion ${(thrownBy(() => host?.motion(MOTION_ID)) as Error).message}`);
        observed.push(`mount ${(thrownBy(() => host?.mount(NODE_ID)) as Error).message}`);
      },
    };
    const runtime = new ProjectRuntime(BASE_PROJECT, options);
    host = runtime;
    handle = runtime.motion(MOTION_ID);

    thrownBy(() => runtime.addTrack({ id: "hand" }, { motionId: MOTION_ID }));

    // Green before this slice and green after it, for two different reasons, which is `RA-110`'s
    // shape rather than a padded red count. Before, because `dispose()` had already emptied the
    // retained maps by the time anything could read them, so the staleness was a side effect of the
    // teardown. After, because the one member both handle ladders share reads the flag instead. It is
    // a lie detector for the deferral rather than evidence of it: a deferral that moved the teardown
    // without moving that answer reports `live` true on a runtime whose `dispose()` has returned.
    expect(observed).toEqual([
      "live false",
      "stale true",
      "motion ProjectRuntime is disposed.",
      "mount ProjectRuntime is disposed.",
    ]);
  });

  it("RA-117 finishes the settle steps a settle hook disposed through, and skips the flush", () => {
    const host: Host = {};
    const journal = recorder({ disposeFrom: "addMotionTrack", host });
    const runtime = new ProjectRuntime(BASE_PROJECT, journal.options);
    host.runtime = runtime;

    const outcome = outcomeOf(() => runtime.addTrack({ id: "hand" }, { motionId: MOTION_ID }));

    // Nothing thrown, and that is the measurement rather than the absence of one. The graph accepted
    // the candidate and the pair was adopted before this hook ran, so there is no refusal left to
    // report and nothing left to roll back. The teardown used to run here, and the next settle step
    // mounted the new node against a disposed graph, so `Error: GraphRuntime is disposed.` escaped
    // `#apply` after the commit had been adopted, past the one phase of that member which has no
    // revert list by design.
    expect(outcome.thrown).toBeUndefined();
    expect(outcome.value?.id).toBe(ADDED_ID);

    // A settle step may not be abandoned halfway, and this is where that is decided rather than
    // assumed. It has no revert because it is not allowed to fail, so a guard between two of them
    // would leave a staged Track neither committed nor rolled back and a Motion registered against a
    // node that never mounted. The teardown follows the phase instead of interrupting it, which is
    // the asymmetry with the effect loop above and it is deliberate.
    expect(journal.entries).toEqual([
      "compile hero/hand",
      "motion-add hero/hand undefined",
      "composition-dispose",
    ]);

    // The flush is the one thing skipped rather than completed: a publication on a runtime whose
    // caller has already asked for the teardown has no reader, and an `invalidate` for one would
    // still open a batch, move the sequence and drain a deferred flush's seeds. See ADR-064's
    // amendment of 2026-09-03, which is the same reason the empty-seed guard sits where it does.
    expect(outcome.value?.live).toBe(false);
    // Mounted by the settle step against a live graph, then detached by the teardown that followed
    // it, which is what completing the phase before releasing anything buys.
    expect(runtime.instanceCount).toBe(0);
    expect(occurrences(journal, "composition-dispose")).toBe(1);
  });
});
