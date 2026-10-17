import { describe, expect, it } from "vitest";
import { PluginRegistry, type PluginDefinition } from "../../src/domain/plugins";
import { deriveStructuralDescriptors } from "../../src/domain/structural-derivation";
import {
  DerivationUndeclaredSourceError,
  type DerivationContext,
  type StructuralDescriptor,
} from "../../src/contract/derivation";
import { ProjectRuntime } from "../../src/runtime/project-runtime";
import { createManualClock } from "../../src/ports/clock";
import { IncrementalGraphBuilder } from "../../src/graph/builders/incremental";
import type { ProjectDefinition } from "../../src/contract/v5";
import { diagnostic } from "../../src/contract/diagnostics";

describe("Slice C1: Generic structural derivation", () => {
  const toySourcePlugin: PluginDefinition = {
    name: "box-emitter",
    keys: ["w", "x", "size"],
    capabilities: ["box"],
    collect: {
      output: "boxes",
      run: (entry) => ({ ...(entry as Record<string, unknown>) }),
    },
    derive: (context: DerivationContext): readonly StructuralDescriptor[] => {
      const width = context.participatingEntries.length * 100;
      return [
        {
          capability: "box",
          source: context.trackId ?? "unknown",
          payload: { width, height: 50 },
        },
      ];
    },
  };

  const toyConsumerPlugin: PluginDefinition = {
    name: "box-consumer",
    requirements: {
      source: { capability: "box" },
    },
    collect: {
      output: "consumptions",
      run: (entry) => ({ ...(entry as Record<string, unknown>) }),
    },
    derive: (context: DerivationContext): readonly StructuralDescriptor[] => {
      const boundSources = Array.from(context.inventory.declaredSources);
      const results: StructuralDescriptor[] = [];
      for (const src of boundSources) {
        const desc = context.readDescriptor(src, "box");
        results.push({
          capability: "consumer-view",
          source: context.trackId ?? "unknown",
          payload: { consumedFrom: src, sourcePayload: desc.payload },
        });
      }
      return results;
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
      collect: {
        output: "out",
        run: () => ({}),
      },
      derive: (context) => {
        capturedInventoryEntries = context.inventory.entries;
        expect(context.inventory.entriesById.has("item1")).toBe(true);
        expect(context.participatingEntries).toHaveLength(1);
        expect(context.participatingEntries[0]!.valueKeys).toEqual(["alpha", "beta"]);
        return [];
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
      collect: { output: "empty", run: () => ({}) },
      derive: () => [],
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

  it("refuses when bound source provides ambiguous capability", () => {
    const ambiguousPlugin: PluginDefinition = {
      name: "multi-box",
      collect: { output: "multi", run: () => ({}) },
      derive: () => [
        { capability: "box", source: "src", payload: { id: 1 } },
        { capability: "box", source: "src", payload: { id: 2 } },
      ],
    };

    const registry = new PluginRegistry();
    registry.registerAll([ambiguousPlugin, toyConsumerPlugin]);
    const sourcePlan = registry.compileExecutionPlan([{ s1: { plugin: "multi-box" } }], {
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
        ruleId: "derivation-ambiguous-capability",
      }),
    );
  });

  it("refuses and throws when plugin attempts to read undeclared source", () => {
    const sneakPlugin: PluginDefinition = {
      name: "sneak",
      collect: { output: "sneakOut", run: () => ({}) },
      derive: (context) => {
        context.readDescriptor("secretTrack", "box");
        return [];
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

  it("propagates cycle diagnostics without evaluating derivation hooks", () => {
    let hookExecuted = false;
    const cycledPlugin: PluginDefinition = {
      name: "cycled",
      collect: { output: "cycleOut", run: () => ({}) },
      derive: () => {
        hookExecuted = true;
        return [];
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
      capabilities: ["box"],
      collect: { output: "counted", run: (e) => ({ ...(e as Record<string, unknown>) }) },
      derive: (context) => {
        derivationRuns++;
        return [
          {
            capability: "box",
            source: context.trackId ?? "unknown",
            payload: { count: derivationRuns },
          },
        ];
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
    expect(initialT1Descs[0]!.payload).toEqual({ count: 1 });
    expect(runtime.structuralVersion).toBe(1);
    expect(runtime.derivationCount("m1/t1:counted-box")).toBe(1);
    expect(runtime.derivationCount("m1/t2:box-consumer")).toBe(1);

    // 2. Numeric write does NOT trigger rederivation
    track1.overrideValues({ e1: { size: 20 } });
    expect(runtime.structuralVersion).toBe(1);
    expect(runtime.derivationCount("m1/t1:counted-box")).toBe(1);
    expect(runtime.descriptorsOf("m1/t1")[0]!.payload).toEqual({ count: 1 });

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
    expect(runtime.descriptorsOf("m1/t1")[0]!.payload).toEqual({ count: 2 });

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
    expect(runtime.descriptorsOf("m1/t1")[0]!.payload).toEqual({ count: 2 });
    expect(runtime.descriptorsOf("m1/t2")[0]!.capability).toBe("consumer-view");
  });
});
