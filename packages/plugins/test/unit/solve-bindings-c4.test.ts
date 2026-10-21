import { describe, expect, expectTypeOf, it } from "vitest";
import { PluginRegistry } from "@motion5/core";
import type {
  CapabilityRead,
  DeriveContext,
  DeriveResult,
  PluginDefinition,
  RequirementContext,
} from "@motion5/core/plugin-api";
import { asAuthoredEntryId, asPointMemberId, derived, none } from "@motion5/core/plugin-api";
import { deriveStructuralDescriptors } from "../../../core/src/domain/structural-derivation";
import { pointPlugin } from "../../src/point";
import { rootPlugin } from "../../src/root";
import { joinPlugin } from "../../src/join";
import type { ChainPayload } from "../../src/chain-layout";
import type { JoinedPayload } from "../../src/joined-layout";
import {
  FK_REQUIREMENTS,
  IK_REQUIREMENTS,
  SKELETON_CAPABILITIES,
  deriveIkSolve,
  readSkeleton,
  solveProvenanceOf,
  validateFkRequirements,
  validateIkRequirements,
  type SkeletonFound,
  type SolvePayload,
} from "../../src/solve-contract";

declare module "@motion5/core/plugin-api" {
  interface CapabilityMap {
    "goal-frame": { readonly x: number; readonly y: number };
  }
}

type Plan = ReturnType<PluginRegistry["compileExecutionPlan"]>;

function ikPlugin(): PluginDefinition {
  return Object.freeze({
    name: "ik",
    requirements: IK_REQUIREMENTS,
    collect: () => ({}),
    validate: (context: RequirementContext) => validateIkRequirements(context),
    derive: (context: DeriveContext) => deriveIkSolve(context),
  });
}

function fkPlugin(): PluginDefinition {
  return Object.freeze({
    name: "fk",
    requirements: FK_REQUIREMENTS,
    collect: () => ({}),
    validate: (context: RequirementContext) => validateFkRequirements(context),
  });
}

const frameProducer: PluginDefinition = Object.freeze({
  name: "frame-producer",
  collect: () => ({}),
});

function registry(...extra: readonly PluginDefinition[]): PluginRegistry {
  const plugins = new PluginRegistry();
  plugins.registerAll([
    pointPlugin,
    rootPlugin,
    joinPlugin,
    frameProducer,
    ikPlugin(),
    fkPlugin(),
    ...extra,
  ]);
  return plugins;
}

function chainPlan(plugins: PluginRegistry, trackId: string, pointIds: readonly string[]): Plan {
  return plugins.compileExecutionPlan(
    pointIds.map((pointId) => ({
      [pointId]: { plugin: "point", values: { length: 10 } },
    })),
    { trackId },
  );
}

function framePlan(plugins: PluginRegistry, trackId: string): Plan {
  return plugins.compileExecutionPlan([{ src: { plugin: "frame-producer" } }], { trackId });
}

function ikPlan(
  plugins: PluginRegistry,
  trackId: string,
  skeleton: string,
  targets: Readonly<Record<string, string>>,
): Plan {
  return plugins.compileExecutionPlan(
    [{ ik1: { plugin: "ik", requires: { skeleton, targets } } }],
    { trackId },
  );
}

function fkPlan(plugins: PluginRegistry, trackId: string, skeleton: string, solver?: string): Plan {
  return plugins.compileExecutionPlan(
    [
      {
        fk1: {
          plugin: "fk",
          requires: { skeleton, ...(solver === undefined ? {} : { solver }) },
        },
      },
    ],
    { trackId },
  );
}

function derive(plans: ReadonlyMap<string, Plan>) {
  return deriveStructuralDescriptors({ order: [...plans.keys()], plans });
}

function payloadOf<T>(
  outcome: ReturnType<typeof deriveStructuralDescriptors>,
  trackId: string,
  capability: string,
): T {
  const found = (outcome.descriptors.get(trackId) ?? []).find(
    (descriptor) => descriptor.capability === capability,
  );
  if (found === undefined) throw new Error(`no ${capability} descriptor on ${trackId}`);
  return found.payload as T;
}

