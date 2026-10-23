import { describe, expect, it } from "vitest";
import type {
  Patch,
  PluginDefinition,
  ProjectDefinition,
  ResolvedInput,
  Table,
  ValueSpec,
} from "../../src/contract/v5";
import { PluginCatalog } from "../../src/domain/plugin-catalog";
import { Engine } from "../../src/engine";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/testing/fakes";
import { outputOf, project, record, row, table, track } from "../support/v5-builders";

type TranslateValues = Readonly<Record<"dx" | "dy", number>>;
type TranslateInput = ResolvedInput<TranslateValues> & {
  readonly requires: { readonly data: { readonly values: Table } };
};

const POINT: ValueSpec = {
  kind: "table",
  schema: { row: { fields: { x: { kind: "number" }, y: { kind: "number" } } } },
};

const TRANSLATE: PluginDefinition<TranslateInput> = {
  id: "translate",
  inputs: {
    values: { kind: "record", fields: { dx: { kind: "number" }, dy: { kind: "number" } } },
    requires: { data: { outputs: { values: POINT } } },
  },
  outputs: { values: POINT },
  transform(input) {
    return {
      values: input.requires.data.values.map((source) => {
        const x = source.cells.x;
        const y = source.cells.y;
        if (typeof x !== "number" || typeof y !== "number")
          throw new TypeError("Translate requires numeric source cells.");
        return {
          id: source.id,
          cells: { x: x + input.values.dx, y: y + input.values.dy },
        };
      }),
    };
  },
};

function catalog<Input extends ResolvedInput>(
  ...plugins: readonly PluginDefinition<Input>[]
): PluginCatalog {
  const result = new PluginCatalog();
  result.registerAll(plugins);
  return result;
}

function engine(plugins: PluginCatalog) {
  return new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
    plugins,
  });
}

function patchesAt(
  definition: ProjectDefinition,
  plugins: PluginCatalog,
  progress: number,
): ReadonlyMap<string, Patch> {
  const handle = engine(plugins).load(definition);
  try {
    const ids = handle.motion("demo").trackIds;
    for (const id of ids) handle.mount(id);
    const patches = new Map<string, Patch>();
    for (const id of ids) {
      const batch = handle.seek(id, progress);
      for (const patch of batch.patches) patches.set(patch.nodeId, patch);
    }
    return patches;
  } finally {
    handle.dispose();
  }
}

function point(id: string, x: number, y: number) {
  return track({ id, values: table(row("point-a", { x, y })) });
}

function shifted(id: string, dx: number, dy: number, source: string) {
  return track({
    id,
    plugin: "translate",
    values: record({ dx, dy }),
    requires: { data: source },
  });
}

function runOne(plugin: PluginDefinition, definition: ReturnType<typeof track>): Patch | undefined {
  const handle = engine(catalog(plugin)).load(project([definition]));
  try {
    const nodeId = `demo/${definition.id}`;
    handle.mount(nodeId);
    const batch = handle.seek(nodeId, 0.5);
    return batch.patches.find((candidate) => candidate.nodeId === nodeId);
  } finally {
    handle.dispose();
  }
}

