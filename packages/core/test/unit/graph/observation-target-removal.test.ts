import { describe, expect, it } from "vitest";
import type { ObservationDefinition, ProjectDefinition } from "../../../src/contract/v5";
import { validateV5 } from "../../../src/validate-v5";
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
 * The three removed fields, authored as a key that holds `undefined`.
 *
 * `Object.entries` keeps an own key whose value is `undefined` while a JSON round trip drops it, so
 * this is an entry a loader can be handed and the layer that reads the key is the layer that has to
 * ask. Three constants rather than one fixture carrying all three, because the refusal order `V-2`
 * through `V-4` depend on is a claim about which field is reported first, and a fixture that
 * authored every field could not state anything about the other two.
 */
const TARGET_UNDEFINED = { source: "root", target: undefined } as unknown as ObservationDefinition;
const ROLE_UNDEFINED = { source: "root", role: undefined } as unknown as ObservationDefinition;
const PROJECTION_UNDEFINED = {
  source: "root",
  projection: undefined,
} as unknown as ObservationDefinition;

/** No removed key at all, which is what bounds the widening the three above describe. */
const BARE_SOURCE: ObservationDefinition = { source: "root" };

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
    expect(resolved.kind).toBe("refused");
    expect("value" in resolved).toBe(false);
    expect(ruleIds(resolved.diagnostics)).toEqual(["observation-target-unsupported"]);
    expect(resolved.diagnostics[0]?.path).toBe(PATH);
  });

  it("V-3 refuses an authored target on an output observation under the same rule id", () => {
    // `observation-output-target` is gone. One rule owns the field on both roles, because it has
    // no consumer on either and a role-specific refusal implied it had one somewhere.
    const resolved = resolveObservationEdge(OUTPUT_WITH_TARGET, "hero/child", "hero", PATH);
    expect(resolved.kind).toBe("refused");
    expect("value" in resolved).toBe(false);
    expect(ruleIds(resolved.diagnostics)).toEqual(["observation-target-unsupported"]);
  });

  it("V-4 names the removed field instead of reporting a duplicate edge", () => {
    const result = validateV5(TWO_TARGETS);
    expect(result.kind).toBe("refused");
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
    const live: GraphEdge = {
      observerId: "hero/child",
      sourceId: "hero/root",
      role: "input",
      requirement: { plugin: "fk", slot: "base" },
    };
    state.addEdge(live);
    const stray = { ...live, target: "pointer" } as GraphEdge;
    expect(state.hasEdge(stray)).toBe(true);
    expect(() => state.addEdge(stray)).toThrow(TypeError);
    expect(state.snapshot().edges).toEqual([live]);
  });

  it("V-22 refuses an authored target whose value is undefined", () => {
    // The read asks whether the key was authored, not what sits at it. `{ target: undefined }` is a
    // key a reader would ignore, and ignoring it was the bypass: the same entry carrying a value
    // was refused, so two spellings of one authored field disagreed about whether it exists at all.
    // GUARDRAILS states this rule for `ProjectDefinition.templates`, and `contract/validate-v5.ts`
    // already reads its own two removed fields as `"use" in track` and `"templates" in input`, so
    // this is a third reader agreeing with them rather than a new decision. Issue #469.
    const resolved = resolveObservationEdge(TARGET_UNDEFINED, "hero/child", "hero", PATH);
    expect(resolved.kind).toBe("refused");
    expect("value" in resolved).toBe(false);
    expect(ruleIds(resolved.diagnostics)).toEqual(["observation-target-unsupported"]);
    expect(resolved.diagnostics[0]?.path).toBe(PATH);
  });

  it("V-23 refuses an authored role or projection under its own rule id", () => {
    // One rule id each, because a diagnostic names what the author wrote rather than the removal
    // the three fields share. Red on the parent under both spellings, where three copied guards
    // each tested the value at the key instead of the key.
    const role = resolveObservationEdge(ROLE_UNDEFINED, "hero/child", "hero", PATH);
    expect(role.kind).toBe("refused");
    expect(ruleIds(role.diagnostics)).toEqual(["observation-role-unsupported"]);
    const projection = resolveObservationEdge(PROJECTION_UNDEFINED, "hero/child", "hero", PATH);
    expect(projection.kind).toBe("refused");
    expect(ruleIds(projection.diagnostics)).toEqual(["observation-projection-unsupported"]);
  });

  it("V-24 still accepts an observes entry that authors no removed key", () => {
    // The bound on the widening, and the reason it is a case rather than a sentence: a key-presence
    // read refuses more than a value read did, so something has to say how much more. An ordinary
    // entry still resolves to exactly one identified output edge and carries no requirement.
    const resolved = resolveObservationEdge(BARE_SOURCE, "hero/child", "hero", PATH);
    expect(resolved.kind).toBe("accepted");
    expect(resolved.kind === "accepted" ? resolved.value : undefined).toEqual({
      observerId: "hero/child",
      sourceId: "hero/root",
      role: "output",
    });
  });
});
