import { describe, expect, it } from "vitest";
import { fileURLToPath } from "node:url";
import type { Diagnostic, Patch } from "../../../src/contract/v5";
import { PatchRegistry, REENTRANT_BATCH_MESSAGE } from "../../../src/runtime/patch-registry";
import {
  REGISTRY_IDLE,
  closed,
  isDisposed,
  isNotifying,
  notificationOf,
  openBatch,
  opening,
  retain,
  retired,
  withNotification,
  type RegistryPhase,
} from "../../../src/runtime/registry-phase";
import { code } from "../../helpers/source-region";

/**
 * Issue #443, phase B step 10: the registry's lifecycle is one value and its buffers ride it.
 *
 * Three booleans and four batch fields encoded this, so eight combinations existed where about four
 * mean anything, and a batch could be half open: `beginBatch` set four fields one at a time and
 * `closeBatch` emptied them one at a time. The union carries the tick, the seeds and both buffers
 * inside `collecting`, so opening and closing a batch are one assignment each and a retired registry
 * cannot hold one at all.
 *
 * Two behavioural claims are red before the change. Two throwing subscribers are now reported as one
 * `AggregateError` carrying both rather than as the first with the second discarded, which is what
 * reaching for `domain/completion` instead of a fourth hand-rolled first-error-wins costs and buys.
 * And the notification a terminal delivery interrupts is restored, which is what keeps notification a
 * field of every phase rather than a variant beside them: a `notifying` variant would have taken the
 * open batch's place and lost it.
 */
const ARM = "hero/arm";
const HAND = "hero/hand";
const REGISTRY_SOURCE = fileURLToPath(
  new URL("../../../src/runtime/patch-registry.ts", import.meta.url),
);

function diagnostic(nodeId: string): Diagnostic {
  const entry: Diagnostic = Object.freeze({
    ruleId: "registry-phase",
    path: nodeId,
    message: `about ${nodeId}`,
    severity: "error",
    ids: Object.freeze([nodeId]),
  });
  return entry;
}

function patchFor(nodeId: string): Patch {
  const patch: Patch = Object.freeze({
    nodeId,
    revision: 1,
    values: Object.freeze({}),
    sourceProgress: 0,
    sourceRevisions: Object.freeze({}),
    status: "ready",
    diagnostics: Object.freeze([diagnostic(nodeId)]),
  });
  return patch;
}

/** One collecting phase, minted the only way anything can mint one. */
function collectingPhase(seeds: readonly string[] = [ARM]): RegistryPhase {
  const opened = opening(REGISTRY_IDLE, 7, seeds);
  expect(opened.kind).toBe("collect");
  if (opened.kind !== "collect") throw new Error("unreachable");
  return opened.phase;
}

function thrownBy(operation: () => unknown): unknown {
  try {
    operation();
  } catch (error) {
    return error;
  }
  throw new Error("Expected the operation to throw.");
}

