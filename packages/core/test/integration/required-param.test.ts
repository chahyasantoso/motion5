import { describe, expect, it } from "vitest";
import { defineModel, type PluginDefinition, type ProjectDefinition } from "../../src/contract/v5";
import { Spec } from "../../src/contract/spec-builder";
import { PluginCatalog } from "../../src/domain/plugin-catalog";
import { Engine } from "../../src/engine";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/testing/fakes";
import { validateV5 } from "../../src/validate-v5";

const Out = defineModel({ id: "RequiredParamOut", spec: Spec.record({ n: Spec.number() }) });

function plugin(id: string, param: ReturnType<typeof Spec.record>): PluginDefinition {
  return {
    id,
    inputs: { param },
    outputs: { values: Out },
    transform: () => ({ values: { n: 1 } }),
  };
}

const catalog = () =>
  new PluginCatalog({
    plugins: [
      plugin("needs", Spec.record({ height: Spec.number() })),
      plugin("relaxed", Spec.record({ height: Spec.number({ optional: true }) })),
      plugin("optional-channel", Spec.record({ height: Spec.number() }, { optional: true })),
    ],
  });

function project(pluginId: string, param?: Record<string, number>): ProjectDefinition {
  return {
    schemaVersion: 5,
    motions: [
      {
        id: "m",
        trigger: { type: "manual" },
        tracks: [
          {
            id: "t",
            output: { plugin: pluginId },
            ...(param === undefined ? {} : { input: { param } }),
          },
        ],
      },
    ],
  };
}

const engine = () =>
  new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
    plugins: catalog(),
  });

describe("a plugin's required param", () => {
  it("is refused by validateV5 when the track authors no param at all", () => {
    const result = validateV5(project("needs"), catalog());
    expect(result.kind).toBe("refused");
    expect(result.diagnostics.map(({ ruleId, path }) => [ruleId, path])).toEqual([
      ["cell-form-invalid", "motions[0].tracks[0].input.param.height"],
    ]);
  });

  it("is refused by load", () => {
    expect(() => engine().load(project("needs"))).toThrow(/cell-form-invalid/);
  });

  it("is refused by addTrack", () => {
    const handle = engine().load({ schemaVersion: 5, motions: [] });
    expect(() => handle.addTrack({ id: "t", output: { plugin: "needs" } })).toThrow(
      /cell-form-invalid/,
    );
  });

  it("accepts an authored param", () => {
    expect(validateV5(project("needs", { height: 1 }), catalog()).kind).toBe("accepted");
  });

  it("accepts an absent param when the whole channel is optional", () => {
    expect(validateV5(project("optional-channel"), catalog()).kind).toBe("accepted");
  });

  it("accepts an absent param when every field is optional", () => {
    expect(validateV5(project("relaxed"), catalog()).kind).toBe("accepted");
  });
});
