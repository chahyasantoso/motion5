// @ts-nocheck
import { describe, expect, it } from "vitest";
import type {
  MotionDefinition,
  ProjectDefinition,
  TrackDefinition,
} from "../../../src/contract/v5";
import { createManualClock } from "../../../src/ports/clock";
import { ProjectRuntime } from "../../../src/runtime/project-runtime";

const MOTION_ID = "hero";
const ARM_ID = "hero/arm";
const LEG_ID = "hero/leg";
const HAND_ID = "hero/hand";
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
const compose = (node: { id: string }) => () => ({
  outputs: { values: { [node.id]: 1 } },
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
    if (patch?.status !== "blocked")
      throw new Error(`${HAND_ID} is ${patch?.status ?? "absent"}, not blocked.`);
    // And the diagnostic reaches the one inspection surface, by identity, so a structural commit
    // cannot flush a diagnosis into nowhere.
    expect(runtime.diagnostics.entries).toHaveLength(1);
    expect(runtime.diagnostics.entries[0]).toBe(patch.diagnostics[0]);

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
});
