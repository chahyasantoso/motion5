import { describe, expect, it, vi } from "vitest";
import type { ProjectDefinition, TrackDefinition } from "../../../src/contract/v5";
import { createManualClock } from "../../../src/ports/clock";
import { ProjectRuntime, type ProjectRuntimeOptions } from "../../../src/runtime/project-runtime";

/**
 * Issue #362, phase 2: a loaded project can be enumerated through the public API.
 *
 * Before this slice `track`, `tryTrack`, `motion` and `tryMotion` are all by-id,
 * `MotionHandle.trackIds` answers per motion, `#snapshot` is private, and nothing answers the
 * project's motion ids, its free-track ids, or which nodes are mounted. That is why both shipped
 * demos keep a hand-written id list beside the project definition and mount in a loop over the
 * copy: an authored fact with two owners and no gate keeping them in step, which is the
 * derived-fact guardrail one indirection out.
 *
 * These are readers and not verbs, which is what makes the block small. There is no new failure
 * contract to design, no ordering question, no tier and no hook: each one projects state the
 * runtime already holds, through the accessor that already owns it. `motionIds` reads
 * `#readMotions`, `freeTrackIds` reads the unowned half of the one ownership filter
 * `MotionHandle.trackIds` already reads, and `mountedNodeIds` reads `#instances`. So what is
 * actually at stake is which state they answer from, and most of the cases below are about that:
 * the pending pair inside a recipe, the retained pair inside a commit's own hook, and a refusal on
 * a disposed project including the window in which disposal has been requested and the release has
 * not happened yet.
 *
 * The rig is a real document rather than a minimal one, because two of the answers are partitions.
 * Two motions prove `motionIds` is not one entry wearing a list, one motion with three tracks
 * beside one with a single track proves the owned half stays `MotionHandle.trackIds`', and two free
 * tracks prove `freeTrackIds` is the other half of one filter rather than a second walk that could
 * disagree about which side a track is on. The chain is what makes the ordering case possible at
 * all: `upper` binds `base` and `lower` binds `upper`, so removing the parent before the child is a
 * real intermediate candidate with a dangling edge, and `RA-152` is the claim that one recipe never
 * builds it.
 *
 * No `PluginRegistry`, no compile hooks except where a case is about a hook, and a manual clock
 * that never ticks. Every fact here belongs to the layer that holds the retained pair, so nothing
 * below is allowed to be answered by a flush, by a plugin resolve or by the graph.
 */

/**
 * The three readers this slice adds, declared here and cast to rather than named on the class
 * before it has them, because a test file naming a member the source does not declare fails
 * `typecheck` and a failed gate is not failing-first evidence. The commit that lands the readers
 * deletes this declaration and the cast with it. `StaleSeam`, `ComposeSeam` and the `LV-` locals
 * are the precedent.
 */
type EnumeratingRuntime = ProjectRuntime & {
  motionIds(): readonly string[];
  freeTrackIds(): readonly string[];
  mountedNodeIds(): readonly string[];
};

const RIG = "rig";
const CREW = "crew";
const BASE = "rig/base";
const UPPER = "rig/upper";
const LOWER = "rig/lower";
const BANNER = "crew/banner";
const FLOOR = "~/floor";
const CEILING = "~/ceiling";

/** The chain base. Bound by `upper`, so it is the one node this rig cannot remove on its own. */
const BASE_TRACK: TrackDefinition = { id: "base" };
const UPPER_TRACK: TrackDefinition = {
  id: "upper",
  keyframes: { fk: { requires: { base: "base" } } },
};
/** The leaf, bound to its parent rather than to the base, so the two removals are ordered. */
const LOWER_TRACK: TrackDefinition = {
  id: "lower",
  keyframes: { fk: { requires: { base: "upper" } } },
};
/** A second motion's only child, so destroying that motion needs one removal before it. */
const BANNER_TRACK: TrackDefinition = { id: "banner" };
const FLOOR_TRACK: TrackDefinition = { id: "floor" };
const CEILING_TRACK: TrackDefinition = { id: "ceiling" };

const PROJECT: ProjectDefinition = {
  schemaVersion: 5,
  motions: [
    { id: RIG, trigger: { type: "manual" }, tracks: [BASE_TRACK, UPPER_TRACK, LOWER_TRACK] },
    { id: CREW, trigger: { type: "manual" }, tracks: [BANNER_TRACK] },
  ],
  freeTracks: [FLOOR_TRACK, CEILING_TRACK],
};

const compose = (node: { id: string }) => () => ({
  values: { node: node.id },
  sourceProgress: 0,
  sourceRevisions: {},
});

type Hooks = Pick<ProjectRuntimeOptions, "createMotion" | "compileTrack">;

