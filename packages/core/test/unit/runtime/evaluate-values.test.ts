import { describe, expect, it } from "vitest";
import { parseTrackDefinition } from "../../../src/contract/v5-parse";
import type { ParsedValues } from "../../../src/contract/v5-parse";
import type { InterpolationTimeline, Interpolator } from "../../../src/ports/interpolator";
import { createValueEvaluator } from "../../../src/runtime/evaluate-values";
import { createFakeInterpolator } from "../../../src/testing/fakes";
import { createRealGsapSeam } from "../../support/real-gsap";

const PATH = "motions[0].tracks[0]";

function valuesOf(values: unknown): ParsedValues {
  const outcome = parseTrackDefinition({ id: "values", input: { values } }, PATH);
  if (outcome.kind !== "accepted") throw new Error(JSON.stringify(outcome.diagnostics));
  const parsed = outcome.value.input.values;
  if (parsed === undefined) throw new Error("The fixture authored no values.");
  return parsed;
}

function tableOf(rows: unknown): ParsedValues {
  return valuesOf(rows);
}

function recordOf(fields: Record<string, unknown>): ParsedValues {
  return valuesOf(fields);
}

describe("value evaluation", () => {
  it("evaluates a table at 0, 0.5 and 1 while preserving row identity and order", () => {
    const values = tableOf([
      {
        id: "point-a",
        cells: {
          x: [
            { p: 0, v: 0 },
            { p: 1, v: 100 },
          ],
          y: 20,
        },
      },
      { id: "point-b", cells: { x: 200, y: 40 } },
    ]);
    const evaluator = createValueEvaluator(values, createFakeInterpolator());

    expect(evaluator.evaluate(0)).toEqual([
      { id: "point-a", cells: { x: 0, y: 20 } },
      { id: "point-b", cells: { x: 200, y: 40 } },
    ]);
    expect(evaluator.evaluate(0.5)).toEqual([
      { id: "point-a", cells: { x: 50, y: 20 } },
      { id: "point-b", cells: { x: 200, y: 40 } },
    ]);
    expect(evaluator.evaluate(1)).toEqual([
      { id: "point-a", cells: { x: 100, y: 20 } },
      { id: "point-b", cells: { x: 200, y: 40 } },
    ]);
    evaluator.dispose();
  });

  it("evaluates animated rows independently at the same progress", () => {
    const values = tableOf([
      {
        id: "a",
        cells: {
          x: [
            { p: 0, v: 0 },
            { p: 1, v: 100 },
          ],
        },
      },
      {
        id: "b",
        cells: {
          x: [
            { p: 0, v: 100 },
            { p: 1, v: 0 },
          ],
        },
      },
      { id: "c", cells: {} },
    ]);
    const evaluator = createValueEvaluator(values, createFakeInterpolator());

    expect(evaluator.evaluate(0.25)).toEqual([
      { id: "a", cells: { x: 25 } },
      { id: "b", cells: { x: 75 } },
      { id: "c", cells: {} },
    ]);
    evaluator.dispose();
  });

  it("evaluates a record as a flat record with independent fields", () => {
    const values = recordOf({
      dx: 10,
      dy: [
        { p: 0, v: 0 },
        { p: 1, v: 10 },
      ],
      visible: true,
    });
    const evaluator = createValueEvaluator(values, createFakeInterpolator());

    expect(evaluator.evaluate(0.5)).toEqual({ dx: 10, dy: 5, visible: true });
    evaluator.dispose();
  });

  it("holds the first value before the first stop and the last value after the last", () => {
    const values = recordOf({
      x: [
        { p: 0.25, v: 10 },
        { p: 0.75, v: 90 },
      ],
    });
    const evaluator = createValueEvaluator(values, createFakeInterpolator());

    expect(evaluator.evaluate(0)).toEqual({ x: 10 });
    expect(evaluator.evaluate(0.25)).toEqual({ x: 10 });
    expect(evaluator.evaluate(0.75)).toEqual({ x: 90 });
    expect(evaluator.evaluate(1)).toEqual({ x: 90 });
    evaluator.dispose();
  });

  it("reads a single stop as a constant at every progress", () => {
    const values = recordOf({ x: [{ p: 0.5, v: 7 }] });
    const evaluator = createValueEvaluator(values, createFakeInterpolator());

    for (const progress of [0, 0.5, 1]) expect(evaluator.evaluate(progress)).toEqual({ x: 7 });
    evaluator.dispose();
  });

  it("steps string and boolean cells at their stops rather than interpolating", () => {
    const values = tableOf([
      {
        id: "a",
        cells: {
          label: [
            { p: 0, v: "start" },
            { p: 0.5, v: "middle" },
            { p: 1, v: "end" },
          ],
          on: [
            { p: 0, v: false },
            { p: 0.5, v: true },
          ],
        },
      },
    ]);
    const evaluator = createValueEvaluator(values, createFakeInterpolator());

    expect(evaluator.evaluate(0)).toEqual([{ id: "a", cells: { label: "start", on: false } }]);
    expect(evaluator.evaluate(0.49)).toEqual([{ id: "a", cells: { label: "start", on: false } }]);
    expect(evaluator.evaluate(0.5)).toEqual([{ id: "a", cells: { label: "middle", on: true } }]);
    expect(evaluator.evaluate(0.99)).toEqual([{ id: "a", cells: { label: "middle", on: true } }]);
    expect(evaluator.evaluate(1)).toEqual([{ id: "a", cells: { label: "end", on: true } }]);
    evaluator.dispose();
  });

  it("keeps heterogeneous rows and unusual column names from colliding", () => {
    const values = tableOf([
      { id: "a", cells: { "x.y": 1, id: "external-a" } },
      { id: "b", cells: { x: 2, y: 3 } },
    ]);
    const evaluator = createValueEvaluator(values, createFakeInterpolator());

    expect(evaluator.evaluate(0.5)).toEqual([
      { id: "a", cells: { "x.y": 1, id: "external-a" } },
      { id: "b", cells: { x: 2, y: 3 } },
    ]);
    evaluator.dispose();
  });

  it("keeps the authored shape for omitted and empty values", () => {
    const table = createValueEvaluator(undefined, createFakeInterpolator());
    const emptyTable = createValueEvaluator(tableOf([]), createFakeInterpolator());
    const emptyRecord = createValueEvaluator(recordOf({}), createFakeInterpolator());

    expect(table.evaluate(0.5)).toEqual([]);
    expect(emptyTable.evaluate(0.5)).toEqual([]);
    expect(emptyRecord.evaluate(0.5)).toEqual({});
    table.dispose();
    emptyTable.dispose();
    emptyRecord.dispose();
  });

  it("freezes the output and never publishes a slot id", () => {
    const values = tableOf([
      {
        id: "a",
        cells: {
          x: [
            { p: 0, v: 0 },
            { p: 1, v: 1 },
          ],
        },
      },
    ]);
    const evaluator = createValueEvaluator(values, createFakeInterpolator());
    const evaluated = evaluator.evaluate(0.5);

    expect(Object.isFrozen(evaluated)).toBe(true);
    if (!Array.isArray(evaluated)) throw new Error("Expected a table.");
    expect(Object.isFrozen(evaluated[0])).toBe(true);
    expect(Object.isFrozen(evaluated[0]?.cells)).toBe(true);
    expect(Object.keys(evaluated[0]?.cells ?? {})).toEqual(["x"]);
    expect(JSON.stringify(evaluated)).not.toMatch(/"s\d+"/);
    evaluator.dispose();
  });

  it("clamps progress outside the authored range and refuses a non-finite one", () => {
    const values = recordOf({
      x: [
        { p: 0, v: 0 },
        { p: 1, v: 10 },
      ],
    });
    const evaluator = createValueEvaluator(values, createFakeInterpolator());

    expect(evaluator.evaluate(-1)).toEqual({ x: 0 });
    expect(evaluator.evaluate(2)).toEqual({ x: 10 });
    expect(() => evaluator.evaluate(Number.NaN)).toThrow(/finite/);
    evaluator.dispose();
  });

  it("refuses to evaluate after disposal and kills the timeline exactly once", () => {
    const values = recordOf({
      x: [
        { p: 0, v: 0 },
        { p: 1, v: 10 },
      ],
    });
    let kills = 0;
    const fake = createFakeInterpolator();
    const interpolator: Interpolator = {
      create(config): InterpolationTimeline {
        const timeline = fake.create(config);
        return { ...timeline, kill: () => void (kills += 1) };
      },
    };
    const evaluator = createValueEvaluator(values, interpolator);

    evaluator.dispose();
    evaluator.dispose();
    expect(kills).toBe(1);
    expect(() => evaluator.evaluate(0.5)).toThrow(/disposed/);
  });

  it("creates no timeline for a plan without a numeric cell", () => {
    const values = recordOf({
      label: [
        { p: 0, v: "a" },
        { p: 1, v: "b" },
      ],
      count: 3,
    });
    const interpolator: Interpolator = {
      create() {
        throw new Error("A timeline was requested for a static and discrete plan.");
      },
    };
    const evaluator = createValueEvaluator(values, interpolator);

    expect(evaluator.evaluate(0.5)).toEqual({ label: "a", count: 3 });
    evaluator.dispose();
  });

  it("refuses a backend that produced a non-finite slot value", () => {
    const values = recordOf({
      x: [
        { p: 0, v: 0 },
        { p: 1, v: 1 },
      ],
    });
    function progress(): number;
    function progress(value: number): void;
    function progress(value?: number): number | void {
      return value === undefined ? 0 : undefined;
    }
    const interpolator: Interpolator = {
      create(): InterpolationTimeline {
        return {
          duration: 1,
          state: { s0: Number.POSITIVE_INFINITY },
          progress,
          kill() {},
        };
      },
    };
    const evaluator = createValueEvaluator(values, interpolator);

    expect(() => evaluator.evaluate(0.5)).toThrow(/finite number/);
    evaluator.dispose();
  });

  it("applies each cell's own ease on the interval ending at its stop", () => {
    // Two cells ease in opposite directions at the same position. A grouped record would refuse
    // the pair as one shared percent with two eases; a flattened plan must not.
    const values = tableOf([
      {
        id: "a",
        cells: {
          x: [
            { p: 0, v: 0 },
            { p: 0.5, v: 100, ease: "power1.in" },
            { p: 1, v: 100 },
          ],
          y: [
            { p: 0, v: 0 },
            { p: 0.5, v: 100, ease: "power1.out" },
            { p: 1, v: 0 },
          ],
        },
      },
    ]);
    const evaluator = createValueEvaluator(values, createRealGsapSeam().interpolator);
    const quarter = evaluator.evaluate(0.25);
    const threeQuarters = evaluator.evaluate(0.75);

    expect(quarter).toEqual([{ id: "a", cells: { x: 25, y: 75 } }]);
    expect(threeQuarters).toEqual([{ id: "a", cells: { x: 100, y: 50 } }]);
    evaluator.dispose();
  });
});
