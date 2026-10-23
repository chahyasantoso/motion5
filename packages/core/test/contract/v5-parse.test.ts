import { describe, expect, it } from "vitest";
import { parseTrackDefinition, type ParsedTrack } from "../../src/contract/v5-parse";
import type { Diagnostic } from "../../src/contract/v5";

const PATH = "motions[0].tracks[0]";

const RETIRED_STOPS = [{ p: 0, v: 1 }];
const RETIRED_WRAPPER = { stops: RETIRED_STOPS };

function animatedNumber(
  stops: readonly { readonly p: number; readonly v: number; readonly ease?: string }[],
) {
  return { kind: "animated", scalar: "number", stops };
}

function parse(track: unknown, plugins: readonly string[] = []) {
  const known = new Set(plugins);
  return parseTrackDefinition(track, PATH, {
    isPluginRegistered: (id) => known.has(id),
  });
}

function accepted(track: unknown, plugins: readonly string[] = []): ParsedTrack {
  const outcome = parse(track, plugins);
  if (outcome.kind !== "accepted")
    throw new Error(`Expected acceptance, received ${JSON.stringify(outcome.diagnostics)}.`);
  return outcome.value;
}

function refusal(track: unknown, plugins: readonly string[] = []): readonly Diagnostic[] {
  const outcome = parse(track, plugins);
  if (outcome.kind !== "refused") throw new Error("Expected refusal.");
  return outcome.diagnostics;
}

function expectRule(track: unknown, ruleId: string, plugins: readonly string[] = []): Diagnostic {
  const diagnostics = refusal(track, plugins);
  const found = diagnostics.find((entry) => entry.ruleId === ruleId);
  expect(
    found,
    `expected ${ruleId}, received ${diagnostics.map((entry) => entry.ruleId).join(", ")}`,
  ).toBeDefined();
  if (found === undefined) throw new Error(`expected ${ruleId}`);
  return found;
}

