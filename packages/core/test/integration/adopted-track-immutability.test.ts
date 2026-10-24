import { describe, expect, it } from "vitest";
import { Engine } from "../../src/engine";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/testing/fakes";
import type {
  AuthoredCell,
  AuthoredRow,
  AuthoredStop,
  AuthoredValues,
  TrackDefinition,
} from "../../src/contract/v5";

function isTableValues(value: AuthoredValues): value is readonly AuthoredRow[] {
  return Array.isArray(value);
}

function recordOf(track: TrackDefinition): Readonly<Record<string, AuthoredCell>> {
  const values = track.input?.values;
  if (values === undefined || isTableValues(values)) throw new Error("Expected record values.");
  return values;
}

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
      input: { values: { x: ramp(0, 100) } },
    };

    const added = handle.addTrack(source);

    // Authored values are a record of stops. Read the leaf so the freeze assertion reaches the
    // stops array and each stop in it.
    const stops = recordOf(added.definition).x as readonly AuthoredStop[] | undefined;
    expect(added.definition).not.toBe(source);
    expect(Object.isFrozen(added.definition)).toBe(true);
    expect(Object.isFrozen(added.definition.input?.values)).toBe(true);
    expect(Object.isFrozen(stops)).toBe(true);
    expect(Object.isFrozen(stops?.[0])).toBe(true);

    added.remove();
    handle.dispose();
  });

  it("isolates caller mutation from the frozen graph definition", () => {
    const handle = makeHandle();
    const source: TrackDefinition = {
      id: "arm",
      input: { values: { x: ramp(0, 100) } },
    };
    const added = handle.addTrack(source);

    // The caller-owned source remains mutable. The runtime-owned clone must not change with it.
    const stops = recordOf(source).x as readonly AuthoredStop[];
    (stops[1] as { p: number; v: unknown }).v = 999;

    handle.seek(added.id, 1);
    const idPatch = handle.get(added.id);
    if (idPatch?.status !== "ready")
      throw new Error(`idPatch is ${idPatch?.status ?? "absent"}, not ready.`);
    expect(idPatch.outputs.values).toEqual({ x: 100 });

    added.remove();
    handle.dispose();
  });

  it("uses the authored validation owner for malformed runtime track structure", () => {
    const handle = makeHandle();
    const malformed = {
      id: "broken",
      input: { values: { x: ramp(0, 1) } },
      observes: "not-an-array",
    } as unknown as TrackDefinition;

    expect(() => handle.addTrack(malformed)).toThrow(/track-legacy-field/);
    expect(() =>
      handle.addTrack({ id: "broken", input: { values: { x: ramp(0, 1) } } }),
    ).not.toThrow();

    handle.dispose();
  });

  it("keeps the existing same-source remove and re-add path working", () => {
    const handle = makeHandle();
    const source: TrackDefinition = {
      id: "arm",
      input: { values: { x: ramp(0, 100) } },
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