function joinedPlans(plugins: PluginRegistry): ReadonlyMap<string, Plan> {
  const torso = chainPlan(plugins, "torso", ["t0", "t1"]);
  const armL = chainPlan(plugins, "arm_l", ["l0", "l1"]);
  const armR = chainPlan(plugins, "arm_r", ["r0", "r1"]);
  const rig = plugins.compileExecutionPlan(
    [
      { j_torso: { plugin: "join", requires: { chain: "torso" } } },
      { j_arm_l: { plugin: "join", requires: { chain: "arm_l", parent: "torso" } } },
      { j_arm_r: { plugin: "join", requires: { chain: "arm_r", parent: "torso" } } },
    ],
    { trackId: "rig" },
  );
  return new Map([
    ["torso", torso],
    ["arm_l", armL],
    ["arm_r", armR],
    ["rig", rig],
  ]);
}

describe("Slice C4: IK and FK source/target contracts", () => {
  it("derives a chain solve with canonical provenance and one target per non-root leaf", () => {
    const plugins = registry();
    const plans = new Map([
      ["arm", chainPlan(plugins, "arm", ["p0", "p1"])],
      ["goal", framePlan(plugins, "goal")],
      ["solve", ikPlan(plugins, "solve", "arm", { p1: "goal" })],
    ]);

    const outcome = derive(plans);

    expect(outcome.kind).toBe("accepted");
    expect(outcome.diagnostics).toHaveLength(0);
    const solve = payloadOf<SolvePayload>(outcome, "solve", "solve");
    const chain = payloadOf<ChainPayload>(outcome, "arm", "chain");

    expect(solve.skeletonSource).toBe("arm");
    expect(solve.skeletonCapability).toBe("chain");
    expect(solve.layoutIdentity).toBe(chain.layoutIdentity);
    expect(solve.rootBinding).toBe("origin");
    expect(solve.memberIds).toEqual(["p1"]);
    expect(solve.goals).toHaveLength(1);
    expect(solve.goals[0]).toMatchObject({ memberId: "p1", source: "goal" });
    expect(Object.isFrozen(solve)).toBe(true);
    expect(Object.isFrozen(solve.memberIds)).toBe(true);
    expect(Object.isFrozen(solve.goals)).toBe(true);
  });

  it("derives a joined solve over every non-root member and every non-root leaf", () => {
    const plugins = registry();
    const plans = new Map([
      ...joinedPlans(plugins),
      ["goal_l", framePlan(plugins, "goal_l")],
      ["goal_r", framePlan(plugins, "goal_r")],
      ["solve", ikPlan(plugins, "solve", "rig", { l1: "goal_l", r1: "goal_r" })],
    ]);

    const outcome = derive(plans);

    expect(outcome.kind).toBe("accepted");
    expect(outcome.diagnostics).toHaveLength(0);
    const solve = payloadOf<SolvePayload>(outcome, "solve", "solve");
    const joined = payloadOf<JoinedPayload>(outcome, "rig", "joined");

    expect(solve.skeletonSource).toBe("rig");
    expect(solve.skeletonCapability).toBe("joined");
    expect(solve.layoutIdentity).toBe(joined.layoutIdentity);
    expect(solve.memberIds).toEqual(["t1", "l0", "l1", "r0", "r1"]);
    expect(solve.goals.map((goal) => goal.memberId)).toEqual(["l1", "r1"]);
  });

  it("refuses every target coverage failure by its own rule", () => {
    {
      const plugins = registry();
      const outcome = derive(
        new Map([
          ["arm", chainPlan(plugins, "arm", ["p0", "p1"])],
          ["solve", ikPlan(plugins, "solve", "arm", {})],
        ]),
      );
      expect(outcome.diagnostics.some((entry) => entry.ruleId === "ik-solver-no-goal")).toBe(true);
    }
    {
      const plugins = registry();
      const outcome = derive(
        new Map([
          ["arm", chainPlan(plugins, "arm", ["p0", "p1"])],
          ["solve", ikPlan(plugins, "solve", "arm", { ghost: "goal" })],
        ]),
      );
      expect(outcome.diagnostics.some((entry) => entry.ruleId === "ik-goal-unknown-member")).toBe(
        true,
      );
    }
    {
      const plugins = registry();
      const outcome = derive(
        new Map([
          ["arm", chainPlan(plugins, "arm", ["p0", "p1", "p2"])],
          ["solve", ikPlan(plugins, "solve", "arm", { p1: "goal", p2: "goal" })],
        ]),
      );
      expect(outcome.diagnostics.some((entry) => entry.ruleId === "ik-goal-not-leaf")).toBe(true);
    }
    {
      const plugins = registry();
      const outcome = derive(
        new Map([
          ["arm", chainPlan(plugins, "arm", ["p0", "p1"])],
          ["solve", ikPlan(plugins, "solve", "arm", { p0: "goal", p1: "goal" })],
        ]),
      );
      const rootGoal = outcome.diagnostics.find((entry) => entry.ruleId === "ik-goal-not-leaf");
      expect(rootGoal?.message).toMatch(/anchored topology root/);
    }
    {
      const plugins = registry();
      const plans = new Map([
        ...joinedPlans(plugins),
        ["goal_l", framePlan(plugins, "goal_l")],
        ["solve", ikPlan(plugins, "solve", "rig", { l1: "goal_l" })],
      ]);
      const outcome = derive(plans);
      const missing = outcome.diagnostics.find((entry) => entry.ruleId === "ik-leaf-without-goal");
      expect(missing?.ids).toEqual(["solve", "ik1", "r1"]);
    }
  });

  it("refuses a one-point IK while accepting a one-point FK", () => {
    {
      const plugins = registry();
      const outcome = derive(
        new Map([
          ["arm", chainPlan(plugins, "arm", ["p0"])],
          ["solve", ikPlan(plugins, "solve", "arm", { p0: "goal" })],
        ]),
      );
      expect(outcome.kind).toBe("refused");
      expect(
        outcome.diagnostics.some((entry) => entry.ruleId === "ik-solver-no-solve-members"),
      ).toBe(true);
    }
    {
      const plugins = registry();
      const outcome = derive(
        new Map([
          ["arm", chainPlan(plugins, "arm", ["p0"])],
          ["pose", fkPlan(plugins, "pose", "arm")],
        ]),
      );
      expect(outcome.kind).toBe("accepted");
      expect(outcome.diagnostics).toHaveLength(0);
    }
  });

  it("refuses a root-only source for both IK and FK with derivation-missing-capability", () => {
    const plugins = registry();
    const rootOnly = plugins.compileExecutionPlan([{ r0: { plugin: "root" } }], {
      trackId: "world",
    });
    const outcome = derive(
      new Map([
        ["world", rootOnly],
        ["solve", ikPlan(plugins, "solve", "world", { p1: "goal" })],
        ["pose", fkPlan(plugins, "pose", "world")],
      ]),
    );

    expect(outcome.kind).toBe("refused");
    const missing = outcome.diagnostics.filter(
      (entry) => entry.ruleId === "derivation-missing-capability",
    );
    expect(missing).toHaveLength(2);
  });

  it("refuses wrong skeleton and solve capabilities before validate runs", () => {
    const plugins = registry();
    const outcome = derive(
      new Map([
        ["arm", chainPlan(plugins, "arm", ["p0", "p1"])],
        ["solve", ikPlan(plugins, "solve", "arm", { p1: "goal" })],
        ["poseFromChain", fkPlan(plugins, "poseFromChain", "arm", "arm")],
        ["poseFromSolve", fkPlan(plugins, "poseFromSolve", "solve")],
        ["solveFromSolve", ikPlan(plugins, "solveFromSolve", "solve", { p1: "goal" })],
      ]),
    );

    expect(outcome.kind).toBe("refused");
    const missing = outcome.diagnostics.filter(
      (entry) => entry.ruleId === "derivation-missing-capability",
    );
    expect(missing).toHaveLength(3);
  });

  it("refuses FK when two same-looking skeletons come from different sources", () => {
    const plugins = registry();
    const outcome = derive(
      new Map([
        ["arm_a", chainPlan(plugins, "arm_a", ["p0", "p1"])],
        ["arm_b", chainPlan(plugins, "arm_b", ["p0", "p1"])],
        ["goal", framePlan(plugins, "goal")],
        ["solve", ikPlan(plugins, "solve", "arm_a", { p1: "goal" })],
        ["pose", fkPlan(plugins, "pose", "arm_b", "solve")],
      ]),
    );

    expect(outcome.kind).toBe("refused");
    const mismatch = outcome.diagnostics.find((entry) => entry.ruleId === "derivation-failure");
    expect(mismatch?.message).toMatch(/skeleton source "arm_a" instead of "arm_b"/);
    expect(mismatch?.message).toMatch(/different layout identity/);
  });

  it("refuses a solve contract whose root binding provenance changed", () => {
    const staleRootSolve: PluginDefinition = Object.freeze({
      name: "stale-root-solve",
      requirements: { skeleton: { capability: SKELETON_CAPABILITIES } },
      collect: () => ({}),
      derive: (context: DeriveContext): DeriveResult => {
        const binding = context.entries[0]?.bindings.find((entry) => entry.slot === "skeleton");
        if (binding === undefined) return none;
        const skeleton = readSkeleton(context, binding.qualifiedSource);
        return derived("solve", {
          ...solveProvenanceOf(binding.qualifiedSource, skeleton),
          rootBinding: "bound(stale)",
          memberIds: [asPointMemberId(asAuthoredEntryId("p1"))],
          goals: [],
        });
      },
    });
    const plugins = registry(staleRootSolve);
    const arm = plugins.compileExecutionPlan(
      [
        { r0: { plugin: "root", requires: { frame: "body" } } },
        { p0: { plugin: "point", values: { length: 10 } } },
        { p1: { plugin: "point", values: { length: 10 } } },
      ],
      { trackId: "arm" },
    );
    const outcome = derive(
      new Map([
        ["body", framePlan(plugins, "body")],
        ["arm", arm],
        [
          "solve",
          plugins.compileExecutionPlan(
            [{ s1: { plugin: "stale-root-solve", requires: { skeleton: "arm" } } }],
            { trackId: "solve" },
          ),
        ],
        ["pose", fkPlan(plugins, "pose", "arm", "solve")],
      ]),
    );

    expect(outcome.kind).toBe("refused");
    const mismatch = outcome.diagnostics.find((entry) => entry.ruleId === "derivation-failure");
    expect(mismatch?.message).toMatch(/root binding "bound\(stale\)"/);
  });

  it("accepts a compatible custom partial solve and refuses foreign members or goals", () => {
    function customSolve(
      name: string,
      memberIds: readonly string[],
      goalIds: readonly string[],
    ): PluginDefinition {
      return Object.freeze({
        name,
        requirements: { skeleton: { capability: SKELETON_CAPABILITIES } },
        collect: () => ({}),
        derive: (context: DeriveContext): DeriveResult => {
          const binding = context.entries[0]?.bindings.find((entry) => entry.slot === "skeleton");
          if (binding === undefined) return none;
          const skeleton = readSkeleton(context, binding.qualifiedSource);
          return derived("solve", {
            ...solveProvenanceOf(binding.qualifiedSource, skeleton),
            memberIds: memberIds.map((id) => asPointMemberId(asAuthoredEntryId(id))),
            goals: goalIds.map((id) =>
              Object.freeze({
                memberId: asPointMemberId(asAuthoredEntryId(id)),
                source: "goal",
                authoredPath: `solve.${id}`,
              }),
            ),
          });
        },
      });
    }

    {
      const plugins = registry(customSolve("partial-solve", ["p2"], []));
      const outcome = derive(
        new Map([
          ["arm", chainPlan(plugins, "arm", ["p0", "p1", "p2"])],
          [
            "solve",
            plugins.compileExecutionPlan(
              [{ s1: { plugin: "partial-solve", requires: { skeleton: "arm" } } }],
              { trackId: "solve" },
            ),
          ],
          ["pose", fkPlan(plugins, "pose", "arm", "solve")],
        ]),
      );
      expect(outcome.kind).toBe("accepted");
      expect(outcome.diagnostics).toHaveLength(0);
    }
    {
      const plugins = registry(customSolve("foreign-solve", ["ghost"], []));
      const outcome = derive(
        new Map([
          ["arm", chainPlan(plugins, "arm", ["p0", "p1"])],
          [
            "solve",
            plugins.compileExecutionPlan(
              [{ s1: { plugin: "foreign-solve", requires: { skeleton: "arm" } } }],
              { trackId: "solve" },
            ),
          ],
          ["pose", fkPlan(plugins, "pose", "arm", "solve")],
        ]),
      );
      expect(outcome.kind).toBe("refused");
      expect(outcome.diagnostics.some((entry) => /not non-root members/.test(entry.message))).toBe(
        true,
      );
    }
    {
      const plugins = registry(customSolve("foreign-goal-solve", ["p1"], ["p0"]));
      const outcome = derive(
        new Map([
          ["arm", chainPlan(plugins, "arm", ["p0", "p1"])],
          [
            "solve",
            plugins.compileExecutionPlan(
              [{ s1: { plugin: "foreign-goal-solve", requires: { skeleton: "arm" } } }],
              { trackId: "solve" },
            ),
          ],
          ["pose", fkPlan(plugins, "pose", "arm", "solve")],
        ]),
      );
      expect(outcome.kind).toBe("refused");
      expect(outcome.diagnostics.some((entry) => /not non-root leaves/.test(entry.message))).toBe(
        true,
      );
    }
    {
      const plugins = registry(customSolve("duplicate-member-solve", ["p1", "p1"], ["p1"]));
      const outcome = derive(
        new Map([
          ["arm", chainPlan(plugins, "arm", ["p0", "p1"])],
          [
            "solve",
            plugins.compileExecutionPlan(
              [{ s1: { plugin: "duplicate-member-solve", requires: { skeleton: "arm" } } }],
              { trackId: "solve" },
            ),
          ],
          ["pose", fkPlan(plugins, "pose", "arm", "solve")],
        ]),
      );
      expect(outcome.kind).toBe("refused");
      expect(
        outcome.diagnostics.some((entry) => /did not publish a solve contract/.test(entry.message)),
      ).toBe(true);
    }
  });

  it("distinguishes an absent solver from a bound blocked or malformed solver", () => {
    {
      const plugins = registry();
      const outcome = derive(
        new Map([
          ["arm", chainPlan(plugins, "arm", ["p0", "p1"])],
          ["pose", fkPlan(plugins, "pose", "arm")],
        ]),
      );
      expect(outcome.kind).toBe("accepted");
    }
    {
      const blockedSolve: PluginDefinition = Object.freeze({
        name: "blocked-solve",
        requirements: { skeleton: { capability: SKELETON_CAPABILITIES } },
        collect: () => ({}),
        derive: () => none,
      });
      const plugins = registry(blockedSolve);
      const outcome = derive(
        new Map([
          ["arm", chainPlan(plugins, "arm", ["p0", "p1"])],
          [
            "solve",
            plugins.compileExecutionPlan(
              [{ s1: { plugin: "blocked-solve", requires: { skeleton: "arm" } } }],
              { trackId: "solve" },
            ),
          ],
          ["pose", fkPlan(plugins, "pose", "arm", "solve")],
        ]),
      );
      expect(
        outcome.diagnostics.some((entry) => entry.ruleId === "derivation-missing-capability"),
      ).toBe(true);
    }
    {
      const malformedSolve: PluginDefinition = Object.freeze({
        name: "malformed-solve",
        requirements: { skeleton: { capability: SKELETON_CAPABILITIES } },
        collect: () => ({}),
        derive: () => derived("solve", null as unknown as SolvePayload),
      });
      const plugins = registry(malformedSolve);
      const outcome = derive(
        new Map([
          ["arm", chainPlan(plugins, "arm", ["p0", "p1"])],
          [
            "solve",
            plugins.compileExecutionPlan(
              [{ s1: { plugin: "malformed-solve", requires: { skeleton: "arm" } } }],
              { trackId: "solve" },
            ),
          ],
          ["pose", fkPlan(plugins, "pose", "arm", "solve")],
        ]),
      );
      expect(
        outcome.diagnostics.some((entry) => /did not publish a solve contract/.test(entry.message)),
      ).toBe(true);
    }
  });

  it("leaves an ordinary non-kinematic dict plugin unaffected by the targets spelling", () => {
    const dictConsumer: PluginDefinition = Object.freeze({
      name: "dict-consumer",
      requirements: { targets: { dict: true as const } },
      collect: () => ({}),
      derive: () => none,
    });
    const plugins = registry(dictConsumer);
    const outcome = derive(
      new Map([
        [
          "dst",
          plugins.compileExecutionPlan(
            [
              {
                d1: {
                  plugin: "dict-consumer",
                  requires: { targets: { left: "goal_a", right: "goal_b" } },
                },
              },
            ],
            { trackId: "dst" },
          ),
        ],
        ["goal_a", framePlan(plugins, "goal_a")],
        ["goal_b", framePlan(plugins, "goal_b")],
      ]),
    );

    expect(outcome.kind).toBe("accepted");
    expect(outcome.diagnostics).toHaveLength(0);
  });

  it("leaves a malformed runtime goal frame to the frame reader", () => {
    const malformedFrame: PluginDefinition = Object.freeze({
      name: "malformed-frame",
      collect: () => ({}),
      derive: () => derived("goal-frame", { x: Number.NaN, y: Number.POSITIVE_INFINITY }),
    });
    const plugins = registry(malformedFrame);
    const outcome = derive(
      new Map([
        ["arm", chainPlan(plugins, "arm", ["p0", "p1"])],
        [
          "bad_goal",
          plugins.compileExecutionPlan([{ g1: { plugin: "malformed-frame" } }], {
            trackId: "bad_goal",
          }),
        ],
        ["solve", ikPlan(plugins, "solve", "arm", { p1: "bad_goal" })],
      ]),
    );

    expect(outcome.kind).toBe("accepted");
    expect(outcome.diagnostics).toHaveLength(0);
  });

  it("re-derives the solve contract when the root binding changes but point IDs do not", () => {
    const originPlugins = registry();
    const origin = derive(
      new Map([
        ["arm", chainPlan(originPlugins, "arm", ["p0", "p1"])],
        ["goal", framePlan(originPlugins, "goal")],
        ["solve", ikPlan(originPlugins, "solve", "arm", { p1: "goal" })],
      ]),
    );
    const boundPlugins = registry();
    const bound = derive(
      new Map([
        ["body", framePlan(boundPlugins, "body")],
        [
          "arm",
          boundPlugins.compileExecutionPlan(
            [
              { r0: { plugin: "root", requires: { frame: "body" } } },
              { p0: { plugin: "point", values: { length: 10 } } },
              { p1: { plugin: "point", values: { length: 10 } } },
            ],
            { trackId: "arm" },
          ),
        ],
        ["goal", framePlan(boundPlugins, "goal")],
        ["solve", ikPlan(boundPlugins, "solve", "arm", { p1: "goal" })],
      ]),
    );

    const before = payloadOf<SolvePayload>(origin, "solve", "solve");
    const after = payloadOf<SolvePayload>(bound, "solve", "solve");
    expect(before.rootBinding).toBe("origin");
    expect(after.rootBinding).not.toBe(before.rootBinding);
    expect(after.layoutIdentity).not.toBe(before.layoutIdentity);
    expect(after.memberIds).toEqual(before.memberIds);
  });

  it("re-derives the solve contract when a target binding changes but topology does not", () => {
    const firstPlugins = registry();
    const first = derive(
      new Map([
        ["arm", chainPlan(firstPlugins, "arm", ["p0", "p1"])],
        ["goal_a", framePlan(firstPlugins, "goal_a")],
        ["goal_b", framePlan(firstPlugins, "goal_b")],
        ["solve", ikPlan(firstPlugins, "solve", "arm", { p1: "goal_a" })],
      ]),
    );
    const secondPlugins = registry();
    const second = derive(
      new Map([
        ["arm", chainPlan(secondPlugins, "arm", ["p0", "p1"])],
        ["goal_a", framePlan(secondPlugins, "goal_a")],
        ["goal_b", framePlan(secondPlugins, "goal_b")],
        ["solve", ikPlan(secondPlugins, "solve", "arm", { p1: "goal_b" })],
      ]),
    );

    const before = payloadOf<SolvePayload>(first, "solve", "solve");
    const after = payloadOf<SolvePayload>(second, "solve", "solve");
    expect(after.layoutIdentity).toBe(before.layoutIdentity);
    expect(after.memberIds).toEqual(before.memberIds);
    expect(after.goals[0]?.source).toBe("goal_b");
    expect(before.goals[0]?.source).toBe("goal_a");
  });

  it("does not change the solve contract when only numeric point values change", () => {
    const firstPlugins = registry();
    const first = derive(
      new Map([
        [
          "arm",
          firstPlugins.compileExecutionPlan(
            [
              { p0: { plugin: "point", values: { length: 10 } } },
              { p1: { plugin: "point", values: { length: 20 } } },
            ],
            { trackId: "arm" },
          ),
        ],
        ["goal", framePlan(firstPlugins, "goal")],
        ["solve", ikPlan(firstPlugins, "solve", "arm", { p1: "goal" })],
      ]),
    );
    const secondPlugins = registry();
    const second = derive(
      new Map([
        [
          "arm",
          secondPlugins.compileExecutionPlan(
            [
              { p0: { plugin: "point", values: { length: 500 } } },
              { p1: { plugin: "point", values: { length: 900 } } },
            ],
            { trackId: "arm" },
          ),
        ],
        ["goal", framePlan(secondPlugins, "goal")],
        ["solve", ikPlan(secondPlugins, "solve", "arm", { p1: "goal" })],
      ]),
    );

    const before = payloadOf<SolvePayload>(first, "solve", "solve");
    const after = payloadOf<SolvePayload>(second, "solve", "solve");
    expect(after).toEqual(before);
  });

  it("narrows readAny on the capability that actually answered", () => {
    function assertNarrowing(found: CapabilityRead<"chain" | "joined">): void {
      if (found.capability === "chain") {
        expectTypeOf(found.payload).toEqualTypeOf<ChainPayload>();
        // @ts-expect-error a chain payload has no joined-only links.
        found.payload.links;
      } else {
        expectTypeOf(found.payload).toEqualTypeOf<JoinedPayload>();
        expectTypeOf(found.payload.links).toEqualTypeOf<JoinedPayload["links"]>();
      }
    }

    function assertEmptyTupleIsRefused(context: RequirementContext): void {
      // @ts-expect-error a tuple declares at least one capability.
      context.readAny([], "source");
    }

    expect(assertNarrowing).toBeTypeOf("function");
    expect(assertEmptyTupleIsRefused).toBeTypeOf("function");
  });

  it("exposes the same union from the shared skeleton reader", () => {
    function assertFound(found: SkeletonFound): void {
      if (found.capability === "chain") {
        expectTypeOf(found.payload).toEqualTypeOf<ChainPayload>();
      } else {
        expectTypeOf(found.payload).toEqualTypeOf<JoinedPayload>();
      }
    }

    expect(assertFound).toBeTypeOf("function");
  });
});
