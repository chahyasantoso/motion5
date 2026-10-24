import { describe, expect, it } from "vitest";
import type { ProjectDefinition, TrackDefinition } from "../../../src/contract/v5";
import { createManualClock } from "../../../src/ports/clock";
import { ProjectRuntime } from "../../../src/runtime/project-runtime";
import { record, track } from "../../support/v5-builders";

/**
 * Issue #223, finding 4 of the re-review: what a removal owes the nodes that read it.
 *
 * A removal seeds nothing, and the justification is a claim about `graph/ir.ts`: "a removal's node
 * is gone with nothing left depending on it, because `finalizeGraph` would have refused the
 * candidate otherwise." This is the measurement of the edge half: `finalizeGraph` walks every input
 * edge of every node and refuses a source the candidate does not contain, so every reader that is
 * an edge is caught. The solver half needs built-in chain plugins and is filed with Phase 5.
 *
 * The clock is manual and never ticks. A flush that only happened because a frame arrived would
 * prove nothing about the commit.
 */

const compose = (node: { id: string }) => () => ({
  outputs: { values: { node: node.id } },
  sourceProgress: 0,
  sourceRevisions: {},
});

/* One ordinary requirement edge between two free tracks, and nothing else. */
const SOURCE = "~/a";
const READER = "~/b";
const READER_TRACK: TrackDefinition = track({
  id: "b",
  plugin: "demo",
  values: record({}),
  requires: { chain: SOURCE },
});
const EDGE_PROJECT: ProjectDefinition = {
  schemaVersion: 5,
  motions: [],
  freeTracks: [track({ id: "a" }), READER_TRACK],
};

describe("what a removal owes the nodes that read it", () => {
  it("RA-98 refuses a removal whose node is still read through an edge", () => {
    const runtime = new ProjectRuntime(EDGE_PROJECT, { clock: createManualClock(), compose });
    try {
      const before = runtime.graph.sequence;

      // The premise of the case: this is a reader, and the query that answers who reads a node says
      // so.
      expect(runtime.dependantsOf(SOURCE)).toEqual([READER]);

      expect(() => runtime.track(SOURCE).remove()).toThrow(/^edge-unknown-source at /);

      // A refused candidate leaves the removal undone, which is what makes the empty seed correct
      // rather than merely unobserved: there is no committed state for a flush to describe.
      expect(runtime.track(SOURCE).live).toBe(true);
      expect(runtime.graph.sequence).toBe(before);
    } finally {
      runtime.dispose();
    }
  });
});
