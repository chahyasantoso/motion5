import { describe, expect, it } from "vitest";
import type { Diagnostic, ProjectDefinition, TrackDefinition } from "../../../src/contract/v5";
import { buildGraphIR, type GraphBuildResult } from "../../../src/graph/ir";

// Every id below passes validateV5 and the graph id guards: they reserve only "/" and "~", so "|"
// is authorable everywhere edgeKey uses it as a field separator. A separator a value can forge is
// not a separator.
//
// `E-2` and `E-3` pinned the same question for projection keys and retire with that primitive.
// `J-6` carries it to the requirement plugin and slot, the authored string pair still inside the
// encoding. See ADR-047.
const observing = (id: string, source?: string): TrackDefinition =>
  source === undefined ? { id } : { id, observes: [{ source }] };

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
          observes: [{ source: "halo" }, { source: "halo" }],
        },
        { id: "halo" },
      ],
    },
  ],
};

describe("edge identity survives a separator inside an id", () => {
  it("E-1 does not report a duplicate edge for two distinct edges", () => {
    // Observer m/x observing m|y/z and observer m/x|m observing y/z both encode to
    // "m/x|m|y/z|output|-" under a plain "|" separator, so graph construction rejects a legal
    // project, naming a duplicate edge the author never wrote twice.
    const result = buildGraphIR(COLLIDING);
    expect(duplicates(result)).toEqual([]);
    expect(result.graph?.nodes).toHaveLength(4);
  });

  it("E-5 still reports exactly one duplicate for a genuinely repeated edge", () => {
    // Injectivity must not be bought by weakening the duplicate check that consumes it.
    const result = buildGraphIR(REPEATED);
    expect(result.graph).toBeUndefined();
    expect(duplicates(result)).toHaveLength(1);
  });
});
