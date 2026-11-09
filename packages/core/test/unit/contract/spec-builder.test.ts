import { describe, expect, it } from "vitest";
import { Spec } from "../../../src/plugin-api";

describe("Spec", () => {
  it("builds the same field objects as their literals", () => {
    expect(Spec.number()).toStrictEqual({ kind: "number" });
    expect(Spec.string({ enum: ["a"], static: true })).toStrictEqual({
      kind: "string",
      enum: ["a"],
      static: true,
    });
    expect(Spec.boolean({ optional: true })).toStrictEqual({ kind: "boolean", optional: true });
  });

  it("builds the same record as its literal", () => {
    const fields = { x: Spec.number() };
    expect(Spec.record(fields)).toStrictEqual({ kind: "record", fields });
    expect(Spec.record(fields, { additionalProperties: true, optional: true })).toStrictEqual({
      kind: "record",
      fields,
      additionalProperties: true,
      optional: true,
    });
  });

  it("builds the same table as its literal", () => {
    const fields = { x: Spec.number() };
    expect(Spec.table(fields)).toStrictEqual({ kind: "table", schema: { row: { fields } } });
    expect(
      Spec.table(fields, { additionalProperties: false, minRows: 1, maxRows: 2, optional: true }),
    ).toStrictEqual({
      kind: "table",
      schema: { row: { fields, additionalProperties: false }, minRows: 1, maxRows: 2 },
      optional: true,
    });
  });
});
