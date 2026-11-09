import { describe, expect, it, vi } from "vitest";
import type {
  PluginDefinition,
  ProjectDefinition,
  Table,
  ValueSpec,
} from "../../../src/contract/v5";
import { PluginCatalog } from "../../../src/domain/plugin-catalog";
import { defineModel, ok, prepareRefused } from "../../../src/contract/v5";
import { diagnostic } from "../../../src/contract/diagnostics";
import { Engine } from "../../../src/engine";
import { createManualClock } from "../../../src/ports/clock";
import { createValueEvaluator } from "../../../src/runtime/evaluate-values";
import { LocalInput } from "../../../src/runtime/local-input";
import { PassthroughProcessor } from "../../../src/runtime/processors/passthrough";
import { Track } from "../../../src/runtime/track";
import { createFakeInterpolator, createFakeScheduler } from "../../../src/testing/fakes";
import { testModels } from "../../support/test-models";
import { Spec } from "../../../src/contract/spec-builder";

const POINT_SPEC: ValueSpec = Spec.table({
  owner: Spec.string({ static: true }),
  x: Spec.number(),
  y: Spec.number(),
});
const OUTPUT_SPEC: ValueSpec = Spec.table({ x: Spec.number(), y: Spec.number() });
const OUTPUT_SPEC_MODEL = defineModel({ id: "OutputSpecOut", spec: OUTPUT_SPEC });

interface PointStructure {
  readonly ids: readonly string[];
}

type ConsumeInput = {
  readonly values: Readonly<Record<string, never>>;
  readonly requires: { readonly data: Table };
};

const PointSource = defineModel<unknown, PointStructure>({
  id: "PointSource",
  spec: POINT_SPEC,
  parse(value) {
    if (!Array.isArray(value))
      return { ok: false, issues: [{ path: "", message: "Expected a table." }] };
    if (value.some((row) => Number(row.cells.y) > 10))
      return { ok: false, issues: [{ path: "", message: "y must stay at or below 10." }] };
    return { ok: true, value: { ids: value.map((row) => row.id) } };
  },
});

const CONSUME: PluginDefinition<ConsumeInput> = {
  id: "consume",
  inputs: {
    values: Spec.record({}),
    requires: { data: PointSource },
  },
  outputs: { values: OUTPUT_SPEC_MODEL },
  transform(input) {
    return {
      values: input.requires.data.map((row) => ({
        id: row.id,
        cells: { x: Number(row.cells.x), y: Number(row.cells.y) },
      })),
    };
  },
};

function project(model = "PointSource", plugin = "consume"): ProjectDefinition {
  return {
    schemaVersion: 5,
    motions: [
      {
        id: "demo",
        trigger: { type: "manual" },
        tracks: [
          {
            id: "points",
            input: { values: [{ id: "a", cells: { owner: "acme", x: 0, y: 1 } }] },
            output: { model },
          },
          {
            id: "consumer",
            output: { plugin },
            input: { values: {}, requires: { data: "points" } },
          },
        ],
      },
    ],
  };
}

function open(definition: ProjectDefinition) {
  const catalog = new PluginCatalog({ models: [...testModels, PointSource] });
  catalog.register({ plugins: [CONSUME] });
  return new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
    plugins: catalog,
  }).load(definition);
}

