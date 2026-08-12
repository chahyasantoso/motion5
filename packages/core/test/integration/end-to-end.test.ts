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
    // The first flush creates and publishes the Track's initial state. Seeking changes the
    // adapter-owned GSAP timeline; a second explicit flush publishes that changed state.
    runtime.graph.flush(["hero/arm"], 1);
    runtime.seek("hero/arm", 0.5);
    const batch = runtime.graph.flush(["hero/arm"], 3);
    const patch = batch.patches.find(({ nodeId }) => nodeId === "hero/arm");
    expect(patch?.values.opacity).toBeCloseTo(0.5, 10);
    expect(patch).toBeDefined();

    dom.apply(patch!);
    expect(target.style.opacity).toBeCloseTo(0.5, 10);
    runtime.dispose();
  });
});
