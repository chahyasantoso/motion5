import { describe, expect, it } from "vitest";
import type {
  AuthoredRecord,
  AuthoredValues,
  Diagnostic,
  PluginDefinition,
  TrackDefinition,
  ValueSpec,
} from "../../../src/contract/v5";
import { PluginCatalog } from "../../../src/domain/plugin-catalog";
import { qualifyMotionTrack } from "../../../src/graph/ids";
import type { CommittedContract } from "../../../src/graph/committed-contract";
import { deriveSourceContract } from "../../../src/contract/v5-infer";
import { parseTrackDefinition } from "../../../src/contract/v5-parse";
import {
  plan,
  type PlanEnvironment,
  type PlanOutcome,
  type PlanState,
  type PlannedTrack,
} from "../../../src/runtime/edit-plan";
import { planValueEdit, type TrackLookup } from "../../../src/runtime/edit-plan-values";
import type { CheapEdit, LiveEdit } from "../../../src/runtime/edit-types";
import { AUTHORED } from "../../../src/runtime/value-state";
import { record, row, table, track } from "../../support/v5-builders";

const POINT: ValueSpec = {
  kind: "table",
  schema: { row: { fields: { x: { kind: "number" }, y: { kind: "number" } } } },
};
const TRANSLATE: PluginDefinition = {
  id: "translate",
  inputs: {
    values: { kind: "record", fields: { dx: { kind: "number" } } },
    requires: { data: { outputs: { values: POINT } } },
  },
  outputs: { values: POINT },
  transform() {
    return { values: [] };
  },
};
const POINTS = track({
  id: "points",
  values: table(row("r1", { x: 1, y: 2 }), row("r2", { x: 3 })),
});
const RECORD = track({ id: "record", values: record({ label: "a", count: 1 }) });
const STATIC_SCHEMA: ValueSpec = {
  kind: "record",
  fields: { flip: { kind: "boolean", static: true }, n: { kind: "number" } },
};
const FLAGS = track({ id: "flags", values: record({ flip: false, n: 1 }), schema: STATIC_SCHEMA });
const SHIFTED = track({
  id: "shifted",
  plugin: "translate",
  values: record({ dx: 1 }),
  requires: { data: "points" },
});

function environment(plugins: readonly PluginDefinition[] = []): PlanEnvironment {
  const catalog = new PluginCatalog();
  catalog.registerAll(plugins);
  return {
    capabilities: catalog,
    isPluginRegistered: (pluginId) => catalog.isPluginAdmitted(pluginId),
  };
}

function contractFor(
  definition: TrackDefinition,
  plugins: readonly PluginDefinition[] = [],
): CommittedContract {
  const parsed = parseTrackDefinition(definition, definition.id, {
    isPluginRegistered: (pluginId) => plugins.some((plugin) => plugin.id === pluginId),
  });
  if (parsed.kind === "refused")
    throw new Error(
      `Fixture track does not parse: ${parsed.diagnostics
        .map((entry) => `${entry.ruleId} at ${entry.path}`)
        .join(", ")}`,
    );
  const plugin = plugins.find((candidate) => candidate.id === definition.plugin);
  const spec = plugin === undefined ? parsed.value.input.schema : plugin.inputs.values;
  const derived = deriveSourceContract(
    parsed.value.input.values,
    spec,
    `${definition.id}.input.values`,
  );
  if (derived.kind === "refused")
    throw new Error(
      `Fixture track does not derive a contract: ${derived.diagnostics
        .map((entry) => `${entry.ruleId} at ${entry.path}`)
        .join(", ")}`,
    );
  const input =
    plugin === undefined
      ? derived.value
      : Object.freeze({ spec: plugin.inputs.values, proven: true });
  const outputs =
    plugin === undefined
      ? Object.freeze({ values: input })
      : Object.freeze(
          Object.fromEntries(
            Object.entries(plugin.outputs).map(([name, outputSpec]) => [
              name,
              Object.freeze({ spec: outputSpec, proven: true }),
            ]),
          ),
        );
  return Object.freeze({
    ...(plugin === undefined ? {} : { plugin: plugin.id }),
    input,
    outputs,
    requires: Object.freeze({ ...parsed.value.input.requires }),
    slots: Object.freeze(plugin?.inputs.requires ?? {}),
  });
}

