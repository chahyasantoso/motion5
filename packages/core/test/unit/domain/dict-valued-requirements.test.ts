import { describe, expect, it } from "vitest";
import { readPluginBindings } from "../../../src/contract/keyframe-shape";
import * as solverSlots from "../../../src/contract/solver-slots";
import { PLUGIN_GOALS_SLOT } from "../../../src/contract/solver-slots";
import { validateKeyframes } from "../../../src/contract/validate-v5";
import type {
  Diagnostic,
  PluginRequiresBinding,
  ProjectDefinition,
  TrackDefinition,
} from "../../../src/contract/v5";
import {
  buildGraphIR,
  compareEdges,
  describeEdge,
  edgeKey,
  resolveRequirementEdge,
  type SolveMember,
} from "../../../src/graph/ir";
import { PluginRegistry, type PluginDefinition } from "../../../src/domain/plugins";

// Issue #220. One invariant: a dict-valued `requires` slot is a declared capability of any plugin,
// and a derived binding carries its group key as a field rather than inside a formatted slot name.
//
// Three owners, separated here on purpose, because a case that asserted all three through one entry
// point could not say which owner regressed. `contract/keyframe-shape.ts` owns detection, by shape,
// with no registry in reach: a dict value under any slot expands to one binding per key, each
// carrying the slot exactly as authored and the key as `memberKey`. `PluginRegistry` owns whether
// the slot was allowed to carry a dict, which is `PluginRequirement.dict` and one rule that reads
// it. `graph/ir.ts` owns identity and resolution: the member key enters `requirementIdentity`,
// `compareEdges` and `describeEdge`, and `goalBindingsOf` gates on the base slot as well as on the
// field. That is the same split ADR-044 draws for keys and ADR-052 drew for slots.
//
// `targets[<memberId>]` is gone rather than kept beside the field. It was built in one module and
// re-parsed in another, which gave one fact a builder and a parser to disagree about, and it made
// the goals section a reserved parser constant instead of the graph layer's IK slot literal.
//
// DV-4 and DV-8 are regression pins rather than discoveries, and both are written before the
// refactor for that reason. DV-4 is the most likely red: two goals naming the same source node are
// distinguished today purely by the encoded slot, so collapsing the slot without prefixing the
// member key into `requirementIdentity` makes both edges byte-identical and reports
// `observation-duplicate` on a rig that loads clean. DV-8 is the mirror: gating `goalBindingsOf` on
// `memberKey` alone would read a future spring or spline plugin's dict as IK goals.
//
// The mutation guards this file is held to, which are not cases of their own: drop `memberKey` from
// `requirementIdentity` and DV-4 goes red; drop the `dict` check and DV-2 goes red; gate
// `goalBindingsOf` on `memberKey` alone and DV-8 goes red.

function ruleIds(keyframes: unknown): readonly string[] {
  const diagnostics: Diagnostic[] = [];
  validateKeyframes(keyframes, "keyframes", diagnostics);
  return diagnostics.map(({ ruleId }) => ruleId).sort();
}

function registry(...plugins: readonly PluginDefinition[]): PluginRegistry {
  const result = new PluginRegistry();
  for (const plugin of plugins) result.register(plugin);
  return result;
}

function project(tracks: readonly TrackDefinition[]): ProjectDefinition {
  return {
    schemaVersion: 5,
    projectId: "dv",
    motions: [{ id: "walker", trigger: { type: "time" }, tracks }],
  };
}

/** A solver, with the goals slot declared as an ordinary dict-accepting slot rather than reserved. */
const ikStub: PluginDefinition = {
  name: "ik",
  keys: ["flip"],
  requirements: {
    root: { description: "base frame of the solver chain" },
    target: { description: "the one goal of a single-leaf chain" },
    targets: { description: "one goal per chain leaf, keyed by member id", dict: true },
  },
  stage: "compose",
  outputs: ["rotations"],
  compose: (values) => values,
};

/** A second dict-accepting plugin, under a name other than `targets`: the open/closed claim. */
const springStub: PluginDefinition = {
  name: "spring",
  keys: ["stiffness"],
  requirements: {
    anchor: { description: "the fixed end of the spring" },
    tensions: { description: "one tension source per segment", dict: true },
  },
  stage: "compose",
  outputs: ["tension"],
  compose: (values) => values,
};

