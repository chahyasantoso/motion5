import { describe, expect, it } from "vitest";
import type {
  MotionDefinition,
  ProjectDefinition,
  TrackDefinition,
} from "../../../src/contract/v5";
import { createManualClock } from "../../../src/ports/clock";
import {
  ProjectRuntime,
  type ProjectRuntimeOptions,
  type StagedTrack,
} from "../../../src/runtime/project-runtime";
// The project's own describer rather than a copy of it here, on the reason the same import in
// `structural-commit-path.test.ts` already gives: how a thrown value that is not an `Error` reads has
// an owner, and a second spelling of it in this file could disagree with the first.
import { describeError } from "../../../src/runtime/schema-refusals";

/**
 * Issue #223, slice A2.
 *
 * A structural commit ends at one flush. Every one of the five paths reached `replaceGraph` and
 * stopped there, and `replaceGraph` commits a snapshot without seeding anything, so a project
 * whose structure was built after load published nothing until something unrelated ticked, and
 * `addObserve` on a manual clock with no tick was invisible forever. That is exactly what "build a
 * project's structure up incrementally from nothing, driven by runtime code" needs and did not
 * have.
 *
 * `RA-1` through `RA-7` in `structural-commit-path.test.ts` own the order a commit applies its
 * effects and reverts them, and they are equivalence evidence by construction: they assert no
 * patch. These own whether it publishes at all, which is a behaviour change and has a failing run
 * of its own. Neither file restates the other.
 *
 * `RA-131` through `RA-133` are issue #310's, and they own a second subject on the same contract:
 * what a hook a commit called may publish. `seek`, `invalidate` and both live writes end at their own
 * `invalidate`, and the rung that refuses them inside a recipe reads `#open`, which is `undefined` by
 * construction throughout `#apply`. So a hook could open a batch whose seeds were resolved against the
 * graph the commit has not replaced yet, and `PatchRegistry.publish` then drops a candidate through
 * `samePatch`, so a publication placed in front of the commit's own flush takes that flush rather than
 * adding to it. `RA-11` above pins one flush per structural commit from outside; these pin it from
 * inside.
 *
 * The sequence is the instrument for the same reason `RA-11` uses it, and here that is load-bearing
 * rather than convenient. Two batches where one is empty is a different defect from two batches that
 * both carry values, and no revision in this file can tell them apart: a second publication of values
 * nothing moved is dropped, so the registry reads identically on both sides of the defect while a
 * whole batch has been opened, drained and handed to every subscriber. See ADR-070.
 *
 * The clock is manual and never ticks in any case below. A flush that only happened because a
 * frame arrived would prove nothing about the commit.
 */

const MOTION_ID = "hero";
const ARM_ID = "hero/arm";
const LEG_ID = "hero/leg";
const HAND_ID = "hero/hand";
/** Accepted by the graph, and deliberately never mounted, so it publishes no value of its own. */
const CURSOR_ID = "~/cursor";
const MOTION: MotionDefinition = {
  id: MOTION_ID,
  trigger: { type: "manual" },
  tracks: [{ id: "arm" }, { id: "leg" }],
};
const PROJECT: ProjectDefinition = {
  schemaVersion: 5,
  motions: [MOTION],
  freeTracks: [{ id: "cursor" }],
};
/** Refused by the candidate graph rather than by authored validation, so a commit is attempted. */
const REJECTED_TRACK: TrackDefinition = { id: "hand", observes: [{ source: "~/missing" }] };
/** Observes a node the graph accepted and nothing mounted, so its source publishes nothing. */
const PENDING_TRACK: TrackDefinition = { id: "hand", observes: [{ source: CURSOR_ID }] };
/**
 * One key per node, so an output merge cannot hide a missing publication behind a shared key.
 *
 * Nothing here reads `duration`, which is what `RA-13` relies on: a replacement that changes only
 * the duration composes the same values, and the registry is allowed to drop it.
 */
const compose = (node: { id: string }) => () => ({
  values: { [node.id]: 1 },
  sourceProgress: 0,
  sourceRevisions: {},
});