describe("the patch registry holds one lifecycle value", () => {
  it("reports every subscriber failure rather than the first, and one by identity", () => {
    const registry = new PatchRegistry();
    const first = new Error("first subscriber");
    const second = new Error("second subscriber");
    registry.subscribeNode(ARM, () => {
      throw first;
    });
    registry.subscribeBatch(() => {
      throw second;
    });
    registry.beginBatch(1, [ARM]);
    registry.publish({ nodeId: ARM, values: { x: 1 }, sourceProgress: 0, status: "ready" });

    // Red before this change, which threw `first` and dropped `second` on the floor.
    const failure = thrownBy(() => registry.closeBatch());
    expect(failure).toBeInstanceOf(AggregateError);
    expect((failure as AggregateError).errors).toEqual([first, second]);

    // The accepting direction in the same rig, so a delivery that reports everything as an aggregate
    // cannot pass this file either: one failure keeps its identity.
    const solo = new PatchRegistry();
    solo.subscribeNode(ARM, () => {
      throw first;
    });
    solo.beginBatch(1, [ARM]);
    solo.publish({ nodeId: ARM, values: { x: 1 }, sourceProgress: 0, status: "ready" });
    expect(thrownBy(() => solo.closeBatch())).toBe(first);
    // And the batch is closed either way, so the next one opens.
    expect(() => solo.beginBatch(2, [ARM])).not.toThrow();
  });

  it("keeps the batch a terminal delivery interrupts, and the notification it interrupted", () => {
    const registry = new PatchRegistry();
    const seen: string[] = [];
    registry.subscribeNode(HAND, (patch) => seen.push(patch.status));
    registry.beginBatch(1, [HAND]);
    registry.publish({ nodeId: HAND, values: { x: 1 }, sourceProgress: 0, status: "ready" });
    registry.closeBatch();

    registry.beginBatch(2, [ARM]);
    registry.publish({ nodeId: ARM, values: { x: 2 }, sourceProgress: 0, status: "ready" });
    // Out of band on purpose: an eviction is a graph mutation and must not close, open or empty the
    // batch it lands inside. A `notifying` variant beside the others would have replaced it.
    registry.evict(HAND);

    expect(registry.notifying).toBe(false);
    const batch = registry.closeBatch();
    expect(batch.tick).toBe(2);
    expect(batch.seeds).toEqual([ARM]);
    expect(batch.patches.map((patch) => patch.nodeId)).toEqual([ARM]);
    expect(seen).toEqual(["ready", "destroyed"]);
  });

  it("answers no batch once a subscriber retires it mid-notification", () => {
    const registry = new PatchRegistry();
    registry.subscribeBatch(() => registry.dispose());
    registry.beginBatch(1, [ARM]);
    registry.publish({ nodeId: ARM, values: { x: 1 }, sourceProgress: 0, status: "ready" });

    expect(() => registry.closeBatch()).not.toThrow();
    expect(registry.disposed).toBe(true);
    expect(registry.notifying).toBe(false);
    // A retired registry ignores an opening rather than refusing one, and then has no batch to close.
    expect(() => registry.beginBatch(2, [ARM])).not.toThrow();
    expect(thrownBy(() => registry.closeBatch())).toBeInstanceOf(Error);
    expect(String(thrownBy(() => registry.closeBatch()))).toContain("No patch batch is open.");
  });

  it("refuses reentrancy before a second batch, and states both messages once", () => {
    expect(opening(withNotification(REGISTRY_IDLE, "notifying"), 1, [ARM])).toEqual({
      kind: "refuse",
      reason: "notifying",
    });
    expect(opening(collectingPhase(), 1, [ARM])).toEqual({ kind: "refuse", reason: "open" });
    // The precedence: a collecting phase that is also notifying refuses the reentrancy, not the
    // second batch, which is the order the two retired guards were written in.
    expect(opening(withNotification(collectingPhase(), "notifying"), 1, [ARM])).toEqual({
      kind: "refuse",
      reason: "notifying",
    });
    expect(opening(retired(REGISTRY_IDLE), 1, [ARM])).toEqual({ kind: "ignore" });

    const registry = new PatchRegistry();
    registry.beginBatch(1, [ARM]);
    expect(() => registry.beginBatch(2, [ARM])).toThrow("A patch batch is already open.");
    const publisherFacing = new PatchRegistry();
    publisherFacing.subscribeBatch(() => {
      publisherFacing.beginBatch(9, [ARM]);
    });
    publisherFacing.beginBatch(1, [ARM]);
    publisherFacing.publish({ nodeId: ARM, values: { x: 1 }, sourceProgress: 0, status: "ready" });
    expect(thrownBy(() => publisherFacing.closeBatch())).toEqual(
      new Error(REENTRANT_BATCH_MESSAGE),
    );
  });

  it("carries a batch inside the variant that owns it, and nowhere else", () => {
    const seeds = [ARM, HAND];
    const collecting = collectingPhase(seeds);
    seeds.push("hero/leg");

    const open = openBatch(collecting);
    expect(open?.tick).toBe(7);
    // Copied at the mint, so a caller holding the array it passed cannot widen a batch afterwards.
    expect(open?.seeds).toEqual([ARM, HAND]);
    expect(open?.patches).toEqual([]);

    retain(collecting, patchFor(ARM));
    expect(openBatch(collecting)?.patches.map((patch) => patch.nodeId)).toEqual([ARM]);
    expect(openBatch(collecting)?.diagnostics.map((entry) => entry.path)).toEqual([ARM]);

    // Retaining into a phase with no batch is what publishing outside one always did with it.
    retain(REGISTRY_IDLE, patchFor(HAND));
    retain(retired(REGISTRY_IDLE), patchFor(HAND));
    expect(openBatch(REGISTRY_IDLE)).toBeUndefined();
    expect(openBatch(retired(collecting))).toBeUndefined();
    expect(openBatch(closed(collecting))).toBeUndefined();
  });

  it("transitions total, terminal and interned", () => {
    expect(Object.isFrozen(REGISTRY_IDLE)).toBe(true);
    expect(isDisposed(REGISTRY_IDLE)).toBe(false);
    expect(isNotifying(REGISTRY_IDLE)).toBe(false);
    expect(withNotification(REGISTRY_IDLE, "quiet")).toBe(REGISTRY_IDLE);

    const notifying = withNotification(REGISTRY_IDLE, "notifying");
    expect(isNotifying(notifying)).toBe(true);
    expect(notificationOf(notifying)).toBe("notifying");
    // Interned, so a transition that carries no payload allocates nothing.
    expect(withNotification(withNotification(notifying, "quiet"), "notifying")).toBe(notifying);

    const collecting = withNotification(collectingPhase(), "notifying");
    expect(closed(collecting)).toBe(notifying);
    expect(notificationOf(retired(collecting))).toBe("notifying");

    const disposed = retired(REGISTRY_IDLE);
    expect(isDisposed(disposed)).toBe(true);
    // Terminal in every direction: retiring twice, closing a batch it cannot hold, and lowering a
    // notification all leave it disposed.
    expect(retired(disposed)).toBe(disposed);
    expect(closed(disposed)).toBe(disposed);
    expect(isDisposed(withNotification(disposed, "notifying"))).toBe(true);
    expect(isDisposed(closed(collecting))).toBe(false);
  });

  it("leaves the retired flags and buffers named nowhere in the registry", () => {
    const source = code(REGISTRY_SOURCE);
    for (const retiredName of [
      "#batchOpen",
      "#batchTick",
      "#batchSeeds",
      "#batchDiagnostics",
      "#notifying",
      "#disposed",
    ])
      expect(source.split(retiredName), retiredName).toHaveLength(1);
    // The one field that stayed, so the scan above is reading a file it can still find names in.
    expect(source.split("#phase").length).toBeGreaterThan(1);
  });
});
