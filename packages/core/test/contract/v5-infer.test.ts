import { describe, expect, it } from "vitest";
import { deriveSourceContract, type SourceContract } from "../../src/contract/v5-infer";
import {
  parseTrackDefinition,
  type ParsedTrack,
  type ParsedValues,
} from "../../src/contract/v5-parse";
import type { Diagnostic, ValueSpec } from "../../src/contract/v5";

const PATH = "motions[0].tracks[0]";
const VALUES_PATH = `${PATH}.input.values`;

function parseAccepted(track: unknown): ParsedTrack {
  const outcome = parseTrackDefinition(track, PATH);
  if (outcome.kind !== "accepted")
    throw new Error(`Expected acceptance, received ${JSON.stringify(outcome.diagnostics)}.`);
  return outcome.value;
}

function valuesOf(track: unknown): ParsedValues | undefined {
  return parseAccepted(track).input.values;
}

function contract(values: ParsedValues | undefined, schema: ValueSpec | undefined): SourceContract {
  const outcome = deriveSourceContract(values, schema, VALUES_PATH);
  if (outcome.kind !== "accepted")
    throw new Error(`Expected acceptance, received ${JSON.stringify(outcome.diagnostics)}.`);
  return outcome.value;
}

function refusal(
  values: ParsedValues | undefined,
  schema: ValueSpec | undefined,
): readonly Diagnostic[] {
  const outcome = deriveSourceContract(values, schema, VALUES_PATH);
  if (outcome.kind !== "refused") throw new Error("Expected refusal.");
  return outcome.diagnostics;
}

function expectRule(
  values: ParsedValues | undefined,
  schema: ValueSpec | undefined,
  ruleId: string,
): Diagnostic {
  const diagnostics = refusal(values, schema);
  const found = diagnostics.find((entry) => entry.ruleId === ruleId);
  expect(
    found,
    `expected ${ruleId}, received ${diagnostics.map((entry) => entry.ruleId).join(", ")}`,
  ).toBeDefined();
  if (found === undefined) throw new Error(`expected ${ruleId}`);
  return found;
}

describe("deriveSourceContract infers from the complete authored source", () => {
  it("infers required and optional table columns across every row", () => {
    const values = valuesOf({
      id: "points",
      input: {
        values: [
          {
            id: "a",
            cells: {
              x: [
                { p: 0, v: 0 },
                { p: 1, v: 100 },
              ],
              y: 20,
            },
          },
          { id: "b", cells: { x: 200, z: "north" } },
        ],
      },
    });

    const inferred = contract(values, undefined);

    expect(inferred.proven).toBe(true);
    expect(inferred.spec).toEqual({
      kind: "table",
      schema: {
        row: {
          fields: {
            x: { kind: "number" },
            y: { kind: "number", optional: true },
            z: { kind: "string", optional: true },
          },
          additionalProperties: false,
        },
      },
    });
  });

  it("infers every record field as required", () => {
    const values = valuesOf({
      id: "parameters",
      input: {
        values: {
          dx: 10,
          dy: [
            { p: 0, v: 0 },
            { p: 1, v: 5 },
          ],
        },
      },
    });

    const inferred = contract(values, undefined);

    expect(inferred.proven).toBe(true);
    expect(inferred.spec).toEqual({
      kind: "record",
      fields: {
        dx: { kind: "number" },
        dy: { kind: "number" },
      },
      additionalProperties: false,
    });
  });

  it("never infers static, ranges, enums or a row-count promise", () => {
    const values = valuesOf({
      id: "points",
      input: { values: [{ id: "a", cells: { x: 10, label: "idle" } }] },
    });

    const inferred = contract(values, undefined);

    expect(inferred.spec).toEqual({
      kind: "table",
      schema: {
        row: {
          fields: {
            x: { kind: "number" },
            label: { kind: "string" },
          },
          additionalProperties: false,
        },
      },
    });
    expect(JSON.stringify(inferred.spec)).not.toContain("static");
    expect(JSON.stringify(inferred.spec)).not.toContain("minRows");
    expect(JSON.stringify(inferred.spec)).not.toContain("enum");
  });

  it("treats an empty inferred table, record and omitted values as unproven", () => {
    const emptyTable = {
      kind: "table",
      schema: { row: { fields: {}, additionalProperties: false } },
    } as const;
    const emptyRecord = { kind: "record", fields: {}, additionalProperties: false } as const;
    const cases = [
      [valuesOf({ id: "a", input: { values: [] } }), emptyTable],
      [valuesOf({ id: "b", input: { values: {} } }), emptyRecord],
      [undefined, emptyTable],
    ] as const;

    for (const [values, expected] of cases) {
      const inferred = contract(values, undefined);
      expect(inferred.proven).toBe(false);
      expect(inferred.spec).toEqual(expected);
    }
  });

  it("keeps a column optional when a row with no cells omits it", () => {
    const values = valuesOf({
      id: "points",
      input: {
        values: [
          { id: "a", cells: { x: 1 } },
          { id: "b", cells: {} },
        ],
      },
    });

    expect(contract(values, undefined).spec).toEqual({
      kind: "table",
      schema: {
        row: {
          fields: { x: { kind: "number", optional: true } },
          additionalProperties: false,
        },
      },
    });
  });

  it("refuses a later conflicting stop with both paths", () => {
    const values = valuesOf({
      id: "points",
      input: {
        values: [
          {
            id: "a",
            cells: {
              x: [
                { p: 0, v: 0 },
                { p: 1, v: 10 },
              ],
            },
          },
          {
            id: "b",
            cells: {
              x: [
                { p: 0, v: "low" },
                { p: 1, v: "high" },
              ],
            },
          },
        ],
      },
    });

    const found = expectRule(values, undefined, "cell-kind-conflict");

    expect(found.path).toBe(`${VALUES_PATH}[1].cells.x`);
    expect(found.message).toContain(`${VALUES_PATH}[0].cells.x`);
  });
});