function create(): ProjectRuntime {
  return new ProjectRuntime(PROJECT, { clock: createManualClock(), compose });
}
/**
 * The refusal a publishing verb asked for from inside a commit answers with, whole.
 *
 * One constant, read by the three cases that assert it, so a refusal that changed its wording fails
 * on the string rather than on a loose match. It is ADR-068's message rather than one of this issue's
 * own: the condition is the same field with the same value and the remedy is the same sentence, so it
 * is the same rule. `structural-commit-path.test.ts` declares the same constant for the same reason,
 * and the two are one message read by two files rather than two owners of it -- `commitInFlight` is
 * the owner, and both files fail if it moves.
 */
const REENTRANT =
  "schema-commit-reentrant: A structural commit is already in flight. Ask for it once this one has returned.";
/** What one hook did to the runtime whose commit it is part of, and what the seams recorded around it. */
interface Intrusion {
  readonly entries: readonly string[];
  /**
   * Hands the rig the runtime its hooks reach back into, and answers it, so a case stays one line.
   *
   * The runtime does not exist until the options it is constructed from do, so a hook that calls back
   * into it cannot close over it directly. Assigned once, immediately after construction, and read
   * only from inside a hook, which is `RA-116`'s shape rather than a second box type declared here.
   */
  readonly adopt: (runtime: ProjectRuntime) => ProjectRuntime;
  readonly options: ProjectRuntimeOptions;
}
/**
 * One ordered journal across the two seams these cases intrude from, plus the intrusion itself.
 *
 * It is not a second batch counter and does not try to be. `runtime.graph.sequence` counts the
 * batches and the registry says what they carried; this orders the intrusion against the hooks around
 * it, which is the only instrument that can see `RA-132`'s subject at all. A `setProgress` reaching
 * the displaced Track between the stage and its commit is a position in a list and is nothing
 * anywhere else, because the composition below does not read progress, so the values that publication
 * carries are the ones already published and `samePatch` drops the candidate.
 *
 * `replaceMotionTrack` is deliberately not wired. It is applied on the replacement path `RA-132`
 * drives, and a line for it would put a hook that case makes no claim about between the two it does.
 */
function intruding(
  from: "compileTrack" | "stageTrack",
  call: (runtime: ProjectRuntime) => unknown,
): Intrusion {
  const entries: string[] = [];
  let host: ProjectRuntime | undefined;
  let intruded = false;
  const record = (line: string): void => {
    entries.push(line);
  };
  /**
   * Once, which is this issue's own reproduction shape rather than a convenience, and swallowed.
   *
   * Once, because whatever an accepted intrusion commits reaches this same hook, so an unbounded one
   * ends a red run on a stack rather than on an assertion that disagreed. Swallowed, because the
   * subject is what the commit publishes and a refusal allowed to escape would fail the effect it is
   * part of, leaving no flush to measure. That a hook may let it escape instead is `RA-118`'s, in the
   * file that owns what a re-entry costs the commit rather than what it costs the publication.
   */
  const intrude = (hook: "compileTrack" | "stageTrack"): void => {
    if (hook !== from || host === undefined || intruded) return;
    intruded = true;
    try {
      call(host);
      record("intrusion accepted");
    } catch (error) {
      record(`intrusion ${describeError(error)}`);
    }
  };
  return {
    get entries() {
      return [...entries];
    },
    adopt: (runtime: ProjectRuntime) => {
      host = runtime;
      return runtime;
    },
    options: {
      clock: createManualClock(),
      compose,
      setProgress: (nodeId, progress) => record(`progress ${nodeId} ${progress}`),
      compileTrack: (_track, nodeId) => {
        record(`compile ${String(nodeId)}`);
        intrude("compileTrack");
      },
      stageTrack: (_track: TrackDefinition, nodeId: string): StagedTrack => {
        record(`stage ${nodeId}`);
        intrude("stageTrack");
        return {
          commit: () => record(`stage-commit ${nodeId}`),
          rollback: () => record(`stage-rollback ${nodeId}`),
        };
      },
    },
  };
}