describe("parseTrackDefinition accepts the target shape", () => {
  it("parses a table with identical and heterogeneous columns, preserving row identity", () => {
    const parsed = accepted({
      id: "points",
      input: {
        values: [
          {
            id: "point-a",
            cells: {
              x: [
                { p: 0, v: 0 },
                { p: 1, v: 100 },
              ],
              y: 20,
            },
          },
          { id: "point-b", cells: { x: 200, y: 40 } },
        ],
      },
    });

    expect(parsed.input.values).toEqual({
      kind: "table",
      rows: [
        {
          id: "point-a",
          cells: {
            x: animatedNumber([
              { p: 0, v: 0 },
              { p: 1, v: 100 },
            ]),
            y: { kind: "static", scalar: "number", value: 20 },
          },
        },
        {
          id: "point-b",
          cells: {
            x: { kind: "static", scalar: "number", value: 200 },
            y: { kind: "static", scalar: "number", value: 40 },
          },
        },
      ],
    });
  });

  it("parses a record with independently animated fields", () => {
    const parsed = accepted({
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

    expect(parsed.input.values).toEqual({
      kind: "record",
      fields: {
        dx: { kind: "static", scalar: "number", value: 10 },
        dy: animatedNumber([
          { p: 0, v: 0 },
          { p: 1, v: 5 },
        ]),
      },
    });
  });

  it("accepts one stop as a constant animation and discrete string and boolean sequences", () => {
    const parsed = accepted({
      id: "values",
      input: {
        values: {
          constant: [{ p: 0.4, v: 12 }],
          label: [
            { p: 0, v: "idle" },
            { p: 0.5, v: "busy" },
          ],
          enabled: [
            { p: 0, v: false },
            { p: 1, v: true },
          ],
        },
      },
    });

    expect(parsed.input.values?.kind).toBe("record");
    if (parsed.input.values?.kind !== "record") throw new Error("expected a record");
    expect(parsed.input.values.fields.constant).toEqual(animatedNumber([{ p: 0.4, v: 12 }]));
    expect(parsed.input.values.fields.label).toMatchObject({ scalar: "string" });
    expect(parsed.input.values.fields.enabled).toMatchObject({ scalar: "boolean" });
  });

  it("carries ease on the stop whose interval ends at it", () => {
    const parsed = accepted({
      id: "points",
      input: {
        values: [
          {
            id: "a",
            cells: {
              x: [
                { p: 0, v: 0 },
                { p: 0.5, v: 5, ease: "power2.in" },
                { p: 1, v: 10 },
              ],
            },
          },
        ],
      },
    });

    expect(parsed.input.values).toMatchObject({
      kind: "table",
      rows: [
        {
          cells: {
            x: animatedNumber([
              { p: 0, v: 0 },
              { p: 0.5, v: 5, ease: "power2.in" },
              { p: 1, v: 10 },
            ]),
          },
        },
      ],
    });
  });

  it("keeps empty tables, empty records and rows with empty cells distinct", () => {
    expect(accepted({ id: "a", input: { values: [] } }).input.values).toEqual({
      kind: "table",
      rows: [],
    });
    expect(accepted({ id: "b", input: { values: {} } }).input.values).toEqual({
      kind: "record",
      fields: {},
    });
    expect(
      accepted({ id: "c", input: { values: [{ id: "row", cells: {} }] } }).input.values,
    ).toEqual({
      kind: "table",
      rows: [{ id: "row", cells: {} }],
    });
  });

  it("defaults an omitted input to no local values and no bindings", () => {
    const parsed = accepted({ id: "points" });

    expect(parsed).toEqual({ id: "points", input: { requires: {} } });
    expect(parsed.input.values).toBeUndefined();
    expect(parsed.input.schema).toBeUndefined();
  });

  it("accepts a declared schema that matches the authored shape", () => {
    const schema = {
      kind: "table",
      schema: {
        row: {
          fields: {
            x: { kind: "number" },
            label: { kind: "string", optional: true, enum: ["idle", "busy"] },
          },
          additionalProperties: false,
        },
        minRows: 0,
        maxRows: 4,
      },
    };
    const parsed = accepted({
      id: "points",
      input: { values: [], schema },
    });

    expect(parsed.input.schema).toEqual(schema);
  });

  it("accepts a registered plugin track with single and map bindings", () => {
    const parsed = accepted(
      {
        id: "shifted",
        plugin: "translate",
        input: {
          values: { dx: 10 },
          requires: { data: "points", mapped: { a: "one", b: "two" } },
        },
      },
      ["translate"],
    );

    expect(parsed.plugin).toBe("translate");
    expect(parsed.input.requires).toEqual({
      data: "points",
      mapped: { a: "one", b: "two" },
    });
  });

  it("accepts an empty requires object without a plugin", () => {
    expect(accepted({ id: "points", input: { requires: {} } }).input.requires).toEqual({});
  });

  it("keeps an envelope id and a cell named id as separate members", () => {
    const parsed = accepted({
      id: "points",
      input: { values: [{ id: "row", cells: { id: "external-1", x: 1 } }] },
    });

    expect(parsed.input.values).toMatchObject({
      rows: [{ id: "row", cells: { id: { value: "external-1" }, x: { value: 1 } } }],
    });
  });

  it("freezes the parsed values it returns", () => {
    const parsed = accepted({
      id: "points",
      input: { values: [{ id: "row", cells: { x: [{ p: 0, v: 0 }] } }] },
    });

    expect(Object.isFrozen(parsed)).toBe(true);
    expect(Object.isFrozen(parsed.input)).toBe(true);
    expect(Object.isFrozen(parsed.input.values)).toBe(true);
  });
});

describe("parseTrackDefinition refuses the retired and unknown members", () => {
  it("refuses grouped keyframes and observes as track-legacy-field", () => {
    expectRule({ id: "legacy", keyframes: {} }, "track-legacy-field");
    expectRule({ id: "legacy", observes: [] }, "track-legacy-field");
  });

  it("refuses an unknown track member as track-field-unknown", () => {
    const found = expectRule({ id: "points", stage: 1 }, "track-field-unknown");
    expect(found.path).toBe(`${PATH}.stage`);
  });

  it("refuses an unknown input member as track-field-unknown", () => {
    expectRule({ id: "points", input: { claims: {} } }, "track-field-unknown");
  });

  it("refuses an unknown row member as track-field-unknown", () => {
    expectRule(
      { id: "points", input: { values: [{ id: "a", cells: {}, label: "x" }] } },
      "track-field-unknown",
    );
  });

  it("refuses a non-object track as track-shape", () => {
    expectRule("points", "track-shape");
  });

  it("refuses an empty or non-string track id as id-shape", () => {
    expectRule({ id: "" }, "id-shape");
    expectRule({ id: 4 }, "id-shape");
  });

  it("refuses a qualified track id as id-qualified-separator", () => {
    expectRule({ id: "a/b" }, "id-qualified-separator");
  });

  it("refuses an invalid duration as track-shape", () => {
    expectRule({ id: "points", duration: -1 }, "track-shape");
    expectRule({ id: "points", duration: "slow" }, "track-shape");
  });

  it("refuses a non-object input as track-field-unknown", () => {
    expectRule({ id: "points", input: [] }, "track-field-unknown");
  });
});

describe("parseTrackDefinition owns the row envelope", () => {
  it("refuses a flat row without id and cells as row-id-invalid", () => {
    const found = expectRule(
      { id: "points", input: { values: [{ point: "a", x: 0 }] } },
      "row-id-invalid",
    );
    expect(found.path).toBe(`${PATH}.input.values[0].id`);
  });

  it("refuses an empty or non-string row id as row-id-invalid", () => {
    expectRule({ id: "points", input: { values: [{ id: "", cells: {} }] } }, "row-id-invalid");
    expectRule({ id: "points", input: { values: [{ id: 1, cells: {} }] } }, "row-id-invalid");
  });

  it("refuses duplicate row ids as row-id-duplicate", () => {
    const found = expectRule(
      {
        id: "points",
        input: {
          values: [
            { id: "a", cells: {} },
            { id: "a", cells: {} },
          ],
        },
      },
      "row-id-duplicate",
    );
    expect(found.path).toBe(`${PATH}.input.values[1].id`);
  });

  it("refuses reserved row ids as name-reserved", () => {
    expectRule(
      { id: "points", input: { values: [{ id: "__proto__", cells: {} }] } },
      "name-reserved",
    );
  });

  it("refuses a row without a cells object as cell-form-invalid", () => {
    expectRule({ id: "points", input: { values: [{ id: "a" }] } }, "cell-form-invalid");
    expectRule({ id: "points", input: { values: [{ id: "a", cells: [] }] } }, "cell-form-invalid");
  });
});

describe("parseTrackDefinition owns cells and stops", () => {
  it("refuses a structured, empty-object, wrapper or null cell as cell-form-invalid", () => {
    expectRule({ id: "values", input: { values: { x: { literal: 1 } } } }, "cell-form-invalid");
    expectRule({ id: "values", input: { values: { x: {} } } }, "cell-form-invalid");
    expectRule({ id: "values", input: { values: { x: RETIRED_WRAPPER } } }, "cell-form-invalid");
    expectRule({ id: "values", input: { values: { x: null } } }, "cell-form-invalid");
  });

  it("refuses an empty stop array as cell-stops-invalid", () => {
    expectRule({ id: "values", input: { values: { x: [] } } }, "cell-stops-invalid");
  });

  it("refuses a non-object stop as cell-stops-invalid", () => {
    expectRule({ id: "values", input: { values: { x: [1] } } }, "cell-stops-invalid");
  });

  it("refuses a stop position outside [0, 1] as cell-stops-invalid", () => {
    expectRule(
      { id: "values", input: { values: { x: [{ p: 1.5, v: 0 }] } } },
      "cell-stops-invalid",
    );
    expectRule(
      { id: "values", input: { values: { x: [{ p: -0.1, v: 0 }] } } },
      "cell-stops-invalid",
    );
  });

  it("refuses a non-finite stop position as cell-stops-invalid", () => {
    expectRule(
      { id: "values", input: { values: { x: [{ p: Number.NaN, v: 0 }] } } },
      "cell-stops-invalid",
    );
    expectRule(
      { id: "values", input: { values: { x: [{ p: Number.POSITIVE_INFINITY, v: 0 }] } } },
      "cell-stops-invalid",
    );
  });

  it("refuses duplicated or decreasing stop positions as cell-stops-invalid", () => {
    expectRule(
      {
        id: "values",
        input: {
          values: {
            x: [
              { p: 0.5, v: 0 },
              { p: 0.5, v: 1 },
            ],
          },
        },
      },
      "cell-stops-invalid",
    );
    expectRule(
      {
        id: "values",
        input: {
          values: {
            x: [
              { p: 0.5, v: 0 },
              { p: 0.2, v: 1 },
            ],
          },
        },
      },
      "cell-stops-invalid",
    );
  });

  it("reports the offending stop path", () => {
    const found = expectRule(
      {
        id: "points",
        input: {
          values: [
            {
              id: "a",
              cells: {
                x: [
                  { p: 0, v: 0 },
                  { p: 2, v: 1 },
                ],
              },
            },
          ],
        },
      },
      "cell-stops-invalid",
    );
    expect(found.path).toBe(`${PATH}.input.values[0].cells.x[1].p`);
  });

  it("refuses a missing, non-scalar or non-finite stop value as cell-stops-invalid", () => {
    expectRule({ id: "values", input: { values: { x: [{ p: 0 }] } } }, "cell-stops-invalid");
    expectRule({ id: "values", input: { values: { x: [{ p: 0, v: {} }] } } }, "cell-stops-invalid");
    expectRule(
      { id: "values", input: { values: { x: [{ p: 0, v: Number.NaN }] } } },
      "cell-stops-invalid",
    );
  });

  it("refuses an unknown stop member as cell-stops-invalid", () => {
    expectRule(
      { id: "values", input: { values: { x: [{ p: 0, v: 1, curve: "linear" }] } } },
      "cell-stops-invalid",
    );
  });

  it("refuses an ease on the first stop as cell-stops-invalid", () => {
    const found = expectRule(
      {
        id: "values",
        input: {
          values: {
            x: [
              { p: 0, v: 0, ease: "none" },
              { p: 1, v: 1 },
            ],
          },
        },
      },
      "cell-stops-invalid",
    );
    expect(found.path).toBe(`${PATH}.input.values.x[0].ease`);
  });

  it("refuses ease on discrete sequences as cell-stops-invalid", () => {
    expectRule(
      {
        id: "values",
        input: {
          values: {
            label: [
              { p: 0, v: "a" },
              { p: 1, v: "b", ease: "none" },
            ],
          },
        },
      },
      "cell-stops-invalid",
    );
    expectRule(
      {
        id: "values",
        input: {
          values: {
            enabled: [
              { p: 0, v: false },
              { p: 1, v: true, ease: "none" },
            ],
          },
        },
      },
      "cell-stops-invalid",
    );
  });

  it("refuses mixed scalar kinds across stops as cell-kind-conflict", () => {
    const found = expectRule(
      {
        id: "values",
        input: {
          values: {
            x: [
              { p: 0, v: 0 },
              { p: 1, v: "one" },
            ],
          },
        },
      },
      "cell-kind-conflict",
    );
    expect(found.path).toBe(`${PATH}.input.values.x[1].v`);
    expectRule(
      {
        id: "values",
        input: {
          values: {
            x: [
              { p: 0, v: "yes" },
              { p: 1, v: true },
            ],
          },
        },
      },
      "cell-kind-conflict",
    );
  });

  it("refuses reserved column and record field names as name-reserved", () => {
    expectRule(
      { id: "points", input: { values: [{ id: "a", cells: { constructor: 1 } }] } },
      "name-reserved",
    );
    expectRule({ id: "values", input: { values: { prototype: 1 } } }, "name-reserved");
  });
});

describe("parseTrackDefinition selects plugins", () => {
  it("refuses an unregistered, empty or non-string plugin id as plugin-unknown", () => {
    expectRule({ id: "shifted", plugin: "missing" }, "plugin-unknown");
    expectRule({ id: "shifted", plugin: "" }, "plugin-unknown");
    expectRule({ id: "shifted", plugin: 4 }, "plugin-unknown");
  });

  it("refuses nonempty requires without a plugin as plugin-requires-without-plugin", () => {
    const found = expectRule(
      { id: "points", input: { requires: { data: "points" } } },
      "plugin-requires-without-plugin",
    );
    expect(found.path).toBe(`${PATH}.input.requires`);
  });

  it("refuses input.schema on a plugin track as input-schema-on-plugin-track", () => {
    const found = expectRule(
      {
        id: "shifted",
        plugin: "translate",
        input: {
          values: { dx: 10 },
          schema: { kind: "record", fields: { dx: { kind: "number" } } },
        },
      },
      "input-schema-on-plugin-track",
      ["translate"],
    );
    expect(found.path).toBe(`${PATH}.input.schema`);
  });
});

describe("parseTrackDefinition owns the spec vocabulary", () => {
  it("refuses the retired type alias as spec-field-unknown", () => {
    const found = expectRule(
      {
        id: "values",
        input: { values: { x: 1 }, schema: { type: "record", fields: { x: { kind: "number" } } } },
      },
      "spec-field-unknown",
    );
    expect(found.path).toBe(`${PATH}.input.schema.type`);
  });

  it("refuses a missing or unknown kind as spec-field-unknown", () => {
    expectRule(
      { id: "values", input: { values: {}, schema: { fields: {} } } },
      "spec-field-unknown",
    );
    expectRule(
      { id: "values", input: { values: {}, schema: { kind: "map", fields: {} } } },
      "spec-field-unknown",
    );
  });

  it("refuses unknown members in a spec, its schema, its row and a field as spec-field-unknown", () => {
    expectRule(
      { id: "values", input: { values: {}, schema: { kind: "record", fields: {}, extra: 1 } } },
      "spec-field-unknown",
    );
    expectRule(
      {
        id: "values",
        input: {
          values: [],
          schema: { kind: "table", schema: { row: { fields: {} }, extra: 1 } },
        },
      },
      "spec-field-unknown",
    );
    expectRule(
      {
        id: "values",
        input: {
          values: [],
          schema: { kind: "table", schema: { row: { fields: {}, extra: 1 } } },
        },
      },
      "spec-field-unknown",
    );
    expectRule(
      {
        id: "values",
        input: {
          values: {},
          schema: { kind: "record", fields: { x: { kind: "number", step: 1 } } },
        },
      },
      "spec-field-unknown",
    );
  });

  it("refuses an optional or static flag that is not true as spec-field-unknown", () => {
    expectRule(
      {
        id: "values",
        input: {
          values: { x: 1 },
          schema: { kind: "record", fields: { x: { kind: "number", optional: false } } },
        },
      },
      "spec-field-unknown",
    );
    expectRule(
      {
        id: "values",
        input: {
          values: { x: 1 },
          schema: { kind: "record", fields: { x: { kind: "number", static: false } } },
        },
      },
      "spec-field-unknown",
    );
  });

  it("refuses descriptors that do not belong to the field kind as spec-field-unknown", () => {
    expectRule(
      {
        id: "values",
        input: {
          values: { x: "a" },
          schema: { kind: "record", fields: { x: { kind: "string", min: 0 } } },
        },
      },
      "spec-field-unknown",
    );
    expectRule(
      {
        id: "values",
        input: {
          values: { x: 1 },
          schema: { kind: "record", fields: { x: { kind: "number", enum: ["a"] } } },
        },
      },
      "spec-field-unknown",
    );
    expectRule(
      {
        id: "values",
        input: {
          values: { x: "a" },
          schema: { kind: "record", fields: { x: { kind: "string", enum: [1] } } },
        },
      },
      "spec-field-unknown",
    );
  });

  it("refuses inverted bounds and row counts as spec-field-unknown", () => {
    expectRule(
      {
        id: "values",
        input: {
          values: {},
          schema: { kind: "record", fields: { x: { kind: "number", min: 5, max: 1 } } },
        },
      },
      "spec-field-unknown",
    );
    expectRule(
      {
        id: "values",
        input: {
          values: [],
          schema: { kind: "table", schema: { row: { fields: {} }, minRows: 3, maxRows: 1 } },
        },
      },
      "spec-field-unknown",
    );
    expectRule(
      {
        id: "values",
        input: {
          values: [],
          schema: { kind: "table", schema: { row: { fields: {} }, minRows: -1 } },
        },
      },
      "spec-field-unknown",
    );
  });

  it("refuses reserved field names in a spec as name-reserved", () => {
    expectRule(
      {
        id: "values",
        input: {
          values: { a: 1 },
          schema: {
            kind: "record",
            fields: { ["__proto__"]: { kind: "number" } },
          },
        },
      },
      "name-reserved",
    );
  });
});

describe("parseTrackDefinition matches authored values to the declared shape", () => {
  it("refuses a table where a record is declared as values-shape-invalid", () => {
    const found = expectRule(
      {
        id: "parameters",
        input: {
          values: [{ id: "point-a", cells: { dx: 10 } }],
          schema: { kind: "record", fields: { dx: { kind: "number" } } },
        },
      },
      "values-shape-invalid",
    );
    expect(found.message).toContain("table");
    expect(found.message).toContain("record");
  });

  it("refuses a record where a table is declared as values-shape-invalid", () => {
    expectRule(
      {
        id: "points",
        input: {
          values: { x: 10 },
          schema: { kind: "table", schema: { row: { fields: { x: { kind: "number" } } } } },
        },
      },
      "values-shape-invalid",
    );
  });

  it("refuses values that are neither a table nor a record as values-shape-invalid", () => {
    expectRule({ id: "values", input: { values: "x" } }, "values-shape-invalid");
    expectRule({ id: "values", input: { values: 4 } }, "values-shape-invalid");
  });

  it("refuses any stop sequence in a static field as static-field-stops", () => {
    expectRule(
      {
        id: "values",
        input: {
          values: {
            dx: [
              { p: 0, v: 10 },
              { p: 1, v: 20 },
            ],
          },
          schema: { kind: "record", fields: { dx: { kind: "number", static: true } } },
        },
      },
      "static-field-stops",
    );
    expectRule(
      {
        id: "values",
        input: {
          values: { dx: [{ p: 0, v: 10 }] },
          schema: { kind: "record", fields: { dx: { kind: "number", static: true } } },
        },
      },
      "static-field-stops",
    );
  });

  it("refuses a stop sequence in a static table column as static-field-stops", () => {
    expectRule(
      {
        id: "points",
        input: {
          values: [
            {
              id: "a",
              cells: {
                x: [
                  { p: 0, v: 0 },
                  { p: 1, v: 1 },
                ],
              },
            },
          ],
          schema: {
            kind: "table",
            schema: { row: { fields: { x: { kind: "number", static: true } } } },
          },
        },
      },
      "static-field-stops",
    );
  });

  it("accepts an absent static field", () => {
    const parsed = accepted({
      id: "values",
      input: {
        values: { dy: 1 },
        schema: { kind: "record", fields: { dx: { kind: "number", static: true } } },
      },
    });
    expect(parsed.input.values).toEqual({
      kind: "record",
      fields: { dy: { kind: "static", scalar: "number", value: 1 } },
    });
  });
});

describe("parseTrackDefinition owns binding sources", () => {
  it("refuses an empty or non-string source as requirement-source", () => {
    expectRule(
      {
        id: "shifted",
        plugin: "translate",
        input: { requires: { data: "" } },
      },
      "requirement-source",
      ["translate"],
    );
    expectRule(
      {
        id: "shifted",
        plugin: "translate",
        input: { requires: { data: 4 } },
      },
      "requirement-source",
      ["translate"],
    );
  });

  it("refuses a map binding member that is not a non-empty string as requirement-source", () => {
    expectRule(
      {
        id: "shifted",
        plugin: "translate",
        input: { requires: { data: { a: "points", b: "" } } },
      },
      "requirement-source",
      ["translate"],
    );
  });
});
