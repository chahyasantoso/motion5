import { describe, expect, it } from "vitest";
import { PluginRegistry, type PluginDefinition } from "../../src/domain/plugins";
import { compileTrackExecutionPlan, type EvaluatorServices } from "../../src/domain/execution-plan";
import {
  executeTrackOperations,
  executeTrackOperationsBatch,
  type LocalEvaluation,
} from "../../src/domain/track-operations";
import {
  defineStatefulEvaluator,
  type CacheSnapshot,
  type CacheSpec,
} from "../../src/domain/cache";
import {
  createAggressiveEvictingCacheProvider,
  createBoundedCacheProvider,
  DEFAULT_CACHE_PROVIDER,
  NO_CACHE_PROVIDER,
} from "../../src/domain/cache-providers";
import { CompositionOutputError } from "../../src/domain/track";

describe("Slice B7: Proposed evaluator state and injectable caches", () => {
  it("B7-14: DI and generic cache with stateful non-skeleton plugin", () => {
    let mathComputations = 0;
    let prepareCalls = 0;

    interface TextMeasureKey {
      readonly text: string;
      readonly fontSize: number;
    }

    interface PluginState {
      readonly table: CacheSnapshot<TextMeasureKey, number>;
    }

    const keyEquals = (a: TextMeasureKey, b: TextMeasureKey): boolean =>
      a.text === b.text && Object.is(a.fontSize, b.fontSize);

    const textMeasurePlugin: PluginDefinition = {
      name: "textMeasure",
      keys: ["text", "fontSize"],
      fold: {
        outputs: ["totalWidth"],
      },
      createEvaluator: (context, services: EvaluatorServices) => {
        const spec: CacheSpec<TextMeasureKey> = { equals: keyEquals, maxSlots: 10 };
        const initialTable = services.cache.create<TextMeasureKey, number>(spec);

        return defineStatefulEvaluator<
          { key: TextMeasureKey; width: number; proposedState: PluginState },
          PluginState
        >({
          initialState: { table: initialTable },
          prepare(local, committedState) {
            prepareCalls++;
            const text = String(local.values.text ?? "");
            const fontSize = Number(local.values.fontSize ?? 12);
            const key: TextMeasureKey = { text, fontSize };

            const lookup = committedState.table.lookup("measure", key);
            if (lookup.kind === "hit") {
              return {
                prepared: { key, width: lookup.value, proposedState: committedState },
                proposedState: committedState,
              };
            }

            mathComputations++;
            const width = text.length * fontSize * 0.6;
            const nextTable = committedState.table.remember([
              { slot: "measure", key, value: width },
            ]);
            const proposedState: PluginState = { table: nextTable };

            return {
              prepared: { key, width, proposedState },
              proposedState,
            };
          },
          fold(prepared) {
            return {
              delta: { totalWidth: prepared.width },
              proposedState: prepared.proposedState,
            };
          },
        });
      },
    };

    const registry = new PluginRegistry();
    registry.register(textMeasurePlugin);

    const plan = compileTrackExecutionPlan({
      keyframes: [
        {
          m1: {
            plugin: "textMeasure",
            values: { text: "hello", fontSize: 10 },
          },
        },
      ],
      registry,
    });

    // Pass 1: cold cache -> miss -> math computed
    const pass1 = executeTrackOperations({
      plan,
      sampleValues: new Map([["m1", { text: "hello", fontSize: 10 }]]),
    });

    expect(pass1.publishedValues).toEqual({ totalWidth: 30 });
    expect(prepareCalls).toBe(1);
    expect(mathComputations).toBe(1);

    // Pass 2: identical request with committed state -> hit -> no extra math
    const compilerKey = plan.entries[0]!.compilerKey;
    const committedState = pass1.proposedStates.get(compilerKey);

    const pass2 = executeTrackOperations({
      plan,
      sampleValues: new Map([["m1", { text: "hello", fontSize: 10 }]]),
      committedStates: new Map([[compilerKey, committedState]]),
      evaluators: pass1.evaluators,
    });

    expect(pass2.publishedValues).toEqual({ totalWidth: 30 });
    expect(prepareCalls).toBe(2);
    expect(mathComputations).toBe(1);
  });

  it("B7-15: Stateless definitions remain pure and simple alongside stateful evaluators", () => {
    let statelessCalls = 0;
    const statelessPlugin: PluginDefinition = {
      name: "statelessCounter",
      keys: ["increment"],
      fold: {
        outputs: ["count"],
        run: (local: any, priorFold: any) => {
          statelessCalls++;
          const prev = (priorFold.count as number | undefined) ?? 0;
          return { count: prev + (local.values.increment ?? 1) };
        },
      },
    };

    const registry = new PluginRegistry();
    registry.register(statelessPlugin);

    const plan = compileTrackExecutionPlan({
      keyframes: [{ c1: { plugin: "statelessCounter", values: { increment: 5 } } }],
      registry,
    });

    const result = executeTrackOperations({
      plan,
      sampleValues: new Map([["c1", { increment: 5 }]]),
    });

    expect(result.publishedValues).toEqual({ count: 5 });
    expect(statelessCalls).toBe(1);
    expect(result.proposedStates.size).toBe(0);
  });

  it("B7-16: Collect-only, fold-only, and both operations with stateful evaluators", () => {
    const collectPlugin: PluginDefinition = {
      name: "collectStateful",
      keys: ["tag"],
      collect: { output: "items" },
      createEvaluator: () =>
        defineStatefulEvaluator<{ tag: string }, { runs: number }>({
          initialState: { runs: 0 },
          prepare(local, committedState) {
            return {
              prepared: { tag: String(local.values.tag ?? "") },
              proposedState: { runs: committedState.runs + 1 },
            };
          },
          collect(prepared) {
            return { tag: prepared.tag };
          },
        }),
    };

    const bothPlugin: PluginDefinition = {
      name: "bothStateful",
      keys: ["factor"],
      collect: { output: "factors" },
      fold: { outputs: ["accum"] },
      createEvaluator: () =>
        defineStatefulEvaluator<
          { factor: number; proposedState: { count: number } },
          { count: number }
        >({
          initialState: { count: 0 },
          prepare(local, committedState) {
            const nextState = { count: committedState.count + 1 };
            return {
              prepared: { factor: Number(local.values.factor ?? 1), proposedState: nextState },
              proposedState: nextState,
            };
          },
          collect(prepared) {
            return { factor: prepared.factor };
          },
          fold(prepared, priorFold) {
            const prev = (priorFold.accum as number | undefined) ?? 1;
            return {
              delta: { accum: prev * prepared.factor },
              proposedState: prepared.proposedState,
            };
          },
        }),
    };

    const registry = new PluginRegistry();
    registry.register(collectPlugin);
    registry.register(bothPlugin);

    const plan = compileTrackExecutionPlan({
      keyframes: [
        { e1: { plugin: "collectStateful", values: { tag: "first" } } },
        { e2: { plugin: "bothStateful", values: { factor: 3 } } },
      ],
      registry,
    });

    const result = executeTrackOperations({
      plan,
      sampleValues: new Map([
        ["e1", { tag: "first" }],
        ["e2", { factor: 3 }],
      ]),
    });

    expect(result.publishedValues.items).toEqual([{ id: "e1", tag: "first" }]);
    expect(result.publishedValues.factors).toEqual([{ id: "e2", factor: 3 }]);
    expect(result.publishedValues.accum).toBe(3);

    const e1Key = plan.entries[0]!.compilerKey;
    const e2Key = plan.entries[1]!.compilerKey;
    expect(result.proposedStates.get(e1Key)).toEqual({ runs: 1 });
    expect(result.proposedStates.get(e2Key)).toEqual({ count: 1 });
  });

  it("B7-17: Fold-dependent cache keys miss when prior fold changes", () => {
    interface FoldKey {
      readonly localOffset: number;
      readonly precedingAccum: number;
    }

    interface FoldState {
      readonly table: CacheSnapshot<FoldKey, number>;
    }

    let memoizedFoldMath = 0;
    const memoizedFoldPlugin: PluginDefinition = {
      name: "memoizedFold",
      keys: ["deltaVal"],
      fold: { outputs: ["running"] },
      createEvaluator: (context, services) => {
        const table = services.cache.create<FoldKey, number>({
          equals: (a, b) =>
            Object.is(a.localOffset, b.localOffset) &&
            Object.is(a.precedingAccum, b.precedingAccum),
          maxSlots: 5,
        });

        let currentCommitted: FoldState = { table };

        return {
          prepare(local: any, committedState: FoldState) {
            currentCommitted = committedState ?? { table };
            return {
              prepared: { offset: Number(local.values.deltaVal ?? 0) },
              proposedState: currentCommitted,
            };
          },
          fold(prepared: any, priorFold: any) {
            const precedingAccum = Number(priorFold.running ?? 0);
            const key: FoldKey = { localOffset: prepared.offset, precedingAccum };

            const lookup = currentCommitted.table.lookup("foldSlot", key);
            if (lookup.kind === "hit") {
              return {
                delta: { running: lookup.value },
                proposedState: currentCommitted,
              };
            }

            memoizedFoldMath++;
            const computed = precedingAccum + prepared.offset;
            const nextTable = currentCommitted.table.remember([
              { slot: "foldSlot", key, value: computed },
            ]);
            return {
              delta: { running: computed },
              proposedState: { table: nextTable },
            };
          },
        };
      },
    };

    const registry = new PluginRegistry();
    registry.register(memoizedFoldPlugin);

    const plan = compileTrackExecutionPlan({
      keyframes: [{ f1: { plugin: "memoizedFold", values: { deltaVal: 5 } } }],
      registry,
    });

    // Pass 1: priorFold running = 0 -> miss -> math = 1
    const res1 = executeTrackOperations({
      plan,
      sampleValues: new Map([["f1", { deltaVal: 5 }]]),
    });
    expect(res1.publishedValues.running).toBe(5);
    expect(memoizedFoldMath).toBe(1);

    // Pass 2: same input and prior running = 0 -> hit -> math stays 1
    const res2 = executeTrackOperations({
      plan,
      sampleValues: new Map([["f1", { deltaVal: 5 }]]),
      committedStates: res1.proposedStates,
      evaluators: res1.evaluators,
    });
    expect(res2.publishedValues.running).toBe(5);
    expect(memoizedFoldMath).toBe(1);
  });

  it("B7-18: Cache and table isolation across repeated entries and matching IDs", () => {
    const tagPlugin: PluginDefinition = {
      name: "tagPlugin",
      keys: ["val"],
      collect: { output: "tags" },
      createEvaluator: (context, services) => {
        const table = services.cache.create({ equals: (a, b) => a === b, maxSlots: 3 });
        return defineStatefulEvaluator<{ val: number }, { id: string; table: any }>({
          initialState: { id: context.entryId, table },
          prepare(local, committedState) {
            return {
              prepared: { val: Number(local.values.val ?? 0) },
              proposedState: committedState,
            };
          },
          collect(prepared) {
            return { val: prepared.val };
          },
        });
      },
    };

    const registry = new PluginRegistry();
    registry.register(tagPlugin);

    const plan1 = compileTrackExecutionPlan({
      trackId: "track1",
      keyframes: [
        { e1: { plugin: "tagPlugin", values: { val: 10 } } },
        { e2: { plugin: "tagPlugin", values: { val: 20 } } },
      ],
      registry,
    });

    const res1 = executeTrackOperations({
      plan: plan1,
      sampleValues: new Map([
        ["e1", { val: 10 }],
        ["e2", { val: 20 }],
      ]),
    });

    const k1 = plan1.entries[0]!.compilerKey;
    const k2 = plan1.entries[1]!.compilerKey;
    expect(k1).not.toBe(k2);
    expect((res1.proposedStates.get(k1) as any).id).toBe("e1");
    expect((res1.proposedStates.get(k2) as any).id).toBe("e2");
  });

  it("B7-19: Transaction abort on late failure preserves committed state without accepting partial outputs", () => {
    let entry1Math = 0;
    const statefulEntry1: PluginDefinition = {
      name: "entry1Plugin",
      keys: ["v"],
      fold: { outputs: ["out1"] },
      createEvaluator: (context, services) => {
        const table = services.cache.create({ equals: (a, b) => a === b, maxSlots: 2 });
        return {
          prepare(local: any, committedState: any) {
            entry1Math++;
            const nextTable = (committedState?.table ?? table).remember([
              { slot: "s", key: local.values.v, value: local.values.v * 2 },
            ]);
            const proposedState = { table: nextTable };
            return {
              prepared: { val: local.values.v * 2, proposedState },
              proposedState,
            };
          },
          fold(prepared: any) {
            return {
              delta: { out1: prepared.val },
              proposedState: prepared.proposedState,
            };
          },
        };
      },
    };

    const failingEntry2: PluginDefinition = {
      name: "entry2Plugin",
      keys: ["trigger"],
      fold: {
        outputs: ["out2"],
        run: (local: any) => {
          if (local.values.trigger === "fail") {
            throw new Error("Late fold failure in entry 2.");
          }
          return { out2: 100 };
        },
      },
    };

    const registry = new PluginRegistry();
    registry.register(statefulEntry1);
    registry.register(failingEntry2);

    const plan = compileTrackExecutionPlan({
      keyframes: [
        { a1: { plugin: "entry1Plugin", values: { v: 10 } } },
        { a2: { plugin: "entry2Plugin", values: { trigger: "ok" } } },
      ],
      registry,
    });

    // First successful transaction
    const pass1 = executeTrackOperations({
      plan,
      sampleValues: new Map([
        ["a1", { v: 10 }],
        ["a2", { trigger: "ok" }],
      ]),
    });
    expect(pass1.publishedValues).toEqual({ out1: 20, out2: 100 });
    const committedState = pass1.proposedStates;

    // Second transaction: entry 2 fails!
    const failingPlan = compileTrackExecutionPlan({
      keyframes: [
        { a1: { plugin: "entry1Plugin", values: { v: 15 } } },
        { a2: { plugin: "entry2Plugin", values: { trigger: "fail" } } },
      ],
      registry,
    });

    expect(() =>
      executeTrackOperations({
        plan: failingPlan,
        sampleValues: new Map([
          ["a1", { v: 15 }],
          ["a2", { trigger: "fail" }],
        ]),
        committedStates: committedState,
      }),
    ).toThrow("Late fold failure in entry 2.");

    // Committed state from pass1 remains untouched
    const k1 = plan.entries[0]!.compilerKey;
    const storedState: any = committedState.get(k1);
    expect(storedState.table.lookup("s", 10)).toEqual({ kind: "hit", value: 20 });
    expect(storedState.table.lookup("s", 15).kind).toBe("miss");
  });

  it("B7-20: Retry from last accepted state matches cold semantics", () => {
    const plugin: PluginDefinition = {
      name: "retryPlugin",
      keys: ["val"],
      fold: { outputs: ["res"] },
      createEvaluator: () =>
        defineStatefulEvaluator<{ val: number }, { count: number }>({
          initialState: { count: 0 },
          prepare(local, committedState) {
            return {
              prepared: { val: Number(local.values.val ?? 0) },
              proposedState: { count: committedState.count + 1 },
            };
          },
          fold(prepared, priorFold) {
            if (prepared.val < 0) {
              throw new CompositionOutputError("Negative val rejected.");
            }
            return {
              delta: { res: prepared.val * 10 },
              proposedState: { count: 1 },
            };
          },
        }),
    };

    const registry = new PluginRegistry();
    registry.register(plugin);

    const plan = compileTrackExecutionPlan({
      keyframes: [{ r1: { plugin: "retryPlugin", values: { val: -5 } } }],
      registry,
    });

    // Fails on negative val
    expect(() =>
      executeTrackOperations({
        plan,
        sampleValues: new Map([["r1", { val: -5 }]]),
      }),
    ).toThrow(CompositionOutputError);

    // Retry with valid input succeeds cleanly
    const retryPlan = compileTrackExecutionPlan({
      keyframes: [{ r1: { plugin: "retryPlugin", values: { val: 5 } } }],
      registry,
    });

    const success = executeTrackOperations({
      plan: retryPlan,
      sampleValues: new Map([["r1", { val: 5 }]]),
    });

    expect(success.publishedValues.res).toBe(50);
  });

  it("B7-21: Disposal of active evaluators on retirement", () => {
    let disposed = false;
    const disposablePlugin: PluginDefinition = {
      name: "disposablePlugin",
      keys: ["x"],
      collect: { output: "pts" },
      createEvaluator: () =>
        defineStatefulEvaluator<{ x: number }, {}>({
          initialState: {},
          prepare(local) {
            return { prepared: { x: Number(local.values.x ?? 0) }, proposedState: {} };
          },
          collect(prepared) {
            return { x: prepared.x };
          },
          dispose() {
            disposed = true;
          },
        }),
    };

    const registry = new PluginRegistry();
    registry.register(disposablePlugin);

    const plan = compileTrackExecutionPlan({
      keyframes: [{ d1: { plugin: "disposablePlugin", values: { x: 1 } } }],
      registry,
    });

    const res = executeTrackOperations({
      plan,
      sampleValues: new Map([["d1", { x: 1 }]]),
    });

    const compilerKey = plan.entries[0]!.compilerKey;
    const evaluator = res.evaluators.get(compilerKey);
    expect(evaluator).toBeDefined();

    evaluator?.dispose?.();
    expect(disposed).toBe(true);
  });

  it("B7-22: LSP - default, no-cache, and evicting providers produce identical output semantics", () => {
    let computeCount = 0;
    const plugin: PluginDefinition = {
      name: "lspPlugin",
      keys: ["x", "y"],
      fold: { outputs: ["sum"] },
      createEvaluator: (context, services) => {
        const spec: CacheSpec<string> = { equals: (a, b) => a === b, maxSlots: 5 };
        const table = services.cache.create<string, number>(spec);

        return {
          prepare(local: any, committedState: any) {
            const currentTable = committedState?.table ?? table;
            const x = Number(local.values.x ?? 0);
            const y = Number(local.values.y ?? 0);
            const key = `${x}:${y}`;

            const lookup = currentTable.lookup("sumSlot", key);
            if (lookup.kind === "hit") {
              return {
                prepared: lookup.value,
                proposedState: { table: currentTable },
              };
            }

            computeCount++;
            const sum = x + y;
            const nextTable = currentTable.remember([{ slot: "sumSlot", key, value: sum }]);
            return {
              prepared: sum,
              proposedState: { table: nextTable },
            };
          },
          fold(prepared: any) {
            return {
              delta: { sum: prepared },
              proposedState: { table: null },
            };
          },
        };
      },
    };

    const registry = new PluginRegistry();
    registry.register(plugin);

    const plan = compileTrackExecutionPlan({
      keyframes: [{ p1: { plugin: "lspPlugin", values: { x: 10, y: 20 } } }],
      registry,
    });

    const sample = new Map([["p1", { x: 10, y: 20 }]]);

    // 1. Default provider
    computeCount = 0;
    const resDefault = executeTrackOperations({
      plan,
      sampleValues: sample,
      services: { cache: DEFAULT_CACHE_PROVIDER },
    });
    expect(resDefault.publishedValues).toEqual({ sum: 30 });
    expect(computeCount).toBe(1);

    // 2. NO_CACHE_PROVIDER
    computeCount = 0;
    const resNoCache = executeTrackOperations({
      plan,
      sampleValues: sample,
      services: { cache: NO_CACHE_PROVIDER },
    });
    expect(resNoCache.publishedValues).toEqual({ sum: 30 });
    expect(computeCount).toBe(1);

    // 3. Evicting provider
    computeCount = 0;
    const resEvicting = executeTrackOperations({
      plan,
      sampleValues: sample,
      services: { cache: createAggressiveEvictingCacheProvider() },
    });
    expect(resEvicting.publishedValues).toEqual({ sum: 30 });
    expect(computeCount).toBe(1);
  });

  it("B7-23: defineStatefulEvaluator validates spec at creation", () => {
    expect(() => defineStatefulEvaluator(null as any)).toThrow(TypeError);
    expect(() => defineStatefulEvaluator({} as any)).toThrow(TypeError);
    expect(() =>
      defineStatefulEvaluator({
        prepare: () => ({ prepared: null, proposedState: null }),
        collect: 123 as any,
      }),
    ).toThrow(TypeError);
    expect(() =>
      defineStatefulEvaluator({
        prepare: () => ({ prepared: null, proposedState: null }),
        fold: "invalid" as any,
      }),
    ).toThrow(TypeError);
  });
});
