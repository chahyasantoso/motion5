import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import type { Model, PluginDefinition, ValueSpec } from "../../../src/contract/v5";
import { isModel } from "../../../src/contract/v5";
import { brandStructure } from "../../../src/contract/structure";
import { parseTrackDefinition, type ParsedValues } from "../../../src/contract/v5-parse";
import { createValueEvaluator } from "../../../src/runtime/evaluate-values";
import { LocalInput } from "../../../src/runtime/local-input";
import type { BoundSlotEntry, BoundSlots } from "../../../src/runtime/bound-slot";
import { ComputedProcessor, defaultPluginValues } from "../../../src/runtime/processors/computed";
import { PassthroughProcessor } from "../../../src/runtime/processors/passthrough";
import { Track } from "../../../src/runtime/track";
import { createFakeInterpolator } from "../../../src/testing/fakes";
import { TestRecord } from "../../support/test-models";

const here = fileURLToPath(import.meta.url);

function valuesOf(values: unknown): ParsedValues {
  const outcome = parseTrackDefinition(
    { id: "track", input: { values }, output: { model: "TestRecord" } },
    "tracks[0]",
  );
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

function computedTrack(plugin: PluginDefinition): Track {
  const interpolator = createFakeInterpolator();
  const rawSpec = plugin.inputs.values;
  const valuesSpec: ValueSpec = isModel(rawSpec)
    ? rawSpec.spec
    : (rawSpec ?? { kind: "record", fields: {} });
  const localInput = new LocalInput(
    createValueEvaluator(defaultPluginValues(undefined, plugin), interpolator, valuesSpec),
  );
  return new Track(
    "node",
    localInput,
    new ComputedProcessor({ nodeId: "node", plugin, values: undefined, interpolator }),
  );
}

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
      model: TestRecord,
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
      model: TestRecord,
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
      model: TestRecord,
    });
    const track = new Track("track-repl", localInput, passthrough);
    expect(track.compose({}).outputs).toEqual({ values: { x: 1 } });

    track.replaceValues(nextValues);
    expect(track.compose({}).outputs).toEqual({ values: { x: 99 } });
  });

  it("keeps a dotted slot name as one BoundSlots key", () => {
    let requires: Readonly<Record<string, unknown>> | undefined;
    const track = computedTrack({
      id: "dotted-slot",
      inputs: {
        values: { kind: "record", fields: {} },
        requires: { "chain.main": { kind: "model", model: testModel } },
      },
      outputs: { values: { kind: "record", fields: {} } },
      transform(input) {
        requires = input.requires;
        return { values: {} };
      },
    });
    track.compose({
      "chain.main": {
        kind: "single",
        bound: {
          sourceId: "src/body",
          values: { values: { count: 7 } },
          structure: brandStructure({ count: 7 }),
        },
      },
    });
    if (requires === undefined) throw new Error("transform did not run");
    expect(Object.hasOwn(requires, "chain.main")).toBe(true);
    expect(Object.hasOwn(requires, "chain")).toBe(false);
    expect(requires["chain.main"]).toEqual({ count: 7 });
  });

  it("resolves map slot members independently", () => {
    let requires: Readonly<Record<string, unknown>> | undefined;
    let structures: Readonly<Record<string, unknown>> | undefined;
    const track = computedTrack({
      id: "map-slot",
      inputs: {
        values: { kind: "record", fields: {} },
        requires: { data: { kind: "model", model: testModel, binding: "map" } },
      },
      outputs: { values: { kind: "record", fields: {} } },
      transform(input) {
        requires = input.requires;
        structures = input.structures;
        return { values: {} };
      },
    });
    const alphaStructure = brandStructure({ count: 1 });
    const betaStructure = brandStructure({ count: 2 });
    const slots: BoundSlots = {
      data: {
        kind: "map",
        members: {
          alpha: {
            sourceId: "src/a",
            values: { values: { count: 1 } },
            structure: alphaStructure,
          },
          beta: {
            sourceId: "src/b",
            values: { values: { count: 2 } },
            structure: betaStructure,
          },
        },
      },
    };
    track.compose(slots);
    if (requires === undefined || structures === undefined)
      throw new Error("transform did not run");
    expect(requires.data).toEqual({ alpha: { count: 1 }, beta: { count: 2 } });
    expect(structures.data).toEqual({ alpha: alphaStructure, beta: betaStructure });
  });

  it("leaves an optional unbound slot absent", () => {
    let requires: Readonly<Record<string, unknown>> | undefined;
    let structures: Readonly<Record<string, unknown>> | undefined;
    const track = computedTrack({
      id: "optional-slot",
      inputs: {
        values: { kind: "record", fields: {} },
        requires: { maybe: { optional: true, model: testModel } },
      },
      outputs: { values: { kind: "record", fields: {} } },
      transform(input) {
        requires = input.requires;
        structures = input.structures;
        return { values: {} };
      },
    });
    track.compose({});
    if (requires === undefined || structures === undefined)
      throw new Error("transform did not run");
    expect(requires).toEqual({});
    expect(structures).toEqual({});
  });

  it("rejects an empty map binding", () => {
    const track = computedTrack({
      id: "empty-map",
      inputs: {
        values: { kind: "record", fields: {} },
        requires: { data: { kind: "model", model: testModel, binding: "map" } },
      },
      outputs: { values: { kind: "record", fields: {} } },
      transform() {
        return { values: {} };
      },
    });
    expect(() => track.compose({ data: { kind: "map", members: {} } })).toThrow(
      /requires a map binding/,
    );
  });

  it("keeps a __proto__ slot name as an own key", () => {
    let requires: Readonly<Record<string, unknown>> | undefined;
    const slotName = "__proto__";
    const track = computedTrack({
      id: "proto-slot",
      inputs: {
        values: { kind: "record", fields: {} },
        requires: { [slotName]: { kind: "model", model: testModel } },
      },
      outputs: { values: { kind: "record", fields: {} } },
      transform(input) {
        requires = input.requires;
        return { values: {} };
      },
    });
    const slots: Record<string, BoundSlotEntry> = {};
    Object.defineProperty(slots, slotName, {
      value: {
        kind: "single",
        bound: {
          sourceId: "src/body",
          values: { values: { count: 3 } },
          structure: brandStructure({ count: 3 }),
        },
      },
      enumerable: true,
      configurable: true,
      writable: true,
    });
    track.compose(slots);
    if (requires === undefined) throw new Error("transform did not run");
    expect(Object.hasOwn(requires, slotName)).toBe(true);
    expect(Object.getPrototypeOf(requires)).toBe(Object.prototype);
    expect(requires[slotName]).toEqual({ count: 3 });
  });

  it("has no SlotSources or SourceRef in source", () => {
    const sourceRoot = join(here, "../../../../src");
    expect(existsSync(join(sourceRoot, "runtime/source-ref.ts"))).toBe(false);
    const offenders: string[] = [];
    const walk = (directory: string): void => {
      for (const entry of readdirSync(directory, { withFileTypes: true })) {
        const path = join(directory, entry.name);
        if (entry.isDirectory()) walk(path);
        else if (entry.isFile() && /SlotSources|SourceRef/.test(readFileSync(path, "utf8")))
          offenders.push(path);
      }
    };
    walk(sourceRoot);
    expect(offenders).toEqual([]);
  });
});
