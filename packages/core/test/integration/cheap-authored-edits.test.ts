import { describe, expect, it, vi } from "vitest";
import { shape } from "@motion5/core/plugin-api";
import type {
  PluginDefinition,
  ProjectDefinition,
  ResolvedInput,
  Table,
  Value,
  ValueSpec,
} from "../../src/contract/v5";
import { PluginCatalog } from "../../src/domain/plugin-catalog";
import { defineModel } from "../../src/contract/v5";
import { Engine, type ProjectHandle } from "../../src/engine";
import { createManualClock } from "../../src/ports/clock";
import { ProjectRuntime } from "../../src/runtime/project-runtime";
import { createFakeInterpolator, createFakeScheduler } from "../../src/testing/fakes";
import { project, record, row, table, track } from "../support/v5-builders";
import { testModels } from "../support/test-models";

const POINT: ValueSpec = {
  kind: "table",
  schema: { row: { fields: { x: { kind: "number" }, y: { kind: "number" } } } },
};
const POINT_MODEL = defineModel({ id: "PointOut", spec: POINT });
type TranslateValues = Readonly<Record<"dx", number>>;
type TranslateInput = ResolvedInput<TranslateValues> & {
  readonly requires: { readonly data: { readonly values: Table } };
};
const TRANSLATE: PluginDefinition<TranslateInput> = {
  id: "translate",
  inputs: {
    values: { kind: "record", fields: { dx: { kind: "number" } } },
    requires: { data: shape({ outputs: { values: POINT } }) },
  },
  outputs: { values: POINT_MODEL },
  transform(input) {
    return {
      values: input.requires.data.values.map((entry) => ({
        id: entry.id,
        cells: {
          x: Number(entry.cells.x) + input.values.dx,
          y: Number(entry.cells.y),
        },
      })),
    };
  },
};

function catalog<Input extends ResolvedInput>(
  ...plugins: readonly PluginDefinition<Input>[]
): PluginCatalog {
  const result = new PluginCatalog({ models: [...testModels, ABRecord, PointTable] });
  result.register({ plugins: plugins });
  return result;
}

const PointTable = defineModel({
  id: "PointTable",
  spec: {
    kind: "table",
    schema: { row: { fields: { x: { kind: "number" }, y: { kind: "number" } } } },
  },
});
const ABRecord = defineModel({
  id: "ABRecord",
  spec: { kind: "record", fields: { a: { kind: "number" }, b: { kind: "number" } } },
});

const POINTS = track({
  id: "points",
  values: table(row("r1", { x: 1, y: 2 })),
  model: "PointTable",
});
const RECORD = track({
  id: "record",
  values: record({ a: 1, b: 2 }),
  model: "ABRecord",
});
const SHIFTED = track({
  id: "shifted",
  plugin: "translate",
  values: record({ dx: 10 }),
  requires: { data: "points" },
});
const DEFINITION: ProjectDefinition = project([POINTS, RECORD, SHIFTED]);

function engine(): Engine {
  return new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
    plugins: catalog(TRANSLATE),
  });
}

function runtimeOf(handle: ProjectHandle): ProjectRuntime {
  return (handle as ProjectHandle & { readonly _runtime: ProjectRuntime })._runtime;
}

function outputsOf(handle: ProjectHandle, nodeId: string): unknown {
  return outputsIn(handle.seek(nodeId, 0), nodeId);
}

function outputsIn(batch: ReturnType<ProjectHandle["seek"]>, nodeId: string): unknown {
  const patch = batch.patches.find((candidate) => candidate.nodeId === nodeId);
  if (patch?.status !== "ready")
    throw new Error(`Expected a ready patch for ${nodeId}: ${JSON.stringify(batch)}`);
  return patch.outputs.values;
}

function thrownBy(operation: () => unknown): unknown {
  try {
    operation();
  } catch (error) {
    return error;
  }
  throw new Error("Expected the operation to throw.");
}

