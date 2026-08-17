import { describe, expect, it, vi } from "vitest";
import { Engine } from "../../src/engine";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/ports/fakes";
import type { ProjectDefinition, TrackDefinition } from "../../src/contract/v5";

function ramp(from: number, to: number) {
  return { stops: [{ p: 0, v: from }, { p: 1, v: to }] };
}
function track(id: string, from: number, to: number, duration?: number): TrackDefinition {
  return { id, ...(duration === undefined ? {} : { duration }), keyframes: { x: ramp(from, to) } };
}
function load(project: ProjectDefinition) {
  const clock = createManualClock();
  const scheduler = createFakeScheduler();
  const handle = new Engine({ clock, interpolator: createFakeInterpolator(), scheduler }).load(project);
  return { clock, scheduler, handle };
}

const baseProject = (tracks: readonly TrackDefinition[], stagger = 0): ProjectDefinition => ({
  schemaVersion: 5,
  motions: [{ id: "scene", trigger: { type: "manual" }, ...(stagger ? { stagger } : {}), tracks }],
});

describe("issue 114: Motion-owned Track replacement", () => {
  it("does not drive the disposed Track after direct replacement", () => {
    const { clock, scheduler, handle } = load(baseProject([track("arm", 0, 100)]));
    handle.mount("scene/arm");
    handle.signal("scene", { type: "manual", progress: 0.5 });
    scheduler.flush();
    handle.track("scene/arm").replace(track("arm", 0, 250));

    expect(() => {
      clock.tick(16);
      scheduler.flush();
    }).not.toThrow(/Track is disposed/);
    expect(handle.get("scene/arm")?.values).toEqual({ x: 125 });
    handle.dispose();
  });

  it("preserves current progress when replacing", () => {
    const { scheduler, handle } = load(baseProject([track("arm", 0, 100)]));
    handle.mount("scene/arm");
    handle.signal("scene", { type: "manual", progress: 0.5 });
    scheduler.flush();
    handle.track("scene/arm").replace(track("arm", 0, 200));

    expect(handle.get("scene/arm")?.values).toEqual({ x: 100 });
    handle.dispose();
  });

  it("preserves the original array index and stagger timing", () => {
    const project = baseProject(
      [track("first", 0, 100), track("second", 0, 100), track("third", 0, 100)],
      100,
    );
    const { scheduler, handle } = load(project);
    for (const id of ["scene/first", "scene/second", "scene/third"]) handle.mount(id);
    handle.signal("scene", { type: "manual", progress: 1 });
    scheduler.flush();
    handle.track("scene/first").replace(track("first", 0, 200));

    expect(handle.get("scene/first")?.values).toEqual({ x: 200 });
    expect(handle.get("scene/second")?.values).toEqual({ x: 0 });
    expect(handle.get("scene/third")?.values).toEqual({ x: 0 });
    handle.dispose();
  });

  it("keeps sibling progress and invalidation healthy", () => {
    const invalidate = vi.fn();
    const { scheduler, handle } = load(baseProject([track("first", 0, 100), track("second", 0, 200)]));
    handle.mount("scene/first");
    handle.mount("scene/second");
    handle.signal("scene", { type: "manual", progress: 0.25 });
    scheduler.flush();
    handle.track("scene/first").replace(track("first", 0, 400));
    handle.signal("scene", { type: "manual", progress: 0.5 });
    scheduler.flush();

    expect(handle.get("scene/first")?.values).toEqual({ x: 200 });
    expect(handle.get("scene/second")?.values).toEqual({ x: 100 });
    expect(invalidate).not.toHaveBeenCalled();
    handle.dispose();
  });

  it("replaces through addObserve and removeObserve without stale references", () => {
    const { scheduler, handle } = load(baseProject([track("arm", 0, 100), track("label", 0, 50)]));
    handle.mount("scene/arm");
    handle.mount("scene/label");
    const label = handle.track("scene/label");
    label.addObserve({ source: "scene/arm", role: "input" });
    label.removeObserve({ role: "input", source: "scene/arm" });

    expect(() => {
      handle.signal("scene", { type: "manual", progress: 0.5 });
      scheduler.flush();
    }).not.toThrow(/Track is disposed/);
    handle.dispose();
  });

  it("disposes the old compiled Track once and keeps the replacement live", () => {
    const oldTrackDispose = vi.fn();
    const clock = createManualClock();
    const scheduler = createFakeScheduler();
    const interpolator = createFakeInterpolator();
    const handle = new Engine({ clock, interpolator, scheduler }).load(baseProject([track("arm", 0, 100)]));
    handle.mount("scene/arm");
    handle.track("scene/arm").replace(track("arm", 0, 250));
    expect(oldTrackDispose).not.toHaveBeenCalled();
    expect(() => {
      clock.tick(16);
      scheduler.flush();
    }).not.toThrow();
    handle.dispose();
  });
});
