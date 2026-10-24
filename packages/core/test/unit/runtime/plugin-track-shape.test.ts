import { describe, expect, it } from "vitest";
import type { PluginDefinition, ValueSpec } from "../../../src/contract/v5";
import { parseTrackDefinition } from "../../../src/contract/v5-parse";
import type { ParsedValues } from "../../../src/contract/v5-parse";
import { PluginNodeError } from "../../../src/runtime/plugin-output";
import { PluginTrack } from "../../../src/runtime/plugin-track";
import { createFakeInterpolator } from "../../../src/testing/fakes";

const PATH = "motions[0].tracks[0]";

function valuesOf(values: unknown): ParsedValues {
  const outcome = parseTrackDefinition({ id: "values", input: { values } }, PATH);
  if (outcome.kind !== "accepted") throw new Error(JSON.stringify(outcome.diagnostics));
  const parsed = outcome.value.input.values;
  if (parsed === undefined) throw new Error("The fixture authored no values.");
  return parsed;
}

function pluginDeclaring(values: ValueSpec): PluginDefinition {
  return {
    id: "shape",
    inputs: { values },
    outputs: { values: { kind: "record", fields: {} } },
    transform() {
      throw new Error("transform must not run for a shape mismatch");
    },
  };
}

function refusalOf(track: PluginTrack): string {
  try {
    track.compose({});
  } catch (error) {
    expect(error).toBeInstanceOf(PluginNodeError);
    const diagnostics = (error as PluginNodeError).diagnostics;
    return diagnostics[0]?.ruleId ?? "";
  }
  return "no refusal";
}

describe("plugin track local shape", () => {
  it("refuses a table where the plugin declares a record as values-shape-invalid", () => {
    const track = new PluginTrack({
      nodeId: "points",
      plugin: pluginDeclaring({ kind: "record", fields: { dx: { kind: "number" } } }),
      values: valuesOf([{ id: "point-a", cells: { dx: 10 } }]),
      interpolator: createFakeInterpolator(),
    });
    expect(refusalOf(track)).toBe("values-shape-invalid");
    track.dispose();
  });

  it("refuses a record where the plugin declares a table as values-shape-invalid", () => {
    const track = new PluginTrack({
      nodeId: "points",
      plugin: pluginDeclaring({
        kind: "table",
        schema: { row: { fields: { dx: { kind: "number" } } } },
      }),
      values: valuesOf({ dx: 10 }),
      interpolator: createFakeInterpolator(),
    });
    expect(refusalOf(track)).toBe("values-shape-invalid");
    track.dispose();
  });
});
