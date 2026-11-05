import { describe, expect, it } from "vitest";
import type { Value } from "../../../src/contract/v5";
import { LocalInput } from "../../../src/runtime/local-input";
import type { ValueEvaluator } from "../../../src/runtime/evaluate-values";

function fakeEvaluator(
  timeInvariant = false,
  evalFn: (progress: number) => Value = (p) => ({ p }),
): ValueEvaluator & { disposed: boolean } {
  const result = {
    timeInvariant,
    disposed: false,
    evaluate(progress: number) {
      return evalFn(progress);
    },
    dispose() {
      result.disposed = true;
    },
  };
  return result;
}

describe("LocalInput", () => {
  it("clamps progress to [0, 1] and detects unchanged values", () => {
    const input = new LocalInput(fakeEvaluator());

    expect(input.progress).toBe(0);
    expect(input.setProgress(-0.5)).toBe(false);
    expect(input.progress).toBe(0);

    expect(input.setProgress(0.4)).toBe(true);
    expect(input.progress).toBe(0.4);

    expect(input.setProgress(0.4)).toBe(false);

    expect(input.setProgress(1.5)).toBe(true);
    expect(input.progress).toBe(1);
  });

  it("throws TypeError on non-finite progress", () => {
    const input = new LocalInput(fakeEvaluator());

    expect(() => input.setProgress(NaN)).toThrow(TypeError);
    expect(() => input.setProgress(Infinity)).toThrow(TypeError);
    expect(() => input.setProgress(-Infinity)).toThrow(TypeError);
  });

  it("prioritizes live overlay over authored evaluation and resumes on undefined", () => {
    const input = new LocalInput(fakeEvaluator(false, (p) => ({ val: p })));

    expect(input.evaluate()).toEqual({ val: 0 });
    input.setProgress(0.5);
    expect(input.evaluate()).toEqual({ val: 0.5 });

    input.replaceOverlay({ val: 99 });
    expect(input.evaluate()).toEqual({ val: 99 });

    input.setProgress(0.8);
    expect(input.evaluate()).toEqual({ val: 99 });

    input.replaceOverlay(undefined);
    expect(input.evaluate()).toEqual({ val: 0.8 });
  });

  it("replaces evaluator with candidate before disposing previous one", () => {
    const initial = fakeEvaluator();
    const input = new LocalInput(initial);
    const candidate = fakeEvaluator();
    let installed = false;

    input.replaceEvaluator(
      () => {
        expect(initial.disposed).toBe(false);
        return candidate;
      },
      () => {
        installed = true;
      },
    );

    expect(installed).toBe(true);
    expect(initial.disposed).toBe(true);
    expect(candidate.disposed).toBe(false);
  });

  it("keeps previous evaluator active and undisposed when candidate build throws", () => {
    const initial = fakeEvaluator(false, () => ({ active: true }));
    const input = new LocalInput(initial);

    expect(() =>
      input.replaceEvaluator(() => {
        throw new Error("candidate failed");
      }),
    ).toThrow("candidate failed");

    expect(initial.disposed).toBe(false);
    expect(input.evaluate()).toEqual({ active: true });
  });

  it("disposes evaluator and guards methods against disposed calls", () => {
    const evaluator = fakeEvaluator();
    const input = new LocalInput(evaluator);

    input.dispose();
    expect(evaluator.disposed).toBe(true);
    expect(() => input.dispose()).not.toThrow();

    expect(() => input.setProgress(0.5)).toThrow(/disposed/);
    expect(() => input.replaceOverlay({ x: 1 })).toThrow(/disposed/);
    expect(() => input.evaluate()).toThrow(/disposed/);
    expect(() => input.replaceEvaluator(() => fakeEvaluator())).toThrow(/disposed/);
    expect(() => input.assertActive()).toThrow(/disposed/);
  });
});
