import { describe, expect, expectTypeOf, it } from "vitest";
import type { Patch, ProjectDefinition } from "../../src/contract/v5";
import type { RuleId } from "../../src/contract/rule-id";
import type {
  AuthoredCell,
  AuthoredRow,
  PatchPayload,
  PluginDefinition,
  ResolvedInput,
  Scalar,
  Table,
  TrackDefinition,
  TrackInput,
  ValueSpec,
} from "../../src/contract/v5";
import { Engine } from "../../src/engine";
import { PluginCatalog } from "../../src/domain/plugin-catalog";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/testing/fakes";
import {
  outputOf,
  project,
  record,
  row,
  table,
  track,
  type BuilderProject,
} from "../support/v5-builders";

/**
 * Phase 1 acceptance suite for the identified-table contract.
 *
 * The type cases below encode the settled direction. Runtime cases name the phase that owns the
 * behavior, and the Phase 3 plugin case runs against a real catalog rather than staying staged.
 */

type TranslateValues = Readonly<Record<"dx" | "dy", number>>;

/** The slice's translate plugin, registered by the acceptance engine below. */
const translatePlugin: PluginDefinition<
  ResolvedInput<TranslateValues> & {
    readonly requires: { readonly data: { readonly values: Table } };
  }
> = {
  id: "translate",
  inputs: {
    values: {
      kind: "record",
      fields: { dx: { kind: "number" }, dy: { kind: "number" } },
    },
    requires: {
      data: {
        outputs: {
          values: {
            kind: "table",
            schema: {
              row: { fields: { x: { kind: "number" }, y: { kind: "number" } } },
            },
          },
        },
      },
    },
  },
  outputs: {
    values: {
      kind: "table",
      schema: {
        row: { fields: { x: { kind: "number" }, y: { kind: "number" } } },
      },
    },
  },
  transform(input) {
    return {
      values: input.requires.data.values.map((row) => {
        const x = row.cells.x;
        const y = row.cells.y;
        if (typeof x !== "number" || typeof y !== "number")
          throw new TypeError("Translate requires numeric source cells.");
        return {
          id: row.id,
          cells: { x: x + input.values.dx, y: y + input.values.dy },
        };
      }),
    };
  },
};

function defaultCatalog(): PluginCatalog {
  const catalog = new PluginCatalog();
  catalog.register(translatePlugin);
  return catalog;
}

function catalogOf(...plugins: readonly PluginDefinition[]): PluginCatalog {
  const catalog = new PluginCatalog();
  catalog.registerAll(plugins);
  return catalog;
}

function engine(plugins: PluginCatalog = defaultCatalog()) {
  return new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
    plugins,
  });
}

function load(definition: BuilderProject, plugins: PluginCatalog = defaultCatalog()) {
  return engine(plugins).load(definition);
}

/** Load a deliberately malformed authored document, disposing it when the engine accepts it. */
function loadAndDispose(definition: unknown, plugins: PluginCatalog = defaultCatalog()): void {
  const handle = engine(plugins).load(definition as ProjectDefinition);
  handle.dispose();
}

/**
 * The payload one node publishes at one progress.
 *
 * Every track is mounted and sought at the same progress: a bound dependency contributes its own
 * scheduled result, so seeking only the consumer would leave the dependency unpublished.
 */
function patchAt(
  definition: BuilderProject,
  nodeId: string,
  progress: number,
  plugins: PluginCatalog = defaultCatalog(),
): PatchPayload | undefined {
  const handle = load(definition, plugins);
  try {
    const trackIds = handle.motion("demo").trackIds;
    for (const id of trackIds) handle.mount(id);
    let patch: Patch | undefined;
    for (const id of trackIds) {
      const batch = handle.seek(id, progress);
      patch ??= batch.patches.find((candidate) => candidate.nodeId === nodeId);
    }
    return patch;
  } finally {
    handle.dispose();
  }
}

/** A typed predicate for rule assertions, so a misspelled id fails `typecheck`. */
function rule(id: RuleId): RegExp {
  return new RegExp(id);
}

function malformed(trackDefinition: unknown): unknown {
  return {
    schemaVersion: 5,
    motions: [
      {
        id: "demo",
        trigger: { type: "manual" },
        tracks: [trackDefinition],
      },
    ],
  };
}

