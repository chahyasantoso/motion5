import { describe, expect, it, vi } from "vitest";
import type { ProjectDefinition, TrackDefinition } from "../../../src/contract/v5";
import type { TrackHandle } from "../../../src/contract/track-handle";
import { PluginRegistry } from "../../../src/domain/plugins";
import { Engine, type ProjectHandle } from "../../../src/engine";
import { transformPlugin } from "../../../src/plugins/transform";
import { createManualClock } from "../../../src/ports/clock";
import type { ProjectRuntime } from "../../../src/runtime/project-runtime";
import { createFakeScheduler } from "../../../src/testing/fakes";
import { createRealGsapSeam, readNumber } from "../../support/real-gsap";

/**
 * Issue #231. The patching backend, driven end to end through `Engine`.
 *
 * Separate from `live-value-updates.test.ts` because that file's interpolator is the fake, which
 * declines by design and therefore owns the escalation. These three cases need a backend that
 * honours the capability, so they run against real gsap through the same seam the `gsap-*` contract
 * cases use. What they assert is the observable difference between the two entry points, not the
 * adapter's internals: those are `contract/gsap-patch-keys.test.ts`.
 */
const ARM = "hero/arm";
const LEG = "hero/leg";
const AUTHORED_ROTATION = Object.freeze([
  { p: 0, v: 0 },
  { p: 1, v: 90 },
]);
/** Twice the authored sweep, and three times it, so each write is distinguishable at 0.5. */
const FASTER = Object.freeze([
  { p: 0, v: 0 },
  { p: 1, v: 180 },
]);
const STICKY = Object.freeze([
  { p: 0, v: 0 },
  { p: 1, v: 270 },
]);
const ARM_TRACK: TrackDefinition = {
  id: "arm",
  duration: 400,
  keyframes: {
    transform: {
      values: {
        x: 200,
        y: 300,
        rotation: AUTHORED_ROTATION,
      },
    },
  },
};
const PROJECT: ProjectDefinition = {
  schemaVersion: 5,
  motions: [
    {
      id: "hero",
      trigger: { type: "manual" },
      tracks: [
        ARM_TRACK,
        {
          id: "leg",
          keyframes: { transform: { values: { x: 10 } } },
          observes: [{ source: ARM }],
        },
      ],
    },
  ],
};

function load(): ProjectHandle {
  const plugins = new PluginRegistry();
  plugins.register(transformPlugin);
  const handle = new Engine({
    clock: createManualClock(),
    interpolator: createRealGsapSeam().interpolator,
    scheduler: createFakeScheduler(),
    plugins,
  }).load(PROJECT);
  handle.mount(ARM);
  handle.mount(LEG);
  return handle;
}
function runtimeOf(handle: ProjectHandle): ProjectRuntime {
  return (handle as unknown as { _runtime: ProjectRuntime })._runtime;
}
function published(handle: ProjectHandle, key: string): number {
  const patch = handle.get(ARM);
  expect(patch).toBeDefined();
  return readNumber(patch?.values ?? {}, key);
}
/** The authored group as retained, which is what `handle.track` answers with. */
function retained(handle: TrackHandle): unknown {
  return handle.track.keyframes?.transform;
}

describe("an animated live value is written on the timeline the track already has", () => {
  it("PK-12 moves an animated key end to end through setValues", () => {
    const handle = load();
    const arm = handle.track(ARM);
    handle.seek(ARM, 0.5);
    const replaceGraph = vi.spyOn(runtimeOf(handle).graph, "replaceGraph");
    expect(published(handle, "rotation")).toBeCloseTo(45, 4);

    arm.setValues({ rotation: FASTER });

    expect(published(handle, "rotation")).toBeCloseTo(90, 4);
    expect(published(handle, "x")).toBe(200);
    expect(retained(arm)).toEqual({ values: { x: 200, y: 300, rotation: FASTER } });
    // Progress survives because nothing recompiled: the tweens were replaced in place.
    expect(handle.get(ARM)?.sourceProgress).toBe(0.5);
    expect(replaceGraph).not.toHaveBeenCalled();
    handle.dispose();
  });

  it("PK-13 moves an animated key without moving the retained definition", () => {
    const handle = load();
    const arm = handle.track(ARM);
    handle.seek(ARM, 0.5);

    arm.overrideValues({ rotation: FASTER });

    expect(published(handle, "rotation")).toBeCloseTo(90, 4);
    // The half plan v2 called impossible: an animated override, and `handle.track` still answering
    // with the authored stops because the retained definition deliberately did not move.
    expect(retained(arm)).toEqual({
      values: { x: 200, y: 300, rotation: AUTHORED_ROTATION },
    });

    arm.overrideValues({});

    expect(published(handle, "rotation")).toBeCloseTo(45, 4);
    expect(retained(arm)).toEqual({
      values: { x: 200, y: 300, rotation: AUTHORED_ROTATION },
    });
    handle.dispose();
  });

  it("PK-14 makes a setValues after an override sticky", () => {
    const handle = load();
    const arm = handle.track(ARM);
    handle.seek(ARM, 0.5);

    arm.overrideValues({ rotation: FASTER });
    arm.setValues({ rotation: STICKY });
    expect(published(handle, "rotation")).toBeCloseTo(135, 4);

    // The revert goes back to what `setValues` wrote, not to what was authored. That is the base
    // and overlay split asserted as observable behavior rather than as adapter internals.
    arm.overrideValues({});

    expect(published(handle, "rotation")).toBeCloseTo(135, 4);
    expect(retained(arm)).toEqual({ values: { x: 200, y: 300, rotation: STICKY } });
    expect(handle.dependantsOf(ARM)).toEqual([LEG]);
    handle.dispose();
  });
});
