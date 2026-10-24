import { describe, expect, it, vi } from "vitest";
import type {
  PatchBatch,
  PluginDefinition,
  ProjectDefinition,
  ResolvedInput,
  Table,
  ValueSpec,
} from "../../src/contract/v5";
import { diagnostic } from "../../src/contract/diagnostics";
import { PluginCatalog } from "../../src/domain/plugin-catalog";
import { Engine, type ProjectHandle } from "../../src/engine";
import { createManualClock } from "../../src/ports/clock";
import { ProjectRuntime } from "../../src/runtime/project-runtime";
import { createFakeInterpolator, createFakeScheduler } from "../../src/testing/fakes";
import { project, record, row, table, track } from "../support/v5-builders";

const POINT: ValueSpec = {
  kind: "table",
  schema: { row: { fields: { x: { kind: "number" }, y: { kind: "number" } } } },
};
type TranslateValues = Readonly<Record<"dx", number>>;
type TranslateInput = ResolvedInput<TranslateValues> & {
  readonly requires: { readonly data: { readonly values: Table } };
};
const TRANSLATE: PluginDefinition<TranslateInput> = {
  id: "translate",
  inputs: {
    values: { kind: "record", fields: { dx: { kind: "number" } } },
    requires: { data: { outputs: { values: POINT }, optional: true } },
  },
  outputs: { values: POINT },
  transform(input) {
    const source = input.requires.data?.values ?? [];
    return {
      values: source.map((entry) => ({
        id: entry.id,
        cells: {
          x: Number(entry.cells.x) + input.values.dx,
          y: Number(entry.cells.y),
        },
      })),
    };
  },
};
type GuardedInput = ResolvedInput<TranslateValues>;
const GUARDED: PluginDefinition<GuardedInput> = {
  id: "guarded",
  inputs: { values: { kind: "record", fields: { dx: { kind: "number" } } } },
  outputs: { values: { kind: "record", fields: { n: { kind: "number" } } } },
  validate(input) {
    return input.values.dx < 0
      ? [diagnostic("plugin-validation-failed", "dx", "dx must be non-negative.")]
      : [];
  },
  transform(input) {
    return { values: { n: input.values.dx } };
  },
};
const WATCHFUL: PluginDefinition<TranslateInput> = {
  id: "watchful",
  inputs: {
    values: { kind: "record", fields: { dx: { kind: "number" } } },
    requires: { data: { outputs: { values: POINT } } },
  },
  outputs: { values: POINT },
  validate(input) {
    return input.requires.data.values.length === 0
      ? [diagnostic("plugin-validation-failed", "data", "data must not be empty.")]
      : [];
  },
  transform() {
    return { values: [] };
  },
};

function catalog<Input extends ResolvedInput>(
  ...plugins: readonly PluginDefinition<Input>[]
): PluginCatalog {
  const result = new PluginCatalog();
  result.registerAll(plugins);
  return result;
}

function engine<Input extends ResolvedInput>(
  ...plugins: readonly PluginDefinition<Input>[]
): Engine {
  return new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
    plugins: catalog(...plugins),
  });
}

function runtimeOf(handle: ProjectHandle): ProjectRuntime {
  return (handle as ProjectHandle & { readonly _runtime: ProjectRuntime })._runtime;
}

function patchFor(batch: PatchBatch, nodeId: string) {
  const patch = batch.patches.find((candidate) => candidate.nodeId === nodeId);
  if (patch === undefined) throw new Error(`Expected a patch for ${nodeId}.`);
  return patch;
}

function readyValues(batch: PatchBatch, nodeId: string): unknown {
  const patch = patchFor(batch, nodeId);
  if (patch.status !== "ready")
    throw new Error(`Expected a ready patch for ${nodeId}: ${JSON.stringify(patch)}`);
  return patch.outputs.values;
}

