import { describe, expect, it } from "vitest";
import type { GraphEdge } from "../../../src/graph/ir";
import {
  classifyReference,
  firstPendingEdge,
  pendingReferenceDiagnostic,
  PENDING_REFERENCE_RULE_ID,
} from "../../../src/graph/references";

const edge = (sourceId: string, observerId = "observer"): GraphEdge =>
  Object.freeze({ observerId, sourceId, role: "input" });

describe("cross-motion reference classification", () => {
  it("resolves an edge whose source currently has a value", () => {
    const result = classifyReference(edge("base/root"), () => true);
    expect(result).toEqual({ status: "resolved" });
  });

  it("classifies an edge as pending when its source has no value yet", () => {
    const result = classifyReference(edge("base/root"), () => false);
    expect(result.status).toBe("pending");
    expect(result.diagnostic?.ruleId).toBe(PENDING_REFERENCE_RULE_ID);
    expect(result.diagnostic?.severity).toBe("warning");
    expect(result.diagnostic?.ids).toEqual(["base/root", "observer"]);
  });

  it("builds a deterministic diagnostic naming both the source and the observer", () => {
    const diagnostic = pendingReferenceDiagnostic(edge("base/root", "arm/child"));
    expect(diagnostic).toEqual({
      ruleId: PENDING_REFERENCE_RULE_ID,
      path: "arm/child",
      message: 'Observation source "base/root" is a known node with no published value yet.',
      severity: "warning",
      ids: ["base/root", "arm/child"],
    });
  });

  it("never produces a third state: only status and diagnostic keys ever appear", () => {
    const pending = classifyReference(edge("base/root"), () => false);
    const resolved = classifyReference(edge("base/root"), () => true);
    expect(Object.keys(pending).sort()).toEqual(["diagnostic", "status"]);
    expect(Object.keys(resolved)).toEqual(["status"]);
  });

  it("returns frozen resolutions and diagnostics", () => {
    const resolved = classifyReference(edge("base/root"), () => true);
    const pending = classifyReference(edge("base/root"), () => false);
    expect(Object.isFrozen(resolved)).toBe(true);
    expect(Object.isFrozen(pending)).toBe(true);
    expect(Object.isFrozen(pending.diagnostic)).toBe(true);
  });

  it("finds the first pending edge in canonical edge-key order, not authored order", () => {
    const compareEdgeKeys = (a: GraphEdge, b: GraphEdge) => {
      const left = `${a.observerId}|${a.sourceId}|${a.role}`;
      const right = `${b.observerId}|${b.sourceId}|${b.role}`;
      return left < right ? -1 : left > right ? 1 : 0;
    };
    const edges = [edge("z-source"), edge("a-source")];
    const match = firstPendingEdge(edges, compareEdgeKeys, () => false);
    expect(match?.edge.sourceId).toBe("a-source");
  });

  it("returns undefined when every source is resolved", () => {
    const compareEdgeKeys = (a: GraphEdge, b: GraphEdge) =>
      a.sourceId < b.sourceId ? -1 : a.sourceId > b.sourceId ? 1 : 0;
    const edges = [edge("a"), edge("b")];
    expect(firstPendingEdge(edges, compareEdgeKeys, () => true)).toBeUndefined();
  });
});
