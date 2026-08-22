import { describe, expect, it } from "vitest";
import type { ObservationDefinition, ProjectDefinition } from "../../../src/contract/v5";
import type { Track } from "../../../src/domain/track";
import type { GraphEdge } from "../../../src/graph/ir";
import { buildGraphIR, edgeKey, resolveObservationEdge } from "../../../src/graph/ir";
import type { PublisherNode } from "../../../src/runtime/graph-publisher";

/**
 * `true` exactly when `K` is not a member of `T`.
 *
 * Asserted through a typed constant rather than a bare alias, because an unused alias is erased
 * before `tsc --noEmit` reads it. A member that is still declared has to fail an assignment for a
 * red run to name it. Same shape as `V-1`.
 */
type Absent<T, K extends string> = K extends keyof T ? false : true;

const OBSERVATION_ROLE_ABSENT: Absent<ObservationDefinition, "role"> = true;
const OBSERVATION_PROJECTION_ABSENT: Absent<ObservationDefinition, "projection"> = true;
const EDGE_PROJECTION_ABSENT: Absent<GraphEdge, "projection"> = true;

/**
 * `0 | 1` once the flat input bag is gone, because the one remaining parameter is optional, and
 * `0 | 1 | 2` on the parent. `compose.length` cannot be asserted instead: a default value zeroes
 * it out, so the arity has to be read from the type.
 */
type TrackComposeArity = Parameters<Track["compose"]>["length"];
const TRACK_COMPOSE_TAKES_AT_MOST_ONE: TrackComposeArity extends 0 | 1 ? true : false = true;

/** The publisher's parameter is required, so this is exactly `1`, and exactly `2` on the parent. */
type PublisherComposeArity = Parameters<PublisherNode["compose"]>["length"];
const PUBLISHER_COMPOSE_TAKES_ONE: PublisherComposeArity extends 1 ? true : false = true;

const PATH = "motions[0].tracks[1].observes";

const ROLE_INPUT = { source: "root", role: "input" } as unknown as ObservationDefinition;
const ROLE_OUTPUT = { source: "root", role: "output" } as unknown as ObservationDefinition;
const PROJECTED = {
  source: "root",
  projection: { pick: ["x"] },
} as unknown as ObservationDefinition;

/**
 * Both authored forms that derive an edge, on one track: a generic `observes` entry and a plugin
 * requirement binding. Graph construction reads both syntactically and holds no plugin registry,
 * so `fk` here names nothing that has to be registered.
 */
const MIXED: ProjectDefinition = {
  schemaVersion: 5,
  motions: [
    {
      id: "walk",
      trigger: { type: "manual" },
      tracks: [
        { id: "pelvis" },
        {
          id: "chest",
          observes: [{ source: "pelvis" }],
          keyframes: {
            fk: { length: { stops: [{ p: 0, v: 1 }] }, requires: { base: "pelvis" } },
          },
        },
      ],
    },
  ],
};

const OUTPUT_EDGE: GraphEdge = { observerId: "a/b", sourceId: "c/d", role: "output" };

const requirementEdge = (plugin: string, slot: string): GraphEdge => ({
  observerId: "a/b",
  sourceId: "c/d",
  role: "input",
  requirement: { plugin, slot },
});

const ruleIds = (diagnostics: readonly { readonly ruleId: string }[]): readonly string[] =>
  diagnostics.map(({ ruleId }) => ruleId);

describe("observes declares an output edge only", () => {
  it("J-1 declares no authored role or projection, and none on the graph edge", () => {
    // Red in `typecheck` rather than in the runner: all three constants are `true` at run time on
    // the parent, and it is the assignment that fails while the members are still declared.
    expect(OBSERVATION_ROLE_ABSENT).toBe(true);
    expect(OBSERVATION_PROJECTION_ABSENT).toBe(true);
    expect(EDGE_PROJECTION_ABSENT).toBe(true);
  });

  it("J-2 refuses an authored input role and produces no edge", () => {
    const resolved = resolveObservationEdge(ROLE_INPUT, "hero/child", "hero", PATH);
    expect(resolved.edge).toBeUndefined();
    expect(ruleIds(resolved.diagnostics)).toEqual(["observation-role-unsupported"]);
    expect(resolved.diagnostics[0]?.path).toBe(PATH);
  });

  it("J-3 refuses an authored output role under the same rule id", () => {
    // A removal, not a narrowing. If the only legal value is the default, then writing it is a
    // field accepted and then ignored, which is why ADR-046 refused a `target` on both roles too.
    const resolved = resolveObservationEdge(ROLE_OUTPUT, "hero/child", "hero", PATH);
    expect(resolved.edge).toBeUndefined();
    expect(ruleIds(resolved.diagnostics)).toEqual(["observation-role-unsupported"]);
  });

  it("J-4 refuses an authored projection under its own rule id", () => {
    // A different authored field gets a different rule id, so the diagnostic names what the author
    // actually wrote rather than the field that happens to share its removal.
    const resolved = resolveObservationEdge(PROJECTED, "hero/child", "hero", PATH);
    expect(resolved.edge).toBeUndefined();
    expect(ruleIds(resolved.diagnostics)).toEqual(["observation-projection-unsupported"]);
  });

  it("J-5 keeps role and requirement equivalent over a whole built graph", () => {
    // Two sources of truth are only a defect if they can disagree. `role` names the composition
    // phase and stays; this is what keeps it from drifting from `requirement`. Passes on the
    // parent by design and is not claimed as red.
    const graph = buildGraphIR(MIXED).graph;
    const edges = graph?.nodes.flatMap(({ edges: owned }) => [...owned]) ?? [];
    const mismatched = edges.filter(
      (edge) => (edge.role === "input") !== (edge.requirement !== undefined),
    );
    expect(edges).toHaveLength(2);
    expect(mismatched).toEqual([]);
  });

  it("J-6 identifies an edge without reading a projection", () => {
    const stray = { ...OUTPUT_EDGE, projection: { pick: ["x"] } } as GraphEdge;
    expect(edgeKey(stray)).toBe(edgeKey(OUTPUT_EDGE));
    expect(edgeKey(requirementEdge("fk", "base"))).not.toBe(edgeKey(OUTPUT_EDGE));
    expect(edgeKey(requirementEdge("fk", "base"))).not.toBe(
      edgeKey(requirementEdge("fk", "destination")),
    );
    // The separator case `E-2` and `E-3` proved for projection keys, carried to the one authored
    // string pair still inside the encoding. A separator a value can forge is not a separator.
    expect(edgeKey(requirementEdge("a|b", "c"))).not.toBe(edgeKey(requirementEdge("a", "b|c")));
  });

  it("J-9 leaves composition with one parameter on both seams", () => {
    // Red in `typecheck` for the same reason as `J-1`. The invariant is not "no caller passes a
    // flat bag" but that no parameter exists to pass one with.
    expect(TRACK_COMPOSE_TAKES_AT_MOST_ONE).toBe(true);
    expect(PUBLISHER_COMPOSE_TAKES_ONE).toBe(true);
  });
});
