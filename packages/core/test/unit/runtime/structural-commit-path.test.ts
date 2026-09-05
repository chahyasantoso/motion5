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
// The project's own describer rather than a copy of it in this rig. The journal records what a
// re-entry came back with, and how a thrown value that is not an `Error` reads already has an owner.
import { describeError } from "../../../src/runtime/schema-refusals";

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
 *
 * `RA-118` through `RA-122` are issue #307's, and they own a third subject on the same sequence: what
 * one of those hooks may do to the commit it is part of rather than to the runtime that is running
 * it. A hook that calls a structural entry point re-enters `#commit`, which used to find no open
 * transaction and apply immediately, nested inside the outer `#apply` and staged from a retained pair
 * that does not carry the outer commit's change, so both commits adopted their own pair and the outer
 * one won: a lost update, with a compiled and mounted node nothing refers to.
 *
 * The journal is the instrument here for a second reason. The refusal is recorded on the line the
 * hook asked for it, so which phase the commit was in is a position rather than a second counter, and
 * the accepting direction is the same journal with two more lines in it.
 *
 * `RA-134` and `RA-135` are issue #310's, and they need no rig change at all, which is itself the
 * shape of that slice: the same `reenter` config, pointed at a verb that mounts or reads rather than
 * at one that commits. `RA-134` is that issue's fifth reproduction shape, a `mount` of the node the
 * commit is adding, and it is the one consequence of the pre-commit window that belongs here rather
 * than in `structural-commit-flush.test.ts`, because what it costs is a settle step rather than a
 * publication. `RA-135` is the accepting direction for both subjects at once: a hook that only reads
 * is untouched, and one commit publishes exactly once with the seeds `#derive` chose. See ADR-070.
 */

const MOTION_ID = "hero";
const NODE_ID = "hero/arm";
const ADDED_ID = "hero/hand";
const SECOND_ID = "hero/second";
/**
 * The refusal a structural entry point re-entered from inside a commit answers with, whole.
 *
 * One constant, read by four cases and by every journal line they compare, so the message is pinned
 * in one place and a refusal that changed its wording fails on the string rather than on a loose
 * match. It names the condition and not the verb, because every structural verb is refused equally
 * and the caller wrote a hook rather than a transaction.
 */
const REENTRANT =
  "schema-commit-reentrant: A structural commit is already in flight. Ask for it once this one has returned.";
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
 * Which hook intrudes on the runtime, named by hook rather than by phase.
 *
 * Which hook it is decides which phase the commit is in when it happens, and that is the whole
 * difference between a refusal and a completion: `compileTrack` and `replaceMotionTrack` are effects,
 * applied inside the try and covered by the rollback, while `addMotionTrack` is a settle step, which
 * runs after the graph accepted and has no revert at all.
 *
 * One enum for both intrusions rather than one per behaviour. Which hooks are caller code is one fact
 * about a commit, and a second list of the same five names is a second owner of it that can disagree
 * about which phase a name belongs to. `disposeFrom` and `reenter.from` both read this.
 */
type CommitHook =
  | "createMotion"
  | "compileTrack"
  | "stageTrack"
  | "replaceMotionTrack"
  | "addMotionTrack";
