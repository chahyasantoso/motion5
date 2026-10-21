import { describe, expect, it } from "vitest";
import { Engine, PluginRegistry, createManualClock } from "@motion5/core";
import type { PluginDefinition, RequirementContext } from "@motion5/core/plugin-api";
import {
  asAuthoredEntryId,
  asLayoutIdentity,
  asPointMemberId,
  derived,
} from "@motion5/core/plugin-api";
import { createFakeInterpolator, createFakeScheduler } from "@motion5/core/testing";
import { deriveStructuralDescriptors } from "../../../core/src/domain/structural-derivation";
import { pointPlugin } from "../../src/point";
import { rootPlugin } from "../../src/root";
import { joinPlugin } from "../../src/join";
import { type ChainPayload } from "../../src/chain-layout";
import { type JoinedPayload } from "../../src/joined-layout";

describe("Slice C3: Joined Topology Derivation", () => {
  function createSkeletonRegistry(): PluginRegistry {
    const registry = new PluginRegistry();
    registry.registerAll([pointPlugin, rootPlugin, joinPlugin]);
    return registry;
  }

  function createChainProducer(name: string, payload: ChainPayload): PluginDefinition {
    return Object.freeze({
      name,
      collect: () => ({}),
      derive: () => derived("chain", payload),
    });
  }

  function chainPayload(overrides: Partial<ChainPayload> = {}): ChainPayload {
    return Object.freeze({
      orderedPointIds: Object.freeze([]),
      parentIndices: Object.freeze([]),
      childAdjacency: Object.freeze([]),
      rootId: asPointMemberId(asAuthoredEntryId("none")),
      leafIds: Object.freeze([]),
      pointIndexById: Object.freeze({}),
      locators: Object.freeze([]),
      layoutIdentity: asLayoutIdentity("test-chain"),
      rootPolicy: Object.freeze({ kind: "origin", hasRootEntry: false } as const),
      ...overrides,
    });
  }

  it("derives canonical torso/two-arms topology with parent-first ordering and child adjacency", () => {
    const registry = createSkeletonRegistry();

    const torsoPlan = registry.compileExecutionPlan(
      [
        { t0: { plugin: "point", values: { length: 10 } } },
        { t1: { plugin: "point", values: { length: 20 } } },
      ],
      { trackId: "torso" },
    );

    const armLPlan = registry.compileExecutionPlan(
      [
        { l0: { plugin: "point", values: { length: 15 } } },
        { l1: { plugin: "point", values: { length: 25 } } },
      ],
      { trackId: "arm_l" },
    );

    const armRPlan = registry.compileExecutionPlan(
      [
        { r0: { plugin: "point", values: { length: 15 } } },
        { r1: { plugin: "point", values: { length: 25 } } },
      ],
      { trackId: "arm_r" },
    );

    const skeletonPlan = registry.compileExecutionPlan(
      [
        { j_torso: { plugin: "join", requires: { chain: "torso" } } },
        { j_arm_l: { plugin: "join", requires: { chain: "arm_l", parent: "torso" } } },
        { j_arm_r: { plugin: "join", requires: { chain: "arm_r", parent: "torso" } } },
      ],
      { trackId: "skeleton" },
    );

    const outcome = deriveStructuralDescriptors({
      order: ["torso", "arm_l", "arm_r", "skeleton"],
      plans: new Map([
        ["torso", torsoPlan],
        ["arm_l", armLPlan],
        ["arm_r", armRPlan],
        ["skeleton", skeletonPlan],
      ]),
    });

    expect(outcome.kind).toBe("accepted");
    expect(outcome.diagnostics).toHaveLength(0);

    const skelDescs = outcome.descriptors.get("skeleton") ?? [];
    expect(skelDescs).toHaveLength(1);
    const joinedDesc = skelDescs[0]!;
    expect(joinedDesc.capability).toBe("joined");
    expect(joinedDesc.source).toBe("skeleton");

    const payload = joinedDesc.payload as JoinedPayload;
    expect(payload.orderedPointIds).toEqual(["t0", "t1", "l0", "l1", "r0", "r1"]);
    // t0 is root (-1), t1 attaches to t0 (0), l0 attaches to t1 (1), l1 attaches to l0 (2),
    // r0 attaches to t1 (1), r1 attaches to r0 (4)
    expect(payload.parentIndices).toEqual([-1, 0, 1, 2, 1, 4]);

    // Child adjacency: t0 -> [t1], t1 -> [l0, r0], l0 -> [l1], l1 -> [], r0 -> [r1], r1 -> []
    expect(payload.childAdjacency).toEqual([[1], [2, 4], [3], [], [5], []]);

    expect(payload.rootId).toBe("t0");
    expect(payload.leafIds).toEqual(["l1", "r1"]);

    const visited = new Set<number>();
    const pending = [0];
    while (pending.length > 0) {
      const index = pending.pop();
      if (index === undefined || visited.has(index)) continue;
      visited.add(index);
      const children = payload.childAdjacency[index];
      if (children !== undefined) pending.push(...children);
    }
    expect(visited.size).toBe(payload.orderedPointIds.length);
    expect(payload.parentIndices.filter((index) => index === -1)).toHaveLength(1);
    expect(payload.parentIndices[0]).toBe(-1);

    expect(payload.pointIndexById["t0"]).toBe(0);
    expect(payload.pointIndexById["t1"]).toBe(1);
    expect(payload.pointIndexById["l0"]).toBe(2);
    expect(payload.pointIndexById["l1"]).toBe(3);
    expect(payload.pointIndexById["r0"]).toBe(4);
    expect(payload.pointIndexById["r1"]).toBe(5);
    expect(Object.getPrototypeOf(payload.pointIndexById)).toBeNull();

    expect(payload.locators).toHaveLength(6);
    expect(payload.locators[0]).toEqual({
      pointId: "t0",
      index: 0,
      sourceTrack: "torso",
      entryId: "t0",
      authoredPath: "torso.t0",
    });
    expect(payload.locators[2]).toEqual({
      pointId: "l0",
      index: 2,
      sourceTrack: "arm_l",
      entryId: "l0",
      authoredPath: "arm_l.l0",
    });

    expect(payload.rootPolicy).toEqual({ kind: "origin", hasRootEntry: false });
    expect(payload.links).toEqual([
      { entryId: "j_torso", chainSource: "torso" },
      { entryId: "j_arm_l", chainSource: "arm_l", parentSource: "torso" },
      { entryId: "j_arm_r", chainSource: "arm_r", parentSource: "torso" },
    ]);
    expect(typeof payload.layoutIdentity).toBe("string");
  });

  it("refuses when the first join entry has a parent (root-not-first / no root link)", () => {
    const registry = createSkeletonRegistry();
    const torsoPlan = registry.compileExecutionPlan([{ t0: { plugin: "point" } }], {
      trackId: "torso",
    });
    const skeletonPlan = registry.compileExecutionPlan(
      [{ j0: { plugin: "join", requires: { chain: "torso", parent: "torso" } } }],
      { trackId: "skeleton" },
    );

    const outcome = deriveStructuralDescriptors({
      order: ["torso", "skeleton"],
      plans: new Map([
        ["torso", torsoPlan],
        ["skeleton", skeletonPlan],
      ]),
    });

    expect(outcome.kind).toBe("refused");
    const diags = outcome.diagnostics.filter((d) => d.ruleId === "derivation-failure");
    expect(diags).toHaveLength(1);
    expect(diags[0]?.message).toMatch(/First join entry.*must not have a parent/i);
  });

  it("refuses when multiple joins omit parent (multiple topology roots)", () => {
    const registry = createSkeletonRegistry();
    const torsoPlan = registry.compileExecutionPlan([{ t0: { plugin: "point" } }], {
      trackId: "torso",
    });
    const armPlan = registry.compileExecutionPlan([{ a0: { plugin: "point" } }], {
      trackId: "arm",
    });
    const skeletonPlan = registry.compileExecutionPlan(
      [
        { j0: { plugin: "join", requires: { chain: "torso" } } },
        { j1: { plugin: "join", requires: { chain: "arm" } } },
      ],
      { trackId: "skeleton" },
    );

    const outcome = deriveStructuralDescriptors({
      order: ["torso", "arm", "skeleton"],
      plans: new Map([
        ["torso", torsoPlan],
        ["arm", armPlan],
        ["skeleton", skeletonPlan],
      ]),
    });

    expect(outcome.kind).toBe("refused");
    const diags = outcome.diagnostics.filter((d) => d.ruleId === "derivation-failure");
    expect(diags).toHaveLength(1);
    expect(diags[0]?.message).toMatch(/Only the first join entry may omit a parent chain/i);
  });

  it("refuses when parent is forward-referencing or missing", () => {
    const registry = createSkeletonRegistry();
    const torsoPlan = registry.compileExecutionPlan([{ t0: { plugin: "point" } }], {
      trackId: "torso",
    });
    const armPlan = registry.compileExecutionPlan([{ a0: { plugin: "point" } }], {
      trackId: "arm",
    });
    const legPlan = registry.compileExecutionPlan([{ l0: { plugin: "point" } }], {
      trackId: "leg",
    });

    // j_arm references leg before leg is joined
    const skeletonPlan = registry.compileExecutionPlan(
      [
        { j_torso: { plugin: "join", requires: { chain: "torso" } } },
        { j_arm: { plugin: "join", requires: { chain: "arm", parent: "leg" } } },
        { j_leg: { plugin: "join", requires: { chain: "leg", parent: "torso" } } },
      ],
      { trackId: "skeleton" },
    );

    const outcome = deriveStructuralDescriptors({
      order: ["torso", "arm", "leg", "skeleton"],
      plans: new Map([
        ["torso", torsoPlan],
        ["arm", armPlan],
        ["leg", legPlan],
        ["skeleton", skeletonPlan],
      ]),
    });

    expect(outcome.kind).toBe("refused");
    const diags = outcome.diagnostics.filter((d) => d.ruleId === "derivation-failure");
    expect(diags.some((d) => /match a chain used by an earlier join/i.test(d.message))).toBe(true);
  });

  it("refuses duplicate chain source joining", () => {
    const registry = createSkeletonRegistry();
    const torsoPlan = registry.compileExecutionPlan([{ t0: { plugin: "point" } }], {
      trackId: "torso",
    });
    const skeletonPlan = registry.compileExecutionPlan(
      [
        { j0: { plugin: "join", requires: { chain: "torso" } } },
        { j1: { plugin: "join", requires: { chain: "torso", parent: "torso" } } },
      ],
      { trackId: "skeleton" },
    );

    const outcome = deriveStructuralDescriptors({
      order: ["torso", "skeleton"],
      plans: new Map([
        ["torso", torsoPlan],
        ["skeleton", skeletonPlan],
      ]),
    });

    expect(outcome.kind).toBe("refused");
    const diags = outcome.diagnostics.filter((d) => d.ruleId === "derivation-failure");
    expect(diags.some((d) => /Duplicate chain source/i.test(d.message))).toBe(true);
  });

  it("refuses imported chain that holds a root entry under skeleton-imported-chain-has-root", () => {
    const registry = createSkeletonRegistry();
    const torsoPlan = registry.compileExecutionPlan(
      [{ r0: { plugin: "root" } }, { t0: { plugin: "point", values: { length: 10 } } }],
      { trackId: "torso" },
    );
    const armPlan = registry.compileExecutionPlan(
      [{ a0: { plugin: "point", values: { length: 15 } } }],
      { trackId: "arm" },
    );
    const skeletonPlan = registry.compileExecutionPlan(
      [{ j_torso: { plugin: "join", requires: { chain: "torso" } } }],
      { trackId: "skeleton" },
    );

    const outcome = deriveStructuralDescriptors({
      order: ["torso", "arm", "skeleton"],
      plans: new Map([
        ["torso", torsoPlan],
        ["arm", armPlan],
        ["skeleton", skeletonPlan],
      ]),
    });

    expect(outcome.kind).toBe("refused");
    const rootImportDiags = outcome.diagnostics.filter(
      (d) => d.ruleId === "skeleton-imported-chain-has-root",
    );
    expect(rootImportDiags).toHaveLength(1);
    expect(rootImportDiags[0]?.path).toBe("skeleton.j_torso.chain");
    expect(rootImportDiags[0]?.ids).toEqual(["skeleton", "j_torso", "torso"]);
  });

  it("refuses imported parent chain that holds a root entry under skeleton-imported-chain-has-root", () => {
    const registry = createSkeletonRegistry();
    const torsoPlan = registry.compileExecutionPlan(
      [{ r0: { plugin: "root" } }, { t0: { plugin: "point", values: { length: 10 } } }],
      { trackId: "torso" },
    );
    const armPlan = registry.compileExecutionPlan(
      [{ a0: { plugin: "point", values: { length: 15 } } }],
      { trackId: "arm" },
    );
    // j_arm imports arm (unrooted) as chain, but torso (rooted) as parent
    const skeletonPlan = registry.compileExecutionPlan(
      [{ j_arm: { plugin: "join", requires: { chain: "arm", parent: "torso" } } }],
      { trackId: "skeleton" },
    );

    const outcome = deriveStructuralDescriptors({
      order: ["torso", "arm", "skeleton"],
      plans: new Map([
        ["torso", torsoPlan],
        ["arm", armPlan],
        ["skeleton", skeletonPlan],
      ]),
    });

    expect(outcome.kind).toBe("refused");
    const rootImportDiags = outcome.diagnostics.filter(
      (d) => d.ruleId === "skeleton-imported-chain-has-root",
    );
    expect(rootImportDiags).toHaveLength(1);
    expect(rootImportDiags[0]?.path).toBe("skeleton.j_arm.parent");
    expect(rootImportDiags[0]?.ids).toEqual(["skeleton", "j_arm", "torso"]);
  });

  it("refuses non-chain or empty source bound to join slots with derivation-missing-capability", () => {
    const registry = createSkeletonRegistry();
    // Root-only track derives no chain capability
    const rootOnlyPlan = registry.compileExecutionPlan([{ r0: { plugin: "root" } }], {
      trackId: "root_only",
    });
    const skeletonPlan = registry.compileExecutionPlan(
      [{ j0: { plugin: "join", requires: { chain: "root_only" } } }],
      { trackId: "skeleton" },
    );

    const outcome = deriveStructuralDescriptors({
      order: ["root_only", "skeleton"],
      plans: new Map([
        ["root_only", rootOnlyPlan],
        ["skeleton", skeletonPlan],
      ]),
    });

    expect(outcome.kind).toBe("refused");
    const missingCapDiags = outcome.diagnostics.filter(
      (d) => d.ruleId === "derivation-missing-capability",
    );
    expect(missingCapDiags).toHaveLength(1);
  });

  it("refuses a joined source bound to a chain slot", () => {
    const registry = createSkeletonRegistry();
    const torsoPlan = registry.compileExecutionPlan([{ t0: { plugin: "point" } }], {
      trackId: "torso",
    });
    const innerPlan = registry.compileExecutionPlan(
      [{ j_torso: { plugin: "join", requires: { chain: "torso" } } }],
      { trackId: "inner" },
    );
    const outerPlan = registry.compileExecutionPlan(
      [{ j_inner: { plugin: "join", requires: { chain: "inner" } } }],
      { trackId: "outer" },
    );

    const outcome = deriveStructuralDescriptors({
      order: ["torso", "inner", "outer"],
      plans: new Map([
        ["torso", torsoPlan],
        ["inner", innerPlan],
        ["outer", outerPlan],
      ]),
    });

    expect(outcome.kind).toBe("refused");
    const missingCapDiags = outcome.diagnostics.filter(
      (d) => d.ruleId === "derivation-missing-capability",
    );
    expect(missingCapDiags).toHaveLength(1);
  });

  it("refuses an imported chain that holds a bound root entry", () => {
    const registry = createSkeletonRegistry();
    const torsoPlan = registry.compileExecutionPlan(
      [
        { r0: { plugin: "root", requires: { frame: "body" } } },
        { t0: { plugin: "point", values: { length: 10 } } },
      ],
      { trackId: "torso" },
    );
    const skeletonPlan = registry.compileExecutionPlan(
      [{ j_torso: { plugin: "join", requires: { chain: "torso" } } }],
      { trackId: "skeleton" },
    );

    const outcome = deriveStructuralDescriptors({
      order: ["torso", "skeleton"],
      plans: new Map([
        ["torso", torsoPlan],
        ["skeleton", skeletonPlan],
      ]),
    });

    expect(outcome.kind).toBe("refused");
    const rootImportDiags = outcome.diagnostics.filter(
      (d) => d.ruleId === "skeleton-imported-chain-has-root",
    );
    expect(rootImportDiags).toHaveLength(1);
    expect(rootImportDiags[0]?.path).toBe("skeleton.j_torso.chain");
  });

  it("refuses an empty chain source", () => {
    const registry = new PluginRegistry();
    registry.registerAll([
      pointPlugin,
      rootPlugin,
      joinPlugin,
      createChainProducer("empty_chain", chainPayload()),
    ]);
    const emptyPlan = registry.compileExecutionPlan([{ e0: { plugin: "empty_chain" } }], {
      trackId: "empty",
    });
    const skeletonPlan = registry.compileExecutionPlan(
      [{ j0: { plugin: "join", requires: { chain: "empty" } } }],
      { trackId: "skeleton" },
    );

    const outcome = deriveStructuralDescriptors({
      order: ["empty", "skeleton"],
      plans: new Map([
        ["empty", emptyPlan],
        ["skeleton", skeletonPlan],
      ]),
    });

    expect(outcome.kind).toBe("refused");
    const diags = outcome.diagnostics.filter((d) => d.ruleId === "derivation-failure");
    expect(diags.some((d) => /has no points/i.test(d.message))).toBe(true);
  });

  it("refuses an imported chain whose locator count does not match its point count", () => {
    const pointId = asPointMemberId(asAuthoredEntryId("p0"));
    const registry = new PluginRegistry();
    registry.registerAll([
      pointPlugin,
      rootPlugin,
      joinPlugin,
      createChainProducer(
        "bad_locators",
        chainPayload({
          orderedPointIds: [pointId],
          parentIndices: [-1],
          childAdjacency: [[]],
          rootId: pointId,
          leafIds: [pointId],
          pointIndexById: { p0: 0 },
          locators: [],
        }),
      ),
    ]);
    const sourcePlan = registry.compileExecutionPlan([{ p0: { plugin: "bad_locators" } }], {
      trackId: "bad",
    });
    const skeletonPlan = registry.compileExecutionPlan(
      [{ j0: { plugin: "join", requires: { chain: "bad" } } }],
      { trackId: "skeleton" },
    );

    const outcome = deriveStructuralDescriptors({
      order: ["bad", "skeleton"],
      plans: new Map([
        ["bad", sourcePlan],
        ["skeleton", skeletonPlan],
      ]),
    });

    expect(outcome.kind).toBe("refused");
    const diags = outcome.diagnostics.filter((d) => d.ruleId === "derivation-failure");
    expect(diags.some((d) => /published 1 point\(s\) but 0 locator\(s\)/i.test(d.message))).toBe(
      true,
    );
  });

  it("refuses cross-chain duplicate point IDs", () => {
    const registry = createSkeletonRegistry();
    const torsoPlan = registry.compileExecutionPlan(
      [{ p0: { plugin: "point" } }, { p1: { plugin: "point" } }],
      { trackId: "torso" },
    );
    const armPlan = registry.compileExecutionPlan(
      [{ p1: { plugin: "point" } }, { p2: { plugin: "point" } }],
      { trackId: "arm" },
    );
    const skeletonPlan = registry.compileExecutionPlan(
      [
        { j_torso: { plugin: "join", requires: { chain: "torso" } } },
        { j_arm: { plugin: "join", requires: { chain: "arm", parent: "torso" } } },
      ],
      { trackId: "skeleton" },
    );

    const outcome = deriveStructuralDescriptors({
      order: ["torso", "arm", "skeleton"],
      plans: new Map([
        ["torso", torsoPlan],
        ["arm", armPlan],
        ["skeleton", skeletonPlan],
      ]),
    });

    expect(outcome.kind).toBe("refused");
    const diags = outcome.diagnostics.filter((d) => d.ruleId === "derivation-failure");
    expect(diags.some((d) => /Duplicate point ID "p1"/i.test(d.message))).toBe(true);
  });

  it("derives nothing (none) when duplicate roots are on the joined track so root.derive reports duplicate once", () => {
    const registry = createSkeletonRegistry();
    const torsoPlan = registry.compileExecutionPlan([{ t0: { plugin: "point" } }], {
      trackId: "torso",
    });
    const skeletonPlan = registry.compileExecutionPlan(
      [
        { r1: { plugin: "root" } },
        { j0: { plugin: "join", requires: { chain: "torso" } } },
        { r2: { plugin: "root" } },
      ],
      { trackId: "skeleton" },
    );

    const outcome = deriveStructuralDescriptors({
      order: ["torso", "skeleton"],
      plans: new Map([
        ["torso", torsoPlan],
        ["skeleton", skeletonPlan],
      ]),
    });

    expect(outcome.kind).toBe("refused");
    const duplicateDiags = outcome.diagnostics.filter((d) =>
      /Duplicate root entries/i.test(d.message),
    );
    expect(duplicateDiags).toHaveLength(1);
    const skelDescs = outcome.descriptors.get("skeleton") ?? [];
    expect(skelDescs.some((d) => d.capability === "joined")).toBe(false);
  });

  it("derives nothing when a join track mixes point entries or unrelated entries", () => {
    const registry = createSkeletonRegistry();
    const torsoPlan = registry.compileExecutionPlan([{ t0: { plugin: "point" } }], {
      trackId: "torso",
    });
    const mixedPlan = registry.compileExecutionPlan(
      [{ j0: { plugin: "join", requires: { chain: "torso" } } }, { p0: { plugin: "point" } }],
      { trackId: "mixed" },
    );

    const outcome = deriveStructuralDescriptors({
      order: ["torso", "mixed"],
      plans: new Map([
        ["torso", torsoPlan],
        ["mixed", mixedPlan],
      ]),
    });

    expect(outcome.kind).toBe("accepted");
    const mixedDescs = outcome.descriptors.get("mixed") ?? [];
    expect(mixedDescs.some((d) => d.capability === "joined")).toBe(false);
    expect(mixedDescs.some((d) => d.capability === "chain")).toBe(false);
  });

  it("skips validate as well as derive for a mixed track with an unrelated entry", () => {
    const noisePlugin: PluginDefinition = Object.freeze({
      name: "noise",
      collect: () => ({}),
    });
    const registry = new PluginRegistry();
    registry.registerAll([pointPlugin, rootPlugin, joinPlugin, noisePlugin]);
    const torsoPlan = registry.compileExecutionPlan(
      [{ r0: { plugin: "root" } }, { t0: { plugin: "point" } }],
      { trackId: "torso" },
    );
    const mixedPlan = registry.compileExecutionPlan(
      [{ j0: { plugin: "join", requires: { chain: "torso" } } }, { n0: { plugin: "noise" } }],
      { trackId: "mixed" },
    );

    const outcome = deriveStructuralDescriptors({
      order: ["torso", "mixed"],
      plans: new Map([
        ["torso", torsoPlan],
        ["mixed", mixedPlan],
      ]),
    });

    expect(outcome.kind).toBe("accepted");
    expect(
      outcome.diagnostics.filter((d) => d.ruleId === "skeleton-imported-chain-has-root"),
    ).toHaveLength(0);
    const mixedDescs = outcome.descriptors.get("mixed") ?? [];
    expect(mixedDescs.some((d) => d.capability === "joined")).toBe(false);
  });

  it("accepts root entry at arbitrary positions on the joined track and produces identical layout", () => {
    const registry = createSkeletonRegistry();
    const torsoPlan = registry.compileExecutionPlan([{ t0: { plugin: "point" } }], {
      trackId: "torso",
    });
    const armPlan = registry.compileExecutionPlan([{ a0: { plugin: "point" } }], {
      trackId: "arm",
    });

    const skelRootFirst = registry.compileExecutionPlan(
      [
        { r0: { plugin: "root" } },
        { j0: { plugin: "join", requires: { chain: "torso" } } },
        { j1: { plugin: "join", requires: { chain: "arm", parent: "torso" } } },
      ],
      { trackId: "skel1" },
    );

    const skelRootMiddle = registry.compileExecutionPlan(
      [
        { j0: { plugin: "join", requires: { chain: "torso" } } },
        { r0: { plugin: "root" } },
        { j1: { plugin: "join", requires: { chain: "arm", parent: "torso" } } },
      ],
      { trackId: "skel2" },
    );

    const skelRootLast = registry.compileExecutionPlan(
      [
        { j0: { plugin: "join", requires: { chain: "torso" } } },
        { j1: { plugin: "join", requires: { chain: "arm", parent: "torso" } } },
        { r0: { plugin: "root" } },
      ],
      { trackId: "skel3" },
    );

    const outcome = deriveStructuralDescriptors({
      order: ["torso", "arm", "skel1", "skel2", "skel3"],
      plans: new Map([
        ["torso", torsoPlan],
        ["arm", armPlan],
        ["skel1", skelRootFirst],
        ["skel2", skelRootMiddle],
        ["skel3", skelRootLast],
      ]),
    });

    expect(outcome.kind).toBe("accepted");

    const p1 = outcome.descriptors.get("skel1")![0]!.payload as JoinedPayload;
    const p2 = outcome.descriptors.get("skel2")![0]!.payload as JoinedPayload;
    const p3 = outcome.descriptors.get("skel3")![0]!.payload as JoinedPayload;

    expect(p1.orderedPointIds).toEqual(["t0", "a0"]);
    expect(p2.orderedPointIds).toEqual(["t0", "a0"]);
    expect(p3.orderedPointIds).toEqual(["t0", "a0"]);

    expect(p1.parentIndices).toEqual([-1, 0]);
    expect(p2.parentIndices).toEqual([-1, 0]);
    expect(p3.parentIndices).toEqual([-1, 0]);

    expect(p1.rootPolicy.kind).toBe("unbound");
    expect(p2.rootPolicy.kind).toBe("unbound");
    expect(p3.rootPolicy.kind).toBe("unbound");
  });

  it("propagates a bound root policy from the joined track into the layout identity", () => {
    const registry = createSkeletonRegistry();
    const torsoPlan = registry.compileExecutionPlan([{ t0: { plugin: "point" } }], {
      trackId: "torso",
    });

    const rootlessPlan = registry.compileExecutionPlan(
      [{ j0: { plugin: "join", requires: { chain: "torso" } } }],
      { trackId: "rootless" },
    );
    const unboundPlan = registry.compileExecutionPlan(
      [{ r0: { plugin: "root" } }, { j0: { plugin: "join", requires: { chain: "torso" } } }],
      { trackId: "unbound" },
    );
    const boundPlan = registry.compileExecutionPlan(
      [
        { r0: { plugin: "root", requires: { frame: "body" } } },
        { j0: { plugin: "join", requires: { chain: "torso" } } },
      ],
      { trackId: "bound" },
    );

    const outcome = deriveStructuralDescriptors({
      order: ["torso", "rootless", "unbound", "bound"],
      plans: new Map([
        ["torso", torsoPlan],
        ["rootless", rootlessPlan],
        ["unbound", unboundPlan],
        ["bound", boundPlan],
      ]),
    });

    expect(outcome.kind).toBe("accepted");
    const rootless = outcome.descriptors.get("rootless")![0]!.payload as JoinedPayload;
    const unbound = outcome.descriptors.get("unbound")![0]!.payload as JoinedPayload;
    const bound = outcome.descriptors.get("bound")![0]!.payload as JoinedPayload;

    expect(rootless.rootPolicy.kind).toBe("origin");
    expect(unbound.rootPolicy.kind).toBe("unbound");
    expect(bound.rootPolicy.kind).toBe("bound");
    if (bound.rootPolicy.kind === "bound") {
      expect(bound.rootPolicy.source).toBe("body");
    }

    expect(rootless.layoutIdentity).not.toBe(unbound.layoutIdentity);
    expect(unbound.layoutIdentity).not.toBe(bound.layoutIdentity);
  });

  it("changes layout identity when topology or join entry identity changes", () => {
    const registry = createSkeletonRegistry();
    const torsoForward = registry.compileExecutionPlan(
      [{ t0: { plugin: "point" } }, { t1: { plugin: "point" } }],
      { trackId: "torso" },
    );
    const torsoReversed = registry.compileExecutionPlan(
      [{ t1: { plugin: "point" } }, { t0: { plugin: "point" } }],
      { trackId: "torso" },
    );
    const armPlan = registry.compileExecutionPlan([{ a0: { plugin: "point" } }], {
      trackId: "arm",
    });
    const skeletonA = registry.compileExecutionPlan(
      [
        { j_torso: { plugin: "join", requires: { chain: "torso" } } },
        { j_arm: { plugin: "join", requires: { chain: "arm", parent: "torso" } } },
      ],
      { trackId: "skeleton" },
    );
    const skeletonB = registry.compileExecutionPlan(
      [
        { j_root: { plugin: "join", requires: { chain: "torso" } } },
        { j_branch: { plugin: "join", requires: { chain: "arm", parent: "torso" } } },
      ],
      { trackId: "skeleton" },
    );

    const base = deriveStructuralDescriptors({
      order: ["torso", "arm", "skeleton"],
      plans: new Map([
        ["torso", torsoForward],
        ["arm", armPlan],
        ["skeleton", skeletonA],
      ]),
    });
    const reordered = deriveStructuralDescriptors({
      order: ["torso", "arm", "skeleton"],
      plans: new Map([
        ["torso", torsoReversed],
        ["arm", armPlan],
        ["skeleton", skeletonA],
      ]),
    });
    const relinked = deriveStructuralDescriptors({
      order: ["torso", "arm", "skeleton"],
      plans: new Map([
        ["torso", torsoForward],
        ["arm", armPlan],
        ["skeleton", skeletonB],
      ]),
    });

    const basePayload = base.descriptors.get("skeleton")![0]!.payload as JoinedPayload;
    const reorderedPayload = reordered.descriptors.get("skeleton")![0]!.payload as JoinedPayload;
    const relinkedPayload = relinked.descriptors.get("skeleton")![0]!.payload as JoinedPayload;

    expect(reorderedPayload.layoutIdentity).not.toBe(basePayload.layoutIdentity);
    expect(relinkedPayload.layoutIdentity).not.toBe(basePayload.layoutIdentity);
  });

  it("keeps layout identity injective for separator-bearing point IDs", () => {
    const registry = createSkeletonRegistry();
    const firstPlan = registry.compileExecutionPlan(
      [{ "a>b": { plugin: "point" } }, { c: { plugin: "point" } }],
      { trackId: "chain" },
    );
    const secondPlan = registry.compileExecutionPlan(
      [{ a: { plugin: "point" } }, { "b>c": { plugin: "point" } }],
      { trackId: "chain" },
    );

    const first = deriveStructuralDescriptors({
      order: ["chain"],
      plans: new Map([["chain", firstPlan]]),
    });
    const second = deriveStructuralDescriptors({
      order: ["chain"],
      plans: new Map([["chain", secondPlan]]),
    });

    const firstPayload = first.descriptors.get("chain")![0]!.payload as ChainPayload;
    const secondPayload = second.descriptors.get("chain")![0]!.payload as ChainPayload;

    expect(firstPayload.orderedPointIds).toEqual(["a>b", "c"]);
    expect(secondPayload.orderedPointIds).toEqual(["a", "b>c"]);
    expect(firstPayload.layoutIdentity).not.toBe(secondPayload.layoutIdentity);
  });

  it("numeric source updates preserve structural layout identity", () => {
    const registry = createSkeletonRegistry();

    const torsoPlan1 = registry.compileExecutionPlan(
      [{ t0: { plugin: "point", values: { length: 10 } } }],
      { trackId: "torso" },
    );
    const torsoPlan2 = registry.compileExecutionPlan(
      [{ t0: { plugin: "point", values: { length: 500 } } }],
      { trackId: "torso" },
    );

    const armPlan = registry.compileExecutionPlan(
      [{ a0: { plugin: "point", values: { length: 15 } } }],
      { trackId: "arm" },
    );

    const skeletonPlan = registry.compileExecutionPlan(
      [
        { j0: { plugin: "join", requires: { chain: "torso" } } },
        { j1: { plugin: "join", requires: { chain: "arm", parent: "torso" } } },
      ],
      { trackId: "skeleton" },
    );

    const outcome1 = deriveStructuralDescriptors({
      order: ["torso", "arm", "skeleton"],
      plans: new Map([
        ["torso", torsoPlan1],
        ["arm", armPlan],
        ["skeleton", skeletonPlan],
      ]),
    });

    const outcome2 = deriveStructuralDescriptors({
      order: ["torso", "arm", "skeleton"],
      plans: new Map([
        ["torso", torsoPlan2],
        ["arm", armPlan],
        ["skeleton", skeletonPlan],
      ]),
    });

    const p1 = outcome1.descriptors.get("skeleton")![0]!.payload as JoinedPayload;
    const p2 = outcome2.descriptors.get("skeleton")![0]!.payload as JoinedPayload;

    expect(p1.layoutIdentity).toBe(p2.layoutIdentity);
  });

  it("validates and derives once per joined track", () => {
    let validateCalls = 0;
    const baseValidate = joinPlugin.validate;
    if (baseValidate === undefined) throw new Error("join plugin must declare validate");
    const countingJoin: PluginDefinition = Object.freeze({
      ...joinPlugin,
      validate: (context: RequirementContext) => {
        validateCalls += 1;
        return baseValidate(context);
      },
    });
    const registry = new PluginRegistry();
    registry.registerAll([pointPlugin, rootPlugin, countingJoin]);

    const torsoPlan = registry.compileExecutionPlan([{ t0: { plugin: "point" } }], {
      trackId: "torso",
    });
    const armPlan = registry.compileExecutionPlan([{ a0: { plugin: "point" } }], {
      trackId: "arm",
    });
    const skeletonPlan = registry.compileExecutionPlan(
      [
        { j_torso: { plugin: "join", requires: { chain: "torso" } } },
        { j_arm: { plugin: "join", requires: { chain: "arm", parent: "torso" } } },
      ],
      { trackId: "skeleton" },
    );

    const callCounter = new Map<string, number>();
    const outcome = deriveStructuralDescriptors({
      order: ["torso", "arm", "skeleton"],
      plans: new Map([
        ["torso", torsoPlan],
        ["arm", armPlan],
        ["skeleton", skeletonPlan],
      ]),
      callCounter,
    });

    expect(outcome.kind).toBe("accepted");
    expect(validateCalls).toBe(1);
    expect(callCounter.get("skeleton:join")).toBe(1);
  });

  it("preserves layout identity across a numeric update in the same runtime", () => {
    const registry = createSkeletonRegistry();
    const project = new Engine({
      plugins: registry,
      clock: createManualClock(),
      interpolator: createFakeInterpolator(),
      scheduler: createFakeScheduler(),
    }).load({
      schemaVersion: 5,
      motions: [
        {
          id: "m0",
          trigger: { type: "manual" },
          tracks: [
            {
              id: "torso",
              keyframes: [{ t0: { plugin: "point", values: { length: 10 } } }],
            },
            {
              id: "skeleton",
              keyframes: [{ j0: { plugin: "join", requires: { chain: "m0/torso" } } }],
            },
          ],
        },
      ],
    });

    const before = project.track("m0/skeleton").descriptors;
    expect(before).toHaveLength(1);
    const beforePayload = before[0]!.payload as JoinedPayload;

    project.track("m0/torso").setValues({ length: 999 });

    const after = project.track("m0/skeleton").descriptors;
    expect(after).toHaveLength(1);
    const afterPayload = after[0]!.payload as JoinedPayload;
    expect(afterPayload.layoutIdentity).toBe(beforePayload.layoutIdentity);
  });

  it("integrates end-to-end with Engine and track.descriptors", () => {
    const registry = createSkeletonRegistry();

    const project = new Engine({
      plugins: registry,
      clock: createManualClock(),
      interpolator: createFakeInterpolator(),
      scheduler: createFakeScheduler(),
    }).load({
      schemaVersion: 5,
      motions: [
        {
          id: "m0",
          trigger: { type: "manual" },
          tracks: [
            {
              id: "torso",
              keyframes: [
                { t0: { plugin: "point", values: { length: 10 } } },
                { t1: { plugin: "point", values: { length: 20 } } },
              ],
            },
            {
              id: "arm_l",
              keyframes: [{ l0: { plugin: "point", values: { length: 15 } } }],
            },
            {
              id: "skeleton",
              keyframes: [
                { j_torso: { plugin: "join", requires: { chain: "m0/torso" } } },
                {
                  j_arm_l: { plugin: "join", requires: { chain: "m0/arm_l", parent: "m0/torso" } },
                },
              ],
            },
          ],
        },
      ],
    });

    const skelTrack = project.track("m0/skeleton");
    const descriptors = skelTrack.descriptors;

    expect(descriptors).toHaveLength(1);
    const joinedDesc = descriptors[0]!;
    expect(joinedDesc.capability).toBe("joined");
    expect(joinedDesc.source).toBe("m0/skeleton");
    const payload = joinedDesc.payload as JoinedPayload;
    expect(payload.orderedPointIds).toEqual(["t0", "t1", "l0"]);
    expect(payload.parentIndices).toEqual([-1, 0, 1]);
    expect(payload.childAdjacency).toEqual([[1], [2], []]);
    expect(payload.rootId).toBe("t0");
    expect(payload.leafIds).toEqual(["l0"]);
  });
});