function publishedValues(runtime: ProjectRuntime, nodeId: string): unknown {
  const patch = runtime.graph.registry.get(nodeId);
  if (patch?.status !== "ready")
    throw new Error(`Expected a ready patch for ${nodeId}: ${JSON.stringify(patch)}`);
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

const POINTS = track({ id: "points", values: table(row("r1", { x: 1, y: 2 })) });
const RECORD = track({ id: "record", values: record({ a: 1, b: 2 }) });
const ANIMATED = track({
  id: "animated",
  values: record({
    a: [
      { p: 0, v: 0 },
      { p: 1, v: 10 },
    ],
    b: 2,
  }),
});
const SHIFTED = track({
  id: "shifted",
  plugin: "translate",
  values: record({ dx: 10 }),
  requires: { data: "points" },
});
const GUARDED_TRACK = track({ id: "guarded", plugin: "guarded", values: record({ dx: -1 }) });
const GUARDED_OFF = track({ id: "guarded-off", plugin: "guarded", values: record({ dx: 1 }) });
const WATCHED = track({
  id: "watched",
  plugin: "watchful",
  values: record({ dx: 1 }),
  requires: { data: "points" },
});

describe("a live overlay replaces the whole value and releases back to authored", () => {
  it("writes, replaces wholesale and releases at the current progress", () => {
    const handle = engine().load(project([POINTS, RECORD]));
    try {
      handle.mount("demo/points");
      expect(readyValues(handle.seek("demo/points", 0), "demo/points")).toEqual([
        { id: "r1", cells: { x: 1, y: 2 } },
      ]);
      const runtime = runtimeOf(handle);
      const flush = vi.spyOn(runtime.graph, "flush");
      const points = handle.track("demo/points");

      const first = points.writeValues([
        { id: "r2", cells: { x: 5, y: 6 } },
        { id: "r3", cells: { x: 7, y: 8 } },
      ]);
      expect(flush).toHaveBeenCalledTimes(1);
      expect(readyValues(first, "demo/points")).toEqual([
        { id: "r2", cells: { x: 5, y: 6 } },
        { id: "r3", cells: { x: 7, y: 8 } },
      ]);

      // No partial merge: the second write is the whole published table.
      const second = points.writeValues([{ id: "r3", cells: { x: 9, y: 9 } }]);
      expect(readyValues(second, "demo/points")).toEqual([{ id: "r3", cells: { x: 9, y: 9 } }]);
      expect(flush).toHaveBeenCalledTimes(2);

      // The authored definition never moved, which is what says a write names no authored row.
      expect(points.definition.input?.values).toEqual([{ id: "r1", cells: { x: 1, y: 2 } }]);

      const released = points.releaseValues();
      expect(flush).toHaveBeenCalledTimes(3);
      expect(readyValues(released, "demo/points")).toEqual([{ id: "r1", cells: { x: 1, y: 2 } }]);

      const empty = points.releaseValues();
      expect(empty.patches).toEqual([]);
      expect(flush).toHaveBeenCalledTimes(3);
    } finally {
      handle.dispose();
    }
  });

  it("keeps the previous overlay when a write is refused, in both shape directions", () => {
    const handle = engine().load(project([POINTS, RECORD]));
    try {
      handle.mount("demo/points");
      handle.mount("demo/record");
      const points = handle.track("demo/points");
      points.writeValues([{ id: "over", cells: { x: 4, y: 4 } }]);
      const record = handle.track("demo/record");
      record.writeValues({ a: 9, b: 2 });

      const wrongForTable = thrownBy(() => points.writeValues({ a: 1, b: 2 }));
      expect((wrongForTable as Error).message).toMatch(/live-values-invalid/);
      const wrongForRecord = thrownBy(() =>
        record.writeValues([{ id: "r", cells: { a: 1, b: 2 } }]),
      );
      expect((wrongForRecord as Error).message).toMatch(/live-values-invalid/);

      expect(publishedValues(runtimeOf(handle), "demo/points")).toEqual([
        { id: "over", cells: { x: 4, y: 4 } },
      ]);
      expect(publishedValues(runtimeOf(handle), "demo/record")).toEqual({ a: 9, b: 2 });
    } finally {
      handle.dispose();
    }
  });

  it("survives authored edits, bindings and seeks, and releases at the progress it reached", () => {
    const handle = engine(TRANSLATE).load(project([ANIMATED, POINTS, SHIFTED]));
    try {
      handle.mount("demo/animated");
      const runtime = runtimeOf(handle);
      const flush = vi.spyOn(runtime.graph, "flush");
      const animated = handle.track("demo/animated");

      animated.writeValues({ a: 9, b: 2 });
      animated.input.values.setField({ field: "b" }, 7);
      expect(animated.definition.input?.values).toEqual({
        a: [
          { p: 0, v: 0 },
          { p: 1, v: 10 },
        ],
        b: 7,
      });
      expect(publishedValues(runtime, "demo/animated")).toEqual({
        a: 9,
        b: 2,
      });

      handle.seek("demo/animated", 0.75);
      expect(publishedValues(runtime, "demo/animated")).toEqual({
        a: 9,
        b: 2,
      });

      const released = animated.releaseValues();
      expect(readyValues(released, "demo/animated")).toEqual({ a: 7.5, b: 7 });

      // A binding edit keeps the overlay in the same way an authored edit does.
      handle.mount("demo/points");
      handle.mount("demo/shifted");
      const shifted = handle.track("demo/shifted");
      shifted.writeValues({ dx: 5 });
      shifted.input.requires.remove("data");
      shifted.input.requires.set("data", "points");
      expect(publishedValues(runtime, "demo/shifted")).toEqual([
        { id: "r1", cells: { x: 6, y: 2 } },
      ]);
      expect(flush.mock.calls.length).toBeGreaterThan(0);
    } finally {
      handle.dispose();
    }
  });

  it("clears the overlay on a structural replacement and on removal", () => {
    const handle = engine().load(project([ANIMATED]));
    try {
      handle.mount("demo/animated");
      const animated = handle.track("demo/animated");
      animated.writeValues({ a: 9, b: 2 });

      animated.replace({ id: "animated", input: { values: record({ a: 1, b: 2 }) } });
      expect(publishedValues(runtimeOf(handle), "demo/animated")).toEqual({
        a: 1,
        b: 2,
      });

      animated.writeValues({ a: 9, b: 2 });
      animated.remove();
      expect(handle.tryTrack("demo/animated")).toBeUndefined();
    } finally {
      handle.dispose();
    }
  });
});

describe("a live overlay on an errored node", () => {
  it("lets a valid write and a release clear the error", () => {
    const handle = engine(GUARDED).load(project([GUARDED_TRACK, GUARDED_OFF]));
    try {
      handle.mount("demo/guarded");
      handle.mount("demo/guarded-off");
      const guarded = handle.track("demo/guarded");
      const error = handle.seek("demo/guarded", 0);
      expect(patchFor(error, "demo/guarded").status).toBe("error");

      const valid = guarded.writeValues({ dx: 2 });
      expect(patchFor(valid, "demo/guarded").status).toBe("ready");
      expect(readyValues(valid, "demo/guarded")).toEqual({ n: 2 });

      // Authored dx is one, so an invalid overlay errors and releasing it recovers.
      const off = handle.track("demo/guarded-off");
      expect(patchFor(handle.seek("demo/guarded-off", 0), "demo/guarded-off").status).toBe("ready");
      expect(patchFor(off.writeValues({ dx: -1 }), "demo/guarded-off").status).toBe("error");

      const released = off.releaseValues();
      expect(patchFor(released, "demo/guarded-off").status).toBe("ready");
      expect(readyValues(released, "demo/guarded-off")).toEqual({ n: 1 });
    } finally {
      handle.dispose();
    }
  });

  it("turns a valid overlay into a node error when a dependency changes", () => {
    const handle = engine(WATCHFUL).load(project([POINTS, WATCHED]));
    try {
      handle.mount("demo/points");
      handle.mount("demo/watched");
      const watched = handle.track("demo/watched");
      expect(patchFor(watched.writeValues({ dx: 5 }), "demo/watched").status).toBe("ready");

      const emptied = handle.track("demo/points").input.values.set([]);
      expect(patchFor(emptied, "demo/watched").status).toBe("error");

      // The overlay still stands, so releasing onto the empty source leaves the same error. The
      // identical republication is suppressed, as every unchanged error patch is.
      const released = watched.releaseValues();
      expect(released.patches.some((patch) => patch.nodeId === "demo/watched")).toBe(false);
      expect(runtimeOf(handle).graph.registry.get("demo/watched")?.status).toBe("error");
    } finally {
      handle.dispose();
    }
  });

  it("still passes a plugin write through the transform", () => {
    const handle = engine(TRANSLATE).load(project([POINTS, SHIFTED]));
    try {
      handle.mount("demo/points");
      handle.mount("demo/shifted");
      const shifted = handle.track("demo/shifted");
      expect(readyValues(shifted.writeValues({ dx: 5 }), "demo/shifted")).toEqual([
        { id: "r1", cells: { x: 6, y: 2 } },
      ]);
      expect(shifted.definition.input?.values).toEqual({ dx: 10 });
    } finally {
      handle.dispose();
    }
  });
});

describe("a value batch owns one publication for live writes too", () => {
  it("publishes once and refuses identically inside the recipe", () => {
    const handle = engine().load(project([POINTS, RECORD]));
    try {
      handle.mount("demo/points");
      handle.mount("demo/record");
      const standalone = thrownBy(() => handle.track("demo/points").writeValues({ a: 1, b: 2 }));
      const inBatch = thrownBy(() =>
        handle.values((transaction) => {
          transaction.track("demo/points").writeValues({ a: 1, b: 2 });
        }),
      );
      expect((inBatch as Error).message).toBe((standalone as Error).message);

      const flush = vi.spyOn(runtimeOf(handle).graph, "flush");
      const batch = handle.values((transaction) => {
        transaction.track("demo/record").writeValues({ a: 4, b: 5 });
        transaction.track("demo/points").writeValues([{ id: "r2", cells: { x: 8, y: 9 } }]);
      });

      expect(flush).toHaveBeenCalledTimes(1);
      expect(readyValues(batch, "demo/record")).toEqual({ a: 4, b: 5 });
      expect(handle.track("demo/record").definition.input?.values).toEqual({ a: 1, b: 2 });
    } finally {
      handle.dispose();
    }
  });
});
