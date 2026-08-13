import { describe, expect, it } from "vitest";
import { createGsapInterpolator, type GsapTweenLike } from "../../src/adapters/interpolator/gsap";
import type { Interpolator } from "../../src/ports/interpolator";

function createRecordingInterpolator(): {
  interpolator: Interpolator;
  configs: readonly Record<string, unknown>[];
} {
  const configs: Record<string, unknown>[] = [];
  const interpolator = createGsapInterpolator({
    to(target, vars): GsapTweenLike {
      configs.push(vars);
      let current = 0;
      function progress(): number;
      function progress(value: number): GsapTweenLike;
      function progress(value?: number): number | GsapTweenLike {
        if (value === undefined) return current;
        current = value;
        Object.assign(target, { progress: value });
        return this;
      }
      return { duration: () => 1, progress, kill() {} };
    },
  });
  return { interpolator, configs };
}

describe("S2 sparse percent-keyframe compilation", () => {
  it("does not inject sibling properties into authored percent entries", () => {
    const seam = createRecordingInterpolator();
    seam.interpolator.create({
      duration: 1,
      keyframes: {
        x: { stops: [{ p: 0, v: 0 }, { p: 0.5, v: 50 }, { p: 1, v: 100 }] },
        y: { stops: [{ p: 0.2, v: 20 }, { p: 0.25, v: 25 }, { p: 1, v: 100 }] },
      },
    });
    const keyframes = seam.configs[0]?.keyframes as Record<string, Record<string, unknown>>;
    expect(keyframes["0%"]?.y).toBeUndefined();
    expect(keyframes["20%"]?.x).toBeUndefined();
    expect(keyframes["50%"]?.y).toBeUndefined();
  });

  it("preserves authored ease without injecting ease none", () => {
    const seam = createRecordingInterpolator();
    seam.interpolator.create({
      duration: 1,
      keyframes: {
        x: { stops: [{ p: 0, v: 0 }, { p: 0.5, v: 50, ease: "power2.out" }, { p: 1, v: 100 }] },
        y: { stops: [{ p: 0, v: 0 }, { p: 1, v: 100 }] },
      },
    });
    const keyframes = seam.configs[0]?.keyframes as Record<string, Record<string, unknown>>;
    expect(keyframes["50%"]?.ease).toBe("power2.out");
    expect(keyframes["0%"]?.ease).toBeUndefined();
    expect(keyframes["25%"]?.ease).toBeUndefined();
  });

  it("reports an ease collision as a structured diagnostic instead of an unstructured throw", () => {
    const seam = createRecordingInterpolator();
    expect(() =>
      seam.interpolator.create({
        duration: 1,
        keyframes: {
          x: { stops: [{ p: 0, v: 0 }, { p: 0.5, v: 50, ease: "power1.out" }, { p: 1, v: 100 }] },
          y: { stops: [{ p: 0, v: 0 }, { p: 0.5, v: 50, ease: "power2.out" }, { p: 1, v: 100 }] },
        },
      }),
    ).toThrow(/plugin-contribution-ease-collision/);
  });
});
