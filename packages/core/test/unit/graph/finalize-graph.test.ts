import { builtinRegistry } from "../../support/builtin-registry";
import { describe, expect, it } from "vitest";
import { IncrementalGraphBuilder } from "../../../src/graph/builders/incremental";
import {
  buildGraphIR,
  finalizeGraph,
  type GraphBuildResult,
  type GraphNode,
} from "../../../src/graph/ir";
import type { GroupedTrackDefinition, ProjectDefinition } from "../../../src/contract/v5";

// Slice C0 of issue #195. Two graph builders share a post-collect tail and duplicate it almost
// verbatim: `buildGraphIR` (used by load-time validation) and `IncrementalGraphBuilder.build` (used
// by the runtime). Extracting `finalizeGraph` gives that tail one owner, so a solver pass can be
// added in one place and the validator and runtime cannot drift.

function freeProject(tracks: readonly GroupedTrackDefinition[]): ProjectDefinition {
  return { schemaVersion: 5, projectId: "c0", motions: [], freeTracks: tracks };
}

function buildPair(project: ProjectDefinition): [GraphBuildResult, GraphBuildResult] {
  return [
    buildGraphIR(project, builtinRegistry()),
    new IncrementalGraphBuilder(builtinRegistry()).build(project),
  ];
}

// Each corpus entry declares the expected ground truth alongside the project.
// `expectOrder: null` means graph === undefined (error cases).
const CORPUS: ReadonlyArray<{
  label: string;
  project: ProjectDefinition;
  expectOrder: readonly string[] | null;
  expectRuleIds: readonly string[];
}> = [
  {
    label: "clean",
    project: freeProject([
      { id: "root" },
      { id: "leaf", keyframes: { fk: { requires: { base: "~/root" } } } },
    ]),
    expectOrder: ["~/root", "~/leaf"],
    expectRuleIds: [],
  },
  {
    label: "cycle",
    project: freeProject([
      { id: "a", keyframes: { fk: { requires: { base: "~/b" } } } },
      { id: "b", keyframes: { fk: { requires: { base: "~/a" } } } },
    ]),
    expectOrder: null,
    expectRuleIds: ["graph-cycle"],
  },
  {
    label: "unknown-source",
    project: freeProject([{ id: "arm", keyframes: { fk: { requires: { base: "~/missing" } } } }]),
    expectOrder: null,
    expectRuleIds: ["edge-unknown-source"],
  },
  {
    label: "self-reference",
    project: freeProject([{ id: "arm", keyframes: { fk: { requires: { base: "~/arm" } } } }]),
    expectOrder: null,
    expectRuleIds: ["edge-self-reference"],
  },
];

