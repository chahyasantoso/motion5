import { gsap } from "gsap";
import { describe, expect, it } from "vitest";
import type { ProjectDefinition } from "../../src/contract/v5";
import { createDomPatchAdapter } from "../../src/adapters/dom";
import {
  createGsapInterpolator,
  type GsapTimelineLike,
} from "../../src/adapters/interpolator/gsap";
import { Engine } from "../../src/engine";
import { createManualClock } from "../../src/ports/clock";
import { createFakeScheduler } from "../../src/ports/fakes";

function createRealGsapInterpolator() {
  return createGsapInterpolator({
    timeline: (): GsapTimelineLike => {
      const real = gsap.timeline({ paused: true });
      const timeline: GsapTimelineLike = {
        duration: () => real.duration(),
        progress,
        to(target, vars) {
          real.to(target, vars);
          return timeline;
        },
        kill() {
          real.kill();
        },
      };
      function progress(): number;
      function progress(value: number): GsapTimelineLike;
      function progress(value?: number): number | GsapTimelineLike {
        if (value === undefined) return real.progress();
        real.progress(value);
        return timeline;
      }
      return timeline;
    },
  });
}

const project: ProjectDefinition = {
  schemaVersion: 5,
  motions: [
    {
      id: "hero",
      trigger: { type: "manual" },
      tracks: [
        {
          id: "arm",
          keyframes: {
            opacity: {
              stops: [
                { p: 0, v: 0 },
                { p: 1, v: 1 },
              ],
            },
          },
        },
      ],
    },
  ],
};

describe("real end-to-end product path (E2)", () => {
  it("writes authored GSAP output through a patch into the DOM adapter", () => {
    const stage = { style: {} as Record<string, unknown> };
    const target = { style: {} as Record<string, unknown> };
    const dom = createDomPatchAdapter(stage, undefined, (nodeId) =>
      nodeId === "hero/arm" ? target : undefined,
    );
    const runtime = new Engine({
      clock: createManualClock(),
      interpolator: createRealGsapInterpolator(),
      scheduler: createFakeScheduler(),
    }).load(project);

    runtime.mount("hero/arm");
    runtime.graph.flush(["hero/arm"], 1);
    runtime.seek("hero/arm", 0.5);
    // `seek` owns invalidation, matching the oracle's progress -> notify -> invalidate path.
    // Read the canonical published state instead of assuming the final flush call owns it.
    const patch = runtime.graph.registry.get("hero/arm");
    expect(patch?.values.opacity).toBeCloseTo(0.5, 10);
    expect(patch).toBeDefined();

    dom.apply(patch!);
    expect(target.style.opacity).toBeCloseTo(0.5, 10);
    runtime.dispose();
  });
});
