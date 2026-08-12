import { describe, expect, it } from "vitest";
import type { ProjectDefinition } from "../../src/contract/v5";
import { createDomPatchAdapter } from "../../src/adapters/dom";
import { Engine } from "../../src/engine";
import { createManualClock } from "../../src/ports/clock";
import { createFakeScheduler } from "../../src/ports/fakes";
import { createRealGsapSeam } from "../support/real-gsap";

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
    const target = { style: { opacity: 0 } as Record<string, unknown> };
    const dom = createDomPatchAdapter(stage, undefined, (nodeId) =>
      nodeId === "hero/arm" ? target : undefined,
    );
    const seam = createRealGsapSeam();
    const runtime = new Engine({
      clock: createManualClock(),
      interpolator: seam.interpolator,
      scheduler: createFakeScheduler(),
    }).load(project);

    runtime.mount("hero/arm");
    runtime.graph.flush(["hero/arm"], 1);
    runtime.seek("hero/arm", 0.5);
    runtime.graph.flush(["hero/arm"], 2);

    const patch = runtime.graph.registry.get("hero/arm");
    expect(patch).toBeDefined();
    expect(patch?.values.opacity).toBeCloseTo(0.5, 10);

    dom.apply(patch!);
    expect(target.style.opacity).toBeCloseTo(0.5, 10);

    // The product path must own the only clock: real GSAP, not the fixture, confirms the
    // adapter's timeline is paused.
    expect(seam.created[0]?.paused()).toBe(true);

    runtime.dispose();
  });
});