/** A bone: scalar slots only, and therefore the behavior of every plugin shipped before this. */
const fkStub: PluginDefinition = {
  name: "fk",
  keys: ["length", "rotation"],
  requirements: {
    base: { description: "the parent this bone hangs from" },
    solver: { description: "the solver that owns this bone's rotation" },
  },
  stage: "compose",
  outputs: ["x", "y", "rotation"],
  compose: (values) => values,
};

const SPRING_DICT = {
  spring: { requires: { anchor: "post", tensions: { "seg-b": "goal-b", "seg-a": "goal-a" } } },
};

/** Two leaves off one root, both named, both reaching for the same node. DV-4's shape. */
const TWO_GOALS_ONE_SOURCE: readonly TrackDefinition[] = [
  { id: "shoulder" },
  { id: "goal" },
  {
    id: "arm-solve",
    keyframes: {
      ik: { requires: { root: "shoulder", targets: { "forearm-L": "goal", "forearm-R": "goal" } } },
    },
  },
  {
    id: "forearm-L",
    keyframes: {
      fk: { values: { length: 60 }, requires: { base: "shoulder", solver: "arm-solve" } },
    },
  },
  {
    id: "forearm-R",
    keyframes: {
      fk: { values: { length: 60 }, requires: { base: "shoulder", solver: "arm-solve" } },
    },
  },
];

/** The worked rig of ADR-051, addressed by member id. Nothing about it may move. */
const GOAL_DICT: readonly TrackDefinition[] = [
  { id: "shoulder" },
  { id: "hand-target" },
  {
    id: "arm-solve",
    keyframes: { ik: { requires: { root: "shoulder", targets: { forearm: "hand-target" } } } },
  },
  {
    id: "upper-arm",
    keyframes: {
      fk: { values: { length: 80 }, requires: { base: "shoulder", solver: "arm-solve" } },
    },
  },
  {
    id: "forearm",
    keyframes: {
      fk: { values: { length: 60 }, requires: { base: "upper-arm", solver: "arm-solve" } },
    },
  },
];

/** A member binding `solver` beside another plugin's dict. Nothing here is a goal. */
const MEMBER_WITH_FOREIGN_DICT: readonly TrackDefinition[] = [
  { id: "shoulder" },
  { id: "hand-target" },
  {
    id: "arm-solve",
    keyframes: { ik: { requires: { root: "shoulder", target: "hand-target" } } },
  },
  {
    id: "upper-arm",
    keyframes: {
      fk: { values: { length: 80 }, requires: { base: "shoulder", solver: "arm-solve" } },
      spring: { requires: { tensions: { forearm: "hand-target" } } },
    },
  },
  {
    id: "forearm",
    keyframes: {
      fk: { values: { length: 60 }, requires: { base: "upper-arm", solver: "arm-solve" } },
    },
  },
];

const goalBinding = (memberKey: string): PluginRequiresBinding =>
  Object.freeze({
    plugin: "ik",
    slot: PLUGIN_GOALS_SLOT,
    source: "goal",
    memberKey,
    authoredPath: `ik.requires.${PLUGIN_GOALS_SLOT}.${memberKey}`,
  });

