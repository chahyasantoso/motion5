import { describe, expect, it } from "vitest";
import { PluginRegistry } from "../../src/domain/plugins";
import {
  compileTrackExecutionPlan,
  createEntryEvaluator,
  assertExecutionStrategy,
  type CompiledEntryPlan,
  type EvaluatorContext,
  type EvaluatorServices,
  type StatefulEvaluator,
} from "../../src/domain/execution-plan";
import type { PluginDefinition } from "../../src/domain/plugins";
import type { OutputSerializer } from "../../src/ports/render-metadata";

describe("Slice B2: Compile one immutable ordered entry plan", () => {
  it("compiles repeated same-definition entries with separate compiler identities and preserves reorder", () => {
    const pointPlugin: PluginDefinition = {
      name: "point",
      keys: ["length", "angle"],
      collect: {
        output: "points",
        run: (entry) => ({ ...(entry as Record<string, unknown>) }),
      },
    };

    const registry = new PluginRegistry();
    registry.register(pointPlugin);

    const keyframesOrder1 = [
      { upper: { plugin: "point", values: { length: 20 } } },
      { fore: { plugin: "point", values: { length: 10 } } },
    ];

    const plan1 = compileTrackExecutionPlan({
      trackId: "armTrack",
      keyframes: keyframesOrder1,
      registry,
    });

    expect(plan1.entries).toHaveLength(2);
    const [upperPlan, forePlan] = plan1.entries as [CompiledEntryPlan, CompiledEntryPlan];

    expect(upperPlan.entryId).toBe("upper");
    expect(forePlan.entryId).toBe("fore");
    expect(upperPlan.order).toBe(0);
    expect(forePlan.order).toBe(1);

    // Compiler identities are unique and NOT the current index
    expect(upperPlan.compilerKey).not.toBe(forePlan.compilerKey);
    expect(upperPlan.compilerKey).not.toBe(0);
    expect(forePlan.compilerKey).not.toBe(1);
    expect(typeof upperPlan.compilerKey).toBe("string");
    expect(upperPlan.compilerKey).toContain("upper");
    expect(forePlan.compilerKey).toContain("fore");

    // Lookups by ID and key
    expect(plan1.entriesById.get("upper")).toBe(upperPlan);
    expect(plan1.entriesById.get("fore")).toBe(forePlan);
    expect(plan1.entriesByKey.get(upperPlan.compilerKey)).toBe(upperPlan);

    // Reordering preserves authored order
    const keyframesOrder2 = [
      { fore: { plugin: "point", values: { length: 10 } } },
      { upper: { plugin: "point", values: { length: 20 } } },
    ];

    const plan2 = registry.compileExecutionPlan(keyframesOrder2, { trackId: "armTrack" });
    expect(plan2.entries[0]?.entryId).toBe("fore");
    expect(plan2.entries[0]?.order).toBe(0);
    expect(plan2.entries[1]?.entryId).toBe("upper");
    expect(plan2.entries[1]?.order).toBe(1);
  });

  it("permits shared collect outputs and shared fold outputs", () => {
    const pointPlugin: PluginDefinition = {
      name: "point",
      keys: ["x", "y"],
      collect: {
        output: "points",
        run: () => ({ x: 0, y: 0 }),
      },
    };

    const markerPlugin: PluginDefinition = {
      name: "marker",
      keys: ["weight"],
      collect: {
        output: "points",
        run: () => ({ weight: 1 }),
      },
    };

    const rootPlugin: PluginDefinition = {
      name: "root",
      keys: ["x", "y"],
      fold: {
        outputs: ["world"],
        run: () => ({ x: 0 }),
      },
    };

    const offsetPlugin: PluginDefinition = {
      name: "offset",
      keys: ["dx"],
      fold: {
        outputs: ["world"],
        run: () => ({ dx: 1 }),
      },
    };

    const registry = new PluginRegistry();
    registry.registerAll([pointPlugin, markerPlugin, rootPlugin, offsetPlugin]);

    const keyframes = [
      { p1: { plugin: "point", values: { x: 1 } } },
      { m1: { plugin: "marker", values: { weight: 2 } } },
      { r1: { plugin: "root", values: { x: 0 } } },
      { o1: { plugin: "offset", values: { dx: 5 } } },
    ];

    const plan = compileTrackExecutionPlan({
      keyframes,
      registry,
    });

    expect(plan.collectOutputs).toEqual(["points"]);
    expect(plan.foldOutputs).toEqual(["world"]);
    expect(plan.publishedOutputs).toEqual(["points", "world"]);
  });

  it("refuses cross-operation conflicts before any execution callback", () => {
    const collectWorld: PluginDefinition = {
      name: "collectWorld",
      keys: ["val"],
      collect: {
        output: "sharedChannel",
        run: () => ({ val: 1 }),
      },
    };

    const foldWorld: PluginDefinition = {
      name: "foldWorld",
      keys: ["val"],
      fold: {
        outputs: ["sharedChannel"],
        run: () => ({ val: 2 }),
      },
    };

    const registry = new PluginRegistry();
    registry.registerAll([collectWorld, foldWorld]);

    const keyframes = [
      { c: { plugin: "collectWorld", values: { val: 1 } } },
      { f: { plugin: "foldWorld", values: { val: 2 } } },
    ];

    expect(() =>
      compileTrackExecutionPlan({
        keyframes,
        registry,
      }),
    ).toThrow(/Cross-operation conflict: output "sharedChannel" claimed by both collect and fold/);
  });

  it("refuses collect output named reserved 'id' and producer claiming 'id'", () => {
    expect(() =>
      new PluginRegistry().register({
        name: "badCollectId",
        collect: {
          output: "id",
          run: () => ({}),
        },
      }),
    ).toThrow(/collect output cannot use reserved name "id"/);
  });

  it("reserves fields for optional operation claims", () => {
    const ikPlugin: PluginDefinition = {
      name: "ik",
      keys: ["alpha"],
      fold: {
        outputs: ["rotations", "inspection"],
        run: () => ({ rotations: {} }),
      },
    };

    const registry = new PluginRegistry();
    registry.register(ikPlugin);

    const plan = compileTrackExecutionPlan({
      keyframes: [{ solve: { plugin: "ik", values: { alpha: 1 } } }],
      registry,
    });

    expect(plan.foldOutputs).toContain("rotations");
    expect(plan.foldOutputs).toContain("inspection");
    expect(plan.publishedOutputs).toContain("inspection");
  });

  it("requires shared serializers to agree and derives metadata from operations", () => {
    const serializerA: OutputSerializer = (val: unknown) => String(val);
    const serializerB: OutputSerializer = (val: unknown) => JSON.stringify(val);

    const pluginA: PluginDefinition = {
      name: "pluginA",
      collect: { output: "mesh", run: () => ({}) },
      outputSerializers: { mesh: serializerA },
    };

    const pluginBValid: PluginDefinition = {
      name: "pluginBValid",
      collect: { output: "mesh", run: () => ({}) },
      outputSerializers: { mesh: serializerA },
    };

    const registryValid = new PluginRegistry();
    registryValid.registerAll([pluginA, pluginBValid]);

    const planValid = compileTrackExecutionPlan({
      keyframes: [
        { a: { plugin: "pluginA", values: {} } },
        { b: { plugin: "pluginBValid", values: {} } },
      ],
      registry: registryValid,
    });
    expect(planValid.outputSerializers.mesh).toBe(serializerA);

    const pluginCConflict: PluginDefinition = {
      name: "pluginCConflict",
      collect: { output: "mesh", run: () => ({}) },
      outputSerializers: { mesh: serializerB },
    };

    const registryConflict = new PluginRegistry();
    registryConflict.registerAll([pluginA, pluginCConflict]);

    expect(() =>
      compileTrackExecutionPlan({
        keyframes: [
          { a: { plugin: "pluginA", values: {} } },
          { c: { plugin: "pluginCConflict", values: {} } },
        ],
        registry: registryConflict,
      }),
    ).toThrow(/Conflicting serializers for shared output "mesh"/);
  });

  it("normalizes exactly one execution strategy and tests exhaustiveness", () => {
    const statelessPlugin: PluginDefinition = {
      name: "statelessPlugin",
      collect: { output: "points", run: () => ({}) },
    };

    let factoryCallCount = 0;
    let receivedServices: EvaluatorServices | undefined;
    let receivedContext: EvaluatorContext | undefined;

    const fakeEvaluator: StatefulEvaluator = {
      prepare: (local, state) => ({ prepared: local, proposedState: state }),
      collect: () => ({ x: 1 }),
      fold: (_prep, prior) => ({ delta: { ...prior }, proposedState: {} }),
    };

    const factoryPlugin: PluginDefinition = {
      name: "factoryPlugin",
      collect: { output: "evalPoints" },
      createEvaluator: (ctx, services) => {
        factoryCallCount++;
        receivedContext = ctx;
        receivedServices = services;
        return fakeEvaluator;
      },
    };

    const registry = new PluginRegistry();
    registry.registerAll([statelessPlugin, factoryPlugin]);

    const plan = compileTrackExecutionPlan({
      trackId: "trackX",
      generation: 2,
      keyframes: [
        { s: { plugin: "statelessPlugin", values: {} } },
        { f: { plugin: "factoryPlugin", values: {} } },
      ],
      registry,
    });

    const sEntry = plan.entries[0]!;
    const fEntry = plan.entries[1]!;

    expect(sEntry.execution.kind).toBe("stateless");
    expect(fEntry.execution.kind).toBe("factory");
    expect(assertExecutionStrategy(sEntry.execution)).toBe("stateless");
    expect(assertExecutionStrategy(fEntry.execution)).toBe("factory");

    // Propagation of services to factory without provider-name branches
    const customServices: EvaluatorServices = {
      cache: { provider: "generic-in-memory" },
      customClock: "mockClock",
    };

    const evaluator = createEntryEvaluator(fEntry, customServices);
    expect(evaluator).toBe(fakeEvaluator);
    expect(factoryCallCount).toBe(1);
    expect(receivedServices).toBe(customServices);
    expect(receivedContext?.trackId).toBe("trackX");
    expect(receivedContext?.entryId).toBe("f");
    expect(receivedContext?.generation).toBe(2);
    expect(receivedContext?.plugin).toBe("factoryPlugin");

    // Calling createEntryEvaluator on stateless entry throws
    expect(() => createEntryEvaluator(sEntry, customServices)).toThrow(
      /Entry "s" does not declare a factory execution strategy/,
    );
  });

  it("refuses mixed execution definitions (factory + run callback) and incomplete definitions", () => {
    expect(() =>
      new PluginRegistry().register({
        name: "mixedPlugin",
        collect: {
          output: "points",
          run: () => ({}),
        },
        createEvaluator: () => ({
          prepare: (_l, s) => ({ prepared: {}, proposedState: s }),
        }),
      }),
    ).toThrow(/cannot declare both createEvaluator and operation run callbacks/);

    const incompletePlugin: PluginDefinition = {
      name: "incompletePlugin",
      collect: { output: "points" },
    };

    const registry = new PluginRegistry();
    // Admitted as shape, but compilation rejects incomplete execution strategy
    registry.register(incompletePlugin);

    expect(() =>
      compileTrackExecutionPlan({
        keyframes: [{ e: { plugin: "incompletePlugin", values: {} } }],
        registry,
      }),
    ).toThrow(/declares collect operation without run callback or evaluator factory/);
  });

  it("supports distinct generation context for two separate entries", () => {
    const factoryPlugin: PluginDefinition = {
      name: "factoryPlugin",
      collect: { output: "out" },
      createEvaluator: (ctx) => ({
        prepare: () => ({ prepared: ctx, proposedState: ctx.compilerKey }),
      }),
    };

    const registry = new PluginRegistry();
    registry.register(factoryPlugin);

    const plan = compileTrackExecutionPlan({
      generation: 5,
      keyframes: [
        { e1: { plugin: "factoryPlugin", values: {} } },
        { e2: { plugin: "factoryPlugin", values: {} } },
      ],
      registry,
    });

    const [p1, p2] = plan.entries as [CompiledEntryPlan, CompiledEntryPlan];
    expect(p1.lifecycle.generation).toBe(5);
    expect(p2.lifecycle.generation).toBe(5);
    expect(p1.lifecycle.entryId).toBe("e1");
    expect(p2.lifecycle.entryId).toBe("e2");
    expect(p1.lifecycle.compilerKey).not.toBe(p2.lifecycle.compilerKey);
  });

  it("supports noncommutative fold definitions and preserves execution plan order", () => {
    // Noncommutative fold: string concatenation where order matters: A + B != B + A
    const appendFoldPlugin: PluginDefinition = {
      name: "appendFold",
      keys: ["word"],
      fold: {
        outputs: ["log"],
        run: (entry, state) => {
          const prev = (state as Record<string, string>)?.log ?? "";
          const added = (entry as Record<string, string>)?.word ?? "";
          return { log: prev + added };
        },
      },
    };

    const registry = new PluginRegistry();
    registry.register(appendFoldPlugin);

    const planOrder1 = compileTrackExecutionPlan({
      keyframes: [
        { first: { plugin: "appendFold", values: { word: "A" } } },
        { second: { plugin: "appendFold", values: { word: "B" } } },
      ],
      registry,
    });

    expect(planOrder1.entries[0]?.entryId).toBe("first");
    expect(planOrder1.entries[1]?.entryId).toBe("second");

    // Simulating fold execution in plan order for B6
    let state1: Record<string, unknown> = {};
    for (const ep of planOrder1.entries) {
      if (ep.execution.kind === "stateless" && ep.execution.fold) {
        state1 = { ...state1, ...ep.execution.fold(ep.schema.values, state1) };
      }
    }
    expect(state1.log).toBe("AB");

    // Reversed order
    const planOrder2 = compileTrackExecutionPlan({
      keyframes: [
        { second: { plugin: "appendFold", values: { word: "B" } } },
        { first: { plugin: "appendFold", values: { word: "A" } } },
      ],
      registry,
    });

    let state2: Record<string, unknown> = {};
    for (const ep of planOrder2.entries) {
      if (ep.execution.kind === "stateless" && ep.execution.fold) {
        state2 = { ...state2, ...ep.execution.fold(ep.schema.values, state2) };
      }
    }
    expect(state2.log).toBe("BA");
    expect(state1.log).not.toBe(state2.log);
  });

  it("produces an immutable frozen execution plan", () => {
    const plugin: PluginDefinition = {
      name: "simple",
      collect: { output: "pts", run: () => ({}) },
    };

    const registry = new PluginRegistry();
    registry.register(plugin);

    const plan = compileTrackExecutionPlan({
      keyframes: [{ e: { plugin: "simple", values: {} } }],
      registry,
    });

    expect(Object.isFrozen(plan)).toBe(true);
    expect(Object.isFrozen(plan.entries)).toBe(true);
    expect(Object.isFrozen(plan.entries[0])).toBe(true);
    expect(Object.isFrozen(plan.collectOutputs)).toBe(true);
    expect(Object.isFrozen(plan.foldOutputs)).toBe(true);
    expect(Object.isFrozen(plan.publishedOutputs)).toBe(true);
    expect(Object.isFrozen(plan.diagnostics)).toBe(true);
  });

  it("compiles an empty track plan cleanly", () => {
    const registry = new PluginRegistry();
    const plan = compileTrackExecutionPlan({
      keyframes: [],
      registry,
    });

    expect(plan.entries).toEqual([]);
    expect(plan.collectOutputs).toEqual([]);
    expect(plan.foldOutputs).toEqual([]);
    expect(plan.publishedOutputs).toEqual([]);
    expect(plan.diagnostics).toEqual([]);
  });
});
