import { describe, expect, it } from "vitest";
import type { ProjectDefinition, TrackDefinition } from "../../../src/contract/v5";
import { Engine, type ProjectHandle } from "../../../src/engine";
import { PluginRegistry } from "../../../src/domain/plugins";
import { transformPlugin } from "../../../src/plugins/transform";
import { createManualClock } from "../../../src/ports/clock";
import { ProjectRuntime } from "../../../src/runtime/project-runtime";
import { createFakeInterpolator, createFakeScheduler } from "../../../src/testing/fakes";

/**
 * Issue #223, part 6 of the re-review: the deferral with no owner.
 *
 * A2 made every structural commit seed one flush, so a node added at runtime publishes at rest. A
 * loaded project publishes nothing until something ticks, and whether `Engine.load()` should seed a
 * flush too was recorded as unasked and stayed unasked. The reason given for not deciding was that
 * load has no members yet when it would seed, and that reason is about ordering rather than about
 * whether the answer should be yes, which is what made it a deferral rather than a refusal.
 *
 * Decided here, and the ordering is the answer rather than the obstacle. Load genuinely has nothing
 * to publish to: `#members` is empty until something mounts, and A2 already established that an
 * empty seed set is not a cheap flush, so a seed at load would open a batch, notify every batch
 * subscriber and move the sequence to say nothing. The member arrives at `mount`, so that is where
 * the seed belongs, and the asymmetry was never about load at all: it was that a node mounted by a
 * commit is seeded by `#apply` while a node mounted by a caller is seeded by nobody.
 *
 * The evidence that this is the real shape of it is already in the suite. Every rig that loads a
 * project and reads a patch calls `seek` first, `RA-59`'s oracle included, and that `seek` is not
 * about scrubbing: it is there because a mounted node publishes nothing on its own.
 *
 * `RA-8` through `RA-13` own that a structural commit seeds one flush and that a commit with
 * nothing to publish seeds none. Neither is restated here. What these add is the one mount that a
 * commit does not perform, and `RA-102` is the case that fails if the seed is put at the attach
 * rather than at the public verb, which would give every structural add two flushes.
 */

const NODE = "~/a";
const OTHER = "~/b";
const PROJECT: ProjectDefinition = {
  schemaVersion: 5,
  motions: [],
  freeTracks: [{ id: "a" }],
};
const ADDED: TrackDefinition = { id: "b" };
const compose = (node: { id: string }) => () => ({
  values: { node: node.id },
  sourceProgress: 0,
  sourceRevisions: {},
});

function runtime(): ProjectRuntime {
  return new ProjectRuntime(PROJECT, { clock: createManualClock(), compose });
}

const HIP = "rig/hip";
const HIP_TRACK: TrackDefinition = {
  id: "hip",
  keyframes: { transform: { values: { x: 100, y: 200, rotation: 0 } } },
};
/** A real load, because the parity this decides is between a loaded node and an added one. */
function load(): ProjectHandle {
  const plugins = new PluginRegistry();
  plugins.register(transformPlugin);
  return new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
    plugins,
  }).load({
    schemaVersion: 5,
    motions: [{ id: "rig", trigger: { type: "manual" }, tracks: [HIP_TRACK] }],
  });
}

describe("a node publishes at rest whichever way it arrived", () => {
  it("RA-100 seeds one flush at the mount and none at the load", () => {
    const project = runtime();

    // Load seeds nothing, and that is the refusal half of this decision rather than an omission.
    // There is no member to publish to yet, and an empty seed set still opens a batch and moves the
    // sequence, so a commit with nothing to publish does not call `invalidate` at all. See `RA-10`.
    expect(project.graph.sequence).toBe(0);
    expect(project.graph.memberCount).toBe(0);
    expect(project.graph.registry.get(NODE)).toBeUndefined();

    project.mount(NODE);

    // One flush, seeded with the node that just became a member. No tick has happened and the clock
    // is manual, so a published patch here can only have come from the mount.
    expect(project.graph.sequence).toBe(1);
    expect(project.graph.registry.get(NODE)).toBeDefined();

    project.dispose();
  });

  it("RA-101 publishes the same patch a seek used to be needed to produce", () => {
    const handle = load();

    handle.mount(HIP);

    // The oracle rather than a counter. A sequence that moved proves a flush happened; only the
    // patch proves the flush was about this node and carried the values it composes. Every rig in
    // this suite that loads and reads has a `seek` in front of it for exactly this reason.
    const mounted = handle.get(HIP);
    expect(mounted?.status).toBe("ready");
    expect(mounted?.values).toMatchObject({ x: 100, y: 200 });

    // And the seek is now redundant rather than load-bearing: it publishes the same values, so
    // nothing that already calls it changes behaviour and no existing expectation moves.
    handle.seek(HIP, 0);
    expect(handle.get(HIP)?.values).toEqual(mounted?.values);

    handle.dispose();
  });

  it("RA-102 leaves a structural add at exactly one flush", () => {
    const project = runtime();
    project.mount(NODE);
    const before = project.graph.sequence;

    project.addTrack(ADDED);

    // One, not two. A commit mounts the node it added through `#mountNode`, and `#apply` already
    // seeds that node into the single flush the commit ends at, so the seed belongs at the public
    // verb and never at the attach. Putting it at the attach is the named mutation target for this
    // slice: it goes green on `RA-100` and red here, and it would give every structural add in the
    // project a second flush nothing asked for.
    expect(project.graph.sequence).toBe(before + 1);
    expect(project.graph.registry.get(OTHER)).toBeDefined();

    project.dispose();
  });
});
