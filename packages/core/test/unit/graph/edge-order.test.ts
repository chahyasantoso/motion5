import { describe, expect, it } from "vitest";
import type { GraphEdge } from "../../../src/graph/ir";
import { compareEdges, edgeKey } from "../../../src/graph/ir";

// Ids and projection keys that contain every character the identity encoding or the comparator
// treats as punctuation, plus leading digits, which is what a length prefix looks like from the
// outside. All ten are pairwise distinct edges.
const EDGES: readonly GraphEdge[] = [
  { observerId: "a|b/c", sourceId: "d/e", role: "input" },
  { observerId: "a/b", sourceId: "d/e", role: "input" },
  { observerId: "a/b", sourceId: "d/e", role: "output" },
  { observerId: "a/b", sourceId: "d|e/f", role: "input" },
  { observerId: "a/b", sourceId: "d/e", role: "input", projection: { pick: ["a,b"] } },
  { observerId: "a/b", sourceId: "d/e", role: "input", projection: { pick: ["a", "b"] } },
  { observerId: "a/b", sourceId: "d/e", role: "input", projection: { map: { a: "x,b=y" } } },
  { observerId: "a/b", sourceId: "d/e", role: "input", projection: { map: { a: "x", b: "y" } } },
  { observerId: "10/x", sourceId: "d/e", role: "output" },
  { observerId: "2/x", sourceId: "d/e", role: "output" },
];

const sign = (value: number): number => (value < 0 ? -1 : value > 0 ? 1 : 0);

describe("observation edge ordering", () => {
  it("E-4 is a strict total order over ids that contain the encoding's punctuation", () => {
    // Ordering is its own owner precisely because it cannot be derived from the identity
    // encoding: length prefixes would make output merge precedence depend on id length.
    for (const edge of EDGES) expect(compareEdges(edge, edge)).toBe(0);
    const ties: string[] = [];
    for (const [leftIndex, left] of EDGES.entries())
      for (const [rightIndex, right] of EDGES.entries()) {
        if (leftIndex === rightIndex) continue;
        expect(sign(compareEdges(left, right))).toBe(0 - sign(compareEdges(right, left)));
        if (compareEdges(left, right) === 0) ties.push(`${leftIndex} ties ${rightIndex}`);
      }
    expect(ties).toEqual([]);
    for (const a of EDGES)
      for (const b of EDGES)
        for (const c of EDGES)
          if (compareEdges(a, b) < 0 && compareEdges(b, c) < 0)
            expect(compareEdges(a, c)).toBeLessThan(0);
    // Identity and order agree on which edges are distinct, without sharing an encoding.
    expect(new Set(EDGES.map(edgeKey)).size).toBe(EDGES.length);
  });

  it("E-7 sorts independently of the order the edges arrive in", () => {
    const forward = [...EDGES].sort(compareEdges).map(edgeKey);
    const backward = [...EDGES].reverse().sort(compareEdges).map(edgeKey);
    expect(backward).toEqual(forward);
  });
});
