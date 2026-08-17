import { describe, expect, it } from "vitest";
import { edgeKey, resolveObservationEdge } from "../../../src/graph/ir";

describe("canonical observation edge identity", () => {
  const base = { observerId: "hero/child", sourceId: "hero/root", role: "input" as const };
  it("ignores projection map and pick ordering", () => {
    expect(edgeKey({ ...base, projection: { map: { a: "x", b: "y" } } })).toBe(
      edgeKey({ ...base, projection: { map: { b: "y", a: "x" } } }),
    );
    expect(edgeKey({ ...base, projection: { pick: ["a", "b"] } })).toBe(
      edgeKey({ ...base, projection: { pick: ["b", "a"] } }),
    );
  });
  it("keeps genuinely different projections distinct", () => {
    expect(edgeKey({ ...base, projection: { pick: ["a"] } })).not.toBe(
      edgeKey({ ...base, projection: { pick: ["a", "b"] } }),
    );
    expect(edgeKey({ ...base, projection: { map: { a: "x" } } })).not.toBe(
      edgeKey({ ...base, projection: { map: { a: "y" } } }),
    );
  });
  it("shares identity with the authored observation resolver", () => {
    const resolved = resolveObservationEdge(
      { source: "root", role: "input", projection: { map: { b: "y", a: "x" } } },
      "hero/child",
      "hero",
      "test",
    );
    expect(resolved.edge).toBeDefined();
    expect(edgeKey(resolved.edge!)).toBe(
      edgeKey({
        observerId: "hero/child",
        sourceId: "hero/root",
        role: "input",
        projection: { map: { a: "x", b: "y" } },
      }),
    );
  });
});