describe("v5 contract direction", () => {
  it("settles the authored track and input member sets", () => {
    expectTypeOf<keyof TrackDefinition>().toEqualTypeOf<"id" | "plugin" | "input" | "duration">();
    expectTypeOf<keyof TrackInput>().toEqualTypeOf<"values" | "requires" | "schema">();
  });

  it("refuses old grouped, flat-row, structured-cell and type-alias forms", () => {
    // Excess-property checking is the refusal here: structural assignability would accept the
    // extra key, and `keyof` above is what proves the target track has no slot for it.
    // @ts-expect-error grouped keyframes are not part of the target track
    const grouped: TrackDefinition = { id: "legacy", keyframes: {} };
    // @ts-expect-error observes is not part of the target track
    const observes: TrackDefinition = { id: "legacy", observes: [] };
    void grouped;
    void observes;
    expectTypeOf<{ x: number }>().not.toExtend<AuthoredRow>();
    expectTypeOf<{ literal: number }>().not.toExtend<AuthoredCell>();
    expectTypeOf<{ type: "record"; fields: Record<string, never> }>().not.toExtend<ValueSpec>();
    expectTypeOf<null>().not.toExtend<Scalar>();
  });
});

describe("v5 source evaluation", () => {
  it("[staged Phase 2] publishes an inferred table source row-per-point at progress 0.5", () => {
    const points = track({
      id: "points",
      values: table(
        row("point-a", {
          x: [
            { p: 0, v: 0 },
            { p: 1, v: 100 },
          ],
          y: 20,
        }),
        row("point-b", { x: 200, y: 40 }),
      ),
    });

    const patch = patchAt(project([points]), "demo/points", 0.5);

    expect(patch?.status).toBe("ready");
    expect(outputOf(patch, "values")).toEqual(
      table(row("point-a", { x: 50, y: 20 }), row("point-b", { x: 200, y: 40 })),
    );
  });

  it("[staged Phase 2] publishes a record source as a flat record", () => {
    const parameters = track({
      id: "parameters",
      values: record({
        dx: 10,
        dy: [
          { p: 0, v: 0 },
          { p: 1, v: 10 },
        ],
      }),
    });

    const patch = patchAt(project([parameters]), "demo/parameters", 0.5);

    expect(patch?.status).toBe("ready");
    expect(outputOf(patch, "values")).toEqual({ dx: 10, dy: 5 });
  });
});

describe("v5 explicit plugin slice", () => {
  it("[Phase 3] points -> translate preserves source ids and publishes only values", () => {
    const points = track({
      id: "points",
      values: table(
        row("point-a", {
          x: [
            { p: 0, v: 0 },
            { p: 1, v: 100 },
          ],
          y: 20,
        }),
        row("point-b", { x: 200, y: 40 }),
      ),
    });
    const shifted = track({
      id: "shifted-points",
      plugin: "translate",
      values: record({ dx: 10, dy: 5 }),
      requires: { data: "points" },
    });

    const patch = patchAt(project([points, shifted]), "demo/shifted-points", 0.5);
    const values = outputOf(patch, "values");

    expect(patch?.status).toBe("ready");
    expect(values).toEqual(
      table(row("point-a", { x: 60, y: 25 }), row("point-b", { x: 210, y: 45 })),
    );
    expect(values).not.toHaveProperty("dx");
    expect(values).not.toHaveProperty("dy");
  });
});

