import { describe, expect, it } from "vitest";
import type { ProjectDefinition, TrackDefinition } from "../../../src/contract/v5";
import { Engine, type ProjectHandle } from "../../../src/engine";
import { PluginRegistry } from "../../../src/domain/plugins";
import { transformPlugin } from "../../../src/plugins/transform";
import { createManualClock } from "../../../src/ports/clock";
import { ProjectRuntime } from "../../../src/runtime/project-runtime";
import { createFakeInterpolator, createFakeScheduler } from "../../../src/testing/fakes";

/**
 * Issue #223, part 6 of the re-review: the deferral with no owner, decided as a refusal.
 *
 * A2 made every structural commit seed one flush, so a node added at runtime publishes at rest. A
 * loaded project publishes nothing until something ticks. Whether `Engine.load()` should seed a
 * flush too was recorded as unasked, and part 6 asked for that sentence to become either its own
 * issue or an explicit refusal. It is the refusal, and both halves of it are here.
 *
 * The reason is not the one this slice first wrote down. It prescribed a seed at the mount, on the
 * argument that a node mounted by a commit is seeded by `#apply` while a node mounted by a caller
 * is seeded by nobody, and that the asymmetry was a defect. That prescription was implemented and
 * measured, and the measurement refused it: run 33712936651 turned 21 cases red across 12 files.
 * Three of those are the answer.
 *
 * First, `T-1` asserts that a loaded project publishes nothing before its driver has run, and
 * `SESSION-STATUS.md` records that asymmetry as real and owned rather than pending. A seed at the
 * mount contradicts an owned decision rather than completing one.
 *
 * Second, `trigger-time.test.ts` owns "does not emit before the first tick", which is a promise
 * about drivers rather than about publication: a mount happens before any tick, so a time Motion
 * that published at its mount would emit a progress its driver never produced.
 *
 * Third, and the finding that settles it, a seed at the mount does not add a publication. It
 * **steals the next one**. `PatchRegistry.publish` drops a candidate through `samePatch`, so the `seek`
 * that follows a mount publishes nothing new and the batch its caller reads is empty.
 * Eighteen of the 21 failures are exactly that, `RA-8` among them, which is A2's own evidence. A
 * caller that mounts and then seeks would silently lose the patch it used to be handed.
 *
 * So load seeds nothing because there is no member to publish to and an empty seed set is not a
 * cheap flush, and the mount seeds nothing because the first real operation on a node is what
 * carries its first patch. `RA-101` is the case that fails if either half is added back, and it
 * fails on the theft rather than on the publication, which no counter would have caught.
 *
 * `RA-8` through `RA-13` own what a structural commit seeds. Nothing here restates them: what these
 * three add is what a mount and a load deliberately do not owe.
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
/** A real load, because what the refusal is about is the node a document brought with it. */
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

describe("what a load and a mount deliberately do not publish", () => {
  it("RA-100 seeds no flush at the load and none at the mount", () => {
    const project = runtime();

    // Load seeds nothing, and that is a refusal rather than an omission: there is no member to
    // publish to yet, and an empty seed set still opens a batch, notifies every batch subscriber
    // and moves the sequence, which is why a commit with nothing to publish does not call
    // `invalidate` at all. See `RA-10`.
    expect(project.graph.sequence).toBe(0);
    expect(project.graph.memberCount).toBe(0);
    expect(project.graph.registry.get(NODE)).toBeUndefined();

    project.mount(NODE);

    // And the mount seeds nothing either. A member now exists, so this is the half that looked like
    // a defect and is not: the first operation on this node is what publishes it, and a flush here
    // would take that publication rather than add one. See `RA-101`.
    expect(project.graph.memberCount).toBe(1);
    expect(project.graph.sequence).toBe(0);
    expect(project.graph.registry.get(NODE)).toBeUndefined();

    project.dispose();
  });

  it("RA-101 hands the first patch to the first operation rather than to the mount", () => {
    const handle = load();
    handle.mount(HIP);

    // Nothing yet, which `T-1` owns as parity of the progression a driver produced rather than of
    // the batches it arrived in, and which `trigger-time.test.ts` owns as a promise that a time
    // Motion does not emit before its first tick.
    expect(handle.get(HIP)).toBeUndefined();

    const batch = handle.seek(HIP, 0);
    const published = batch.patches.find(({ nodeId }) => nodeId === HIP);

    // The theft case, and the one that decided this refusal. `PatchRegistry.publish` drops a
    // candidate through `samePatch`, so a mount that published these same values first would leave
    // this batch empty and the caller reading `undefined` where it used to read its patch. That is
    // silent, it is public, and 18 of the 21 cases a mount seed turned red are this shape.
    expect(published?.status).toBe("ready");
    expect(published?.values).toMatchObject({ x: 100, y: 200 });
    expect(handle.get(HIP)?.values).toEqual(published?.values);

    handle.dispose();
  });

  it("RA-102 leaves a structural add at exactly one flush", () => {
    const project = runtime();
    project.mount(NODE);
    const before = project.graph.sequence;

    project.addTrack(ADDED);

    // One, and this is the half of the original prescription that survives as a guard. A commit
    // mounts the node it added through `#mountNode` and `#apply` already seeds that node into the
    // single flush the commit ends at, so a seed placed at the attach would give every structural
    // add in the project a second flush. Nothing else in the suite counts this.
    expect(project.graph.sequence).toBe(before + 1);
    expect(project.graph.registry.get(OTHER)).toBeDefined();

    project.dispose();
  });
});
