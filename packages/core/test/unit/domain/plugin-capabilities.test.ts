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
import type { PluginCapabilities } from "../../../src/ports/plugin-capabilities";
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
function capabilities(result: PluginRegistry): PluginCapabilities {
  return result;
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
          { id: "root", keyframes: { transform: { values: { x: 0, y: 0 } } } },
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
    expect(validateV5(project, registry()).kind).toBe("refused");
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
    expect(() => engine(result).load(project).dispose()).not.toThrow();
    result.register(spring());
    expect(() => engine(result).load(project)).toThrow(
      'Solver "scene/solve" supports any chain without fk3d members, but its derived members are fk3d at depth 1.',
    );
  });

  it("C7 registry conforms to the port and every built-in matches its own declarations", () => {
    const view: PluginCapabilities = registry();
    for (const definition of definitions) {
      expect(view.capabilityOf(definition.name)).toEqual({
        chain: definition.solverChain ?? { kind: "any" },
        pole: Object.hasOwn(definition.requirements ?? {}, "pole"),
        joint: Boolean(definition.keys?.includes("joint") || definition.claimsKey?.("joint")),
      });
    }
  });

  it("admission snapshots shape metadata and updates dedication only for new tree members", () => {
    const result = new PluginRegistry();
    const shape = { kind: "tree" as const, memberPlugin: "z-member" };
    result.register({ name: "z-solver", solverChain: shape, compose: () => ({}) });
    const first = result.dedicatedMembers();
    const capability = result.capabilityOf("z-solver")!;
    shape.memberPlugin = "mutated";
    expect(capability.chain).toEqual({ kind: "tree", memberPlugin: "z-member" });
    expect(Object.isFrozen(capability)).toBe(true);
    expect(Object.isFrozen(capability.chain)).toBe(true);
    result.register({ name: "ordinary", compose: () => ({}) });
    expect(result.dedicatedMembers()).toBe(first);
    result.register({ name: "same", solverChain: capability.chain, compose: () => ({}) });
    expect(result.dedicatedMembers()).toBe(first);
    result.register({
      name: "a-solver",
      solverChain: { kind: "tree", memberPlugin: "a-member" },
      compose: () => ({}),
    });
    expect(result.dedicatedMembers()).toEqual(["a-member", "z-member"]);
    expect(first).toEqual(["z-member"]);
    expect(Object.isFrozen(shape)).toBe(false);
  });

  it("late declarations reach the same Engine and incremental builder on a live edit", () => {
    const result = new PluginRegistry();
    result.registerAll([transformPlugin, ikPlugin, fk3dPlugin]);
    const host = engine(result);
    const project = chain("ik", "fk3d");
    const loaded = host.load(project);
    result.register(spring());
    expect(() =>
      loaded.addTrack(
        {
          id: "extra",
          keyframes: { transform: { values: { x: 0 } } },
        },
        { motionId: "scene" },
      ),
    ).toThrow("ik-chain-unsupported");
    expect(loaded.tryTrack("scene/extra")).toBeUndefined();
    expect(() => host.load(project)).toThrow("ik-chain-unsupported");
    loaded.dispose();
  });

  it("a throwing joint predicate cannot publish any capability from its batch", () => {
    const result = new PluginRegistry();
    expect(() =>
      result.registerAll([
        spring(),
        {
          name: "bad",
          claimsKey: () => {
            throw new Error("predicate");
          },
          compose: () => ({}),
        },
      ]),
    ).toThrow("predicate");
    expect(result.size).toBe(0);
    expect(result.capabilityOf("spring3d")).toBeUndefined();
    expect(result.dedicatedMembers()).toEqual([]);
    result.register(transformPlugin);
    expect(result.size).toBe(1);
  });

  it("standalone validation leaves declaration-dependent constraints unjudged, never topology", () => {
    const cases = [
      { solver: "ik", member: "fk", values: { minRotation: -200, rotation: 20 }, pole: false },
      { solver: "ik3d", member: "fk3d", values: { joint: "hinge", axisX: 0 }, pole: false },
      { solver: "ik3d", member: "fk3d", values: { length: 10 }, pole: true },
    ];
    for (const entry of cases) {
      const project = chain(entry.solver, entry.member);
      const motion = project.motions[0]!;
      const candidate: ProjectDefinition = {
        ...project,
        motions: [
          {
            ...motion,
            tracks: motion.tracks.map((track) => {
              if (track.id === "bone")
                return {
                  ...track,
                  keyframes: {
                    [entry.member]: {
                      ...track.keyframes?.[entry.member],
                      values: { length: 10, ...entry.values },
                    },
                  },
                };
              if (track.id === "solve" && entry.pole)
                return {
                  ...track,
                  keyframes: {
                    [entry.solver]: {
                      requires: { root: "root", target: "goal", pole: "goal" },
                    },
                  },
                };
              return track;
            }),
          },
        ],
      };
      expect(validateV5(candidate).kind).toBe("accepted");
      expect(validateV5(candidate, registry()).kind).toBe("refused");
    }
    const project = chain("ik", "fk");
    const broken: ProjectDefinition = {
      ...project,
      motions: [
        {
          ...project.motions[0]!,
          tracks: project.motions[0]!.tracks.filter((track) => track.id !== "goal"),
        },
      ],
    };
    expect(validateV5(broken).kind).toBe("refused");
  });
});