describe("a structural commit ends at one flush", () => {
  it("RA-8 publishes the observing node when addObserve commits, with no tick", () => {
    const runtime = create();
    runtime.mount(ARM_ID);
    runtime.mount(LEG_ID);
    const registry = runtime.graph.registry;

    expect(registry.get(LEG_ID)).toBeUndefined();

    runtime.track(LEG_ID).addObserve({ source: ARM_ID });

    // The seed is the edited node; the source is pulled in because it is a member with no value
    // yet, which is what lets the observer land on ready rather than on blocked.
    expect(registry.get(LEG_ID)?.status).toBe("ready");
    expect(registry.get(ARM_ID)?.status).toBe("ready");

    runtime.dispose();
  });

  it("RA-9 lands a new node on blocked when its source has published nothing", () => {
    const runtime = create();
    const registry = runtime.graph.registry;

    runtime.addTrack(PENDING_TRACK, { motionId: MOTION_ID });

    // The blast radius, stated as evidence rather than as a footnote: this node previously
    // published nothing at all, and a pending upstream is what it publishes instead.
    const patch = registry.get(HAND_ID);
    expect(patch?.status).toBe("blocked");
    // And the diagnostic reaches the one inspection surface, by identity, so a structural commit
    // cannot flush a diagnosis into nowhere.
    expect(runtime.diagnostics.entries).toHaveLength(1);
    expect(runtime.diagnostics.entries[0]).toBe(patch?.diagnostics[0]);

    runtime.dispose();
  });

  it("RA-10 seeds no flush for a commit that derives no node", () => {
    const runtime = create();
    const before = runtime.graph.sequence;

    runtime.addMotion({ id: "villain", trigger: { type: "manual" }, tracks: [] });
    runtime.destroyMotion("villain");
    runtime.track(LEG_ID).remove();

    // An empty seed set is not a cheap flush: it still opens a batch, notifies every batch
    // subscriber, drains carried seeds, and moves the sequence. A commit with nothing to seed must
    // therefore not call it, which is what the sequence pins.
    expect(runtime.graph.sequence).toBe(before);
    expect(runtime.graph.registry.get(LEG_ID)).toBeUndefined();

    runtime.dispose();
  });

  it("RA-11 seeds exactly one flush per structural commit, and none for a no-op", () => {
    const runtime = create();
    runtime.mount(ARM_ID);
    const before = runtime.graph.sequence;

    runtime.addTrack({ id: "hand" }, { motionId: MOTION_ID });
    expect(runtime.graph.sequence).toBe(before + 1);

    runtime.track(HAND_ID).replace({ id: "hand", duration: 250 });
    expect(runtime.graph.sequence).toBe(before + 2);

    // addObserve is one replacement, so it is one flush rather than two.
    runtime.track(HAND_ID).addObserve({ source: ARM_ID });
    expect(runtime.graph.sequence).toBe(before + 3);

    // A redundant add commits nothing, so it seeds nothing. Idempotence is answered before the
    // commit path is reached, and the flush must not outlive that answer.
    runtime.track(HAND_ID).addObserve({ source: ARM_ID });
    expect(runtime.graph.sequence).toBe(before + 3);

    runtime.dispose();
  });

  it("RA-12 seeds no flush when the graph refuses the candidate", () => {
    const runtime = create();
    const before = runtime.graph.sequence;

    expect(() => runtime.addTrack(REJECTED_TRACK, { motionId: MOTION_ID })).toThrow(
      /^observation-unknown-source at /,
    );

    expect(runtime.graph.sequence).toBe(before);
    expect(runtime.graph.registry.get(HAND_ID)).toBeUndefined();
    expect(runtime.diagnostics.entries).toHaveLength(0);

    runtime.dispose();
  });

  it("RA-13 publishes no patch for a commit that changed no composed value", () => {
    const runtime = create();
    runtime.mount(ARM_ID);

    runtime.track(ARM_ID).replace({ id: "arm", duration: 100 });
    expect(runtime.graph.registry.get(ARM_ID)?.revision).toBe(1);

    runtime.track(ARM_ID).replace({ id: "arm", duration: 250 });

    // The flush happened and the candidate was dropped, because this composition does not read
    // duration. Seeding a flush is not the same claim as publishing a patch, and the registry is
    // still the one owner of the second.
    expect(runtime.graph.registry.get(ARM_ID)?.revision).toBe(1);

    runtime.dispose();
  });

  it("RA-131 refuses an invalidate a commit's own hook asks for, and keeps its own flush", () => {
    const rig = intruding("compileTrack", (runtime) => runtime.invalidate([ARM_ID]));
    const runtime = rig.adopt(new ProjectRuntime(PROJECT, rig.options));
    const registry = runtime.graph.registry;
    runtime.mount(ARM_ID);

    // One flush ahead of the subject, through the same verb the hook is refused for, so this case
    // carries its own accepting direction: `invalidate` is legal here and refused there, and the only
    // difference is that a commit is in flight. Nothing about the verb or the node moved.
    runtime.invalidate([ARM_ID]);
    expect(registry.get(ARM_ID)?.revision).toBe(1);
    const before = runtime.graph.sequence;

    runtime.addTrack({ id: "hand" }, { motionId: MOTION_ID });

    expect(rig.entries).toEqual(["compile hero/hand", `intrusion ${REENTRANT}`]);

    // One flush per structural commit, pinned from inside the commit rather than from outside it,
    // which is the half `RA-11` cannot reach. Before this slice the hook's own batch opens here and
    // the sequence moves twice.
    expect(runtime.graph.sequence).toBe(before + 1);

    // And the commit's own flush is the one that published. This is also why the sequence above had
    // to be the instrument: the hook seeds a node whose composed values nothing moved, so `samePatch`
    // drops that candidate and both revisions below read 1 on either side of the defect.
    expect(registry.get(HAND_ID)?.revision).toBe(1);
    expect(registry.get(ARM_ID)?.revision).toBe(1);

    runtime.dispose();
  });

  it("RA-132 refuses a seek from a stageTrack hook, so the displaced Track is never re-seeked", () => {
    const rig = intruding("stageTrack", (runtime) => runtime.seek(ARM_ID, 0.5));
    const runtime = rig.adopt(new ProjectRuntime(PROJECT, rig.options));
    runtime.mount(ARM_ID);
    const before = runtime.graph.sequence;

    runtime.track(ARM_ID).replace({ id: "arm", duration: 500 });

    // The sharpest single measurement in this issue, and it is a position rather than a value. The
    // staged Track has not been committed when this hook runs, because `staged.commit()` is a settle
    // step, so a seek accepted here writes the progress the caller asked for onto the Track the commit
    // is replacing and publishes the displaced values. After the slice there is nothing at all between
    // the stage and its commit.
    expect(rig.entries).toEqual([
      "stage hero/arm",
      `intrusion ${REENTRANT}`,
      "stage-commit hero/arm",
    ]);
    expect(rig.entries).not.toContain("progress hero/arm 0.5");

    // One flush, and the replacement still lands whole, which is the other half: a refusal the hook
    // kept to itself costs the commit it is part of nothing at all.
    expect(runtime.graph.sequence).toBe(before + 1);
    expect(runtime.track(ARM_ID).definition).toEqual({ id: "arm", duration: 500 });

    runtime.dispose();
  });

  it("RA-133 refuses a seed for the node the commit is adding, and publishes that node anyway", () => {
    const rig = intruding("compileTrack", (runtime) => runtime.invalidate([HAND_ID]));
    const runtime = rig.adopt(new ProjectRuntime(PROJECT, rig.options));
    const registry = runtime.graph.registry;
    const before = runtime.graph.sequence;

    runtime.addTrack({ id: "hand" }, { motionId: MOTION_ID });

    // The version where the seed names a node the candidate graph does not have. The compile has
    // already written this node into the compiled map and `replaceGraph` has not run, so the publisher
    // is asked to walk a node it cannot find: harmless by ADR-051's amendment, and still a whole
    // batch. Refused by the same one condition, which does not read the seed.
    expect(rig.entries).toEqual(["compile hero/hand", `intrusion ${REENTRANT}`]);
    expect(runtime.graph.sequence).toBe(before + 1);

    // The half the refusal may not cost. `RA-9`'s publication of a newly added node is the commit's
    // own, seeded by `#derive`, and it is still there.
    expect(registry.get(HAND_ID)?.revision).toBe(1);

    runtime.dispose();
  });
});
