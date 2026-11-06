import { describe, expect, it } from "vitest";
import {
  defineModel,
  isModel,
  type Model,
  type PluginDefinition,
  type ValueSpec,
} from "../../../src/contract/v5";
import { parseTrackDefinition, type ParsedValues } from "../../../src/contract/v5-parse";
import type { Interpolator } from "../../../src/ports/interpolator";
import { createValueEvaluator } from "../../../src/runtime/evaluate-values";
import { LocalInput } from "../../../src/runtime/local-input";
import { ComputedProcessor } from "../../../src/runtime/processors/computed";
import { PassthroughProcessor } from "../../../src/runtime/processors/passthrough";
import { Track } from "../../../src/runtime/track";
import { createFakeInterpolator } from "../../../src/testing/fakes";
import { TestRecord } from "../../support/test-models";

const PATH = "motions[0].tracks[0]";

function createPassthroughTrack(options: {
  readonly nodeId: string;
  readonly values: ParsedValues | undefined;
  readonly interpolator: Interpolator;
  readonly model?: Model<unknown, unknown>;
}): Track {
  const model = options.model ?? TestRecord;
  const spec = model.spec;
  const localInput = new LocalInput(
    createValueEvaluator(options.values, options.interpolator, spec),
  );
  const processor = new PassthroughProcessor({ ...options, model });
  return new Track(options.nodeId, localInput, processor);
}

function createComputedTrack(options: {
  readonly nodeId: string;
  readonly plugin: PluginDefinition;
  readonly values: ParsedValues | undefined;
  readonly interpolator: Interpolator;
}): Track {
  const valuesSpec = isModel(options.plugin.inputs.values)
    ? options.plugin.inputs.values.spec
    : options.plugin.inputs.values;
  const localInput = new LocalInput(
    createValueEvaluator(options.values, options.interpolator, valuesSpec),
  );
  const processor = new ComputedProcessor(options);
  return new Track(options.nodeId, localInput, processor);
}

function valuesOf(values: unknown): ParsedValues {
  const outcome = parseTrackDefinition(
    {
      id: "track",
      input: { values },
      output: { model: "TestRecord" },
    },
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

const FAILING_MODEL: Model<unknown, { readonly valid: true }> = defineModel({
  id: "FailingModel",
  spec: RECORD_SPEC,
  parse(value) {
    if (
      typeof value === "object" &&
      value !== null &&
      (value as Record<string, unknown>).x === 999
    ) {
      return { ok: false, issues: [{ path: "x", message: "forbidden value 999" }] };
    }
    return { ok: true, value: { valid: true } };
  },
});

describe("Passthrough and computed track local-input characterization", () => {
  describe("Passthrough recompose rules", () => {
    it("returns true on first move, false on same progress, false on later seek when time-invariant", () => {
      const track = createPassthroughTrack({
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
      const track = createPassthroughTrack({
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

  describe("Computed recompose rules", () => {
    it("returns true for every changed progress and false for unchanged", () => {
      const track = createComputedTrack({
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

  describe("Both processors overlay behavior", () => {
    it("Passthrough: overlay wins over authored evaluation and undefined resumes it", () => {
      const track = createPassthroughTrack({
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

    it("Computed: overlay wins over authored evaluation and undefined resumes it", () => {
      const track = createComputedTrack({
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

  describe("Both processors progress validation and disposal", () => {
    it("Passthrough: throws TypeError on non-finite progress and throws after disposal", () => {
      const track = createPassthroughTrack({
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

    it("Computed: throws TypeError on non-finite progress and throws after disposal", () => {
      const track = createComputedTrack({
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

  describe("Both processors throwing replaceValues keeps previous evaluator active", () => {
    it("Passthrough: throwing replaceValues keeps previous evaluator active", () => {
      const track = createPassthroughTrack({
        nodeId: "demo/track",
        values: valuesOf({ x: 10 }),
        interpolator: createFakeInterpolator(),
        model: FAILING_MODEL,
      });

      expect(track.outputs()).toEqual({ values: { x: 10 } });
      expect(() => track.replaceValues(valuesOf({ x: 999 }))).toThrow();
      expect(track.outputs()).toEqual({ values: { x: 10 } });
    });

    it("Computed: throwing replaceValues keeps previous evaluator active", () => {
      let failRebuild = false;
      const baseInterpolator = createFakeInterpolator();
      const track = createComputedTrack({
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