function state(
  definitions: readonly TrackDefinition[],
  plugins: readonly PluginDefinition[] = [],
): PlanState {
  const planned = new Map<string, PlannedTrack>();
  for (const [authoredIndex, definition] of definitions.entries()) {
    const nodeId = qualifyMotionTrack("demo", definition.id).value;
    planned.set(
      nodeId,
      Object.freeze({
        nodeId,
        track: definition,
        owner: "motion",
        ownerId: "demo",
        authoredIndex,
        valueState: AUTHORED,
        contract: contractFor(definition, plugins),
      }),
    );
  }
  return { tracks: planned };
}

function accepted(outcome: PlanOutcome) {
  if (outcome.kind === "refused")
    throw new Error(
      `Expected an accepted plan: ${outcome.diagnostics
        .map((entry) => `${entry.ruleId} at ${entry.path}`)
        .join(", ")}`,
    );
  return outcome.value;
}

function refused(outcome: PlanOutcome): readonly Diagnostic[] {
  if (outcome.kind === "accepted") throw new Error("Expected a refused plan.");
  return outcome.diagnostics;
}

function rules(outcome: PlanOutcome): readonly string[] {
  return refused(outcome).map((entry) => `${entry.ruleId} at ${entry.path}`);
}

function message(outcome: PlanOutcome): string {
  return refused(outcome)
    .map((entry) => entry.message)
    .join(" ");
}

