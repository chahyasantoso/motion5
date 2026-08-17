import { describe, expect, it } from "vitest";
import { Engine } from "../../src/engine";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/ports/fakes";
import type { MotionDefinition, ProjectDefinition, TrackDefinition } from "../../src/contract/v5";

function ramp(from: number, to: number) {
  return {
    stops: [
      { p: 0, v: from },
      { p: 1, v: to },
    ],
  };
}
function track(
  id: string,
  from: number,
  to: number,
  observes?: TrackDefinition["observes"],
): TrackDefinition {
  return { id, keyframes: { x: ramp(from, to) }, ...(observes ? { observes } : {}) };
}
function makeHandle(project: ProjectDefinition = { schemaVersion: 5, motions: [] }) {
  return new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
  }).load(project);
}

describe("unified runtime mutation surface (W5)", () => {
  it("ingests authored tracks into the removable store without auto-mounting", () => {
    const handle = makeHandle({
      schemaVersion: 5,
      motions: [{ id: "scene", trigger: { type: "manual" }, tracks: [track("arm", 0, 100)] }],
      freeTracks: [track("free", 0, 50)],
    });
    expect(handle.get("scene/arm")).toBeUndefined();
    expect(() => handle.destroyMotion("scene")).toThrow(/still has/);
    const authored = handle.track("scene/arm");
    const free = handle.track("~/free");
    expect(authored.track.id).toBe("arm");
    expect(free.track.id).toBe("free");
    expect(() => handle.mount("scene/arm")).not.toThrow();
    expect(() => handle.mount("~/free")).not.toThrow();
    authored.remove();
    free.remove();
    expect(() => handle.destroyMotion("scene")).not.toThrow();
    handle.dispose();
  });
  it("returns a capability handle and makes stale ABA handles inert", () => {
    const handle = makeHandle();
    const first = handle.addTrack(track("arm", 0, 100));
    first.remove();
    const second = handle.addTrack(track("arm", 0, 200));
    first.remove();
    handle.seek(second.id, 1);
    expect(handle.get(second.id)?.values).toEqual({ x: 200 });
    second.remove();
    handle.dispose();
  });
  it("replaces a track non-destructively and preserves subscriber identity", () => {
    const handle = makeHandle();
    const handleForTrack = handle.addTrack(track("arm", 0, 100));
    const seen: string[] = [];
    handle.subscribe(handleForTrack.id, (patch) => seen.push(patch.status));
    handle.seek(handleForTrack.id, 1);
    const beforeRevision = handle.get(handleForTrack.id)?.revision ?? 0;
    handleForTrack.replace(track("arm", 0, 250));
    handle.seek(handleForTrack.id, 1);
    expect(handle.get(handleForTrack.id)?.values).toEqual({ x: 250 });
    expect(handle.get(handleForTrack.id)?.revision).toBeGreaterThan(beforeRevision);
    expect(seen).not.toContain("destroyed");
    handleForTrack.remove();
    handle.dispose();
  });
  it("reads dependants from the committed graph and rejects source removal", () => {
    const handle = makeHandle();
    const root = handle.addTrack(track("root", 0, 100));
    const child = handle.addTrack(
      track("child", 0, 50, [
        { source: "~/root", role: "input", projection: { map: { x: "parentX" } } },
      ]),
    );
    expect(handle.dependantsOf(root.id)).toEqual([child.id]);
    expect(() => root.remove()).toThrow(/depend|unknown-source/);
    expect(handle.dependantsOf(root.id)).toEqual([child.id]);
    child.remove();
    root.remove();
    handle.dispose();
  });
  it("treats observation changes as replacement of the observer track", () => {
    const handle = makeHandle();
    const root = handle.addTrack(track("root", 0, 100));
    const child = handle.addTrack(track("child", 0, 50));
    const observation = {
      source: root.id,
      role: "input" as const,
      projection: { map: { x: "parentX" } },
    };
    child.addObserve(observation);
    expect(handle.dependantsOf(root.id)).toEqual([child.id]);
    child.removeObserve(observation);
    expect(handle.dependantsOf(root.id)).toEqual([]);
    child.remove();
    root.remove();
    handle.dispose();
  });
});