describe("deriveSourceContract validates a declared schema without merging", () => {
  it("validates a record declaration and strips static from its contract", () => {
    const schema: ValueSpec = {
      kind: "record",
      fields: {
        mode: { kind: "string", enum: ["idle", "busy"] },
        speed: { kind: "number", optional: true, min: 0, max: 10 },
        locked: { kind: "boolean", static: true },
      },
    };
    const values = valuesOf({
      id: "parameters",
      input: { values: { mode: "idle", speed: 5, locked: true }, schema },
    });

    const declared = contract(values, schema);

    expect(declared.proven).toBe(true);
    expect(declared.spec).toEqual({
      kind: "record",
      fields: {
        mode: { kind: "string", enum: ["idle", "busy"] },
        speed: { kind: "number", optional: true, min: 0, max: 10 },
        locked: { kind: "boolean" },
      },
    });
  });

  it("validates a table declaration and keeps its row-count bounds", () => {
    const schema: ValueSpec = {
      kind: "table",
      schema: {
        row: {
          fields: {
            x: { kind: "number", static: true },
            y: { kind: "number", optional: true },
          },
          additionalProperties: false,
        },
        minRows: 1,
        maxRows: 3,
      },
    };
    const values = valuesOf({
      id: "points",
      input: { values: [{ id: "a", cells: { x: 1, y: 2 } }], schema },
    });

    expect(contract(values, schema).spec).toEqual({
      kind: "table",
      schema: {
        row: {
          fields: {
            x: { kind: "number" },
            y: { kind: "number", optional: true },
          },
          additionalProperties: false,
        },
        minRows: 1,
        maxRows: 3,
      },
    });
  });

  it("keeps only the declared fields and never merges inferred ones", () => {
    const schema: ValueSpec = {
      kind: "record",
      fields: { dx: { kind: "number" } },
      additionalProperties: true,
    };
    const values = valuesOf({
      id: "parameters",
      input: { values: { dx: 10, dy: 5 }, schema },
    });

    expect(contract(values, schema).spec).toEqual({
      kind: "record",
      fields: { dx: { kind: "number" } },
      additionalProperties: true,
    });
  });

  it("refuses a cell whose kind contradicts its declared field as cell-kind-conflict", () => {
    const schema: ValueSpec = { kind: "record", fields: { x: { kind: "number" } } };
    const values = valuesOf({
      id: "parameters",
      input: { values: { x: "one" }, schema },
    });

    const found = expectRule(values, schema, "cell-kind-conflict");
    expect(found.path).toBe(`${VALUES_PATH}.x`);
  });

  it("refuses a missing required field as cell-form-invalid", () => {
    const schema: ValueSpec = {
      kind: "record",
      fields: { dx: { kind: "number" }, dy: { kind: "number" } },
    };
    const recordValues = valuesOf({
      id: "parameters",
      input: { values: { dx: 10 }, schema },
    });
    expect(expectRule(recordValues, schema, "cell-form-invalid").path).toBe(`${VALUES_PATH}.dy`);

    const tableSchema: ValueSpec = {
      kind: "table",
      schema: { row: { fields: { x: { kind: "number" } } } },
    };
    const tableValues = valuesOf({
      id: "points",
      input: {
        values: [
          { id: "a", cells: { x: 1 } },
          { id: "b", cells: {} },
        ],
        schema: tableSchema,
      },
    });
    expect(expectRule(tableValues, tableSchema, "cell-form-invalid").path).toBe(
      `${VALUES_PATH}[1].cells.x`,
    );
  });

  it("accepts a missing optional field", () => {
    const schema: ValueSpec = {
      kind: "record",
      fields: { dx: { kind: "number" }, dy: { kind: "number", optional: true } },
    };
    const values = valuesOf({
      id: "parameters",
      input: { values: { dx: 10 }, schema },
    });

    expect(contract(values, schema).spec).toEqual({
      kind: "record",
      fields: { dx: { kind: "number" }, dy: { kind: "number", optional: true } },
    });
  });

  it("refuses an undeclared field when the schema is closed and accepts it when open", () => {
    const closed: ValueSpec = {
      kind: "record",
      fields: { dx: { kind: "number" } },
      additionalProperties: false,
    };
    const closedValues = valuesOf({
      id: "parameters",
      input: { values: { dx: 10, dy: 5 }, schema: closed },
    });
    expect(expectRule(closedValues, closed, "cell-form-invalid").path).toBe(`${VALUES_PATH}.dy`);

    const open: ValueSpec = {
      kind: "record",
      fields: { dx: { kind: "number" } },
      additionalProperties: true,
    };
    const openValues = valuesOf({
      id: "parameters",
      input: { values: { dx: 10, dy: 5 }, schema: open },
    });
    expect(contract(openValues, open).spec).toEqual(open);
  });

  it("refuses a static value outside its enum as cell-form-invalid", () => {
    const schema: ValueSpec = {
      kind: "record",
      fields: { mode: { kind: "string", enum: ["idle", "busy"] } },
    };
    const values = valuesOf({
      id: "parameters",
      input: { values: { mode: "running" }, schema },
    });

    expect(expectRule(values, schema, "cell-form-invalid").path).toBe(`${VALUES_PATH}.mode`);
  });

  it("refuses an animated value outside its enum at the offending stop", () => {
    const schema: ValueSpec = {
      kind: "record",
      fields: { mode: { kind: "string", enum: ["idle", "busy"] } },
    };
    const values = valuesOf({
      id: "parameters",
      input: {
        values: {
          mode: [
            { p: 0, v: "idle" },
            { p: 1, v: "running" },
          ],
        },
        schema,
      },
    });

    expect(expectRule(values, schema, "cell-stops-invalid").path).toBe(`${VALUES_PATH}.mode[1].v`);
  });

  it("refuses a static value outside its range as cell-form-invalid", () => {
    const schema: ValueSpec = {
      kind: "record",
      fields: { speed: { kind: "number", min: 0, max: 3 } },
    };
    const values = valuesOf({
      id: "parameters",
      input: { values: { speed: 5 }, schema },
    });

    expect(expectRule(values, schema, "cell-form-invalid").path).toBe(`${VALUES_PATH}.speed`);
  });

  it("refuses an animated value outside its range at the offending stop", () => {
    const schema: ValueSpec = {
      kind: "record",
      fields: { speed: { kind: "number", max: 3 } },
    };
    const values = valuesOf({
      id: "parameters",
      input: {
        values: {
          speed: [
            { p: 0, v: 0 },
            { p: 1, v: 5 },
          ],
        },
        schema,
      },
    });

    expect(expectRule(values, schema, "cell-stops-invalid").path).toBe(`${VALUES_PATH}.speed[1].v`);
  });

  it("refuses authored rows outside the declared row-count bounds", () => {
    const schema: ValueSpec = {
      kind: "table",
      schema: { row: { fields: {} }, minRows: 2 },
    };
    const values = valuesOf({
      id: "points",
      input: { values: [{ id: "a", cells: {} }], schema },
    });

    const found = expectRule(values, schema, "values-shape-invalid");
    expect(found.path).toBe(VALUES_PATH);
  });

  it("establishes the declared contract for an empty or omitted source", () => {
    const schema: ValueSpec = {
      kind: "table",
      schema: { row: { fields: { x: { kind: "number", static: true } } } },
    };

    for (const values of [valuesOf({ id: "points", input: { values: [], schema } }), undefined]) {
      const declared = contract(values, schema);
      expect(declared.proven).toBe(true);
      expect(declared.spec).toEqual({
        kind: "table",
        schema: { row: { fields: { x: { kind: "number" } } } },
      });
    }
  });
});
