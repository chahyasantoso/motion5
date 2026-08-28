import { describe, expect, it } from "vitest";
import { readPluginBindings } from "../../../src/contract/keyframe-shape";
import { goalSlot, PLUGIN_GOALS_SLOT, readGoalSlot } from "../../../src/contract/solver-slots";
import { validateKeyframes } from "../../../src/contract/validate-v5";
import type { Diagnostic, ProjectDefinition, TrackDefinition } from "../../../src/contract/v5";
import { buildGraphIR } from "../../../src/graph/ir";
import { PluginRegistry, type PluginDefinition } from "../../../src/domain/plugins";

// Slice D0 of issue #195. A solver reaches for one goal per chain leaf, and the number of leaves is
// the rig's property rather than the plugin's, so the slot set stops being enumerable. Three owners
// answer for that, and they are separated here on purpose: `contract/solver-slots.ts` owns the
// grammar, `PluginRegistry` owns whether a bound slot is declared at all, and `validateKeyframes`
// owns the registry-free shape of the authored dict. A case that asserted all three through one
// entry point could not say which owner regressed.
//
// The authored surface is one typed dict keyed by member id. `targets[<memberId>]` is derived and
// never authored: it exists so every goal stays exactly one binding and therefore exactly one edge,
// which is what leaves `graph/order.ts` and `runtime/graph-publisher.ts` untouched.

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

/** A solver: one named slot for the chain root, and the open goal family as a predicate. */
const ikStub: PluginDefinition = {
  name: "ik",
  keys: ["flip"],
  requirements: { root: { description: "base frame of the solver chain" } },
  claimsSlot: (slot) => readGoalSlot(slot) !== undefined,
  stage: "compose",
  outputs: ["rotations"],
  compose: (values) => values,
};

/** A bone: named slots only, and therefore the behavior of every plugin shipped before D0. */
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

function project(tracks: readonly TrackDefinition[]): ProjectDefinition {
  return {
    schemaVersion: 5,
    projectId: "d0",
    motions: [{ id: "walker", trigger: { type: "time" }, tracks }],
  };
}

