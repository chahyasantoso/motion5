import { describe, expect, it } from "vitest";
import {
  declaresJoint,
  JOINT_KEY,
  JOINT_ONLY_KEYS,
  JOINT_VOCABULARY_KEYS,
} from "../../../src/contract/solver-constraints";
import { PluginRegistry, type PluginDefinition } from "../../../src/domain/plugins";
import { validateKeyframes } from "../../../src/contract/validate-v5";
import { buildGraphIR } from "../../../src/graph/ir";
import type { Diagnostic, ProjectDefinition, TrackDefinition } from "../../../src/contract/v5";
import { fkPlugin } from "../../../src/plugins/fk";
import { fk3dPlugin } from "../../../src/plugins/fk3d";
import { ikPlugin } from "../../../src/plugins/ik";
import { ik3dPlugin } from "../../../src/plugins/ik3d";
import { transform3dPlugin } from "../../../src/plugins/transform3d";
import { transformPlugin } from "../../../src/plugins/transform";

function registry(...plugins: readonly PluginDefinition[]) {
  const result = new PluginRegistry();
  for (const plugin of plugins) result.register(plugin);
  return result;
}

describe("3D plugin ownership", () => {
  it("TH-9 resolves grouped root and member ownership", () => {
    const resolved = registry(transform3dPlugin, fk3dPlugin, ik3dPlugin).resolveForKeyframes({
      transform3d: { values: { x: 0, z: 0 } },
      fk3d: { values: { length: 80 } },
      ik3d: { requires: { root: "root", target: "goal" } },
    });
    expect(resolved.diagnostics).toEqual([]);
    expect(resolved.plugins.map(({ name }) => name)).toEqual(["transform3d", "fk3d", "ik3d"]);
  });

  it("TH-10 refuses ungrouped shared keys and leaves z unclaimed without the 3D root", () => {
    const diagnostics: Diagnostic[] = [];
    validateKeyframes({ x: {} }, "keyframes", diagnostics);
    expect(diagnostics[0]?.ruleId).toBe("keyframes-ungrouped-key");
    const unknown = registry(transformPlugin).resolveForKeyframes({
      transform: { values: { z: {} } },
    });
    expect(unknown.diagnostics[0]?.ruleId).toBe("plugin-unknown-key");
  });

  it("TH-11 refuses 2D constraint vocabulary in a 3D group", () => {
    // `bend` and `flip` are the 2D solver keys a 3D solver still does not claim. The 3D bone now
    // claims every 2D member key: `weight` since ADR-116 gave `fk3d` a per-member solved weight,
    // `minRotation` since ADR-123 made it a 3D hinge's range, and `influence` since ADR-124 made it
    // weigh the 3D tree solve's compromise, beside the 3D-only `orient`.
    const resolved = registry(ik3dPlugin, fk3dPlugin).resolveForKeyframes({
      ik3d: { values: { bend: 1, flip: true } },
    });
    expect(resolved.diagnostics.map(({ ruleId }) => ruleId).sort()).toEqual([
      "plugin-unknown-key",
      "plugin-unknown-key",
    ]);
    const joint = registry(ik3dPlugin, fk3dPlugin).resolveForKeyframes({
      fk3d: { values: { joint: "hinge", axisY: 1, minRotation: -10, maxRotation: 45 } },
    });
    expect(joint.diagnostics).toEqual([]);
    const weights = registry(ik3dPlugin, fk3dPlugin).resolveForKeyframes({
      fk3d: { values: { influence: 2, orient: 0.5 } },
    });
    expect(weights.diagnostics).toEqual([]);
  });

  it("TH-88 the joint-declaring plugin set is exactly the plugins that claim the joint vocabulary", () => {
    // `contract/solver-constraints.ts` owns which member plugins' values are a 3D joint, because
    // the graph holds no registry; this holds that list equal to the claims every plugin definition
    // the package ships makes, so a plugin that claims `joint` cannot go unvalidated and the list
    // cannot name a plugin that never claims it (ADR-123). The six are every `PluginDefinition`
    // under `src/plugins`; a seventh belongs in this list.
    const definitions: readonly PluginDefinition[] = [
      fkPlugin,
      fk3dPlugin,
      ikPlugin,
      ik3dPlugin,
      transformPlugin,
      transform3dPlugin,
    ];
    for (const { name, keys: claimed } of definitions) {
      const keys: readonly string[] = claimed ?? [];
      expect(declaresJoint(name)).toBe(keys.includes(JOINT_KEY));
      // A joint plugin claims the whole vocabulary: a kind with a bound it cannot author is a load
      // rule speaking for a key nobody accepts. Any other plugin claims no joint-only key; the 2D
      // range keys are shared with `fk`, where they keep ADR-108's meaning.
      if (declaresJoint(name))
        expect(JOINT_VOCABULARY_KEYS.every((key) => keys.includes(key))).toBe(true);
      else expect(JOINT_ONLY_KEYS.filter((key) => keys.includes(key))).toEqual([]);
    }
    expect(declaresJoint("fk3d")).toBe(true);
    expect(declaresJoint("fk")).toBe(false);
  });

  it("TH-12 refuses a 3D chain with a member that is not fk3d at load, and only that", () => {
    const project = (members: readonly TrackDefinition[]): ProjectDefinition => ({
      schemaVersion: 5,
      projectId: "shape",
      motions: [
        {
          id: "rig",
          trigger: { type: "manual" },
          tracks: [
            { id: "root", keyframes: { transform3d: { values: {} } } },
            { id: "goal", keyframes: { transform3d: { values: { x: 10, y: 10, z: 10 } } } },
            { id: "solve", keyframes: { ik3d: { requires: { root: "root", target: "goal" } } } },
            ...members,
          ],
        },
      ],
    });
    const member = (id: string, base: string): TrackDefinition => ({
      id,
      keyframes: { fk3d: { values: { length: 10 }, requires: { base, solver: "solve" } } },
    });
    const refusals = (members: readonly TrackDefinition[]) =>
      buildGraphIR(project(members))
        .diagnostics.filter(({ ruleId }) => ruleId === "ik-chain-unsupported")
        .map(({ path, message }) => ({ path, message }));
    // Since ADR-122 the 3D shape is a tree of `fk3d` members: every count and every branching the
    // graph derives loads, the closed form answering two bones and 3D FABRIK the rest. The count and
    // path rules of ADR-114's prototype are withdrawn, not relaxed.
    expect(refusals([member("one", "root"), member("two", "one")])).toEqual([]);
    expect(refusals([member("one", "root")])).toEqual([]);
    expect(refusals([member("one", "root"), member("two", "one"), member("three", "two")])).toEqual(
      [],
    );
    // Siblings under the root are two paths, which the tree solve answers; the bare `target` over
    // them is still refused by the graph's own addressing rule, not by the shape.
    expect(refusals([member("one", "root"), member("two", "root")])).toEqual([]);
    expect(
      buildGraphIR(project([member("one", "root"), member("two", "root")]))
        .diagnostics.map(({ ruleId }) => ruleId)
        .filter((ruleId) => ruleId.startsWith("ik-")),
    ).toEqual(["ik-target-not-single-leaf"]);

    // Two members on one path in the wrong dimension: a 2D `fk` member reads `rotations`, which
    // `ik3d` never publishes, so it is refused at load rather than composing identity every tick.
    const flat = (id: string, base: string, solve: string): TrackDefinition => ({
      id,
      keyframes: { fk: { values: { length: 10 }, requires: { base, solver: solve } } },
    });
    expect(refusals([member("one", "root"), flat("two", "one", "solve")])).toEqual([
      {
        path: "rig/solve",
        message:
          'Solver "rig/solve" supports any chain of fk3d members only, but its derived members are fk3d at depth 1, fk at depth 2.',
      },
    ]);

    // The converse: `fk3d` is dedicated to `ik3d`, so a 2D `ik` solver refuses it by name and still
    // takes any chain of its own members, of any count and branching.
    const planar = (members: readonly TrackDefinition[]): ProjectDefinition => ({
      schemaVersion: 5,
      projectId: "planar",
      motions: [
        {
          id: "rig",
          trigger: { type: "manual" },
          tracks: [
            { id: "root", keyframes: { transform: { values: {} } } },
            { id: "goal", keyframes: { transform: { values: { x: 10, y: 10 } } } },
            { id: "flat", keyframes: { ik: { requires: { root: "root", target: "goal" } } } },
            ...members,
          ],
        },
      ],
    });
    const planarRefusals = (members: readonly TrackDefinition[]) =>
      buildGraphIR(planar(members))
        .diagnostics.filter(({ ruleId }) => ruleId === "ik-chain-unsupported")
        .map(({ path, message }) => ({ path, message }));
    const spatial = (id: string, base: string): TrackDefinition => ({
      id,
      keyframes: { fk3d: { values: { length: 10 }, requires: { base, solver: "flat" } } },
    });
    expect(planarRefusals([flat("one", "root", "flat"), flat("two", "one", "flat")])).toEqual([]);
    expect(
      planarRefusals([
        flat("one", "root", "flat"),
        flat("two", "one", "flat"),
        flat("three", "two", "flat"),
      ]),
    ).toEqual([]);
    expect(planarRefusals([flat("one", "root", "flat"), spatial("two", "one")])).toEqual([
      {
        path: "rig/flat",
        message:
          'Solver "rig/flat" supports any chain without fk3d members, but its derived members are fk at depth 1, fk3d at depth 2.',
      },
    ]);
  });

  it("TH-13 keeps the 3D output channel distinct from 2D rotations", () => {
    const resolved = registry(ik3dPlugin, fk3dPlugin).resolveForKeyframes({
      ik3d: { requires: { root: "root", target: "goal" } },
      fk3d: { values: { length: 80 } },
    });
    expect(resolved.diagnostics).toEqual([]);
    // The pose channel is dimensional and distinct; `inspection` is shared with 2D on purpose,
    // because it is one record read through one owner (ADR-120).
    expect(ik3dPlugin.outputs).toEqual(["rotations3d", "inspection"]);
    expect(ik3dPlugin.outputs).not.toContain("rotations");
  });
});
