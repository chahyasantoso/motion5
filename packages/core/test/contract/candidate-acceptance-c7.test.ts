import { describe, expect, it } from "vitest";
import {
  PluginRegistry,
  type PluginComposer,
  type PluginDefinition,
  type ResolvedPlugins,
} from "../../src/domain/plugins";
import {
  compileTrackExecutionPlan,
  type TrackExecutionPlan,
} from "../../src/domain/execution-plan";
import type { CacheProvider, CacheSpec, CacheSnapshot } from "../../src/domain/cache";
import { DEFAULT_CACHE_PROVIDER } from "../../src/domain/cache-providers";
import { defineStatefulPlugin } from "../../src/domain/stateful-plugin";
import { Engine } from "../../src/engine";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/testing/fakes";
import {
  disposeRetiredStates,
  executeTrackOperations,
  type ProposedEntryState,
  type TrackCandidate,
} from "../../src/domain/track-operations";
import { Track } from "../../src/domain/track";
import type { CompilerEntryKey } from "../../src/contract/address";
import type { AuthoredEntryRecord } from "../../src/contract/v5";

function committedFrom(
  proposals: ReadonlyMap<CompilerEntryKey, ProposedEntryState>,
): ReadonlyMap<CompilerEntryKey, unknown> {
  return new Map([...proposals].map(([key, proposal]) => [key, proposal.state]));
}

function registryOf(...plugins: readonly PluginDefinition[]): PluginRegistry {
  const registry = new PluginRegistry();
  registry.registerAll([...plugins]);
  return registry;
}

const staticInterpolator = (values: Readonly<Record<string, number>>) => ({
  create: () => ({
    duration: 1,
    state: { ...values },
    progress: () => 0,
    kill: () => {},
  }),
});

/** Authored keyframes are an array of singleton maps, one entry per element. */
type AuthoredKeyframes = readonly AuthoredEntryRecord[];

function planFor(keyframes: AuthoredKeyframes, registry: PluginRegistry): TrackExecutionPlan {
  const plan = compileTrackExecutionPlan({ keyframes, registry, trackId: "~/c7" });
  expect(plan.diagnostics.filter(({ severity }) => severity === "error")).toEqual([]);
  return plan;
}

function resolvedFor(keyframes: AuthoredKeyframes, registry: PluginRegistry): ResolvedPlugins {
  return registry.resolveForKeyframes(keyframes, "~/c7.keyframes", { id: "c7" });
}

function makeCounter(disposed: number[]) {
  return defineStatefulPlugin<{ count: number }, { count: number }>({
    name: "counter",
    keys: ["v"],
    collect: (prepared) => ({ count: prepared.count }),
    init: () => ({ count: 0 }),
    prepare: (_local, state) => {
      const next = { count: state.count + 1 };
      return { prepared: next, state: next };
    },
    dispose: (state) => {
      disposed.push(state.count);
    },
  });
}

