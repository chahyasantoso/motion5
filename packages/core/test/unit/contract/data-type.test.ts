import { describe, expect, it, vi } from "vitest";
import { typed } from "../../../src/contract/slot-spec";
import type {
  DataType,
  DataTypeParsed,
  PluginDefinition,
  ProjectDefinition,
  Structure,
  Table,
  Value,
  ValueSpec,
} from "../../../src/contract/v5";
import { PluginCatalog } from "../../../src/domain/plugin-catalog";
import { Engine } from "../../../src/engine";
import { createManualClock } from "../../../src/ports/clock";
import { ValueTrack } from "../../../src/runtime/value-track";
import { createFakeInterpolator, createFakeScheduler } from "../../../src/testing/fakes";

const POINT_SPEC: ValueSpec = {
  kind: "table",
  schema: {
    row: {
      fields: {
        owner: { kind: "string", static: true },
        x: { kind: "number" },
        y: { kind: "number" },
      },
    },
  },
};
const OUTPUT_SPEC: ValueSpec = {
  kind: "table",
  schema: { row: { fields: { x: { kind: "number" }, y: { kind: "number" } } } },
};

interface PointStructure {
  readonly ids: readonly string[];
}
interface PointEntity {
  readonly rows: Table;
}

const point2d: DataType<PointStructure, PointEntity> = {
  id: "point2d",
  spec: POINT_SPEC,
  parse(value: Value): DataTypeParsed<PointStructure> {
    if (!Array.isArray(value))
      return { kind: "refused", errors: [{ path: [], message: "Expected a table." }] };
    if (value.some((row) => Number(row.cells.y) > 10))
      return { kind: "refused", errors: [{ path: [], message: "y must stay at or below 10." }] };
    return { kind: "parsed", structure: { ids: value.map((row) => row.id) }, warnings: [] };
  },
  bind(structure: Structure<PointStructure>, value: Value): PointEntity {
    if (!Array.isArray(value)) throw new TypeError("A point entity requires a table.");
    const ids = value.map((row) => row.id);
    if (ids.length !== structure.ids.length || ids.some((id, index) => id !== structure.ids[index]))
      throw new TypeError("Point rows changed after commit.");
    return { rows: value };
  },
};

type ConsumeInput = {
  readonly values: Readonly<Record<string, never>>;
  readonly requires: { readonly data: PointEntity };
};

const CONSUME: PluginDefinition<ConsumeInput> = {
  id: "consume",
  inputs: {
    values: { kind: "record", fields: {} },
    requires: { data: typed(point2d) },
  },
  outputs: { values: OUTPUT_SPEC },
  transform(input) {
    return {
      values: input.requires.data.rows.map((row) => ({
        id: row.id,
        cells: { x: Number(row.cells.x), y: Number(row.cells.y) },
      })),
    };
  },
};

function project(sourceType?: string): ProjectDefinition {
  return {
    schemaVersion: 5,
    motions: [
      {
        id: "demo",
        trigger: { type: "manual" },
        tracks: [
          {
            id: "points",
            ...(sourceType === undefined ? {} : { type: sourceType }),
            input: { values: [{ id: "a", cells: { owner: "acme", x: 0, y: 1 } }] },
          },
          {
            id: "consumer",
            plugin: "consume",
            input: { values: {}, requires: { data: "points" } },
          },
        ],
      },
    ],
  };
}

function open(definition: ProjectDefinition) {
  const catalog = new PluginCatalog();
  catalog.registerAll([CONSUME]);
  return new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
    plugins: catalog,
  }).load(definition);
}

describe("self-validating data tracks", () => {
  it("brands structure at commit and binds it without per-frame parsing", () => {
    const parse = vi.fn(point2d.parse);
    const tracked: DataType<PointStructure, PointEntity> = { ...point2d, parse };
    const catalog = new PluginCatalog();
    catalog.registerAll([
      {
        ...CONSUME,
        inputs: {
          values: { kind: "record", fields: {} },
          requires: { data: typed(tracked) },
        },
      },
    ]);
    const handle = new Engine({
      clock: createManualClock(),
      interpolator: createFakeInterpolator(),
      scheduler: createFakeScheduler(),
      plugins: catalog,
    }).load(project("point2d"));
    handle.mount("demo/points");
    handle.mount("demo/consumer");
    handle.seek("demo/points", 0.5);
    handle.seek("demo/consumer", 0.5);
    handle.seek("demo/consumer", 1);
    expect(parse).toHaveBeenCalledTimes(1);
    expect(handle.get("demo/consumer")?.status).toBe("ready");
  });

  it("rejects live-write modifying a static cell directly", () => {
    const handle = open(project("point2d"));
    expect(() =>
      handle.track("demo/points").writeValues([{ id: "a", cells: { owner: "other", x: 0, y: 1 } }]),
    ).toThrow(/live-values-invalid/);
  });

  it("refuses a domain-invalid authored edit before adopting it", () => {
    const handle = open(project("point2d"));
    const before = handle.track("demo/points").definition;
    expect(() =>
      handle
        .track("demo/points")
        .input.values.set([{ id: "a", cells: { owner: "acme", x: 0, y: 20 } }]),
    ).toThrow(/data-type-invalid/);
    expect(handle.track("demo/points").definition).toBe(before);
  });

  it("rejects connecting a generic data track to a typed slot", () => {
    expect(() => open(project())).toThrow(/slot-type-mismatch/);
  });

  it("keys a dotted typed slot's structure by the full slot name", () => {
    const producer: PluginDefinition = {
      id: "producer",
      inputs: { values: { kind: "record", fields: {} } },
      outputs: {
        values: {
          kind: "table",
          schema: {
            row: {
              fields: {
                owner: { kind: "string" },
                x: { kind: "number" },
                y: { kind: "number" },
              },
            },
          },
        },
      },
      transform() {
        return { values: [{ id: "bad", cells: { owner: "acme", x: 1, y: 2 } }] };
      },
    };
    const guard: PluginDefinition = {
      id: "guard",
      inputs: {
        values: { kind: "record", fields: {} },
        requires: { "data.points": typed(point2d) },
      },
      outputs: { values: OUTPUT_SPEC },
      checkSources(structures) {
        const structure = structures["data.points"] as Structure<PointStructure> | undefined;
        return structure?.ids.includes("bad") === true
          ? [
              {
                ruleId: "plugin-validation-failed",
                path: "data.points",
                message: "identifier is reserved",
                severity: "error",
                ids: [],
              },
            ]
          : [];
      },
      transform() {
        return { values: [] };
      },
    };
    const catalog = new PluginCatalog();
    catalog.registerAll([producer, guard]);
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
            { id: "producer", plugin: "producer", input: { values: {} } },
            {
              id: "guard",
              plugin: "guard",
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

  it("validates a typed track added through the structural tier", () => {
    const handle = open(project("point2d"));
    expect(() => handle.addTrack({ id: "bad", type: "missing", input: { values: [] } })).toThrow(
      /data-type-unknown/,
    );
  });

  it("keeps a frozen structure on the compiled value track", () => {
    const track = new ValueTrack({
      nodeId: "~/points",
      values: {
        kind: "table",
        rows: [
          {
            id: "a",
            cells: {
              owner: { kind: "static", scalar: "string", value: "acme" },
              x: { kind: "static", scalar: "number", value: 0 },
              y: { kind: "static", scalar: "number", value: 1 },
            },
          },
        ],
      },
      interpolator: createFakeInterpolator(),
      dataType: point2d,
    });
    expect(track.structure).toBeDefined();
    expect(Object.isFrozen(track.structure)).toBe(true);
  });
});