describe("dict-valued requirement slots (issue #220)", () => {
  it("DV-1 a dict under any declared slot expands to one binding per key", () => {
    // Per-key expansion is identical to `ik`'s `targets` today: one binding per key, sorted, one
    // edge per distinct source, the slot exactly as authored, and the key carried as data.
    expect(readPluginBindings(SPRING_DICT)).toEqual([
      {
        plugin: "spring",
        slot: "anchor",
        source: "post",
        authoredPath: "spring.requires.anchor",
      },
      {
        plugin: "spring",
        slot: "tensions",
        source: "goal-a",
        memberKey: "seg-a",
        authoredPath: "spring.requires.tensions.seg-a",
      },
      {
        plugin: "spring",
        slot: "tensions",
        source: "goal-b",
        memberKey: "seg-b",
        authoredPath: "spring.requires.tensions.seg-b",
      },
    ]);

    const resolved = registry(springStub).resolveForKeyframes(SPRING_DICT);
    expect(resolved.diagnostics).toEqual([]);
    expect(resolved.requirements).toEqual([
      { plugin: "spring", slot: "anchor", source: "post" },
      { plugin: "spring", slot: "tensions", source: "goal-a", memberKey: "seg-a" },
      { plugin: "spring", slot: "tensions", source: "goal-b", memberKey: "seg-b" },
    ]);
  });

  it("DV-2 a dict at a slot that declared none is refused by name", () => {
    // The case the issue asked for and could not have got. Shape-based detection in a registry-free
    // parser expands a dict under any slot, including one that means a single source, and `base` is
    // legitimately declared by `fk`, so neither `validateKeyframes` nor a slot-name check can
    // answer. The declaration is what answers, and it is data rather than a predicate.
    const resolved = registry(fkStub).resolveForKeyframes({
      fk: { requires: { base: { "seg-a": "post" } } },
    });
    const refused = resolved.diagnostics.find(
      ({ ruleId }) => ruleId === "plugin-requirement-dict-unsupported",
    );
    expect(refused?.path).toBe("keyframes.fk.requires.base.seg-a");
    expect(refused?.severity).toBe("error");
    expect(refused?.ids).toEqual(["fk", "base"]);
    expect(resolved.requirements).toEqual([]);
  });

  it("DV-3 a dict at an undeclared slot is still plugin-unknown-requirement", () => {
    // Unchanged, and it now cites the authored slot rather than a derived spelling the author never
    // typed: `destination`, not `destination[seg-a]`.
    const resolved = registry(fkStub).resolveForKeyframes({
      fk: { requires: { destination: { "seg-a": "post" } } },
    });
    const unknown = resolved.diagnostics.find(
      ({ ruleId }) => ruleId === "plugin-unknown-requirement",
    );
    expect(unknown?.path).toBe("keyframes.fk.requires.destination.seg-a");
    expect(unknown?.ids).toEqual(["fk", "destination"]);
  });

  it("DV-4 two goals naming one source node stay two distinct edges", () => {
    // The regression pin. `edgeKey` composes `observerId`, `sourceId`, `role` and
    // `requirementIdentity`, and the identity was length-prefixed plugin and slot only. Two goals
    // naming the same source were distinguished purely by the encoded slot, so the member key has to
    // be length-prefixed into the identity for this rig to keep loading at all.
    const built = buildGraphIR(project(TWO_GOALS_ONE_SOURCE));
    expect(built.diagnostics).toEqual([]);
    const solver = built.graph?.nodeById["walker/arm-solve"];
    const goals = (solver?.edges ?? []).filter(
      (edge) => edge.requirement?.slot === PLUGIN_GOALS_SLOT,
    );
    expect(goals).toHaveLength(2);
    expect(goals.map((edge) => edge.sourceId)).toEqual(["walker/goal", "walker/goal"]);
    expect(new Set(goals.map((edge) => edgeKey(edge))).size).toBe(2);
  });

  it("DV-5 member key orders and labels two derived bindings of one slot", () => {
    // Ordering and the label, because the duplicate diagnostic that does fire has to name which goal
    // it fired on. Both edges name one source, so `compareEdges` reaches the slot compare and then
    // the tiebreak after it.
    const first = resolveRequirementEdge(goalBinding("seg-a"), "hero/solve", "hero", "test").edge;
    const second = resolveRequirementEdge(goalBinding("seg-b"), "hero/solve", "hero", "test").edge;
    expect(compareEdges(first!, second!)).toBeLessThan(0);
    expect(compareEdges(second!, first!)).toBeGreaterThan(0);
    expect(compareEdges(first!, first!)).toBe(0);
    expect(describeEdge(first!)).toBe("hero/solve <- hero/goal (input) [ik.targets.seg-a]");
  });

  it("DV-6 a scalar behaves exactly as it did, at an ordinary slot and at the goals slot", () => {
    expect(readPluginBindings({ fk: { requires: { base: "shoulder" } } })).toEqual([
      {
        plugin: "fk",
        slot: "base",
        source: "shoulder",
        authoredPath: "fk.requires.base",
      },
    ]);
    // The one shape rule that stays keyed on the literal, because it runs with no registry: this
    // name specifically carries a dict, and a scalar at it is malformed exactly as before.
    expect(ruleIds({ ik: { requires: { targets: "hand-target" } } })).toEqual([
      "keyframes-targets-shape",
    ]);
    expect(ruleIds({ ik: { requires: { targets: [] } } })).toEqual(["keyframes-targets-shape"]);
    expect(ruleIds({ ik: { requires: { targets: {} } } })).toEqual(["keyframes-targets-empty"]);
    expect(ruleIds({ ik: { requires: { targets: { forearm: "" } } } })).toEqual([
      "keyframes-targets-source",
    ]);
    expect(ruleIds({ ik: { requires: { targets: { "a[b]": "hand-target" } } } })).toEqual([
      "keyframes-targets-member",
    ]);
    // And the entry rules generalize with the parser, so a second dict-accepting plugin reaches its
    // own declaration instead of being refused as malformed one layer earlier.
    expect(ruleIds({ fk: { requires: { base: { "seg-a": "post" } } } })).toEqual([]);
  });

  it("DV-7 the goal-addressed chain derives exactly what it derived before", () => {
    // The observable-behavior claim. No authored spelling moves and no derived chain moves; the only
    // thing that changed is where the group key lives.
    const built = buildGraphIR(project(GOAL_DICT));
    expect(built.diagnostics).toEqual([]);
    const expected: readonly SolveMember[] = [
      { id: "walker/upper-arm", base: "walker/shoulder" },
      { id: "walker/forearm", base: "walker/upper-arm", goal: "walker/hand-target" },
    ];
    expect(built.graph?.nodeById["walker/arm-solve"]?.solves).toEqual(expected);
  });

  it("DV-8 another plugin's dict is not read as a solver goal", () => {
    // `goalBindingsOf` classifies with no registry in reach, so it gates on the base slot as well as
    // on the field. On `memberKey` alone this rig reports `ik-mode-ambiguous` against the member and
    // runs six IK rules over a spring's tensions.
    const built = buildGraphIR(project(MEMBER_WITH_FOREIGN_DICT));
    expect(built.diagnostics.filter(({ ruleId }) => ruleId.startsWith("ik-"))).toEqual([]);
    expect(built.diagnostics).toEqual([]);
  });

  it("DV-9 the grammar module is one constant and nothing else", () => {
    // The string-encoding path is removed rather than left dead beside the field, asserted against
    // the module's own export surface rather than by scanning source text, which ARCHITECTURE.md
    // section 14 excludes as behavioral evidence.
    expect(Object.keys(solverSlots).sort()).toEqual(["PLUGIN_GOALS_SLOT"]);
    expect(solverSlots.PLUGIN_GOALS_SLOT).toBe("targets");
  });

  it("DV-10 a plugin supplying the retired slot predicate gains nothing by it", () => {
    // `PluginSlotClaim` and `PluginDefinition.claimsSlot` are deleted, so a JavaScript author can
    // still pass one and it answers for nothing. Provably ignored rather than merely unread.
    const withPredicate = { ...fkStub, claimsSlot: () => true } as unknown as PluginDefinition;
    const resolved = registry(withPredicate).resolveForKeyframes({
      fk: { requires: { destination: "post" } },
    });
    expect(resolved.diagnostics.map(({ ruleId }) => ruleId)).toEqual([
      "plugin-unknown-requirement",
    ]);
  });

  it("DV-11 the goals slot is an ordinary declared slot now", () => {
    // The inverted reservation. `registry` used to throw on a declared `targets`, because a goal
    // reached the plugin through the predicate; declaring it is the whole point.
    expect(() => registry(ikStub)).not.toThrow();
    const resolved = registry(ikStub).resolveForKeyframes({
      ik: { requires: { root: "shoulder", targets: { forearm: "hand-target" } } },
    });
    expect(resolved.diagnostics).toEqual([]);
    expect(resolved.requirements).toEqual([
      { plugin: "ik", slot: "root", source: "shoulder" },
      { plugin: "ik", slot: "targets", source: "hand-target", memberKey: "forearm" },
    ]);
  });
});
