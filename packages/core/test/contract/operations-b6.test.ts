import { describe, expect, it } from "vitest";
import { PluginRegistry, type PluginDefinition } from "../../src/domain/plugins";
import { compileTrackExecutionPlan } from "../../src/domain/execution-plan";
import { defineStatefulPlugin } from "../../src/domain/stateful-plugin";
import {
  executeTrackOperations,
  executeTrackOperationsBatch,
  evaluatePreparedTrack,
  type LocalEvaluation,
} from "../../src/domain/track-operations";
import { CompositionOutputError } from "../../src/domain/track";
import { prepareTrack } from "../../src/domain/track-preparation";
import type { Interpolator } from "../../src/ports/interpolator";

const stubInterpolator: Interpolator = {
  create: (config: unknown) => {
    let p = 0;
    const cfg = config as { keyframes?: Record<string, unknown> } | undefined;
    const state: Record<string, unknown> = {};
    if (cfg?.keyframes) {
      for (const [k, v] of Object.entries(cfg.keyframes)) {
        state[k] = v;
      }
    }
    return {
      duration: 1,
      progress(value?: number): any {
        if (value !== undefined) {
          p = value;
          return;
        }
        return p;
      },
      get state() {
        return state;
      },
      kill: () => {},
    };
  },
};

describe("Slice B6: Execute collect/fold and publish owned outputs", () => {
  it("B6-1: collect-only, fold-only, and both operations run correctly", () => {
    const collectPlugin: PluginDefinition = {
      name: "collectPlugin",
      keys: ["point"],
      collect: (local: any) => ({ p: local.values.point }),
    };

    const foldPlugin: PluginDefinition = {
      name: "foldPlugin",
      keys: ["step"],
      fold: {
        outputs: ["counter"],
        run: (local: any, state: any) => {
          const prev = (state as Record<string, number>).counter ?? 0;
          return { counter: prev + Number(local.values.step ?? 1) };
        },
      },
    };

    const bothPlugin: PluginDefinition = {
      name: "bothPlugin",
      keys: ["tag"],
      collect: (local: any) => ({ name: local.values.tag }),
      fold: {
        outputs: ["summary"],
        run: (local: any, state: any) => {
          const prev = (state as Record<string, string>).summary ?? "";
          return { summary: prev + String(local.values.tag) };
        },
      },
    };

    const registry = new PluginRegistry();
    registry.register(collectPlugin);
    registry.register(foldPlugin);
    registry.register(bothPlugin);

    const plan = compileTrackExecutionPlan({
      keyframes: [
        { c1: { plugin: "collectPlugin", values: { point: 10 } } },
        { f1: { plugin: "foldPlugin", values: { step: 5 } } },
        { b1: { plugin: "bothPlugin", values: { tag: "Z" } } },
      ],
      registry,
    });

    const sampleValues = new Map<string, Readonly<Record<string, unknown>>>([
      ["c1", { point: 10 }],
      ["f1", { step: 5 }],
      ["b1", { tag: "Z" }],
    ]);

    const result = executeTrackOperations({
      plan,
      sampleValues,
    });

    expect(result.publishedValues.collect).toEqual([
      { p: 10, id: "c1" },
      { name: "Z", id: "b1" },
    ]);
    expect(result.publishedValues.counter).toBe(5);
    expect(result.publishedValues.summary).toBe("Z");
  });

  it("B6-2: single callback counts, execution order, and boundary isolation", () => {
    const events: string[] = [];
    let collectSawFoldState: unknown = undefined;
    let foldSawCollectResult: unknown = undefined;

    const dualPlugin: PluginDefinition = {
      name: "dual",
      keys: ["val"],
      collect: (local: any) => {
        events.push("collect");
        collectSawFoldState = local.accumulated;
        return { v: local.values.val };
      },
      fold: {
        outputs: ["accumulated"],
        run: (local: any, state: any) => {
          events.push("fold");
          foldSawCollectResult = state.items;
          const prev = (state as Record<string, number>).accumulated ?? 0;
          return { accumulated: prev + Number(local.values.val) };
        },
      },
    };

    const registry = new PluginRegistry();
    registry.register(dualPlugin);

    const plan = compileTrackExecutionPlan({
      keyframes: [{ e1: { plugin: "dual", values: { val: 42 } } }],
      registry,
    });

    const sampleValues = new Map([["e1", { val: 42 }]]);
    const result = executeTrackOperations({ plan, sampleValues });

    expect(events).toEqual(["collect", "fold"]);
    expect(collectSawFoldState).toBeUndefined();
    expect(foldSawCollectResult).toBeUndefined();
    expect(result.publishedValues.collect).toEqual([{ v: 42, id: "e1" }]);
    expect(result.publishedValues.accumulated).toBe(42);
  });

  it("B6-3: preserves scoped same-named values and requirement inputs without collision", () => {
    const scopedPlugin: PluginDefinition = {
      name: "scopedPlugin",
      keys: ["weight"],
      requirements: {
        weight: {},
      },
      collect: (local: any) => ({
        authoredWeight: local.values.weight,
        requiredWeight: local.inputs.weight.weight,
      }),
    };

    const registry = new PluginRegistry();
    registry.register(scopedPlugin);

    const plan = compileTrackExecutionPlan({
      keyframes: [
        {
          target: {
            plugin: "scopedPlugin",
            values: { weight: 100 },
            requires: { weight: "otherTrack" },
          },
        },
      ],
      registry,
    });

    const sampleValues = new Map([["target", { weight: 100 }]]);
    const requirementInputs = {
      target: {
        weight: { weight: 200 },
      },
    };

    const result = executeTrackOperations({
      plan,
      sampleValues,
      requirementInputs,
    });

    expect(result.publishedValues.collect).toEqual([
      {
        authoredWeight: 100,
        requiredWeight: 200,
        id: "target",
      },
    ]);
  });

  it("B6-4: noncommutative fold preserves authored order and order-dependent result", () => {
    const stringFoldPlugin: PluginDefinition = {
      name: "strFold",
      keys: ["char"],
      fold: {
        outputs: ["word"],
        run: (local: any, state: any) => {
          const prev = (state as Record<string, string>).word ?? "";
          return { word: prev + String(local.values.char) };
        },
      },
    };

    const registry = new PluginRegistry();
    registry.register(stringFoldPlugin);

    const planAB = compileTrackExecutionPlan({
      keyframes: [
        { first: { plugin: "strFold", values: { char: "A" } } },
        { second: { plugin: "strFold", values: { char: "B" } } },
      ],
      registry,
    });

    const resultAB = executeTrackOperations({
      plan: planAB,
      sampleValues: new Map([
        ["first", { char: "A" }],
        ["second", { char: "B" }],
      ]),
    });
    expect(resultAB.publishedValues.word).toBe("AB");

    const planBA = compileTrackExecutionPlan({
      keyframes: [
        { second: { plugin: "strFold", values: { char: "B" } } },
        { first: { plugin: "strFold", values: { char: "A" } } },
      ],
      registry,
    });

    const resultBA = executeTrackOperations({
      plan: planBA,
      sampleValues: new Map([
        ["second", { char: "B" }],
        ["first", { char: "A" }],
      ]),
    });
    expect(resultBA.publishedValues.word).toBe("BA");
  });

  it("B6-5: shared collections append records across multiple entries", () => {
    const meshPlugin: PluginDefinition = {
      name: "mesh",
      keys: ["v"],
      collect: (local: any) => ({ coord: local.values.v }),
    };

    const registry = new PluginRegistry();
    registry.register(meshPlugin);

    const plan = compileTrackExecutionPlan({
      keyframes: [
        { p1: { plugin: "mesh", values: { v: 1 } } },
        { p2: { plugin: "mesh", values: { v: 2 } } },
        { p3: { plugin: "mesh", values: { v: 3 } } },
      ],
      registry,
    });

    const result = executeTrackOperations({
      plan,
      sampleValues: new Map([
        ["p1", { v: 1 }],
        ["p2", { v: 2 }],
        ["p3", { v: 3 }],
      ]),
    });

    expect(result.publishedValues.collect).toEqual([
      { coord: 1, id: "p1" },
      { coord: 2, id: "p2" },
      { coord: 3, id: "p3" },
    ]);
  });

  it("B6-6: field last-write-wins, omission preservation, and nested replacement as a whole", () => {
    const multiFoldPlugin: PluginDefinition = {
      name: "multiFold",
      keys: ["val"],
      fold: {
        outputs: ["a", "b", "nested"],
        run: (local: any) => {
          return local.values.val;
        },
      },
    };

    const registry = new PluginRegistry();
    registry.register(multiFoldPlugin);

    const plan = compileTrackExecutionPlan({
      keyframes: [
        { step1: { plugin: "multiFold", values: { val: "s1" } } },
        { step2: { plugin: "multiFold", values: { val: "s2" } } },
        { step3: { plugin: "multiFold", values: { val: "s3" } } },
      ],
      registry,
    });

    const sampleValues = new Map<string, Readonly<Record<string, unknown>>>([
      ["step1", { val: { a: 1, b: 2, nested: { x: 10, y: 20 } } }],
      ["step2", { val: { b: 99 } }], // omits a, preserves earlier a=1
      ["step3", { val: { nested: { z: 30 } } }], // replaces nested whole; omits a and b
    ]);

    const result = executeTrackOperations({ plan, sampleValues });

    expect(result.publishedValues.a).toBe(1);
    expect(result.publishedValues.b).toBe(99);
    expect(result.publishedValues.nested).toEqual({ z: 30 });
  });

  it("B6-7: foreign writes and own id spoofing are rejected", () => {
    const idSpoofPlugin = {
      name: "idSpoof",
      keys: ["x"],
      collect: (() => ({ id: "forged_id", x: 1 })) as unknown as PluginDefinition["collect"],
    } as unknown as PluginDefinition;

    const foreignFoldPlugin: PluginDefinition = {
      name: "foreignFold",
      keys: ["x"],
      fold: {
        outputs: ["declaredOut"],
        run: () => ({ declaredOut: 1, foreignOut: 2 }),
      },
    };

    const registry = new PluginRegistry();
    registry.register(idSpoofPlugin);
    registry.register(foreignFoldPlugin);

    const planSpoof = compileTrackExecutionPlan({
      keyframes: [{ entry1: { plugin: "idSpoof", values: { x: 1 } } }],
      registry,
    });

    expect(() =>
      executeTrackOperations({
        plan: planSpoof,
        sampleValues: new Map([["entry1", { x: 1 }]]),
      }),
    ).toThrow(CompositionOutputError);

    const planForeign = compileTrackExecutionPlan({
      keyframes: [{ entry2: { plugin: "foreignFold", values: { x: 1 } } }],
      registry,
    });

    expect(() =>
      executeTrackOperations({
        plan: planForeign,
        sampleValues: new Map([["entry2", { x: 1 }]]),
      }),
    ).toThrow(CompositionOutputError);
  });

  it("B6-8: reserved fold output name is rejected at admission", () => {
    const badFoldPlugin: PluginDefinition = {
      name: "badFold",
      keys: ["x"],
      fold: { outputs: ["collect"], run: () => ({}) },
    };

    const registry = new PluginRegistry();
    expect(() => registry.register(badFoldPlugin)).toThrow(
      /fold output cannot use reserved name "collect"/i,
    );
  });

  it("B6-9: malformed, undefined, and non-finite outputs are rejected", () => {
    const badFoldNull: PluginDefinition = {
      name: "badFoldNull",
      keys: ["x"],
      fold: {
        outputs: ["val"],
        run: () => ({ val: null as any }),
      },
    };

    const badFoldNaN: PluginDefinition = {
      name: "badFoldNaN",
      keys: ["x"],
      fold: {
        outputs: ["val"],
        run: () => ({ val: NaN }),
      },
    };

    const badCollectNonRecord: PluginDefinition = {
      name: "badCollectNonRecord",
      keys: ["x"],
      collect: () => "not a record" as any,
    };

    const registry = new PluginRegistry();
    registry.register(badFoldNull);
    registry.register(badFoldNaN);
    registry.register(badCollectNonRecord);

    const planNull = compileTrackExecutionPlan({
      keyframes: [{ e1: { plugin: "badFoldNull", values: { x: 1 } } }],
      registry,
    });
    expect(() =>
      executeTrackOperations({
        plan: planNull,
        sampleValues: new Map([["e1", { x: 1 }]]),
      }),
    ).toThrow(CompositionOutputError);

    const planNaN = compileTrackExecutionPlan({
      keyframes: [{ e1: { plugin: "badFoldNaN", values: { x: 1 } } }],
      registry,
    });
    expect(() =>
      executeTrackOperations({
        plan: planNaN,
        sampleValues: new Map([["e1", { x: 1 }]]),
      }),
    ).toThrow(CompositionOutputError);

    const planCollect = compileTrackExecutionPlan({
      keyframes: [{ e1: { plugin: "badCollectNonRecord", values: { x: 1 } } }],
      registry,
    });
    expect(() =>
      executeTrackOperations({
        plan: planCollect,
        sampleValues: new Map([["e1", { x: 1 }]]),
      }),
    ).toThrow(CompositionOutputError);
  });

  it("B6-10: empty values permitted for dependency-only operations", () => {
    const depOnlyPlugin: PluginDefinition = {
      name: "depOnly",
      requirements: { base: {} },
      collect: (local: any) => ({ src: local.inputs.base?.val ?? "none" }),
    };

    const registry = new PluginRegistry();
    registry.register(depOnlyPlugin);

    const plan = compileTrackExecutionPlan({
      keyframes: [{ d1: { plugin: "depOnly", requires: { base: "upstream" } } }],
      registry,
    });

    const result = executeTrackOperations({
      plan,
      sampleValues: new Map(), // empty sample values
      requirementInputs: { d1: { base: { val: "ready" } } },
    });

    expect(result.publishedValues.collect).toEqual([{ src: "ready", id: "d1" }]);
  });

  it("B6-11: late serializer and freeze failure abandons staged outputs", () => {
    const serializerPlugin: PluginDefinition = {
      name: "serPlugin",
      keys: ["num"],
      outputSerializers: {
        collect: (val) => {
          // Serializer returns invalid non-finite value
          return { bad: NaN, raw: val };
        },
      },
      collect: (local: any) => ({ n: local.values.num }),
    };

    const registry = new PluginRegistry();
    registry.register(serializerPlugin);

    const plan = compileTrackExecutionPlan({
      keyframes: [{ e1: { plugin: "serPlugin", values: { num: 1 } } }],
      registry,
    });

    expect(() =>
      executeTrackOperations({
        plan,
        sampleValues: new Map([["e1", { num: 1 }]]),
      }),
    ).toThrow(CompositionOutputError);
  });

  it("B6-12: transaction atomicity: no earlier track/entry accepted after later failure", () => {
    let acceptedEntries = 0;

    const atomicPlugin: PluginDefinition = {
      name: "atomicPlugin",
      keys: ["ok"],
      fold: {
        outputs: ["status"],
        run: (local: any) => {
          acceptedEntries++;
          if (!local.values.ok) {
            throw new Error("Deliberate failure in entry 2");
          }
          return { status: "good" };
        },
      },
    };

    const registry = new PluginRegistry();
    registry.register(atomicPlugin);

    const plan = compileTrackExecutionPlan({
      keyframes: [
        { first: { plugin: "atomicPlugin", values: { ok: true } } },
        { second: { plugin: "atomicPlugin", values: { ok: false } } },
      ],
      registry,
    });

    expect(() =>
      executeTrackOperations({
        plan,
        sampleValues: new Map([
          ["first", { ok: true }],
          ["second", { ok: false }],
        ]),
      }),
    ).toThrow("Deliberate failure in entry 2");

    // In a multi-track batch transaction:
    const track1Plan = compileTrackExecutionPlan({
      trackId: "track1",
      keyframes: [{ first: { plugin: "atomicPlugin", values: { ok: true } } }],
      registry,
    });
    const track2Plan = compileTrackExecutionPlan({
      trackId: "track2",
      keyframes: [{ second: { plugin: "atomicPlugin", values: { ok: false } } }],
      registry,
    });

    expect(() =>
      executeTrackOperationsBatch([
        {
          trackId: "track1",
          plan: track1Plan,
          sampleValues: new Map([["first", { ok: true }]]),
        },
        {
          trackId: "track2",
          plan: track2Plan,
          sampleValues: new Map([["second", { ok: false }]]),
        },
      ]),
    ).toThrow("Deliberate failure in entry 2");
  });

  it("B6-13: stateful execution strategy with shared prepared data", () => {
    let prepareCalls = 0;
    let collectCalls = 0;
    let foldCalls = 0;

    const statefulPlugin = defineStatefulPlugin<{ acc: number }, { normalizedBase: number }>({
      name: "statefulPlugin",
      keys: ["baseNum"],
      collect: (prepared) => {
        collectCalls++;
        return { itemVal: prepared.normalizedBase };
      },
      fold: {
        outputs: ["total"],
        run: (prepared, priorFold) => {
          foldCalls++;
          const prev = typeof priorFold.total === "number" ? priorFold.total : 0;
          return {
            delta: { total: prev + prepared.normalizedBase },
            state: { acc: 999 },
          };
        },
      },
      init: () => ({ acc: 0 }),
      prepare: (local, state) => {
        prepareCalls++;
        const base = Number(local.values.baseNum ?? 0);
        return {
          prepared: { normalizedBase: base * 2 },
          state: { acc: state.acc + 1 },
        };
      },
    });

    const registry = new PluginRegistry();
    registry.register(statefulPlugin);

    const plan = compileTrackExecutionPlan({
      keyframes: [{ entry1: { plugin: "statefulPlugin", values: { baseNum: 5 } } }],
      registry,
    });

    const result = executeTrackOperations({
      plan,
      sampleValues: new Map([["entry1", { baseNum: 5 }]]),
      committedStates: new Map([["entry1", { acc: 10 }]]),
    });

    expect(prepareCalls).toBe(1);
    expect(collectCalls).toBe(1);
    expect(foldCalls).toBe(1);
    expect(result.publishedValues.collect).toEqual([{ itemVal: 10, id: "entry1" }]);
    expect(result.publishedValues.total).toBe(10);
    // Proposed state is proposed and carried out of the evaluator
    const compilerKey = plan.entries[0]?.compilerKey;
    expect(result.proposedStates.get(compilerKey!)).toEqual({ acc: 999 });
  });

  it("B6-14: evaluatePreparedTrack bridges PreparedTrack sampling and operations", () => {
    const pointPlugin: PluginDefinition = {
      name: "pointPlugin",
      keys: ["x", "y"],
      collect: (local: any) => ({ x: local.values.x, y: local.values.y }),
    };

    const registry = new PluginRegistry();
    registry.register(pointPlugin);

    const plan = compileTrackExecutionPlan({
      keyframes: [{ pt: { plugin: "pointPlugin", values: { x: 12, y: 34 } } }],
      registry,
    });

    const prepared = prepareTrack({
      plan,
      interpolator: stubInterpolator,
    });

    const result = evaluatePreparedTrack(prepared);
    expect(result.publishedValues.collect).toEqual([{ x: 12, y: 34, id: "pt" }]);
  });
});
