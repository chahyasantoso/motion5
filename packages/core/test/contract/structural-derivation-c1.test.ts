import { describe, expect, it } from "vitest";
import { PluginRegistry, type PluginDefinition } from "../../src/domain/plugins";
import { deriveStructuralDescriptors } from "../../src/domain/structural-derivation";
import { derived, none, refused, type DeriveResult } from "../../src/contract/derivation";
import { ProjectRuntime } from "../../src/runtime/project-runtime";
import { createManualClock } from "../../src/ports/clock";
import { IncrementalGraphBuilder } from "../../src/graph/builders/incremental";
import type { ProjectDefinition } from "../../src/contract/v5";
import { diagnostic } from "../../src/contract/diagnostics";

declare module "../../src/contract/capability" {
  interface CapabilityMap {
    box: { readonly width: number; readonly height: number; readonly count?: number };
    "consumer-view": { readonly consumedFrom: string; readonly sourcePayload: unknown };
  }
}

describe("Slice C1: Generic structural derivation", () => {
  const toySourcePlugin: PluginDefinition = {
    name: "box-emitter",
    keys: ["w", "x", "size"],
    collect: (entry) => ({ ...(entry as Record<string, unknown>) }),
    derive: (context): DeriveResult => {
      const width = context.entries.length * 100;
      return derived("box", { width, height: 50 });
    },
  };

  const toyConsumerPlugin: PluginDefinition = {
    name: "box-consumer",
    requirements: {
      source: { capability: "box" },
    },
    collect: (entry) => ({ ...(entry as Record<string, unknown>) }),
    derive: (context): DeriveResult => {
      const binding = context.entries.flatMap((e) => e.bindings).find((b) => b.slot === "source");
      if (binding === undefined) return none;
      const desc = context.read("box", binding.qualifiedSource);
      return derived("consumer-view", {
        consumedFrom: binding.qualifiedSource,
        sourcePayload: desc,
      });
    },
  };

  it("produces deterministic repeated derivation with deeply frozen descriptors", () => {
    const registry = new PluginRegistry();
    registry.registerAll([toySourcePlugin]);
    const plan = registry.compileExecutionPlan(
      [{ e1: { plugin: "box-emitter", values: { w: 10 } } }],
      { trackId: "trackA" },
    );
    const plans = new Map([["trackA", plan]]);

    const outcome1 = deriveStructuralDescriptors({
      order: ["trackA"],
      plans,
    });
    const outcome2 = deriveStructuralDescriptors({
      order: ["trackA"],
      plans,
    });

    expect(outcome1.kind).toBe("accepted");
    expect(outcome2.kind).toBe("accepted");
    expect(outcome1.descriptors.get("trackA")).toEqual(outcome2.descriptors.get("trackA"));

    const desc = outcome1.descriptors.get("trackA")![0]!;
    expect(desc).toBeDefined();
    expect(Object.isFrozen(desc)).toBe(true);
    expect(Object.isFrozen(desc.payload)).toBe(true);
  });

  it("resolves declared cross-source dependencies in topological order", () => {
    const registry = new PluginRegistry();
    registry.registerAll([toySourcePlugin, toyConsumerPlugin]);
    const sourcePlan = registry.compileExecutionPlan(
      [{ s1: { plugin: "box-emitter", values: { x: 5 } } }],
      { trackId: "sourceTrack" },
    );
    const consumerPlan = registry.compileExecutionPlan(
      [
        {
          c1: {
            plugin: "box-consumer",
            requires: { source: "sourceTrack" },
          },
        },
      ],
      { trackId: "consumerTrack" },
    );

    const plans = new Map([
      ["sourceTrack", sourcePlan],
      ["consumerTrack", consumerPlan],
    ]);

    const outcome = deriveStructuralDescriptors({
      order: ["sourceTrack", "consumerTrack"],
      plans,
    });

    expect(outcome.kind).toBe("accepted");
    const consumerDescs = outcome.descriptors.get("consumerTrack");
    expect(consumerDescs).toBeDefined();
    expect(consumerDescs).toHaveLength(1);
    expect(consumerDescs![0]).toEqual({
      capability: "consumer-view",
      source: "consumerTrack",
      payload: {
        consumedFrom: "sourceTrack",
        sourcePayload: { width: 100, height: 50 },
      },
    });
  });

  it("provides complete track-local inventory for semantic checks", () => {
    let capturedInventoryEntries: readonly unknown[] = [];
    const inventoryPlugin: PluginDefinition = {
      name: "inventory-inspector",
      keys: ["alpha", "beta"],
      collect: () => ({}),
      derive: (context) => {
        capturedInventoryEntries = context.inventory.entries;
        expect(context.inventory.entriesById.has("item1")).toBe(true);
        expect(context.entries).toHaveLength(1);
        expect(context.entries[0]!.valueKeys).toEqual(["alpha", "beta"]);
        return none;
      },
    };

    const registry = new PluginRegistry();
    registry.register(inventoryPlugin);
    const plan = registry.compileExecutionPlan(
      [
        {
          item1: {
            plugin: "inventory-inspector",
            values: { alpha: 1, beta: 2 },
          },
        },
      ],
      { trackId: "inspectTrack" },
    );

    const outcome = deriveStructuralDescriptors({
      order: ["inspectTrack"],
      plans: new Map([["inspectTrack", plan]]),
    });

    expect(outcome.kind).toBe("accepted");
    expect(capturedInventoryEntries).toHaveLength(1);
  });

  it("refuses when bound source is missing required capability", () => {
    const noCapPlugin: PluginDefinition = {
      name: "empty-source",
      collect: () => ({}),
      derive: () => none,
    };

    const registry = new PluginRegistry();
    registry.registerAll([noCapPlugin, toyConsumerPlugin]);
    const sourcePlan = registry.compileExecutionPlan([{ s1: { plugin: "empty-source" } }], {
      trackId: "src",
    });
    const consumerPlan = registry.compileExecutionPlan(
      [{ c1: { plugin: "box-consumer", requires: { source: "src" } } }],
      { trackId: "dst" },
    );

    const outcome = deriveStructuralDescriptors({
      order: ["src", "dst"],
      plans: new Map([
        ["src", sourcePlan],
        ["dst", consumerPlan],
      ]),
    });

    expect(outcome.kind).toBe("refused");
    expect(outcome.diagnostics).toContainEqual(
      expect.objectContaining({
        ruleId: "derivation-missing-capability",
      }),
    );
  });

  it("refuses when two plugins on one track both derive the same capability", () => {
    const boxPlugin1: PluginDefinition = {
      name: "box-1",
      collect: () => ({}),
      derive: () => derived("box", { width: 10, height: 20 }),
    };
    const boxPlugin2: PluginDefinition = {
      name: "box-2",
      collect: () => ({}),
      derive: () => derived("box", { width: 30, height: 40 }),
    };

    const registry = new PluginRegistry();
    registry.registerAll([boxPlugin1, boxPlugin2]);
    const plan = registry.compileExecutionPlan(
      [{ b1: { plugin: "box-1" } }, { b2: { plugin: "box-2" } }],
      { trackId: "ambiguousTrack" },
    );

    const outcome = deriveStructuralDescriptors({
      order: ["ambiguousTrack"],
      plans: new Map([["ambiguousTrack", plan]]),
    });

    expect(outcome.kind).toBe("refused");
    expect(outcome.diagnostics).toContainEqual(
      expect.objectContaining({
        ruleId: "derivation-ambiguous-capability",
      }),
    );
  });

  it("refuses when plugin attempts to read undeclared source", () => {
    const sneakPlugin: PluginDefinition = {
      name: "sneak",
      collect: () => ({}),
      derive: (context) => {
        context.read("box", "secretTrack");
        return none;
      },
    };

    const registry = new PluginRegistry();
    registry.register(sneakPlugin);
    const plan = registry.compileExecutionPlan([{ s1: { plugin: "sneak" } }], {
      trackId: "trackSneak",
    });

    const outcome = deriveStructuralDescriptors({
      order: ["trackSneak"],
      plans: new Map([["trackSneak", plan]]),
    });

    expect(outcome.kind).toBe("refused");
    expect(outcome.diagnostics).toContainEqual(
      expect.objectContaining({
        ruleId: "derivation-undeclared-source",
      }),
    );
  });

  it("refuses when a validate-only plugin returns an error diagnostic", () => {
    const errorDiag = diagnostic("derivation-failure", "valTrack", "Validation failed", []);
    const validateOnlyPlugin: PluginDefinition = {
      name: "validate-only",
      collect: () => ({}),
      validate: () => [errorDiag],
    };
    const registry = new PluginRegistry();
    registry.register(validateOnlyPlugin);
    const plan = registry.compileExecutionPlan([{ v1: { plugin: "validate-only" } }], {
      trackId: "valTrack",
    });
    const outcome = deriveStructuralDescriptors({
      order: ["valTrack"],
      plans: new Map([["valTrack", plan]]),
    });
    expect(outcome.kind).toBe("refused");
    expect(outcome.descriptors.get("valTrack")).toEqual([]);
    expect(outcome.diagnostics).toContain(errorDiag);
  });

  it("skips derive and does not increment derivation count if validate returns an error", () => {
    let deriveCalled = false;
    const callCounter = new Map<string, number>();
    const errorDiag = diagnostic("derivation-failure", "skipTrack", "Error", []);
    const valAndDerivePlugin: PluginDefinition = {
      name: "val-and-derive",
      collect: () => ({}),
      validate: () => [errorDiag],
      derive: () => {
        deriveCalled = true;
        return none;
      },
    };
    const registry = new PluginRegistry();
    registry.register(valAndDerivePlugin);
    const plan = registry.compileExecutionPlan([{ e1: { plugin: "val-and-derive" } }], {
      trackId: "skipTrack",
    });
    const outcome = deriveStructuralDescriptors({
      order: ["skipTrack"],
      plans: new Map([["skipTrack", plan]]),
      callCounter,
    });
    expect(outcome.kind).toBe("refused");
    expect(deriveCalled).toBe(false);
    expect(callCounter.get("skipTrack:val-and-derive")).toBeUndefined();
  });

  it("refuses when derive returns status refused with diagnostic", () => {
    const d = diagnostic("derivation-failure", "refuseTrack", "Refused by plugin", []);
    const refusingPlugin: PluginDefinition = {
      name: "refuser",
      collect: () => ({}),
      derive: () => refused([d]),
    };
    const registry = new PluginRegistry();
    registry.register(refusingPlugin);
    const plan = registry.compileExecutionPlan([{ r1: { plugin: "refuser" } }], {
      trackId: "refuseTrack",
    });
    const outcome = deriveStructuralDescriptors({
      order: ["refuseTrack"],
      plans: new Map([["refuseTrack", plan]]),
    });
    expect(outcome.kind).toBe("refused");
    expect(outcome.diagnostics).toContain(d);
  });

  it("accepts when derive returns status none and produces no descriptor", () => {
    const nonePlugin: PluginDefinition = {
      name: "nonePlugin",
      collect: () => ({}),
      derive: () => none,
    };
    const registry = new PluginRegistry();
    registry.register(nonePlugin);
    const plan = registry.compileExecutionPlan([{ n1: { plugin: "nonePlugin" } }], {
      trackId: "noneTrack",
    });
    const outcome = deriveStructuralDescriptors({
      order: ["noneTrack"],
      plans: new Map([["noneTrack", plan]]),
    });
    expect(outcome.kind).toBe("accepted");
    expect(outcome.descriptors.get("noneTrack")).toEqual([]);
  });

  it("emits derivation-failure when derive returns a malformed result", () => {
    const malformedPlugin: PluginDefinition = {
      name: "malformed",
      collect: () => ({}),
      derive: () => ({ status: "weird" }) as unknown as DeriveResult,
    };
    const registry = new PluginRegistry();
    registry.register(malformedPlugin);
    const plan = registry.compileExecutionPlan([{ m1: { plugin: "malformed" } }], {
      trackId: "badTrack",
    });
    const outcome = deriveStructuralDescriptors({
      order: ["badTrack"],
      plans: new Map([["badTrack", plan]]),
    });
    expect(outcome.kind).toBe("refused");
    expect(outcome.diagnostics).toContainEqual(
      expect.objectContaining({
        ruleId: "derivation-failure",
      }),
    );
  });

  it("emits derivation-failure when derive throws an error", () => {
    const throwingPlugin: PluginDefinition = {
      name: "thrower",
      collect: () => ({}),
      derive: () => {
        throw new Error("Boom");
      },
    };
    const registry = new PluginRegistry();
    registry.register(throwingPlugin);
    const plan = registry.compileExecutionPlan([{ t1: { plugin: "thrower" } }], {
      trackId: "throwTrack",
    });
    const outcome = deriveStructuralDescriptors({
      order: ["throwTrack"],
      plans: new Map([["throwTrack", plan]]),
    });
    expect(outcome.kind).toBe("refused");
    expect(outcome.diagnostics).toContainEqual(
      expect.objectContaining({
        ruleId: "derivation-failure",
      }),
    );
  });

  it("propagates cycle diagnostics without evaluating derivation hooks", () => {
    let hookExecuted = false;
    const cycledPlugin: PluginDefinition = {
      name: "cycled",
      collect: () => ({}),
      derive: () => {
        hookExecuted = true;
        return none;
      },
    };

    const cycleDiag = diagnostic("graph-cycle", "nodeA", "Cycle detected", ["nodeA", "nodeB"]);
    const outcome = deriveStructuralDescriptors({
      order: ["nodeA", "nodeB"],
      plans: new Map(),
      cycleDiagnostics: [cycleDiag],
    });

    expect(outcome.kind).toBe("refused");
    expect(outcome.diagnostics).toEqual([cycleDiag]);
    expect(hookExecuted).toBe(false);
  });

  it("manages descriptor lifecycle across runtime commits, numeric writes and refusals", () => {
    let derivationRuns = 0;
    const countedPlugin: PluginDefinition = {
      name: "counted-box",
      keys: ["size"],
      collect: (e) => ({ ...(e as Record<string, unknown>) }),
      derive: () => {
        derivationRuns++;
        return derived("box", { width: 100, height: 50, count: derivationRuns });
      },
    };

    const registry = new PluginRegistry();
    registry.registerAll([countedPlugin, toyConsumerPlugin]);
    const project: ProjectDefinition = {
      schemaVersion: 5,
      motions: [
        {
          id: "m1",
          trigger: { type: "manual" },
          tracks: [
            {
              id: "t1",
              keyframes: [{ e1: { plugin: "counted-box", values: { size: 10 } } }],
            },
            {
              id: "t2",
              keyframes: [
                {
                  c1: {
                    plugin: "box-consumer",
                    requires: { source: "m1/t1" },
                  },
                },
              ],
            },
          ],
        },
      ],
    };

    const runtime = new ProjectRuntime(project, {
      clock: createManualClock(),
      plugins: registry,
      graphBuilder: new IncrementalGraphBuilder(registry),
      compose: () => () => ({ values: {}, sourceProgress: 0, sourceRevisions: {} }),
    });

    // 1. Initial derivation ran on load
    const track1 = runtime.track("m1/t1");
    const initialT1Descs = track1.descriptors;
    expect(initialT1Descs).toHaveLength(1);
    expect(initialT1Descs[0]!.payload).toEqual({ width: 100, height: 50, count: 1 });
    expect(runtime.structuralVersion).toBe(1);
    expect(runtime.derivationCount("m1/t1:counted-box")).toBe(1);
    expect(runtime.derivationCount("m1/t2:box-consumer")).toBe(1);

    // 2. Numeric write does NOT trigger rederivation
    track1.overrideValues({ e1: { size: 20 } });
    expect(runtime.structuralVersion).toBe(1);
    expect(runtime.derivationCount("m1/t1:counted-box")).toBe(1);
    expect(runtime.descriptorsOf("m1/t1")[0]!.payload).toEqual({
      width: 100,
      height: 50,
      count: 1,
    });

    // 3. Structural edit (adding entry) triggers rederivation
    runtime.edit((tx) => {
      tx.track("m1/t1").replace({
        id: "t1",
        keyframes: [
          { e1: { plugin: "counted-box", values: { size: 20 } } },
          { e2: { plugin: "counted-box", values: { size: 30 } } },
        ],
      });
    });

    expect(runtime.structuralVersion).toBe(2);
    expect(runtime.derivationCount("m1/t1:counted-box")).toBe(2);
    expect(runtime.descriptorsOf("m1/t1")[0]!.payload).toEqual({
      width: 100,
      height: 50,
      count: 2,
    });

    // 4. Failed structural commit reverts and leaves active descriptors untouched
    expect(() => {
      runtime.edit((tx) => {
        tx.track("m1/t2").replace({
          id: "t2",
          keyframes: [
            {
              c1: {
                plugin: "box-consumer",
                requires: { source: "m1/non-existent" },
              },
            },
          ],
        });
      });
    }).toThrow();

    // Still at version 2, active descriptors preserved
    expect(runtime.structuralVersion).toBe(2);
    expect(runtime.descriptorsOf("m1/t1")[0]!.payload).toEqual({
      width: 100,
      height: 50,
      count: 2,
    });
    expect(runtime.descriptorsOf("m1/t2")[0]!.capability).toBe("consumer-view");
  });
});
