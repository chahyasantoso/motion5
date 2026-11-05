import { describe, expect, it } from "vitest";
import type {
  DataType,
  PluginDefinition,
  Structure,
  Value,
  ValueSpec,
} from "../../../src/contract/v5";
import { parseTrackDefinition, type ParsedValues } from "../../../src/contract/v5-parse";
import { PluginTrack } from "../../../src/runtime/plugin-track";
import { ValueTrack } from "../../../src/runtime/value-track";
import { createFakeInterpolator } from "../../../src/testing/fakes";

const PATH = "motions[0].tracks[0]";

function valuesOf(values: unknown, schema?: ValueSpec): ParsedValues {
  const outcome = parseTrackDefinition(
    { id: "track", input: { values, ...(schema ? { schema } : {}) } },
    PATH,
  );
  if (outcome.kind !== "accepted") throw new Error(JSON.stringify(outcome.diagnostics));
  const parsed = outcome.value.input.values;
  if (parsed === undefined) throw new Error("Parsed values undefined");
  return parsed;
}

const RECORD_SPEC: ValueSpec = {
  kind: "record",
  fields: { x: { kind: "number" } },
};

function pluginWithValues(spec: ValueSpec = RECORD_SPEC): PluginDefinition {
  return {
    id: "test-plugin",
    inputs: { values: spec },
    outputs: { values: spec },
    transform(input) {
      return { values: input.values };
    },
  };
}

const FAILING_TYPE: DataType<{ readonly valid: true }, Value> = {
  id: "failing-type",
  spec: RECORD_SPEC,
  parse(value) {
    if (
      typeof value === "object" &&
      value !== null &&
      (value as Record<string, unknown>).x === 999
    ) {
      return { kind: "refused", errors: [{ path: ["x"], message: "forbidden value 999" }] };
    }
    return { kind: "parsed", structure: { valid: true }, warnings: [] };
  },
  bind(_structure: Structure<{ readonly valid: true }>, value: Value) {
    return value;
  },
};

