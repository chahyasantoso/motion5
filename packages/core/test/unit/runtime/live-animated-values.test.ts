import { describe, expect, it, vi } from "vitest";
import type { PatchBatch, ProjectDefinition, TrackDefinition } from "../../../src/contract/v5";
import type { TrackHandle } from "../../../src/contract/track-handle";
import { PluginRegistry } from "../../../src/domain/plugins";
import { LiveValueKeyError } from "../../../src/domain/track";
import { Engine, type ProjectHandle } from "../../../src/engine";
import { transformPlugin } from "../../../src/plugins/transform";
import { createManualClock } from "../../../src/ports/clock";
import type { ProjectRuntime } from "../../../src/runtime/project-runtime";
import { createFakeInterpolator, createFakeScheduler } from "../../../src/testing/fakes";

/**
 * Issue #222, phase 1 red. The half of the invariant that lives above the adapter: which keys a
 * live write may name once an animated one is legal, and what a `setValues` costs when the injected
 * interpolator declines the capability.
 *
 * The fake in `testing/` has no `patchKey` and is not given one, which is what makes the escalation
 * path reachable in a test at all. `PK-13` is the patched path and lives in
 * `integration/live-animated-values.test.ts`, because only a real GSAP timeline can answer it.
 *
 * `setValues` cannot yet be handed a stop list, so the widened argument is declared locally and the
 * handle is cast, exactly as #218's `LiveTrack` was. That declaration is deleted by the commit that
 * lands `AuthoredValues`.
 *
 * `PK-14` is green on `main` and stays green: the refusal narrows to one member rather than
 * disappearing, so this is a regression guard. The `"prepared"` reason needs a plugin that declares
 * `preparation.keyframes` and lands with the Track-level file in phase 2.
 */