describe("identified plugin runtime", () => {
  it("runs points -> translate through the real graph and publisher", () => {
    const patches = patchesAt(
      project([point("points", 50, 20), shifted("shifted-points", 10, 5, "points")]),
      catalog(TRANSLATE),
      0.5,
    );

    const patch = patches.get("demo/shifted-points");
    expect(patch?.status).toBe("ready");
    const values = outputOf(patch, "values");
    expect(values).toEqual(table(row("point-a", { x: 60, y: 25 })));
  });

  it("preserves source ids and publishes no local parameter names", () => {
    const patches = patchesAt(
      project([point("points", 50, 20), shifted("shifted-points", 10, 5, "points")]),
      catalog(TRANSLATE),
      0.5,
    );

    const values = outputOf(patches.get("demo/shifted-points"), "values");
    if (!Array.isArray(values)) throw new Error("Expected a table output.");
    expect(values.map(({ id }) => id)).toEqual(["point-a"]);
    expect(values[0]?.cells).not.toHaveProperty("dx");
    expect(values[0]?.cells).not.toHaveProperty("dy");
    expect(values[0]?.cells).not.toHaveProperty("translate");
  });

  it("recomputes when the local parameter changes", () => {
    const patches = patchesAt(
      project([point("points", 50, 20), shifted("shifted-points", 20, 5, "points")]),
      catalog(TRANSLATE),
      0.5,
    );

    expect(outputOf(patches.get("demo/shifted-points"), "values")).toEqual(
      table(row("point-a", { x: 70, y: 25 })),
    );
  });

  it("blocks the consumer when the upstream is not ready and publishes no partial output", () => {
    const definition = project([
      point("points", 50, 20),
      shifted("shifted-points", 10, 5, "points"),
    ]);
    const handle = engine(catalog(TRANSLATE)).load(definition);
    try {
      const batch = handle.seek("demo/shifted-points", 0.5);
      const patch = batch.patches.find(({ nodeId }) => nodeId === "demo/shifted-points");
      expect(patch?.status).toBe("blocked");
      expect(patch).not.toHaveProperty("outputs");
    } finally {
      handle.dispose();
    }
  });

  it("sees an upstream result produced earlier in the same flush", () => {
    const definition = project([
      point("points", 50, 20),
      shifted("shifted-points", 10, 5, "points"),
    ]);
    const handle = engine(catalog(TRANSLATE)).load(definition);
    try {
      const ids = handle.motion("demo").trackIds;
      for (const id of ids) handle.mount(id);
      const batch = handle.seek("demo/shifted-points", 0.5);
      const patch = batch.patches.find(({ nodeId }) => nodeId === "demo/shifted-points");
      expect(patch?.status).toBe("ready");
      expect(outputOf(patch, "values")).toEqual(table(row("point-a", { x: 60, y: 25 })));
    } finally {
      handle.dispose();
    }
  });

  it("reports an undeclared output on the node and publishes no partial set", () => {
    const bad: PluginDefinition = {
      id: "bad",
      inputs: { values: { kind: "record", fields: { n: { kind: "number" } } } },
      outputs: { values: POINT },
      transform() {
        return { other: [] };
      },
    };
    const patch = runOne(bad, track({ id: "bad", plugin: "bad", values: record({ n: 1 }) }));

    expect(patch?.status).toBe("error");
    expect(patch).not.toHaveProperty("outputs");
    if (patch?.status === "error")
      expect(patch.diagnostics.map(({ ruleId }) => ruleId)).toContain("output-undeclared");
  });

  it("reports a missing required output", () => {
    const bad: PluginDefinition = {
      id: "bad",
      inputs: { values: { kind: "record", fields: { n: { kind: "number" } } } },
      outputs: { values: POINT },
      transform() {
        return {};
      },
    };
    const patch = runOne(bad, track({ id: "bad", plugin: "bad", values: record({ n: 1 }) }));

    expect(patch?.status).toBe("error");
    if (patch?.status === "error")
      expect(patch.diagnostics.map(({ ruleId }) => ruleId)).toContain("output-missing");
  });

  it("reports an output of the wrong kind", () => {
    const bad: PluginDefinition = {
      id: "bad",
      inputs: { values: { kind: "record", fields: { n: { kind: "number" } } } },
      outputs: { values: POINT },
      transform() {
        return { values: { n: 1 } };
      },
    };
    const patch = runOne(bad, track({ id: "bad", plugin: "bad", values: record({ n: 1 }) }));

    expect(patch?.status).toBe("error");
    if (patch?.status === "error")
      expect(patch.diagnostics.map(({ ruleId }) => ruleId)).toContain("output-invalid");
  });

  it("reports duplicate output row ids", () => {
    const bad: PluginDefinition = {
      id: "bad",
      inputs: { values: { kind: "record", fields: { n: { kind: "number" } } } },
      outputs: { values: POINT },
      transform() {
        return {
          values: [
            { id: "same", cells: { x: 1, y: 2 } },
            { id: "same", cells: { x: 3, y: 4 } },
          ],
        };
      },
    };
    const patch = runOne(bad, track({ id: "bad", plugin: "bad", values: record({ n: 1 }) }));

    expect(patch?.status).toBe("error");
    if (patch?.status === "error")
      expect(patch.diagnostics.map(({ ruleId }) => ruleId)).toContain("output-row-id-duplicate");
  });

  it("wraps a plugin validation error and skips the transform", () => {
    let transforms = 0;
    const bad: PluginDefinition = {
      id: "bad",
      inputs: { values: { kind: "record", fields: { n: { kind: "number" } } } },
      outputs: { values: POINT },
      validate() {
        return [
          {
            ruleId: "composition-failure",
            path: "input.n",
            message: "n must be positive",
            severity: "error",
            ids: [],
          },
        ];
      },
      transform() {
        transforms += 1;
        return { values: [] };
      },
    };
    const patch = runOne(bad, track({ id: "bad", plugin: "bad", values: record({ n: 1 }) }));

    expect(transforms).toBe(0);
    expect(patch?.status).toBe("error");
    if (patch?.status === "error")
      expect(patch.diagnostics.map(({ ruleId }) => ruleId)).toContain("plugin-validation-failed");
  });

  it("carries a validation warning on the ready patch", () => {
    const warned: PluginDefinition = {
      id: "warned",
      inputs: { values: { kind: "record", fields: { n: { kind: "number" } } } },
      outputs: { values: POINT },
      validate() {
        return [
          {
            ruleId: "composition-failure",
            path: "input.n",
            message: "n is small",
            severity: "warning",
            ids: [],
          },
        ];
      },
      transform() {
        return { values: [] };
      },
    };
    const patch = runOne(
      warned,
      track({ id: "warned", plugin: "warned", values: record({ n: 1 }) }),
    );

    expect(patch?.status).toBe("ready");
    if (patch?.status === "ready")
      expect(patch.diagnostics.map(({ ruleId }) => ruleId)).toContain("plugin-validation-warning");
  });

  it("refuses dependency input that fails the slot spec at runtime", () => {
    const wide: PluginDefinition = {
      id: "wide",
      inputs: { values: { kind: "record", fields: { n: { kind: "number" } } } },
      outputs: { values: POINT },
      transform() {
        return { values: [{ id: "point-a", cells: { x: 100, y: 1 } }] };
      },
    };
    const narrow: PluginDefinition = {
      id: "narrow",
      inputs: {
        values: { kind: "record", fields: { dx: { kind: "number" } } },
        requires: {
          data: {
            outputs: {
              values: {
                kind: "table",
                schema: {
                  row: {
                    fields: {
                      x: { kind: "number", max: 10 },
                      y: { kind: "number" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      outputs: { values: POINT },
      transform() {
        return { values: [] };
      },
    };
    const definition = project([
      track({ id: "wide", plugin: "wide", values: record({ n: 1 }) }),
      track({
        id: "narrow",
        plugin: "narrow",
        values: record({ dx: 1 }),
        requires: { data: "wide" },
      }),
    ]);
    const patches = patchesAt(definition, catalog(wide, narrow), 0.5);

    const patch = patches.get("demo/narrow");
    expect(patch?.status).toBe("error");
    if (patch?.status === "error")
      expect(patch.diagnostics.map(({ ruleId }) => ruleId)).toContain("plugin-input-invalid");
  });

  it("accepts an omitted optional slot", () => {
    const optional: PluginDefinition = {
      id: "optional",
      inputs: {
        values: { kind: "record", fields: { n: { kind: "number" } } },
        requires: { data: { outputs: { values: POINT }, optional: true } },
      },
      outputs: { values: POINT },
      transform() {
        return { values: [] };
      },
    };
    const patch = runOne(
      optional,
      track({ id: "optional", plugin: "optional", values: record({ n: 1 }) }),
    );

    expect(patch?.status).toBe("ready");
  });

  it("blocks an optional bound slot when its source is not ready", () => {
    let transforms = 0;
    const optional: PluginDefinition = {
      id: "optional",
      inputs: {
        values: { kind: "record", fields: { n: { kind: "number" } } },
        requires: { data: { outputs: { values: POINT }, optional: true } },
      },
      outputs: { values: POINT },
      transform() {
        transforms += 1;
        return { values: [] };
      },
    };
    const definition = project([
      point("points", 1, 2),
      track({
        id: "optional",
        plugin: "optional",
        values: record({ n: 1 }),
        requires: { data: "points" },
      }),
    ]);
    const handle = engine(catalog(optional)).load(definition);
    try {
      const batch = handle.seek("demo/optional", 0.5);
      const patch = batch.patches.find(({ nodeId }) => nodeId === "demo/optional");
      expect(patch?.status).toBe("blocked");
      expect(transforms).toBe(0);
    } finally {
      handle.dispose();
    }
  });

  it("treats an empty ready table as data", () => {
    const emptyOk: PluginDefinition = {
      id: "empty-ok",
      inputs: {
        values: { kind: "record", fields: { n: { kind: "number" } } },
        requires: { data: { outputs: { values: POINT } } },
      },
      outputs: { values: POINT },
      transform() {
        return { values: [] };
      },
    };
    const definition = project([
      track({
        id: "points",
        values: table(),
        schema: {
          kind: "table",
          schema: { row: { fields: { x: { kind: "number" }, y: { kind: "number" } } } },
        },
      }),
      track({
        id: "empty-ok",
        plugin: "empty-ok",
        values: record({ n: 1 }),
        requires: { data: "points" },
      }),
    ]);
    const patches = patchesAt(definition, catalog(emptyOk), 0.5);

    expect(patches.get("demo/empty-ok")?.status).toBe("ready");
    expect(outputOf(patches.get("demo/empty-ok"), "values")).toEqual([]);
  });

  it("resolves a map slot one member at a time", () => {
    type MapInput = ResolvedInput<{ readonly n: number }> & {
      readonly requires: { readonly data: Readonly<Record<string, { readonly values: Table }>> };
    };
    const map: PluginDefinition<MapInput> = {
      id: "concat",
      inputs: {
        values: { kind: "record", fields: { n: { kind: "number" } } },
        requires: { data: { outputs: { values: POINT }, binding: "map" } },
      },
      outputs: { values: POINT },
      transform(input) {
        const rows = Object.values(input.requires.data).flatMap(({ values }) => values);
        return { values: rows };
      },
    };
    const definition = project([
      track({ id: "upper", values: table(row("upper-a", { x: 1, y: 2 })) }),
      track({ id: "lower", values: table(row("lower-a", { x: 3, y: 4 })) }),
      track({
        id: "both",
        plugin: "concat",
        values: record({ n: 1 }),
        requires: { data: { upper: "upper", lower: "lower" } },
      }),
    ]);
    const patches = patchesAt(definition, catalog(map), 0.5);

    expect(patches.get("demo/both")?.status).toBe("ready");
    const values = outputOf(patches.get("demo/both"), "values");
    if (!Array.isArray(values)) throw new Error("Expected a table output.");
    expect(values.map(({ id }) => id)).toEqual(["lower-a", "upper-a"]);
  });

  it("keeps an independent branch ready when another branch errors", () => {
    const bad: PluginDefinition = {
      id: "bad",
      inputs: {
        values: { kind: "record", fields: { dx: { kind: "number" }, dy: { kind: "number" } } },
        requires: { data: { outputs: { values: POINT } } },
      },
      outputs: { values: POINT },
      transform() {
        return {};
      },
    };
    const definition = project([
      point("points", 1, 2),
      shifted("good", 1, 1, "points"),
      track({
        id: "bad-branch",
        plugin: "bad",
        values: record({ dx: 1, dy: 1 }),
        requires: { data: "points" },
      }),
    ]);
    const patches = patchesAt(definition, catalog(TRANSLATE, bad), 0.5);

    expect(patches.get("demo/good")?.status).toBe("ready");
    expect(patches.get("demo/bad-branch")?.status).toBe("error");
  });

  it("publishes a table output and a record output in one node", () => {
    const both: PluginDefinition = {
      id: "both",
      inputs: { values: { kind: "record", fields: { n: { kind: "number" } } } },
      outputs: {
        values: POINT,
        inspect: { kind: "record", fields: { n: { kind: "number" } } },
      },
      transform() {
        return {
          values: [{ id: "point-a", cells: { x: 1, y: 2 } }],
          inspect: { n: 7 },
        };
      },
    };
    const patch = runOne(both, track({ id: "both", plugin: "both", values: record({ n: 1 }) }));

    expect(patch?.status).toBe("ready");
    if (patch?.status === "ready") {
      expect(patch.outputs.values).toBeDefined();
      expect(patch.outputs.inspect).toEqual({ n: 7 });
      expect(Object.isFrozen(patch.outputs)).toBe(true);
    }
  });

  it("refuses a promise or bare array returned by transform", () => {
    for (const result of [Promise.resolve({ values: [] }), []] as const) {
      const bad: PluginDefinition = {
        id: "bad",
        inputs: { values: { kind: "record", fields: { n: { kind: "number" } } } },
        outputs: { values: POINT },
        transform: () => result as unknown as import("../../src/contract/v5").Outputs,
      };
      const patch = runOne(bad, track({ id: "bad", plugin: "bad", values: record({ n: 1 }) }));
      expect(patch?.status).toBe("error");
      if (patch?.status === "error")
        expect(patch.diagnostics.map(({ ruleId }) => ruleId)).toContain("output-invalid");
    }
  });

  it("turns a thrown transform into a node error", () => {
    const bad: PluginDefinition = {
      id: "bad",
      inputs: { values: { kind: "record", fields: { n: { kind: "number" } } } },
      outputs: { values: POINT },
      transform() {
        throw new Error("transform failed");
      },
    };
    const patch = runOne(bad, track({ id: "bad", plugin: "bad", values: record({ n: 1 }) }));

    expect(patch?.status).toBe("error");
    if (patch?.status === "error")
      expect(patch.diagnostics.map(({ ruleId }) => ruleId)).toContain("composition-failure");
  });

  it("turns a thrown validator into a validation error", () => {
    const bad: PluginDefinition = {
      id: "bad",
      inputs: { values: { kind: "record", fields: { n: { kind: "number" } } } },
      outputs: { values: POINT },
      validate() {
        throw new Error("validate failed");
      },
      transform() {
        return { values: [] };
      },
    };
    const patch = runOne(bad, track({ id: "bad", plugin: "bad", values: record({ n: 1 }) }));

    expect(patch?.status).toBe("error");
    if (patch?.status === "error")
      expect(patch.diagnostics.map(({ ruleId }) => ruleId)).toContain("plugin-validation-failed");
  });

  it("refuses non-finite, nested, host and cyclic output values", () => {
    const cyclic: Record<string, unknown> = {};
    cyclic.self = cyclic;
    const values: readonly unknown[] = [
      { n: Number.POSITIVE_INFINITY },
      { n: { nested: 1 } },
      { n: new Date(0) },
      cyclic,
      { n: 1, extra: 2 },
    ];
    for (const value of values) {
      const bad: PluginDefinition = {
        id: "bad",
        inputs: { values: { kind: "record", fields: { n: { kind: "number" } } } },
        outputs: { inspect: { kind: "record", fields: { n: { kind: "number" } } } },
        transform: () => ({ inspect: value }) as unknown as import("../../src/contract/v5").Outputs,
      };
      const patch = runOne(bad, track({ id: "bad", plugin: "bad", values: record({ n: 1 }) }));
      expect(patch?.status).toBe("error");
      if (patch?.status === "error")
        expect(patch.diagnostics.map(({ ruleId }) => ruleId)).toContain("output-invalid");
    }
  });

  it("freezes the published output set and its rows", () => {
    const patches = patchesAt(
      project([point("points", 1, 2), shifted("shifted", 1, 1, "points")]),
      catalog(TRANSLATE),
      0.5,
    );
    const shiftedPatch = patches.get("demo/shifted");
    if (shiftedPatch?.status !== "ready") throw new Error("Expected a ready patch.");
    expect(Object.isFrozen(shiftedPatch.outputs)).toBe(true);
    const values = shiftedPatch.outputs.values;
    if (!Array.isArray(values)) throw new Error("Expected a table output.");
    expect(Object.isFrozen(values)).toBe(true);
    expect(Object.isFrozen(values[0])).toBe(true);
    expect(Object.isFrozen(values[0]?.cells)).toBe(true);
  });
});
