import { describe, expect, it } from "vitest";
import { PluginRegistry, type PluginDefinition } from "../../../src/domain/plugins";
import type { ProjectDefinition } from "../../../src/contract/v5";
import { validateV5 } from "../../../src/validate-v5";
import { Engine } from "../../../src/engine";
import { createManualClock } from "../../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../../src/testing/fakes";
import { fkPlugin } from "../../../../plugins/src/fk";
import { fk3dPlugin } from "../../../../plugins/src/fk3d";
import { ikPlugin } from "../../../../plugins/src/ik";
import { ik3dPlugin } from "../../../../plugins/src/ik3d";
import { transformPlugin } from "../../../../plugins/src/transform";
import { transform3dPlugin } from "../../../../plugins/src/transform3d";

// Red-only seam: the source commit replaces this declaration with the shipped port.
type Capability = Readonly<{
  chain: { readonly kind: "any" } | { readonly kind: "tree"; readonly memberPlugin: string };
  pole: boolean;
  joint: boolean;
}>;
interface CapabilitySeam {
  capabilityOf(name: string): Capability | undefined;
  dedicatedMembers(): readonly string[];
}
const definitions = [
  transformPlugin,
  fkPlugin,
  ikPlugin,
  transform3dPlugin,
  fk3dPlugin,
  ik3dPlugin,
];
function registry(): PluginRegistry {
  const result = new PluginRegistry();
  result.registerAll(definitions);
  return result;
}
function capabilities(result: PluginRegistry): CapabilitySeam {
  expect(typeof (result as unknown as CapabilitySeam).capabilityOf).toBe("function");
  return result as unknown as CapabilitySeam;
}
function engine(plugins: PluginRegistry): Engine {
  return new Engine({
    plugins,
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
  });
}
function chain(solver: string, member: string): ProjectDefinition {
  return {
    schemaVersion: 5,
    motions: [
      {
        id: "scene",
        trigger: { type: "manual" },
        tracks: [
          { id: "root", keyframes: { transform: { values: {} } } },
          { id: "goal", keyframes: { transform: { values: { x: 10, y: 10 } } } },
          { id: "solve", keyframes: { [solver]: { requires: { root: "root", target: "goal" } } } },
          {
            id: "bone",
            keyframes: {
              [member]: { values: { length: 10 }, requires: { base: "root", solver: "solve" } },
            },
          },
        ],
      },
    ],
  };
}
function spring(shape: unknown = { kind: "tree", memberPlugin: "fk3d" }): PluginDefinition {
  return {
    name: "spring3d",
    keys: [],
    requirements: { root: {}, target: {} },
    solverChain: shape,
    compose: () => ({}),
  } as PluginDefinition;
}

describe("registry-owned solver declarations (ADR-136)", () => {
  it("C1 derives built-in capabilities and freezes registry-wide dedication", () => {
    const view = capabilities(registry());
    expect(view.capabilityOf("ik3d")).toEqual({
      chain: { kind: "tree", memberPlugin: "fk3d" },
      pole: true,
      joint: false,
    });
    expect(view.capabilityOf("fk3d")?.joint).toBe(true);
    expect(view.capabilityOf("ik")).toEqual({
      chain: { kind: "any" },
      pole: false,
      joint: false,
    });
    expect(view.capabilityOf("missing")).toBeUndefined();
    const dedicated = view.dedicatedMembers();
    expect(dedicated).toEqual(["fk3d"]);
    expect(() => (dedicated as string[]).push("intruder")).toThrow(TypeError);
    expect(view.dedicatedMembers()).toBe(dedicated);
  });

  it("C1b asks a predicate-only joint declaration once at admission", () => {
    const result = new PluginRegistry();
    let calls = 0;
    result.register({
      name: "custom-joint",
      claimsKey: (key) => {
        calls++;
        return key === "joint";
      },
      compose: (values) => ({ ...values }),
    });
    expect(calls).toBe(1);
    expect(capabilities(result).capabilityOf("custom-joint")?.joint).toBe(true);
    expect(capabilities(result).capabilityOf("custom-joint")?.joint).toBe(true);
    expect(calls).toBe(1);
  });

  it("C2 enforces a third-party tree declaration at Engine.load", () => {
    const result = registry();
    result.register(spring());
    expect(() => engine(result).load(chain("spring3d", "fk"))).toThrow("ik-chain-unsupported");
    const loaded = engine(result).load(chain("spring3d", "fk3d"));
    loaded.dispose();
  });

  it("C3 standalone validation is unjudged, registry validation and Engine refuse", () => {
    const project = chain("ik3d", "fk");
    expect(validateV5(project).kind).toBe("accepted");
    const validateWithRegistry = validateV5 as (
      input: unknown,
      view: PluginRegistry,
    ) => ReturnType<typeof validateV5>;
    expect(validateWithRegistry(project, registry()).kind).toBe("refused");
    expect(() => engine(registry()).load(project)).toThrow("ik-chain-unsupported");
  });

  it("C4 refuses malformed declarations atomically", () => {
    for (const shape of [
      { kind: "tree", memberPlugin: "" },
      { kind: "tree", memberPlugin: "bad:member" },
      { kind: "tree", memberPlugin: "spring3d" },
      { kind: "loop" },
      null,
    ]) {
      const result = new PluginRegistry();
      expect(() => result.registerAll([transformPlugin, spring(shape)])).toThrow(TypeError);
      expect(result.size).toBe(0);
      expect(result.has("spring3d")).toBe(false);
    }
  });

  it("C6 unused third-party dedication constrains any solvers registry-wide", () => {
    const result = new PluginRegistry();
    result.registerAll([transformPlugin, ikPlugin, fk3dPlugin]);
    const project = chain("ik", "fk3d");
    const before = engine(result).load(project);
    before.dispose();
    result.register(spring());
    expect(() => engine(result).load(project)).toThrow(
      'Solver "scene/solve" supports any chain without fk3d members, but its derived members are fk3d at depth 1.',
    );
  });
});
