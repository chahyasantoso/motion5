import { describe, expect, it } from "vitest";
import type { PluginRequiresBinding } from "../../../src/contract/v5";
import type { GraphEdge } from "../../../src/graph/ir";
import { edgeKey, resolveObservationEdge, resolveRequirementEdge } from "../../../src/graph/ir";

// Canonical identity carried two authored string fields. Projection ordering was one, and it
// retires with the primitive; the requirement's plugin and slot are the other, and are all that is
// left to canonicalize. See ADR-047.
const OBSERVER = "hero/child";
const SOURCE = "hero/root";

const binding = (slot: string): PluginRequiresBinding =>
  Object.freeze({ plugin: "fk", slot, source: "root", authoredPath: `fk.requires.${slot}` });

describe("canonical observation edge identity", () => {
  it("shares identity with the authored observation resolver", () => {
    const resolved = resolveObservationEdge({ source: "root" }, OBSERVER, "hero", "test");
    const expected: GraphEdge = { observerId: OBSERVER, sourceId: SOURCE, role: "output" };
    expect(resolved.edge).toBeDefined();
    expect(edgeKey(resolved.edge!)).toBe(edgeKey(expected));
  });

  it("shares identity with the authored requirement resolver", () => {
    const resolved = resolveRequirementEdge(binding("base"), OBSERVER, "hero", "test");
    const expected: GraphEdge = {
      observerId: OBSERVER,
      sourceId: SOURCE,
      role: "input",
      requirement: { plugin: "fk", slot: "base" },
    };
    expect(resolved.edge).toBeDefined();
    expect(edgeKey(resolved.edge!)).toBe(edgeKey(expected));
  });

  it("keeps two slots bound to one source distinct", () => {
    const base = resolveRequirementEdge(binding("base"), OBSERVER, "hero", "test");
    const other = resolveRequirementEdge(binding("destination"), OBSERVER, "hero", "test");
    expect(edgeKey(base.edge!)).not.toBe(edgeKey(other.edge!));
  });
});
