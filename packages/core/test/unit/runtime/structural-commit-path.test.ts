import { describe, expect, it } from "vitest";
import type {
  MotionDefinition,
  ProjectDefinition,
  TrackDefinition,
} from "../../../src/contract/v5";
import { createManualClock } from "../../../src/ports/clock";
import { ProjectRuntime, type ProjectRuntimeOptions } from "../../../src/runtime/project-runtime";

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
 * One ordered journal across every hook a structural commit can reach, because the order is the
 * invariant.
 *
 * Six counters could not tell a compile-then-dispose from a dispose-then-compile, and could not
 * tell a hook that ran once from a hook that ran twice during a rollback. One list can.
 */
function recorder(failures: { readonly createMotion?: Error } = {}): Recorder {
  const entries: string[] = [];
  const record = (line: string): void => {
    entries.push(line);
  };
  return {
    get entries() {
      return [...entries];
    },
    options: {
      clock: createManualClock(),
      compose,
      compileTrack: (_track, nodeId) => record(`compile ${String(nodeId)}`),
      disposeTrack: (nodeId) => record(`dispose ${nodeId}`),
      addMotionTrack: (_motionId, trackId, duration) =>
        record(`motion-add ${trackId} ${String(duration)}`),
      removeMotionTrack: (_motionId, trackId) => record(`motion-remove ${trackId}`),
      createMotion: (definition) => {
        record(`motion-create ${definition.id}`);
        if (failures.createMotion) throw failures.createMotion;
      },
      destroyMotion: (motionId) => record(`motion-destroy ${motionId}`),
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
});
