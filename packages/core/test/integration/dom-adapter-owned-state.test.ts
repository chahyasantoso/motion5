import { describe, expect, it } from "vitest";
import { createDomPatchAdapter, type DomTarget } from "../../src/adapters/dom";
import type { Patch } from "../../src/runtime/patch-registry";

function patch(revision: number, nodeId: string, values: Readonly<Record<string, unknown>>): Patch {
  return {
    nodeId,
    revision,
    values,
    sourceProgress: 0,
    sourceRevisions: {},
    status: "ready",
    diagnostics: [],
  };
}

/**
 * Everything this adapter writes from belongs to this adapter, at the newest revision it accepted
 * for that target and that node.
 *
 * Two module-level owners made that false, in opposite directions. `transformState` was shared by
 * every adapter in the process, so a second adapter bound to one element composed keys it was never
 * sent and lost them again when either one cleared. `apply` read `patch.revision` for nothing, so
 * an out-of-order patch overwrote a newer pose and left `lastApplied` describing an element state
 * that is no longer there, which makes every later dirty diff wrong rather than one frame stale.
 *
 * Both cases assert the accepting direction in the same rig as the refusing one. A guard that
 * refuses every patch and a writer that composes nothing are green against the refusal alone, so
 * the halves that could not fail before the fix are here as lie detectors rather than padding.
 * Issues #356 and #357. See ADR-074.
 */
describe("DOM adapter owned write state", () => {
  it("refuses a patch that is not newer than the one it applied for that target and node", () => {
    const arm: DomTarget = { style: {} };
    const leg: DomTarget = { style: {} };
    const targets: Record<string, DomTarget> = { "hero/arm": arm, "hero/leg": leg };
    const writes: Array<{ target: DomTarget; values: Readonly<Record<string, unknown>> }> = [];
    const adapter = createDomPatchAdapter(
      { style: {} },
      undefined,
      (nodeId) => targets[nodeId],
      (target, values) => writes.push({ target, values: { ...values } }),
    );

    adapter.apply(patch(2, "hero/arm", { opacity: 0.5 }));
    expect(writes).toEqual([{ target: arm, values: { opacity: 0.5 } }]);

    // An older revision may not reach the target, and neither may the same revision twice.
    adapter.apply(patch(1, "hero/arm", { opacity: 1 }));
    adapter.apply(patch(2, "hero/arm", { opacity: 1 }));
    expect(writes).toHaveLength(1);

    // Accepting direction: the next revision writes, so this is monotonicity rather than a refusal
    // of everything after the first patch.
    adapter.apply(patch(3, "hero/arm", { opacity: 1 }));
    expect(writes[1]).toEqual({ target: arm, values: { opacity: 1 } });

    // A revision is monotonic per node and unrelated across nodes, so a second node is not stale
    // for being numbered lower than its neighbour.
    adapter.apply(patch(1, "hero/leg", { opacity: 0.25 }));
    expect(writes[2]).toEqual({ target: leg, values: { opacity: 0.25 } });

    // `clear` re-arms a rebound target, which is how `useDomPatch` re-poses a fresh element from a
    // retained patch this adapter has already applied once.
    adapter.clear(arm);
    adapter.apply(patch(3, "hero/arm", { opacity: 1 }));
    expect(writes[3]).toEqual({ target: arm, values: { opacity: 1 } });
    expect(writes).toHaveLength(4);
  });

  it("keeps composed transform state, and its removal, inside the adapter that wrote it", () => {
    const style: Record<string, unknown> = {};
    const target = { style };
    const first = createDomPatchAdapter(target);
    const second = createDomPatchAdapter(target);

    first.apply(patch(1, "hero/arm", { x: 10, y: 20, scale: 2 }));
    expect(style.transform).toBe("translate3d(10px, 20px, 0px) scale(2)");

    // `second` has its own empty dirty cache, so a shared composition hands it a `scale` that no
    // patch it was ever sent carries.
    second.apply(patch(1, "hero/leg", { x: 30, y: 40 }));
    expect(style.transform).toBe("translate3d(30px, 40px, 0px)");

    // Accepting direction: composition still works, over the keys this adapter set.
    first.apply(patch(2, "hero/arm", { x: 10, y: 20, scale: 3 }));
    expect(style.transform).toBe("translate3d(10px, 20px, 0px) scale(3)");

    // `clear` is scoped the same way: releasing one binding cannot erase the other's pose.
    second.clear(target);
    first.apply(patch(3, "hero/arm", { x: 10, y: 20, scale: 4 }));
    expect(style.transform).toBe("translate3d(10px, 20px, 0px) scale(4)");
  });
});
