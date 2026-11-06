import { defineModel, type Model } from "../../src/contract/v5";
import { builtinModels } from "../../../plugins/src/models/index";
import { Spec } from "../../src/contract/spec-builder";

/** Open record used by fixtures whose source has no narrower contract. */
export const TestRecord: Model = defineModel({
  id: "TestRecord",
  spec: Spec.record({}, { additionalProperties: true }),
});

/** Open table used by fixtures whose source has no narrower contract. */
export const TestTable: Model = defineModel({
  id: "TestTable",
  spec: Spec.table({}, { additionalProperties: true }),
});

/** Record with one static field, for static-cell refusal fixtures. */
export const StaticRecord: Model = defineModel({
  id: "StaticRecord",
  spec: Spec.record({ dx: Spec.number({ static: true }) }),
});

/** Two-field record with a static flag, for param and values static guards. */
export const StaticFlags: Model = defineModel({
  id: "StaticFlags",
  spec: Spec.record({ flip: Spec.boolean({ static: true }), n: Spec.number() }),
});

/** Live-write record: x required, y optional, so partial writes stay explicit about x. */
export const LiveRecord: Model = defineModel({
  id: "LiveRecord",
  spec: Spec.record({ x: Spec.number(), y: Spec.number({ optional: true }) }),
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
