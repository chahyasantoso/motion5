import { describe, expect, it } from "vitest";
import { parseTrackDefinition, type ParsedTrack } from "../../src/contract/v5-parse";
import type { Diagnostic, PluginDefinition } from "../../src/contract/v5";
import { admitDeclaration } from "../../src/domain/plugin-catalog";
import { defineModel } from "../../src/contract/v5";
import { Spec } from "../../src/contract/spec-builder";

const FIXTURE_OUT_1 = defineModel({ id: "FixtureOut1", spec: Spec.record({}) });

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
      output: { model: "TestTable" },
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
      output: { model: "TestRecord" },
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
      output: { model: "TestRecord" },
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
      output: { model: "TestTable" },
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
    expect(
      accepted({ id: "a", input: { values: [] }, output: { model: "TestTable" } }).input.values,
    ).toEqual({
      kind: "table",
      rows: [],
    });
    expect(
      accepted({ id: "b", input: { values: {} }, output: { model: "TestRecord" } }).input.values,
    ).toEqual(Spec.record({}));
    expect(
      accepted({
        id: "c",
        input: { values: [{ id: "row", cells: {} }] },
        output: { model: "TestTable" },
      }).input.values,
    ).toEqual({
      kind: "table",
      rows: [{ id: "row", cells: {} }],
    });
  });

  it("defaults an omitted input to no local values and no bindings", () => {
    const parsed = accepted({ id: "points", output: { model: "TestRecord" } });

    expect(parsed).toEqual({
      id: "points",
      input: { requires: {} },
      output: { model: "TestRecord" },
    });
    expect(parsed.input.values).toBeUndefined();
  });

  it("refuses a retired input schema", () => {
    const found = expectRule(
      {
        id: "points",
        input: { values: [], schema: Spec.table({}) },
        output: { model: "TestTable" },
      },
      "input-schema-retired",
    );
    expect(found.message).toContain("output");
  });

  it("accepts a registered plugin track with single and map bindings", () => {
    const parsed = accepted(
      {
        id: "shifted",
        output: { plugin: "translate" },
        input: {
          values: { dx: 10 },
          requires: { data: "points", mapped: { a: "one", b: "two" } },
        },
      },
      ["translate"],
    );

    expect(parsed.output).toEqual({ plugin: "translate" });
    expect(parsed.input.requires).toEqual({
      data: "points",
      mapped: { a: "one", b: "two" },
    });
  });

  it("refuses an empty requires object on a model output", () => {
    expectRule(
      { id: "points", input: { requires: {} }, output: { model: "TestRecord" } },
      "requires-not-allowed",
    );
  });

  it("keeps an envelope id and a cell named id as separate members", () => {
    const parsed = accepted({
      id: "points",
      input: { values: [{ id: "row", cells: { id: "external-1", x: 1 } }] },
      output: { model: "TestTable" },
    });

    expect(parsed.input.values).toMatchObject({
      rows: [{ id: "row", cells: { id: { value: "external-1" }, x: { value: 1 } } }],
    });
  });

  it("freezes the parsed values it returns", () => {
    const parsed = accepted({
      id: "points",
      input: { values: [{ id: "row", cells: { x: [{ p: 0, v: 0 }] } }] },
      output: { model: "TestTable" },
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
    expectRule(
      { id: "points", input: { claims: {} }, output: { model: "TestRecord" } },
      "track-field-unknown",
    );
  });

  it("refuses an unknown row member as track-field-unknown", () => {
    expectRule(
      {
        id: "points",
        input: { values: [{ id: "a", cells: {}, label: "x" }] },
        output: { model: "TestTable" },
      },
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
    expectRule({ id: "points", input: [], output: { model: "TestRecord" } }, "track-field-unknown");
  });
});

describe("parseTrackDefinition owns the row envelope", () => {
  it("refuses a flat row without id and cells as row-id-invalid", () => {
    const found = expectRule(
      { id: "points", input: { values: [{ point: "a", x: 0 }] }, output: { model: "TestTable" } },
      "row-id-invalid",
    );
    expect(found.path).toBe(`${PATH}.input.values[0].id`);
  });

  it("refuses an empty or non-string row id as row-id-invalid", () => {
    expectRule(
      { id: "points", input: { values: [{ id: "", cells: {} }] }, output: { model: "TestTable" } },
      "row-id-invalid",
    );
    expectRule(
      { id: "points", input: { values: [{ id: 1, cells: {} }] }, output: { model: "TestTable" } },
      "row-id-invalid",
    );
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
        output: { model: "TestTable" },
      },
      "row-id-duplicate",
    );
    expect(found.path).toBe(`${PATH}.input.values[1].id`);
  });

  it("refuses reserved row ids as name-reserved", () => {
    expectRule(
      {
        id: "points",
        input: { values: [{ id: "__proto__", cells: {} }] },
        output: { model: "TestTable" },
      },
      "name-reserved",
    );
  });

  it("refuses a row without a cells object as cell-form-invalid", () => {
    expectRule(
      { id: "points", input: { values: [{ id: "a" }] }, output: { model: "TestTable" } },
      "cell-form-invalid",
    );
    expectRule(
      { id: "points", input: { values: [{ id: "a", cells: [] }] }, output: { model: "TestTable" } },
      "cell-form-invalid",
    );
  });
});

