import { describe, expect, it } from "vitest";
import { Engine } from "../../src/engine";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/testing/fakes";
import type { MotionDefinition, TrackDefinition } from "../../src/contract/v5";

const emptyProject = { schemaVersion: 5 as const, projectId: "runtime-motion", motions: [] };

function makeRuntime() {
  const scheduler = createFakeScheduler();
  const handle = new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler,
  }).load(emptyProject);
  return { handle, scheduler };
}

function motion(id: string, stagger = 0): MotionDefinition {
  return { id, trigger: { type: "manual" }, tracks: [], ...(stagger ? { stagger } : {}) };
}
function ramp(from: number, to: number) {
  return [
    { p: 0, v: from },
    { p: 1, v: to },
  ];
}
function track(id: string, from: number, to: number, duration?: number): TrackDefinition {
  return {
    id,
    ...(duration === undefined ? {} : { duration }),
    keyframes: { transform: { values: { x: ramp(from, to) } } },
  };
}

describe("runtime Motion lifecycle (W4)", () => {
  it("creates a motion, attaches a track, and signals progress from an empty project", () => {
    const { handle, scheduler } = makeRuntime();

    const created = handle.addMotion(motion("scene"));
    expect(created.id).toBe("scene");

    const added = handle.addTrack(track("arm", 0, 100), { motionId: "scene" });
    handle.signal("scene", { type: "manual", progress: 0.5 });
    scheduler.flush();

    expect(handle.get(added.id)?.status).toBe("ready");
    const idPatch = handle.get(added.id);
    if (idPatch?.status !== "ready")
      throw new Error(`idPatch is ${idPatch?.status ?? "absent"}, not ready.`);
    expect(idPatch.values).toEqual({ x: 50 });

    added.remove();
    handle.destroyMotion("scene");
    handle.dispose();
  });

  it("rejects motion destruction while it still owns tracks, then allows empty destruction", () => {
    const { handle } = makeRuntime();
    handle.addMotion(motion("scene"));
    const added = handle.addTrack(track("arm", 0, 100), { motionId: "scene" });

    expect(() => handle.destroyMotion("scene")).toThrow(/still has 1 track/);
    added.remove();
    expect(() => handle.destroyMotion("scene")).not.toThrow();
    expect(() => handle.signal("scene", { type: "manual", progress: 0.5 })).toThrow(
      /Unknown motion/,
    );
    handle.dispose();
  });

  it("keeps two runtime motions independently signalable", () => {
    const { handle, scheduler } = makeRuntime();
    handle.addMotion(motion("left", 0.1));
    handle.addMotion(motion("right", 0));
    const left = handle.addTrack(track("arm", 0, 100, 1), { motionId: "left" });
    const right = handle.addTrack(track("arm", 0, 200, 1), { motionId: "right" });

    handle.signal("left", { type: "manual", progress: 0.5 });
    handle.signal("right", { type: "manual", progress: 0.25 });
    scheduler.flush();

    // Track index 0 has no stagger delay; later tracks are offset by the stagger amount.
    const idPatch2 = handle.get(left.id);
    if (idPatch2?.status !== "ready")
      throw new Error(`idPatch2 is ${idPatch2?.status ?? "absent"}, not ready.`);
    expect(idPatch2.values).toEqual({ x: 50 });
    const idPatch3 = handle.get(right.id);
    if (idPatch3?.status !== "ready")
      throw new Error(`idPatch3 is ${idPatch3?.status ?? "absent"}, not ready.`);
    expect(idPatch3.values).toEqual({ x: 50 });

    left.remove();
    right.remove();
    handle.destroyMotion("left");
    handle.destroyMotion("right");
    handle.dispose();
  });

  it("rejects duplicate and malformed motion ids without poisoning retries", () => {
    const { handle } = makeRuntime();
    handle.addMotion(motion("scene"));
    expect(() => handle.addMotion(motion("scene"))).toThrow(/already exists/);
    expect(() => handle.addMotion(motion("bad/id"))).toThrow();
    expect(() => handle.addMotion(motion("~"))).toThrow();
    handle.destroyMotion("scene");
    handle.dispose();
  });

  it("rejects non-empty authored motions without deleting their schema tracks", () => {
    const scheduler = createFakeScheduler();
    const handle = new Engine({
      clock: createManualClock(),
      interpolator: createFakeInterpolator(),
      scheduler,
    }).load({
      schemaVersion: 5,
      motions: [{ id: "authored", trigger: { type: "manual" }, tracks: [{ id: "arm" }] }],
    });

    expect(() => handle.destroyMotion("authored")).toThrow(/authored tracks|still has/);
    handle.dispose();
  });

  it("rejects addMotion with pre-populated tracks instead of dropping them", () => {
    const { handle } = makeRuntime();
    expect(() => handle.addMotion({ ...motion("scene"), tracks: [{ id: "arm" }] })).toThrow(
      /empty|tracks/,
    );
    handle.dispose();
  });
});