describe("set-values validates against the committed contract, never an inference", () => {
  it("accepts an empty table on an inferred source and keeps the contract by identity", () => {
    const committed = state([POINTS]);
    const outcome = accepted(
      plan(committed, { kind: "set-values", nodeId: "demo/points", values: [] }, environment()),
    );

    expect(outcome.change?.kind).toBe("authored-values");
    expect(outcome.state.tracks.get("demo/points")?.track.input?.values).toEqual([]);
    expect(outcome.state.tracks.get("demo/points")?.contract).toBe(
      committed.tracks.get("demo/points")?.contract,
    );
    expect(outcome.state.tracks.get("demo/points")?.valueState).toBe(AUTHORED);
  });

  it("accepts a table with any row count inside the committed fields", () => {
    const values = table(
      row("r1", { x: 1, y: 2 }),
      row("r2", { x: 3, y: 4 }),
      row("r3", { x: 5, y: 6 }),
    );
    const outcome = accepted(
      plan(state([POINTS]), { kind: "set-values", nodeId: "demo/points", values }, environment()),
    );

    expect(outcome.state.tracks.get("demo/points")?.track.input?.values).toEqual(values);
  });

  it("accepts dropping the only row that omitted an optional column", () => {
    const outcome = accepted(
      plan(
        state([POINTS]),
        { kind: "set-values", nodeId: "demo/points", values: table(row("r2", { x: 3 })) },
        environment(),
      ),
    );

    expect(outcome.state.tracks.get("demo/points")?.track.input?.values).toEqual([
      { id: "r2", cells: { x: 3 } },
    ]);
  });

  it("refuses a missing required field, an unknown field, and a changed kind, each naming the replacement", () => {
    const missing = plan(
      state([POINTS]),
      {
        kind: "set-values",
        nodeId: "demo/points",
        values: table(row("r1", { y: 2 })),
      },
      environment(),
    );
    expect(rules(missing)[0]?.split(" at ")[0]).toBe("cell-form-invalid");
    expect(message(missing)).toContain("Required field 'x' is absent.");
    expect(message(missing)).toContain("track.input.replace(...)");

    const unknown = plan(
      state([POINTS]),
      {
        kind: "set-values",
        nodeId: "demo/points",
        values: table(row("r1", { x: 1, y: 2, z: 3 })),
      },
      environment(),
    );
    expect(rules(unknown)[0]?.split(" at ")[0]).toBe("cell-form-invalid");
    expect(message(unknown)).toContain("Field 'z' is not declared");

    const kind = plan(
      state([POINTS]),
      {
        kind: "set-values",
        nodeId: "demo/points",
        values: table(row("r1", { x: "one", y: 2 })),
      },
      environment(),
    );
    expect(rules(kind)[0]?.split(" at ")[0]).toBe("cell-kind-conflict");
    expect(message(kind)).toContain("track.replace(...)");
  });

  it("refuses a table-to-record change with the replacement hint", () => {
    const outcome = plan(
      state([POINTS]),
      { kind: "set-values", nodeId: "demo/points", values: record({ x: 1 }) },
      environment(),
    );

    expect(rules(outcome)[0]?.split(" at ")[0]).toBe("values-shape-invalid");
    expect(message(outcome)).toContain("track.input.replace(...) or track.replace(...)");
  });

  it("refuses stops on a field the declared schema marks static", () => {
    const outcome = plan(
      state([FLAGS]),
      {
        kind: "set-values",
        nodeId: "demo/flags",
        values: record({ flip: [{ p: 0, v: true }], n: 2 }),
      },
      environment(),
    );

    expect(rules(outcome)[0]?.split(" at ")[0]).toBe("static-field-stops");
    expect(message(outcome)).toContain("track.input.replace(...)");
  });

  it("keeps a declared schema and its contract unchanged", () => {
    const committed = state([FLAGS]);
    const outcome = accepted(
      plan(
        committed,
        { kind: "set-values", nodeId: "demo/flags", values: record({ flip: true, n: 2 }) },
        environment(),
      ),
    );

    const before = committed.tracks.get("demo/flags");
    const after = outcome.state.tracks.get("demo/flags");
    expect(after?.track.input?.schema).toBe(before?.track.input?.schema);
    expect(after?.contract).toBe(before?.contract);
  });

  it("answers the committed state by identity when the values are the same record", () => {
    const committed = state([RECORD]);
    const values = committed.tracks.get("demo/record")?.track.input?.values;
    const outcome = accepted(
      plan(
        committed,
        { kind: "set-values", nodeId: "demo/record", values: values as AuthoredValues },
        environment(),
      ),
    );

    expect(outcome.state).toBe(committed);
    expect(outcome.change).toBeUndefined();
  });

  it("refuses a plugin track's local values that cross the plugin's declared kind", () => {
    const plugins = [TRANSLATE];
    const outcome = plan(
      state([POINTS, SHIFTED], plugins),
      { kind: "set-values", nodeId: "demo/shifted", values: record({ dx: "one" }) },
      environment(plugins),
    );

    expect(rules(outcome)[0]?.split(" at ")[0]).toBe("cell-kind-conflict");
    expect(message(outcome)).toContain("track.input.replace(...)");
  });
});