describe("self-validating model tracks", () => {
  it("brands structure at commit and resolves it without per-frame parsing", () => {
    const parse = vi.fn(PointSource.parse!);
    const trackedSource = defineModel({
      id: "TrackedPointSource",
      spec: POINT_SPEC,
      parse,
    });
    const trackedConsumer: PluginDefinition<ConsumeInput> = {
      ...CONSUME,
      id: "consume-tracked",
      inputs: { ...CONSUME.inputs, requires: { data: trackedSource } },
    };
    const catalog = new PluginCatalog({ models: [...testModels, trackedSource] });
    catalog.register({ plugins: [CONSUME, trackedConsumer] });
    const handle = new Engine({
      clock: createManualClock(),
      interpolator: createFakeInterpolator(),
      scheduler: createFakeScheduler(),
      plugins: catalog,
    }).load(project("TrackedPointSource", "consume-tracked"));
    handle.mount("demo/points");
    handle.mount("demo/consumer");
    handle.seek("demo/points", 0.5);
    handle.seek("demo/consumer", 0.5);
    handle.seek("demo/consumer", 1);
    expect(parse).toHaveBeenCalledTimes(1);
    expect(handle.get("demo/consumer")?.status).toBe("ready");
  });

  it("rejects live-write modifying a static cell directly", () => {
    const handle = open(project());
    expect(() =>
      handle.track("demo/points").writeValues([{ id: "a", cells: { owner: "other", x: 0, y: 1 } }]),
    ).toThrow(/live-values-invalid/);
  });

  it("refuses a static change on a cheap edit before adopting it", () => {
    const handle = open(project());
    const before = handle.track("demo/points").definition;
    expect(() =>
      handle
        .track("demo/points")
        .input.values.set([{ id: "a", cells: { owner: "other", x: 0, y: 2 } }]),
    ).toThrow(/live-values-invalid/);
    expect(handle.track("demo/points").definition).toBe(before);
  });

  it("rejects connecting a different model even when the value fits its spec", () => {
    expect(() => open(project("TestTable"))).toThrow(/slot-model-unsatisfied/);
  });

  it("keys a dotted model slot's structure by the full slot name", () => {
    const producer: PluginDefinition = {
      id: "producer",
      inputs: { values: Spec.record({}) },
      outputs: { values: PointSource },
      transform() {
        return { values: [{ id: "bad", cells: { owner: "acme", x: 1, y: 2 } }] };
      },
    };
    const guard: PluginDefinition = {
      id: "guard",
      inputs: {
        values: Spec.record({}),
        requires: { "data.points": PointSource },
      },
      outputs: { values: OUTPUT_SPEC_MODEL },
      prepare({ structures }) {
        const structure = structures["data.points"] as PointStructure | undefined;
        return structure?.ids.includes("bad") === true
          ? prepareRefused([
              diagnostic("plugin-validation-failed", "data.points", "identifier is reserved"),
            ])
          : ok(undefined);
      },
      transform() {
        return { values: [] };
      },
    };
    const catalog = new PluginCatalog({ models: [...testModels, PointSource] });
    catalog.register({ plugins: [producer, guard] });
    const handle = new Engine({
      clock: createManualClock(),
      interpolator: createFakeInterpolator(),
      scheduler: createFakeScheduler(),
      plugins: catalog,
    }).load({
      schemaVersion: 5,
      motions: [
        {
          id: "demo",
          trigger: { type: "manual" },
          tracks: [
            { id: "producer", output: { plugin: "producer" }, input: { values: {} } },
            {
              id: "guard",
              output: { plugin: "guard" },
              input: { values: {}, requires: { "data.points": "producer" } },
            },
          ],
        },
      ],
    });
    handle.mount("demo/producer");
    handle.mount("demo/guard");
    handle.seek("demo/guard", 0.5);
    expect(handle.get("demo/guard")?.status).toBe("error");
  });

  it("refuses an unknown model added through the structural tier", () => {
    const handle = open(project());
    expect(() =>
      handle.addTrack({ id: "bad", output: { model: "MissingModel" }, input: { values: [] } }),
    ).toThrow(/model-unknown/);
  });

  it("keeps a frozen structure on the compiled track", () => {
    const values = {
      kind: "table" as const,
      rows: [
        {
          id: "a",
          cells: {
            owner: { kind: "static" as const, scalar: "string" as const, value: "acme" },
            x: { kind: "static" as const, scalar: "number" as const, value: 0 },
            y: { kind: "static" as const, scalar: "number" as const, value: 1 },
          },
        },
      ],
    };
    const interpolator = createFakeInterpolator();
    const track = Track.source({
      nodeId: "~/points",
      values,
      interpolator,
      model: PointSource,
    });
    expect(track.structureAtCommit()).toBeDefined();
    expect(Object.isFrozen(track.structureAtCommit())).toBe(true);
  });
});
