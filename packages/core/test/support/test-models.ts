import { defineModel, type Model } from "../../src/contract/v5";
import { builtinModels } from "../../../plugins/src/models";

/** Open record used by fixtures whose source has no narrower contract. */
export const TestRecord: Model = defineModel({
  id: "TestRecord",
  spec: { kind: "record", fields: {}, additionalProperties: true },
});

/** Open table used by fixtures whose source has no narrower contract. */
export const TestTable: Model = defineModel({
  id: "TestTable",
  spec: {
    kind: "table",
    schema: { row: { fields: {}, additionalProperties: true } },
  },
});

/** Record with one static field, for static-cell refusal fixtures. */
export const StaticRecord: Model = defineModel({
  id: "StaticRecord",
  spec: {
    kind: "record",
    fields: { dx: { kind: "number", static: true } },
  },
});

/** Two-field record with a static flag, for param and values static guards. */
export const StaticFlags: Model = defineModel({
  id: "StaticFlags",
  spec: {
    kind: "record",
    fields: { flip: { kind: "boolean", static: true }, n: { kind: "number" } },
  },
});

/** Live-write record: x required, y optional, so partial writes stay explicit about x. */
export const LiveRecord: Model = defineModel({
  id: "LiveRecord",
  spec: {
    kind: "record",
    fields: { x: { kind: "number" }, y: { kind: "number", optional: true } },
  },
});

export const testModels: readonly Model<unknown, unknown>[] = Object.freeze([
  ...builtinModels,
  TestRecord,
  TestTable,
  StaticRecord,
  StaticFlags,
  LiveRecord,
]);

export function testModel(id: string): Model<unknown, unknown> | undefined {
  return testModels.find((model) => model.id === id);
}
