import { describe, expect, it } from "vitest";
import { Engine } from "../../src/engine";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/ports/fakes";
import type { TrackDefinition } from "../../src/contract/v5";

function makeHandle() {
  return new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
  }).load({ schemaVersion: 5, projectId: "immutability", motions: [] });
}

function ramp(from: number, to: number) {
  return { stops: [{ p: 0, v: from }, { p: 1, v: to }] };
}

describe("adopted track validation and immutability (W3)", () => {
  it("returns a deeply frozen runtime-owned definition", () => {
    const handle = makeHandle();
    const owner = {};
    const source: TrackDefinition = {
      id: "arm",
      keyframes: { x: ramp(0, 100) },
    };

    const adopted = handle.adopt(source, owner);

    expect(adopted.track).not.toBe(source);
    expect(Object.isFrozen(adopted.track)).toBe(true);
    expect(Object.isFrozen(adopted.track.keyframes)).toBe(true);
    expect(Object.isFrozen(adopted.track.keyframes?.x)).toBe(true);
    expect(Object.isFrozen(adopted.track.keyframes?.x?.stops)).toBe(true);
    expect(Object.isFrozen(adopted.track.keyframes?.x?.stops[0])).toBe(true);

    handle.destroyAdopted(adopted.id, owner);
    handle.dispose();
  });

  it("isolates caller mutation from the frozen graph definition", () => {
    const handle = makeHandle();
    const owner = {};
    const source: TrackDefinition = {
      id: "arm",
      keyframes: { x: ramp(0, 100) },
    };
    const adopted = handle.adopt(source, owner);

    // The caller-owned source remains mutable. The runtime-owned clone must not change with it.
    (source.keyframes!.x!.stops[1] as { p: number; v: unknown }).v = 999;

    handle.seek(adopted.id, 1);
    expect(handle.get(adopted.id)?.values).toEqual({ x: 100 });

    handle.destroyAdopted(adopted.id, owner);
    handle.dispose();
  });

  it("uses the authored validation owner for malformed runtime track structure", () => {
    const handle = makeHandle();
    const owner = {};
    const malformed = {
      id: "broken",
      keyframes: { x: ramp(0, 1) },
      observes: "not-an-array",
    } as unknown as TrackDefinition;

    expect(() => handle.adopt(malformed, owner)).toThrow(/observes-shape/);
    expect(() => handle.adopt({ id: "broken", keyframes: { x: ramp(0, 1) } }, owner)).not.toThrow();

    handle.dispose();
  });

  it("keeps the existing same-source destroy and readopt path working", () => {
    const handle = makeHandle();
    const owner = {};
    const source: TrackDefinition = { id: "arm", keyframes: { x: ramp(0, 100) } };

    const first = handle.adopt(source, owner);
    handle.destroyAdopted(first.id, owner);
    const second = handle.adopt(source, owner);

    expect(second.id).toBe(first.id);
    expect(second.track).not.toBe(source);
    expect(Object.isFrozen(second.track)).toBe(true);

    handle.destroyAdopted(second.id, owner);
    handle.dispose();
  });
});
