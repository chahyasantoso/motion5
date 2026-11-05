import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import type { Model } from "../../../src/contract/v5";
import { parseTrackDefinition, type ParsedValues } from "../../../src/contract/v5-parse";
import { createValueEvaluator } from "../../../src/runtime/evaluate-values";
import { LocalInput } from "../../../src/runtime/local-input";
import { ComputedProcessor } from "../../../src/runtime/processors/computed";
import { PassthroughProcessor } from "../../../src/runtime/processors/passthrough";
import { Track } from "../../../src/runtime/track";
import { createFakeInterpolator } from "../../../src/testing/fakes";

const here = fileURLToPath(import.meta.url);

function valuesOf(values: unknown): ParsedValues {
  const outcome = parseTrackDefinition({ id: "track", input: { values } }, "tracks[0]");
  if (outcome.kind !== "accepted") throw new Error(JSON.stringify(outcome.diagnostics));
  const parsed = outcome.value.input.values;
  if (parsed === undefined) throw new Error("No values parsed.");
  return parsed;
}

function isCountRecord(raw: unknown): raw is { readonly count: number } {
  if (typeof raw !== "object" || raw === null || !("count" in raw)) return false;
  const count = Reflect.get(raw, "count");
  return typeof count === "number";
}

const testModel: Model<{ readonly count: number }, { readonly count: number }> = {
  id: "test-model",
  spec: { kind: "record", fields: { count: { kind: "number" } } },
  parse(raw) {
    if (isCountRecord(raw)) {
      return { ok: true, value: { count: raw.count } };
    }
    return { ok: false, issues: [{ path: "count", message: "invalid count" }] };
  },
};

describe("Track and Processors", () => {
  it("engine has zero instanceof ValueTrack or instanceof PluginTrack", () => {
    const enginePath = join(here, "../../../../src/engine.ts");
    const engineSource = readFileSync(enginePath, "utf8");
    expect(engineSource).not.toMatch(/instanceof\s+ValueTrack/);
    expect(engineSource).not.toMatch(/instanceof\s+PluginTrack/);
  });

  it("structureAtCommit exhibits polymorphic behavior across processors", () => {
    const values = valuesOf({ count: 42 });
    const localInput1 = new LocalInput(
      createValueEvaluator(values, createFakeInterpolator(), testModel.spec),
    );
    const passthrough = new PassthroughProcessor({
      nodeId: "source",
      values,
      interpolator: createFakeInterpolator(),
      model: testModel,
    });
    const passthroughTrack = new Track("source", localInput1, passthrough);
    expect(passthroughTrack.structureAtCommit()).toEqual({ count: 42 });

    const localInput2 = new LocalInput(
      createValueEvaluator(undefined, createFakeInterpolator(), { kind: "record", fields: {} }),
    );
    const computed = new ComputedProcessor({
      nodeId: "consumer",
      plugin: {
        id: "plugin",
        inputs: { values: { kind: "record", fields: {} } },
        outputs: { values: { kind: "record", fields: {} } },
        transform: () => ({ values: {} }),
      },
      values: undefined,
      interpolator: createFakeInterpolator(),
    });
    const computedTrack = new Track("consumer", localInput2, computed);
    expect(computedTrack.structureAtCommit()).toBeUndefined();
  });

  it("passthrough output equivalence at progress 0.5", () => {
    const values = valuesOf({
      count: [
        { p: 0, v: 10 },
        { p: 1, v: 20 },
      ],
    });
    const interpolator = createFakeInterpolator();
    const localInput = new LocalInput(
      createValueEvaluator(values, interpolator, {
        kind: "record",
        fields: { count: { kind: "number" } },
      }),
    );
    const passthrough = new PassthroughProcessor({
      nodeId: "track-1",
      values,
      interpolator,
    });
    const track = new Track("track-1", localInput, passthrough);
    track.setProgress(0.5);
    const composition = track.compose({});
    expect(composition.outputs).toEqual({ values: { count: 15 } });
    expect(composition.sourceProgress).toBe(0.5);
    expect(composition.sourceRevisions).toEqual({});
  });

  it("recompose count preservation matches expected tick behavior", () => {
    const staticValues = valuesOf({ count: 10 });
    const interpolator = createFakeInterpolator();
    const localInput1 = new LocalInput(
      createValueEvaluator(staticValues, interpolator, {
        kind: "record",
        fields: { count: { kind: "number" } },
      }),
    );
    const passthrough = new PassthroughProcessor({
      nodeId: "static-track",
      values: staticValues,
      interpolator,
    });
    const passthroughTrack = new Track("static-track", localInput1, passthrough);
    expect(passthroughTrack.setProgress(0.2)).toBe(true);
    expect(passthroughTrack.setProgress(0.5)).toBe(false);

    const localInput2 = new LocalInput(
      createValueEvaluator(undefined, interpolator, { kind: "record", fields: {} }),
    );
    const computed = new ComputedProcessor({
      nodeId: "computed-track",
      plugin: {
        id: "plugin",
        inputs: { values: { kind: "record", fields: {} } },
        outputs: { values: { kind: "record", fields: {} } },
        transform: () => ({ values: {} }),
      },
      values: undefined,
      interpolator,
    });
    const computedTrack = new Track("computed-track", localInput2, computed);
    expect(computedTrack.setProgress(0.2)).toBe(true);
    expect(computedTrack.setProgress(0.5)).toBe(true);
  });

  it("track shell correctly coordinates replacement of values", () => {
    const initialValues = valuesOf({ x: 1 });
    const nextValues = valuesOf({ x: 99 });
    const interpolator = createFakeInterpolator();
    const localInput = new LocalInput(
      createValueEvaluator(initialValues, interpolator, {
        kind: "record",
        fields: { x: { kind: "number" } },
      }),
    );
    const passthrough = new PassthroughProcessor({
      nodeId: "track-repl",
      values: initialValues,
      interpolator,
    });
    const track = new Track("track-repl", localInput, passthrough);
    expect(track.compose({}).outputs).toEqual({ values: { x: 1 } });

    track.replaceValues(nextValues);
    expect(track.compose({}).outputs).toEqual({ values: { x: 99 } });
  });
});
