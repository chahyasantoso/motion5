import { describe, expect, it } from "vitest";
import { createGsapInterpolator, type GsapTweenLike } from "../../src/adapters/interpolator/gsap";
import { createRealGsapSeam } from "../support/real-gsap";

describe("GSAP interpolator clock ownership (P0-2)", () => {
  it("creates a paused tween so the project clock is the only clock owner", () => {
    let receivedVars: Record<string, unknown> | undefined;
    const tween: GsapTweenLike = {
      duration: () => 1,
      progress,
      kill() {},
    };
    function progress(): number;
    function progress(value: number): GsapTweenLike;
    function progress(value?: number): number | GsapTweenLike {
      return value === undefined ? 0 : tween;
    }
    const interpolator = createGsapInterpolator({
      to(_target, vars) {
        receivedVars = vars;
        return tween;
      },
    });

    interpolator.create({ duration: 1, keyframes: {} });

    expect(receivedVars).toMatchObject({ paused: true });
  });

  it("is paused according to real GSAP, not according to the fixture", () => {
    const seam = createRealGsapSeam();
    seam.interpolator.create({
      duration: 1,
      keyframes: {
        x: {
          stops: [
            { p: 0, v: 0 },
            { p: 1, v: 100 },
          ],
        },
      },
    });
    expect(seam.created).toHaveLength(1);
    expect(seam.created[0]?.paused()).toBe(true);
  });
});