describe("parseTrackDefinition owns cells and stops", () => {
  it("refuses a structured, empty-object, wrapper or null cell as cell-form-invalid", () => {
    expectRule(
      { id: "values", input: { values: { x: { literal: 1 } } }, output: { model: "TestRecord" } },
      "cell-form-invalid",
    );
    expectRule(
      { id: "values", input: { values: { x: {} } }, output: { model: "TestRecord" } },
      "cell-form-invalid",
    );
    expectRule(
      { id: "values", input: { values: { x: RETIRED_WRAPPER } }, output: { model: "TestRecord" } },
      "cell-form-invalid",
    );
    expectRule(
      { id: "values", input: { values: { x: null } }, output: { model: "TestRecord" } },
      "cell-form-invalid",
    );
  });

  it("refuses an empty stop array as cell-stops-invalid", () => {
    expectRule(
      { id: "values", input: { values: { x: [] } }, output: { model: "TestRecord" } },
      "cell-stops-invalid",
    );
  });

  it("refuses a non-object stop as cell-stops-invalid", () => {
    expectRule(
      { id: "values", input: { values: { x: [1] } }, output: { model: "TestRecord" } },
      "cell-stops-invalid",
    );
  });

  it("refuses a stop position outside [0, 1] as cell-stops-invalid", () => {
    expectRule(
      {
        id: "values",
        input: { values: { x: [{ p: 1.5, v: 0 }] } },
        output: { model: "TestRecord" },
      },
      "cell-stops-invalid",
    );
    expectRule(
      {
        id: "values",
        input: { values: { x: [{ p: -0.1, v: 0 }] } },
        output: { model: "TestRecord" },
      },
      "cell-stops-invalid",
    );
  });

  it("refuses a non-finite stop position as cell-stops-invalid", () => {
    expectRule(
      {
        id: "values",
        input: { values: { x: [{ p: Number.NaN, v: 0 }] } },
        output: { model: "TestRecord" },
      },
      "cell-stops-invalid",
    );
    expectRule(
      {
        id: "values",
        input: { values: { x: [{ p: Number.POSITIVE_INFINITY, v: 0 }] } },
        output: { model: "TestRecord" },
      },
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
        output: { model: "TestRecord" },
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
        output: { model: "TestRecord" },
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
        output: { model: "TestTable" },
      },
      "cell-stops-invalid",
    );
    expect(found.path).toBe(`${PATH}.input.values[0].cells.x[1].p`);
  });

  it("refuses a missing, non-scalar or non-finite stop value as cell-stops-invalid", () => {
    expectRule(
      { id: "values", input: { values: { x: [{ p: 0 }] } }, output: { model: "TestRecord" } },
      "cell-stops-invalid",
    );
    expectRule(
      {
        id: "values",
        input: { values: { x: [{ p: 0, v: {} }] } },
        output: { model: "TestRecord" },
      },
      "cell-stops-invalid",
    );
    expectRule(
      {
        id: "values",
        input: { values: { x: [{ p: 0, v: Number.NaN }] } },
        output: { model: "TestRecord" },
      },
      "cell-stops-invalid",
    );
  });

  it("refuses an unknown stop member as cell-stops-invalid", () => {
    expectRule(
      {
        id: "values",
        input: { values: { x: [{ p: 0, v: 1, curve: "linear" }] } },
        output: { model: "TestRecord" },
      },
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
        output: { model: "TestRecord" },
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
        output: { model: "TestRecord" },
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
        output: { model: "TestRecord" },
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
        output: { model: "TestRecord" },
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
        output: { model: "TestRecord" },
      },
      "cell-kind-conflict",
    );
  });

  it("refuses reserved column and record field names as name-reserved", () => {
    expectRule(
      {
        id: "points",
        input: { values: [{ id: "a", cells: { constructor: 1 } }] },
        output: { model: "TestTable" },
      },
      "name-reserved",
    );
    expectRule(
      { id: "values", input: { values: { prototype: 1 } }, output: { model: "TestRecord" } },
      "name-reserved",
    );
  });
});

