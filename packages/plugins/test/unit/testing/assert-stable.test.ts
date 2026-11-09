import { describe, expect, it } from "vitest";
import type { Outputs, PluginDefinition } from "@motion5/core/plugin-api";
import { assertStable } from "../../../src/testing/assert-stable";
import { Spec, defineModel } from "@motion5/core/plugin-api";

const STABLE: PluginDefinition = {
  id: "stable",
  inputs: { values: Spec.record({}) },
  outputs: {
    values: defineModel({
      id: "StableOut",
      spec: Spec.table({ owner: Spec.string(), x: Spec.number() }),
    }),
  },
  transform(_input, context) {
    return {
      values: [{ id: "bone", cells: { owner: "rig", x: context.progress } }],
    };
  },
};

const MOVING: PluginDefinition = {
  ...STABLE,
  id: "moving",
  transform(_input, context): Outputs {
    return {
      values: [{ id: `bone-${context.progress}`, cells: { owner: "rig", x: context.progress } }],
    };
  },
};

const fixtures = [{ name: "bone", input: { values: {}, requires: {} } }];

describe("assertStable", () => {
  it("accepts constant row ids and static cells", () => {
    expect(() => assertStable(STABLE, fixtures)).not.toThrow();
  });

  it("refuses a row id that moves across progress", () => {
    expect(() => assertStable(MOVING, fixtures)).toThrow(/changed row ids/);
  });

  it("checks declared numeric static fields", () => {
    const numeric = {
      ...STABLE,
      id: "numeric",
      outputs: {
        values: Spec.table({ limit: Spec.number(), x: Spec.number() }),
      },
      transform: (_input: never, context: { readonly progress: number }) => ({
        values: [{ id: "bone", cells: { limit: context.progress, x: context.progress } }],
      }),
    };
    expect(() => assertStable(numeric, fixtures)).not.toThrow();
    expect(() => assertStable(numeric, fixtures, { staticFields: ["limit"] })).toThrow(
      /changed static cells/,
    );
  });

  it("refuses a static cell that moves across progress", () => {
    const dynamic = {
      ...STABLE,
      id: "dynamic",
      transform: (_input: never, context: { readonly progress: number }) => ({
        values: [{ id: "bone", cells: { owner: context.progress > 0.5 ? "a" : "b", x: 0 } }],
      }),
    };
    expect(() => assertStable(dynamic, fixtures)).toThrow(/changed static cells/);
  });
});
