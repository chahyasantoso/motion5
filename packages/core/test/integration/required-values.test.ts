import { describe, expect, it } from "vitest";
import {
  defineModel,
  type PluginDefinition,
  type ProjectDefinition,
  type ValueSpec,
} from "../../src/contract/v5";
import { Spec } from "../../src/contract/spec-builder";
import { PluginCatalog } from "../../src/domain/plugin-catalog";
import { Engine } from "../../src/engine";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/testing/fakes";
import { validateV5 } from "../../src/validate-v5";

const Out = defineModel({ id: "RequiredValuesOut", spec: Spec.record({ n: Spec.number() }) });

function plugin(id: string, values: ValueSpec): PluginDefinition {
  return {
    id,
    inputs: { values },
    outputs: { values: Out },
    transform: () => ({ values: { n: 1 } }),
  };
}

const catalog = () =>
  new PluginCatalog({
    models: [Out],
    plugins: [
      plugin("needs-record", Spec.record({ dx: Spec.number() })),
      plugin("relaxed-record", Spec.record({ dx: Spec.number({ optional: true }) })),
      plugin("needs-row", Spec.table({ dx: Spec.number() }, { minRows: 1 })),
      plugin("any-rows", Spec.table({ dx: Spec.number() })),
    ],
  });

function project(pluginId: string): ProjectDefinition {
  return {
    schemaVersion: 5,
    motions: [
      {
        id: "m",
        trigger: { type: "manual" },
        tracks: [{ id: "t", output: { plugin: pluginId } }],
      },
    ],
  };
}

function rules(pluginId: string) {
  return validateV5(project(pluginId), catalog()).diagnostics.map(({ ruleId, path }) => [
    ruleId,
    path,
  ]);
}

describe("a plugin's required values", () => {
  it("refuses an absent record with a required field, by name", () => {
    expect(rules("needs-record")).toEqual([
      ["cell-form-invalid", "motions[0].tracks[0].input.values.dx"],
    ]);
  });

  it("refuses an absent table that needs a row", () => {
    expect(validateV5(project("needs-row"), catalog()).kind).toBe("refused");
    expect(rules("needs-row").map(([ruleId]) => ruleId)).toEqual(["values-shape-invalid"]);
  });

  it("is refused by addTrack as well", () => {
    const handle = new Engine({
      clock: createManualClock(),
      interpolator: createFakeInterpolator(),
      scheduler: createFakeScheduler(),
      plugins: catalog(),
    }).load({ schemaVersion: 5, motions: [] });
    expect(() => handle.addTrack({ id: "t", output: { plugin: "needs-record" } })).toThrow(
      /cell-form-invalid/,
    );
  });

  it("accepts an absent record when every field is optional", () => {
    expect(validateV5(project("relaxed-record"), catalog()).kind).toBe("accepted");
  });

  it("accepts an absent table with no minimum", () => {
    expect(validateV5(project("any-rows"), catalog()).kind).toBe("accepted");
  });

  it("leaves a model track with no values alone", () => {
    const free: ProjectDefinition = {
      schemaVersion: 5,
      motions: [],
      freeTracks: [{ id: "cursor", output: { model: "RequiredValuesOut" } }],
    };
    expect(validateV5(free, catalog()).kind).toBe("accepted");
  });
});
