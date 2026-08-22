import { describe, expect, it } from "vitest";
import type { ProjectDefinition, TrackDefinition } from "../../src/contract/v5";
import { Engine } from "../../src/engine";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/testing/fakes";
import type { Interpolator } from "../../src/ports/interpolator";

function ramp(from: number, to: number) {
  return {
    stops: [
      { p: 0, v: from },
      { p: 1, v: to },
    ],
  };
}
function track(id: string, from: number, to: number, duration?: number): TrackDefinition {
  return { id, ...(duration === undefined ? {} : { duration }), keyframes: { x: ramp(from, to) } };
}
const baseProject = (tracks: readonly TrackDefinition[], stagger = 0): ProjectDefinition => ({
  schemaVersion: 5,
  motions: [{ id: "scene", trigger: { type: "manual" }, ...(stagger ? { stagger } : {}), tracks }],
});
function load(project: ProjectDefinition, interpolator?: Interpolator) {
  const clock = createManualClock();
  const scheduler = createFakeScheduler();
  const handle = new Engine({
    clock,
    interpolator: interpolator ?? createFakeInterpolator(),
    scheduler,
  }).load(project);
  return { clock, scheduler, handle };
}
// Counts kill() calls per compiled timeline. Track.dispose() kills exactly once, so the counter
// is a faithful census of disposed compiled Tracks.
function createCountingInterpolator(): { interpolator: Interpolator; readonly kills: number } {
  const inner = createFakeInterpolator();
  let kills = 0;
  const interpolator: Interpolator = {
    create(config) {
      const timeline = inner.create(config);
      return {
        ...timeline,
        kill() {
          kills += 1;
          timeline.kill();
        },
      };
    },
  };
  return {
    interpolator,
    get kills() {
      return kills;
    },
  };
}

describe("option C: compiled Track ownership through the public surface", () => {
  it("C-9 keeps a motion-owned track live through replacement", () => {
    const { clock, scheduler, handle } = load(baseProject([track("arm", 0, 100)]));
    handle.mount("scene/arm");
    handle.signal("scene", { type: "manual", progress: 0.5 });
    scheduler.flush();
    handle.track("scene/arm").replace(track("arm", 0, 200));
    clock.tick(0);
    scheduler.flush();
    expect(handle.get("scene/arm")?.values).toEqual({ x: 100 });
    handle.dispose();
  });

  it("C-10 preserves the array index and stagger timing across a replacement", () => {
    const tracks = [track("first", 0, 100), track("second", 0, 100), track("third", 0, 100)];
    const { clock, scheduler, handle } = load(baseProject(tracks, 100));
    for (const id of ["scene/first", "scene/second", "scene/third"]) handle.mount(id);
    handle.signal("scene", { type: "manual", progress: 1 });
    scheduler.flush();
    handle.track("scene/first").replace(track("first", 0, 200));
    clock.tick(0);
    scheduler.flush();
    expect(handle.get("scene/first")?.values).toEqual({ x: 200 });
    expect(handle.get("scene/second")?.values).toEqual({ x: 0 });
    expect(handle.get("scene/third")?.values).toEqual({ x: 0 });
    handle.dispose();
  });

  it("C-11 keeps the observation replacement path resolvable", () => {
    const project = baseProject([track("arm", 0, 100), track("label", 0, 50)]);
    const { scheduler, handle } = load(project);
    handle.mount("scene/arm");
    handle.mount("scene/label");
    const label = handle.track("scene/label");
    label.addObserve({ source: "scene/arm" });
    label.removeObserve({ source: "scene/arm" });
    expect(() => {
      handle.signal("scene", { type: "manual", progress: 0.5 });
      scheduler.flush();
    }).not.toThrow();
    handle.dispose();
  });

  it("C-12 disposes every compiled timeline exactly once", () => {
    const counting = createCountingInterpolator();
    const project = baseProject([track("arm", 0, 100), track("leg", 0, 50)]);
    const { handle } = load(project, counting.interpolator);
    handle.mount("scene/arm");
    handle.mount("scene/leg");
    expect(counting.kills).toBe(0);
    handle.dispose();
    expect(counting.kills).toBe(2);
  });

  it("C-13 keeps runtime add and remove in step with the resolver", () => {
    const { scheduler, handle } = load(baseProject([track("arm", 0, 100)]));
    handle.mount("scene/arm");
    const added = handle.addTrack(track("extra", 0, 100), { motionId: "scene" });
    handle.signal("scene", { type: "manual", progress: 0.5 });
    scheduler.flush();
    expect(handle.get("scene/extra")?.values).toEqual({ x: 50 });
    added.remove();
    // The removed id must leave the Motion too, or the next sweep would report it unresolved.
    expect(() => {
      handle.signal("scene", { type: "manual", progress: 0.75 });
      scheduler.flush();
    }).not.toThrow();
    expect(handle.get("scene/arm")?.values).toEqual({ x: 75 });
    const readded = handle.addTrack(track("extra", 0, 100), { motionId: "scene" });
    expect(readded.id).toBe("scene/extra");
    handle.dispose();
  });
});