describe("finalizeGraph", () => {
  it("T-C0.1 produces correct order and diagnostics for every corpus case", () => {
    for (const { label, project, expectOrder, expectRuleIds } of CORPUS) {
      const [reference, incremental] = buildPair(project);

      // Cross-builder deep equality: the exact regression C0 exists to fix. If one builder
      // produces a different message (e.g. raw edgeKey vs describeEdge), this fails.
      expect(reference.diagnostics, `${label}: diagnostics agree`).toEqual(incremental.diagnostics);

      // Ground-truth: both builders produce the expected output, not just mutual agreement.
      for (const [tag, result] of [
        [`buildGraphIR(${label})`, reference],
        [`IncrementalGraphBuilder(${label})`, incremental],
      ] as const) {
        if (expectOrder === null) {
          expect(result.graph, `${tag}: graph should be absent`).toBeUndefined();
        } else {
          expect(result.graph?.order, `${tag}: order`).toEqual(expectOrder);
        }
        expect(
          result.diagnostics.map((d) => d.ruleId),
          `${tag}: rule ids`,
        ).toEqual(expectRuleIds);
      }
    }
  });

  it("EV-8 keeps that agreement when every rebuild is an evicting one", () => {
    // `buildPair` constructs a fresh builder per call, so nothing above this line ever asks the
    // incremental builder a second question. One builder walks the whole corpus here, which means
    // every entry after the first is answered by a builder whose cache holds the previous entry's
    // tracks and sweeps them on the way through. Eviction must not change one diagnostic. Issue
    // #225.
    const incremental = new IncrementalGraphBuilder(builtinRegistry());
    for (const { label, project, expectOrder, expectRuleIds } of CORPUS) {
      const reference = buildGraphIR(project, builtinRegistry());
      const swept = incremental.build(project);

      expect(swept.diagnostics, `${label}: diagnostics agree after a sweep`).toEqual(
        reference.diagnostics,
      );
      expect(
        swept.diagnostics.map((d) => d.ruleId),
        `${label}: rule ids after a sweep`,
      ).toEqual(expectRuleIds);
      if (expectOrder === null) {
        expect(swept.graph, `${label}: graph should be absent after a sweep`).toBeUndefined();
      } else {
        expect(swept.graph?.order, `${label}: order after a sweep`).toEqual(expectOrder);
      }
      // Residency is bounded by the entry just built, so no track of any earlier corpus entry is
      // still resident. The corpus reuses ids across entries with fresh objects, which makes every
      // rebuild a miss rather than a stale hit.
      expect(incremental.cachedNodeCount, `${label}: residency`).toBeLessThanOrEqual(
        project.freeTracks?.length ?? 0,
      );
    }
  });

  it("T-C0.3 reports a duplicate edge through describeEdge in a hand-built node set", () => {
    // An authored project cannot produce two identical edges any more: the only authored edge form
    // is a requirement binding, and one track addresses one slot once. The duplicate rule is still a
    // graph invariant, so it is asked of `finalizeGraph` directly, and this is also what keeps the
    // diagnostic wording on `describeEdge` rather than on the raw `edgeKey`.
    const edge = {
      observerId: "~/arm",
      sourceId: "~/root",
      role: "input",
      requirement: { plugin: "fk", slot: "base" },
    } as const;
    const node = (
      id: string,
      authoredIndex: number,
      edges: GraphNode["edges"] = [],
    ): GraphNode => ({
      id,
      owner: "free",
      authoredIndex,
      track: { id: id.slice(2) },
      edges,
    });
    const result = finalizeGraph(
      [node("~/root", 0), node("~/arm", 1, [edge, edge])],
      [],
      builtinRegistry(),
    );

    expect(result.graph).toBeUndefined();
    expect(result.diagnostics.map(({ ruleId }) => ruleId)).toEqual(["edge-duplicate"]);
    // describeEdge produces: "<observerId> <- <sourceId> (<role>)[<scope>]"
    expect(result.diagnostics[0]?.message).toMatch(/ <- /);
    expect(result.diagnostics[0]?.message).toMatch(/\(input\)/);
    expect(result.diagnostics[0]?.message).not.toMatch(/^\d+:/);
  });

  // T-C0.2: finalizeGraph owns the freeze. Every object it returns must be frozen so that
  // downstream mutation (e.g. attaching `solves` by accident, finding #4 in the plan) fails
  // loudly in strict mode rather than silently corrupting shared state.
  it("T-C0.2 freezes every object in the result", () => {
    const { project } = CORPUS.find((c) => c.label === "clean")!;
    const result = buildGraphIR(project, builtinRegistry());
    expect(result.graph).toBeDefined();
    const graph = result.graph!;

    expect(Object.isFrozen(result.diagnostics)).toBe(true);
    expect(Object.isFrozen(graph)).toBe(true);
    expect(Object.isFrozen(graph.nodes)).toBe(true);
    expect(Object.isFrozen(graph.nodeById)).toBe(true);
    expect(Object.isFrozen(graph.order)).toBe(true);
    for (const node of graph.nodes) {
      expect(Object.isFrozen(node), `node ${node.id} frozen`).toBe(true);
      expect(Object.isFrozen(node.edges), `node ${node.id} edges frozen`).toBe(true);
      for (const edge of node.edges)
        expect(Object.isFrozen(edge), `edge in ${node.id} frozen`).toBe(true);
    }
  });
});