describe("v5 authored refusals", () => {
  it("[staged Phase 2] refuses grouped keyframes and observes under track-legacy-field", () => {
    expect(() =>
      loadAndDispose(malformed({ id: "legacy", keyframes: { transform: { values: { x: 0 } } } })),
    ).toThrow(rule("track-legacy-field"));
    expect(() =>
      loadAndDispose(malformed({ id: "legacy", observes: [{ source: "points" }] })),
    ).toThrow(rule("track-legacy-field"));
  });

  it("[staged Phase 2] refuses a flat row without the id/cells envelope", () => {
    expect(() =>
      loadAndDispose(
        malformed({ id: "points", input: { values: [{ point: "point-a", x: 0, y: 0 }] } }),
      ),
    ).toThrow(rule("row-id-invalid"));
  });

  it("[staged Phase 2] refuses a structured cell", () => {
    expect(() =>
      loadAndDispose(
        malformed({
          id: "points",
          input: { values: [{ id: "point-a", cells: { x: { literal: 1 } } }] },
        }),
      ),
    ).toThrow(rule("cell-form-invalid"));
  });

  it("[staged Phase 2] refuses a type descriptor in place of kind", () => {
    expect(() =>
      loadAndDispose(
        malformed({
          id: "parameters",
          input: {
            values: { dx: 10 },
            schema: { type: "record", fields: { dx: { kind: "number" } } },
          },
        }),
      ),
    ).toThrow(rule("spec-field-unknown"));
  });

  it("[staged Phase 2] refuses a table authored where the declared schema is a record", () => {
    expect(() =>
      loadAndDispose(
        malformed(
          track({
            id: "parameters",
            values: table(row("point-a", { dx: 10, dy: 5 })),
            schema: {
              kind: "record",
              fields: { dx: { kind: "number" }, dy: { kind: "number" } },
            },
          }),
        ),
      ),
    ).toThrow(rule("values-shape-invalid"));
  });

  it("[staged Phase 2] refuses stops in a static declared field", () => {
    expect(() =>
      loadAndDispose(
        malformed({
          id: "parameters",
          input: {
            values: {
              dx: [
                { p: 0, v: 10 },
                { p: 1, v: 20 },
              ],
            },
            schema: { kind: "record", fields: { dx: { kind: "number", static: true } } },
          },
        }),
      ),
    ).toThrow(rule("static-field-stops"));
  });

  it("[staged Phase 2] refuses an unregistered plugin as plugin-unknown", () => {
    expect(() =>
      loadAndDispose(
        malformed(track({ id: "shifted", plugin: "missing", values: record({ dx: 10 }) })),
      ),
    ).toThrow(rule("plugin-unknown"));
  });

  it("[staged Phase 2] refuses requires without a plugin as plugin-requires-without-plugin", () => {
    expect(() =>
      loadAndDispose(
        malformed(
          track({
            id: "points",
            values: record({ x: 0 }),
            requires: { data: "points" },
          }),
        ),
      ),
    ).toThrow(rule("plugin-requires-without-plugin"));
  });

  it("[staged Phase 2] refuses a source schema on a plugin track as input-schema-on-plugin-track", () => {
    expect(() =>
      loadAndDispose(
        malformed(
          track({
            id: "shifted",
            plugin: "translate",
            values: record({ dx: 10 }),
            schema: { kind: "record", fields: { dx: { kind: "number" } } },
          }),
        ),
      ),
    ).toThrow(rule("input-schema-on-plugin-track"));
  });

  it("[staged Phase 2] refuses duplicate row ids as row-id-duplicate", () => {
    expect(() =>
      loadAndDispose(
        malformed(
          track({
            id: "points",
            values: table(row("point-a", { x: 0 }), row("point-a", { x: 1 })),
          }),
        ),
      ),
    ).toThrow(rule("row-id-duplicate"));
  });

  it("[staged Phase 2] refuses a reserved row id as name-reserved", () => {
    expect(() =>
      loadAndDispose(malformed(track({ id: "points", values: table(row("__proto__", { x: 0 })) }))),
    ).toThrow(rule("name-reserved"));
  });

  it("[staged Phase 2] refuses an empty bare stop array as cell-stops-invalid", () => {
    expect(() =>
      loadAndDispose(malformed(track({ id: "parameters", values: record({ dx: [] }) }))),
    ).toThrow(rule("cell-stops-invalid"));
  });

  it("[staged Phase 2] refuses a stop position outside [0, 1] as cell-stops-invalid", () => {
    expect(() =>
      loadAndDispose(
        malformed(track({ id: "parameters", values: record({ dx: [{ p: 1.5, v: 0 }] }) })),
      ),
    ).toThrow(rule("cell-stops-invalid"));
  });

  it("[staged Phase 2] refuses mixed scalar kinds in one stop sequence as cell-kind-conflict", () => {
    expect(() =>
      loadAndDispose(
        malformed(
          track({
            id: "parameters",
            values: record({
              dx: [
                { p: 0, v: 0 },
                { p: 1, v: "one" },
              ],
            }),
          }),
        ),
      ),
    ).toThrow(rule("cell-kind-conflict"));
  });
});