describe("set-field writes one addressed cell and refuses an address it cannot reach", () => {
  it("writes one table cell and leaves every other row, field and order untouched", () => {
    const committed = state([POINTS]);
    const before = committed.tracks.get("demo/points")?.track.input?.values;
    const outcome = accepted(
      plan(
        committed,
        {
          kind: "set-field",
          nodeId: "demo/points",
          address: { row: "r1", field: "x" },
          cell: 9,
        },
        environment(),
      ),
    );

    const after = outcome.state.tracks.get("demo/points")?.track.input?.values;
    expect(after).toEqual([
      { id: "r1", cells: { x: 9, y: 2 } },
      { id: "r2", cells: { x: 3 } },
    ]);
    expect((after as readonly { id: string }[]).map((entry) => entry.id)).toEqual(["r1", "r2"]);
    expect(outcome.state.tracks.get("demo/points")?.contract).toBe(
      committed.tracks.get("demo/points")?.contract,
    );
    expect(before).not.toEqual(after);
  });

  it("adds a declared optional column the addressed row omitted", () => {
    const outcome = accepted(
      plan(
        state([POINTS]),
        {
          kind: "set-field",
          nodeId: "demo/points",
          address: { row: "r2", field: "y" },
          cell: 8,
        },
        environment(),
      ),
    );

    expect(outcome.state.tracks.get("demo/points")?.track.input?.values).toEqual([
      { id: "r1", cells: { x: 1, y: 2 } },
      { id: "r2", cells: { x: 3, y: 8 } },
    ]);
  });

  it("writes a record field and allows scalar-to-stops on a non-static field", () => {
    const outcome = accepted(
      plan(
        state([RECORD]),
        {
          kind: "set-field",
          nodeId: "demo/record",
          address: { field: "count" },
          cell: [
            { p: 0, v: 1 },
            { p: 1, v: 5 },
          ],
        },
        environment(),
      ),
    );

    const values = outcome.state.tracks.get("demo/record")?.track.input?.values as AuthoredRecord;
    expect(values.count).toEqual([
      { p: 0, v: 1 },
      { p: 1, v: 5 },
    ]);
    expect(values.label).toBe("a");
    expect(outcome.change?.kind).toBe("authored-values");
  });

  it("refuses stops on a static field", () => {
    const outcome = plan(
      state([FLAGS]),
      {
        kind: "set-field",
        nodeId: "demo/flags",
        address: { field: "flip" },
        cell: [{ p: 0, v: true }],
      },
      environment(),
    );

    expect(rules(outcome)[0]?.split(" at ")[0]).toBe("static-field-stops");
  });

  it("names the required address form when the row is present or absent wrongly", () => {
    const recordWithRow = plan(
      state([RECORD]),
      {
        kind: "set-field",
        nodeId: "demo/record",
        address: { row: "r1", field: "count" },
        cell: 2,
      },
      environment(),
    );
    expect(message(recordWithRow)).toBe("Track 'demo/record' has a record input; omit 'row'.");

    const tableWithoutRow = plan(
      state([POINTS]),
      { kind: "set-field", nodeId: "demo/points", address: { field: "x" }, cell: 2 },
      environment(),
    );
    expect(message(tableWithoutRow)).toBe(
      "Track 'demo/points' has a table input; give 'row' (the row id).",
    );
  });

  it("refuses an unknown row and an unknown field by name", () => {
    const unknownRow = plan(
      state([POINTS]),
      {
        kind: "set-field",
        nodeId: "demo/points",
        address: { row: "ghost", field: "x" },
        cell: 2,
      },
      environment(),
    );
    expect(rules(unknownRow)[0]?.split(" at ")[0]).toBe("cell-address-unknown");
    expect(message(unknownRow)).toContain("Row 'ghost'");

    const unknownField = plan(
      state([RECORD]),
      { kind: "set-field", nodeId: "demo/record", address: { field: "ghost" }, cell: 2 },
      environment(),
    );
    expect(rules(unknownField)[0]?.split(" at ")[0]).toBe("cell-address-unknown");
    expect(message(unknownField)).toContain("Field 'ghost'");
  });

  it("refuses a changed scalar kind through the same contract rule", () => {
    const outcome = plan(
      state([RECORD]),
      { kind: "set-field", nodeId: "demo/record", address: { field: "count" }, cell: "one" },
      environment(),
    );

    expect(rules(outcome)[0]?.split(" at ")[0]).toBe("cell-kind-conflict");
    expect(message(outcome)).toContain("track.input.replace(...)");
  });
});

describe("a value edit reads exactly one node", () => {
  const edits: readonly (readonly [string, CheapEdit | LiveEdit])[] = [
    ["set-values", { kind: "set-values", nodeId: "demo/points", values: [] }],
    [
      "set-field",
      { kind: "set-field", nodeId: "demo/points", address: { row: "r1", field: "x" }, cell: 9 },
    ],
    [
      "write-live",
      { kind: "write-live", nodeId: "demo/points", value: table(row("r1", { x: 1, y: 2 })) },
    ],
    ["release-live", { kind: "release-live", nodeId: "demo/points" }],
  ];

  it.each(edits)("%s asks the lookup for its target once and for nothing else", (_name, edit) => {
    const committed = state([POINTS, RECORD]);
    const asked: string[] = [];
    const view: TrackLookup = {
      get: (nodeId) => {
        asked.push(nodeId);
        return committed.tracks.get(nodeId);
      },
    };
    planValueEdit(view, edit, environment());
    expect(asked).toEqual(["demo/points"]);
  });
});
