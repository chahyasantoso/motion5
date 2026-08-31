import { describe, expect, it } from "vitest";
import type {
  MotionDefinition,
  ProjectDefinition,
  TrackDefinition,
} from "../../../src/contract/v5";
import { createManualClock } from "../../../src/ports/clock";
import { ProjectRuntime } from "../../../src/runtime/project-runtime";

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
});
