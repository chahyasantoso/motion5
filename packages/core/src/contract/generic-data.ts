import type { DataType, Parsed, Structure, Value } from "./v5";

/** The type id an unannotated data track carries. */
export const GENERIC_DATA_TYPE_ID = "data";

/** Ad-hoc data owns no static cells; its authored shape is validated as generic values. */
export const genericDataType: DataType<Value, Value> = {
  id: GENERIC_DATA_TYPE_ID,
  spec: { kind: "record", fields: {}, additionalProperties: true },
  parse(value: Value): Parsed<Value> {
    return { kind: "parsed", structure: value, warnings: [] };
  },
  bind(structure: Structure<Value>, _value: Value): Value {
    return structure;
  },
};
