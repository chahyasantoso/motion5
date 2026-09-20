import { describe, expect, it } from "vitest";
import type { LivePatch, Patch } from "../../../src/contract/v5";
import { PatchRegistry, liveOrAbsent } from "../../../src/runtime/patch-registry";

const NODE_ID = "hero/arm";

function live(status: LivePatch["status"]): LivePatch {
  return {
    nodeId: NODE_ID,
    revision: 1,
    values: { opacity: 1 },
    sourceProgress: 0,
    sourceRevisions: {},
    status,
    diagnostics: [],
  };
}

const TERMINAL: Patch = { nodeId: NODE_ID, revision: 2, status: "destroyed" };

/**
 * The read-side partition of `Patch`, exercised directly rather than through the one consumer that
 * used to spell it.
 *
 * `PatchRegistry.get`, `ProjectHandle.get` and `PatchSource.get` all answer `LivePatch | undefined`,
 * and the React store turns a delivered terminal patch into the same absence. That is one question
 * with one answer, so the function that answers it is tested where it lives instead of only through
 * a React renderer three packages away, which is where the equivalent expression was pinned before.
 */
describe("the live-or-absent partition of a published patch", () => {
  it("answers every live variant with the patch it was handed, by identity", () => {
    for (const status of ["ready", "blocked", "error"] as const) {
      const patch = live(status);
      // Identity rather than equality: the registry freezes and retains one object per revision, and
      // a collapse that copied would break the snapshot stability `useSyncExternalStore` needs.
      expect(liveOrAbsent(patch), status).toBe(patch);
    }
  });

  it("answers the terminal variant with absence, which is the whole of what it decides", () => {
    expect(liveOrAbsent(TERMINAL)).toBeUndefined();
  });

  it("agrees with what the registry can still be asked for, at both ends of one eviction", () => {
    const registry = new PatchRegistry();
    const delivered: Patch[] = [];
    registry.subscribeNode(NODE_ID, (patch) => delivered.push(patch));

    registry.beginBatch(1, [NODE_ID]);
    registry.publish({
      nodeId: NODE_ID,
      values: { opacity: 1 },
      sourceProgress: 0,
      status: "ready",
    });
    registry.closeBatch();

    const published = delivered.at(-1);
    if (published === undefined) throw new Error("The ready publication was not delivered.");
    // While the node exists the two ends say the same thing, and the collapse is the identity.
    expect(liveOrAbsent(published)).toBe(registry.get(NODE_ID));

    registry.evict(NODE_ID);

    const terminal = delivered.at(-1);
    if (terminal?.status !== "destroyed")
      throw new Error(
        `The terminal publication is ${terminal?.status ?? "absent"}, not destroyed.`,
      );
    // And after it, both ends say nothing: `get` has no entry left and the delivered patch collapses
    // to the same absence. This is the pair the narrowing is built on, asserted together rather than
    // asserted about the map alone and assumed about the wire.
    expect(registry.get(NODE_ID)).toBeUndefined();
    expect(liveOrAbsent(terminal)).toBeUndefined();
  });
});
