import { describe, expect, it } from "vitest";
import type { Diagnostic } from "../../../src/contract/v5";
import { PatchRegistry, type Patch } from "../../../src/runtime/patch-registry";

const NODE_ID = "hero/arm";

/**
 * A composed value record is freshly allocated on every flush, so identity compare can never
 * match a nested value. Change detection has to be structural or the registry republishes,
 * bumps the revision, and wakes every listener on every frame.
 */
function publishComposed(
  registry: PatchRegistry,
  tick: number,
  values: Readonly<Record<string, unknown>>,
  sourceRevisions: Readonly<Record<string, number>> = { "hero/root": 3 },
): Patch | undefined {
  registry.beginBatch(tick, [NODE_ID]);
  const patch = registry.publish({
    nodeId: NODE_ID,
    values,
    sourceProgress: 0.25,
    sourceRevisions,
    status: "ready",
  });
  registry.closeBatch();
  return patch;
}

function publishBlocked(
  registry: PatchRegistry,
  tick: number,
  diagnostics: readonly Diagnostic[],
): Patch | undefined {
  registry.beginBatch(tick, [NODE_ID]);
  const patch = registry.publish({
    nodeId: NODE_ID,
    sourceProgress: 0,
    status: "blocked",
    diagnostics,
  });
  registry.closeBatch();
  return patch;
}

describe("PatchRegistry: structural change detection (recovery P1-5)", () => {
  it("suppresses the republish when a freshly allocated nested record is structurally equal", () => {
    const registry = new PatchRegistry();
    let notifications = 0;
    registry.subscribeNode(NODE_ID, () => {
      notifications += 1;
    });

    const first = publishComposed(registry, 1, {
      transform: { x: 1, y: 2 },
      tags: ["a", "b"],
      opacity: 1,
    });
    const second = publishComposed(registry, 2, {
      transform: { x: 1, y: 2 },
      tags: ["a", "b"],
      opacity: 1,
    });

    expect(first?.revision).toBe(1);
    expect(second).toBeUndefined();
    expect(registry.get(NODE_ID)?.revision).toBe(1);
    expect(notifications).toBe(1);
  });

  it("key insertion order inside a nested record is not a change", () => {
    const registry = new PatchRegistry();
    publishComposed(registry, 1, { transform: { x: 1, y: 2 } });
    const second = publishComposed(registry, 2, { transform: { y: 2, x: 1 } });
    expect(second).toBeUndefined();
    expect(registry.get(NODE_ID)?.revision).toBe(1);
  });

  it("republishes when a nested value actually changes", () => {
    const registry = new PatchRegistry();
    publishComposed(registry, 1, { transform: { x: 1, y: 2 } });
    const second = publishComposed(registry, 2, { transform: { x: 1, y: 3 } });
    expect(second?.revision).toBe(2);
  });

  it("republishes when only the order of a nested array changes", () => {
    const registry = new PatchRegistry();
    publishComposed(registry, 1, { tags: ["a", "b"] });
    const second = publishComposed(registry, 2, { tags: ["b", "a"] });
    expect(second?.revision).toBe(2);
  });

  it("republishes when only a source revision changes", () => {
    const registry = new PatchRegistry();
    publishComposed(registry, 1, { opacity: 1 }, { "hero/root": 3 });
    const second = publishComposed(registry, 2, { opacity: 1 }, { "hero/root": 4 });
    expect(second?.revision).toBe(2);
  });

  it("diagnostics equality is field-wise, so key order is not a change", () => {
    const registry = new PatchRegistry();
    const authored: Diagnostic = {
      ruleId: "blocked-upstream",
      path: NODE_ID,
      message: "Blocked by upstream failure at hero/root.",
      severity: "error",
      ids: ["hero/root", NODE_ID],
    };
    const reordered: Diagnostic = {
      severity: "error",
      ids: ["hero/root", NODE_ID],
      message: "Blocked by upstream failure at hero/root.",
      path: NODE_ID,
      ruleId: "blocked-upstream",
    };

    expect(publishBlocked(registry, 1, [authored])?.revision).toBe(1);
    expect(publishBlocked(registry, 2, [reordered])).toBeUndefined();
    expect(registry.get(NODE_ID)?.revision).toBe(1);
  });

  it("republishes when a diagnostic field actually changes", () => {
    const registry = new PatchRegistry();
    const base: Diagnostic = {
      ruleId: "blocked-upstream",
      path: NODE_ID,
      message: "Blocked by upstream failure at hero/root.",
      severity: "error",
      ids: ["hero/root", NODE_ID],
    };
    publishBlocked(registry, 1, [base]);
    const second = publishBlocked(registry, 2, [{ ...base, ids: ["hero/other", NODE_ID] }]);
    expect(second?.revision).toBe(2);
  });
});