describe("cheap authored edits move values without a rebuild", () => {
  it("writes one record field, moves the definition and publishes once", () => {
    const handle = engine().load(DEFINITION);
    try {
      handle.mount("demo/record");
      expect(outputsOf(handle, "demo/record")).toEqual({ a: 1, b: 2 });
      const flush = vi.spyOn(runtimeOf(handle).graph, "flush");

      const batch = handle.track("demo/record").input.values.setField({ field: "a" }, 9);

      expect(flush).toHaveBeenCalledTimes(1);
      expect(batch.patches).toHaveLength(1);
      expect(outputsIn(batch, "demo/record")).toEqual({ a: 9, b: 2 });
      expect(handle.track("demo/record").definition.input?.values).toEqual({ a: 9, b: 2 });
    } finally {
      handle.dispose();
    }
  });

  it("refuses a row-set change because row ids are static", () => {
    const handle = engine().load(DEFINITION);
    try {
      handle.mount("demo/points");
      const before = handle.track("demo/points").definition;
      expect(() =>
        handle.track("demo/points").input.values.set([
          { id: "b", cells: { x: 5, y: 6 } },
          { id: "a", cells: { x: 7, y: 8 } },
        ]),
      ).toThrow(/track\.input\.replace/);
      expect(handle.track("demo/points").definition).toBe(before);
    } finally {
      handle.dispose();
    }
  });

  it("publishes once for a value batch and refuses identically inside it", () => {
    const handle = engine().load(DEFINITION);
    try {
      handle.mount("demo/points");
      handle.mount("demo/record");
      const standalone = thrownBy(() =>
        handle.track("demo/points").input.values.set(record({ x: 1 })),
      );
      const inBatch = thrownBy(() =>
        handle.values((transaction) => {
          transaction.track("demo/points").input.values.set(record({ x: 1 }));
        }),
      );
      expect((inBatch as Error).message).toBe((standalone as Error).message);

      const flush = vi.spyOn(runtimeOf(handle).graph, "flush");
      const batch = handle.values((transaction) => {
        transaction.track("demo/record").input.values.setField({ field: "a" }, 4);
        transaction.track("demo/points").input.values.setField({ row: "r1", field: "y" }, 6);
      });

      expect(flush).toHaveBeenCalledTimes(1);
      expect(batch.patches.map((patch) => patch.nodeId).sort()).toEqual([
        "demo/points",
        "demo/record",
        "demo/shifted",
      ]);
      expect(outputsIn(batch, "demo/record")).toEqual({ a: 4, b: 2 });
      expect(outputsIn(batch, "demo/points")).toEqual([{ id: "r1", cells: { x: 1, y: 6 } }]);
      expect(handle.track("demo/record").definition.input?.values).toEqual({ a: 4, b: 2 });
      expect(handle.track("demo/points").definition.input?.values).toEqual([
        { id: "r1", cells: { x: 1, y: 6 } },
      ]);
    } finally {
      handle.dispose();
    }
  });
});

describe("an authored edit under an overlay keeps the overlay", () => {
  it("moves the authored definition and still publishes the overlaid value", () => {
    const overlay = new Map<string, Value>();
    const fallback = { a: 1, b: 2 } as const;
    const runtime = new ProjectRuntime(project([RECORD]), {
      capabilities: catalog(),
      clock: createManualClock(),
      compose: (node) => () => ({
        outputs: { values: overlay.get(node.id) ?? fallback },
        sourceProgress: 0,
        sourceRevisions: {},
      }),
      overlayValues: (nodeId, value) => {
        if (value === undefined) overlay.delete(nodeId);
        else overlay.set(nodeId, value);
      },
    });
    try {
      runtime.mount("demo/record");
      expect(runtime.seek("demo/record", 0).patches[0]?.status).toBe("ready");
      const handle = runtime.track("demo/record");
      handle.writeValues({ a: 9, b: 2 });

      const flush = vi.spyOn(runtime.graph, "flush");
      const batch = handle.input.values.setField({ field: "b" }, 5);

      expect(flush).toHaveBeenCalledTimes(1);
      // The overlay makes the authored change invisible, so the republication is identical and the
      // registry suppresses it. The one flush still happened, and the retained patch is the overlay.
      expect(batch.patches).toEqual([]);
      const retained = runtime.graph.registry.get("demo/record");
      expect(retained?.status).toBe("ready");
      expect(retained?.status === "ready" ? retained.outputs.values : undefined).toEqual({
        a: 9,
        b: 2,
      });
      expect(handle.definition.input?.values).toEqual({ a: 1, b: 5 });
      expect(overlay.get("demo/record")).toEqual({ a: 9, b: 2 });
    } finally {
      runtime.dispose();
    }
  });
});
