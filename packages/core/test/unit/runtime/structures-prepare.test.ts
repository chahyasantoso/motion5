import { describe, expect, it, vi } from "vitest";
import { defineModel, ok, refused } from "../../../src/contract/v5";
import type {
  Model,
  PluginDefinition,
  ProjectDefinition,
  ValueSpec,
} from "../../../src/contract/v5";
import { PluginCatalog } from "../../../src/domain/plugin-catalog";
import { Engine } from "../../../src/engine";
import { createManualClock } from "../../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../../src/testing/fakes";
import { Body2d } from "../../../../plugins/src/models";
import { fkPlugin } from "../../../../plugins/src/fk";
import { parseDataType } from "../../../src/runtime/data-type-parse";
import { body2d } from "../../../../plugins/src/body/type";

const BONE_SPEC: ValueSpec = {
  kind: "table",
  schema: {
    row: {
      fields: {
        parentId: { kind: "string", optional: true, static: true },
        length: { kind: "number" },
        rotation: { kind: "number" },
      },
    },
  },
};

interface BoneStructure {
  readonly ids: readonly string[];
  readonly parentById: ReadonlyMap<string, string>;
}

const BoneModel: Model<unknown, BoneStructure> = defineModel({
  id: "BoneModel",
  spec: BONE_SPEC,
  parse(value) {
    if (!Array.isArray(value)) return refused([{ path: "", message: "Expected table." }]);
    const parentById = new Map<string, string>();
    const ids: string[] = [];
    for (const row of value) {
      if (typeof row.id !== "string") return refused([{ path: "id", message: "Missing id" }]);
      ids.push(row.id);
      if (typeof row.cells.parentId === "string") {
        parentById.set(row.id, row.cells.parentId);
      }
    }
    return ok({ ids: Object.freeze(ids), parentById });
  },
});

function createEngine(catalog: PluginCatalog): Engine {
  const clock = createManualClock();
  const interpolator = createFakeInterpolator();
  const scheduler = createFakeScheduler();
  return new Engine({ clock, interpolator, scheduler, plugins: catalog });
}

