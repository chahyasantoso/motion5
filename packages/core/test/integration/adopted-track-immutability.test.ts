import { describe, expect, it } from "vitest";
import { Engine } from "../../src/engine";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/testing/fakes";
import type { AuthoredStop, TrackDefinition } from "../../src/contract/v5";

function makeHandle() {
  return new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
  }).load({ schemaVersion: 5, projectId: "immutability", motions: [] });
}

function ramp(from: number, to: number) {
  return [
    { p: 0, v: from },
    { p: 1, v: to },
  ];
}

describe("runtime track validation and immutability (W3)", () => {
  it("returns a deeply frozen runtime-owned definition", () => {
    const handle = makeHandle();
    const source: TrackDefinition = {
      id: "arm",
      keyframes: { transform: { values: { x: ramp(0, 100) } } },
    };

    const added = handle.addTrack(source);

    // Authored keyframes are plugin-named groups. Read the leaf through the group's values so the
    // freeze assertion reaches the stops array and each stop in it.
    const stops = added.definition.keyframes?.transform?.values?.x as
      | readonly AuthoredStop[]
      | undefined;
    expect(added.definition).not.toBe(source);
    expect(Object.isFrozen(added.definition)).toBe(true);
    expect(Object.isFrozen(added.definition.keyframes)).toBe(true);
    expect(Object.isFrozen(stops)).toBe(true);
    expect(Object.isFrozen(stops?.[0])).toBe(true);

    added.remove();
    handle.dispose();
  });

  it("isolates caller mutation from the frozen graph definition", () => {
    const handle = makeHandle();
    const source: TrackDefinition = {
      id: "arm",
      keyframes: { transform: { values: { x: ramp(0, 100) } } },
    };
    const added = handle.addTrack(source);

    // The caller-owned source remains mutable. The runtime-owned clone must not change with it.
    const stops = source.keyframes?.transform?.values?.x as readonly AuthoredStop[];
    (stops[1] as { p: number; v: unknown }).v = 999;

    handle.seek(added.id, 1);
    const idPatch = handle.get(added.id);
    if (idPatch?.status !== "ready")
      throw new Error(`idPatch is ${idPatch?.status ?? "absent"}, not ready.`);
    expect(idPatch.values).toEqual({ x: 100 });

    added.remove();
    handle.dispose();
  });

  it("uses the authored validation owner for malformed runtime track structure", () => {
    const handle = makeHandle();
    const malformed = {
      id: "broken",
      keyframes: { transform: { values: { x: ramp(0, 1) } } },
      observes: "not-an-array",
    } as unknown as TrackDefinition;

    expect(() => handle.addTrack(malformed)).toThrow(/observes-shape/);
    expect(() =>
      handle.addTrack({ id: "broken", keyframes: { transform: { values: { x: ramp(0, 1) } } } }),
    ).not.toThrow();

    handle.dispose();
  });

  it("keeps the existing same-source remove and re-add path working", () => {
    const handle = makeHandle();
    const source: TrackDefinition = {
      id: "arm",
      keyframes: { transform: { values: { x: ramp(0, 100) } } },
    };

    const first = handle.addTrack(source);
    first.remove();
    const second = handle.addTrack(source);

    expect(second.id).toBe(first.id);
    expect(second.definition).not.toBe(source);
    expect(Object.isFrozen(second.definition)).toBe(true);

    second.remove();
    handle.dispose();
  });
});