describe("parseTrackDefinition owns the output member", () => {
  it("refuses a missing output", () => {
    expectRule({ id: "points" }, "output-missing");
  });

  it("refuses an output with both keys or neither", () => {
    expectRule(
      { id: "points", output: { model: "TestRecord", plugin: "translate" } },
      "output-invalid",
    );
    expectRule({ id: "points", output: {} }, "output-invalid");
  });

  it("refuses the retired type field by name", () => {
    expectRule(
      { id: "points", type: "body2d", output: { model: "TestRecord" } },
      "type-field-retired",
    );
  });

  it("refuses param on a model output", () => {
    expectRule(
      {
        id: "points",
        output: { model: "TestRecord" },
        input: { param: { x: 1 } },
      },
      "param-not-allowed",
    );
  });

  it("refuses values on a plugin that declares none and accepts an empty input", () => {
    const plugin: PluginDefinition = {
      id: "converter",
      inputs: {},
      outputs: { values: FIXTURE_OUT_1 },
      transform: () => ({ values: {} }),
    };
    const context = {
      isPluginRegistered: () => true,
      pluginDefinition: () => admitDeclaration(plugin),
    };
    const refused = parseTrackDefinition(
      { id: "converted", output: { plugin: "converter" }, input: { values: { n: 1 } } },
      PATH,
      context,
    );
    expect(refused.kind).toBe("refused");
    if (refused.kind === "refused")
      expect(refused.diagnostics.map(({ ruleId }) => ruleId)).toContain("values-not-allowed");

    const accepted = parseTrackDefinition(
      { id: "converted", output: { plugin: "converter" } },
      PATH,
      context,
    );
    expect(accepted.kind).toBe("accepted");
  });

  it("names the registered models and plugins in unknown-name refusals", () => {
    const model = parseTrackDefinition({ id: "points", output: { model: "Nope" } }, PATH, {
      model: () => undefined,
      modelIds: () => ["Body2d", "Camera"],
    });
    expect(model.kind).toBe("refused");
    if (model.kind === "refused") expect(model.diagnostics[0]?.message).toContain("Body2d, Camera");

    const plugin = parseTrackDefinition({ id: "points", output: { plugin: "nope" } }, PATH, {
      isPluginRegistered: () => false,
      pluginIds: () => ["fk", "ik"],
    });
    expect(plugin.kind).toBe("refused");
    if (plugin.kind === "refused") expect(plugin.diagnostics[0]?.message).toContain("fk, ik");
  });

  it("refuses an unknown model when a model registry answers", () => {
    const outcome = parseTrackDefinition({ id: "points", output: { model: "Nope" } }, PATH, {
      model: () => undefined,
    });
    expect(outcome.kind).toBe("refused");
    if (outcome.kind === "refused")
      expect(outcome.diagnostics.map(({ ruleId }) => ruleId)).toContain("model-unknown");
  });
});

describe("parseTrackDefinition selects plugins", () => {
  it("refuses an unregistered, empty or non-string plugin id as plugin-unknown", () => {
    expectRule({ id: "shifted", output: { plugin: "missing" } }, "plugin-unknown");
    expectRule({ id: "shifted", output: { plugin: "" } }, "output-invalid");
    expectRule({ id: "shifted", output: { plugin: 4 } }, "output-invalid");
  });

  it("refuses requires on a model output as requires-not-allowed", () => {
    const found = expectRule(
      { id: "points", input: { requires: { data: "points" } }, output: { model: "TestRecord" } },
      "requires-not-allowed",
    );
    expect(found.path).toBe(`${PATH}.input.requires`);
  });

  it("refuses input.schema on a plugin track as input-schema-retired", () => {
    const found = expectRule(
      {
        id: "shifted",
        output: { plugin: "translate" },
        input: {
          values: { dx: 10 },
          schema: Spec.record({ dx: Spec.number() }),
        },
      },
      "input-schema-retired",
      ["translate"],
    );
    expect(found.path).toBe(`${PATH}.input.schema`);
  });
});

describe("parseTrackDefinition owns binding sources", () => {
  it("refuses an empty or non-string source as requirement-source", () => {
    expectRule(
      {
        id: "shifted",
        output: { plugin: "translate" },
        input: { requires: { data: "" } },
      },
      "requirement-source",
      ["translate"],
    );
    expectRule(
      {
        id: "shifted",
        output: { plugin: "translate" },
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
        output: { plugin: "translate" },
        input: { requires: { data: { a: "points", b: "" } } },
      },
      "requirement-source",
      ["translate"],
    );
  });
});
