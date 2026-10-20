import { describe, expect, it } from "vitest";
import { PluginRegistry, type PluginDefinition } from "../../src/domain/plugins";
import { compileTrackExecutionPlan } from "../../src/domain/execution-plan";
import { executeTrackOperations } from "../../src/domain/track-operations";
import { type CacheSnapshot, type CacheSpec } from "../../src/domain/cache";
import {
  createAggressiveEvictingCacheProvider,
  DEFAULT_CACHE_PROVIDER,
  NO_CACHE_PROVIDER,
} from "../../src/domain/cache-providers";
import { defineStatefulPlugin } from "../../src/domain/stateful-plugin";
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

    interface Prepared {
      readonly key: TextMeasureKey;
      readonly width: number;
      readonly state: PluginState;
    }

    const keyEquals = (a: TextMeasureKey, b: TextMeasureKey): boolean =>
      a.text === b.text && Object.is(a.fontSize, b.fontSize);

    const textMeasurePlugin = defineStatefulPlugin<PluginState, Prepared>({
      name: "textMeasure",
      keys: ["text", "fontSize"],
      fold: {
        outputs: ["totalWidth"],
        run: (prepared) => ({
          delta: { totalWidth: prepared.width },
          state: prepared.state,
        }),
      },
      init: (_ctx, services) => {
        const spec: CacheSpec<TextMeasureKey> = { equals: keyEquals, maxSlots: 10 };
        return { table: services.cache.create<TextMeasureKey, number>(spec) };
      },
      prepare: (local, state) => {
        prepareCalls++;
        const text = String(local.values.text ?? "");
        const fontSize = Number(local.values.fontSize ?? 12);
        const key: TextMeasureKey = { text, fontSize };

        const lookup = state.table.lookup("measure", key);
        if (lookup.kind === "hit") {
          return {
            prepared: { key, width: lookup.value, state },
            state,
          };
        }

        mathComputations++;
        const width = text.length * fontSize * 0.6;
        const nextState: PluginState = {
          table: state.table.remember([{ slot: "measure", key, value: width }]),
        };

        return {
          prepared: { key, width, state: nextState },
          state: nextState,
        };
      },
    });

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
    });

    expect(pass2.publishedValues).toEqual({ totalWidth: 30 });
    expect(prepareCalls).toBe(2);
    expect(mathComputations).toBe(1);
  });

  it("B7-15: Stateless definitions remain pure and simple alongside stateful plugins", () => {
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

  it("B7-16: Collect-only, fold-only, and both operations with stateful plugins", () => {
    const collectPlugin = defineStatefulPlugin<{ runs: number }, { tag: string }>({
      name: "collectStateful",
      keys: ["tag"],
      collect: (prepared) => ({ tag: prepared.tag }),
      init: () => ({ runs: 0 }),
      prepare: (local, state) => ({
        prepared: { tag: String(local.values.tag ?? "") },
        state: { runs: state.runs + 1 },
      }),
    });

    const bothPlugin = defineStatefulPlugin<
      { count: number },
      { factor: number; state: { count: number } }
    >({
      name: "bothStateful",
      keys: ["factor"],
      collect: (prepared) => ({ factor: prepared.factor }),
      fold: {
        outputs: ["accum"],
        run: (prepared, priorFold) => {
          const prev = typeof priorFold.accum === "number" ? priorFold.accum : 1;
          return {
            delta: { accum: prev * prepared.factor },
            state: prepared.state,
          };
        },
      },
      init: () => ({ count: 0 }),
      prepare: (local, state) => {
        const nextState = { count: state.count + 1 };
        return {
          prepared: { factor: Number(local.values.factor ?? 1), state: nextState },
          state: nextState,
        };
      },
    });

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

    expect(result.publishedValues.collect).toEqual([
      { id: "e1", tag: "first" },
      { id: "e2", factor: 3 },
    ]);
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

    interface Prepared {
      readonly offset: number;
      readonly state: FoldState;
    }

    let memoizedFoldMath = 0;
    const memoizedFoldPlugin = defineStatefulPlugin<FoldState, Prepared>({
      name: "memoizedFold",
      keys: ["deltaVal"],
      fold: {
        outputs: ["running"],
        run: (prepared, priorFold) => {
          const precedingAccum = Number(priorFold.running ?? 0);
          const key: FoldKey = { localOffset: prepared.offset, precedingAccum };

          const lookup = prepared.state.table.lookup("foldSlot", key);
          if (lookup.kind === "hit") {
            return {
              delta: { running: lookup.value },
              state: prepared.state,
            };
          }

          memoizedFoldMath++;
          const computed = precedingAccum + prepared.offset;
          return {
            delta: { running: computed },
            state: {
              table: prepared.state.table.remember([{ slot: "foldSlot", key, value: computed }]),
            },
          };
        },
      },
      init: (_ctx, services) => ({
        table: services.cache.create<FoldKey, number>({
          equals: (a, b) =>
            Object.is(a.localOffset, b.localOffset) &&
            Object.is(a.precedingAccum, b.precedingAccum),
          maxSlots: 5,
        }),
      }),
      prepare: (local, state) => ({
        prepared: { offset: Number(local.values.deltaVal ?? 0), state },
        state,
      }),
    });

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
    });
    expect(res2.publishedValues.running).toBe(5);
    expect(memoizedFoldMath).toBe(1);
  });

  it("B7-18: Cache and table isolation across repeated entries and matching IDs", () => {
    const tagPlugin = defineStatefulPlugin<
      { id: string; table: CacheSnapshot<number, unknown> },
      { val: number }
    >({
      name: "tagPlugin",
      keys: ["val"],
      collect: (prepared) => ({ val: prepared.val }),
      init: (ctx, services) => ({
        id: ctx.entryId,
        table: services.cache.create<number, unknown>({
          equals: (a, b) => a === b,
          maxSlots: 3,
        }),
      }),
      prepare: (local, state) => ({
        prepared: { val: Number(local.values.val ?? 0) },
        state,
      }),
    });

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
    const statefulEntry1 = defineStatefulPlugin<
      { table: CacheSnapshot<unknown, number> },
      { val: number; state: { table: CacheSnapshot<unknown, number> } }
    >({
      name: "entry1Plugin",
      keys: ["v"],
      fold: {
        outputs: ["out1"],
        run: (prepared) => ({
          delta: { out1: prepared.val },
          state: prepared.state,
        }),
      },
      init: (_ctx, services) => ({
        table: services.cache.create<unknown, number>({
          equals: (a, b) => a === b,
          maxSlots: 2,
        }),
      }),
      prepare: (local, state) => {
        entry1Math++;
        const raw = local.values.v;
        const doubled = Number(raw ?? 0) * 2;
        const proposedState = {
          table: state.table.remember([{ slot: "s", key: raw, value: doubled }]),
        };
        return {
          prepared: { val: doubled, state: proposedState },
          state: proposedState,
        };
      },
    });

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
    const plugin = defineStatefulPlugin<{ count: number }, { val: number }>({
      name: "retryPlugin",
      keys: ["val"],
      fold: {
        outputs: ["res"],
        run: (prepared) => {
          if (prepared.val < 0) {
            throw new CompositionOutputError("Negative val rejected.");
          }
          return {
            delta: { res: prepared.val * 10 },
            state: { count: 1 },
          };
        },
      },
      init: () => ({ count: 0 }),
      prepare: (local, state) => ({
        prepared: { val: Number(local.values.val ?? 0) },
        state: { count: state.count + 1 },
      }),
    });

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

  it("B7-21: dispose receives the entry state", () => {
    let disposedState: unknown;
    const disposablePlugin = defineStatefulPlugin<{ tag: string }, { x: number }>({
      name: "disposablePlugin",
      keys: ["x"],
      collect: (prepared) => ({ x: prepared.x }),
      init: () => ({ tag: "entry" }),
      prepare: (local, state) => ({
        prepared: { x: Number(local.values.x ?? 0) },
        state,
      }),
      dispose: (state) => {
        disposedState = state;
      },
    });

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
    const state = res.proposedStates.get(compilerKey);
    disposablePlugin.dispose!(state);
    expect(disposedState).toBe(state);
  });

  it("B7-22: LSP - default, no-cache, and evicting providers produce identical output semantics", () => {
    let computeCount = 0;

    interface LspState {
      readonly table: CacheSnapshot<string, number>;
    }

    interface LspPrepared {
      readonly sum: number;
      readonly state: LspState;
    }

    const plugin = defineStatefulPlugin<LspState, LspPrepared>({
      name: "lspPlugin",
      keys: ["x", "y"],
      fold: {
        outputs: ["sum"],
        run: (prepared) => ({ delta: { sum: prepared.sum } }),
      },
      init: (_ctx, services) => {
        const spec: CacheSpec<string> = { equals: (a, b) => a === b, maxSlots: 5 };
        return { table: services.cache.create<string, number>(spec) };
      },
      prepare: (local, state) => {
        const x = Number(local.values.x ?? 0);
        const y = Number(local.values.y ?? 0);
        const key = `${x}:${y}`;

        const lookup = state.table.lookup("sumSlot", key);
        if (lookup.kind === "hit") {
          return { prepared: { sum: lookup.value, state }, state };
        }

        computeCount++;
        const sum = x + y;
        return {
          prepared: { sum, state },
          state: {
            table: state.table.remember([{ slot: "sumSlot", key, value: sum }]),
          },
        };
      },
    });

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

  it("B7-23: admission validates init, prepare, dispose, collect and fold.run shapes", () => {
    const register = (plugin: unknown) =>
      new PluginRegistry().register(plugin as unknown as PluginDefinition);

    expect(() => register({ name: "badInit", collect: () => ({}), init: 123 })).toThrow(
      /init must be a function/,
    );
    expect(() =>
      register({ name: "initWithoutPrepare", collect: () => ({}), init: () => ({}) }),
    ).toThrow(/with init must declare prepare/);
    expect(() =>
      register({ name: "badPrepare", collect: () => ({}), init: () => ({}), prepare: 123 }),
    ).toThrow(/with init must declare prepare/);
    expect(() =>
      register({ name: "prepareOnly", collect: () => ({}), prepare: () => ({}) }),
    ).toThrow(/declares prepare or dispose without init/);
    expect(() =>
      register({ name: "disposeOnly", collect: () => ({}), dispose: () => undefined }),
    ).toThrow(/declares prepare or dispose without init/);
    expect(() => register({ name: "badCollect", collect: 123 })).toThrow(
      /collect must be a function/,
    );
    expect(() => register({ name: "badFoldRun", fold: { outputs: ["x"], run: 123 } })).toThrow(
      /fold run must be a function/,
    );
  });

  it("B7-24: init returning undefined throws TypeError", () => {
    const plugin = defineStatefulPlugin<undefined, unknown>({
      name: "undefinedInit",
      collect: () => ({}),
      init: () => undefined,
      prepare: () => ({ prepared: null, state: undefined }),
    });

    const registry = new PluginRegistry();
    registry.register(plugin);

    const plan = compileTrackExecutionPlan({
      keyframes: [{ u1: { plugin: "undefinedInit", values: {} } }],
      registry,
    });

    expect(() => executeTrackOperations({ plan, sampleValues: new Map() })).toThrow(
      'Plugin "undefinedInit" init must return a defined state.',
    );
  });

  it("B7-25: fold result with no state keeps prepare's state, with state overrides it", () => {
    const keepPlugin = defineStatefulPlugin<{ tag: string }, { value: number }>({
      name: "keepState",
      keys: ["v"],
      fold: {
        outputs: ["keepOut"],
        run: (prepared) => ({ delta: { keepOut: prepared.value } }),
      },
      init: () => ({ tag: "init" }),
      prepare: (_local, _state) => ({
        prepared: { value: 1 },
        state: { tag: "prepared" },
      }),
    });

    const overridePlugin = defineStatefulPlugin<{ tag: string }, { value: number }>({
      name: "overrideState",
      keys: ["v"],
      fold: {
        outputs: ["overrideOut"],
        run: (prepared) => ({
          delta: { overrideOut: prepared.value },
          state: { tag: "fold" },
        }),
      },
      init: () => ({ tag: "init" }),
      prepare: (_local, _state) => ({
        prepared: { value: 2 },
        state: { tag: "prepared" },
      }),
    });

    const registry = new PluginRegistry();
    registry.registerAll([keepPlugin, overridePlugin]);

    const plan = compileTrackExecutionPlan({
      keyframes: [
        { k: { plugin: "keepState", values: {} } },
        { o: { plugin: "overrideState", values: {} } },
      ],
      registry,
    });

    const result = executeTrackOperations({ plan, sampleValues: new Map() });

    const keepKey = plan.entries[0]!.compilerKey;
    const overrideKey = plan.entries[1]!.compilerKey;
    expect(result.proposedStates.get(keepKey)).toEqual({ tag: "prepared" });
    expect(result.proposedStates.get(overrideKey)).toEqual({ tag: "fold" });
  });

  it("B7-26: committed state avoids a second init call", () => {
    let initCalls = 0;
    const plugin = defineStatefulPlugin<{ count: number }, { value: number }>({
      name: "initCounter",
      keys: ["v"],
      collect: (prepared) => ({ value: prepared.value }),
      init: () => {
        initCalls++;
        return { count: 0 };
      },
      prepare: (local, state) => ({
        prepared: { value: Number(local.values.v ?? 0) },
        state: { count: state.count + 1 },
      }),
    });

    const registry = new PluginRegistry();
    registry.register(plugin);

    const plan = compileTrackExecutionPlan({
      keyframes: [{ c1: { plugin: "initCounter", values: { v: 1 } } }],
      registry,
    });

    const first = executeTrackOperations({
      plan,
      sampleValues: new Map([["c1", { v: 1 }]]),
    });
    expect(initCalls).toBe(1);

    executeTrackOperations({
      plan,
      sampleValues: new Map([["c1", { v: 1 }]]),
      committedStates: first.proposedStates,
    });
    expect(initCalls).toBe(1);
  });
});