/** One solver, two leaves off one root, one goal each. The shape positional slots got wrong. */
const TWO_GOAL_RIG: readonly TrackDefinition[] = [
  { id: "shoulder" },
  { id: "goal-L" },
  { id: "goal-R" },
  {
    id: "arm-solve",
    keyframes: {
      ik: {
        requires: {
          root: "shoulder",
          targets: { "forearm-L": "goal-L", "forearm-R": "goal-R" },
        },
      },
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

describe("plugin slot claims and the authored goal dict (Slice D0)", () => {
  it("SL-1 resolves a binding to a predicate-claimed slot beside a named one", () => {
    const resolved = registry(ikStub).resolveForKeyframes({
      ik: { requires: { root: "shoulder", targets: { forearm: "hand-target" } } },
    });
    expect(resolved.diagnostics).toEqual([]);
    expect(resolved.requirements).toEqual([
      { plugin: "ik", slot: "root", source: "shoulder" },
      { plugin: "ik", slot: "targets[forearm]", source: "hand-target" },
    ]);
    expect(resolved.plugins.map(({ name }) => name)).toEqual(["ik"]);
  });

  it("SL-2 still refuses a slot matching neither the record nor the predicate", () => {
    const resolved = registry(ikStub).resolveForKeyframes({
      ik: { requires: { destination: "hand-target" } },
    });
    const unknown = resolved.diagnostics.find(
      ({ ruleId }) => ruleId === "plugin-unknown-requirement",
    );
    expect(unknown?.path).toBe("keyframes.ik.requires.destination");
    expect(unknown?.severity).toBe("error");
    expect(unknown?.ids).toEqual(["ik", "destination"]);
  });

  it("SL-3 a plugin declaring no claimsSlot behaves exactly as it did before D0", () => {
    // The predicate is opt-in, so a goal bound under a plugin that never claimed one is refused by
    // the same rule and at the same path it always was. Nothing became legal by default.
    const clean = registry(fkStub).resolveForKeyframes({
      fk: { values: { length: 80 }, requires: { base: "shoulder" } },
    });
    expect(clean.diagnostics).toEqual([]);
    expect(clean.requirements).toEqual([{ plugin: "fk", slot: "base", source: "shoulder" }]);

    const refused = registry(fkStub).resolveForKeyframes({
      fk: { requires: { targets: { forearm: "hand-target" } } },
    });
    const unknown = refused.diagnostics.find(
      ({ ruleId }) => ruleId === "plugin-unknown-requirement",
    );
    expect(unknown?.ids).toEqual(["fk", "targets[forearm]"]);
    expect(unknown?.path).toBe("keyframes.fk.requires.targets.forearm");
  });

  it("SL-4 refuses a claimsSlot that is not a function at registration", () => {
    const bad = { ...ikStub, claimsSlot: "targets" } as unknown as PluginDefinition;
    expect(() => registry(bad)).toThrow(/claimsSlot must be a function/);
  });

  it("SL-5 the grammar round-trips a member id and rejects every near miss", () => {
    expect(PLUGIN_GOALS_SLOT).toBe("targets");
    expect(goalSlot("forearm")).toBe("targets[forearm]");
    expect(readGoalSlot(goalSlot("forearm"))).toBe("forearm");
    expect(readGoalSlot(goalSlot("walker/forearm"))).toBe("walker/forearm");
    expect(readGoalSlot(goalSlot("~/free-tip"))).toBe("~/free-tip");
    for (const slot of ["targets", "targets[]", "targetsx", "targets[a][b]", "target[a]", ""])
      expect(readGoalSlot(slot)).toBeUndefined();
  });

  it("SL-6 one authored dict derives one binding and one edge per goal", () => {
    // The dict is authoring surface only. Two goals under one slot name would overwrite each other
    // in the publisher's `collected[plugin][slot]`, and a goal that derived no edge would be
    // invisible to ordering and to the pending classification. One binding each is what makes
    // `J-5` hold verbatim here: every binding, including a goal, derives exactly one edge.
    const bindings = readPluginBindings(TWO_GOAL_RIG[3]!.keyframes);
    expect(bindings).toEqual([
      {
        plugin: "ik",
        slot: "root",
        source: "shoulder",
        authoredPath: "ik.requires.root",
      },
      {
        plugin: "ik",
        slot: "targets[forearm-L]",
        source: "goal-L",
        authoredPath: "ik.requires.targets.forearm-L",
      },
      {
        plugin: "ik",
        slot: "targets[forearm-R]",
        source: "goal-R",
        authoredPath: "ik.requires.targets.forearm-R",
      },
    ]);

    const built = buildGraphIR(project(TWO_GOAL_RIG));
    expect(built.diagnostics).toEqual([]);
    const solver = built.graph?.nodeById["walker/arm-solve"];
    expect(solver?.edges).toHaveLength(bindings.length);
    const goals = (solver?.edges ?? [])
      .filter((edge) => readGoalSlot(edge.requirement?.slot ?? "") !== undefined)
      .map((edge) => `${edge.requirement?.slot} <- ${edge.sourceId}`)
      .sort();
    expect(goals).toEqual([
      "targets[forearm-L] <- walker/goal-L",
      "targets[forearm-R] <- walker/goal-R",
    ]);
  });

  it("SL-7 validates the authored dict without a plugin registry", () => {
    // `keyframes-requires-source` cannot answer for this slot: it refuses a record outright, which
    // is what made the dict unauthorable. Four rules of its own instead, shape only.
    expect(ruleIds({ ik: { requires: { targets: { forearm: "hand-target" } } } })).toEqual([]);
    expect(ruleIds({ ik: { requires: { targets: "hand-target" } } })).toEqual([
      "keyframes-targets-shape",
    ]);
    expect(ruleIds({ ik: { requires: { targets: [] } } })).toEqual(["keyframes-targets-shape"]);
    expect(ruleIds({ ik: { requires: { targets: {} } } })).toEqual(["keyframes-targets-empty"]);
    expect(ruleIds({ ik: { requires: { targets: { forearm: "" } } } })).toEqual([
      "keyframes-targets-source",
    ]);
    // A bracket in an authored member id would forge the derived slot identity, so it is refused
    // here for the reason the colon is refused in every authored name.
    expect(ruleIds({ ik: { requires: { targets: { "a[b]": "hand-target" } } } })).toEqual([
      "keyframes-targets-member",
    ]);
  });

  it("SL-8 refuses the reserved goal spellings as declared requirement slots", () => {
    // A goal reaches a plugin through the predicate, because the member ids are the rig's. A named
    // slot spelled either way would be a second spelling of the same binding that the authored
    // dict expands straight past, which is a field accepted and then ignored.
    const named = { ...ikStub, requirements: { targets: {} } } as PluginDefinition;
    expect(() => registry(named)).toThrow(/reserved for authored goals/);
    const derived = { ...ikStub, requirements: { "targets[forearm]": {} } } as PluginDefinition;
    expect(() => registry(derived)).toThrow(/reserved for authored goals/);
  });
});
