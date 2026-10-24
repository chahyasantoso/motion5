import { describe, expect, it } from "vitest";
import type { ProjectDefinition, TrackDefinition } from "@motion5/core";
import { Engine, type ProjectHandle } from "@motion5/core";
import { createManualClock } from "@motion5/core";
import { createFakeInterpolator, createFakeScheduler } from "@motion5/core/testing";
import { record } from "../../../core/test/support/v5-builders";

/**
 * Issue #176. A refused replacement must leave the live compiled Track, the graph and the retained
 * definition exactly where they were, and must stay retryable. The plan validates the candidate
 * before any staging, so these cases now also prove that a refusal never reaches a hook.
 */

const NODE_ID = "scene/arm";

function ramp(from: number, to: number) {
  return [
    { p: 0, v: from },
    { p: 1, v: to },
  ];
}
function armTrack(from: number, to: number): TrackDefinition {
  return { id: "arm", input: { values: record({ x: ramp(from, to) }) } };
}
/** Refused because the plugin id names nothing the engine admits. */
const UNRESOLVABLE: TrackDefinition = {
  id: "arm",
  plugin: "nope",
  input: { values: record({ x: ramp(0, 250) }) },
};
/** Refused by the owning Motion after the compiled replacement has already succeeded. */
const REFUSED_BY_MOTION: TrackDefinition = {
  id: "arm",
  duration: 0,
  input: { values: record({ x: ramp(0, 400) }) },
};

function load(): ProjectHandle {
  const project: ProjectDefinition = {
    schemaVersion: 5,
    projectId: "replace-transactionality",
    motions: [{ id: "scene", trigger: { type: "manual" }, tracks: [armTrack(0, 100)] }],
  };
  const handle = new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
  }).load(project);
  handle.mount(NODE_ID);
  return handle;
}
function valuesAfterSeek(handle: ProjectHandle, progress: number): unknown {
  const batch = handle.seek(NODE_ID, progress);
  expect(batch.patches.some(({ status }) => status === "error")).toBe(false);
  const patch = handle.get(NODE_ID);
  return patch?.status === "ready" ? patch.outputs.values : undefined;
}
function thrownBy(operation: () => unknown): unknown {
  try {
    operation();
  } catch (error) {
    return error;
  }
  throw new Error("Expected the operation to throw.");
}

describe("a refused Track replacement commits nothing", () => {
  it("U-1 keeps the live compiled Track when the recompile is refused", () => {
    const handle = load();
    try {
      const thrown = thrownBy(() => handle.track(NODE_ID).replace(UNRESOLVABLE));

      expect((thrown as Error).message).toMatch(/^plugin-unknown at /);
      expect(valuesAfterSeek(handle, 0.5)).toEqual({ x: 50 });
      expect(handle.track(NODE_ID).definition).toEqual(armTrack(0, 100));
    } finally {
      handle.dispose();
    }
  });

  it("U-2 leaves a refused recompile retryable rather than stranding the node", () => {
    const handle = load();
    try {
      expect(() => handle.track(NODE_ID).replace(UNRESOLVABLE)).toThrow(/plugin-unknown/);
      handle.track(NODE_ID).replace(armTrack(0, 200));

      expect(valuesAfterSeek(handle, 0.5)).toEqual({ x: 100 });
      expect(handle.track(NODE_ID).definition).toEqual(armTrack(0, 200));
    } finally {
      handle.dispose();
    }
  });

  it("U-3 changes nothing when the owning Motion refuses the replacement", () => {
    const handle = load();
    try {
      const thrown = thrownBy(() => handle.track(NODE_ID).replace(REFUSED_BY_MOTION));

      expect((thrown as Error).message).toMatch(/must be a finite positive number/);
      expect(handle.track(NODE_ID).definition).toEqual(armTrack(0, 100));
      expect(valuesAfterSeek(handle, 0.5)).toEqual({ x: 50 });
    } finally {
      handle.dispose();
    }
  });
});
