import { describe, expect, it, vi } from "vitest";
import { shape, typed } from "@motion5/core/plugin-api";
import type {
  DataType,
  Patch,
  PluginDefinition,
  ProjectDefinition,
  ResolvedInput,
  SourceStructures,
  Structure,
  Table,
  Value,
  ValueSpec,
} from "../../src/contract/v5";
import { PluginCatalog } from "../../src/domain/plugin-catalog";
import { Engine } from "../../src/engine";
import { createManualClock } from "../../src/ports/clock";
import { PluginTrack } from "../../src/runtime/plugin-track";
import type { SourceRef } from "../../src/runtime/source-ref";
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
    requires: { data: shape({ outputs: { values: POINT } }) },
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

  it("accepts an omitted optional slot", () => {
    const optional: PluginDefinition = {
      id: "optional",
      inputs: {
        values: { kind: "record", fields: { n: { kind: "number" } } },
        requires: { data: shape({ outputs: { values: POINT }, optional: true }) },
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
        requires: { data: shape({ outputs: { values: POINT }, optional: true }) },
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
        requires: { data: shape({ outputs: { values: POINT } }) },
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
        requires: { data: shape({ outputs: { values: POINT }, binding: "map" }) },
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

  it("refuses a malformed first output set", () => {
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
    if (patch?.status === "error")
      expect(patch.diagnostics.map(({ ruleId }) => ruleId)).toContain("output-undeclared");
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

  for (const memberKey of ["__proto__", "constructor"] as const) {
    it(`preserves ${memberKey} as an own member key in requires, structures, and refs`, () => {
      interface HardeningStructure {
        readonly tag: string;
      }
      const hardeningType: DataType<HardeningStructure, { readonly values: Table }> = {
        id: "hardening-type",
        spec: POINT,
        parse(_value: Value) {
          return { kind: "parsed", structure: { tag: "parsed-tag" }, warnings: [] };
        },
        bind(_structure: Structure<HardeningStructure>, value: Value) {
          if (!Array.isArray(value)) throw new TypeError("Expected table");
          return { values: value as Table };
        },
      };

      let capturedStructures: SourceStructures | undefined;
      let capturedRequires: Record<string, unknown> | undefined;

      const consumerPlugin: PluginDefinition = {
        id: "consumer",
        inputs: {
          values: { kind: "record", fields: { n: { kind: "number" } } },
          requires: { data: typed(hardeningType, { binding: "map" }) },
        },
        outputs: { values: POINT },
        checkSources(structures) {
          capturedStructures = structures;
          return [];
        },
        transform(input) {
          const map = input.requires.data;
          if (typeof map === "object" && map !== null) {
            capturedRequires = map as Record<string, unknown>;
          }
          return { values: table(row("out", { x: 0, y: 0 })) };
        },
      };

      const sourceTrack = {
        ...track({ id: "src", values: table(row("p1", { x: 1, y: 2 })) }),
        type: "hardening-type",
      };

      const binding = JSON.parse(`{"${memberKey}": "src"}`) as Record<string, string>;
      const consumerTrack = track({
        id: "consumer-track",
        plugin: "consumer",
        values: record({ n: 0 }),
        requires: { data: binding },
      });

      const composeSpy = vi.spyOn(PluginTrack.prototype, "compose");
      try {
        const cat = catalog(consumerPlugin);
        const handle = engine(cat).load(project([sourceTrack, consumerTrack]));
        try {
          handle.mount("demo/src");
          handle.mount("demo/consumer-track");
          handle.seek("demo/src", 0.5);
          handle.seek("demo/consumer-track", 0.5);

          expect(capturedStructures).toBeDefined();
          const structuresRecord = capturedStructures?.data;
          expect(typeof structuresRecord).toBe("object");
          if (typeof structuresRecord === "object" && structuresRecord !== null) {
            expect(Object.hasOwn(structuresRecord, memberKey)).toBe(true);
            expect(Object.getPrototypeOf(structuresRecord)).toBe(Object.prototype);
            const memberStructure = (structuresRecord as Record<string, unknown>)[memberKey] as
              | Structure<HardeningStructure>
              | undefined;
            expect(memberStructure).toBeDefined();
          }

          expect(composeSpy).toHaveBeenCalled();
          const sources = composeSpy.mock.calls[0]?.[1];
          expect(sources).toBeDefined();
          const sourcesRecord = sources?.data;
          expect(typeof sourcesRecord).toBe("object");
          if (typeof sourcesRecord === "object" && sourcesRecord !== null) {
            expect(Object.hasOwn(sourcesRecord, memberKey)).toBe(true);
            expect(Object.getPrototypeOf(sourcesRecord)).toBe(Object.prototype);
            const memberRef = (sourcesRecord as Record<string, unknown>)[memberKey] as
              | SourceRef
              | undefined;
            expect(memberRef?.sourceId).toBe("demo/src");
          }

          expect(capturedRequires).toBeDefined();
          if (capturedRequires !== undefined) {
            expect(Object.hasOwn(capturedRequires, memberKey)).toBe(true);
            expect(Object.getPrototypeOf(capturedRequires)).toBe(Object.prototype);
            const memberValue = capturedRequires[memberKey] as
              | { readonly values: Table }
              | undefined;
            expect(memberValue?.values).toEqual(table(row("p1", { x: 1, y: 2 })));
          }
        } finally {
          handle.dispose();
        }
      } finally {
        composeSpy.mockRestore();
      }
    });
  }
});