function runtime(hooks: Hooks = {}): EnumeratingRuntime {
  return new ProjectRuntime(PROJECT, {
    clock: createManualClock(),
    compose,
    ...hooks,
  }) as EnumeratingRuntime;
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

const EXTRA_MOTION = { id: "extra", trigger: { type: "manual" as const }, tracks: [] };

describe("a loaded project is enumerable through its own API", () => {
  it("RA-145 answers every motion, every free track, and nothing mounted at all", () => {
    const project = runtime();

    // Committed order, which is authored order on a project nothing has edited yet. Total across
    // the two track answers: every node this document holds is in exactly one of them, and the
    // owned half stays the answer `MotionHandle.trackIds` already gave rather than being restated
    // here.
    expect(project.motionIds()).toEqual([RIG, CREW]);
    expect(project.freeTrackIds()).toEqual([FLOOR, CEILING]);
    expect(project.motion(RIG).trackIds).toEqual([BASE, UPPER, LOWER]);
    expect(project.motion(CREW).trackIds).toEqual([BANNER]);

    // Load mounts nothing, which is the whole reason both demos carry a mount loop, and the reason
    // that loop had a second copy of the document's ids to loop over.
    expect(project.mountedNodeIds()).toEqual([]);
    expect(project.instanceCount).toBe(0);

    project.dispose();
  });

  it("RA-146 answers a frozen copy rather than a view of the collection behind it", () => {
    const project = runtime();
    const mounted = project.mountedNodeIds();
    const motions = project.motionIds();

    project.mount(BASE);
    project.addMotion(EXTRA_MOTION);

    // A copy, so an answer a caller kept cannot change under it, and frozen, so the caller cannot
    // edit the answer either. A live view of the instance map or of the motion map would read the
    // new state through both of these, and neither assertion could tell the two apart otherwise.
    expect(mounted).toEqual([]);
    expect(motions).toEqual([RIG, CREW]);
    expect(Object.isFrozen(mounted)).toBe(true);
    expect(Object.isFrozen(motions)).toBe(true);
    expect(Object.isFrozen(project.freeTrackIds())).toBe(true);
    expect(() => (motions as string[]).push("nope")).toThrow(TypeError);

    // And the accepting direction in the same rig: the next call does answer the new state.
    expect(project.motionIds()).toEqual([RIG, CREW, "extra"]);
    expect(project.mountedNodeIds()).toEqual([BASE]);

    project.dispose();
  });

  it("RA-147 moves the mounted set on mount and unmount, in mount order", () => {
    const project = runtime();

    project.mount(LOWER);
    project.mount(FLOOR);

    // Mount order rather than committed order, because this one answers a membership the caller
    // built rather than a document the loader read.
    expect(project.mountedNodeIds()).toEqual([LOWER, FLOOR]);

    project.unmount(LOWER);

    expect(project.mountedNodeIds()).toEqual([FLOOR]);

    // Unmounting a node that was never mounted is already a no-op, so the answer may not move for
    // it.
    project.unmount(BASE);

    expect(project.mountedNodeIds()).toEqual([FLOOR]);

    project.dispose();
  });

  it("RA-148 answers the pending pair inside an open recipe and the committed pair after", () => {
    const project = runtime();

    const seen = project.edit((transaction) => {
      const late = transaction.addTrack({ id: "late" });
      transaction.addMotion(EXTRA_MOTION);
      return {
        id: late.id,
        motions: project.motionIds(),
        free: project.freeTrackIds(),
        mounted: project.mountedNodeIds(),
      };
    });

    // A structural read inside a recipe resolves against what that recipe staged, which is what
    // `#readTracks` and `#readMotions` already answer for every other structural read. A reader
    // that resolved against the retained pair here would be a second definition of "now".
    expect(seen.motions).toEqual([RIG, CREW, "extra"]);
    expect(seen.free).toEqual([FLOOR, CEILING, "~/late"]);

    // The mounted set is not transactional and may not pretend to be: the mount of an added node is
    // a settle step of the commit that accepts it, so nothing is mounted while the recipe is open.
    expect(seen.mounted).toEqual([]);
    expect(seen.id).toBe("~/late");

    expect(project.motionIds()).toEqual([RIG, CREW, "extra"]);
    expect(project.freeTrackIds()).toEqual([FLOOR, CEILING, "~/late"]);
    expect(project.mountedNodeIds()).toEqual(["~/late"]);

    project.dispose();
  });

  it("RA-149 leaves all three answering the retained pair when a recipe throws", () => {
    const project = runtime();
    const failure = new Error("recipe failed");

    expect(() =>
      project.edit((transaction) => {
        transaction.addTrack({ id: "late" });
        transaction.addMotion(EXTRA_MOTION);
        throw failure;
      }),
    ).toThrow(failure);

    // An aborted recipe adopts nothing, so these read the pair that was never replaced rather than
    // a pending one the recipe abandoned.
    expect(project.motionIds()).toEqual([RIG, CREW]);
    expect(project.freeTrackIds()).toEqual([FLOOR, CEILING]);
    expect(project.mountedNodeIds()).toEqual([]);

    project.dispose();
  });

  it("RA-150 answers the retained pair inside a commit's own hook and is not refused there", () => {
    let project!: EnumeratingRuntime;
    const seen: { motions?: readonly string[]; free?: readonly string[] } = {};
    project = runtime({
      createMotion: () => {
        seen.motions = project.motionIds();
      },
      compileTrack: () => {
        seen.free = project.freeTrackIds();
      },
    });

    project.addMotion(EXTRA_MOTION);
    project.addTrack({ id: "late" });

    // A hook is caller code the commit is still inside, and reading from one is free: a mutation is
    // `schema-commit-reentrant` at that depth and a read is not. What it answers is the retained
    // pair, because the commit holds its candidate in a local nothing else can read until adoption.
    // That is the documented staleness rather than a defect, and asserting it is what keeps it
    // documented.
    expect(seen.motions).toEqual([RIG, CREW]);
    expect(seen.free).toEqual([FLOOR, CEILING]);

    // The accepting direction, in the same rig: once the commit returned, both answers moved.
    expect(project.motionIds()).toEqual([RIG, CREW, "extra"]);
    expect(project.freeTrackIds()).toEqual([FLOOR, CEILING, "~/late"]);

    project.dispose();
  });

  it("RA-151 drops a removed track and a destroyed motion from the answers", () => {
    const project = runtime();

    project.track(FLOOR).remove();

    expect(project.freeTrackIds()).toEqual([CEILING]);
    // A track removal is not a motion change, so this answer may not move for it.
    expect(project.motionIds()).toEqual([RIG, CREW]);

    project.edit(() => {
      project.track(BANNER).remove();
      project.motion(CREW).destroy();
    });

    expect(project.motionIds()).toEqual([RIG]);
    expect(project.freeTrackIds()).toEqual([CEILING]);
    expect(project.mountedNodeIds()).toEqual([]);

    project.dispose();
  });

  it("RA-152 removes a chain parent-first or leaf-first in one recipe at one replacement", () => {
    const answers: { tracks: readonly string[]; free: readonly string[]; replaced: number }[] = [];

    for (const order of [
      [UPPER, LOWER],
      [LOWER, UPPER],
    ]) {
      const project = runtime();
      const replaced = vi.spyOn(project.graph, "replaceGraph");

      project.edit(() => {
        for (const node of order) project.track(node).remove();
      });

      answers.push({
        tracks: project.motion(RIG).trackIds,
        free: project.freeTrackIds(),
        replaced: replaced.mock.calls.length,
      });
      project.dispose();
    }

    // The claim the issue thread left owed to a test rather than to a read: one recipe derives from
    // the final pair rather than from an accumulated operation log and replaces the graph exactly
    // once, so the intermediate candidate in which `lower` still binds a removed `upper` is never
    // built and the reference check never gets to refuse it. Parent-first is therefore legal, and
    // the two orders are compared against each other rather than against a hand-written
    // expectation, because order independence is the claim and a literal on both sides would not be
    // it.
    expect(answers[0]).toEqual(answers[1]);
    expect(answers[0]!.tracks).toEqual([BASE]);
    expect(answers[0]!.replaced).toBe(1);
  });

  it("RA-153 refuses every reader on a disposed project, deferred release included", () => {
    let project!: EnumeratingRuntime;
    let deferred: unknown;
    project = runtime({
      createMotion: () => {
        project.dispose();
        deferred = thrownBy(() => project.mountedNodeIds());
      },
    });

    // Disposal asked for from inside a hook marks the runtime dead immediately and defers the
    // release, so the retained maps and the instance map are still populated on the line after it.
    // A reader that inferred liveness from an empty map would answer here, which is exactly the
    // inference `Handle.live` was stopped from making.
    const refused = thrownBy(() => project.addMotion(EXTRA_MOTION));

    expect(refused).toBeInstanceOf(Error);
    expect(deferred).toBeInstanceOf(Error);
    expect((deferred as Error).message).toContain("disposed");

    // And after the release, on the same rung `dependantsOf` uses: the plain disposed-runtime error
    // rather than a stale-handle one, because a reader holds no token and there is nothing here to
    // go stale. All three, because a rung asserted at one member is asserted at one member.
    for (const read of [
      () => project.motionIds(),
      () => project.freeTrackIds(),
      () => project.mountedNodeIds(),
    ]) {
      const thrown = thrownBy(read);

      expect(thrown).toBeInstanceOf(Error);
      expect((thrown as Error).message).toContain("disposed");
    }
  });
});
