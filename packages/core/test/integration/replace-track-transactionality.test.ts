import { describe, expect, it } from "vitest";
import type { ProjectDefinition, TrackDefinition } from "../../src/contract/v5";
import { PluginRegistry } from "../../src/domain/plugins";
import { Engine, type ProjectHandle } from "../../src/engine";
import { transformPlugin } from "../../src/plugins/transform";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/ports/fakes";

/**
 * Issue #176. `ProjectRuntime.#replaceTrack` committed the candidate graph first and only then
 * disposed the live compiled Track, compiled the replacement, wrote its own entry, and told the
 * owning Motion. Every one of those steps can fail on its own, so a refused replacement left the
 * project half changed: a committed graph whose node had no compiled Track at all, or a graph and
 * a compiled map that had moved on while the Motion still held the previous entry.
 *
 * `#addTrack` directly above it is the model. It prepares the compiled form first and undoes it
 * when the candidate graph rejects, which is the order this suite pins for replacement too.
 * See ADR-045.
 */

const NODE_ID = "scene/arm";

function ramp(from: number, to: number) {
  return {
    stops: [
      { p: 0, v: from },
      { p: 1, v: to },
    ],
  };
}
function armTrack(from: number, to: number): TrackDefinition {
  return { id: "arm", keyframes: { x: ramp(from, to) } };
}
/**
 * Accepted by `validateTrackDefinition`, which is registry-free, and refused by the resolver, which
 * is not: `nope` is a structurally valid plugin group naming no registered plugin. That is the
 * recompile failure the issue reproduces, and the reason a compile step cannot be treated as
 * infallible once the graph is already committed.
 */
const UNRESOLVABLE: TrackDefinition = {
  id: "arm",
  keyframes: { nope: { x: ramp(0, 250) } },
};
/** Refused by `Motion.replaceTrack`, one step after the recompile has already succeeded. */
const REFUSED_BY_MOTION: TrackDefinition = {
  id: "arm",
  duration: 0,
  keyframes: { x: ramp(0, 400) },
};

function load(): ProjectHandle {
  const plugins = new PluginRegistry();
  plugins.register(transformPlugin);
  const project: ProjectDefinition = {
    schemaVersion: 5,
    projectId: "replace-transactionality",
    motions: [{ id: "scene", trigger: { type: "manual" }, tracks: [armTrack(0, 100)] }],
  };
  const handle = new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
    plugins,
  }).load(project);
  handle.mount(NODE_ID);
  return handle;
}
/**
 * Seeks the node and returns what it published, asserting the flush itself was clean.
 *
 * One helper, because "the node still composes" is the same question in every case below, and a
 * missing compiled Track answers it as an `error` patch rather than as a throw: the publisher
 * catches a failed composition and publishes `composition-failure` for that node.
 */
function valuesAfterSeek(handle: ProjectHandle, progress: number): unknown {
  const batch = handle.seek(NODE_ID, progress);
  expect(batch.patches.some(({ status }) => status === "error")).toBe(false);
  return handle.get(NODE_ID)?.values;
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

describe("a refused Track replacement commits nothing", () => {
  it("U-1 keeps the live compiled Track when the recompile is refused", () => {
    const handle = load();

    const thrown = thrownBy(() => handle.track(NODE_ID).replace(UNRESOLVABLE));

    expect((thrown as Error).message).toMatch(/^plugin-unknown-key at /);
    // Red on the parent: the graph was already replaced and the live Track already disposed, so
    // the next flush resolved nothing and published a composition failure instead of a value.
    expect(valuesAfterSeek(handle, 0.5)).toEqual({ x: 50 });
    expect(handle.track(NODE_ID).track).toEqual(armTrack(0, 100));

    handle.dispose();
  });

  it("U-2 leaves a refused recompile retryable rather than stranding the node", () => {
    // Green on the parent by design. The compiled slot was left empty rather than poisoned, so a
    // second replacement could still fill it. It is the guard the fix must not break: refusing a
    // replacement keeps the previous definition live, it does not freeze the node onto it.
    const handle = load();

    expect(() => handle.track(NODE_ID).replace(UNRESOLVABLE)).toThrow(/plugin-unknown-key/);
    handle.track(NODE_ID).replace(armTrack(0, 200));

    expect(valuesAfterSeek(handle, 0.5)).toEqual({ x: 100 });
    expect(handle.track(NODE_ID).track).toEqual(armTrack(0, 200));

    handle.dispose();
  });

  it("U-3 changes nothing when the owning Motion refuses the replacement", () => {
    const handle = load();

    const thrown = thrownBy(() => handle.track(NODE_ID).replace(REFUSED_BY_MOTION));

    expect((thrown as Error).message).toMatch(/must be a finite positive number/);
    // Red on the parent twice over: the graph, the compiled Track, and the runtime's own entry had
    // all moved to a definition the Motion then refused, so the handle reported a replacement that
    // never took effect and the node composed values nothing had accepted.
    expect(handle.track(NODE_ID).track).toEqual(armTrack(0, 100));
    expect(valuesAfterSeek(handle, 0.5)).toEqual({ x: 50 });

    handle.dispose();
  });

  it("U-4 changes nothing when the candidate graph refuses a derived observation", () => {
    // Green on the parent: a rejected candidate graph threw before the parent reached its dispose
    // and compile steps at all. Pinned here so the reordering cannot regress the one refusal that
    // replacement already handled correctly.
    const handle = load();
    const observation = { source: "scene/missing", role: "input" } as const;

    const thrown = thrownBy(() => handle.track(NODE_ID).addObserve(observation));

    expect((thrown as Error).message).toMatch(/^observation-unknown-source at /);
    expect(handle.track(NODE_ID).track.observes).toBeUndefined();
    expect(valuesAfterSeek(handle, 0.5)).toEqual({ x: 50 });

    handle.dispose();
  });
});
