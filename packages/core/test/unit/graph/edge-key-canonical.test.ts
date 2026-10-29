import { describe, expect, it } from "vitest";
import type { GraphEdge } from "../../../src/graph/ir";
import { edgeKey } from "../../../src/graph/ir";
import { resolveRequirementEdge } from "../../../src/graph/dependency-edges";

// Canonical identity carried two authored string fields. Projection ordering was one, and it
// retires with the primitive; the requirement's plugin and slot are the other, and are all that is
// left to canonicalize. See ADR-047.
const OBSERVER = "hero/child";
const SOURCE = "hero/root";

type Binding = {
  readonly plugin: string;
  readonly slot: string;
  readonly source: string;
  readonly authoredPath: string;
};
const binding = (slot: string): Binding =>
  Object.freeze({ plugin: "fk", slot, source: "root", authoredPath: `fk.requires.${slot}` });

describe("canonical edge identity", () => {
  it("shares identity with the authored requirement resolver", () => {
    const resolved = resolveRequirementEdge(binding("base"), OBSERVER, "hero", "test");
    const expected: GraphEdge = {
      observerId: OBSERVER,
      sourceId: SOURCE,
      role: "input",
      requirement: { plugin: "fk", slot: "base" },
    };
    expect(resolved.kind).toBe("accepted");
    if (resolved.kind === "accepted") expect(edgeKey(resolved.value)).toBe(edgeKey(expected));
  });

  it("keeps two slots bound to one source distinct", () => {
    const base = resolveRequirementEdge(binding("base"), OBSERVER, "hero", "test");
    const other = resolveRequirementEdge(binding("destination"), OBSERVER, "hero", "test");
    expect(base.kind).toBe("accepted");
    expect(other.kind).toBe("accepted");
    if (base.kind === "accepted" && other.kind === "accepted")
      expect(edgeKey(base.value)).not.toBe(edgeKey(other.value));
  });
});
