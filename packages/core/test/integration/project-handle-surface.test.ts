import { describe, expect, it } from "vitest";
import { Engine } from "../../src/engine";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/ports/fakes";

const project = {
  schemaVersion: 5 as const,
  motions: [{ id: "hero", trigger: { type: "manual" as const }, tracks: [{ id: "arm" }] }],
};

describe("public project handle surface (P1-9)", () => {
  it("does not expose graph internals through Engine.load", () => {
    const runtime = new Engine({
      clock: createManualClock(),
      interpolator: createFakeInterpolator(),
      scheduler: createFakeScheduler(),
    }).load(project);

    expect((runtime as unknown as { graph?: unknown }).graph).toBeUndefined();
    expect((runtime as unknown as { binding?: unknown }).binding).toBeUndefined();
    expect((runtime as unknown as { registry?: unknown }).registry).toBeUndefined();
    expect((runtime as unknown as { publisher?: unknown }).publisher).toBeUndefined();
    expect(Object.keys(runtime)).toEqual([]);
    runtime.dispose();
  });

  it("keeps only lifecycle and observation operations on the consumer handle", () => {
    const runtime = new Engine({
      clock: createManualClock(),
      interpolator: createFakeInterpolator(),
      scheduler: createFakeScheduler(),
    }).load(project);
    const prototype = Object.getPrototypeOf(runtime) as object;
    const names = Object.getOwnPropertyNames(prototype).sort();

    expect(names).toEqual(["constructor", "dispose", "mount", "seek", "subscribe", "unmount"]);
    runtime.dispose();
  });
});
