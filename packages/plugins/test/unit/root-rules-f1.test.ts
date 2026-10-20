import { describe, expect, it } from "vitest";
import { PluginRegistry, type PluginDefinition } from "@motion5/core";
import { deriveStructuralDescriptors } from "../../../core/src/domain/structural-derivation";
import { none, type DeriveResult } from "@motion5/core/plugin-api";
import { pointPlugin } from "../../src/point";
import { rootPlugin } from "../../src/root";
import type { ChainPayload } from "../../src/chain-layout";

describe("F1: root-owned duplicate-root rule and root-only tracks", () => {
  const frameSrcPlugin: PluginDefinition = {
    name: "frame-src",
    fold: {
      outputs: ["x"],
      run: () => ({ x: 0 }),
    },
  };

  const chainConsumerPlugin: PluginDefinition = {
    name: "chain-consumer",
    requirements: {
      source: { capability: "chain" },
    },
    collect: () => ({}),
    derive: (): DeriveResult => none,
  };

  it("accepts a root-only track without chain descriptor, and refuses consumer bound to it", () => {
    const registry = new PluginRegistry();
    registry.registerAll([rootPlugin, chainConsumerPlugin]);

    const armPlan = registry.compileExecutionPlan([{ r1: { plugin: "root" } }], {
      trackId: "arm",
    });

    const singleOutcome = deriveStructuralDescriptors({
      order: ["arm"],
      plans: new Map([["arm", armPlan]]),
    });

    expect(singleOutcome.kind).toBe("accepted");
    expect(singleOutcome.diagnostics).toHaveLength(0);
    const armDescs = singleOutcome.descriptors.get("arm") ?? [];
    expect(armDescs.some((d) => d.capability === "chain")).toBe(false);

    const consumerPlan = registry.compileExecutionPlan(
      [{ c1: { plugin: "chain-consumer", requires: { source: "arm" } } }],
      { trackId: "consumer" },
    );

    const consumerOutcome = deriveStructuralDescriptors({
      order: ["arm", "consumer"],
      plans: new Map([
        ["arm", armPlan],
        ["consumer", consumerPlan],
      ]),
    });

    expect(consumerOutcome.kind).toBe("refused");
    const missingCapDiags = consumerOutcome.diagnostics.filter(
      (d) => d.ruleId === "derivation-missing-capability",
    );
    expect(missingCapDiags).toHaveLength(1);
  });

  it("refuses two roots with no point and reports exactly one duplicate diagnostic", () => {
    const registry = new PluginRegistry();
    registry.registerAll([rootPlugin]);

    const armPlan = registry.compileExecutionPlan(
      [{ r1: { plugin: "root" } }, { r2: { plugin: "root" } }],
      { trackId: "arm" },
    );

    const outcome = deriveStructuralDescriptors({
      order: ["arm"],
      plans: new Map([["arm", armPlan]]),
    });

    expect(outcome.kind).toBe("refused");
    const duplicateDiags = outcome.diagnostics.filter((d) =>
      /Duplicate root entries/i.test(d.message),
    );
    expect(duplicateDiags).toHaveLength(1);
  });

  it("refuses two roots plus one point plus one toy fold plugin entry with exactly one duplicate diagnostic and no chain descriptor", () => {
    const registry = new PluginRegistry();
    registry.registerAll([rootPlugin, pointPlugin, frameSrcPlugin]);

    const armPlan = registry.compileExecutionPlan(
      [
        { r1: { plugin: "root" } },
        { p0: { plugin: "point", values: { length: 10, x: 0, y: 0 } } },
        { r2: { plugin: "root" } },
        { f0: { plugin: "frame-src" } },
      ],
      { trackId: "arm" },
    );

    const outcome = deriveStructuralDescriptors({
      order: ["arm"],
      plans: new Map([["arm", armPlan]]),
    });

    expect(outcome.kind).toBe("refused");
    const duplicateDiags = outcome.diagnostics.filter((d) =>
      /Duplicate root entries/i.test(d.message),
    );
    expect(duplicateDiags).toHaveLength(1);
    const armDescs = outcome.descriptors.get("arm") ?? [];
    expect(armDescs.some((d) => d.capability === "chain")).toBe(false);
  });

  it("accepts one root plus one point with one chain descriptor and unbound rootPolicy", () => {
    const registry = new PluginRegistry();
    registry.registerAll([rootPlugin, pointPlugin]);

    const armPlan = registry.compileExecutionPlan(
      [{ r0: { plugin: "root" } }, { p0: { plugin: "point", values: { length: 10, x: 0, y: 0 } } }],
      { trackId: "arm" },
    );

    const outcome = deriveStructuralDescriptors({
      order: ["arm"],
      plans: new Map([["arm", armPlan]]),
    });

    expect(outcome.kind).toBe("accepted");
    const armDescs = outcome.descriptors.get("arm");
    expect(armDescs).toBeDefined();
    expect(armDescs).toHaveLength(1);
    const chainDesc = armDescs![0]!;
    expect(chainDesc.capability).toBe("chain");
    const payload = chainDesc.payload as ChainPayload;
    expect(payload.rootPolicy.kind).toBe("unbound");
  });
});
