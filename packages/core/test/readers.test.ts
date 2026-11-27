import { describe, expect, it } from "vitest";
import {
  UNTIMED,
  createStore,
  easeTo,
  inputLog,
  inputs,
  liveAt,
  pageInputs,
  springTo,
  transition,
  triggers,
  value,
  valueAt,
  watchInputs,
  withProbeStore,
  withStore,
  type InputChannel,
} from "@gerak/core";

const sceneInputs = inputs({
  values: {
    level: { targets: ["a", "b"] },
    sealed: {},
  },
  triggers: {
    hit: { targets: ["a", "b"] },
    pulse: {},
  },
});

describe("core input readers", () => {
  it("value starts at 0, reads target-filtered values, and feeds springTo, easeTo, and transition", () => {
    const a = value(sceneInputs, "level", "a");
    const b = value(sceneInputs, "level", "b");
    const sealed = value(sceneInputs, "sealed");
    expect(a.start).toBe(0);

    const log = inputLog();
    expect(a(liveAt(0), log.input)).toBe(0);
    log.set(100, sceneInputs, "level", 5, "a");
    log.set(150, sceneInputs, "level", 9, "b");
    log.set(200, sceneInputs, "sealed", 1);

    expect(a(liveAt(99), log.input)).toBe(0);
    expect(a(liveAt(200), log.input)).toBe(5);
    expect(b(liveAt(200), log.input)).toBe(9);
    expect(sealed(liveAt(200), log.input)).toBe(1);

    const spring = springTo(a, (v) => v);
    const eased = easeTo(a, (v) => v, { ms: 100 });
    const trans = transition(sealed, { ms: 200 });
    expect(spring(liveAt(5000), log.input)).toBe(5);
    expect(eased(liveAt(150), log.input)).toBeCloseTo(2.5, 9);
    expect(trans(liveAt(300), log.input)).toEqual({
      current: 1,
      previous: 0,
      progress: 0.5,
      active: true,
    });
  });

  it("value notifies scroll, pointer, and events channels appropriately", () => {
    const channels = (run: () => void): InputChannel[] => {
      const seen: InputChannel[] = [];
      watchInputs((ch) => seen.push(ch), run);
      return seen;
    };
    expect(channels(() => value(pageInputs, "scroll")(liveAt(0), []))).toEqual(["scroll"]);
    expect(channels(() => value(pageInputs, "pointer-x")(liveAt(0), []))).toEqual(["pointer"]);
    expect(channels(() => value(pageInputs, "pointer-y")(liveAt(0), []))).toEqual(["pointer"]);
    expect(channels(() => value(pageInputs, "hovered", "card")(liveAt(0), []))).toEqual(["events"]);
    expect(channels(() => value(sceneInputs, "sealed")(liveAt(0), []))).toEqual(["events"]);
  });

  it("triggers returns retained triggers with at <= now in arrival order including other and point", () => {
    const log = inputLog();
    log.add({
      kind: "trigger",
      name: "hit",
      at: 200,
      value: 2,
      target: "a",
      other: "wall",
      point: { x: 12, y: 34, z: 5 },
    });
    log.trigger(100, sceneInputs, "hit", 3, "a");
    log.trigger(150, sceneInputs, "hit", 4, "b");
    log.trigger(300, sceneInputs, "hit", 5, "a");

    const hitA = triggers(sceneInputs, "hit", "a");
    const early = hitA(liveAt(150), log.input);
    expect(early.map((t) => ({ at: t.at, value: t.value, serial: t.serial }))).toEqual([
      { at: 100, value: 3, serial: 2 },
    ]);

    const mid = hitA(liveAt(200), log.input);
    expect(mid).toEqual([
      {
        at: 200,
        value: 2,
        target: "a",
        serial: 1,
        other: "wall",
        point: { x: 12, y: 34, z: 5 },
      },
      { at: 100, value: 3, target: "a", serial: 2 },
    ]);
    // Returning to a larger input does not mutate earlier snapshots.
    expect(early).toHaveLength(1);

    const allUntimed = hitA({ progress: 0, clock: UNTIMED }, log.input);
    expect(allUntimed.map((t) => t.at)).toEqual([200, 100, 300]);
  });

  it("triggers isolates probe stores and refolds cleanly when inputLog drops aged entries", () => {
    const store = createStore();
    const log = inputLog({ windowMs: 1000 });
    const pulses = triggers(sceneInputs, "pulse");

    withStore(store, () => {
      log.trigger(0, sceneInputs, "pulse", 1);
      log.trigger(500, sceneInputs, "pulse", 2);
      expect(pulses(liveAt(500), log.input).map((t) => t.serial)).toEqual([1, 2]);

      const probed = withProbeStore(() => pulses(liveAt(0), log.input).map((t) => t.serial));
      expect(probed).toEqual([1]);
      // Parent store cursor and snapshot are undisturbed by probe.
      expect(pulses(liveAt(500), log.input).map((t) => t.serial)).toEqual([1, 2]);

      log.trigger(3000, sceneInputs, "pulse", 3);
      expect(pulses(liveAt(3000), log.input).map((t) => t.serial)).toEqual([3]);
    });
  });

  it("valueAt returns 0 before any set and isolates targets", () => {
    const log = inputLog();
    log.trigger(100, sceneInputs, "hit", 1, "a");
    log.set(100, sceneInputs, "level", 4, "b");
    const [hit] = triggers(sceneInputs, "hit", "a")(liveAt(100), log.input);
    expect(hit).toBeDefined();
    if (hit !== undefined) {
      expect(valueAt(sceneInputs, "level", hit, "a")(liveAt(100), log.input)).toBe(0);
      expect(valueAt(sceneInputs, "level", hit, "b")(liveAt(100), log.input)).toBe(0);
    }
  });
});