/** What one rig's hooks do beyond recording, and the whole of what a case configures. */
interface Behaviour {
  readonly createMotion?: Error;
  readonly disposeFrom?: CommitHook;
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
  /**
   * The structural call one hook makes into the runtime whose commit it is part of, and whether it
   * keeps what comes back to itself.
   *
   * A closure rather than a verb enum, because the shapes these cases need -- an add, a removal and a
   * replacement -- differ in what they name rather than in what this rig has to do with them, and a
   * rig that reproduced the verb list would be a second owner of it.
   *
   * `swallow` is the whole difference between the two contracts this subject has, and both are the
   * hook's own choice rather than the runtime's. A hook that lets the refusal escape fails the effect
   * it is part of, so the outer commit is rolled back and its caller reads the refusal; one that
   * catches it has reported the refusal to itself, and the outer commit is untouched.
   */
  readonly reenter?: {
    readonly from: CommitHook;
    readonly call: (runtime: ProjectRuntime) => unknown;
    readonly swallow?: boolean;
  };
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
  const disposing = (hook: CommitHook): void => {
    if (behaviour.disposeFrom !== hook) return;
    behaviour.host?.runtime?.dispose();
    if (behaviour.throwAfterDispose !== undefined) throw behaviour.throwAfterDispose;
  };
  /**
   * Once, which is the issue's own reproduction shape and not a convenience.
   *
   * Without it the re-entry is unbounded before the slice: the inner commit reaches the same hook,
   * which re-enters again, and the red run ends on a stack overflow rather than on an assertion that
   * disagreed. It also keeps the accepting direction readable, where the same verb is called again
   * after the commit returned and must not intrude a second time.
   */
  let reentered = false;
  /**
   * The re-entry, and what came back from it, as one journal line.
   *
   * Recorded rather than returned, because where the refusal arrived is half of what these cases
   * assert and no second instrument could order it against the hooks around it. The message is
   * recorded whole and an accepted re-entry says so, so both directions read as one line each.
   *
   * Rethrown unless the case asked for it to be swallowed, which is what makes the hook's own two
   * contracts expressible in one rig rather than in two.
   */
  const reentering = (hook: CommitHook): void => {
    const reenter = behaviour.reenter;
    const host = behaviour.host?.runtime;
    if (reenter === undefined || reenter.from !== hook || host === undefined) return;
    if (reentered) return;
    reentered = true;
    const outcome = outcomeOf(() => reenter.call(host));
    record(`reentry ${outcome.thrown === undefined ? "accepted" : describeError(outcome.thrown)}`);
    if (outcome.thrown !== undefined && reenter.swallow !== true) throw outcome.thrown;
  };
  const staging =
    behaviour.staging === true ||
    behaviour.disposeFrom === "stageTrack" ||
    behaviour.reenter?.from === "stageTrack";
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
        reentering("compileTrack");
      },
      disposeTrack: (nodeId) => record(`dispose ${nodeId}`),
      addMotionTrack: (_motionId, trackId, duration) => {
        record(`motion-add ${trackId} ${String(duration)}`);
        disposing("addMotionTrack");
        reentering("addMotionTrack");
      },
      replaceMotionTrack: (_motionId, trackId, duration) => {
        record(`motion-replace ${trackId} ${String(duration)}`);
        disposing("replaceMotionTrack");
        reentering("replaceMotionTrack");
      },
      removeMotionTrack: (_motionId, trackId) => record(`motion-remove ${trackId}`),
      createMotion: (definition) => {
        record(`motion-create ${definition.id}`);
        if (behaviour.createMotion) throw behaviour.createMotion;
        disposing("createMotion");
        reentering("createMotion");
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
              reentering("stageTrack");
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

  it("RA-118 refuses a structural entry point re-entered from inside a commit's effects", () => {
    const host: Host = {};
    const journal = recorder({
      reenter: {
        from: "compileTrack",
        call: (runtime) => runtime.addTrack({ id: "second" }, { motionId: MOTION_ID }),
      },
      host,
    });
    const runtime = new ProjectRuntime(BASE_PROJECT, journal.options);
    host.runtime = runtime;

    const outcome = outcomeOf(() =>
      runtime.addTrack({ id: "hand", duration: 250 }, { motionId: MOTION_ID }),
    );

    // The owner that decided, at the moment it was asked, and not the immediate-verb refusal: that
    // one names the verb because a caller wrote the `edit()` around it, and this caller wrote a hook
    // that a commit called. One condition, one message, and it names the condition.
    expect(outcome.thrown).toBeInstanceOf(TypeError);
    expect(describeError(outcome.thrown)).toBe(REENTRANT);
    expect(outcome.value).toBeUndefined();

    // The refusal arrives inside the hook, so the journal orders it against the effect it is part of
    // rather than leaving the phase to be inferred. Before this slice the inner add applies here,
    // nested inside the outer `#apply`, and these two lines are four.
    expect(journal.entries).toEqual(["compile hero/hand", `reentry ${REENTRANT}`]);
    expect(journal.entries).not.toContain("compile hero/second");

    // Not reverted, and that is `RA-2`'s rule rather than a leak this slice introduced: the hook threw
    // before its effect returned, so the effect was never applied and the rollback list is empty.
    expect(journal.entries).not.toContain("dispose hero/hand");

    // Neither commit reached the graph or the retained pair, and neither node is mounted.
    expect(runtime.instanceCount).toBe(0);
    expect(() => runtime.track(ADDED_ID)).toThrow(/Unknown graph node/);
    expect(() => runtime.track(SECOND_ID)).toThrow(/Unknown graph node/);
    expect(runtime.graph.graph.nodes.map((node) => node.id)).toEqual([NODE_ID]);

    runtime.dispose();
  });

  it("RA-119 leaves the calling commit whole when its hook keeps the refusal to itself", () => {
    const host: Host = {};
    const journal = recorder({
      reenter: {
        from: "compileTrack",
        call: (runtime) => runtime.addTrack({ id: "second" }, { motionId: MOTION_ID }),
        swallow: true,
      },
      host,
    });
    const runtime = new ProjectRuntime(BASE_PROJECT, journal.options);
    host.runtime = runtime;
    const before = runtime.graph.sequence;

    const handle = runtime.addTrack({ id: "hand", duration: 250 }, { motionId: MOTION_ID });

    // A hook that caught the refusal has been told no and nothing else happened to it, so the commit
    // it is part of finishes in exactly the order `RA-3` pins.
    expect(journal.entries).toEqual([
      "compile hero/hand",
      `reentry ${REENTRANT}`,
      "motion-add hero/hand 250",
    ]);
    expect(handle.live).toBe(true);
    expect(runtime.track(ADDED_ID).definition).toEqual({ id: "hand", duration: 250 });

    // The lost update, measured from the side that used to lose it. Before this slice the inner add
    // reaches the composition and the graph, the outer adoption overwrites it, and `hero/second` ends
    // up compiled and mounted with nothing in either map and no graph node referring to it, so
    // nothing will ever dispose it.
    expect(runtime.tryTrack(SECOND_ID)).toBeUndefined();
    expect(runtime.graph.graph.nodes.map((node) => node.id)).toEqual([NODE_ID, ADDED_ID]);
    expect(runtime.instanceCount).toBe(1);
    expect(disagreeing(runtime)).toEqual([]);

    // One commit, one flush. Two nested commits are two, each ending at its own `invalidate`, which
    // is the other half of what the outer adoption used to hide.
    expect(runtime.graph.sequence - before).toBe(1);

    runtime.dispose();
  });

  it("RA-120 refuses a removal of the node the commit it re-entered is replacing", () => {
    const host: Host = {};
    const journal = recorder({
      reenter: { from: "replaceMotionTrack", call: (runtime) => runtime.track(NODE_ID).remove() },
      staging: true,
      host,
    });
    const runtime = new ProjectRuntime(BASE_PROJECT, journal.options);
    host.runtime = runtime;

    const outcome = outcomeOf(() => runtime.track(NODE_ID).replace({ id: "arm", duration: 500 }));

    // The version where the two commits disagree about one node rather than about a set, and the
    // refusal is the same one: the condition is that a commit is in flight, and which node either
    // commit names is not part of it.
    expect(describeError(outcome.thrown)).toBe(REENTRANT);
    expect(journal.entries).toEqual([
      "stage hero/arm",
      "motion-replace hero/arm 500",
      `reentry ${REENTRANT}`,
      "stage-rollback hero/arm",
    ]);
    expect(journal.entries).not.toContain("stage-commit hero/arm");
    expect(journal.entries).not.toContain("dispose hero/arm");
    expect(journal.entries).not.toContain("motion-remove hero/arm");

    // Rolled back whole. Before this slice the inner removal evicts the node, disposes its compiled
    // Track and deregisters it from its Motion, and the outer `replaceGraph` then commits a snapshot
    // that still carries it: a node in the committed graph whose compiled Track the composition was
    // told to throw away.
    expect(runtime.track(NODE_ID).live).toBe(true);
    expect(runtime.track(NODE_ID).definition).toEqual({ id: "arm" });
    expect(disagreeing(runtime)).toEqual([]);

    runtime.dispose();
  });

  it("RA-121 refuses a re-entry from a settle step, and finishes the phase it interrupted", () => {
    const host: Host = {};
    const journal = recorder({
      reenter: {
        from: "addMotionTrack",
        call: (runtime) => runtime.addTrack({ id: "second" }, { motionId: MOTION_ID }),
        swallow: true,
      },
      host,
    });
    const runtime = new ProjectRuntime(BASE_PROJECT, journal.options);
    host.runtime = runtime;

    const outcome = outcomeOf(() => runtime.addTrack({ id: "hand" }, { motionId: MOTION_ID }));

    // A settle step runs after `#adoptMaps`, so an inner commit here stages from a pair that does
    // carry the outer change and loses nothing. It is refused anyway, and not for symmetry: the
    // settle steps still queued were derived against the pair the inner commit would replace, so an
    // inner removal leaves the next `#mountNode` attaching a node the committed graph no longer has,
    // in the one phase with no revert list and, as of #306, no error boundary. A condition that had
    // to name a phase would not be one condition, so the message names none.
    expect(outcome.thrown).toBeUndefined();
    expect(outcome.value?.live).toBe(true);
    expect(journal.entries).toEqual([
      "compile hero/hand",
      "motion-add hero/hand undefined",
      `reentry ${REENTRANT}`,
    ]);

    // The phase completed past the refusal rather than being abandoned at it, and the mount is where
    // that is measured, because it is the settle step after the one that was refused.
    expect(runtime.instanceCount).toBe(1);
    expect(runtime.tryTrack(SECOND_ID)).toBeUndefined();
    expect(runtime.graph.graph.nodes.map((node) => node.id)).toEqual([NODE_ID, ADDED_ID]);

    runtime.dispose();
  });

  it("RA-122 leaves a hook's reads answering, and its commit accepted once the commit returned", () => {
    const observed: string[] = [];
    const host: Host = {};
    const journal = recorder({
      reenter: {
        from: "compileTrack",
        call: (runtime) => {
          // Reads are not refused, and they answer from the retained pair rather than from the pair
          // being committed. That is the fact the refusal rests on: the candidate lives in a local
          // inside `#apply`, so there is nothing for an inner commit to stage from and nothing for it
          // to merge into. Pinned here rather than left as a side effect of where the accessor reads.
          observed.push(`arm ${runtime.track(NODE_ID).definition.id}`);
          observed.push(`candidate ${String(runtime.tryTrack(ADDED_ID))}`);
          observed.push(`readers ${runtime.dependantsOf(NODE_ID).length}`);
        },
      },
      host,
    });
    const runtime = new ProjectRuntime(BASE_PROJECT, journal.options);
    host.runtime = runtime;

    const first = runtime.addTrack({ id: "hand" }, { motionId: MOTION_ID });

    expect(observed).toEqual(["arm arm", "candidate undefined", "readers 0"]);
    expect(journal.entries).toEqual([
      "compile hero/hand",
      "reentry accepted",
      "motion-add hero/hand undefined",
    ]);

    // The same call the four cases above are refused for, made once the commit has returned rather
    // than from inside it. Green on both sides of this slice, deliberately: it is the case a guard
    // reading "this runtime has committed" rather than "a commit is in flight" fails, and the case a
    // guard placed on the reading ladder fails. A refusal is only evidence beside its accepting
    // direction, and this is that direction in the same rig.
    const second = runtime.addTrack({ id: "second" }, { motionId: MOTION_ID });

    expect(second.live).toBe(true);
    expect(first.live).toBe(true);
    expect(journal.entries.slice(3)).toEqual([
      "compile hero/second",
      "motion-add hero/second undefined",
    ]);
    expect(runtime.instanceCount).toBe(2);

    runtime.dispose();
  });

  it("RA-134 refuses a mount of the node the commit is adding, so its settle step still owns it", () => {
    const host: Host = {};
    const journal = recorder({
      reenter: {
        from: "compileTrack",
        call: (runtime) => runtime.mount(ADDED_ID),
        swallow: true,
      },
      host,
    });
    const runtime = new ProjectRuntime(BASE_PROJECT, journal.options);
    host.runtime = runtime;

    const outcome = outcomeOf(() => runtime.addTrack({ id: "hand" }, { motionId: MOTION_ID }));

    // Issue #310's second consequence, and the one that is not about publication. `mount` reaches the
    // pre-commit graph, so the same one condition refuses it, and the settle phase is left as the only
    // owner of mounting this node. Which failure the pre-slice run reports was read from the run
    // rather than predicted here, and it is not the one the issue named: the journal reads
    // `reentry Unknown graph node "hero/hand".`, because the verb reaches `GraphRuntime.attach` and
    // the candidate graph does not carry this node yet, so the settle step's `already mounted` is
    // never reached. That is the layer that noticed answering in place of the owner that decided,
    // which is the same defect #288, #303 and #305 each corrected one tier out. ADR-070's Context
    // owns the correction.
    expect(outcome.thrown).toBeUndefined();
    expect(outcome.value?.live).toBe(true);
    expect(journal.entries).toEqual([
      "compile hero/hand",
      `reentry ${REENTRANT}`,
      "motion-add hero/hand undefined",
    ]);

    // What the commit alone made it, which is the claim rather than the number: one mount, by the
    // settle step, of the node this commit added.
    expect(runtime.instanceCount).toBe(1);
    expect(runtime.graph.graph.nodes.map((node) => node.id)).toEqual([NODE_ID, ADDED_ID]);
    expect(disagreeing(runtime)).toEqual([]);

    // Cross-referenced rather than claiming to close it. Issue #306 still owns a throwing settle step,
    // because `#mountNode` can also throw on an id `GraphRuntime.attach` refuses and because
    // `addMotionTrack`, `disposeTrack` and `staged.commit()` are caller code with no reentrancy in
    // sight. This case removes one reachable cause of that throw and none of the others.
    runtime.dispose();
  });

  it("RA-135 leaves a hook's reads answering, and publishes the commit's own flush exactly once", () => {
    const observed: string[] = [];
    const host: Host = {};
    const journal = recorder({
      reenter: {
        from: "compileTrack",
        call: (runtime) => {
          // None of these four is a publication or an edit, which is the whole reason the refusal is
          // at the verb rather than at the seam: a host whose `compileTrack` reads the project is a
          // substitutable implementation of that port, not a broken one.
          observed.push(`definition ${runtime.track(NODE_ID).definition.id}`);
          observed.push(`readers ${runtime.dependantsOf(NODE_ID).length}`);
          observed.push(`mounted ${runtime.instanceCount}`);
          observed.push(`candidate ${String(runtime.tryTrack(ADDED_ID))}`);
        },
      },
      host,
    });
    const runtime = new ProjectRuntime(BASE_PROJECT, journal.options);
    host.runtime = runtime;
    runtime.mount(NODE_ID);
    const before = runtime.graph.sequence;

    const handle = runtime.addTrack({ id: "hand" }, { motionId: MOTION_ID });

    // They answer from the retained pair, which is one commit behind, and that is a documented
    // consequence of the pair being held in a local rather than a defect: `mounted` is what the settle
    // phase has not done yet, and the node being added is not resolvable at all.
    expect(observed).toEqual(["definition arm", "readers 0", "mounted 1", "candidate undefined"]);
    expect(journal.entries).toEqual([
      "compile hero/hand",
      "reentry accepted",
      "motion-add hero/hand undefined",
    ]);
    expect(handle.live).toBe(true);
    expect(runtime.instanceCount).toBe(2);

    // Exactly one batch, carrying what `#derive` seeded, rather than "a batch happened". Written that
    // way deliberately and for two reasons: issue #306 makes this flush unconditional, so a case
    // asserting only that the sequence moved would stay green while a second publication crept back in
    // front of it, and a mount publishes nothing, so this count is the commit's alone.
    expect(runtime.graph.sequence).toBe(before + 1);

    // Green on both sides of this slice, deliberately, and the file says so rather than letting it be
    // counted. It is a lie detector for the refusal's scope: a rung that refused everything a hook can
    // reach fails the four reads above, and one that refused by seam rather than by verb fails all of
    // them. A refusal is only evidence beside its accepting direction, and this is that direction in
    // the same rig. The guardrail against padding a red count is why that is stated here.
    runtime.dispose();
  });
});
