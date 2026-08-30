import { describe, expect, it } from "vitest";
import { IncrementalGraphBuilder } from "../../../src/adapters/graph-builder/incremental";
import { buildGraphIR, type GraphBuildResult } from "../../../src/graph/ir";
import type { ProjectDefinition, TrackDefinition } from "../../../src/contract/v5";

// Slice C0 of issue #195. Two graph builders share a post-collect tail and duplicate it almost
// verbatim: `buildGraphIR` (used by load-time validation) and `IncrementalGraphBuilder.build` (used
// by the runtime). Extracting `finalizeGraph` gives that tail one owner, so a solver pass can be
// added in one place and the validator and runtime cannot drift.
//
// The one observable divergence the duplication already produced is the `observation-duplicate`
// message: one builder words it through `describeEdge`, the other through the raw `edgeKey`. The
// corpus equality below is red on the parent because of that message difference, and it is the
// invariant the extraction exists to make cheap.

function freeProject(tracks: readonly TrackDefinition[]): ProjectDefinition {
  return { schemaVersion: 5, projectId: "c0", motions: [], freeTracks: tracks };
}

function buildPair(project: ProjectDefinition): [GraphBuildResult, GraphBuildResult] {
  return [buildGraphIR(project), new IncrementalGraphBuilder().build(project)];
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
    project: freeProject([{ id: "root" }, { id: "leaf", observes: [{ source: "~/root" }] }]),
    expectOrder: ["~/root", "~/leaf"],
    expectRuleIds: [],
  },
  {
    label: "cycle",
    project: freeProject([
      { id: "a", observes: [{ source: "~/b" }] },
      { id: "b", observes: [{ source: "~/a" }] },
    ]),
    expectOrder: null,
    expectRuleIds: ["graph-cycle"],
  },
  {
    label: "unknown-source",
    project: freeProject([{ id: "arm", observes: [{ source: "~/missing" }] }]),
    expectOrder: null,
    expectRuleIds: ["observation-unknown-source"],
  },
  {
    label: "self-reference",
    project: freeProject([{ id: "arm", observes: [{ source: "~/arm" }] }]),
    expectOrder: null,
    expectRuleIds: ["observation-self-reference"],
  },
  {
    label: "duplicate-edge",
    project: freeProject([
      { id: "arm", observes: [{ source: "~/root" }, { source: "~/root" }] },
      { id: "root" },
    ]),
    expectOrder: null,
    expectRuleIds: ["observation-duplicate"],
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
    const incremental = new IncrementalGraphBuilder();
    for (const { label, project, expectOrder, expectRuleIds } of CORPUS) {
      const reference = buildGraphIR(project);
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

  it("T-C0.3 observation-duplicate message uses describeEdge format in both builders", () => {
    // Focused pin for the specific pre-C0 divergence: one builder used `describeEdge`
    // ("~/arm <- ~/root (output)"), the other used the raw `edgeKey` (a length-prefixed blob).
    // Drive both builders explicitly so reverting the unification in incremental.ts breaks here.
    const { project } = CORPUS.find((c) => c.label === "duplicate-edge")!;
    const [reference, incremental] = buildPair(project);
    for (const [tag, result] of [
      ["buildGraphIR", reference],
      ["IncrementalGraphBuilder", incremental],
    ] as const) {
      const [dup] = result.diagnostics.filter((d) => d.ruleId === "observation-duplicate");
      expect(dup, `${tag}: duplicate diagnostic present`).toBeDefined();
      // describeEdge produces: "<observerId> <- <sourceId> (<role>)[<scope>]"
      expect(dup?.message, `${tag}: arrow format`).toMatch(/ <- /);
      expect(dup?.message, `${tag}: role format`).toMatch(/\(output\)/);
      // raw edgeKey has no spaces or arrow — a length-prefixed blob like "5:~/arm5:..."
      expect(dup?.message, `${tag}: not edgeKey format`).not.toMatch(/^\d+:/);
    }
  });

  // T-C0.2: finalizeGraph owns the freeze. Every object it returns must be frozen so that
  // downstream mutation (e.g. attaching `solves` by accident, finding #4 in the plan) fails
  // loudly in strict mode rather than silently corrupting shared state.
  it("T-C0.2 freezes every object in the result", () => {
    const { project } = CORPUS.find((c) => c.label === "clean")!;
    const result = buildGraphIR(project);
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
