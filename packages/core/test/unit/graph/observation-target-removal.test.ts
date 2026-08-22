import { describe, expect, it } from "vitest";
import type { ObservationDefinition, ProjectDefinition } from "../../../src/contract/v5";
import { validateV5 } from "../../../src/contract/validate-v5";
import type { GraphEdge } from "../../../src/graph/ir";
import { resolveObservationEdge } from "../../../src/graph/ir";
import { ObservationState } from "../../../src/graph/observation-state";

/**
 * `true` exactly when `K` is not a member of `T`.
 *
 * Asserted through a typed constant rather than a bare alias, because an unused alias is erased
 * before `tsc --noEmit` reads it. A member that is still declared has to fail an assignment for a
 * red run to name it.
 */
type Absent<T, K extends string> = K extends keyof T ? false : true;

const OBSERVATION_TARGET_ABSENT: Absent<ObservationDefinition, "target"> = true;
const EDGE_TARGET_ABSENT: Absent<GraphEdge, "target"> = true;

const PATH = "motions[0].tracks[1].observes";

const INPUT_WITH_TARGET = {
  source: "root",
  role: "input",
  target: "pointer",
} as unknown as ObservationDefinition;

const OUTPUT_WITH_TARGET = {
  source: "root",
  role: "output",
  target: "pointer",
} as unknown as ObservationDefinition;

/**
 * Two input edges to one source, separated only by the removed field.
 *
 * On the unmodified parent this is a valid project carrying two distinct edges, which is the only
 * thing a target ever did. It is the case that makes the removal a behavior change rather than a
 * type edit, and the reason the field is refused instead of left undeclared: ignored, this project
 * would fail with `observation-duplicate` and name a duplicate edge nobody authored.
 */
const TWO_TARGETS = {
  schemaVersion: 5,
  motions: [
    {
      id: "hero",
      trigger: { type: "manual" },
      tracks: [
        { id: "root" },
        {
          id: "child",
          observes: [
            { source: "root", role: "input", target: "a" },
            { source: "root", role: "input", target: "b" },
          ],
        },
      ],
    },
  ],
} as unknown as ProjectDefinition;

const ruleIds = (diagnostics: readonly { readonly ruleId: string }[]): readonly string[] =>
  diagnostics.map(({ ruleId }) => ruleId);

// `V-6` retires with the generic input channel it guarded: it pinned that a projected input
// observation still resolved to one identified, ordered edge, and there is no projected input
// observation left to resolve. `J-4` refuses the field it authored. See ADR-047.
//
// The target guard deliberately runs ahead of the two refusals ADR-047 adds, so `V-2` through
// `V-4` still report `observation-target-unsupported` for a fixture that carries a role too.
describe("ObservationDefinition.target is removed, not ignored", () => {
  it("V-1 declares no target on the authored observation or on the graph edge", () => {
    // Red in `typecheck` rather than in the runner: both constants are `true` at run time on the
    // parent, and it is the assignment that fails while the member is still declared.
    expect(OBSERVATION_TARGET_ABSENT).toBe(true);
    expect(EDGE_TARGET_ABSENT).toBe(true);
  });

  it("V-2 refuses an authored target on an input observation", () => {
    const resolved = resolveObservationEdge(INPUT_WITH_TARGET, "hero/child", "hero", PATH);
    expect(resolved.edge).toBeUndefined();
    expect(ruleIds(resolved.diagnostics)).toEqual(["observation-target-unsupported"]);
    expect(resolved.diagnostics[0]?.path).toBe(PATH);
  });

  it("V-3 refuses an authored target on an output observation under the same rule id", () => {
    // `observation-output-target` is gone. One rule owns the field on both roles, because it has
    // no consumer on either and a role-specific refusal implied it had one somewhere.
    const resolved = resolveObservationEdge(OUTPUT_WITH_TARGET, "hero/child", "hero", PATH);
    expect(resolved.edge).toBeUndefined();
    expect(ruleIds(resolved.diagnostics)).toEqual(["observation-target-unsupported"]);
  });

  it("V-4 names the removed field instead of reporting a duplicate edge", () => {
    const result = validateV5(TWO_TARGETS);
    expect(result.valid).toBe(false);
    expect(ruleIds(result.diagnostics)).toEqual([
      "observation-target-unsupported",
      "observation-target-unsupported",
    ]);
  });

  it("V-5 keeps one live edge for an edge object that still carries a target", () => {
    // Identity, normalization, and the snapshot are one story: `edgeKey` no longer reads a target,
    // `normalizeEdge` no longer copies one, and live state therefore cannot disagree with a
    // candidate graph about how many edges an observer has.
    const state = new ObservationState();
    state.addNode("hero/child");
    state.addNode("hero/root");
    const live: GraphEdge = { observerId: "hero/child", sourceId: "hero/root", role: "input" };
    state.addEdge(live);
    const stray = { ...live, target: "pointer" } as GraphEdge;
    expect(state.hasEdge(stray)).toBe(true);
    expect(() => state.addEdge(stray)).toThrow(TypeError);
    expect(state.snapshot().edges).toEqual([live]);
  });
});