describe("structures and prepare hook", () => {
  it("prepare receives static param cells only", () => {
    let observedParam: unknown;
    const testPlugin: PluginDefinition = {
      id: "param-test-plugin",
      inputs: {
        param: {
          kind: "record",
          fields: {
            inspect: { kind: "boolean", static: true },
            gain: { kind: "number" },
          },
        },
        values: { kind: "record", fields: {} },
      },
      outputs: { values: { kind: "record", fields: {} } },
      prepare(ctx) {
        observedParam = ctx.param;
        if (typeof ctx.param === "object" && ctx.param !== null && "inspect" in ctx.param) {
          if (ctx.param.inspect !== true) {
            return refused([{ path: "inspect", message: "inspect must be true" }]);
          }
        } else {
          return refused([{ path: "inspect", message: "inspect must be present" }]);
        }
        return ok(undefined);
      },
      transform() {
        return { values: {} };
      },
    };

    const catalog = new PluginCatalog();
    catalog.register(testPlugin);
    const engine = createEngine(catalog);

    const project: ProjectDefinition = {
      schemaVersion: 5,
      motions: [
        {
          id: "m",
          trigger: { type: "manual" },
          tracks: [
            {
              id: "t",
              plugin: "param-test-plugin",
              input: {
                param: {
                  inspect: true,
                  gain: [
                    { p: 0, v: 1 },
                    { p: 1, v: 2 },
                  ],
                },
                values: {},
              },
            },
          ],
        },
      ],
    };

    const handle = engine.load(project);
    handle.seek("m/t", 0);

    expect(observedParam).toEqual({ inspect: true });
    expect(observedParam).not.toHaveProperty("gain");
  });

  it("commit parse vs first-compose parse timing", () => {
    const localParseSpy = vi.fn((val: unknown) => {
      if (!Array.isArray(val)) return refused([{ path: "", message: "Expected table" }]);
      return ok({ ids: val.map((r) => r.id) });
    });
    const computedParseSpy = vi.fn((val: unknown) => {
      if (!Array.isArray(val)) return refused([{ path: "", message: "Expected table" }]);
      return ok({ count: val.length });
    });

    const LocalSourceModel = defineModel({
      id: "LocalSourceModel",
      spec: BONE_SPEC,
      parse: localParseSpy,
    });

    const ComputedOutputModel = defineModel({
      id: "ComputedOutputModel",
      spec: BONE_SPEC,
      parse: computedParseSpy,
    });

    const computedPlugin: PluginDefinition = {
      id: "computed-producer",
      inputs: {
        values: { kind: "record", fields: {} },
        requires: { src: LocalSourceModel },
      },
      outputs: { values: ComputedOutputModel },
      transform() {
        return {
          values: [{ id: "root", cells: { length: 10, rotation: 0 } }],
        };
      },
    };

    const catalog = new PluginCatalog({ models: [LocalSourceModel, ComputedOutputModel] });
    catalog.register(computedPlugin);
    const engine = createEngine(catalog);

    const project: ProjectDefinition = {
      schemaVersion: 5,
      motions: [
        {
          id: "m",
          trigger: { type: "manual" },
          tracks: [
            {
              id: "src",
              type: "LocalSourceModel",
              input: {
                values: [{ id: "root", cells: { length: 10, rotation: 0 } }],
              },
            },
            {
              id: "comp",
              plugin: "computed-producer",
              input: {
                values: {},
                requires: { src: "src" },
              },
            },
          ],
        },
      ],
    };

    expect(localParseSpy).toHaveBeenCalledTimes(0);
    expect(computedParseSpy).toHaveBeenCalledTimes(0);

    const handle = engine.load(project);

    expect(localParseSpy).toHaveBeenCalledTimes(1);
    expect(computedParseSpy).toHaveBeenCalledTimes(0);

    handle.seek("m/src", 0);
    handle.seek("m/comp", 0);

    expect(localParseSpy).toHaveBeenCalledTimes(1);
    expect(computedParseSpy).toHaveBeenCalledTimes(1);
  });

  it("zero parse and prepare rerun on animated-only changes", () => {
    const parseSpy = vi.fn((val: unknown) => {
      if (!Array.isArray(val)) return refused([{ path: "", message: "Expected table" }]);
      return ok({ ids: val.map((r) => r.id) });
    });
    const prepareSpy = vi.fn(() => ok({ ready: true }));

    const TestedModel = defineModel({
      id: "TestedModel",
      spec: BONE_SPEC,
      parse: parseSpy,
    });

    const producerPlugin: PluginDefinition = {
      id: "animated-producer",
      inputs: {
        values: {
          kind: "record",
          fields: { rot: { kind: "number" } },
        },
      },
      outputs: { values: TestedModel },
      transform(ctx) {
        const rot =
          typeof ctx.values === "object" &&
          ctx.values !== null &&
          "rot" in ctx.values &&
          typeof ctx.values.rot === "number"
            ? ctx.values.rot
            : 0;
        const cells: Readonly<Record<string, number>> = { length: 10, rotation: rot };
        return {
          values: [{ id: "b1", cells }],
        };
      },
    };

    const consumerPlugin: PluginDefinition = {
      id: "animated-consumer",
      inputs: {
        values: { kind: "record", fields: {} },
        requires: { bone: TestedModel },
      },
      outputs: { values: { kind: "record", fields: {} } },
      prepare: prepareSpy,
      transform() {
        return { values: {} };
      },
    };

    const catalog = new PluginCatalog({ models: [TestedModel] });
    catalog.register(producerPlugin);
    catalog.register(consumerPlugin);
    const engine = createEngine(catalog);

    const project: ProjectDefinition = {
      schemaVersion: 5,
      motions: [
        {
          id: "m",
          trigger: { type: "manual" },
          tracks: [
            {
              id: "prod",
              plugin: "animated-producer",
              input: {
                values: {
                  rot: [
                    { p: 0, v: 0 },
                    { p: 1, v: 90 },
                  ],
                },
              },
            },
            {
              id: "cons",
              plugin: "animated-consumer",
              input: {
                values: {},
                requires: { bone: "prod" },
              },
            },
          ],
        },
      ],
    };

    const handle = engine.load(project);
    handle.seek("m/cons", 0);

    const parseCallsAfterFrame0 = parseSpy.mock.calls.length;
    const prepareCallsAfterFrame0 = prepareSpy.mock.calls.length;

    for (let frame = 1; frame <= 10; frame += 1) {
      handle.seek("m/cons", frame / 10);
    }

    expect(parseSpy.mock.calls.length).toBe(parseCallsAfterFrame0);
    expect(prepareSpy.mock.calls.length).toBe(prepareCallsAfterFrame0);
  });

  it("upstream structure change reruns reader prepare", () => {
    let prepareRunCount = 0;
    let lastObservedIds: readonly string[] = [];

    const DynamicBoneModel = defineModel({
      id: "DynamicBoneModel",
      spec: BONE_SPEC,
      parse(val) {
        if (!Array.isArray(val)) return refused([{ path: "", message: "Expected table" }]);
        return ok({ ids: Object.freeze(val.map((r) => r.id)) });
      },
    });

    const readerPlugin: PluginDefinition = {
      id: "structure-reader",
      inputs: {
        values: { kind: "record", fields: {} },
        requires: { bones: DynamicBoneModel },
      },
      outputs: { values: { kind: "record", fields: {} } },
      prepare(ctx) {
        prepareRunCount += 1;
        const struct = ctx.structures.bones;
        if (
          typeof struct === "object" &&
          struct !== null &&
          "ids" in struct &&
          Array.isArray(struct.ids)
        ) {
          lastObservedIds = struct.ids;
        }
        return ok(undefined);
      },
      transform() {
        return { values: {} };
      },
    };

    const catalog = new PluginCatalog({ models: [DynamicBoneModel] });
    catalog.register(readerPlugin);
    const engine = createEngine(catalog);

    const project: ProjectDefinition = {
      schemaVersion: 5,
      motions: [
        {
          id: "m",
          trigger: { type: "manual" },
          tracks: [
            {
              id: "bones",
              type: "DynamicBoneModel",
              input: {
                values: [{ id: "b1", cells: { length: 10, rotation: 0 } }],
              },
            },
            {
              id: "reader",
              plugin: "structure-reader",
              input: {
                values: {},
                requires: { bones: "bones" },
              },
            },
          ],
        },
      ],
    };

    const handle = engine.load(project);
    handle.seek("m/reader", 0);

    expect(prepareRunCount).toBe(1);
    expect(lastObservedIds).toEqual(["b1"]);

    handle.edit((tx) => {
      tx.track("m/bones").replace({
        id: "bones",
        type: "DynamicBoneModel",
        input: {
          values: [
            { id: "b1", cells: { length: 10, rotation: 0 } },
            { id: "b2", cells: { length: 15, rotation: 0 } },
          ],
        },
      });
    });

    handle.seek("m/reader", 0);

    expect(prepareRunCount).toBe(2);
    expect(lastObservedIds).toEqual(["b1", "b2"]);
  });

  it("prepare refusal names the slot", () => {
    const catalog = new PluginCatalog();
    catalog.register(fkPlugin);
    const engine = createEngine(catalog);

    const project: ProjectDefinition = {
      schemaVersion: 5,
      motions: [
        {
          id: "m",
          trigger: { type: "manual" },
          tracks: [
            {
              id: "chain",
              type: "body2d",
              input: {
                values: [
                  { id: "root", cells: { length: 10, rotation: 0 } },
                  { id: "c", cells: { parentId: "root", length: 10, rotation: 0 } },
                ],
              },
            },
            {
              id: "base",
              type: "root2d",
              input: { values: { x: 0, y: 0, rotation: 0 } },
            },
            {
              id: "solved",
              type: "solved2d",
              input: {
                values: [{ id: "root", cells: { rotation: 0 } }],
              },
            },
            {
              id: "fkNode",
              plugin: "fk",
              input: {
                values: {},
                requires: {
                  chain: "chain",
                  base: "base",
                  solved: "solved",
                },
              },
            },
          ],
        },
      ],
    };

    expect(() => {
      engine.load(project);
    }).toThrowError(/solved.*member "c"/);
  });

  it("state reaches transform", () => {
    let stateAtTransform: unknown;

    const StateTestingPlugin: PluginDefinition = {
      id: "state-test-plugin",
      inputs: {
        values: { kind: "record", fields: {} },
      },
      outputs: { values: { kind: "record", fields: {} } },
      prepare() {
        return ok({ boneLookup: { a: 0, b: 1 } });
      },
      transform(ctx) {
        stateAtTransform = ctx.state;
        return { values: {} };
      },
    };

    const catalog = new PluginCatalog();
    catalog.register(StateTestingPlugin);
    const engine = createEngine(catalog);

    const project: ProjectDefinition = {
      schemaVersion: 5,
      motions: [
        {
          id: "m",
          trigger: { type: "manual" },
          tracks: [
            {
              id: "t",
              plugin: "state-test-plugin",
              input: { values: {} },
            },
          ],
        },
      ],
    };

    const handle = engine.load(project);
    handle.seek("m/t", 0);

    expect(stateAtTransform).toEqual({ boneLookup: { a: 0, b: 1 } });
  });

  it("commit-time refusal on source track", () => {
    const catalog = new PluginCatalog({ models: [Body2d] });
    const engine = createEngine(catalog);

    const projectWithCycle: ProjectDefinition = {
      schemaVersion: 5,
      motions: [
        {
          id: "m",
          trigger: { type: "manual" },
          tracks: [
            {
              id: "cyclicBody",
              type: "Body2d",
              input: {
                values: [
                  { id: "a", cells: { parentId: "b", length: 10, rotation: 0 } },
                  { id: "b", cells: { parentId: "a", length: 10, rotation: 0 } },
                ],
              },
            },
          ],
        },
      ],
    };

    expect(() => {
      engine.load(projectWithCycle);
    }).toThrow();
  });

  it("computed output static cell change errors with output-static-changed", () => {
    let currentFrame = 0;

    const MutatingOutputPlugin: PluginDefinition = {
      id: "mutating-plugin",
      inputs: {
        values: { kind: "record", fields: {} },
      },
      outputs: { values: BoneModel },
      transform() {
        const boneId = currentFrame >= 2 ? "mutated-bone" : "initial-bone";
        return {
          values: [{ id: boneId, cells: { length: 10, rotation: 0 } }],
        };
      },
    };

    const catalog = new PluginCatalog({ models: [BoneModel] });
    catalog.register(MutatingOutputPlugin);
    const engine = createEngine(catalog);

    const project: ProjectDefinition = {
      schemaVersion: 5,
      motions: [
        {
          id: "m",
          trigger: { type: "manual" },
          tracks: [
            {
              id: "mut",
              plugin: "mutating-plugin",
              input: { values: {} },
            },
          ],
        },
      ],
    };

    const handle = engine.load(project);

    currentFrame = 0;
    handle.seek("m/mut", 0);

    currentFrame = 2;
    handle.seek("m/mut", 0.5);
    const patch = handle.get("m/mut");
    expect(patch?.status).toBe("error");
    expect(patch?.diagnostics.map((d) => d.ruleId)).toContain("output-static-changed");
  });

  it("D19 Property Test over Body2d static structure invariant", () => {
    const skeletonFixed = [
      { id: "root", parentId: undefined },
      { id: "spine", parentId: "root" },
      { id: "neck", parentId: "spine" },
      { id: "head", parentId: "neck" },
    ];

    const makeBodyValue = (rotations: readonly number[], lengths: readonly number[]) =>
      skeletonFixed.map((bone, i) => ({
        id: bone.id,
        cells: {
          ...(bone.parentId !== undefined ? { parentId: bone.parentId } : {}),
          rotation: rotations[i] ?? 0,
          length: lengths[i] ?? 10,
        },
      }));

    const baseline = Body2d.parse?.(makeBodyValue([0, 0, 0, 0], [10, 10, 10, 10]));
    expect(baseline?.ok).toBe(true);
    if (!baseline || !baseline.ok) return;

    const permutations = [
      makeBodyValue([45, -30, 15, 90], [12, 14, 8, 20]),
      makeBodyValue([-180, 180, 0, -45], [5, 25, 10, 15]),
      makeBodyValue([360, 720, -720, 0.001], [100, 1, 50, 0.5]),
    ];

    for (const perm of permutations) {
      const parsed = Body2d.parse?.(perm);
      expect(parsed?.ok).toBe(true);
      if (parsed?.ok) {
        expect(parsed.value.ids).toEqual(baseline.value.ids);
        expect(parsed.value.leaves).toEqual(baseline.value.leaves);
        for (const id of baseline.value.ids) {
          expect(parsed.value.parentById.get(id)).toBe(baseline.value.parentById.get(id));
        }
      }
    }
  });
});
