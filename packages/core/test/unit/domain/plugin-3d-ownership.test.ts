import { describe, expect, it } from "vitest";
import { PluginRegistry, type PluginDefinition } from "../../../src/domain/plugins";
import { buildGraphIR } from "../../../src/graph/ir";
import type { ProjectDefinition, TrackDefinition } from "../../../src/contract/v5";
import { fk3dPlugin } from "../../../src/plugins/fk3d";
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

  it("TH-10 leaves flat shared keys ambiguous and z unclaimed without the 3D root", () => {
    const ambiguous = registry(transformPlugin, transform3dPlugin).resolveForKeyframes({ x: {} });
    expect(ambiguous.diagnostics[0]?.ruleId).toBe("plugin-ambiguous-key");
    const unknown = registry(transformPlugin).resolveForKeyframes({ z: {} });
    expect(unknown.diagnostics[0]?.ruleId).toBe("plugin-unknown-key");
  });

  it("TH-11 refuses 2D constraint vocabulary in a 3D group", () => {
    const resolved = registry(ik3dPlugin, fk3dPlugin).resolveForKeyframes({
      ik3d: { values: { bend: 1 } },
      fk3d: { values: { weight: 1 } },
    });
    expect(resolved.diagnostics.map(({ ruleId }) => ruleId).sort()).toEqual([
      "plugin-unknown-key",
      "plugin-unknown-key",
    ]);
  });

  it("TH-12 refuses a 3D chain that is not two members on one path at load, and only that", () => {
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
    expect(refusals([member("one", "root"), member("two", "one")])).toEqual([]);
    expect(refusals([member("one", "root")])).toEqual([
      {
        path: "rig/solve",
        message:
          'Solver "rig/solve" supports exactly 2 unbranched members, but its derived member depths are 1.',
      },
    ]);
    expect(
      refusals([member("one", "root"), member("two", "one"), member("three", "two")]),
    ).toHaveLength(1);
    // Two members is the right count on the wrong shape: siblings under the root are two paths.
    expect(refusals([member("one", "root"), member("two", "root")])).toHaveLength(1);
  });

  it("TH-13 keeps the 3D output channel distinct from 2D rotations", () => {
    const resolved = registry(ik3dPlugin, fk3dPlugin).resolveForKeyframes({
      ik3d: { requires: { root: "root", target: "goal" } },
      fk3d: { values: { length: 80 } },
    });
    expect(resolved.diagnostics).toEqual([]);
    expect(ik3dPlugin.outputs).toEqual(["rotations3d"]);
  });
});
