import { describe, expect, it, vi } from "vitest";
import type { PatchBatch, ProjectDefinition, TrackDefinition } from "../../src/contract/v5";
import type { TrackHandle } from "../../src/contract/track-handle";
import { PluginRegistry } from "../../src/domain/plugins";
import { Engine, type ProjectHandle } from "../../src/engine";
import { transformPlugin } from "../../src/plugins/transform";
import { createManualClock } from "../../src/ports/clock";
import { createFakeScheduler } from "../../src/testing/fakes";
import type { ProjectRuntime } from "../../src/runtime/project-runtime";
import { createRealGsapSeam } from "../support/real-gsap";

/**
 * Issue #222, phase 1 red. The lift itself, end to end, against the one shipped implementation that
 * can patch: a real GSAP timeline.
 *
 * It is here rather than in the unit tier because the claim is that a published value moves without
 * a recompile, and only a real timeline can be asked whether a second one was built. `seam.created`
 * is the answer: one entry per `gsap.timeline()` call, so a count that does not grow is the whole of
 * "no new timeline" at this level, and `replaceGraph` is the whole of "no graph rebuild".
 *
 * The declining backend is `unit/runtime/live-animated-values.test.ts`, `PK-16`.
 */
interface AnimatedWrite {
  setValues(next: Readonly<Record<string, unknown>>): PatchBatch;
}
function animated(handle: TrackHandle): AnimatedWrite {
  return handle as unknown as AnimatedWrite;
}
const ARM = "hero/arm";
const ROTATION = [
  { p: 0, v: 0 },
  { p: 1, v: 90 },
];
const ROTATION_MOVED = [
  { p: 0, v: 0 },
  { p: 1, v: 20 },
];
const ARM_TRACK: TrackDefinition = {
  id: "arm",
  duration: 400,
  keyframes: { transform: { values: { x: 200, y: 300, rotation: ROTATION } } },
};
const PROJECT: ProjectDefinition = {
  schemaVersion: 5,
  motions: [{ id: "hero", trigger: { type: "manual" }, tracks: [ARM_TRACK] }],
};
function runtimeOf(handle: ProjectHandle): ProjectRuntime {
  return (handle as unknown as { _runtime: ProjectRuntime })._runtime;
}
function numberAt(record: Readonly<Record<string, unknown>>, key: string): number {
  const value = record[key];
  return typeof value === "number" ? value : Number.NaN;
}
function published(handle: ProjectHandle, id: string): Readonly<Record<string, unknown>> {
  const patch = handle.get(id);
  expect(patch).toBeDefined();
  return patch?.values ?? {};
}

describe("an animated authored value moves without a recompile", () => {
  it("PK-13 rewrites an animated key on the live timeline", () => {
    const seam = createRealGsapSeam();
    const plugins = new PluginRegistry();
    plugins.register(transformPlugin);
    const handle = new Engine({
      clock: createManualClock(),
      interpolator: seam.interpolator,
      scheduler: createFakeScheduler(),
      plugins,
    }).load(PROJECT);
    handle.mount(ARM);
    const arm = handle.track(ARM);
    handle.seek(ARM, 0.5);
    expect(numberAt(published(handle, ARM), "rotation")).toBeCloseTo(45);
    expect(seam.created).toHaveLength(1);
    const replaceGraph = vi.spyOn(runtimeOf(handle).graph, "replaceGraph");

    animated(arm).setValues({ rotation: ROTATION_MOVED });

    // The published value, the retained definition, and the progress all move together, on the same
    // GSAP timeline object and through one invalidate. This is the refusal lifted.
    expect(numberAt(published(handle, ARM), "rotation")).toBeCloseTo(10);
    expect(arm.track.keyframes?.transform).toEqual({
      values: { x: 200, y: 300, rotation: ROTATION_MOVED },
    });
    expect(handle.get(ARM)?.sourceProgress).toBe(0.5);
    expect(seam.created).toHaveLength(1);
    expect(replaceGraph).not.toHaveBeenCalled();

    // The static siblings are untouched by a write that named neither, which is what keeps the whole
    // `LV-` path byte-identical.
    expect(numberAt(published(handle, ARM), "x")).toBe(200);
    expect(numberAt(published(handle, ARM), "y")).toBe(300);
    handle.dispose();
  });
});
