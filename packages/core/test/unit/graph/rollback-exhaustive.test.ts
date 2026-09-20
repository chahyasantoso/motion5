import { describe, expect, it } from "vitest";
import { fileURLToPath } from "node:url";
import { code, member } from "../../helpers/source-region";
import type { ProjectDefinition } from "../../../src/contract/v5";
import { buildGraphIR } from "../../../src/graph/ir";
import { ObservationState } from "../../../src/graph/observation-state";

/**
 * The undo journal is a closed four-variant union whose only reader was an `if`/`else if` chain
 * ending in a bare `else`, so `remove-edge` was what a verb nobody wrote an arm for resolved to.
 *
 * The behavioural case below is green before and after, on purpose: this slice is an equivalence
 * refactor, and what a rollback answers is what it has to keep answering. The claim that moved is a
 * compile-time one, and it is asserted here as the shape of the one reader that owes the decision,
 * in the idiom `commit-plan.test.ts` uses for the same reason: the reader is a private method over a
 * private type, so a runtime case cannot reach an undecided verb without a seam that would exist
 * only for the test, and a mirror of the union declared here would be a second owner of it. The
 * guarantee the sink itself provides is owned by `exhaustive.test.ts` and is not re-proved here.
 *
 * See ADR-092 and issue #451.
 */
const SOURCE = code(
  fileURLToPath(new URL("../../../src/graph/observation-state.ts", import.meta.url)),
);
const ROLLBACK = member(SOURCE, "rollback(): void {");
const UNDO_VERBS = ["add-node", "remove-node", "add-edge", "remove-edge"] as const;

const project: ProjectDefinition = {
  schemaVersion: 5,
  motions: [
    {
      id: "hero",
      trigger: { type: "manual" },
      tracks: [
        { id: "arm", observes: [{ source: "~/cursor" }] },
        { id: "halo", observes: [{ source: "arm" }] },
      ],
    },
  ],
  freeTracks: [{ id: "cursor" }],
};

function load(state: ObservationState): void {
  const { graph } = buildGraphIR(project);
  if (graph === undefined) throw new Error("fixture project must build");
  for (const id of graph.order) state.addNode(id);
  for (const id of graph.order)
    for (const live of graph.nodeById[id]?.edges ?? []) state.addEdge(live);
}

describe("the undo journal is read as the closed union it is", () => {
  it("restores live state through every undo verb a transaction can record", () => {
    const state = new ObservationState();
    load(state);
    state.commit();
    const before = state.snapshot();

    // One of each verb, so the reverse replay has to take all four arms rather than the two a
    // structural rollback usually needs. Removing the edges first is what makes removeNode legal.
    const [edge] = state.sourcesOf("hero/halo");
    if (edge === undefined) throw new Error("fixture must have an observed edge");
    state.removeEdge(edge);
    state.addEdge({ observerId: "hero/arm", sourceId: "hero/halo", role: "output" });
    state.addNode("hero/shadow");
    const [cursorEdge] = state.observersOf("~/cursor");
    if (cursorEdge === undefined) throw new Error("fixture must have a free-track edge");
    state.removeEdge(cursorEdge);
    state.removeNode("~/cursor");
    expect(state.journalLength).toBe(5);

    state.rollback();
    expect(state.snapshot()).toEqual(before);
    expect(state.journalLength).toBe(0);
  });

  it("decides about every undo verb at one reader and ends at the shared sink", () => {
    for (const verb of UNDO_VERBS) expect(ROLLBACK).toContain(`case "${verb}"`);
    expect(ROLLBACK).toContain("default:");
    expect(ROLLBACK).toContain("unreachable(entry)");
    // The chain's spelling is gone rather than supplemented. A surviving predicate test would be a
    // second reader of the discriminant, and the one this replaced is the one that was wrong.
    expect(ROLLBACK).not.toContain("entry.undo ===");
    expect(ROLLBACK).not.toContain("else");
  });

  it("imports the one sink rather than throwing a fallback of its own", () => {
    expect(SOURCE).toContain('import { unreachable } from "../domain/exhaustive"');
    // One reader, so one call site. A second would mean the journal is read somewhere else too.
    expect(SOURCE.match(/unreachable\(/g)).toHaveLength(1);
  });
});