interface AnimatedWrite {
  overrideValues(next: Readonly<Record<string, unknown>>): PatchBatch;
  setValues(next: Readonly<Record<string, unknown>>): PatchBatch;
}
function animated(handle: TrackHandle): AnimatedWrite {
  return handle as unknown as AnimatedWrite;
}
const ARM = "hero/arm";
const LEG = "hero/leg";
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
  motions: [
    {
      id: "hero",
      trigger: { type: "manual" },
      tracks: [ARM_TRACK, { id: "leg", keyframes: { transform: { values: { x: 10 } } } }],
    },
  ],
};
function load(): ProjectHandle {
  const plugins = new PluginRegistry();
  plugins.register(transformPlugin);
  const handle = new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
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
function published(handle: ProjectHandle, id: string): Readonly<Record<string, unknown>> {
  const patch = handle.get(id);
  expect(patch).toBeDefined();
  return patch?.values ?? {};
}
/** The authored group as retained, which is what `handle.track` answers with. */
function retained(handle: TrackHandle): unknown {
  return handle.track.keyframes?.transform;
}
function numberAt(record: Readonly<Record<string, unknown>>, key: string): number {
  const value = record[key];
  return typeof value === "number" ? value : Number.NaN;
}
/** The thrown refusal, because each case asserts on more than one facet of it. */
function refusalOf(write: () => unknown): LiveValueKeyError {
  try {
    write();
  } catch (error) {
    if (error instanceof LiveValueKeyError) return error;
    throw error;
  }
  throw new Error("Expected the live write to be refused.");
}

describe("an animated key is writable, and the refusals that replace the old one", () => {
  it("PK-14 still refuses an animated key on overrideValues", () => {
    const handle = load();
    const arm = handle.track(ARM);
    handle.seek(ARM, 0.5);
    const before = arm.track;
    const values = published(handle, ARM);
    const invalidate = vi.spyOn(runtimeOf(handle).graph, "invalidate");

    // A mask is spread over the timeline's own output on every read, so masking an animated key is
    // the permanently frozen animation ADR-059 refuses. A patch is sticky until a recompile while a
    // mask is replaced wholesale by the next write, so the two cannot share one semantics.
    const refusal = refusalOf(() => animated(arm).overrideValues({ rotation: ROTATION_MOVED }));

    expect(refusal.reason).toBe("animated");
    expect(refusal.key).toBe("rotation");
    expect(arm.track).toBe(before);
    expect(published(handle, ARM)).toEqual(values);
    expect(invalidate).not.toHaveBeenCalled();
    handle.dispose();
  });

  it("PK-15 refuses a kind change and an unknown key, one reason each", () => {
    const handle = load();
    const arm = handle.track(ARM);

    // `setValues` moves a value; it does not change what a leaf is. A scalar for an animated key
    // would drop the key from `compiled.properties` and a stop list for a static key would add it
    // there, and neither is a patch.
    expect(refusalOf(() => animated(arm).setValues({ rotation: 45 })).reason).toBe("kind");
    expect(refusalOf(() => animated(arm).setValues({ x: ROTATION_MOVED })).reason).toBe("kind");
    expect(refusalOf(() => animated(arm).setValues({ z: 1 })).reason).toBe("unknown");

    const before = arm.track;
    const values = published(handle, ARM);
    expect(() => animated(arm).setValues({ y: 320, rotation: 45 })).toThrow(LiveValueKeyError);
    // Every key is classified before anything is written, so the legal key in the same call is not
    // applied either: that is what no mutation means.
    expect(arm.track).toBe(before);
    expect(published(handle, ARM)).toEqual(values);
    handle.dispose();
  });

  it("PK-16 escalates to one recompile when the interpolator declines", () => {
    const handle = load();
    const arm = handle.track(ARM);
    handle.seek(ARM, 0.5);
    const replaceGraph = vi.spyOn(runtimeOf(handle).graph, "replaceGraph");

    animated(arm).setValues({ rotation: ROTATION_MOVED });

    // The fallback for an interpolator without the capability is the recompile that always existed,
    // so the member is genuinely optional and no branch is left without a consumer. Progress is
    // restored through the existing hook, because a fresh Track starts at zero and the two backends
    // must be observably equivalent.
    expect(replaceGraph).toHaveBeenCalledTimes(1);
    expect(retained(arm)).toEqual({ values: { x: 200, y: 300, rotation: ROTATION_MOVED } });
    expect(numberAt(published(handle, ARM), "rotation")).toBeCloseTo(10);
    expect(handle.get(ARM)?.sourceProgress).toBe(0.5);
    handle.dispose();
  });

  it("PK-17 refuses a malformed leaf through the definition validator", () => {
    const handle = load();
    const arm = handle.track(ARM);
    const before = arm.track;
    const values = published(handle, ARM);

    let thrown: unknown;
    try {
      animated(arm).setValues({ rotation: { stops: ROTATION_MOVED } });
    } catch (error) {
      thrown = error;
    }

    // An authored stop list is a definition-shaped input, and `validateKeyframes` owns its shape, so
    // the animated path validates through the one thing that validates definitions and does so
    // before anything mutates. A `LiveValueKeyError` here would mean the ordering is inverted.
    expect(thrown).toBeInstanceOf(TypeError);
    expect(thrown).not.toBeInstanceOf(LiveValueKeyError);
    expect(arm.track).toBe(before);
    expect(published(handle, ARM)).toEqual(values);
    handle.dispose();
  });

  it("PK-18 kills the guards a passing suite would leave alive", () => {
    const handle = load();
    const arm = handle.track(ARM);
    handle.seek(ARM, 0.5);
    const before = numberAt(published(handle, ARM), "rotation");

    animated(arm).setValues({ rotation: ROTATION_MOVED });

    // Two mutants, both of which a suite asserting only "it did not throw" would survive: reporting a
    // decline as a success, and escalating with the definition the write was supposed to replace.
    expect(before).toBeCloseTo(45);
    expect(numberAt(published(handle, ARM), "rotation")).toBeCloseTo(10);
    expect(retained(arm)).toEqual({ values: { x: 200, y: 300, rotation: ROTATION_MOVED } });
    handle.dispose();
  });
});
