import { describe, expect, it } from "vitest";
import type { Diagnostic, ProjectDefinition, TrackDefinition } from "../../../src/contract/v5";
import { buildGraphIR, edgeKey, type GraphBuildResult } from "../../../src/graph/ir";

// Every id below passes validateV5 and the graph id guards: they reserve only "/" and "~", so
// "|" is authorable everywhere edgeKey uses it as a field separator, and a target is an
// arbitrary string. A separator that a value can forge is not a separator.
const observing = (id: string, source?: string): TrackDefinition =>
  source === undefined ? { id } : { id, observes: [{ source, role: "input" }] };

const duplicates = (result: GraphBuildResult): readonly Diagnostic[] =>
  result.diagnostics.filter(({ ruleId }) => ruleId === "observation-duplicate");

const COLLIDING: ProjectDefinition = {
  schemaVersion: 5,
  motions: [
    {
      id: "m",
      trigger: { type: "manual" },
      tracks: [observing("x", "m|y/z"), observing("x|m", "y/z")],
    },
    { id: "y", trigger: { type: "manual" }, tracks: [observing("z")] },
    { id: "m|y", trigger: { type: "manual" }, tracks: [observing("z")] },
  ],
};

const REPEATED: ProjectDefinition = {
  schemaVersion: 5,
  motions: [
    {
      id: "hero",
      trigger: { type: "manual" },
      tracks: [
        {
          id: "arm",
          observes: [
            { source: "halo", role: "input" },
            { source: "halo", role: "input" },
          ],
        },
        { id: "halo" },
      ],
    },
  ],
};

describe("edge identity survives a separator inside an id", () => {
  const base = { observerId: "a/b", sourceId: "c/d", role: "input" as const };

  it("E-1 does not report a duplicate edge for two distinct edges", () => {
    // Observer m/x observing m|y/z and observer m/x|m observing y/z both encode to
    // "m/x|m|y/z|input||" under a plain "|" separator, so graph construction rejects a legal
    // project, naming a duplicate edge the author never wrote twice.
    const result = buildGraphIR(COLLIDING);
    expect(duplicates(result)).toEqual([]);
    expect(result.graph?.nodes).toHaveLength(4);
  });

  it("E-2 distinguishes a pick key containing the projection separator", () => {
    expect(edgeKey({ ...base, projection: { pick: ["a,b"] } })).not.toBe(
      edgeKey({ ...base, projection: { pick: ["a", "b"] } }),
    );
  });

  it("E-3 distinguishes a map value containing the projection separators", () => {
    expect(edgeKey({ ...base, projection: { map: { a: "x,b=y" } } })).not.toBe(
      edgeKey({ ...base, projection: { map: { a: "x", b: "y" } } }),
    );
  });

  it("E-5 still reports exactly one duplicate for a genuinely repeated edge", () => {
    // Injectivity must not be bought by weakening the duplicate check that consumes it.
    const result = buildGraphIR(REPEATED);
    expect(result.graph).toBeUndefined();
    expect(duplicates(result)).toHaveLength(1);
  });

  it("E-6 distinguishes an authored empty target from an absent target", () => {
    // Both render as the empty string today, so one key stands in for two edges.
    expect(edgeKey({ ...base, target: "" })).not.toBe(edgeKey(base));
  });
});