describe("ValueTrack and PluginTrack local-input characterization", () => {
  describe("ValueTrack recompose rules", () => {
    it("returns true on first move, false on same progress, false on later seek when time-invariant", () => {
      const track = new ValueTrack({
        nodeId: "demo/static",
        values: valuesOf({ x: 10 }),
        interpolator: createFakeInterpolator(),
      });

      expect(track.setProgress(0.5)).toBe(true);
      expect(track.setProgress(0.5)).toBe(false);
      expect(track.setProgress(0.8)).toBe(false);
      expect(track.setProgress(0.2)).toBe(false);
    });

    it("returns true on first move, false on same progress, true on later seek when animated", () => {
      const track = new ValueTrack({
        nodeId: "demo/animated",
        values: valuesOf({
          x: [
            { p: 0, v: 10 },
            { p: 1, v: 20 },
          ],
        }),
        interpolator: createFakeInterpolator(),
      });

      expect(track.setProgress(0.5)).toBe(true);
      expect(track.setProgress(0.5)).toBe(false);
      expect(track.setProgress(0.8)).toBe(true);
      expect(track.setProgress(0.8)).toBe(false);
      expect(track.setProgress(0.2)).toBe(true);
    });
  });

  describe("PluginTrack recompose rules", () => {
    it("returns true for every changed progress and false for unchanged", () => {
      const track = new PluginTrack({
        nodeId: "demo/plugin",
        plugin: pluginWithValues(),
        values: valuesOf({ x: 10 }),
        interpolator: createFakeInterpolator(),
      });

      expect(track.setProgress(0.5)).toBe(true);
      expect(track.setProgress(0.5)).toBe(false);
      expect(track.setProgress(0.8)).toBe(true);
      expect(track.setProgress(0.8)).toBe(false);
      expect(track.setProgress(0.2)).toBe(true);
    });
  });

  describe("Both classes overlay behavior", () => {
    it("ValueTrack: overlay wins over authored evaluation and undefined resumes it", () => {
      const track = new ValueTrack({
        nodeId: "demo/track",
        values: valuesOf({ x: 10 }),
        interpolator: createFakeInterpolator(),
      });

      expect(track.outputs()).toEqual({ values: { x: 10 } });
      track.replaceOverlay({ x: 42 });
      expect(track.outputs()).toEqual({ values: { x: 42 } });
      track.replaceOverlay(undefined);
      expect(track.outputs()).toEqual({ values: { x: 10 } });
    });

    it("PluginTrack: overlay wins over authored evaluation and undefined resumes it", () => {
      const track = new PluginTrack({
        nodeId: "demo/track",
        plugin: pluginWithValues(),
        values: valuesOf({ x: 10 }),
        interpolator: createFakeInterpolator(),
      });

      expect(track.compose({}).outputs).toEqual({ values: { x: 10 } });
      track.replaceOverlay({ x: 42 });
      expect(track.compose({}).outputs).toEqual({ values: { x: 42 } });
      track.replaceOverlay(undefined);
      expect(track.compose({}).outputs).toEqual({ values: { x: 10 } });
    });
  });

  describe("Both classes progress validation and disposal", () => {
    it("ValueTrack: throws TypeError on non-finite progress and throws after disposal", () => {
      const track = new ValueTrack({
        nodeId: "demo/track",
        values: valuesOf({ x: 10 }),
        interpolator: createFakeInterpolator(),
      });

      expect(() => track.setProgress(NaN)).toThrow(TypeError);
      expect(() => track.setProgress(Infinity)).toThrow(TypeError);
      expect(() => track.setProgress(-Infinity)).toThrow(TypeError);

      track.dispose();
      expect(() => track.dispose()).not.toThrow();
      expect(() => track.setProgress(0.5)).toThrow(/disposed/);
      expect(() => track.replaceOverlay({ x: 1 })).toThrow(/disposed/);
      expect(() => track.replaceValues(valuesOf({ x: 2 }))).toThrow(/disposed/);
      expect(() => track.outputs()).toThrow(/disposed/);
    });

    it("PluginTrack: throws TypeError on non-finite progress and throws after disposal", () => {
      const track = new PluginTrack({
        nodeId: "demo/track",
        plugin: pluginWithValues(),
        values: valuesOf({ x: 10 }),
        interpolator: createFakeInterpolator(),
      });

      expect(() => track.setProgress(NaN)).toThrow(TypeError);
      expect(() => track.setProgress(Infinity)).toThrow(TypeError);
      expect(() => track.setProgress(-Infinity)).toThrow(TypeError);

      track.dispose();
      expect(() => track.dispose()).not.toThrow();
      expect(() => track.setProgress(0.5)).toThrow(/disposed/);
      expect(() => track.replaceOverlay({ x: 1 })).toThrow(/disposed/);
      expect(() => track.replaceValues(valuesOf({ x: 2 }))).toThrow(/disposed/);
      expect(() => track.compose({})).toThrow(/disposed/);
    });
  });

  describe("Both classes throwing replaceValues keeps previous evaluator active", () => {
    it("ValueTrack: throwing replaceValues keeps previous evaluator active", () => {
      const track = new ValueTrack({
        nodeId: "demo/track",
        values: valuesOf({ x: 10 }),
        interpolator: createFakeInterpolator(),
        dataType: FAILING_TYPE,
      });

      expect(track.outputs()).toEqual({ values: { x: 10 } });
      expect(() => track.replaceValues(valuesOf({ x: 999 }))).toThrow();
      expect(track.outputs()).toEqual({ values: { x: 10 } });
    });

    it("PluginTrack: throwing replaceValues keeps previous evaluator active", () => {
      let failRebuild = false;
      const baseInterpolator = createFakeInterpolator();
      const track = new PluginTrack({
        nodeId: "demo/track",
        plugin: pluginWithValues(),
        values: valuesOf({ x: 10 }),
        interpolator: {
          create(config) {
            if (failRebuild) throw new Error("rebuild failure");
            return baseInterpolator.create(config);
          },
        },
      });

      expect(track.compose({}).outputs).toEqual({ values: { x: 10 } });
      failRebuild = true;
      expect(() =>
        track.replaceValues(
          valuesOf({
            x: [
              { p: 0, v: 20 },
              { p: 1, v: 30 },
            ],
          }),
        ),
      ).toThrow("rebuild failure");
      failRebuild = false;
      expect(track.compose({}).outputs).toEqual({ values: { x: 10 } });
    });
  });
});