describe("v5 registration-dependent refusals", () => {
  const POINT: ValueSpec = {
    kind: "table",
    schema: { row: { fields: { x: { kind: "number" }, y: { kind: "number" } } } },
  };

  function plainPlugin(
    id: string,
    transform: PluginDefinition["transform"],
    outputs: Readonly<Record<string, ValueSpec>> = { values: POINT },
  ): PluginDefinition {
    return {
      id,
      inputs: { values: { kind: "record", fields: { n: { kind: "number" } } } },
      outputs,
      transform,
    };
  }

  function badPatch(plugin: PluginDefinition) {
    const malformedTrack = track({
      id: plugin.id,
      plugin: plugin.id,
      values: record({ n: 1 }),
    });
    return patchAt(project([malformedTrack]), `demo/${plugin.id}`, 0.5, catalogOf(plugin));
  }

  it("[Phase 3] slot-unknown refuses a binding to an undeclared slot", () => {
    const points = track({
      id: "points",
      values: table(row("point-a", { x: 0, y: 1 })),
    });
    const shifted = track({
      id: "shifted",
      plugin: "translate",
      values: record({ dx: 1, dy: 1 }),
      requires: { missing: "points" },
    });

    expect(() => loadAndDispose(project([points, shifted]))).toThrow(rule("slot-unknown"));
  });

  it("[Phase 3] slot-incompatible refuses a mismatched slot output", () => {
    const parameters = track({ id: "parameters", values: record({ x: 0, y: 1 }) });
    const shifted = track({
      id: "shifted",
      plugin: "translate",
      values: record({ dx: 1, dy: 1 }),
      requires: { data: "parameters" },
    });

    expect(() => loadAndDispose(project([parameters, shifted]))).toThrow(rule("slot-incompatible"));
  });

  it("[Phase 3] output-undeclared refuses an output the plugin did not declare", () => {
    const patch = badPatch(plainPlugin("bad", () => ({ other: [] })));

    expect(patch?.status).toBe("error");
    if (patch?.status === "error")
      expect(patch.diagnostics.map(({ ruleId }) => ruleId)).toContain("output-undeclared");
  });

  it("[Phase 3] output-missing refuses a required declared output that is absent", () => {
    const patch = badPatch(plainPlugin("bad", () => ({})));

    expect(patch?.status).toBe("error");
    if (patch?.status === "error")
      expect(patch.diagnostics.map(({ ruleId }) => ruleId)).toContain("output-missing");
  });

  it("[Phase 3] output-invalid refuses an output that fails its spec", () => {
    const patch = badPatch(plainPlugin("bad", () => ({ values: { n: 1 } })));

    expect(patch?.status).toBe("error");
    if (patch?.status === "error")
      expect(patch.diagnostics.map(({ ruleId }) => ruleId)).toContain("output-invalid");
  });

  it("[Phase 3] output-row-id-duplicate refuses duplicate output row ids", () => {
    const patch = badPatch(
      plainPlugin("bad", () => ({
        values: [
          { id: "same", cells: { x: 1, y: 2 } },
          { id: "same", cells: { x: 3, y: 4 } },
        ],
      })),
    );

    expect(patch?.status).toBe("error");
    if (patch?.status === "error")
      expect(patch.diagnostics.map(({ ruleId }) => ruleId)).toContain("output-row-id-duplicate");
  });

  it("[Phase 3] plugin-input-invalid refuses input that fails the plugin input spec", () => {
    const wide = plainPlugin("wide", () => ({
      values: [{ id: "point-a", cells: { x: 100, y: 1 } }],
    }));
    const narrow = plainPlugin("narrow", () => ({ values: [] }));
    const narrowWithSlot: PluginDefinition = {
      ...narrow,
      inputs: {
        values: { kind: "record", fields: { n: { kind: "number" } } },
        requires: {
          data: {
            outputs: {
              values: {
                kind: "table",
                schema: { row: { fields: { x: { kind: "number", max: 10 } } } },
              },
            },
          },
        },
      },
    };
    const source = track({ id: "wide", plugin: "wide", values: record({ n: 1 }) });
    const consumer = track({
      id: "narrow",
      plugin: "narrow",
      values: record({ n: 1 }),
      requires: { data: "wide" },
    });

    const patch = patchAt(
      project([source, consumer]),
      "demo/narrow",
      0.5,
      catalogOf(wide, narrowWithSlot),
    );

    expect(patch?.status).toBe("error");
    if (patch?.status === "error")
      expect(patch.diagnostics.map(({ ruleId }) => ruleId)).toContain("plugin-input-invalid");
  });

  it("[Phase 4] live-values-invalid refuses a live write that breaks the shape", () => {
    const definition = project([track({ id: "rows", values: table(row("r1", { x: 1, y: 2 })) })]);
    const handle = load(definition);
    try {
      handle.mount("demo/rows");
      expect(() => handle.track("demo/rows").writeValues(record({ x: 1 }))).toThrow(
        rule("live-values-invalid"),
      );
    } finally {
      handle.dispose();
    }
  });
});

describe("v5 plugin type direction", () => {
  it("[Phase 3] translate's declared input spec and authored type agree", () => {
    expectTypeOf<keyof TranslateValues>().toEqualTypeOf<"dx" | "dy">();
    const spec = translatePlugin.inputs.values;
    expect(spec.kind).toBe("record");
    if (spec.kind === "record") expect(Object.keys(spec.fields)).toEqual(["dx", "dy"]);
  });
});