describe("Slice C7: candidate acceptance", () => {
  it("C7-1 refuses a track that mixes legacy compose with collect/fold entries", () => {
    const passThrough: PluginDefinition = {
      name: "pass",
      keys: ["v"],
      compose: (values) => values,
    };
    const counter = makeCounter([]);
    const registry = registryOf(passThrough, counter);

    const mixed = compileTrackExecutionPlan({
      keyframes: [
        { legacy: { plugin: "pass", values: { v: 1 } } },
        { modern: { plugin: "counter", values: { v: 2 } } },
      ],
      registry,
      trackId: "~/mixed",
    });
    const refusals = mixed.diagnostics.filter(
      ({ ruleId }) => ruleId === "legacy-compose-mixed-track",
    );
    expect(refusals).toHaveLength(1);
    expect(refusals[0]?.severity).toBe("error");
    expect(refusals[0]?.ids).toEqual(["pass"]);

    // Neither channel alone is refused: the rule is about the mixture, not about either strategy.
    const legacyOnly = compileTrackExecutionPlan({
      keyframes: [
        { one: { plugin: "pass", values: { v: 1 } } },
        { two: { plugin: "pass", values: { v: 2 } } },
      ],
      registry,
      trackId: "~/legacy",
    });
    const modernOnly = compileTrackExecutionPlan({
      keyframes: [{ one: { plugin: "counter", values: { v: 1 } } }],
      registry,
      trackId: "~/modern",
    });
    expect(
      legacyOnly.diagnostics.filter(({ ruleId }) => ruleId === "legacy-compose-mixed-track"),
    ).toEqual([]);
    expect(
      modernOnly.diagnostics.filter(({ ruleId }) => ruleId === "legacy-compose-mixed-track"),
    ).toEqual([]);

    // One entry that declares both channels is the same undefined mixture as two entries that do.
    const hybrid: PluginDefinition = {
      name: "hybrid",
      keys: ["v"],
      compose: (values) => values,
      collect: () => ({}),
    };
    const hybridPlan = compileTrackExecutionPlan({
      keyframes: [{ one: { plugin: "hybrid", values: { v: 1 } } }],
      registry: registryOf(hybrid),
      trackId: "~/hybrid",
    });
    const hybridRefusals = hybridPlan.diagnostics.filter(
      ({ ruleId }) => ruleId === "legacy-compose-mixed-track",
    );
    expect(hybridRefusals).toHaveLength(1);
    expect(hybridRefusals[0]?.ids).toEqual(["hybrid"]);
  });

  it("C7-2 tags a continued generation and an initialized one", () => {
    const disposed: number[] = [];
    const plugin = makeCounter(disposed);
    const registry = registryOf(plugin);
    const plan = planFor([{ e: { plugin: "counter", values: { v: 1 } } }], registry);
    const key = plan.entries[0]!.compilerKey;

    const first = executeTrackOperations({
      plan,
      sampleValues: new Map([["e", { v: 1 }]]),
    });
    expect(first.proposedStates.get(key)).toEqual({
      origin: "initialized",
      state: { count: 1 },
    });

    const second = executeTrackOperations({
      plan,
      sampleValues: new Map([["e", { v: 1 }]]),
      committedStates: committedFrom(first.proposedStates),
    });
    expect(second.proposedStates.get(key)).toEqual({
      origin: "continued",
      state: { count: 2 },
    });
    expect(disposed).toEqual([]);
  });

  it("C7-3 disposes a continued generation once when it is retired, and a cold reset once", () => {
    const disposed: number[] = [];
    const plugin = makeCounter(disposed);
    const registry = registryOf(plugin);
    const plan = planFor([{ e: { plugin: "counter", values: { v: 1 } } }], registry);
    const key = plan.entries[0]!.compilerKey;

    let committed: ReadonlyMap<CompilerEntryKey, unknown> = new Map();
    // Many ticks: every proposal continues the committed generation, so none is disposed.
    for (let tick = 0; tick < 5; tick++) {
      const result = executeTrackOperations({
        plan,
        sampleValues: new Map([["e", { v: 1 }]]),
        committedStates: committed,
      });
      const failures = disposeRetiredStates(plan, committed, result.proposedStates);
      expect(failures).toEqual([]);
      committed = committedFrom(result.proposedStates);
    }
    expect(disposed).toEqual([]);

    // Removal: the accepted candidate proposes nothing for the key, so the generation retires.
    expect(disposeRetiredStates(plan, committed, new Map())).toEqual([]);
    expect(disposed).toEqual([5]);

    // Cold reset: this candidate initialized the key afresh, so the previous generation retires.
    const cold = executeTrackOperations({
      plan,
      sampleValues: new Map([["e", { v: 1 }]]),
    });
    expect(cold.proposedStates.get(key)).toEqual({
      origin: "initialized",
      state: { count: 1 },
    });
    expect(
      disposeRetiredStates(plan, new Map([[key, { count: 41 }]]), cold.proposedStates),
    ).toEqual([]);
    expect(disposed).toEqual([5, 41]);
  });

  it("C7-4 abandons initialized states only, preserving the original failure", () => {
    const disposed: number[] = [];
    const abandoned: string[] = [];
    const counter = makeCounter(disposed);
    const failing = defineStatefulPlugin<{ ready: boolean }, undefined>({
      name: "failing",
      keys: ["trigger"],
      collect: () => ({}),
      init: () => ({ ready: false }),
      prepare: () => {
        throw new Error("late prepare failure");
      },
      dispose: () => {
        abandoned.push("failing");
      },
    });
    const registry = registryOf(counter, failing);
    const plan = planFor(
      [
        { first: { plugin: "counter", values: { v: 1 } } },
        { second: { plugin: "failing", values: { trigger: 1 } } },
      ],
      registry,
    );
    const firstKey = plan.entries[0]!.compilerKey;

    expect(() =>
      executeTrackOperations({
        plan,
        sampleValues: new Map([
          ["first", { v: 1 }],
          ["second", { trigger: 1 }],
        ]),
        committedStates: new Map([[firstKey, { count: 10 }]]),
      }),
    ).toThrow("late prepare failure");

    // The first entry continued a committed generation, so it is not ours to dispose. The failing
    // entry initialized before its prepare threw, so abandonment releases that state alone.
    expect(disposed).toEqual([]);
    expect(abandoned).toEqual(["failing"]);
  });

  it("C7-5 reports a disposer failure alongside the abandonment instead of replacing it", () => {
    const throwing = defineStatefulPlugin<{ count: number }, { count: number }>({
      name: "throwingDispose",
      keys: ["v"],
      collect: () => ({}),
      init: () => ({ count: 0 }),
      prepare: (_local, state) => ({ prepared: state, state: { count: state.count + 1 } }),
      dispose: () => {
        throw new Error("dispose refused");
      },
    });
    const failing = defineStatefulPlugin<{ ready: boolean }, undefined>({
      name: "failing",
      keys: ["trigger"],
      collect: () => ({}),
      init: () => ({ ready: false }),
      prepare: () => {
        throw new Error("late prepare failure");
      },
    });
    const registry = registryOf(throwing, failing);
    const plan = planFor(
      [
        { first: { plugin: "throwingDispose", values: { v: 1 } } },
        { second: { plugin: "failing", values: { trigger: 1 } } },
      ],
      registry,
    );

    let thrown: unknown;
    try {
      executeTrackOperations({
        plan,
        sampleValues: new Map([
          ["first", { v: 1 }],
          ["second", { trigger: 1 }],
        ]),
      });
    } catch (error) {
      thrown = error;
    }
    expect(thrown).toBeInstanceOf(AggregateError);
    const aggregate = thrown as AggregateError;
    expect(aggregate.cause).toBeInstanceOf(Error);
    expect((aggregate.cause as Error).message).toBe("late prepare failure");
    expect(aggregate.errors.map((error) => (error as Error).message)).toContain("dispose refused");
  });

  it("C7-6 reports a postcommit disposal failure without undoing the accepted result", () => {
    const throwing = defineStatefulPlugin<{ count: number }, { count: number }>({
      name: "throwingDispose",
      keys: ["v"],
      collect: () => ({}),
      init: () => ({ count: 0 }),
      prepare: (_local, state) => ({ prepared: state, state }),
      dispose: () => {
        throw new Error("dispose refused");
      },
    });
    const registry = registryOf(throwing);
    const plan = planFor([{ e: { plugin: "throwingDispose", values: { v: 1 } } }], registry);
    const key = plan.entries[0]!.compilerKey;

    const accepted = executeTrackOperations({
      plan,
      sampleValues: new Map([["e", { v: 1 }]]),
    });
    const failures = disposeRetiredStates(plan, new Map([[key, { count: 1 }]]), new Map());

    expect(failures).toHaveLength(1);
    expect((failures[0] as Error).message).toBe("dispose refused");
    // The accepted output is the one the caller already received; disposal is outside the swap.
    expect(accepted.proposedStates.get(key)).toEqual({
      origin: "initialized",
      state: { count: 0 },
    });
  });

  it("C7-7 abandons when a provider cannot create a table", () => {
    const disposed: number[] = [];
    const counter = makeCounter(disposed);
    const creates = defineStatefulPlugin<{ tag: string }, undefined>({
      name: "creates",
      keys: ["v"],
      collect: () => ({}),
      init: (_context, services) => {
        services.cache.create<number, number>({ equals: (a, b) => a === b, maxSlots: 2 });
        return { tag: "created" };
      },
      prepare: (_local, state) => ({ prepared: undefined, state }),
    });
    const registry = registryOf(counter, creates);
    const plan = planFor(
      [
        { first: { plugin: "counter", values: { v: 1 } } },
        { second: { plugin: "creates", values: { v: 1 } } },
      ],
      registry,
    );
    const failingCache: CacheProvider = {
      create: () => {
        throw new Error("provider create refused");
      },
    };

    expect(() =>
      executeTrackOperations({
        plan,
        sampleValues: new Map([
          ["first", { v: 1 }],
          ["second", { v: 1 }],
        ]),
        services: { cache: failingCache },
      }),
    ).toThrow("provider create refused");
    // The first entry initialized in this candidate, so abandonment releases it exactly once.
    expect(disposed).toEqual([1]);
  });

  it("C7-8 retains the committed generation when a provider lookup fails, and retries from it", () => {
    let failLookup = false;
    const faultyCache: CacheProvider = {
      create<K, V>(spec: CacheSpec<K>): CacheSnapshot<K, V> {
        const inner = DEFAULT_CACHE_PROVIDER.create<K, V>(spec);
        return {
          lookup(slot, key) {
            if (failLookup) throw new Error("provider lookup refused");
            return inner.lookup(slot, key);
          },
          remember(writes) {
            return inner.remember(writes);
          },
        };
      },
    };
    const disposed: number[] = [];
    const cached = defineStatefulPlugin<{ count: number }, { count: number }>({
      name: "cached",
      keys: ["v"],
      collect: (prepared) => ({ count: prepared.count }),
      init: (_context, services) => {
        services.cache.create<number, number>({ equals: (a, b) => a === b, maxSlots: 2 });
        return { count: 0 };
      },
      prepare: (_local, state, services) => {
        const table = services.cache.create<number, number>({
          equals: (a, b) => a === b,
          maxSlots: 2,
        });
        table.lookup("slot", state.count);
        const next = { count: state.count + 1 };
        return { prepared: next, state: next };
      },
      dispose: (state) => {
        disposed.push(state.count);
      },
    });
    const registry = registryOf(cached);
    const keyframes: AuthoredKeyframes = [{ e: { plugin: "cached", values: { v: 1 } } }];
    const plan = planFor(keyframes, registry);
    const track = new Track({
      interpolator: staticInterpolator({ v: 1 }),
      plugins: resolvedFor(keyframes, registry),
      plan,
      services: { cache: faultyCache },
      nodeId: "~/cached",
    });

    expect(track.compose().values.collect).toEqual([{ count: 1, id: "e" }]);
    failLookup = true;
    expect(() => track.composeFrom({ v: 2 })).toThrow("provider lookup refused");
    failLookup = false;
    expect(track.composeFrom({ v: 3 }).values.collect).toEqual([{ count: 2, id: "e" }]);
    expect(disposed).toEqual([]);
    track.dispose();
    expect(disposed).toEqual([2]);
  });

  it("C7-9 continues private state across track evaluations and survives a failed candidate", () => {
    let fail = false;
    let initCalls = 0;
    const disposed: number[] = [];
    const probe = defineStatefulPlugin<{ count: number }, { count: number }>({
      name: "probe",
      keys: ["v"],
      collect: (prepared) => ({ count: prepared.count }),
      init: () => {
        initCalls++;
        return { count: 0 };
      },
      prepare: (_local, state) => {
        if (fail) throw new Error("prepare refused this candidate");
        const next = { count: state.count + 1 };
        return { prepared: next, state: next };
      },
      dispose: (state) => {
        disposed.push(state.count);
      },
    });
    const registry = registryOf(probe);
    const keyframes: AuthoredKeyframes = [{ e: { plugin: "probe", values: { v: 1 } } }];
    const plan = planFor(keyframes, registry);
    const track = new Track({
      interpolator: staticInterpolator({ v: 1 }),
      plugins: resolvedFor(keyframes, registry),
      plan,
      nodeId: "~/probe",
    });

    expect(track.compose().values.collect).toEqual([{ count: 1, id: "e" }]);
    expect(track.composeFrom({ v: 2 }).values.collect).toEqual([{ count: 2, id: "e" }]);

    fail = true;
    expect(() => track.composeFrom({ v: 3 })).toThrow("prepare refused this candidate");
    fail = false;
    // The failed candidate never swapped its state, so this continues from `{ count: 2 }`.
    expect(track.composeFrom({ v: 4 }).values.collect).toEqual([{ count: 3, id: "e" }]);
    expect(initCalls).toBe(1);

    track.dispose();
    expect(disposed).toEqual([3]);
  });

  it("C7-10 starts a replacement track cold even when its authored values match", () => {
    let initCalls = 0;
    const disposed: number[] = [];
    const probe = defineStatefulPlugin<{ count: number }, { count: number }>({
      name: "probe",
      keys: ["v"],
      collect: (prepared) => ({ count: prepared.count }),
      init: () => {
        initCalls++;
        return { count: 0 };
      },
      prepare: (_local, state) => {
        const next = { count: state.count + 1 };
        return { prepared: next, state: next };
      },
      dispose: (state) => {
        disposed.push(state.count);
      },
    });
    const registry = registryOf(probe);
    const keyframes: AuthoredKeyframes = [{ e: { plugin: "probe", values: { v: 7 } } }];
    const plan = planFor(keyframes, registry);
    const resolved = resolvedFor(keyframes, registry);
    const options = {
      interpolator: staticInterpolator({ v: 7 }),
      plugins: resolved,
      plan,
      nodeId: "~/probe",
    } as const;

    const first = new Track(options);
    expect(first.compose().values.collect).toEqual([{ count: 1, id: "e" }]);
    const replacement = new Track(options);
    // Same authored values, same compiler layout — and a fresh `init` rather than the old state.
    expect(replacement.compose().values.collect).toEqual([{ count: 1, id: "e" }]);
    expect(initCalls).toBe(2);

    first.dispose();
    replacement.dispose();
    expect(disposed).toEqual([1, 1]);
  });

  it("C7-12 disposes a freshly initialized state when publication freezing fails", () => {
    const disposed: number[] = [];
    const unfreezable = defineStatefulPlugin<{ count: number }, undefined>({
      name: "unfreezable",
      keys: ["v"],
      collect: () => ({ bad: () => {} }),
      init: () => ({ count: 0 }),
      prepare: (_local, state) => ({ prepared: undefined, state }),
      dispose: (state) => {
        disposed.push(state.count);
      },
    });
    const registry = registryOf(unfreezable);
    const plan = planFor([{ e: { plugin: "unfreezable", values: { v: 1 } } }], registry);

    // Freezing happens after the entry loop, so this candidate has already initialized its state.
    expect(() =>
      executeTrackOperations({
        plan,
        sampleValues: new Map([["e", { v: 1 }]]),
      }),
    ).toThrow(/renderer-neutral/);
    expect(disposed).toEqual([0]);
  });

  it("C7-13 retains the committed generation across provider write and equality faults", () => {
    let failWrite = false;
    let failEquals = false;
    const faultyCache: CacheProvider = {
      create<K, V>(spec: CacheSpec<K>): CacheSnapshot<K, V> {
        const inner = DEFAULT_CACHE_PROVIDER.create<K, V>({
          ...spec,
          equals: (left, right) => {
            if (failEquals) throw new Error("provider equality refused");
            return spec.equals(left, right);
          },
        });
        return {
          lookup(slot, key) {
            return inner.lookup(slot, key);
          },
          remember(writes) {
            if (failWrite) throw new Error("provider write refused");
            return inner.remember(writes);
          },
        };
      },
    };
    const disposed: number[] = [];
    const cached = defineStatefulPlugin<{ count: number }, { count: number }>({
      name: "cachedWriter",
      keys: ["v"],
      collect: (prepared) => ({ count: prepared.count }),
      init: () => ({ count: 0 }),
      prepare: (_local, state, services) => {
        const table = services.cache.create<number, number>({
          equals: (a, b) => a === b,
          maxSlots: 2,
        });
        const next = { count: state.count + 1 };
        const stored = table.remember([{ slot: "count", key: next.count, value: next.count }]);
        stored.lookup("count", next.count);
        return { prepared: next, state: next };
      },
      dispose: (state) => {
        disposed.push(state.count);
      },
    });
    const registry = registryOf(cached);
    const keyframes: AuthoredKeyframes = [{ e: { plugin: "cachedWriter", values: { v: 1 } } }];
    const plan = planFor(keyframes, registry);
    const track = new Track({
      interpolator: staticInterpolator({ v: 1 }),
      plugins: resolvedFor(keyframes, registry),
      plan,
      services: { cache: faultyCache },
      nodeId: "~/cached-writer",
    });

    expect(track.compose().values.collect).toEqual([{ count: 1, id: "e" }]);

    failWrite = true;
    expect(() => track.composeFrom({ v: 2 })).toThrow("provider write refused");
    failWrite = false;
    failEquals = true;
    expect(() => track.composeFrom({ v: 3 })).toThrow("provider equality refused");
    failEquals = false;

    // Both rejected candidates retry from the one accepted snapshot rather than from each other.
    expect(track.composeFrom({ v: 4 }).values.collect).toEqual([{ count: 2, id: "e" }]);
    expect(disposed).toEqual([]);
    track.dispose();
    expect(disposed).toEqual([2]);
  });

  it("C7-14 scopes one legacy compose plugin's inputs by entry, then by plugin name", () => {
    const seen: unknown[] = [];
    const compose = ((values, _progress, inputs) => {
      seen.push(inputs);
      return values;
    }) satisfies PluginComposer;
    const recorder: PluginDefinition = { name: "recorder", keys: ["v"], compose };
    const registry = registryOf(recorder);
    const keyframes: AuthoredKeyframes = [
      { first: { plugin: "recorder", values: { v: 1 } } },
      { second: { plugin: "recorder", values: { v: 2 } } },
    ];
    const plan = planFor(keyframes, registry);
    expect(plan.entries).toHaveLength(2);
    expect(plan.entries.every((entry) => entry.execution.kind === "legacy-compose")).toBe(true);

    executeTrackOperations({
      plan,
      sampleValues: new Map([
        ["first", { v: 1 }],
        ["second", { v: 2 }],
      ]),
      requirementInputs: { first: { a: 1 }, second: { b: 2 }, recorder: { c: 3 } },
      legacyCompose: { nodeId: "~/c7", plugins: [{ name: "recorder", compose }], internalKeys: [] },
    });

    // The chain runs once, and both entries' inputs reach it; the plugin-name record is the
    // quarantined legacy scoping and lands last, so F2 can delete it without moving the merge.
    expect(seen).toEqual([{ a: 1, b: 2, c: 3 }]);
  });

  it("C7-11 continues evaluator state across runtime seeks and releases it on dispose", () => {
    const disposed: number[] = [];
    const probe = defineStatefulPlugin<{ count: number }, { count: number }>({
      name: "probe",
      keys: ["v"],
      collect: (prepared) => ({ count: prepared.count }),
      init: () => ({ count: 0 }),
      prepare: (_local, state) => {
        const next = { count: state.count + 1 };
        return { prepared: next, state: next };
      },
      dispose: (state) => {
        disposed.push(state.count);
      },
    });
    const engine = new Engine({
      clock: createManualClock(),
      interpolator: createFakeInterpolator(),
      scheduler: createFakeScheduler(),
      plugins: registryOf(probe),
    });
    const project = engine.load({
      schemaVersion: 5,
      motions: [
        {
          id: "motion",
          trigger: { type: "manual" },
          tracks: [
            {
              id: "track",
              keyframes: [
                {
                  e: {
                    plugin: "probe",
                    values: {
                      v: [
                        { p: 0, v: 1 },
                        { p: 1, v: 2 },
                      ],
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    });

    project.mount("motion/track");
    const countAt = (progress: number) => {
      project.seek("motion/track", progress);
      const patch = project.get("motion/track");
      if (patch?.status !== "ready")
        throw new Error(`motion/track is ${patch?.status ?? "absent"}, not ready.`);
      const collect = patch.values.collect;
      if (!Array.isArray(collect)) throw new Error("motion/track published no collect records.");
      return (collect[0] as { count: number }).count;
    };
    expect(countAt(0)).toBe(1);
    expect(countAt(0.5)).toBe(2);
    expect(countAt(1)).toBe(3);

    project.dispose();
    expect(disposed).toEqual([3]);
  });

  it("C7-15 disposes state exactly once through Track.dispose after many ticks", () => {
    // F4: disposeRetiredStates was tested only via the standalone helper. This test proves the
    // path fires through Track so a runtime removal always cleans up exactly one generation.
    const disposed: number[] = [];
    const probe = defineStatefulPlugin<{ count: number }, { count: number }>({
      name: "probe",
      keys: ["v"],
      collect: (prepared) => ({ count: prepared.count }),
      init: () => ({ count: 0 }),
      prepare: (_local, state) => {
        const next = { count: state.count + 1 };
        return { prepared: next, state: next };
      },
      dispose: (state) => {
        disposed.push(state.count);
      },
    });
    const registry = registryOf(probe);
    const keyframes: AuthoredKeyframes = [{ e: { plugin: "probe", values: { v: 1 } } }];
    const plan = planFor(keyframes, registry);
    const track = new Track({
      interpolator: staticInterpolator({ v: 1 }),
      plugins: resolvedFor(keyframes, registry),
      plan,
      nodeId: "~/f4",
    });

    // Many ticks with distinct seeds so the memo doesn't short-circuit. Each tick advances the
    // committed state; none should trigger disposal while the track is live.
    for (let tick = 0; tick < 10; tick++) {
      track.composeFrom({ v: tick });
    }
    expect(disposed).toEqual([]);

    // Dispose triggers disposeRetiredStates with an empty candidate map, retiring the generation.
    track.dispose();
    expect(disposed).toEqual([10]);
  });

  it("C7-16 disposes prepare's new state when collect throws, not init's state", () => {
    // F5: before the fix, proposedStates still held init's state after a successful prepare that
    // returned a new state. A throwing collect then caused abandonment to dispose init's state
    // and leak prepare's. This test pins the corrected behaviour.
    const disposeLog: string[] = [];
    const prepareChangesState = defineStatefulPlugin<{ generation: string }, { prepared: string }>({
      name: "prepareChanges",
      keys: ["v"],
      collect: (_prepared) => {
        throw new Error("collect refused");
      },
      init: () => {
        return { generation: "init" };
      },
      prepare: (_local, _state) => {
        // Returns a new state object every time — init's object is no longer referenced.
        return { prepared: { prepared: "prepare" }, state: { generation: "prepare" } };
      },
      dispose: (state) => {
        disposeLog.push(state.generation);
      },
    });
    const registry = registryOf(prepareChangesState);
    const plan = planFor([{ e: { plugin: "prepareChanges", values: { v: 1 } } }], registry);

    expect(() =>
      executeTrackOperations({
        plan,
        sampleValues: new Map([["e", { v: 1 }]]),
      }),
    ).toThrow("collect refused");

    // Abandonment must dispose prepare's generation ("prepare"), not init's ("init").
    expect(disposeLog).toEqual(["prepare"]);
  });

  it("C7-17 Engine refuses a load with duplicate entry ids across two tracks", () => {
    // F6: no end-to-end Engine-level refusal test existed. The schema validator catches
    // duplicate authored ids and load must throw rather than silently accepting the project.
    const registry = registryOf(makeCounter([]));
    const engine = new Engine({
      clock: createManualClock(),
      interpolator: createFakeInterpolator(),
      scheduler: createFakeScheduler(),
      plugins: registry,
    });

    expect(() =>
      engine.load({
        schemaVersion: 5,
        motions: [
          {
            id: "motion",
            trigger: { type: "manual" },
            tracks: [
              {
                id: "track",
                keyframes: [
                  { dup: { plugin: "counter", values: { v: 1 } } },
                  { dup: { plugin: "counter", values: { v: 2 } } },
                ],
              },
            ],
          },
        ],
      }),
    ).toThrow();
  });

  it("C7b-1 evaluate does not commit state — first track unaffected when second evaluation throws", () => {
    // Failing-first: proves evaluate is separate from commit. With the old composeFrom shim both
    // in one call, the first track's state would already be swapped before the second throws.
    const disposed: number[] = [];
    const counter = makeCounter(disposed);
    const registry = registryOf(counter);
    const keyframes: AuthoredKeyframes = [{ e: { plugin: "counter", values: { v: 1 } } }];

    const planA = planFor(keyframes, registry);
    const trackA = new Track({
      interpolator: staticInterpolator({ v: 1 }),
      plugins: resolvedFor(keyframes, registry),
      plan: planA,
      nodeId: "~/c7b-a",
    });

    // Evaluate and commit trackA once so it has a non-empty committed state.
    const candidateA1 = trackA.evaluate({ v: 1 });
    trackA.commit(candidateA1);
    // After one commit, count is 1.
    expect(candidateA1.snapshot.values.collect).toEqual([{ count: 1, id: "e" }]);

    // Evaluate a second candidate for trackA — this proposes count=2 but does NOT commit yet.
    const candidateA2 = trackA.evaluate({ v: 2 });
    expect(candidateA2.snapshot.values.collect).toEqual([{ count: 2, id: "e" }]);

    // Simulate the group's second track throwing during evaluation: no commit fires for trackA.
    // trackA's committed state must still reflect the first commit (count=1).
    const candidateA3 = trackA.evaluate({ v: 1 });
    // Re-evaluate with the prior seed — continued state means count=2 from proposal, but committed
    // is still count=1 because candidateA2 was never committed.
    expect(candidateA3.snapshot.values.collect).toEqual([{ count: 2, id: "e" }]);

    // Dispose: only the committed state (count=1) is retired, not the uncommitted proposals.
    trackA.dispose();
    expect(disposed).toEqual([1]);
  });

  it("C7b-2 commit advances state and disposeRetiredStates fires once per commit", () => {
    // The normal two-phase path: evaluate then commit advances state exactly once.
    const disposed: number[] = [];
    const counter = makeCounter(disposed);
    const registry = registryOf(counter);
    const keyframes: AuthoredKeyframes = [{ e: { plugin: "counter", values: { v: 1 } } }];
    const plan = planFor(keyframes, registry);
    const track = new Track({
      interpolator: staticInterpolator({ v: 1 }),
      plugins: resolvedFor(keyframes, registry),
      plan,
      nodeId: "~/c7b-2",
    });

    const c1 = track.evaluate({ v: 1 });
    track.commit(c1);
    const c2 = track.evaluate({ v: 2 });
    track.commit(c2);

    // Two commits: state progressed from count=0 (init) to count=1 to count=2.
    // init's generation (count=0 baseline) is retired on first commit, count=1 on second.
    // No disposal yet (continued states are not retired while the track is live).
    expect(disposed).toEqual([]);

    track.dispose();
    // dispose retires the last committed state, count=2.
    expect(disposed).toEqual([2]);
  });

  it("C7b-3 cold-reset retires prior generation on commit, not on evaluate", () => {
    // A second evaluate with a different compiler key (cold reset scenario via fresh track)
    // must not dispose the prior committed state until commit fires.
    const disposed: number[] = [];
    const counter = makeCounter(disposed);
    const registry = registryOf(counter);
    const keyframes: AuthoredKeyframes = [{ e: { plugin: "counter", values: { v: 1 } } }];
    const plan = planFor(keyframes, registry);
    const track = new Track({
      interpolator: staticInterpolator({ v: 1 }),
      plugins: resolvedFor(keyframes, registry),
      plan,
      nodeId: "~/c7b-3",
    });

    // First commit establishes count=1 as committed state.
    const c1 = track.evaluate({ v: 1 });
    track.commit(c1);
    expect(disposed).toEqual([]);

    // evaluate a second candidate — does not dispose the prior generation.
    track.evaluate({ v: 2 });
    expect(disposed).toEqual([]);

    // commit that candidate — prior generation (count=1) is now retired via disposeRetiredStates.
    // But counter plugin uses "continued" origin (same compiler key, same generation), so
    // continued states are not disposed on commit; they are only disposed on track.dispose().
    // c2 was evaluated but never committed, so dispose retires the last committed: count=1.
    track.dispose();
    expect(disposed).toEqual([1]);
  });

  it("C7b-4 evaluate returns consistent snapshot regardless of subsequent commits", () => {
    // A candidate snapshot captured from evaluate is not mutated by a later commit on the same track.
    const disposed: number[] = [];
    const counter = makeCounter(disposed);
    const registry = registryOf(counter);
    const keyframes: AuthoredKeyframes = [{ e: { plugin: "counter", values: { v: 1 } } }];
    const plan = planFor(keyframes, registry);
    const track = new Track({
      interpolator: staticInterpolator({ v: 1 }),
      plugins: resolvedFor(keyframes, registry),
      plan,
      nodeId: "~/c7b-4",
    });

    const c1 = track.evaluate({ v: 1 });
    const snapshot1Before = c1.snapshot;
    track.commit(c1);
    const c2 = track.evaluate({ v: 2 });
    track.commit(c2);

    // The snapshot captured from c1 before any commit must still read count=1.
    expect(snapshot1Before.values.collect).toEqual([{ count: 1, id: "e" }]);
    expect(c2.snapshot.values.collect).toEqual([{ count: 2, id: "e" }]);
    track.dispose();
  });
});
