import { describe, expect, it } from "vitest";
import { createRealGsapSeam } from "../support/real-gsap";

describe("GSAP multi-stop compilation (B2)", () => {
  it("interpolates authored stops at 0, 0.5, and 1 using real GSAP state", () => {
    const seam = createRealGsapSeam();

    const timeline = seam.interpolator.create({
      duration: 1,
      keyframes: {
        x: [
          { p: 0, v: 0 },
          { p: 0.5, v: 50 },
          { p: 1, v: 100 },
        ],
      },
    });

    expect(timeline.state).toMatchObject({ x: 0 });
    timeline.progress(0.5);
    expect(timeline.state).toMatchObject({ x: 50 });
    timeline.progress(1);
    expect(timeline.state).toMatchObject({ x: 100 });
    timeline.kill();
  });
});
